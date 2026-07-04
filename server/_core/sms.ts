import twilio from "twilio";
import { ENV } from "./env";

const accountSid = ENV.twilioAccountSid;
const authToken = ENV.twilioAuthToken;
const fromNumber = ENV.twilioPhoneNumber;

let client: ReturnType<typeof twilio> | null = null;

if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

export interface SMSData {
  to: string;
  message: string;
}

export async function sendSMS(data: SMSData): Promise<boolean> {
  if (!client || !fromNumber) {
    console.warn("[SMS] Twilio not configured, skipping SMS");
    return false;
  }

  try {
    const result = await client.messages.create({
      body: data.message,
      from: fromNumber,
      to: data.to,
    });

    console.log(`[SMS] Message sent successfully to ${data.to}. SID: ${result.sid}`);
    return true;
  } catch (error) {
    console.error("[SMS] Failed to send SMS:", error);
    return false;
  }
}

export async function sendOrderStatusUpdateSMS(
  phoneNumber: string,
  orderNumber: string,
  status: string,
  statusLabel: string
): Promise<boolean> {
  const statusMessages = {
    pending: "تم استقبال طلبك وجاري المراجعة",
    processing: "جاري تجهيز الطلب للشحن",
    shipped: "تم شحن الطلب، جاري التوصيل",
    delivered: "تم تسليم الطلب بنجاح",
    cancelled: "تم إلغاء الطلب",
  };

  const message = `
🌹 Rose Online - تحديث الطلب
━━━━━━━━━━━━━━━━━━━━━━━━
رقم الطلب: ${orderNumber}
الحالة: ${statusLabel}
${statusMessages[status as keyof typeof statusMessages] || "تحديث الطلب"}
━━━━━━━━━━━━━━━━━━━━━━━━
شكراً لتسوقك معنا!
  `.trim();

  return sendSMS({
    to: phoneNumber,
    message,
  });
}

export async function sendOrderConfirmationSMS(
  phoneNumber: string,
  orderNumber: string,
  totalAmount: number
): Promise<boolean> {
  const message = `
🌹 Rose Online - تأكيد الطلب
━━━━━━━━━━━━━━━━━━━━━━━━
شكراً لك على طلبك!
رقم الطلب: ${orderNumber}
المبلغ الإجمالي: ${totalAmount} د.ا
━━━━━━━━━━━━━━━━━━━━━━━━
سيتم التواصل معك قريباً
  `.trim();

  return sendSMS({
    to: phoneNumber,
    message,
  });
}
