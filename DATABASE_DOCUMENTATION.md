# توثيق قاعدة البيانات المتقدمة - Rose Online

## نظرة عامة

تم تطوير قاعدة البيانات لمتجر Rose Online بشكل متقاميامل ليشمل **56 جدول** متخصص يوفر جميع المزايا الحديثة للمتجر الإلكتروني.

---

## 1. جداول إدارة المستخدمين والمصادقة

### `users` - جدول المستخدمين الرئيسي
| الحقل | النوع | الوصف |
|-------|-------|-------|
| `id` | INT | معرّف ف المستخدم الفريد |
| `name` | VARCHAR | اسم المستخدم |
| `email` | VARCHAR | البريد الإلكتروني (فريد) |
| `password` | VARCHAR | كلمة المرور المشفرة |
| `phone` | VARCHAR | رقم الهاتف |
| `address` | TEXT | العنوان |
| `city` | VARCHAR | المدينة |
| `zipCode` | VARCHAR | الرمز البريدي |
| `role` | ENUM | الدور (admin, user, manager) |
| `isActive` | BOOLEAN | حالة الحساب |
| `loginMethod` | VARCHAR | طريقة الدخول (local, oauth) |
| `openId` | VARCHAR | معرّف OAuth |
| `lastSignedIn` | TIMESTAMP | آخر دخول |
| `walletNumber` | VARCHAR | رقم المحفظة |
| `walletType` | VARCHAR | نوع المحفظة |
| `createdAt` | TIMESTAMP | تاريخ الإنشاء |
| `updatedAt` | TIMESTAMP | تاريخ التحديث |

### `emailVerifications` - التحقق من البريد الإلكتروني
- تتبع عمليات التحقق من البريد
- إدارة رموز التحقق والانتهاء الزمني

### `twoFactorAuth` - المصادقة الثنائية
- دعم تطبيقات المصادقة (Google Authenticator)
- إدارة رموز النسخ الاحتياطية

### `passwordResets` - إعادة تعيين كلمة المرور
- تتبع طلبات إعادة التعيين
- إدارة الرموز المؤقتة

---

## 2. جداول إدارارةامل المنتجات

### `categories` - الفئات
| الحقل | الوصف |
|-------|-------|
| `name` | اسم الفئة |
| `description` | وصف الفئة |
| `image` | صورة الفئة |
| `displayOrder` | ترتيب العرض |
| `showOnHomepage` | عرض على الصفحة الرئيسية |
| `isActive` | حالةامل الفئة |

### `products` - المنتجات (24 حقل)
| الحقل الرئيسي | الوصف |
|---------------|-------|
| `name` | اسم المنتج |
| `description` | وصف تفصيلي |
| `price` | السعر الحالي |
| `originalPrice` | السعر الأصلي |
| `discount` | نسبة الخصم |
| `ku` | رمز المنتج الفريد |
| `barcode` | الرمز الشريطي |
| `stock` | كمية المخزون |
| `lowStockThreshold` | حد التنبيه للمخزون المنخفض |
| `colors` | الألوان المتاحة (JSON) |
| `sizes` | المقاسات المتاحة (JSON) |
| `weight` | الوزن |
| `isFeatured` | منتج مميز |
| `averageRating` | متوسط التقييم |
| `totalReviews` | عدد المراجعات |
| `images` | صور إضافية (JSON) |

### `productReviews` - التقييمات والمراجعات
- تقييمات من 1-5 نجوم
- تحقق من الشراء المؤكد
- حساب عدددشامامل المفيدة/غير المفيدة
- حالة المراجعة (معلقة، موافق عليها، مرفوضة)

### `reviewImages` - صور المراجعات
- ربط صور متعددة بكل مراجعة
- ترتيب العرض

### `productViews` - مشاهدات المنتج
- تتبع عدد مشاهدات كل منتججامامل
- مدة المشاهدة
- معرّف الجلسة

### `productShares` - مشاركات المنتج
- تتبع مشاركات المنتجات على وسائل التواصل
- تحليل الأداء

---

