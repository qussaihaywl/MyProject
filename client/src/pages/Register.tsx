import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff, ArrowRight, UserPlus, Check, X } from "lucide-react";
import { Link } from "wouter";

export default function Register() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const utils = trpc.useUtils();

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePassword = (password: string) => {
    return {
      length: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*]/.test(password),
    };
  };

  const passwordValidation = validatePassword(formData.password);
  const isPasswordValid = Object.values(passwordValidation).every((v) => v);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("جميع الحقول مطلوبة");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("كلمات المرور غير متطابقة");
      return;
    }

    if (!isPasswordValid) {
      toast.error("كلمة المرور ضعيفة - يجب أن تحتوي على 8 أحرف على الأقل وأحرف كبيرة وصغيرة وأرقام");
      return;
    }

    if (!agreedToTerms) {
      toast.error("يجب الموافقة على شروط الخدمة");
      return;
    }

    setIsLoading(true);
    try {
      const result = await registerMutation.mutateAsync({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
      });

      if (result.success) {
        toast.success("تم التسجيل بنجاح! جاري تحويلك...");
        await utils.auth.me.invalidate();
        await new Promise(resolve => setTimeout(resolve, 500));
        setLocation("/account");
      } else {
        toast.error("فشل التسجيل");
      }
    } catch (error: any) {
      toast.error(error?.message || "خطأ في التسجيل");
      console.error("Register error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const PasswordStrengthIndicator = () => (
    <div className="space-y-2 mt-3">
      <p className="text-xs font-semibold text-gray-600">قوة كلمة المرور:</p>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          {passwordValidation.length ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <X className="w-4 h-4 text-gray-300" />
          )}
          <span className={`text-xs ${passwordValidation.length ? "text-green-600" : "text-gray-500"}`}>
            8 أحرف على الأقل
          </span>
        </div>
        <div className="flex items-center gap-2">
          {passwordValidation.hasUpperCase ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <X className="w-4 h-4 text-gray-300" />
          )}
          <span className={`text-xs ${passwordValidation.hasUpperCase ? "text-green-600" : "text-gray-500"}`}>
            أحرف كبيرة (A-Z)
          </span>
        </div>
        <div className="flex items-center gap-2">
          {passwordValidation.hasLowerCase ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <X className="w-4 h-4 text-gray-300" />
          )}
          <span className={`text-xs ${passwordValidation.hasLowerCase ? "text-green-600" : "text-gray-500"}`}>
            أحرف صغيرة (a-z)
          </span>
        </div>
        <div className="flex items-center gap-2">
          {passwordValidation.hasNumber ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <X className="w-4 h-4 text-gray-300" />
          )}
          <span className={`text-xs ${passwordValidation.hasNumber ? "text-green-600" : "text-gray-500"}`}>
            أرقام (0-9)
          </span>
        </div>
        <div className="flex items-center gap-2">
          {passwordValidation.hasSpecialChar ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <X className="w-4 h-4 text-gray-300" />
          )}
          <span className={`text-xs ${passwordValidation.hasSpecialChar ? "text-green-600" : "text-gray-500"}`}>
            أحرف خاصة (!@#$%^&*)
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <Link href="/">
          <button className="flex items-center gap-2 text-rose-600 hover:text-rose-700 mb-8 transition-colors duration-200 font-semibold">
            <ArrowRight className="w-5 h-5" />
            <span>العودة للرئيسية</span>
          </button>
        </Link>

        <Card className="p-8 bg-white border-2 border-rose-200 shadow-2xl rounded-2xl hover:shadow-3xl transition-all duration-300 hover:border-orange-300">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-rose-600 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-700 to-orange-600">
              إنشاء حساب
            </h1>
            <p className="text-rose-600 mt-3 text-base font-medium">انضم إلى Rose Online اليوم</p>
          </div>

          {/* Form */}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold text-rose-700 mb-2">
                الاسم الكامل
              </label>
              <Input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="أدخل اسمك الكامل"
                className="w-full border-2 border-rose-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-300 rounded-md py-3 px-4 transition-all duration-200 hover:border-orange-300"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-rose-700 mb-2">
                البريد الإلكتروني
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="أدخل بريدك الإلكتروني"
                className="w-full border-2 border-rose-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-300 rounded-md py-3 px-4 transition-all duration-200 hover:border-orange-300"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-bold text-rose-700 mb-2">
                رقم الهاتف (اختياري)
              </label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="أدخل رقم هاتفك"
                className="w-full border-2 border-rose-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-300 rounded-md py-3 px-4 transition-all duration-200 hover:border-orange-300"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-rose-700 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="أدخل كلمة مرورك"
                  className="w-full border-2 border-rose-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-300 rounded-md py-3 px-4 pr-10 transition-all duration-200 hover:border-orange-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-600 hover:text-orange-600 transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {formData.password && <PasswordStrengthIndicator />}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-bold text-rose-700 mb-2">
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="أعد إدخال كلمة مرورك"
                  className="w-full border-2 border-rose-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-300 rounded-md py-3 px-4 pr-10 transition-all duration-200 hover:border-orange-300"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-600 hover:text-orange-600 transition-colors duration-200"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-600 mt-2">كلمات المرور غير متطابقة</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 border-2 border-rose-300 rounded cursor-pointer accent-orange-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer hover:text-orange-600 transition-colors">
                أوافق على{" "}
                <span className="text-orange-600 font-semibold">شروط الخدمة</span> و{" "}
                <span className="text-orange-600 font-semibold">سياسة الخصوصية</span>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !agreedToTerms || !isPasswordValid}
              className="w-full bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-700 hover:to-orange-600 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed min-h-12"
            >
              {isLoading ? "جاري التسجيل..." : "إنشاء حساب"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-rose-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-rose-600 font-medium">أو</span>
            </div>
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-600">
            هل لديك حساب بالفعل؟{" "}
            <Link href="/login">
              <button className="text-orange-600 hover:text-orange-700 font-bold transition-colors duration-200">
                سجل الدخول
              </button>
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
