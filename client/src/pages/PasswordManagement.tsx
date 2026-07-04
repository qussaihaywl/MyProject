import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function PasswordManagement() {
  const { user } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const changePasswordMutation = trpc.users.changePassword.useMutation({
    onSuccess: () => {
      toast.success("تم تغيير كلمة المرور بنجاح");
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    },
    onError: (error) => {
      toast.error(error.message || "حدث خطأ أثناء تغيير كلمة المرور");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("كلمات المرور الجديدة غير متطابقة");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    setLoading(true);
    try {
      await changePasswordMutation.mutateAsync(formData);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const passwordStrength = (password: string) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = passwordStrength(formData.newPassword);
  const strengthColor = 
    strength <= 1 ? "bg-red-500" :
    strength <= 2 ? "bg-orange-500" :
    strength <= 3 ? "bg-yellow-500" :
    strength <= 4 ? "bg-lime-500" :
    "bg-green-500";

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">إدارة كلمة المرور</h1>
          <p className="text-gray-600">غير كلمة المرور الخاصة بك بأمان</p>
        </div>

        {/* Main Card */}
        <Card className="p-3 sm:p-2 sm:p-2.5 md:p-3 lg:p-4 md:p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 lg:p-8 shadow-lg border-rose-200">
          {/* User Info */}
          <div className="mb-8 p-2 sm:p-2.5 md:p-3 lg:p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-md sm:rounded-lg border border-rose-200">
            <p className="text-sm text-gray-600">المستخدم الحالي</p>
            <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div>
              <Label htmlFor="currentPassword" className="text-gray-700 font-semibold">
                كلمة المرور الحالية
              </Label>
              <div className="relative mt-2">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="أدخل كلمة المرور الحالية"
                  className="pr-10 border-rose-200 focus:border-rose-500"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <Label htmlFor="newPassword" className="text-gray-700 font-semibold">
                كلمة المرور الجديدة
              </Label>
              <div className="relative mt-2">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="أدخل كلمة المرور الجديدة"
                  className="pr-10 border-rose-200 focus:border-rose-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password Strength */}
              {formData.newPassword && (
                <div className="mt-3">
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full transition-colors ${
                          i < strength ? strengthColor : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">
                    {strength <= 1 && "كلمة مرور ضعيفة"}
                    {strength === 2 && "كلمة مرور متوسطة"}
                    {strength === 3 && "كلمة مرور جيدة"}
                    {strength === 4 && "كلمة مرور قوية"}
                    {strength === 5 && "كلمة مرور قوية جداً"}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword" className="text-gray-700 font-semibold">
                تأكيد كلمة المرور الجديدة
              </Label>
              <div className="relative mt-2">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="أعد إدخال كلمة المرور الجديدة"
                  className="pr-10 border-rose-200 focus:border-rose-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Match Status */}
              {formData.newPassword && formData.confirmPassword && (
                <div className="mt-2 flex items-center gap-2">
                  {formData.newPassword === formData.confirmPassword ? (
                    <>
                      <CheckCircle size={18} className="text-green-500" />
                      <span className="text-sm text-green-600">كلمات المرور متطابقة</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={18} className="text-red-500" />
                      <span className="text-sm text-red-600">كلمات المرور غير متطابقة</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold py-2 rounded-md sm:rounded-lg transition-all duration-200"
            >
              {loading ? "جاري التحديث..." : "تحديث كلمة المرور"}
            </Button>
          </form>

          {/* Security Tips */}
          <div className="mt-8 p-2 sm:p-2.5 md:p-3 lg:p-4 bg-blue-50 rounded-md sm:rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">نصائح الأمان:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ استخدم كلمة مرور قوية تحتوي على أحرف وأرقام ورموز</li>
              <li>✓ لا تشارك كلمة المرور مع أحد</li>
              <li>✓ غير كلمة المرور بشكل دوري</li>
              <li>✓ استخدم كلمات مرور مختلفة لكل موقع</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