## 3. جداول إدارة الطلبات والمبيعات

### `orders` - الطلبات الرئيسية
| الحقل | الوشامل |
|-------|-------|
| `orderNumber` | رقم الطلب الفريد |
| `userId` | معرّف المستخدم |
| `totalAmount` | المبلغ الإجمالي |
| `discountAmount` | مبلغ الخصم |
| `finalAmount` | المبلغ النهائي |
| `status` | الحالة (معلقة، قيد المعالجة، مكششامامل، ملغاة) |
| `paymentMethod` | طريقة الدفع |
| `paymentStatus` | حالة الدفع |
| `shippingAddress` | عنوان الشحن |
| `notes` | ملاحظات |
| `createdAt` | تاريخ الإنشاء |

### `orderItems` - عناصر الطلب
- ربط المنتجات بالطلباتاتشامامل
- السعر والكمية والخصم

### `orderStatusHistory` - سجل حالات الطلب
- تتبع جميع تغييرات حالة الطلب
- الطوابع الزمنية والملاحظات

### `advancedOrders` - الطلبات المتقدمة (33 حقل)
- معلومات شاملة عن الطلبات
- تفاصيلششامامل الشحن والدفع
- معلومات العميل الكاملة

### `shipments` - الشحنات
- تتبع الشحنات
- رقم التتبع
- تاريخ الشحن والتسليم

### `customerAddresses` - عناوين العملاء
- عناوين متعددة لكل عميل
- العنوان الافتراضي

---

## 4. جداولولامل إدارة المستودعات والعمولات

### `warehouses` - المستودعات
- الموقع والرمز
- حالة النشاط

### `warehouseCommissions` - عمولات المستودعات
- حساب العمولات حسب المستودع
- النسبة المئوية والمبلغ الثابت

### `delegateCommissions` - عمولات الوكلاء
- إدارةةشامل العمولات للوكلاء
- تتبع الأداء

---

## 5. جداول نظام الخصومات والنقاط

### `discountCodes` - أكواد الخصم (17 حقل)
| الحقل | الوصف |
|-------|-------|
| `code` | الكود الفريد |
| `discountType` | النوع (نسبة مئوية أو مبلجشامل ثابت) |
| `discountValue` | قيمة الخصم |
| `minOrderAmount` | الحد الأدنى للطلب |
| `maxDiscount` | أقصى خصم |
| `usageLimit` | حد الاستخدام الكلي |
| `usagePerUser` | حد الاستخدام لكل مستخدم |
| `applicableCategories` | الفئات المطبقققامل (JSON) |
| `applicableProducts` | المنتجات المطبقة (JSON) |
| `startDate` | تاريخ البداية |
| `endDate` | تاريخ النهاية |
| `isActive` | الحالة |

### `couponUsage` - تسجيل استخدام الكوبونات
- تتبع كل استخدام
- مبلغ الخصم المطبق

### `loyaltyPoints` - نقاط الولاء
| الحقل | الوصف |
|-------|-------|
| `userId` | معرّف المستخدم |
| `totalPoints` | إجمالي النقاط المكتسبة |
| `usedPoints` | النقاط المستخدمة |
| `availablePoints` | النقاط المتاحة |
| `tier` | المستوى (برونز، فضيشششامل، ذهب، بلاتين) |

### `pointsTransactions` - تحويلات النقاط
- تسجيل جميع العمليات
- الأنواع: مكتسبة، مستردة، منتهية الصلاحية، معدلة

---

## 6. جداول الإشعارات والاتصالات

### `notifications` - الإشعارات النظامية
| الحقولقامامل | الوصف |
|-------|-------|
| `type` | النوع (طلب، ترويج، مراجعة، رسالة، نظام، دفع) |
| `title` | عنوان الإشعار |
| `content` | محتوى الإشعار |
| `actionUrl` | رابط الإجراء |
| `isRead` | حالة القراءة |
| `readAt` | وقتشامامل القراءة |

### `smsLogs` - سجلات الرسائل النصية
- تتبع جميع الرسائل المرسلة
- حالة الإرسال
- رسائل الخطأ

