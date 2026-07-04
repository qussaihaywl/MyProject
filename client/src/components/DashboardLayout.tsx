import { useIsMobile } from "@/hooks/useMobile";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { LayoutDashboard, LogOut, Users, Package, BarChart3, Settings, ShoppingCart, Bell } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { DashboardLayoutSkeleton } from './DashboardLayoutSkeleton';

const menuItems = [
  { icon: LayoutDashboard, label: "لوحة التحكم", path: "/dashboard", id: "dashboard" },
  { icon: Package, label: "إدارة المنتجات", path: "/products-management", id: "products" },
  { icon: ShoppingCart, label: "الطلبات", path: "/orders", id: "orders" },
  { icon: BarChart3, label: "الإحصائيات", path: "/analytics", id: "analytics" },
  { icon: Users, label: "المستخدمون", path: "/users", id: "users" },
  { icon: Bell, label: "الإشعارات", path: "/notifications", id: "notifications" },
  { icon: Settings, label: "الإعدادات", path: "/settings", id: "settings" },
];

function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [location, setLocation] = useLocation();
  const { loading, user, logout } = useAuth();
  const isMobile = useIsMobile();

  if (loading) {
    return <DashboardLayoutSkeleton />
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-8 p-8 max-w-md w-full">
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-2xl font-semibold tracking-tight text-center">
              تسجيل الدخول مطلوب
            </h1>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              يتطلب الوصول إلى لوحة التحكم المصادقة. انقر لبدء عملية تسجيل الدخول.
            </p>
          </div>
          <Button
            onClick={() => {
              setLocation("/login");
            }}
            size="lg"
            className="w-full shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-amber-600 to-orange-600"
          >
            تسجيل الدخول
          </Button>
        </div>
      </div>
    );
  }

  const activeItem = menuItems.find(item => location === item.path);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Header with Logo */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
              <span className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">🌹</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Rose Online</h1>
              <p className="text-amber-100 text-xs">لوحة التحكم</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right text-white">
              <p className="font-semibold text-sm">{user?.email || "المستخدم"}</p>
              <p className="text-xs text-amber-100">{user?.role === 'admin' ? 'مسؤول' : 'مستخدم'}</p>
            </div>
            <Button
              onClick={() => logout()}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <LogOut size={18} className="mr-2" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </div>

      {/* Horizontal Tabs Navigation */}
      <div className="bg-white border-b border-amber-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-1 py-0">
            {menuItems.map((item) => {
              const isActive = location === item.path;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setLocation(item.path)}
                  className={`
                    flex items-center gap-2 px-4 py-4 font-medium text-sm
                    transition-all duration-300 whitespace-nowrap
                    border-b-2 relative group
                    ${isActive
                      ? 'border-b-amber-600 text-amber-600 bg-amber-50'
                      : 'border-b-transparent text-gray-600 hover:text-amber-600 hover:bg-amber-50/50'
                    }
                  `}
                >
                  <Icon size={18} className={`transition-transform ${isActive ? 'scale-110' : ''}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-600 to-orange-600 rounded-t-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 min-h-[calc(100vh-250px)]">
          {children}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-amber-900 to-orange-900 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-amber-100">© 2026 Rose Online. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
