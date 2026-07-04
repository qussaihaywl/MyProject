import { useState } from "react";
import { Link } from "wouter";
import { 
  Menu, X, Home, ShoppingBag, MessageSquare, Phone, ShoppingCart, User, BarChart3, 
  Users, Video, Layers, LogOut, Settings, Bell, Heart, Package, Search, ChevronDown,
  Shield, LogIn, UserPlus, Eye, EyeOff
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ROLE_HIERARCHY } from "@/../../shared/roles";

export default function Navigation() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuth();

  const menuItems = [
    { href: "/", label: "الرئيسية", icon: Home },
    { href: "/products", label: "المنتجات", icon: ShoppingBag },
    { href: "/contact", label: "اتصل بنا", icon: Phone },
    { href: "/cart", label: "السلة", icon: ShoppingCart },
    { href: "/account", label: "حسابي", icon: User },
    { href: "/admin", label: "لوحة التحكم", icon: BarChart3 },
    { href: "/categories", label: "الفئات", icon: Layers },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/advanced-search?q=${encodeURIComponent(searchQuery)}`;
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* Top Navigation */}
      <nav className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 shadow-lg z-50 backdrop-blur-sm bg-opacity-95 border-b-2 border-amber-500/50 h-14 sm:h-16 hover:shadow-xl hover:shadow-amber-600/50 transition-all duration-300">
        <div className="w-full px-2 sm:px-4 h-full">
          <div className="flex justify-between items-center h-full gap-2">
            {/* Left Section - Menu & Logo */}
            <div className="flex items-center gap-2">
              {/* Toggle Sidebar Button - Left */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-white p-1.5 hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-110"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              {/* Logo / Brand */}
              <Link href="/">
                <button className="flex items-center gap-1 hover:opacity-90 transition-all duration-200 hover:scale-110">
                  <img 
                    src="/logo.png" 
                    alt="Rose Online Logo" 
                    className="h-10 w-10 object-cover rounded-full border-2 border-white shadow-lg hover:shadow-red-600/50" 
                    loading="eager"
                  />
                </button>
              </Link>

              {/* Rose Online Text */}
              <h1 className="text-sm sm:text-base font-bold text-white hidden xs:block">Rose Online</h1>
            </div>

            {/* Right Section - Actions & User Menu */}
            <div className="flex items-center gap-1 sm:gap-2">

              {/* Wishlist Button */}
              <Link href="/wishlist">
                <button className="text-white p-1.5 hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-110">
                  <Heart size={22} />
                </button>
              </Link>

              {/* Cart Button */}
              <Link href="/cart">
                <button className="text-white p-1.5 hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-110 relative">
                  <ShoppingCart size={22} />
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-red-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">0</span>
                </button>
              </Link>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="text-white p-1.5 hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-110 flex items-center gap-1"
                >
                  <User size={22} />
                  <ChevronDown size={16} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown Menu - Opens to the Left */}
                {userMenuOpen && (
                  <div className="absolute left-0 top-full mt-1 w-48 sm:w-56 bg-gradient-to-b from-red-800 to-red-900 rounded-lg shadow-2xl border border-red-700/50 z-50 max-h-[calc(100vh-80px)] overflow-y-auto">
                    {user ? (
                      <>
                        {/* User Info */}
                        <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-red-700/30">
                          <p className="text-white font-semibold text-xs sm:text-sm truncate">{user.name}</p>
                          <p className="text-gray-300 text-xs truncate">{user.email}</p>
                          <div className="mt-1 inline-block px-2 py-0.5 bg-yellow-500/20 rounded text-yellow-400 text-xs font-medium">
                            {user.role === 'admin' ? '👑 مسؤول' : user.role === 'delegate' ? '💼 مندوب' : '👤 مستخدم'}
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-1">
                          <Link href="/account">
                            <button 
                              onClick={() => setUserMenuOpen(false)}
                              className="w-full px-3 sm:px-4 py-2 text-white text-xs sm:text-sm hover:bg-red-700/50 transition-colors flex items-center gap-2"
                            >
                              <User size={18} className="text-yellow-400 flex-shrink-0" />
                              <span>حسابي الشخصي</span>
                            </button>
                          </Link>

                          <Link href="/dashboard">
                            <button 
                              onClick={() => setUserMenuOpen(false)}
                              className="w-full px-3 sm:px-4 py-2 text-white text-xs sm:text-sm hover:bg-red-700/50 transition-colors flex items-center gap-2"
                            >
                              <BarChart3 size={18} className="text-yellow-400 flex-shrink-0" />
                              <span>لوحة التحكم</span>
                            </button>
                          </Link>

                          <Link href="/wishlist">
                            <button 
                              onClick={() => setUserMenuOpen(false)}
                              className="w-full px-3 sm:px-4 py-2 text-white text-xs sm:text-sm hover:bg-red-700/50 transition-colors flex items-center gap-2"
                            >
                              <Heart size={18} className="text-yellow-400 flex-shrink-0" />
                              <span>المفضلة</span>
                            </button>
                          </Link>

                          <Link href="/password-management">
                            <button 
                              onClick={() => setUserMenuOpen(false)}
                              className="w-full px-3 sm:px-4 py-2 text-white text-xs sm:text-sm hover:bg-red-700/50 transition-colors flex items-center gap-2"
                            >
                              <Shield size={18} className="text-yellow-400 flex-shrink-0" />
                              <span>أمان الحساب</span>
                            </button>
                          </Link>

                          <Link href="/notifications">
                            <button 
                              onClick={() => setUserMenuOpen(false)}
                              className="w-full px-3 sm:px-4 py-2 text-white text-xs sm:text-sm hover:bg-red-700/50 transition-colors flex items-center gap-2"
                            >
                              <Bell size={18} className="text-yellow-400 flex-shrink-0" />
                              <span>الإشعارات</span>
                            </button>
                          </Link>

                          {user && ROLE_HIERARCHY[(user as any).role as keyof typeof ROLE_HIERARCHY] >= ROLE_HIERARCHY["supervisor"] && (
                            <>
                              <Link href="/admin/products">
                                <button 
                                  onClick={() => setUserMenuOpen(false)}
                                  className="w-full px-4 py-2.5 text-white text-sm hover:bg-red-700/50 transition-colors flex items-center gap-2 border-t border-red-700/30"
                                >
                                  <Package size={18} className="text-orange-400 flex-shrink-0" />
                                  <span>إدارة المنتجات</span>
                                </button>
                              </Link>
                            </>
                          )}

                          {user && ROLE_HIERARCHY[(user as any).role as keyof typeof ROLE_HIERARCHY] >= ROLE_HIERARCHY["admin"] && (
                            <Link href="/admin/users">
                              <button 
                                onClick={() => setUserMenuOpen(false)}
                                className="w-full px-4 py-2.5 text-white text-sm hover:bg-red-700/50 transition-colors flex items-center gap-2 border-t border-red-700/30"
                              >
                                <Users size={18} className="text-purple-400 flex-shrink-0" />
                                <span>إدارة المستخدمين</span>
                              </button>
                            </Link>
                          )}

                          {/* Logout */}
                          <button
                            onClick={() => {
                              setUserMenuOpen(false);
                              handleLogout();
                            }}
                            className="w-full px-3 sm:px-4 py-2 text-white text-xs sm:text-sm hover:bg-red-700/50 transition-colors flex items-center gap-2 border-t border-red-700/30 text-red-300 hover:text-red-200"
                          >
                            <LogOut size={18} className="flex-shrink-0" />
                            <span>تسجيل الخروج</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Login/Register for guests */}
                        <Link href="/login">
                          <button 
                            onClick={() => setUserMenuOpen(false)}
                            className="w-full px-3 sm:px-4 py-2 text-white text-xs sm:text-sm hover:bg-red-700/50 transition-colors flex items-center gap-2"
                          >
                            <LogIn size={18} className="text-blue-400 flex-shrink-0" />
                            <span>تسجيل دخول</span>
                          </button>
                        </Link>

                        <Link href="/register">
                          <button 
                            onClick={() => setUserMenuOpen(false)}
                            className="w-full px-3 sm:px-4 py-2 text-white text-xs sm:text-sm hover:bg-red-700/50 transition-colors flex items-center gap-2 border-t border-red-700/30"
                          >
                            <UserPlus size={18} className="text-green-400 flex-shrink-0" />
                            <span>إنشاء حساب جديد</span>
                          </button>
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Navigation - Mobile */}
      <aside className={`fixed left-0 top-14 sm:top-16 bottom-0 bg-gradient-to-b from-red-900 via-red-800 to-red-900 border-r-2 border-yellow-500/40 shadow-lg overflow-y-auto transition-all duration-300 z-40 ${sidebarOpen ? 'w-40 sm:w-48' : 'w-0'}`}>
        <div className={`p-2 sm:p-3 space-y-2 ${sidebarOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="w-full p-2.5 sm:p-3 rounded-lg bg-gradient-to-r from-red-800/60 to-red-900/60 text-white font-semibold hover:from-red-700 hover:to-red-800 hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-200 flex items-center gap-2 border border-yellow-500/20 hover:border-yellow-400"
              >
                <item.icon size={20} className="text-yellow-400 flex-shrink-0" />
                <span className="text-right text-sm">{item.label}</span>
              </button>
            </Link>
          ))}
          {user ? (
            <button
              onClick={() => {
                setSidebarOpen(false);
                handleLogout();
              }}
              className="w-full p-2.5 sm:p-3 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold hover:from-red-700 hover:to-red-800 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-200 flex items-center gap-2 border border-red-400/20 hover:border-red-300 mt-4"
            >
              <LogOut size={20} className="flex-shrink-0" />
              <span className="text-right text-sm">تسجيل الخروج</span>
            </button>
          ) : (
            <div className="space-y-2 mt-4">
              <Link href="/login">
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="w-full p-2.5 sm:p-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200 flex items-center gap-2 border border-blue-400/20 hover:border-blue-300"
                >
                  <LogIn size={20} className="flex-shrink-0" />
                  <span className="text-right text-sm">تسجيل دخول</span>
                </button>
              </Link>
              <Link href="/register">
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="w-full p-2.5 sm:p-3 rounded-lg bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold hover:from-green-700 hover:to-green-800 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-200 flex items-center gap-2 border border-green-400/20 hover:border-green-300"
                >
                  <UserPlus size={20} className="flex-shrink-0" />
                  <span className="text-right text-sm">تسجيل جديد</span>
                </button>
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Overlay for sidebar on mobile */}
      {sidebarOpen && (
        <div 
          className="fixed top-14 sm:top-16 left-40 sm:left-48 right-0 bottom-0 bg-black/50 z-35"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Close user menu when clicking outside */}
      {userMenuOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </>
  );
}
