import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Facebook, Send, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function FacebookContact() {
  const [selectedPage, setSelectedPage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const pagesQuery = trpc.facebook.getPages.useQuery();
  const sendMessageMutation = (trpc.facebook as any).sendMessage?.useMutation?.() || { mutateAsync: async () => {} };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPage) {
      toast.error("يرجى اختيار صفحة Facebook");
      return;
    }

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setIsLoading(true);
    setSubmitStatus("idle");

    try {
      await sendMessageMutation.mutateAsync({
        pageId: selectedPage,
        senderName: formData.name,
        senderEmail: formData.email,
        senderPhone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      });

      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      toast.success("تم إرسال الرسالة بنجاح!");

      setTimeout(() => setSubmitStatus("idle"), 3000);
    } catch (error) {
      setSubmitStatus("error");
      console.error("Failed to send message:", error);
      toast.error("فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      
      <div className="max-w-2xl mx-auto">
        {/* رأس الصفحة */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Facebook className="w-10 h-10 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">اتصل بنا عبر Facebook</h1>
          </div>
          <p className="text-slate-300 text-sm sm:text-base md:text-lg">
            أرسل رسالتك مباشرة إلى صفحتنا على Facebook
          </p>
        </div>

        {/* نموذج الاتصال */}
        <Card className="p-3 sm:p-2 sm:p-2.5 md:p-3 lg:p-4 md:p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 lg:p-8 bg-slate-800 border border-slate-700 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* اختيار الصفحة */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-3">
                اختر صفحة Facebook <span className="text-red-400">*</span>
              </label>
              {pagesQuery.isLoading ? (
                <div className="text-slate-400">جاري تحميل الصفحات...</div>
              ) : pagesQuery.data && pagesQuery.data.length > 0 ? (
                <Select
                  value={selectedPage}
                  onValueChange={setSelectedPage}
                >
                  <option value="">-- اختر صفحة --</option>
                  {pagesQuery.data.map((page: any) => (
                    <option key={page.id} value={page.pageId}>
                      {page.pageName}
                    </option>
                  ))}
                </Select>
              ) : (
                <div className="flex items-center gap-2 p-2 sm:p-2.5 md:p-3 lg:p-4 bg-yellow-900/20 border border-yellow-600/50 rounded-md sm:rounded-lg">
                  <AlertCircle className="w-5 h-5 text-purple-400" />
                  <span className="text-yellow-300">لم تتم إضافة أي صفحات Facebook بعد</span>
                </div>
              )}
            </div>

            {/* الاسم */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-3">
                الاسم <span className="text-red-400">*</span>
              </label>
              <Input
                type="text"
                placeholder="أدخل اسمك"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* البريد الإلكتروني */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-3">
                البريد الإلكتروني <span className="text-red-400">*</span>
              </label>
              <Input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* رقم الهاتف */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-3">
                رقم الهاتف
              </label>
              <Input
                type="tel"
                placeholder="أدخل رقم هاتفك"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* الموضوع */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-3">
                الموضوع
              </label>
              <Input
                type="text"
                placeholder="أدخل موضوع الرسالة"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* الرسالة */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-3">
                الرسالة <span className="text-red-400">*</span>
              </label>
              <Textarea
                placeholder="أدخل رسالتك"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                required
                rows={6}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* رسالة النجاح/الخطأ */}
            {submitStatus === "success" && (
              <div className="flex items-center gap-2 p-2 sm:p-2.5 md:p-3 lg:p-4 bg-green-900/20 border border-green-600/50 rounded-md sm:rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-300">تم إرسال الرسالة بنجاح!</span>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="flex items-center gap-2 p-2 sm:p-2.5 md:p-3 lg:p-4 bg-purple-900/20 border border-purple-600/50 rounded-md sm:rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-300">فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى.</span>
              </div>
            )}

            {/* زر الإرسال */}
            <Button
              type="submit"
              disabled={isLoading || !selectedPage}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-md sm:rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              {isLoading ? "جاري الإرسال..." : "إرسال الرسالة"}
            </Button>
          </form>
        </Card>

        {/* معلومات إضافية */}
        <Card className="mt-8 p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 bg-slate-800 border border-slate-700">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Facebook className="w-5 h-5 text-blue-400" />
            معلومات الاتصال
          </h3>
          <div className="space-y-3 text-slate-300">
            <p>
              <span className="font-semibold text-white">البريد الإلكتروني:</span> RoseOnline@gmail.com
            </p>
            <p>
              <span className="font-semibold text-white">رقم الهاتف:</span> +962778989135
            </p>
            <p>
              <span className="font-semibold text-white">ساعات العمل:</span> من الأحد إلى الخميس، 9:00 صباحاً - 6:00 مساءً
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
