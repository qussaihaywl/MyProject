import { useState } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, ShoppingBag, Heart, Settings, LogOut, Edit2, Save, X, Package, Truck, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function UserDashboard() {
  return (
    <>
      
      <UserDashboardContent />
    </>
  );
}

function UserDashboardContent() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "favorites" | "settings">("profile");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
  });

  // Mock orders data
  const orders = [
    {
      id: "ORD123456",
      date: "2024-01-15",
      total: 450.50,
      status: "delivered",
      items: 3,
      trackingNumber: "TRK123456789",
    },
    {
      id: "ORD123457",
      date: "2024-01-10",
      total: 320.00,
      status: "shipped",
      items: 2,
      trackingNumber: "TRK987654321",
    },
    {
      id: "ORD123458",
      date: "2024-01-05",
      total: 580.75,
      status: "processing",
      items: 4,
      trackingNumber: "TRK555666777",
    },
  ];

  // Mock favorites data
  const favorites = [
    {
      id: 1,
      name: "فستان سهرة أنيق",
      price: 250,
      category: "ملابس",
      image: "👗",
    },
    {
      id: 2,
      name: "كرسي مريح",
      price: 450,
      category: "أثاث",
      image: "🪑",
    },
    {
      id: 3,
      name: "عقد ذهبي",
      price: 180,
      category: "إكسسوارات",
      image: "✨",
    },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <Card className="p-8 text-center bg-white shadow-lg rounded-lg">
            <AlertCircle className="w-16 h-16 text-rose-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-3">يجب تسجيل الدخول أولاً</h2>
            <p className="text-gray-600 mb-6">يرجى تسجيل الدخول للوصول إلى لوحة التحكم</p>
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

  const handleSaveProfile = () => {
    toast.success("تم حفظ البيانات بنجاح!");
    setIsEditingProfile(false);
  };

  const handleRemoveFavorite = (id: number) => {
    toast.success("تم حذف المنتج من المفضلة");
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
      delivered: {
        label: "تم التوصيل",
        color: "bg-green-100 text-green-800",
        icon: <CheckCircle className="w-4 h-4" />,
      },
      shipped: {
        label: "قيد الشحن",
        color: "bg-blue-100 text-blue-800",
        icon: <Truck className="w-4 h-4" />,
      },
      processing: {
        label: "قيد المعالجة",
        color: "bg-yellow-100 text-yellow-800",
        icon: <Clock className="w-4 h-4" />,
      },
    };

    const statusInfo = statusMap[status] || statusMap.processing;
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${statusInfo.color}`}>
        {statusInfo.icon}
        {statusInfo.label}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 pb-16">
      {/* Header */}
      <div className="bg-white border-b border-rose-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-orange-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">مرحباً، {user?.name}</h1>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>
            <Link href="/">
              <a className="flex items-center gap-2 text-rose-600 hover:text-rose-700 font-semibold">
                <LogOut className="w-5 h-5" />
                تسجيل الخروج
              </a>
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 overflow-x-auto">
            {[
              { id: "profile", label: "الملف الشخصي", icon: User },
              { id: "orders", label: "الطلبات", icon: ShoppingBag },
              { id: "favorites", label: "المفضلة", icon: Heart },
              { id: "settings", label: "الإعدادات", icon: Settings },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-semibold transition-all whitespace-nowrap ${
                  activeTab === id
                    ? "border-rose-600 text-rose-600"
                    : "border-transparent text-gray-600 hover:text-rose-600"
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-2">
              <Card className="p-8 bg-white shadow-lg rounded-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">بيانات الملف الشخصي</h2>
                  {!isEditingProfile && (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="flex items-center gap-2 text-rose-600 hover:text-rose-700 font-semibold"
                    >
                      <Edit2 className="w-4 h-4" />
                      تعديل
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">الاسم الكامل</label>
                    <Input
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      disabled={!isEditingProfile}
                      className={`border-2 rounded-lg ${isEditingProfile ? "border-rose-200" : "border-gray-200 bg-gray-50"}`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني</label>
                    <Input
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      disabled={!isEditingProfile}
                      className={`border-2 rounded-lg ${isEditingProfile ? "border-rose-200" : "border-gray-200 bg-gray-50"}`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">رقم الهاتف</label>
                    <Input
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      disabled={!isEditingProfile}
                      placeholder="+962 7 XXXX XXXX"
                      className={`border-2 rounded-lg ${isEditingProfile ? "border-rose-200" : "border-gray-200 bg-gray-50"}`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">العنوان</label>
                    <Input
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      disabled={!isEditingProfile}
                      placeholder="أدخل عنوانك"
                      className={`border-2 rounded-lg ${isEditingProfile ? "border-rose-200" : "border-gray-200 bg-gray-50"}`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">المدينة</label>
                    <Input
                      value={profileData.city}
                      onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                      disabled={!isEditingProfile}
                      placeholder="المدينة"
                      className={`border-2 rounded-lg ${isEditingProfile ? "border-rose-200" : "border-gray-200 bg-gray-50"}`}
                    />
                  </div>
                </div>

                {isEditingProfile && (
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      className="flex-1 flex items-center justify-center gap-2 bg-white text-gray-700 py-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all font-bold"
                    >
                      <X className="w-4 h-4" />
                      إلغاء
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-orange-500 text-white py-3 rounded-lg hover:shadow-lg transition-all font-bold"
                    >
                      <Save className="w-4 h-4" />
                      حفظ التغييرات
                    </button>
                  </div>
                )}
              </Card>
            </div>

            {/* Stats */}
            <div className="space-y-4">
              <Card className="p-6 bg-gradient-to-br from-rose-50 to-orange-50 rounded-lg border-2 border-rose-200">
                <div className="text-center">
                  <ShoppingBag className="w-8 h-8 text-rose-600 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm mb-1">إجمالي الطلبات</p>
                  <p className="text-3xl font-bold text-gray-900">12</p>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200">
                <div className="text-center">
                  <Heart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm mb-1">المنتجات المفضلة</p>
                  <p className="text-3xl font-bold text-gray-900">3</p>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
                <div className="text-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm mb-1">الطلبات المكتملة</p>
                  <p className="text-3xl font-bold text-gray-900">10</p>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <Card className="p-8 text-center bg-white shadow-lg rounded-lg">
                <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">لا توجد طلبات حتى الآن</p>
              </Card>
            ) : (
              orders.map((order) => (
                <Card key={order.id} className="p-6 bg-white shadow-lg rounded-lg border-l-4 border-rose-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">رقم الطلب</p>
                      <p className="font-bold text-gray-900">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">التاريخ</p>
                      <p className="font-bold text-gray-900">{order.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">الإجمالي</p>
                      <p className="font-bold text-rose-600 text-lg">{order.total.toFixed(2)} د.ا</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">الحالة</p>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="text-right">
                      <Link href={`/order/${order.id}`}>
                        <a className="inline-flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-all font-semibold text-sm">
                          <Package className="w-4 h-4" />
                          التفاصيل
                        </a>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === "favorites" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.length === 0 ? (
              <Card className="p-8 text-center bg-white shadow-lg rounded-lg col-span-full">
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">لا توجد منتجات مفضلة حتى الآن</p>
              </Card>
            ) : (
              favorites.map((item) => (
                <Card key={item.id} className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition-all">
                  <div className="text-5xl text-center mb-4">{item.image}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{item.category}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-rose-600">{item.price} د.ا</p>
                    <button
                      onClick={() => handleRemoveFavorite(item.id)}
                      className="p-2 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="max-w-2xl">
            <Card className="p-8 bg-white shadow-lg rounded-lg space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">الإعدادات</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                    <div>
                      <p className="font-semibold text-gray-900">إشعارات البريد الإلكتروني</p>
                      <p className="text-sm text-gray-600">استقبل تحديثات عن الطلبات والعروض</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                    <div>
                      <p className="font-semibold text-gray-900">إشعارات SMS</p>
                      <p className="text-sm text-gray-600">استقبل رسائل نصية عن حالة الطلبات</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5" />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                    <div>
                      <p className="font-semibold text-gray-900">العروض والخصومات</p>
                      <p className="text-sm text-gray-600">استقبل إشعارات عن العروض الجديدة</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-gray-200 pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">الأمان</h3>
                <button className="w-full bg-white text-rose-600 py-3 rounded-lg border-2 border-rose-200 hover:border-rose-600 transition-all font-bold">
                  تغيير كلمة المرور
                </button>
              </div>

              <div className="border-t-2 border-gray-200 pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">حذف الحساب</h3>
                <p className="text-gray-600 mb-4">حذف حسابك وجميع بيانات الملف الشخصي بشكل نهائي</p>
                <button className="w-full bg-red-100 text-red-600 py-3 rounded-lg border-2 border-red-200 hover:border-red-600 transition-all font-bold">
                  حذف الحساب
                </button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
