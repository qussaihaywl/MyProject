# 🔗 دليل ربط قاعدة البيانات بجميع الصفحات

**الحالة:** ✅ جاهز للتنفيذ  
**التاريخ:** 28 يونيو 2026  
**الإصدار:** 1.0

---

## 📋 فهرس الصفحات والربط

### 1️⃣ الصفحة الرئيسية (Home.tsx)

**الحالة الحالية:** ✅ تعرض بيانات تجريبية  
**المطلوب:** ربط البيانات الحقيقية

**العناصر المراد ربطها:**
- ✅ قائمة المنتجات المميزة
- ✅ العروض الخاصة
- ✅ آخر الطلبات
- ✅ التقييمات

**الكود المطلوب:**
```typescript
// جلب المنتجات المميزة
const { data: featuredProducts } = trpc.products.getFeatured.useQuery();

// جلب العروض الخاصة
const { data: specialOffers } = trpc.products.getSpecialOffers.useQuery();

// جلب آخر الطلبات
const { data: recentOrders } = trpc.orders.getRecent.useQuery();

// جلب التقييمات
const { data: reviews } = trpc.reviews.getTopRated.useQuery();
```

---

### 2️⃣ صفحة المنتجات (Products.tsx)

**الحالة الحالية:** ✅ تعرض بيانات تجريبية  
**المطلوب:** ربط البيانات الحقيقية

**العناصر المراد ربطها:**
- ✅ قائمة المنتجات
- ✅ التصفية حسب الفئة
- ✅ البحث
- ✅ الترتيب والفرز

**الكود المطلوب:**
```typescript
// جلب جميع المنتجات
const { data: products = [] } = trpc.products.getAll.useQuery({
  category: selectedCategory,
  search: searchTerm,
  sort: sortBy,
  limit: 12,
  offset: page * 12
});

// جلب الفئات
const { data: categories } = trpc.categories.getAll.useQuery();

// إضافة إلى السلة
const addToCartMutation = trpc.cart.addItem.useMutation({
  onSuccess: () => {
    toast.success('تم إضافة المنتج إلى السلة');
  }
});
```

---

### 3️⃣ صفحة تفاصيل المنتج (ProductDetail.tsx)

**الحالة الحالية:** ✅ موجودة  
**المطلوب:** ربط البيانات الحقيقية

**العناصر المراد ربطها:**
- ✅ بيانات المنتج
- ✅ الصور والفيديو
- ✅ التقييمات
- ✅ المنتجات ذات الصلة

**الكود المطلوب:**
```typescript
// جلب تفاصيل المنتج
const { data: product } = trpc.products.getById.useQuery({ id: productId });

// جلب التقييمات
const { data: reviews } = trpc.reviews.getByProduct.useQuery({ productId });

// جلب المنتجات ذات الصلة
const { data: relatedProducts } = trpc.products.getRelated.useQuery({ 
  categoryId: product?.categoryId 
});

// إضافة تقييم
const addReviewMutation = trpc.reviews.create.useMutation();
```

---

### 4️⃣ صفحة السلة (Cart.tsx)

**الحالة الحالية:** ✅ موجودة  
**المطلوب:** ربط البيانات الحقيقية

**العناصر المراد ربطها:**
- ✅ عناصر السلة
- ✅ حساب الإجمالي
- ✅ تحديث الكمية
- ✅ حذف العناصر

**الكود المطلوب:**
```typescript
// جلب عناصر السلة
const { data: cartItems } = trpc.cart.getItems.useQuery();

// تحديث الكمية
const updateQuantityMutation = trpc.cart.updateQuantity.useMutation({
  onSuccess: () => {
    utils.cart.getItems.invalidate();
  }
});

// حذف العنصر
const removeItemMutation = trpc.cart.removeItem.useMutation({
  onSuccess: () => {
    utils.cart.getItems.invalidate();
  }
});

// حساب الإجمالي
const total = cartItems?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
```

---

### 5️⃣ صفحة الدفع (Checkout.tsx)

**الحالة الحالية:** ✅ موجودة  
**المطلوب:** ربط البيانات الحقيقية

**العناصر المراد ربطها:**
- ✅ بيانات المستخدم
- ✅ عنوان التوصيل
- ✅ طريقة الدفع
- ✅ إنشاء الطلب

**الكود المطلوب:**
```typescript
// جلب بيانات المستخدم
const { data: user } = trpc.auth.me.useQuery();

// إنشاء الطلب
const createOrderMutation = trpc.orders.create.useMutation({
  onSuccess: (order) => {
    toast.success('تم إنشاء الطلب بنجاح');
    navigate(`/order/${order.id}`);
  }
});

// معالجة الدفع
const processPaymentMutation = trpc.payments.process.useMutation();
```

---

### 6️⃣ صفحة الطلبات (Orders.tsx)

