/**
 * Google Apps Script لـ Rose Online
 * يستقبل بيانات المنتجات من الموقع ويضيفها إلى جدول البيانات
 * 
 * الخطوات:
 * 1. انسخ هذا الكود
 * 2. افتح جدول البيانات في Google Sheets
 * 3. اذهب إلى Tools → Script Editor
 * 4. احذف الكود الموجود وانسخ هذا الكود
 * 5. احفظ المشروع
 * 6. اذهب إلى Deploy → New Deployment
 * 7. اختر Type: Web app
 * 8. اختر Execute as: Your account
 * 9. اختر Who has access: Anyone
 * 10. انسخ رابط Deployment URL
 * 11. أضف هذا الرابط في متغير البيئة GOOGLE_SHEETS_WEBHOOK_URL
 */

// معرف الجدول (Sheet ID)
const SHEET_NAME = 'المنتجات';

// الأعمدة المطلوبة
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

/**
 * دالة doPost - تستقبل البيانات من الموقع
 * @param {Object} e - كائن الطلب
 * @returns {Object} - الرد على الطلب
 */
function doPost(e) {
  try {
    // الحصول على البيانات المرسلة
    const payload = JSON.parse(e.postData.contents);
    
    // التحقق من أن البيانات تحتوي على حقل test (اختبار الاتصال)
    if (payload.test) {
      Logger.log('✅ اختبار الاتصال: ' + payload.message);
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'اختبار الاتصال ناجح ✅'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // الحصول على الجدول
    const sheet = getOrCreateSheet();
    
    // إضافة البيانات إلى الجدول
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
    
    // إضافة الصف إلى الجدول
    sheet.appendRow(row);
    
    // تسجيل العملية
    Logger.log('✅ تم إضافة المنتج: ' + payload.name);
    
    // إرجاع رد النجاح
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'تم إضافة المنتج بنجاح ✅',
      product: payload.name
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // تسجيل الخطأ
    Logger.log('❌ خطأ: ' + error.toString());
    
    // إرجاع رد الخطأ
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'حدث خطأ: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * دالة doGet - للاختبار من المتصفح
 * @returns {Object} - صفحة HTML بسيطة
 */
function doGet() {
  return HtmlService.createHtmlOutput(
    '<h1>🎉 Rose Online - Google Sheets Integration</h1>' +
    '<p>✅ الخادم يعمل بنجاح!</p>' +
    '<p>📝 يمكنك الآن إضافة المنتجات من الموقع وستظهر تلقائياً هنا.</p>'
  );
}

/**
 * دالة للحصول على الجدول أو إنشاء جدول جديد
 * @returns {Object} - كائن الجدول
 */
function getOrCreateSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  
  // إذا لم يكن الجدول موجوداً، أنشئ جدول جديد
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    
    // إضافة رؤوس الأعمدة
    sheet.appendRow(HEADERS);
    
    // تنسيق رؤوس الأعمدة
    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#FF6B6B');
    headerRange.setFontColor('#FFFFFF');
    
    // تعيين عرض الأعمدة
    for (let i = 1; i <= HEADERS.length; i++) {
      sheet.setColumnWidth(i, 150);
    }
    
    Logger.log('✅ تم إنشاء جدول جديد: ' + SHEET_NAME);
  }
  
  return sheet;
}

/**
 * دالة لاختبار الاتصال من داخل Google Sheets
 */
function testConnection() {
  const sheet = getOrCreateSheet();
  
  // إضافة صف اختبار
  const testRow = [
    new Date().toLocaleString('ar-JO'),
    'اختبار الاتصال 🧪',
    '0',
    'هذا صف اختبار',
    'أحمر، أزرق',
    'S, M, L',
    '500g',
    'WH-001',
    '1',
    'https://example.com/test.jpg'
  ];
  
  sheet.appendRow(testRow);
  
  SpreadsheetApp.getUi().alert('✅ تم إضافة صف الاختبار بنجاح!');
}

/**
 * دالة لمسح جميع البيانات (ما عدا الرؤوس)
 */
function clearData() {
  const sheet = getOrCreateSheet();
  const lastRow = sheet.getLastRow();
  
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
    SpreadsheetApp.getUi().alert('✅ تم مسح جميع البيانات!');
  } else {
    SpreadsheetApp.getUi().alert('⚠️ لا توجد بيانات للمسح');
  }
}

/**
 * دالة لإضافة قائمة مخصصة إلى Google Sheets
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🌹 Rose Online')
    .addItem('🧪 اختبار الاتصال', 'testConnection')
    .addItem('🗑️ مسح البيانات', 'clearData')
    .addSeparator()
    .addItem('📖 التعليمات', 'showInstructions')
    .addToUi();
}

/**
 * دالة لعرض التعليمات
 */
function showInstructions() {
  const html = HtmlService.createHtmlOutput(
    '<h2>🌹 Rose Online - تعليمات الاستخدام</h2>' +
    '<h3>✅ تم إعداد الاتصال بنجاح!</h3>' +
    '<p><strong>الخطوات:</strong></p>' +
    '<ol>' +
    '<li>انسخ رابط Deployment URL من Deploy → Manage deployments</li>' +
    '<li>أضف الرابط في متغير البيئة GOOGLE_SHEETS_WEBHOOK_URL</li>' +
    '<li>أضف منتج جديد من الموقع</li>' +
    '<li>ستظهر البيانات تلقائياً في هذا الجدول</li>' +
    '</ol>' +
    '<p><strong>الأعمدة:</strong></p>' +
    '<ul>' +
    '<li>التاريخ والوقت</li>' +
    '<li>اسم المنتج</li>' +
    '<li>السعر</li>' +
    '<li>الوصف</li>' +
    '<li>الألوان</li>' +
    '<li>المقاسات</li>' +
    '<li>الوزن</li>' +
    '<li>كود المستودع</li>' +
    '<li>معرف القسم</li>' +
    '<li>رابط الصورة</li>' +
    '</ul>'
  );
  
  SpreadsheetApp.getUi().showModelessDialog(html, '📖 التعليمات');
}
