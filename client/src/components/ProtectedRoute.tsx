import { useAuth } from "@/_core/hooks/useAuth";
import { ROLE_HIERARCHY } from "@/../../shared/roles";
import { useLocation } from "wouter";
import NotFound from "@/pages/NotFound";

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  requiredRole?: "admin" | "supervisor" | "delegate" | "user";
  minRole?: "admin" | "supervisor" | "delegate" | "user";
}

/**
 * مكون لحماية المسارات حسب دور المستخدم
 * requiredRole: يتطلب دور محدد بالضبط
 * minRole: يتطلب دور معين أو أعلى (مثلاً: minRole="supervisor" يسمح للمسؤول والمشرف)
 */
export function ProtectedRoute({
  component: Component,
  requiredRole,
  minRole,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [location] = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // التحقق من تسجيل الدخول
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">غير مصرح</h1>
          <p className="text-gray-600 mb-4">يجب عليك تسجيل الدخول أولاً</p>
          <a href="/login" className="text-blue-600 hover:underline">العودة إلى تسجيل الدخول</a>
        </div>
      </div>
    );
  }

  // التحقق من الدور المطلوب بالضبط
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">الوصول مرفوض</h1>
          <p className="text-gray-600 mb-4">ليس لديك الصلاحيات الكافية للوصول إلى هذه الصفحة</p>
          <p className="text-sm text-gray-500 mb-4">دورك الحالي: {user.role}</p>
          <a href="/" className="text-blue-600 hover:underline">العودة إلى الرئيسية</a>
        </div>
      </div>
    );
  }

  // التحقق من الحد الأدنى للدور (الهرمية)
  if (minRole && ROLE_HIERARCHY[(user as any).role as keyof typeof ROLE_HIERARCHY] < ROLE_HIERARCHY[minRole]) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">الوصول مرفوض</h1>
          <p className="text-gray-600 mb-4">ليس لديك الصلاحيات الكافية للوصول إلى هذه الصفحة</p>
          <p className="text-sm text-gray-500 mb-4">دورك الحالي: {user.role}</p>
          <a href="/" className="text-blue-600 hover:underline">العودة إلى الرئيسية</a>
        </div>
      </div>
    );
  }

  return <Component />;
}

/**
 * مكون لإظهار/إخفاء محتوى حسب دور المستخدم
 */
export function RoleBasedContent({
  children,
  requiredRole,
  minRole,
  fallback = null,
}: {
  children: React.ReactNode;
  requiredRole?: "admin" | "supervisor" | "delegate" | "user";
  minRole?: "admin" | "supervisor" | "delegate" | "user";
  fallback?: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return fallback;

  // التحقق من الدور المطلوب بالضبط
  if (requiredRole && user.role !== requiredRole) {
    return fallback;
  }

  // التحقق من الحد الأدنى للدور (الهرمية)
  if (minRole && ROLE_HIERARCHY[(user as any).role as keyof typeof ROLE_HIERARCHY] < ROLE_HIERARCHY[minRole]) {
    return fallback;
  }

  return <>{children}</>;
}
