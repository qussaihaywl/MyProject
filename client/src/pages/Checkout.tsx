import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CheckCircle, Truck, Lock, CreditCard, MapPin, Package, AlertCircle, Check } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function Checkout() {
  return (
    <>
      
      <CheckoutContent />
    </>
  );
}

function CheckoutContent() {
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"shipping" | "payment" | "confirmation">("shipping");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "wallet" | "cash">("card");
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    notes: "",
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  // Get cart items
  const cartQuery = trpc.cart.getItems.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <Card className="p-8 text-center bg-white shadow-lg rounded-lg">
            <AlertCircle className="w-16 h-16 text-rose-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-3">يجب تسجيل الدخول أولاً</h2>
            <p className="text-gray-600 mb-6">يرجى تسجيل الدخول لإتمام عملية الشراء</p>
            <Link href="/login">
              <a className="inline-block bg-rose-600 text-white px-8 py-3 rounded-lg hover:bg-rose-700 transition-all font-bold">
                تسجيل الدخول
              </a>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const cartItems = cartQuery.data || [];
  const subtotal = cartItems.reduce((sum: number, item: any) => sum + (parseFloat(item.price?.toString() || '0') * item.quantity), 0);
  const tax = subtotal * 0.16;
  const shipping = subtotal > 500 ? 0 : 30;
  const total = subtotal + tax + shipping;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city) {
      toast.error("جميع حقول التوصيل مطلوبة");
      return;
    }
    setStep("payment");
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod === "card") {
      if (!paymentInfo.cardName || !paymentInfo.cardNumber || !paymentInfo.expiryDate || !paymentInfo.cvv) {
        toast.error("جميع حقول الدفع مطلوبة");
        return;
      }
    }

    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      const orderNum = `ORD${Date.now().toString().slice(-8)}`;
      setOrderNumber(orderNum);
      toast.success("تم معالجة الدفع بنجاح!");
      setStep("confirmation");
    } catch (error) {
      toast.error("فشل معالجة الدفع");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 pb-16">
      {/* Header */}
      <div className="bg-white border-b border-rose-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">إتمام الشراء</h1>
            <Link href="/cart">
              <a className="flex items-center gap-2 text-rose-600 hover:text-rose-700 font-semibold">
                <ArrowLeft className="w-5 h-5" />
                العودة للسلة
              </a>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {step === "confirmation" ? (
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 sm:p-12 text-center bg-white shadow-lg rounded-lg">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">شكراً لك!</h2>
              <p className="text-gray-600 mb-8 text-lg">تم استقبال طلبك بنجاح. سيتم معالجته قريباً.</p>
              
              <div className="bg-gradient-to-r from-rose-50 to-orange-50 p-6 rounded-lg mb-8 text-left border-2 border-rose-200">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-rose-200">
                    <span className="text-gray-600 font-semibold">رقم الطلب:</span>
                    <span className="font-bold text-gray-900 text-lg">#{orderNumber}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-rose-200">
                    <span className="text-gray-600 font-semibold">الإجمالي:</span>
                    <span className="font-bold text-rose-600 text-lg">{total.toFixed(2)} د.ا</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-semibold">طريقة الدفع:</span>
                    <span className="font-bold text-gray-900">
                      {paymentMethod === "card" ? "بطاقة ائتمان" : paymentMethod === "wallet" ? "المحفظة الرقمية" : "الدفع عند الاستقبال"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded mb-8 text-left">
                <p className="text-blue-900 text-sm">
                  ✓ سيتم إرسال تأكيد الطلب إلى بريدك الإلكتروني
                </p>
                <p className="text-blue-900 text-sm mt-2">
                  ✓ متوسط وقت التوصيل: 3-5 أيام عمل
                </p>
              </div>

              <div className="space-y-3">
                <Link href="/products">
                  <a className="block w-full bg-gradient-to-r from-rose-600 to-orange-500 text-white py-3 rounded-lg hover:shadow-lg transition-all font-bold">
                    متابعة التسوق
                  </a>
                </Link>
                <Link href="/">
                  <a className="block w-full bg-white text-rose-600 py-3 rounded-lg border-2 border-rose-200 hover:border-rose-600 transition-all font-bold">
                    العودة للرئيسية
                  </a>
                </Link>
              </div>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step Indicator */}
              <div className="flex gap-4">
                <div className={`flex-1 p-4 rounded-lg text-center font-bold transition-all ${step === "shipping" ? "bg-rose-600 text-white shadow-lg" : "bg-white text-gray-700 border-2 border-rose-200"}`}>
                  <MapPin className="w-5 h-5 mx-auto mb-2" />
                  التوصيل
                </div>
                <div className={`flex-1 p-4 rounded-lg text-center font-bold transition-all ${step === "payment" ? "bg-rose-600 text-white shadow-lg" : "bg-white text-gray-700 border-2 border-rose-200"}`}>
                  <CreditCard className="w-5 h-5 mx-auto mb-2" />
                  الدفع
                </div>
              </div>

              {/* Shipping Form */}
              {step === "shipping" && (
                <Card className="p-6 bg-white shadow-lg rounded-lg">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">معلومات التوصيل</h2>
                  <form onSubmit={handleShippingSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">الاسم الكامل</label>
                      <Input
                        type="text"
                        value={shippingInfo.fullName}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                        placeholder="أدخل اسمك الكامل"
                        className="w-full border-2 border-rose-200 rounded-lg focus:border-rose-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">رقم الهاتف</label>
                      <Input
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                        placeholder="+962 7 XXXX XXXX"
                        className="w-full border-2 border-rose-200 rounded-lg focus:border-rose-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">العنوان</label>
                      <Input
                        type="text"
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                        placeholder="أدخل عنوانك الكامل"
                        className="w-full border-2 border-rose-200 rounded-lg focus:border-rose-600 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">المدينة</label>
                        <Input
                          type="text"
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                          placeholder="المدينة"
                          className="w-full border-2 border-rose-200 rounded-lg focus:border-rose-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">الرمز البريدي</label>
                        <Input
                          type="text"
                          value={shippingInfo.zipCode}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                          placeholder="الرمز البريدي"
                          className="w-full border-2 border-rose-200 rounded-lg focus:border-rose-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">ملاحظات إضافية (اختياري)</label>
                      <textarea
                        value={shippingInfo.notes}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, notes: e.target.value })}
                        placeholder="أضف أي ملاحظات خاصة للتوصيل..."
                        rows={3}
                        className="w-full border-2 border-rose-200 rounded-lg focus:border-rose-600 focus:outline-none p-3 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-rose-600 to-orange-500 text-white py-4 rounded-lg hover:shadow-lg transition-all font-bold text-lg mt-6"
                    >
                      متابعة إلى الدفع
                    </button>
                  </form>
                </Card>
              )}

              {/* Payment Form */}
              {step === "payment" && (
                <Card className="p-6 bg-white shadow-lg rounded-lg">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">معلومات الدفع</h2>
                  
                  {/* Payment Method Selection */}
                  <div className="mb-6 space-y-3">
                    <label className="block text-sm font-bold text-gray-700 mb-3">طريقة الدفع</label>
                    
                    <div
                      onClick={() => setPaymentMethod("card")}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentMethod === "card"
                          ? "border-rose-600 bg-rose-50"
                          : "border-gray-200 hover:border-rose-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className={`w-5 h-5 ${paymentMethod === "card" ? "text-rose-600" : "text-gray-400"}`} />
                        <span className="font-semibold">بطاقة ائتمان</span>
                        {paymentMethod === "card" && <Check className="w-5 h-5 text-rose-600 ml-auto" />}
                      </div>
                    </div>

                    <div
                      onClick={() => setPaymentMethod("wallet")}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentMethod === "wallet"
                          ? "border-rose-600 bg-rose-50"
                          : "border-gray-200 hover:border-rose-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Package className={`w-5 h-5 ${paymentMethod === "wallet" ? "text-rose-600" : "text-gray-400"}`} />
                        <span className="font-semibold">المحفظة الرقمية</span>
                        {paymentMethod === "wallet" && <Check className="w-5 h-5 text-rose-600 ml-auto" />}
                      </div>
                    </div>

                    <div
                      onClick={() => setPaymentMethod("cash")}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentMethod === "cash"
                          ? "border-rose-600 bg-rose-50"
                          : "border-gray-200 hover:border-rose-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Truck className={`w-5 h-5 ${paymentMethod === "cash" ? "text-rose-600" : "text-gray-400"}`} />
                        <span className="font-semibold">الدفع عند الاستقبال</span>
                        {paymentMethod === "cash" && <Check className="w-5 h-5 text-rose-600 ml-auto" />}
                      </div>
                    </div>
                  </div>

                  {/* Card Payment Form */}
                  {paymentMethod === "card" && (
                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">اسم حامل البطاقة</label>
                        <Input
                          type="text"
                          value={paymentInfo.cardName}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                          placeholder="الاسم على البطاقة"
                          className="w-full border-2 border-rose-200 rounded-lg focus:border-rose-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">رقم البطاقة</label>
                        <Input
                          type="text"
                          value={paymentInfo.cardNumber}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className="w-full border-2 border-rose-200 rounded-lg focus:border-rose-600 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">تاريخ الانتهاء</label>
                          <Input
                            type="text"
                            value={paymentInfo.expiryDate}
                            onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="w-full border-2 border-rose-200 rounded-lg focus:border-rose-600 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">CVV</label>
                          <Input
                            type="text"
                            value={paymentInfo.cvv}
                            onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                            placeholder="123"
                            maxLength={3}
                            className="w-full border-2 border-rose-200 rounded-lg focus:border-rose-600 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 mt-6">
                        <button
                          type="button"
                          onClick={() => setStep("shipping")}
                          className="flex-1 bg-white text-rose-600 py-3 rounded-lg border-2 border-rose-200 hover:border-rose-600 transition-all font-bold"
                        >
                          العودة
                        </button>
                        <button
                          type="submit"
                          disabled={isProcessing}
                          className="flex-1 bg-gradient-to-r from-rose-600 to-orange-500 text-white py-3 rounded-lg hover:shadow-lg transition-all font-bold disabled:opacity-50"
                        >
                          {isProcessing ? "جاري المعالجة..." : "إتمام الدفع"}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Other Payment Methods */}
                  {paymentMethod !== "card" && (
                    <div className="space-y-4">
                      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                        <p className="text-blue-900 font-semibold">
                          {paymentMethod === "wallet"
                            ? "سيتم تحويلك إلى صفحة المحفظة الرقمية"
                            : "ستتمكن من الدفع عند استقبال الطلب"}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setStep("shipping")}
                          className="flex-1 bg-white text-rose-600 py-3 rounded-lg border-2 border-rose-200 hover:border-rose-600 transition-all font-bold"
                        >
                          العودة
                        </button>
                        <button
                          onClick={handlePaymentSubmit}
                          disabled={isProcessing}
                          className="flex-1 bg-gradient-to-r from-rose-600 to-orange-500 text-white py-3 rounded-lg hover:shadow-lg transition-all font-bold disabled:opacity-50"
                        >
                          {isProcessing ? "جاري المعالجة..." : "إتمام الطلب"}
                        </button>
                      </div>
                    </div>
                  )}
                </Card>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 bg-white shadow-lg rounded-lg sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-6">ملخص الطلب</h3>
                
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cartItems.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-start pb-3 border-b border-gray-200">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">الكمية: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-gray-900 text-sm">
                        {(parseFloat(item.price?.toString() || '0') * item.quantity).toFixed(2)} د.ا
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t-2 border-gray-200 pt-4">
                  <div className="flex justify-between text-gray-700">
                    <span>المجموع الفرعي:</span>
                    <span className="font-semibold">{subtotal.toFixed(2)} د.ا</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>الضريبة (16%):</span>
                    <span className="font-semibold">{tax.toFixed(2)} د.ا</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>الشحن:</span>
                    <span className={`font-semibold ${shipping === 0 ? "text-green-600" : ""}`}>
                      {shipping === 0 ? "مجاني" : `${shipping.toFixed(2)} د.ا`}
                    </span>
                  </div>
                  {shipping === 0 && (
                    <p className="text-xs text-green-600 bg-green-50 p-2 rounded">✓ شحن مجاني للطلبات فوق 500 د.ا</p>
                  )}
                </div>

                <div className="border-t-2 border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">الإجمالي:</span>
                    <span className="text-2xl font-bold text-rose-600">{total.toFixed(2)} د.ا</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-600 rounded">
                  <p className="text-sm text-green-900 font-semibold">✓ شراء آمن 100%</p>
                  <p className="text-xs text-green-700 mt-1">بيانات الدفع محمية بتشفير SSL</p>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