### `emailLogs` - سجلات البريد الإلكتروني
- تتبع رسائل البريد
- حالة التسليم

### `inquiries` - الاستفسارارششامل
- استفسارات العملاء
- الحالة والرد

---

## 7. جداول نظام الدردشة الجماعية المتقدم

### `groupChatRooms` - غرف الدردشة الجماعية
- غرف عامة وخاصة
- الحد الأقصى للأعضاء
- الإعدادات المتقدمة

### `groupChatMembers` شامامل - أعضاء الغرفة
- الأدوار (عضو، مشرف، مالك)
- تاريخ الانضمام

### `groupChatMessages` - رسائل الدردشة (21 حقل)
- الرسائل النصية والوسائط
- الرد على الرسائل
- التحرير والحذف

### `messageReactions` - ردود الفعل على الرسائامامل
- الرموز التعبيرية
- عد الردود

### `messageReadStatus` - حالة قراءة الرسائل
- تتبع من قرأ الرسالة

### `messageSearchIndex` - فهرس البحث
- تحسين أداء البحث
- الفهرسة الكاملة

### `pinnedMessages` - الرسائل المثبتة
- تثبيت الرسائائشامل المهمة
- ترتيب الأولوية

### `groupChatNotifications` - إشعارات الدردشة الجماعية
- إخطارات العضو
- حالة القراءة

### `roomModerationActions` - إجراءات الإدارة
- الإجراءات: كتم، طرد، تحذير، حذف رسالة
- السبب والمدة

### `userOnlineStatus` - حالة الاتصال
- متصل/غير متصل
- آخر نشاط

### `userStatus` - حالة المستخدم
- الحالة: نشط، مشغول، بعيد
- الكتابة في الغرفة

---

## 8. جداول نظام الذكاء الاصطناعي

### `aiTrainingData` - بيانات التدريب
- استفسارراتشامل المستخدمين
- ردود الإدارة
- الفئات والاختلافات اللغوية

### `aiResponses` - ردود الذكاء الاصطناعي
- الرسائل المولدة
- تقييم الفائدة
- التحسينات المستمرة

### `aiSettings` - إعدادات الذكاء الاصطناعي
- تفعيل/تععشامل الذكاء الاصطناعي
- أسلوب الرد
- اللهجة المفضلة

### `aiConversationContext` - سياق المحادثة
- الذاكرة قصيرة المدى
- السياق التاريخي

---

## 9. جداول التحليلات والنشاط

### `salesAnalytics` - تحليلات المبيعات
| الحقل | الوامل |
|-------|-------|
| `date` | التاريخ |
| `totalOrders` | عدد الطلبات |
| `totalRevenue` | إجمالي الإيرادات |
| `totalItems` | عدد العناصر المباعة |
| `averageOrderValue` | متوسط قيمة الطلب |
| `newCustomers` | عملاء جدد |
| `returningCustomers` | عملائشامل عائدون |

### `userActivityLog` - سجل نشاط المستخدم
- نوع النشاط
- الوصف والبيانات الوصفية
- عنوان IP ووكيل المستخدم

---

## 10. جداول إضافية

### `cartItems` - سلة التسوق
- المنتجات المضافة
- الكمية

### `userFavorites` - المفضششامل المفضلة
- المنتجات المحفوظة
- تاريخ الإضافة

### `chatRooms` - غرف الدردشة الفردية
- محادثات العملاء والدعم

### `messages` - الرسائل الفردية
- المحادثات المباشرة

### `facebookPages` - صفحات فيسبوك
- ربط الصفحات
- إحششامل الحسابات

 

### `showcaseVideos` - فيديوهات العرض
- فيديوهات المنتجات
- الوصف والعنوان

### `chatFilters` - مرشحات الدردشة
- تفضيلات الإخطارات
- الكلمات المحجوبة

### `chatMentions` - الإشارات في الدردشة
- تتبع الإششاشامل المذكورة
- الإخطارات

---

## الارتباطات الرئيسية

