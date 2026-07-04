import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff, ArrowRight, LogIn, Lock, Mail } from "lucide-react";
import { Link } from "wouter";

export default function Login() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const utils = trpc.useUtils();
  const [mounted, setMounted] = useState(false);

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
    },
  });

  // Load remembered email on mount
  if (!mounted) {
    const remembered = localStorage.getItem("rememberEmail");
    if (remembered && !formData.email) {
      setFormData(prev => ({ ...prev, email: remembered }));
      setRememberMe(true);
    }
    setMounted(true);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("جميع الحقول مطلوبة");
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        // Save token to localStorage
        if (result.token) {
          localStorage.setItem("auth_token", result.token);
          console.log("Token saved to localStorage:", result.token);
        }
        
        if (rememberMe) {
          localStorage.setItem("rememberEmail", formData.email);
        } else {
          localStorage.removeItem("rememberEmail");
        }
        
        toast.success("تم تسجيل الدخول بنجاح! جاري تحويلك...");
        await utils.auth.me.invalidate();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Redirect based on user role
        if (result.user?.role === "admin") {
          setLocation("/admin");
        } else {
          setLocation("/account");
        }
      } else {
        toast.error("فشل تسجيل الدخول");
      }
    } catch (error: any) {
      toast.error(error?.message || "خطأ في تسجيل الدخول");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 py-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        <Link href="/">
          <button className="flex items-center gap-2 text-rose-600 hover:text-rose-700 mb-8 transition-colors duration-200 font-semibold">
            <ArrowRight className="w-5 h-5" />
            العودة للرئيسية
          </button>
        </Link>

        <Card className="p-8 bg-white border-2 border-rose-200 shadow-2xl rounded-2xl hover:shadow-3xl transition-all duration-300 hover:border-orange-300">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-rose-600 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <LogIn className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-700 to-orange-600">
              تسجيل الدخول
            </h1>
            <p className="text-rose-600 mt-3 text-base font-medium">مرحباً بك في Rose Online</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-rose-700 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="أدخل بريدك الإلكتروني"
                  className="w-full border-2 border-rose-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-300 rounded-md py-3 px-4 pr-10 transition-all duration-200 hover:border-orange-300"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-400 w-5 h-5" />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-rose-700">
                  كلمة المرور
                </label>
                <Link href="/forgot-password">
                  <button className="text-xs text-orange-600 hover:text-orange-700 font-semibold transition-colors">
                    هل نسيت كلمة المرور؟
                  </button>
                </Link>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="أدخل كلمة مرورك"
                  className="w-full border-2 border-rose-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-300 rounded-md py-3 px-4 pr-10 transition-all duration-200 hover:border-orange-300"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <Lock className="text-rose-400 w-5 h-5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-rose-600 hover:text-orange-600 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 border-2 border-rose-300 rounded cursor-pointer accent-orange-500"
              />
              <label htmlFor="rememberMe" className="text-sm text-gray-600 cursor-pointer hover:text-orange-600 transition-colors">
                تذكرني
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-700 hover:to-orange-600 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed min-h-12"
            >
              {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
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

          {/* Register Link */}
          <p className="text-center text-gray-600">
            ليس لديك حساب؟{" "}
            <Link href="/register">
              <button className="text-orange-600 hover:text-orange-700 font-bold transition-colors duration-200">
                سجل الآن
              </button>
            </Link>
          </p>

          {/* Security Info */}
          <div className="mt-6 p-4 bg-gradient-to-r from-rose-50 to-orange-50 rounded-lg border border-rose-200">
            <p className="text-xs text-gray-600 text-center">
              🔒 بيانات حسابك محمية بتشفير عالي المستوى
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
