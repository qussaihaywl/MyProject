import sgMail from "@sendgrid/mail";

const apiKey = process.env.SENDGRID_API_KEY;
const fromEmail = process.env.SENDGRID_FROM_EMAIL;

if (apiKey) {
  sgMail.setApiKey(apiKey);
}

export interface OrderEmailData {
  customerEmail?: string;
  customerName?: string;
  orderNumber: string;
  productName: string;
  productPrice: number;
  delegateCommission?: number;
  totalAmount: number;
  customerPhone?: string;
  governorate?: string;
  detailedLocation?: string;
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  if (!apiKey || !fromEmail) {
    console.warn("[Email] SendGrid not configured, skipping email");
    return false;
  }

  try {
    const totalAmount = data.totalAmount || (data.productPrice + (data.delegateCommission || 0));
    
    const htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; direction: rtl; }
          .container { max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px; }
          .header { background: linear-gradient(135deg, #c41e3a 0%, #d4a574 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 30px; }
          .order-details { background: #f9f9f9; padding: 15px; border-right: 4px solid #c41e3a; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
          .label { font-weight: bold; color: #333; }
          .value { color: #666; }
          .total { background: #f0f0f0; padding: 15px; border-radius: 5px; margin-top: 15px; }
          .total-amount { font-size: 24px; font-weight: bold; color: #c41e3a; }
          .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
          .button { background: linear-gradient(135deg, #c41e3a 0%, #d4a574 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 تأكيد استقبال طلبك</h1>
            <p>شكراً لك على اختيارك Rose Online</p>
          </div>
          
          <div class="content">
            <p>السلام عليكم ورحمة الله وبركاته</p>
            <p>مرحباً <strong>${data.customerName}</strong>،</p>
            
            <p>تم استقبال طلبك بنجاح! إليك تفاصيل الطلب:</p>
            
            <div class="order-details">
              <div class="detail-row">
                <span class="label">رقم الطلب:</span>
                <span class="value">${data.orderNumber}</span>
              </div>
              <div class="detail-row">
                <span class="label">اسم المنتج:</span>
                <span class="value">${data.productName}</span>
              </div>
              <div class="detail-row">
                <span class="label">سعر المنتج:</span>
                <span class="value">${data.productPrice.toFixed(2)} د.ا</span>
              </div>
              ${data.delegateCommission ? `
              <div class="detail-row">
                <span class="label">عمولة المندوب:</span>
                <span class="value">${data.delegateCommission.toFixed(2)} د.ا</span>
              </div>
              ` : ''}
              <div class="detail-row">
                <span class="label">المحافظة:</span>
                <span class="value">${data.governorate}</span>
              </div>
              <div class="detail-row">
                <span class="label">الموقع المفصل:</span>
                <span class="value">${data.detailedLocation}</span>
              </div>
            </div>
            
            <div class="total">
              <div class="detail-row">
                <span class="label">المبلغ الإجمالي:</span>
                <span class="total-amount">${totalAmount.toFixed(2)} د.ا</span>
              </div>
            </div>
            
            <p style="margin-top: 20px;">
              <strong>حالة الطلب:</strong> قيد الانتظار<br>
              <strong>رقم الهاتف:</strong> ${data.customerPhone}
            </p>
            
            <p>سيتم التواصل معك قريباً عبر الهاتف أو البريد الإلكتروني لتأكيد تفاصيل الطلب والموعد المتوقع للتسليم.</p>
            
            <p>إذا كان لديك أي استفسارات، يرجى التواصل معنا:</p>
            <ul>
              <li>البريد الإلكتروني: support@roseonline.jo</li>
              <li>الهاتف: +962 6 5555 5555</li>
              <li>WhatsApp: +962 79 9999 9999</li>
            </ul>
            
            <p>شكراً لاختيارك Rose Online! 🌹</p>
          </div>
          
          <div class="footer">
            <p>© 2026 Rose Online. جميع الحقوق محفوظة.</p>
            <p>هذا البريد تم إرساله تلقائياً، يرجى عدم الرد عليه.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const msg = {
      to: data.customerEmail,
      from: fromEmail,
      subject: `تأكيد الطلب - رقم الطلب: ${data.orderNumber}`,
      html: htmlContent,
      replyTo: fromEmail,
    };

    await sgMail.send(msg as any);
    console.log(`[Email] Order confirmation sent to ${data.customerEmail}`);
    return true;
  } catch (error: any) {
    console.error("[Email] Failed to send confirmation:", error.message);
    return false;
  }
}

export async function sendAdminNotificationEmail(data: OrderEmailData) {
  if (!apiKey || !fromEmail) {
    console.warn("[Email] SendGrid not configured, skipping admin notification");
    return false;
  }

  try {
    const totalAmount = data.totalAmount || (data.productPrice + (data.delegateCommission || 0));
    
    const htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; direction: rtl; }
          .container { max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px; }
          .header { background: #333; color: white; padding: 20px; text-align: center; }
          .content { background: white; padding: 20px; }
          .alert { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th, td { padding: 10px; text-align: right; border-bottom: 1px solid #ddd; }
          th { background: #f5f5f5; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🔔 طلب جديد - Rose Online</h2>
          </div>
          
          <div class="content">
            <div class="alert">
              <strong>⚠️ تنبيه:</strong> تم استقبال طلب جديد يحتاج إلى معالجة فورية
            </div>
            
            <h3>تفاصيل الطلب:</h3>
            <table>
              <tr>
                <th>رقم الطلب</th>
                <td>${data.orderNumber}</td>
              </tr>
              <tr>
                <th>اسم العميل</th>
                <td>${data.customerName}</td>
              </tr>
              <tr>
                <th>البريد الإلكتروني</th>
                <td>${data.customerEmail}</td>
              </tr>
              <tr>
                <th>رقم الهاتف</th>
                <td>${data.customerPhone}</td>
              </tr>
              <tr>
                <th>اسم المنتج</th>
                <td>${data.productName}</td>
              </tr>
              <tr>
                <th>سعر المنتج</th>
                <td>${data.productPrice.toFixed(2)} د.ا</td>
              </tr>
              <tr>
                <th>المحافظة</th>
                <td>${data.governorate}</td>
              </tr>
              <tr>
                <th>الموقع المفصل</th>
                <td>${data.detailedLocation}</td>
              </tr>
              <tr>
                <th>المبلغ الإجمالي</th>
                <td><strong>${totalAmount.toFixed(2)} د.ا</strong></td>
              </tr>
            </table>
            
            <p>يرجى تسجيل الدخول إلى لوحة التحكم لمعالجة هذا الطلب.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const msg = {
      to: fromEmail, // إرسال للإدارة
      from: fromEmail,
      subject: `🔔 طلب جديد - ${data.orderNumber}`,
      html: htmlContent,
    };

    await sgMail.send(msg as any);
    console.log(`[Email] Admin notification sent for order ${data.orderNumber}`);
    return true;
  } catch (error: any) {
    console.error("[Email] Failed to send admin notification:", error.message);
    return false;
  }
}