**الحالة الحالية:** ✅ موجودة  
**المطلوب:** ربط البيانات الحقيقية

**العناصر المراد ربطها:**
- ✅ قائمة الطلبات
- ✅ حالة الطلب
- ✅ التفاصيل
- ✅ التتبع

**الكود المطلوب:**
```typescript
// جلب طلبات المستخدم
const { data: orders } = trpc.orders.getMyOrders.useQuery({
  limit: 10,
  offset: page * 10
});

// جلب تفاصيل الطلب
const { data: orderDetails } = trpc.orders.getById.useQuery({ id: orderId });

// جلب معلومات التتبع
const { data: tracking } = trpc.shipments.getByOrder.useQuery({ orderId });
```

---

### 7️⃣ لوحة التحكم (AdminDashboard.tsx)

**الحالة الحالية:** ✅ موجودة  
**المطلوب:** ربط البيانات الحقيقية

**العناصر المراد ربطها:**
- ✅ المؤشرات الرئيسية (KPI)
- ✅ قائمة المنتجات
- ✅ قائمة الطلبات
- ✅ قائمة المستخدمين
- ✅ التبويبات المختلفة

**الكود المطلوب:**
```typescript
// جلب المؤشرات الرئيسية
const { data: stats } = trpc.admin.getStats.useQuery();

// جلب المنتجات
const { data: products } = trpc.products.getAll.useQuery();

// جلب الطلبات
const { data: orders } = trpc.orders.getAll.useQuery();

// جلب المستخدمين
const { data: users } = trpc.users.getAll.useQuery();

// إضافة منتج
const addProductMutation = trpc.products.create.useMutation({
  onSuccess: () => {
    utils.products.getAll.invalidate();
    toast.success('تم إضافة المنتج بنجاح');
  }
});

// تعديل منتج
const updateProductMutation = trpc.products.update.useMutation({
  onSuccess: () => {
    utils.products.getAll.invalidate();
    toast.success('تم تحديث المنتج بنجاح');
  }
});

// حذف منتج
const deleteProductMutation = trpc.products.delete.useMutation({
  onSuccess: () => {
    utils.products.getAll.invalidate();
    toast.success('تم حذف المنتج بنجاح');
  }
});
```

---

### 8️⃣ صفحة الملف الشخصي (Profile.tsx)

**الحالة الحالية:** ✅ موجودة  
**المطلوب:** ربط البيانات الحقيقية

**العناصر المراد ربطها:**
- ✅ بيانات المستخدم
- ✅ العناوين المحفوظة
- ✅ الطلبات السابقة
- ✅ التقييمات

**الكود المطلوب:**
```typescript
// جلب بيانات المستخدم
const { data: user } = trpc.auth.me.useQuery();

// تحديث البيانات
const updateProfileMutation = trpc.users.updateProfile.useMutation({
  onSuccess: () => {
    utils.auth.me.invalidate();
    toast.success('تم تحديث البيانات بنجاح');
  }
});

// جلب العناوين المحفوظة
const { data: addresses } = trpc.users.getAddresses.useQuery();

// جلب الطلبات السابقة
const { data: orders } = trpc.orders.getMyOrders.useQuery();

// جلب التقييمات
const { data: reviews } = trpc.reviews.getMyReviews.useQuery();
```

---

### 9️⃣ صفحة المفضلة (Favorites.tsx)

**الحالة الحالية:** ✅ موجودة  
**المطلوب:** ربط البيانات الحقيقية

**العناصر المراد ربطها:**
- ✅ قائمة المفضلة
- ✅ إضافة/حذف من المفضلة
- ✅ إضافة إلى السلة

**الكود المطلوب:**
```typescript
// جلب المفضلة
const { data: favorites } = trpc.favorites.getAll.useQuery();

// إضافة إلى المفضلة
const addFavoriteMutation = trpc.favorites.add.useMutation({
  onSuccess: () => {
    utils.favorites.getAll.invalidate();
  }
});

// حذف من المفضلة
const removeFavoriteMutation = trpc.favorites.remove.useMutation({
  onSuccess: () => {
    utils.favorites.getAll.invalidate();
  }
});
```

---

### 🔟 صفحة الدردشة (Chat.tsx)

**الحالة الحالية:** ✅ موجودة  
**المطلوب:** ربط البيانات الحقيقية

**العناصر المراد ربطها:**
- ✅ قائمة المحادثات
- ✅ الرسائل
- ✅ إرسال رسالة جديدة

**الكود المطلوب:**
```typescript
// جلب المحادثات
const { data: conversations } = trpc.chat.getConversations.useQuery();

// جلب الرسائل
const { data: messages } = trpc.chat.getMessages.useQuery({ conversationId });

// إرسال رسالة
const sendMessageMutation = trpc.chat.sendMessage.useMutation({
  onSuccess: () => {
    utils.chat.getMessages.invalidate();
  }
});
```

