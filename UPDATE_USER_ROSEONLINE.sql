-- ============================================
-- تعديل حالة المستخدم RoseOnline@gmail.com
-- ============================================
-- التاريخ: 28 يونيو 2026
-- الحالة: جاهز للتنفيذ

-- ============================================
-- الخطوة 1: تحديث بيانات المستخدم
-- ============================================
-- تغيير الدور إلى Admin
-- تفعيل البريد الإلكتروني
-- تحديث كلمة المرور (مشفرة بـ bcrypt)

UPDATE users 
SET 
  role = 'admin',
  isEmailVerified = 1,
  passwordHash = '$2b$10$YourHashedPasswordHere'
WHERE email = 'RoseOnline@gmail.com';

-- ============================================
-- التحقق من التحديث
-- ============================================
SELECT 
  id,
  email,
  name,
  phone,
  role,
  isEmailVerified,
  createdAt,
  updatedAt
FROM users 
WHERE email = 'RoseOnline@gmail.com';

-- ============================================
-- ملاحظات مهمة:
-- ============================================
-- 1. كلمة المرور المشفرة:
--    - الكلمة الأصلية: Qussai@Rose
--    - الكلمة المشفرة (bcrypt round 10):
--      $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm
--
-- 2. لتشفير كلمة مرور جديدة، استخدم:
--    - Node.js: bcrypt.hash('password', 10)
--    - Online: https://bcrypt.online/
--
-- 3. الدور الجديد: admin (مسؤول النظام)
--
-- 4. حالة البريد: مفعل (يمكنه تسجيل الدخول مباشرة)

-- ============================================
-- خطوات التنفيذ:
-- ============================================
-- 1. انسخ الكود أعلاه
-- 2. الصق في phpMyAdmin أو أداة MySQL الخاصة بك
-- 3. استبدل $2b$10$YourHashedPasswordHere بكلمة المرور المشفرة
-- 4. انقر على Execute
-- 5. تحقق من النتائج في الجزء السفلي

-- ============================================
-- كلمة المرور المشفرة النهائية:
-- ============================================
-- استخدم هذا الأمر في Node.js لتشفير كلمة المرور:
-- const bcrypt = require('bcrypt');
-- const password = 'Qussai@Rose';
-- const hashedPassword = await bcrypt.hash(password, 10);
-- console.log(hashedPassword);

-- النتيجة المتوقعة:
-- $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm
