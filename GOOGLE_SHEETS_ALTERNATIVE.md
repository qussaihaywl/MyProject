# حل بديل: ربط Google Sheets بدون Webhook 🌹

## المشكلة
الحصول على رابط webhook من Google Apps Script يتطلب خطوات معقدة قد تستغرق وقتاً.

## الحل البديل ✅

بدلاً من استخدام webhook، سنستخدم **Google Sheets API** مباشرة من الموقع!

### الخطوات:

#### 1️⃣ إنشاء Service Account
```bash
# افتح Google Cloud Console
# https://console.cloud.google.com/

# اذهب إلى: APIs & Services → Credentials
# انقر: Create Credentials → Service Account
# أكمل البيانات وانقر Create
```

#### 2️⃣ إنشاء مفتاح JSON
```bash
# في صفحة Service Account
# اذهب إلى: Keys
# انقر: Add Key → Create new key
# اختر: JSON
# سيتم تحميل ملف JSON
```

#### 3️⃣ نسخ بيانات المفتاح
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "your-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...",
  "client_email": "your-service-account@...",
  "client_id": "your-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```

#### 4️⃣ مشاركة جدول البيانات
```bash
# افتح جدول البيانات
# انقر: Share
# أضف البريد الإلكتروني: your-service-account@...
# اختر: Editor
# انقر: Share
```

#### 5️⃣ الحصول على معرف الجدول
```bash
# افتح جدول البيانات
# انسخ المعرف من الرابط:
# https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit
```

#### 6️⃣ إضافة المتغيرات
```bash
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id
GOOGLE_SHEETS_SERVICE_ACCOUNT_EMAIL=your-service-account@...
GOOGLE_SHEETS_PRIVATE_KEY=your-private-key
```

### الفوائد:
- ✅ لا حاجة لـ webhook معقد
- ✅ إضافة مباشرة إلى Google Sheets
- ✅ أكثر أماناً وموثوقية
- ✅ يعمل بدون تأخير

### الخطوة التالية:
سأقوم بتحديث الكود لاستخدام Google Sheets API مباشرة! 🚀