```
users (1) ←→ (many) orders
users (1) ←→ (many) cartItems
users (1) ←→ (many) userFavorites
users (1) ←→ (many) productReviews
users (1) ←→ (many) loyaltyPoints
users (1) ←→ (many) notifications
users (1)شامامل ←→ (many) userActivityLog

categories (1) ←→ (many) products
products (1) ←→ (many) productReviews
products (1) ←→ (many) productViews
products (1) ←→ (many) orderItems

orders (1) ←→ (many) orderItems
orders (1) ←→ (many) orderStatusHistory
orders (1) ←→ (many) shipments

discountCodes (1) ←→شششامل) couponUsage

groupChatRooms (1) ←→ (many) groupChatMessages
groupChatRooms (1) ←→ (many) groupChatMembers
groupChatMessages (1) ←→ (many) messageReactions
groupChatMessages (1) ←→ (many) messageReadStatus
groupChatMessages (1) ←→ (many) pinnedMessages
```

---

## الدوال المتاحة

### إدارةشششامل المنتجات
- `getProducts()` - الحصول على قائمة المنتجات
- `getProductById()` - الحصول على تفاصيل المنتج
- `createProduct()` - إنشاء منتج جديد
- `updateProduct()` - تحديث المنتج
- `deleteProduct()` - حذف المنتج

### إدارة الطلبات
- `getUserOrders()` - طلبششامل المستخدم
- `createOrder()` - إنشاء طلب جديد
- `updateOrderStatus()` - تحديث حالة الطلب

### إدارة التقييمات
- `createProductReview()` - إنشاء مراجعة
- `getProductReviews()` - الحصول على مراجعات المنتج
- `addReviewImages()` - إضافة صور للمراجعة

### نظامل الخصومات
- `validateDiscountCode()` - التحقق من الكود
- `recordCouponUsage()` - تسجيل الاستخدام

### نقاط الولاء
- `getUserLoyaltyPoints()` - الحصول على النقاط
- `addLoyaltyPoints()` - إضافة نقاط
- `redeemLoyaltyPoints()` - استرجاع النقاط

### الإششامل والإشعارات
- `createNotification()` - إنشاء إشعار
- `getUserNotifications()` - الحصول على الإشعارات
- `markNotificationAsRead()` - تحديد كمقروء
- `getUnreadNotificationCount()` - عدد غير المقروءة

### التحليلات
- `logProductView()` - تسجيل المشاهدة
- `logUserActivity()` - تسجشامل النشاط
- `getSalesAnalytics()` - تحليلات المبيعات

---

## الإجراءات tRPC المتاحة

```typescript
// التقييمات
trpc.reviews.create()
trpc.reviews.getByProduct()

// الخصومات
trpc.discounts.validate()
trpc.discounts.getByCode()

// نقاط الولاء
trpc.loyalty.getPoints()
trpc.loyalty.addشامامل()
trpcلoyalty.redeem()

// الإشعارات
trpc.notifications.list()
trpc.notifications.markAsRead()
trpc.notifications.getUnreadCount()

// التحليلات
trpc.analytics.logProductView()
trpc.analytics.logActivity()
```

---

## معايير الأداء

- **الفهرسة**: جميع الحقول الأجنبية مفهرسة
- **التخزينينششامل**: استخدام JSON للبيانات الديناميكية
- **الطوابع الزمنية**: UTC لجميع التواريخ
- **التشفير**: كلمات المرور مشفرة بـ bcrypt
- **الحد الأقصى للاتصالات**: 10 اتصالات متزامنة

---

## الخلاصة

تم بناء قاعدة بيانات شاامامامل متقدمة تدعم:
- ✅ إدارة متقدمة للمنتجات والطلبات
- ✅ نظام تقييمات وآراء شامل
- ✅ نظام خصومات ونقاط ولاء متطور
- ✅ دردشة جماعية بميزات متقدمة
- ✅ ذكاء اصطناعي للدعشامل والتعلم
- ✅ تحليلات وتقارير شاملة
- ✅ إدارة كاملة للمستودعات والعمولات
