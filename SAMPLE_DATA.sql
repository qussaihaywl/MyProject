-- ============================================
-- Rose Online - Sample Data Import
-- ============================================

-- ============================================
-- 1. إدراج الفئات (Categories)
-- ============================================

INSERT INTO categories (name, description, icon, createdAt, updatedAt) VALUES
('الملابس', 'ملابس نسائية وأثاث', '👗', NOW(), NOW()),
('الأثاث', 'أثاث منزلي وديكور', '🛋️', NOW(), NOW()),
('الإكسسوارات', 'مجوهرات وإكسسوارات', '💍', NOW(), NOW()),
('الأحذية', 'أحذية نسائية', '👠', NOW(), NOW()),
('الحقائب', 'حقائب وشنط', '👜', NOW(), NOW());

-- ============================================
-- 2. إدراج المستودعات (Warehouses)
-- ============================================

INSERT INTO warehouses (code, name, location, city, state, capacity, currentStock, createdAt, updatedAt) VALUES
('WH001', 'المستودع الرئيسي', 'الرياض', 'الرياض', 'نشط', 10000, 5000, NOW(), NOW()),
('WH002', 'مستودع جدة', 'جدة', 'جدة', 'نشط', 5000, 2500, NOW(), NOW()),
('WH003', 'مستودع الدمام', 'الدمام', 'الدمام', 'نشط', 3000, 1500, NOW(), NOW());

-- ============================================
-- 3. إدراج المنتجات (Products)
-- ============================================

INSERT INTO products (name, description, price, categoryId, warehouseCode, colors, sizes, weight, imageUrl, isActive, createdAt, updatedAt) VALUES
('فستان وردي فاخر', 'فستان سهرة وردي بتصميم فاخر', 299.99, 1, 'WH001', 'وردي,أحمر,أسود', 'S,M,L,XL', 0.5, '/images/dress1.jpg', 1, NOW(), NOW()),
('كرسي جلوس ذهبي', 'كرسي جلوس بتصميم ذهبي فاخر', 599.99, 2, 'WH001', 'ذهبي,فضي', 'واحد', 15.0, '/images/chair1.jpg', 1, NOW(), NOW()),
('قلادة ماسية', 'قلادة ماسية أصلية 18 قيراط', 1299.99, 3, 'WH002', 'ذهبي', 'واحد', 0.1, '/images/necklace1.jpg', 1, NOW(), NOW()),
('حذاء كعب عالي', 'حذاء كعب عالي أسود براق', 199.99, 4, 'WH002', 'أسود,أحمر,ذهبي', '35,36,37,38,39,40', 0.3, '/images/heels1.jpg', 1, NOW(), NOW()),
('حقيبة يد جلدية', 'حقيبة يد جلدية أصلية', 449.99, 5, 'WH003', 'أسود,بني,أحمر', 'واحد', 1.2, '/images/bag1.jpg', 1, NOW(), NOW()),
('فستان أبيض ناعم', 'فستان أبيض ناعم للحفلات', 349.99, 1, 'WH001', 'أبيض,كريمي', 'S,M,L', 0.4, '/images/dress2.jpg', 1, NOW(), NOW()),
('طاولة طعام خشبية', 'طاولة طعام خشبية فاخرة', 799.99, 2, 'WH001', 'بني,أسود', 'واحد', 50.0, '/images/table1.jpg', 1, NOW(), NOW()),
('خاتم ماسي', 'خاتم ماسي بتصميم عصري', 899.99, 3, 'WH002', 'ذهبي,فضي,وردي', '5,6,7,8,9', 0.05, '/images/ring1.jpg', 1, NOW(), NOW());

-- ============================================
-- 4. إدراج المستخدمين (Users)
-- ============================================

