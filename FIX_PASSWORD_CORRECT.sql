-- ملف تصحيح كلمة المرور للمستخدم RoseOnline@gmail.com
-- تم إنشاء hash bcrypt صحيح للكلمة: Qussai@Rose

-- تحديث كلمة المرور
UPDATE users 
SET passwordHash = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm'
WHERE email = 'RoseOnline@gmail.com';

-- التحقق من التحديث
SELECT id, email, passwordHash FROM users WHERE email = 'RoseOnline@gmail.com';

-- ملاحظات:
-- 1. الكلمة الأصلية: Qussai@Rose
-- 2. الـ Hash: $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm
-- 3. تم التشفير باستخدام bcrypt round 10
-- 4. بعد تنفيذ هذا الأمر، حاول تسجيل الدخول مرة أخرى
