-- 添加配额消费函数
-- 安全地消费用户配额并记录使用事件

-- 创建配额消费函数
CREATE OR REPLACE FUNCTION consume_user_credits(
  user_id UUID,
  credit_amount INTEGER,
  service_type TEXT,
  metadata JSONB DEFAULT '{}',
  ip_address INET DEFAULT NULL,
  user_agent TEXT DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
  user_profile RECORD;
  remaining_credits INTEGER;
  event_id UUID;
  result JSONB;
BEGIN
  -- 参数验证
  IF user_id IS NULL OR credit_amount IS NULL OR credit_amount <= 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Invalid parameters: user_id and credit_amount are required and credit_amount must be positive',
      'error_code', 'INVALID_PARAMS'
    );
  END IF;

  IF service_type IS NULL OR LENGTH(service_type) = 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'service_type is required',
      'error_code', 'INVALID_PARAMS'
    );
  END IF;

  -- 获取用户资料（使用FOR UPDATE锁定行，防止并发问题）
  SELECT * INTO user_profile 
  FROM user_profiles 
  WHERE id = user_id 
  FOR UPDATE;

  -- 检查用户是否存在
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'User not found',
      'error_code', 'USER_NOT_FOUND'
    );
  END IF;

  -- 检查用户是否被封禁
  IF user_profile.user_type = 'BANNED' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'User account is banned',
      'error_code', 'USER_BANNED'
    );
  END IF;

  -- 计算剩余配额
  remaining_credits := user_profile.total_quota - user_profile.credits_used;

  -- 检查配额是否足够
  IF remaining_credits < credit_amount THEN
    -- 记录失败事件
    INSERT INTO usage_events (
      user_id, service_type, action, credits_consumed, 
      credits_remaining, metadata, ip_address, user_agent, 
      status, error_message
    ) VALUES (
      user_id, service_type, 'consume', credit_amount,
      remaining_credits, metadata, ip_address, user_agent,
      'failed', 'Insufficient credits'
    ) RETURNING id INTO event_id;

    RETURN jsonb_build_object(
      'success', false,
      'error', 'Insufficient credits',
      'error_code', 'INSUFFICIENT_CREDITS',
      'required_credits', credit_amount,
      'available_credits', remaining_credits,
      'event_id', event_id
    );
  END IF;

  -- 消费配额（更新用户资料）
  UPDATE user_profiles 
  SET 
    credits_used = credits_used + credit_amount,
    updated_at = NOW()
  WHERE id = user_id;

  -- 重新计算剩余配额
  remaining_credits := remaining_credits - credit_amount;

  -- 记录成功事件
  INSERT INTO usage_events (
    user_id, service_type, action, credits_consumed, 
    credits_remaining, metadata, ip_address, user_agent,
    status
  ) VALUES (
    user_id, service_type, 'consume', credit_amount,
    remaining_credits, metadata, ip_address, user_agent,
    'completed'
  ) RETURNING id INTO event_id;

  -- 构建成功响应
  result := jsonb_build_object(
    'success', true,
    'credits_consumed', credit_amount,
    'remaining_credits', remaining_credits,
    'user_type', user_profile.user_type,
    'event_id', event_id
  );

  -- 如果配额即将用完，添加警告
  IF remaining_credits <= 1 THEN
    result := result || jsonb_build_object(
      'warning', 'Low credits remaining',
      'warning_code', 'LOW_CREDITS'
    );
  END IF;

  RETURN result;

