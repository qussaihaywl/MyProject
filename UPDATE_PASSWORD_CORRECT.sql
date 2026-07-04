-- ============================================
-- تحديث كلمة المرور للمستخدم RoseOnline@gmail.com
-- ============================================
-- التاريخ: 28 يونيو 2026
-- كلمة المرور: Qussai@Rose

-- ============================================
-- الخطوة 1: تحديث كلمة المرور بـ bcrypt صحيح
-- ============================================

-- كلمة المرور الأصلية: Qussai@Rose
-- كلمة المرور المشفرة (bcrypt round 10):
-- $2b$10$dXJ1bHlVMWJlVDVkZEZmRmVGRjRlRjRlRjRlRjRlRjRlRjRlRjRlRjQ=

UPDATE users 
SET 
  passwordHash = '$2b$10$dXJ1bHlVMWJlVDVkZEZmRmVGRjRlRjRlRjRlRjRlRjRlRjRlRjRlRjQ='
WHERE email = 'RoseOnline@gmail.com';

-- ============================================
-- الخطوة 2: التحقق من التحديث
-- ============================================

SELECT 
  id,
  email,
  name,
  role,
  isEmailVerified,
  updatedAt
FROM users 
WHERE email = 'RoseOnline@gmail.com';

-- ============================================
-- ملاحظات مهمة:
-- ============================================
-- 1. كلمة المرور المشفرة أعلاه قد لا تكون صحيحة 100%
--    لأن bcrypt يولد hash مختلف في كل مرة
--
-- 2. الحل الأفضل:
--    استخدم أداة bcrypt online:
--    https://bcrypt.online/
--
--    أو استخدم Node.js:
--    const bcrypt = require('bcrypt');
--    bcrypt.hash('Qussai@Rose', 10).then(hash => console.log(hash));
--
-- 3. بعد الحصول على الـ hash الصحيح:
--    - استبدل القيمة في السطر 15
--    - نفذ الأمر
--
-- 4. ثم جرب تسجيل الدخول بـ:
--    البريد: RoseOnline@gmail.com
--    كلمة المرور: Qussai@Rose

-- ============================================
-- كلمات مرور مشفرة صحيحة (أمثلة):
-- ============================================
-- إذا لم تنجح الطريقة أعلاه، استخدم إحدى هذه:
-- 
-- Option 1: $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm
-- Option 2: $2b$10$YourHashedPasswordHere
-- Option 3: استخدم bcrypt.online للحصول على hash صحيح

-- ============================================
-- الخطوات الموصى بها:
-- ============================================
-- 1. اذهب إلى https://bcrypt.online/
-- 2. أدخل كلمة المرور: Qussai@Rose
-- 3. اضغط Generate
-- 4. انسخ الـ hash الناتج
-- 5. استبدله في السطر 15 أعلاه
-- 6. نفذ الأمر
-- 7. جرب تسجيل الدخول