INSERT INTO users (email, name, phone, role, passwordHash, isEmailVerified, createdAt, updatedAt) VALUES
('customer1@example.com', 'فاطمة أحمد', '0501234567', 'user', '$2b$10$...', 1, NOW(), NOW()),
('customer2@example.com', 'نور محمد', '0502345678', 'user', '$2b$10$...', 1, NOW(), NOW()),
('admin@example.com', 'مسؤول النظام', '0503456789', 'admin', '$2b$10$...', 1, NOW(), NOW()),
('delegate1@example.com', 'مندوب التوصيل', '0504567890', 'delegate', '$2b$10$...', 1, NOW(), NOW()),
('supervisor@example.com', 'المشرف', '0505678901', 'supervisor', '$2b$10$...', 1, NOW(), NOW());

-- ============================================
-- 5. إدراج الطلبات (Orders)
-- ============================================

INSERT INTO orders (userId, totalPrice, status, paymentStatus, deliveryAddress, notes, createdAt, updatedAt) VALUES
(1, 599.99, 'pending', 'pending', 'الرياض - حي النخيل - شارع الملك فهد', 'توصيل سريع', NOW(), NOW()),
(2, 1299.99, 'processing', 'completed', 'جدة - حي الرويس - شارع الأمير محمد', 'توصيل عادي', NOW(), NOW()),
(1, 449.99, 'shipped', 'completed', 'الرياض - حي الملز - شارع الملك عبدالعزيز', 'توصيل سريع', NOW(), NOW());

-- ============================================
-- 6. إدراج عناصر الطلب (Order Items)
-- ============================================

INSERT INTO order_items (orderId, productId, quantity, price, createdAt, updatedAt) VALUES
(1, 2, 1, 599.99, NOW(), NOW()),
(2, 3, 1, 1299.99, NOW(), NOW()),
(3, 5, 1, 449.99, NOW(), NOW());

-- ============================================
-- 7. إدراج الشحنات (Shipments)
-- ============================================

INSERT INTO shipments (orderId, warehouseCode, status, trackingNumber, estimatedDelivery, actualDelivery, createdAt, updatedAt) VALUES
(1, 'WH001', 'pending', 'TRACK001', DATE_ADD(NOW(), INTERVAL 3 DAY), NULL, NOW(), NOW()),
(2, 'WH002', 'in_transit', 'TRACK002', DATE_ADD(NOW(), INTERVAL 2 DAY), NULL, NOW(), NOW()),
(3, 'WH001', 'delivered', 'TRACK003', DATE_ADD(NOW(), INTERVAL 1 DAY), NOW(), NOW(), NOW());

-- ============================================
-- 8. إدراج التقييمات (Reviews)
-- ============================================

INSERT INTO product_reviews (productId, userId, rating, comment, imageUrl, createdAt, updatedAt) VALUES
(1, 1, 5, 'منتج رائع جداً وجودة عالية', '/images/review1.jpg', NOW(), NOW()),
(2, 2, 4, 'جميل لكن التوصيل استغرق وقتاً', '/images/review2.jpg', NOW(), NOW()),
(3, 1, 5, 'ممتاز وأصلي 100%', '/images/review3.jpg', NOW(), NOW()),
(4, 2, 4, 'حذاء مريح وجميل', NULL, NOW(), NOW()),
(5, 1, 5, 'حقيبة فخمة وعملية', '/images/review5.jpg', NOW(), NOW());

-- ============================================
-- 9. إدراج أكواد الخصم (Discount Codes)
-- ============================================

INSERT INTO discount_codes (code, description, discountPercentage, maxUses, usedCount, expiryDate, isActive, createdAt, updatedAt) VALUES
('SUMMER20', 'خصم صيفي 20%', 20, 100, 15, DATE_ADD(NOW(), INTERVAL 30 DAY), 1, NOW(), NOW()),
('WELCOME10', 'خصم ترحيبي 10%', 10, 1000, 250, DATE_ADD(NOW(), INTERVAL 60 DAY), 1, NOW(), NOW()),
('VIP50', 'خصم VIP 50%', 50, 50, 10, DATE_ADD(NOW(), INTERVAL 15 DAY), 1, NOW(), NOW());

-- ============================================
-- 10. إدراج نقاط الولاء (Loyalty Points)
-- ============================================

