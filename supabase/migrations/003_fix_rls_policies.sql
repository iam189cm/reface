-- 修复RLS策略无限递归问题
-- 执行此脚本来修复user_profiles表的策略问题

-- 1. 删除有问题的管理员策略
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;

-- 2. 重新创建正确的RLS策略
-- 允许用户查看自己的配置
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile" ON user_profiles 
    FOR SELECT USING (auth.uid() = id);

-- 允许用户更新自己的配置  
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile" ON user_profiles 
    FOR UPDATE USING (auth.uid() = id);

-- 允许用户插入自己的配置
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile" ON user_profiles 
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 3. 如果需要管理员访问，使用service_role而不是RLS策略
-- 管理员操作应该使用service_role_key，不通过RLS

-- 4. 确保SMS验证码表的策略也没有问题
DROP POLICY IF EXISTS "允许所有操作" ON sms_verification_codes;
CREATE POLICY "Allow all operations for SMS" ON sms_verification_codes
    FOR ALL USING (true);

-- 5. 验证当前策略状态
-- 可以通过以下查询检查策略：
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
-- FROM pg_policies WHERE tablename = 'user_profiles';
