# 🌹 إنشاء رابط Webhook من Google Apps Script

## الخطوة 1️⃣: فتح Google Sheets

1. افتح جدول البيانات الخاص بك
   - الرابط: https://docs.google.com/spreadsheets/d/1Vae_gECGaJZlJeDJOFy9BhB2YVqgEiUApMwnVbtJo1c/edit

2. تأكد من تسجيل الدخول بحسابك في Google

---

## الخطوة 2️⃣: فتح محرر البرامج

### الطريقة الأولى (من Google Sheets):
1. انقر على **"أدوات"** في القائمة العلوية
2. اختر **"محرر البرامج"** (Script Editor)

### الطريقة البديلة (إذا لم تجد):
1. افتح هذا الرابط مباشرة: https://script.google.com/home
2. انقر على **"مشروع جديد"** (New Project)
3. أعطِ المشروع اسماً: `Rose Online - Google Sheets`

---

## الخطوة 3️⃣: نسخ الكود

انسخ الكود التالي بالكامل:

```javascript
/**
 * Google Apps Script لـ Rose Online
 * يستقبل بيانات المنتجات ويضيفها إلى جدول البيانات
 */

const SHEET_NAME = 'المنتجات';

const HEADERS = [
  'التاريخ والوقت',
  'اسم المنتج',
  'السعر',
  'الوصف',
  'الألوان',
  'المقاسات',
  'الوزن',
  'كود المستودع',
  'معرف القسم',
  'رابط الصورة'
];

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    
    if (payload.test) {
      Logger.log('✅ اختبار الاتصال: ' + payload.message);
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'اختبار الاتصال ناجح ✅'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const sheet = getOrCreateSheet();
    
    const row = [
      payload.timestamp || new Date().toLocaleString('ar-JO'),
      payload.name || '',
      payload.price || '',
      payload.description || '',
      payload.colors || '',
      payload.sizes || '',
      payload.weight || '',
      payload.warehouseCode || '',
      payload.categoryId || '',
      payload.image || ''
    ];
    
    sheet.appendRow(row);
    Logger.log('✅ تم إضافة المنتج: ' + payload.name);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'تم إضافة المنتج بنجاح ✅',
      product: payload.name
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('❌ خطأ: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'حدث خطأ: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return HtmlService.createHtmlOutput(
    '<h1>🎉 Rose Online - Google Sheets Integration</h1>' +
    '<p>✅ الخادم يعمل بنجاح!</p>'
  );
}

function getOrCreateSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    
    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#FF6B6B');
    headerRange.setFontColor('#FFFFFF');
    
    for (let i = 1; i <= HEADERS.length; i++) {
      sheet.setColumnWidth(i, 150);
    }
  }
  
  return sheet;
}
```

---

## الخطوة 4️⃣: لصق الكود

1. احذف الكود الموجود (Ctrl+A ثم Delete)
2. الصق الكود الجديد (Ctrl+V)
3. احفظ المشروع (Ctrl+S)

---

## الخطوة 5️⃣: نشر التطبيق

1. انقر على **"نشر"** (Deploy) في الأعلى
2. اختر **"نشر جديد"** (New Deployment)
3. انقر على **⚙️ (الإعدادات)**
4. اختر **"نوع النشر"** → **"تطبيق ويب"** (Web app)
5. في **"تنفيذ باسم"** اختر حسابك
6. في **"من لديه الوصول"** اختر **"أي شخص"**
7. انقر **"نشر"**

---

## الخطوة 6️⃣: الحصول على رابط Webhook

بعد النشر، ستظهر نافذة جديدة:

```
تم النشر بنجاح! ✅
رابط النشر:
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/usercopy
```

**انسخ هذا الرابط!** ⬆️

---

## الخطوة 7️⃣: إضافة الرابط في الموقع

1. افتح الموقع: https://3000-iyv4qzuo1bbth4goii36c-13f1ff43.sg1.manus.computer
2. اذهب إلى **إعدادات المشروع**
3. أضف متغير جديد:
   - **الاسم:** `GOOGLE_SHEETS_WEBHOOK_URL`
   - **القيمة:** الرابط الذي نسخته

---

## الخطوة 8️⃣: اختبار الاتصال

1. افتح الموقع
2. أضف منتج جديد
3. افتح جدول البيانات
4. تحقق من ظهور البيانات! ✅

---

## 🎯 النتيجة النهائية

عند إضافة منتج جديد من الموقع، ستظهر البيانات تلقائياً في جدول البيانات بـ 10 أعمدة:

| التاريخ والوقت | اسم المنتج | السعر | الوصف | الألوان | المقاسات | الوزن | كود المستودع | معرف القسم | رابط الصورة |
|---|---|---|---|---|---|---|---|---|---|
| 2026-06-09 | فستان أحمر | 150 | فستان جميل | أحمر | M, L | 500g | WH-001 | 1 | https://... |

---

## ⚠️ المشاكل الشائعة

### المشكلة: "لا يوجد محرر برامج"
**الحل:** استخدم الرابط المباشر: https://script.google.com/home

### المشكلة: "الخطأ 403 - لا يوجد وصول"
**الحل:** تأكد من اختيار "أي شخص" في خيار الوصول

### المشكلة: "البيانات لا تظهر"
**الحل:** 
1. تحقق من رابط webhook
2. افتح سجل التنفيذ (Execution log) وابحث عن الأخطاء
3. جرب اختبار الاتصال من الموقع

---

## ✅ تم! 🎉

الآن لديك ربط كامل بين الموقع و Google Sheets!