EXCEPTION
  WHEN OTHERS THEN
    -- 记录异常事件
    BEGIN
      INSERT INTO usage_events (
        user_id, service_type, action, credits_consumed, 
        credits_remaining, metadata, ip_address, user_agent,
        status, error_message
      ) VALUES (
        user_id, service_type, 'consume', credit_amount,
        0, metadata, ip_address, user_agent,
        'failed', SQLERRM
      );
    EXCEPTION
      WHEN OTHERS THEN
        -- 忽略记录事件时的错误
        NULL;
    END;

    RETURN jsonb_build_object(
      'success', false,
      'error', 'Internal server error',
      'error_code', 'INTERNAL_ERROR',
      'details', SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建配额退还函数
CREATE OR REPLACE FUNCTION refund_user_credits(
  user_id UUID,
  credit_amount INTEGER,
  service_type TEXT,
  reason TEXT DEFAULT 'Service failure',
  metadata JSONB DEFAULT '{}'
) RETURNS JSONB AS $$
DECLARE
  user_profile RECORD;
  remaining_credits INTEGER;
  event_id UUID;
BEGIN
  -- 参数验证
  IF user_id IS NULL OR credit_amount IS NULL OR credit_amount <= 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Invalid parameters',
      'error_code', 'INVALID_PARAMS'
    );
  END IF;

  -- 获取用户资料
  SELECT * INTO user_profile 
  FROM user_profiles 
  WHERE id = user_id 
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'User not found',
      'error_code', 'USER_NOT_FOUND'
    );
  END IF;

  -- 退还配额（但不能超过总配额）
  UPDATE user_profiles 
  SET 
    credits_used = GREATEST(0, credits_used - credit_amount),
    updated_at = NOW()
  WHERE id = user_id;

  -- 计算剩余配额
  remaining_credits := user_profile.total_quota - GREATEST(0, user_profile.credits_used - credit_amount);

  -- 记录退还事件
  INSERT INTO usage_events (
    user_id, service_type, action, credits_consumed, 
    credits_remaining, metadata, status, error_message
  ) VALUES (
    user_id, service_type, 'refund', credit_amount,
    remaining_credits, 
    metadata || jsonb_build_object('reason', reason),
    'completed', reason
  ) RETURNING id INTO event_id;

  RETURN jsonb_build_object(
    'success', true,
    'credits_refunded', credit_amount,
    'remaining_credits', remaining_credits,
    'event_id', event_id,
    'reason', reason
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Internal server error',
      'error_code', 'INTERNAL_ERROR',
      'details', SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建配额检查函数（不消费，只检查）
CREATE OR REPLACE FUNCTION check_user_credits(
  user_id UUID,
  required_credits INTEGER DEFAULT 1
) RETURNS JSONB AS $$
DECLARE
  user_profile RECORD;
  remaining_credits INTEGER;
BEGIN
  -- 获取用户资料
  SELECT * INTO user_profile 
  FROM user_profiles 
  WHERE id = user_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'User not found',
      'error_code', 'USER_NOT_FOUND'
    );
  END IF;

  -- 检查用户状态
  IF user_profile.user_type = 'BANNED' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'User account is banned',
      'error_code', 'USER_BANNED'
    );
  END IF;

  -- 计算剩余配额
  remaining_credits := user_profile.total_quota - user_profile.credits_used;

  RETURN jsonb_build_object(
    'success', true,
    'user_type', user_profile.user_type,
    'total_quota', user_profile.total_quota,
    'credits_used', user_profile.credits_used,
    'remaining_credits', remaining_credits,
    'has_enough_credits', remaining_credits >= required_credits
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建管理员增加配额函数
CREATE OR REPLACE FUNCTION admin_add_credits(
  target_user_id UUID,
  credit_amount INTEGER,
  reason TEXT DEFAULT 'Admin bonus',
  admin_user_id UUID DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
  user_profile RECORD;
  remaining_credits INTEGER;
  event_id UUID;
BEGIN
  -- 参数验证
  IF target_user_id IS NULL OR credit_amount IS NULL OR credit_amount <= 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Invalid parameters',
      'error_code', 'INVALID_PARAMS'
    );
  END IF;

  -- 获取目标用户资料
  SELECT * INTO user_profile 
  FROM user_profiles 
  WHERE id = target_user_id 
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'User not found',
      'error_code', 'USER_NOT_FOUND'
    );
  END IF;

  -- 增加总配额
  UPDATE user_profiles 
  SET 
    total_quota = total_quota + credit_amount,
    updated_at = NOW()
  WHERE id = target_user_id;

  -- 计算剩余配额
  remaining_credits := (user_profile.total_quota + credit_amount) - user_profile.credits_used;

  -- 记录奖励事件
  INSERT INTO usage_events (
    user_id, service_type, action, credits_consumed, 
    credits_remaining, metadata, status, error_message
  ) VALUES (
    target_user_id, 'admin_action', 'bonus', credit_amount,
    remaining_credits,
    jsonb_build_object(
      'reason', reason,
      'admin_user_id', admin_user_id,
      'previous_quota', user_profile.total_quota,
      'new_quota', user_profile.total_quota + credit_amount
    ),
    'completed', reason
  ) RETURNING id INTO event_id;

  RETURN jsonb_build_object(
    'success', true,
    'credits_added', credit_amount,
    'new_total_quota', user_profile.total_quota + credit_amount,
    'remaining_credits', remaining_credits,
    'event_id', event_id,
    'reason', reason
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Internal server error',
      'error_code', 'INTERNAL_ERROR',
      'details', SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 设置函数权限
GRANT EXECUTE ON FUNCTION consume_user_credits TO authenticated;
GRANT EXECUTE ON FUNCTION refund_user_credits TO service_role;
GRANT EXECUTE ON FUNCTION check_user_credits TO authenticated;
GRANT EXECUTE ON FUNCTION admin_add_credits TO service_role;

-- 添加注释
COMMENT ON FUNCTION consume_user_credits IS '安全地消费用户配额并记录使用事件，支持并发控制';
COMMENT ON FUNCTION refund_user_credits IS '退还用户配额，用于服务失败等情况';
COMMENT ON FUNCTION check_user_credits IS '检查用户配额状态，不消费配额';
COMMENT ON FUNCTION admin_add_credits IS '管理员增加用户配额，用于奖励或补偿';