INSERT INTO loyalty_points (userId, points, totalEarned, totalRedeemed, createdAt, updatedAt) VALUES
(1, 500, 1000, 500, NOW(), NOW()),
(2, 300, 600, 300, NOW(), NOW()),
(3, 1000, 2000, 1000, NOW(), NOW());

-- ============================================
-- 11. إدراج العمولات (Commissions)
-- ============================================

INSERT INTO warehouse_commissions (warehouseCode, commissionPercentage, minOrderAmount, description, createdAt, updatedAt) VALUES
('WH001', 5, 100, 'عمولة المستودع الرئيسي', NOW(), NOW()),
('WH002', 7, 100, 'عمولة مستودع جدة', NOW(), NOW()),
('WH003', 8, 100, 'عمولة مستودع الدمام', NOW(), NOW());

-- ============================================
-- 12. إدراج عمولات المندوبات (Delegate Commissions)
-- ============================================

INSERT INTO delegate_commissions (delegateId, commissionPercentage, minOrderAmount, description, createdAt, updatedAt) VALUES
(4, 10, 50, 'عمولة مندوب التوصيل', NOW(), NOW());

-- ============================================
-- 13. إدراج سجل حالات الطلب (Order Status History)
-- ============================================

INSERT INTO order_status_history (orderId, oldStatus, newStatus, changedBy, reason, createdAt) VALUES
(1, 'pending', 'processing', 'admin@example.com', 'تم تأكيد الطلب', NOW()),
(2, 'pending', 'processing', 'admin@example.com', 'تم تأكيد الطلب', NOW()),
(2, 'processing', 'shipped', 'delegate1@example.com', 'تم الشحن', NOW()),
(3, 'pending', 'processing', 'admin@example.com', 'تم تأكيد الطلب', NOW()),
(3, 'processing', 'shipped', 'delegate1@example.com', 'تم الشحن', NOW()),
(3, 'shipped', 'delivered', 'delegate1@example.com', 'تم التسليم', NOW());

-- ============================================
-- 14. إدراج المحادثات (Chat Conversations)
-- ============================================

INSERT INTO chat_conversations (userId, type, title, isActive, createdAt, updatedAt) VALUES
(1, 'customer_support', 'استفسار عن المنتج', 1, NOW(), NOW()),
(2, 'customer_support', 'مشكلة في التوصيل', 1, NOW(), NOW()),
(1, 'group', 'مجموعة العروض الخاصة', 1, NOW(), NOW());

-- ============================================
-- 15. إدراج رسائل الدردشة (Chat Messages)
-- ============================================

INSERT INTO chat_messages (conversationId, userId, message, messageType, createdAt) VALUES
(1, 1, 'هل هذا المنتج متوفر بألوان أخرى؟', 'text', NOW()),
(1, 3, 'نعم، متوفر بـ 5 ألوان مختلفة', 'text', DATE_ADD(NOW(), INTERVAL 5 MINUTE)),
(2, 2, 'الطلب لم يصل بعد', 'text', NOW()),
(2, 4, 'سيتم التوصيل اليوم إن شاء الله', 'text', DATE_ADD(NOW(), INTERVAL 10 MINUTE));

-- ============================================
-- ملخص البيانات المدرجة
-- ============================================

/*
✅ تم إدراج البيانات التالية:
- 5 فئات منتجات
- 3 مستودعات
- 8 منتجات
- 5 مستخدمين
- 3 طلبات
- 3 عناصر طلب
- 3 شحنات
- 5 تقييمات
- 3 أكواد خصم
- 3 حسابات ولاء
- 3 عمولات مستودعات
- 1 عمولة مندوب
- 6 سجلات حالة طلب
- 3 محادثات
- 4 رسائل دردشة

إجمالي الجداول المملوءة: 15 جدول
إجمالي الصفوف المدرجة: ~60 صف
*/

-- ============================================
-- تم إنشاء هذا الملف بواسطة: Manus AI
-- التاريخ: 28 يونيو 2026
-- الحالة: ✅ جاهز للاستخدام
-- ============================================
