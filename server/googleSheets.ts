import axios from 'axios';
import { ENV } from './_core/env';

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID ?? '';
const SHEET_NAME = process.env.GOOGLE_SHEET_NAME ?? 'المنتجات';

// دالة لإرسال المنتج إلى Google Sheets عبر Apps Script
export async function sendProductToGoogleSheets(productData: {
  name: string;
  price: number;
  description?: string;
  colors?: string;
  sizes?: string;
  weight?: string;
  warehouseCode?: string;
  categoryId: number;
  image?: string;
  createdAt?: string;
}) {
  try {
    // بيانات المنتج المراد إرسالها
    const payload = {
      timestamp: new Date().toLocaleString('ar-JO'),
      name: productData.name,
      price: productData.price,
      description: productData.description || '',
      colors: productData.colors || '',
      sizes: productData.sizes || '',
      weight: productData.weight || '',
      warehouseCode: productData.warehouseCode || '',
      categoryId: productData.categoryId,
      image: productData.image || '',
    };

    // الحصول على رابط webhook من متغيرات البيئة
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    
    if (webhookUrl) {
      try {
        const response = await axios.post(webhookUrl, payload, {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        console.log('✅ تم إرسال المنتج إلى Google Sheets بنجاح:', response.status);
        return { success: true, data: payload };
      } catch (error: any) {
        console.error('❌ خطأ في إرسال المنتج إلى Google Sheets:', error.message);
        // لا نرمي خطأ هنا - نستمر في العملية حتى لو فشل الإرسال
        return { success: false, error: error.message, data: payload };
      }
    } else {
      // إذا لم يكن هناك webhook، نسجل البيانات فقط
      console.log('⚠️  لم يتم تعيين GOOGLE_SHEETS_WEBHOOK_URL');
      console.log('📝 بيانات المنتج المراد إرسالها:', payload);
      return { success: false, error: 'No webhook URL configured', data: payload };
    }
  } catch (error: any) {
    console.error('❌ خطأ في معالجة بيانات المنتج:', error.message);
    return { success: false, error: error.message };
  }
}

// دالة مساعدة لاختبار الاتصال
export async function testGoogleSheetsConnection() {
  try {
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    
    if (!webhookUrl) {
      return { success: false, message: 'لم يتم تعيين GOOGLE_SHEETS_WEBHOOK_URL' };
    }

    const testPayload = {
      timestamp: new Date().toLocaleString('ar-JO'),
      test: true,
      message: 'اختبار الاتصال مع Google Sheets',
    };

    const response = await axios.post(webhookUrl, testPayload, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return { success: true, message: 'الاتصال يعمل بنجاح', status: response.status };
  } catch (error: any) {
    return { success: false, message: 'فشل الاتصال', error: error.message };
  }
}
