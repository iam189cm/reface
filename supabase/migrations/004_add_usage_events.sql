-- 添加使用事件记录表
-- 用于跟踪所有AI服务的使用情况，支持审计和统计

-- 创建使用事件表
CREATE TABLE IF NOT EXISTS usage_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL, -- 'remove_background', 'enlarge_image', etc.
  action TEXT NOT NULL, -- 'consume', 'refund', 'bonus'
  credits_consumed INTEGER DEFAULT 1,
  credits_remaining INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}', -- 额外信息：图片尺寸、处理参数等
  ip_address INET,
  user_agent TEXT,
  status TEXT DEFAULT 'completed', -- 'pending', 'completed', 'failed'
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引优化查询性能
CREATE INDEX IF NOT EXISTS idx_usage_events_user_id ON usage_events(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_events_service_type ON usage_events(service_type);
CREATE INDEX IF NOT EXISTS idx_usage_events_created_at ON usage_events(created_at);
CREATE INDEX IF NOT EXISTS idx_usage_events_status ON usage_events(status);
CREATE INDEX IF NOT EXISTS idx_usage_events_user_service ON usage_events(user_id, service_type);
CREATE INDEX IF NOT EXISTS idx_usage_events_user_date ON usage_events(user_id, created_at);

-- 启用行级安全
ALTER TABLE usage_events ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略
CREATE POLICY "Users can view own usage events" ON usage_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service can insert usage events" ON usage_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 管理员可以查看所有记录（通过service_role）
CREATE POLICY "Admins can view all usage events" ON usage_events
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'service_role' OR
    (
      auth.uid() IS NOT NULL AND 
      EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND user_type = 'ADMIN'
      )
    )
  );

-- 添加触发器自动更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_usage_events_updated_at 
  BEFORE UPDATE ON usage_events 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 创建清理旧数据的函数（保留6个月数据）
CREATE OR REPLACE FUNCTION cleanup_old_usage_events()
RETURNS void AS $$
BEGIN
  DELETE FROM usage_events 
  WHERE created_at < NOW() - INTERVAL '6 months'
  AND status = 'completed';
  
  RAISE NOTICE 'Cleaned up old usage events older than 6 months';
END;
$$ LANGUAGE plpgsql;

-- 创建使用统计视图（用于管理员查看）
CREATE OR REPLACE VIEW usage_statistics AS
SELECT 
  service_type,
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as total_events,
  COUNT(DISTINCT user_id) as unique_users,
  SUM(credits_consumed) as total_credits,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as successful_events,
  COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_events
FROM usage_events
GROUP BY service_type, DATE_TRUNC('day', created_at)
ORDER BY date DESC, service_type;

-- 创建用户使用统计视图
CREATE OR REPLACE VIEW user_usage_summary AS
SELECT 
  up.id as user_id,
  up.user_type,
  up.credits_used as total_credits_consumed,
  up.total_quota,
  up.daily_quota,
  COUNT(ue.id) as total_events,
  COUNT(CASE WHEN ue.created_at >= CURRENT_DATE THEN 1 END) as today_events,
  MAX(ue.created_at) as last_usage,
  STRING_AGG(DISTINCT ue.service_type, ', ') as used_services
FROM user_profiles up
LEFT JOIN usage_events ue ON up.id = ue.user_id
GROUP BY up.id, up.user_type, up.credits_used, up.total_quota, up.daily_quota;

COMMENT ON TABLE usage_events IS '用户使用事件记录表，追踪所有AI服务的使用情况';
COMMENT ON COLUMN usage_events.service_type IS 'AI服务类型：remove_background, enlarge_image等';
COMMENT ON COLUMN usage_events.action IS '操作类型：consume(消费), refund(退款), bonus(奖励)';
COMMENT ON COLUMN usage_events.metadata IS '附加信息JSON：图片尺寸、处理参数、结果信息等';
COMMENT ON VIEW usage_statistics IS '使用统计视图，按服务类型和日期聚合统计数据';
COMMENT ON VIEW user_usage_summary IS '用户使用汇总视图，展示每个用户的使用情况';