---

## 🔄 Procedures المطلوبة في tRPC

### Products Router:
```typescript
products: {
  getAll: publicProcedure.query(async () => { /* ... */ }),
  getById: publicProcedure.input(z.object({ id: z.number() })).query(async () => { /* ... */ }),
  getFeatured: publicProcedure.query(async () => { /* ... */ }),
  getSpecialOffers: publicProcedure.query(async () => { /* ... */ }),
  getRelated: publicProcedure.input(z.object({ categoryId: z.number() })).query(async () => { /* ... */ }),
  create: protectedProcedure.input(z.object({ /* ... */ })).mutation(async () => { /* ... */ }),
  update: protectedProcedure.input(z.object({ /* ... */ })).mutation(async () => { /* ... */ }),
  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async () => { /* ... */ }),
}
```

### Orders Router:
```typescript
orders: {
  getAll: protectedProcedure.query(async () => { /* ... */ }),
  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async () => { /* ... */ }),
  getMyOrders: protectedProcedure.query(async () => { /* ... */ }),
  getRecent: publicProcedure.query(async () => { /* ... */ }),
  create: protectedProcedure.input(z.object({ /* ... */ })).mutation(async () => { /* ... */ }),
}
```

### Categories Router:
```typescript
categories: {
  getAll: publicProcedure.query(async () => { /* ... */ }),
  getById: publicProcedure.input(z.object({ id: z.number() })).query(async () => { /* ... */ }),
}
```

### Reviews Router:
```typescript
reviews: {
  getByProduct: publicProcedure.input(z.object({ productId: z.number() })).query(async () => { /* ... */ }),
  getTopRated: publicProcedure.query(async () => { /* ... */ }),
  getMyReviews: protectedProcedure.query(async () => { /* ... */ }),
  create: protectedProcedure.input(z.object({ /* ... */ })).mutation(async () => { /* ... */ }),
}
```

### Cart Router:
```typescript
cart: {
  getItems: protectedProcedure.query(async () => { /* ... */ }),
  addItem: protectedProcedure.input(z.object({ /* ... */ })).mutation(async () => { /* ... */ }),
  updateQuantity: protectedProcedure.input(z.object({ /* ... */ })).mutation(async () => { /* ... */ }),
  removeItem: protectedProcedure.input(z.object({ /* ... */ })).mutation(async () => { /* ... */ }),
}
```

---

## ✅ قائمة التحقق

### الصفحات المراد ربطها:
- [ ] Home.tsx
- [ ] Products.tsx
- [ ] ProductDetail.tsx
- [ ] Cart.tsx
- [ ] Checkout.tsx
- [ ] Orders.tsx
- [ ] AdminDashboard.tsx
- [ ] Profile.tsx
- [ ] Favorites.tsx
- [ ] Chat.tsx

### الأزرار المراد ربطها:
- [ ] زر إضافة إلى السلة
- [ ] زر إضافة إلى المفضلة
- [ ] زر الشراء
- [ ] زر تسجيل الدخول
- [ ] زر تسجيل جديد
- [ ] زر تحديث الملف الشخصي
- [ ] زر إضافة منتج (Admin)
- [ ] زر تعديل منتج (Admin)
- [ ] زر حذف منتج (Admin)
- [ ] زر إرسال رسالة

### التبويبات المراد ربطها:
- [ ] تبويب المنتجات
- [ ] تبويب الطلبات
- [ ] تبويب المستخدمين
- [ ] تبويب التقارير
- [ ] تبويب الإعدادات

---

## 🚀 خطوات التنفيذ

### المرحلة 1: إنشاء Procedures (2 ساعة)
1. إنشاء جميع الـ Procedures المطلوبة في routers.ts
2. اختبار كل procedure بشكل منفصل
3. التأكد من عدم وجود أخطاء

### المرحلة 2: ربط الصفحات (4 ساعات)
1. ربط صفحة Home
2. ربط صفحة Products
3. ربط صفحة ProductDetail
4. ربط صفحة Cart
5. ربط صفحة Checkout
6. ربط صفحة Orders
7. ربط صفحة AdminDashboard
8. ربط صفحة Profile
9. ربط صفحة Favorites
10. ربط صفحة Chat

### المرحلة 3: الاختبار الشامل (2 ساعة)
1. اختبار جميع الصفحات
2. اختبار جميع الأزرار
3. اختبار جميع التبويبات
4. اختبار الأداء

### المرحلة 4: التسليم النهائي (1 ساعة)
1. حفظ checkpoint نهائي
2. إنشاء تقرير نهائي
3. تسليم المشروع

---

**الإجمالي المتوقع:** 8-10 ساعات عمل

---

**تم إنشاء هذا الدليل بواسطة:** Manus AI  
**التاريخ:** 28 يونيو 2026  
**الحالة:** ✅ جاهز للتنفيذ
