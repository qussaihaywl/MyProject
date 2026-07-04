import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, Clock, Send, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Contact() {
  return (
    <>
      
      <ContactContent />
    </>
  );
}

function ContactContent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("جميع الحقول مطلوبة");
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("تم إرسال رسالتك بنجاح! سنرد عليك قريباً.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error("فشل إرسال الرسالة");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 pb-12">
      {/* Page Title */}
      <div className="bg-gradient-to-r from-rose-600 via-orange-500 to-rose-600 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">تواصل معنا</h1>
          <p className="text-rose-100 text-sm sm:text-base">نحن هنا للإجابة على جميع استفساراتك والرد على أسئلتك</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:p-2.5 md:p-3 lg:p-4 sm:gap-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 mb-8 sm:mb-12">
          {/* Email Card */}
          <Card className="p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 sm:p-3 sm:p-2 sm:p-2.5 md:p-3 lg:p-4 md:p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 lg:p-8 text-center bg-white shadow-lg rounded-md sm:rounded-lg border-2 border-rose-100 hover:shadow-xl transition-all">
            <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-rose-600" />
            </div>
            <h3 className="text-sm sm:text-base md:text-lg sm:text-base sm:text-sm sm:text-base md:text-lg md:text-xl font-bold text-gray-900 mb-2">البريد الإلكتروني</h3>
            <p className="text-rose-600 font-bold mb-2">RoseOnline@gmail.com</p>
            <p className="text-sm text-gray-600">نرد على الرسائل خلال 24 ساعة</p>
          </Card>

          {/* Phone Card */}
          <Card className="p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 sm:p-3 sm:p-2 sm:p-2.5 md:p-3 lg:p-4 md:p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 lg:p-8 text-center bg-white shadow-lg rounded-md sm:rounded-lg border-2 border-rose-100 hover:shadow-xl transition-all">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-sm sm:text-base md:text-lg sm:text-base sm:text-sm sm:text-base md:text-lg md:text-xl font-bold text-gray-900 mb-2">الهاتف</h3>
            <p className="text-orange-600 font-bold mb-2">0778989135</p>
            <p className="text-sm text-gray-600">من الأحد إلى الخميس 8 صباحاً - 10 مساءً</p>
          </Card>

          {/* Location Card */}
          <Card className="p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 sm:p-3 sm:p-2 sm:p-2.5 md:p-3 lg:p-4 md:p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 lg:p-8 text-center bg-white shadow-lg rounded-md sm:rounded-lg border-2 border-rose-100 hover:shadow-xl transition-all sm:col-span-2 lg:col-span-1">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-sm sm:text-base md:text-lg sm:text-base sm:text-sm sm:text-base md:text-lg md:text-xl font-bold text-gray-900 mb-2">العنوان</h3>
            <p className="text-pink-600 font-bold mb-2">الزرقاء، الأردن</p>
            <p className="text-sm text-gray-600">المملكة الأردنية الهاشمية</p>
          </Card>
        </div>

        {/* Contact Form and Hours */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 sm:gap-3 sm:p-2 sm:p-2.5 md:p-3 lg:p-4 md:p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 lg:p-8 mb-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 sm:p-3 sm:p-2 sm:p-2.5 md:p-3 lg:p-4 md:p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 lg:p-8 bg-white shadow-lg rounded-md sm:rounded-lg border-2 border-rose-100">
              <h2 className="text-sm sm:text-base md:text-lg sm:text-base sm:text-sm sm:text-base md:text-lg md:text-xl md:text-2xl sm:text-3xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-rose-100">
                أرسل لنا رسالة
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">الاسم</label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="أدخل اسمك الكامل"
                    className="w-full border-2 border-rose-200 rounded-md sm:rounded-lg focus:border-rose-600 focus:ring-rose-600 py-2 sm:py-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full border-2 border-rose-200 rounded-md sm:rounded-lg focus:border-rose-600 focus:ring-rose-600 py-2 sm:py-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">الموضوع</label>
                  <Input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="موضوع الرسالة"
                    className="w-full border-2 border-rose-200 rounded-md sm:rounded-lg focus:border-rose-600 focus:ring-rose-600 py-2 sm:py-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">الرسالة</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="اكتب رسالتك هنا..."
                    rows={6}
                    className="w-full border-2 border-rose-200 rounded-md sm:rounded-lg focus:border-rose-600 focus:ring-rose-600 p-3 font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-rose-600 to-orange-500 text-white font-bold py-3 sm:py-4 rounded-md sm:rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      إرسال الرسالة
                    </>
                  )}
                </button>
              </form>
            </Card>
          </div>

          {/* Business Hours */}
          <div>
            <Card className="p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 sm:p-3 sm:p-2 sm:p-2.5 md:p-3 lg:p-4 md:p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 lg:p-8 bg-white shadow-lg rounded-md sm:rounded-lg border-2 border-rose-100 sticky top-24">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-rose-100">
                <div className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 bg-gradient-to-br from-rose-100 to-orange-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900">ساعات العمل</h3>
              </div>

              <div className="space-y-4">
                <div className="pb-4 border-b border-gray-200">
                  <p className="font-bold text-gray-900 mb-1">الأحد - الخميس</p>
                  <p className="text-rose-600 font-medium">8:00 صباحاً - 10:00 مساءً</p>
                </div>

                <div className="pb-4 border-b border-gray-200">
                  <p className="font-bold text-gray-900 mb-1">الجمعة والسبت</p>
                  <p className="text-orange-600 font-medium">8:00 صباحاً - 10:00 مساءً</p>
                </div>
              </div>

              <div className="mt-6 p-2 sm:p-2.5 md:p-3 lg:p-4 bg-rose-50 rounded-md sm:rounded-lg border-l-4 border-rose-600">
                <p className="text-sm text-gray-700">
                  <span className="font-bold text-rose-600">ملاحظة:</span> في الأعياد الرسمية قد تكون ساعات العمل مختلفة
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">الأسئلة الشائعة</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-rose-600 to-orange-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:p-2.5 md:p-3 lg:p-4 sm:gap-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6">
            {/* FAQ Item 1 */}
            <Card className="p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 bg-white shadow-md rounded-md sm:rounded-lg border-l-4 border-rose-600 hover:shadow-lg transition-all">
              <h3 className="font-bold text-gray-900 mb-3 text-base sm:text-sm sm:text-base md:text-lg">كيف أتابع طلبي؟</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                يمكنك متابعة طلبك من خلال التواصل معنا عبر WhatsApp على الرقم +962778989135
              </p>
            </Card>

            {/* FAQ Item 2 */}
            <Card className="p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 bg-white shadow-md rounded-md sm:rounded-lg border-l-4 border-orange-500 hover:shadow-lg transition-all">
              <h3 className="font-bold text-gray-900 mb-3 text-base sm:text-sm sm:text-base md:text-lg">ما هي سياسة الإرجاع؟</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                لا يمكن إرجاع المنتجات لأنه لديك حق معاينة المنتج قبل الاستلام. إذا لم يناسبك المنتج، تدفع فقط رسوم التوصيل
              </p>
            </Card>

            {/* FAQ Item 3 */}
            <Card className="p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 bg-white shadow-md rounded-md sm:rounded-lg border-l-4 border-pink-600 hover:shadow-lg transition-all">
              <h3 className="font-bold text-gray-900 mb-3 text-base sm:text-sm sm:text-base md:text-lg">كم تستغرق عملية الشحن؟</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                يستغرق وصول المنتج من 24 إلى 48 ساعة
              </p>
            </Card>

            {/* FAQ Item 4 */}
            <Card className="p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 bg-white shadow-md rounded-md sm:rounded-lg border-l-4 border-purple-500 hover:shadow-lg transition-all">
              <h3 className="font-bold text-gray-900 mb-3 text-base sm:text-sm sm:text-base md:text-lg">هل يوجد رسوم توصيل إضافية؟</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                لا يوجد رسوم توصيل إضافية. جميع الرسوم مشمولة في السعر
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
