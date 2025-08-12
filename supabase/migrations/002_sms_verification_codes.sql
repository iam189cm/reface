-- 创建短信验证码表
CREATE TABLE IF NOT EXISTS sms_verification_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone VARCHAR(20) NOT NULL UNIQUE,
  code VARCHAR(10) NOT NULL,
  attempts INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_sms_phone ON sms_verification_codes(phone);
CREATE INDEX IF NOT EXISTS idx_sms_expires_at ON sms_verification_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_sms_created_at ON sms_verification_codes(created_at);

-- 启用行级安全
ALTER TABLE sms_verification_codes ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许所有人插入和读取（短信服务需要）
CREATE POLICY "允许插入验证码" ON sms_verification_codes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "允许读取验证码" ON sms_verification_codes
  FOR SELECT USING (true);

CREATE POLICY "允许更新验证码" ON sms_verification_codes
  FOR UPDATE USING (true);

-- 自动清理过期验证码的函数
CREATE OR REPLACE FUNCTION cleanup_expired_sms_codes()
RETURNS void AS $$
BEGIN
  DELETE FROM sms_verification_codes 
  WHERE expires_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;

-- 创建定时任务清理过期验证码（如果支持）
-- SELECT cron.schedule('cleanup-sms-codes', '0 */6 * * *', 'SELECT cleanup_expired_sms_codes();');
