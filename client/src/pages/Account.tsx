import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, ShoppingBag, Heart, Settings, LogOut, Edit2, Save, X, 
  MapPin, Phone, Mail, Clock, CheckCircle, Truck, Bell, Lock, 
  CreditCard, Download, Eye, EyeOff, Award, TrendingUp, Calendar,
  AlertCircle, Shield, Zap
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

export default function Account() {
  return <AccountContent />;
}

function AccountContent() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Fetch user profile data
  const { data: profileData, isLoading: profileLoading } = trpc.users.getProfile.useQuery();
  
  // Fetch user orders
  const { data: ordersData, isLoading: ordersLoading } = trpc.users.getUserOrders.useQuery({ limit: 100, offset: 0 });

  // Fetch user loyalty points
  const { data: loyaltyData, isLoading: loyaltyLoading } = trpc.users.getUserLoyaltyPoints.useQuery();
  
  // Fetch user reviews
  const { data: reviewsData, isLoading: reviewsLoading } = trpc.users.getUserReviews.useQuery();
  
  const [userInfo, setUserInfo] = useState({
    name: profileData?.name || user?.name || "",
    email: profileData?.email || user?.email || "",
    phone: profileData?.phone || user?.phone || "",
    address: profileData?.address || user?.address || "",
    city: profileData?.city || user?.city || "",
    zipCode: profileData?.zipCode || user?.zipCode || "",
  });

  const [editInfo, setEditInfo] = useState(userInfo);
  
  // Update userInfo when profileData changes
  React.useEffect(() => {
    if (profileData) {
      setUserInfo({
        name: profileData.name || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        address: profileData.address || "",
        city: profileData.city || "",
        zipCode: profileData.zipCode || "",
      });
    }
  }, [profileData]);

  // إحصائيات
  const orders = ordersData?.orders || [];
  const totalSpent = orders.reduce((sum: number, o: any) => sum + (o.totalPrice || o.totalAmount || 0), 0) || 0;
  const stats = [
    { label: "إجمالي الطلبات", value: orders.length || "0", icon: ShoppingBag, color: "from-blue-500 to-blue-600" },
    { label: "المراجعات", value: reviewsData?.total || "0", icon: Heart, color: "from-red-500 to-red-600" },
    { label: "الإنفاق الكلي", value: totalSpent.toFixed(2) + " د.ا", icon: CreditCard, color: "from-green-500 to-green-600" },
    { label: "نقاط الولاء", value: loyaltyData?.availablePoints || "0", icon: Award, color: "from-yellow-500 to-yellow-600" },
  ];

  const updateProfileMutation = trpc.users.updateProfile.useMutation();
  
  const handleSaveInfo = async () => {
    try {
      await updateProfileMutation.mutateAsync(editInfo);
      toast.success("تم حفظ البيانات بنجاح");
      setUserInfo(editInfo);
      setIsEditing(false);
    } catch (error) {
      toast.error("فشل حفظ البيانات");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-2">
            <User className="w-8 h-8 text-blue-600" />
            حسابي الشخصي
          </h1>
          <p className="text-slate-600">
            إدارة بيانات حسابك والطلبات والإعدادات
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="overflow-hidden">
                <div className={`bg-gradient-to-r ${stat.color} p-4 text-white`}>
                  <Icon className="w-6 h-6 mb-2" />
                </div>
                <div className="p-4">
                  <p className="text-slate-600 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              الملف الشخصي
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ShoppingBag className="w-4 h-4 mr-2" />
              الطلبات
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock className="w-4 h-4 mr-2" />
              الأمان
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              الإعدادات
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">بيانات الملف الشخصي</h2>
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    variant={isEditing ? "destructive" : "default"}
                  >
                    {isEditing ? (
                      <>
                        <X className="w-4 h-4 mr-2" />
                        إلغاء
                      </>
                    ) : (
                      <>
                        <Edit2 className="w-4 h-4 mr-2" />
                        تعديل
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">
                        الاسم
                      </label>
                      {isEditing ? (
                        <Input
                          value={editInfo.name}
                          onChange={(e) =>
                            setEditInfo({ ...editInfo, name: e.target.value })
                          }
                        />
                      ) : (
                        <p className="text-slate-700">{userInfo.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">
                        البريد الإلكتروني
                      </label>
                      {isEditing ? (
                        <Input
                          value={editInfo.email}
                          onChange={(e) =>
                            setEditInfo({ ...editInfo, email: e.target.value })
                          }
                        />
                      ) : (
                        <p className="text-slate-700">{userInfo.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">
                        رقم الهاتف
                      </label>
                      {isEditing ? (
                        <Input
                          value={editInfo.phone}
                          onChange={(e) =>
                            setEditInfo({ ...editInfo, phone: e.target.value })
                          }
                        />
                      ) : (
                        <p className="text-slate-700">{userInfo.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">
                        المدينة
                      </label>
                      {isEditing ? (
                        <Input
                          value={editInfo.city}
                          onChange={(e) =>
                            setEditInfo({ ...editInfo, city: e.target.value })
                          }
                        />
                      ) : (
                        <p className="text-slate-700">{userInfo.city}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-900 mb-2">
                        العنوان
                      </label>
                      {isEditing ? (
                        <Input
                          value={editInfo.address}
                          onChange={(e) =>
                            setEditInfo({ ...editInfo, address: e.target.value })
                          }
                        />
                      ) : (
                        <p className="text-slate-700">{userInfo.address}</p>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={handleSaveInfo}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        حفظ التغييرات
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">الطلبات الأخيرة</h2>
                <div className="space-y-4">
                  {orders.length > 0 ? (
                    orders.map((order: any) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-4">
                          <ShoppingBag className="w-8 h-8 text-blue-600" />
                          <div>
                            <p className="font-semibold text-slate-900">
                              الطلب #{order.id}
                            </p>
                            <p className="text-sm text-slate-600">
                              {new Date(order.createdAt).toLocaleDateString("ar-JO")}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900">{order.totalAmount} د.ا</p>
                          <p
                            className={`text-sm ${
                              order.status === "delivered"
                                ? "text-green-600"
                                : "text-amber-600"
                            }`}
                          >
                            {order.status === "delivered" ? "تم التسليم" : "قيد المعالجة"}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-600 text-center py-8">لا توجد طلبات حالياً</p>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">الأمان</h2>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-900">كلمة المرور</h3>
                      <Button variant="outline" size="sm">
                        تغيير
                      </Button>
                    </div>
                    <p className="text-sm text-slate-600">
                      آخر تغيير: 2026-03-15
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-900">المصادقة الثنائية</h3>
                      <Button variant="outline" size="sm">
                        تفعيل
                      </Button>
                    </div>
                    <p className="text-sm text-slate-600">
                      أضف طبقة أمان إضافية لحسابك
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-900">الأجهزة المتصلة</h3>
                      <Button variant="outline" size="sm">
                        عرض الكل
                      </Button>
                    </div>
                    <p className="text-sm text-slate-600">
                      جهاز واحد متصل حالياً
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">الإعدادات</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold text-slate-900">الإشعارات البريدية</h3>
                      <p className="text-sm text-slate-600">تلقي آخر الأخبار والعروض</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold text-slate-900">الرسائل النصية</h3>
                      <p className="text-sm text-slate-600">تلقي تحديثات الطلبات عبر SMS</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5" />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold text-slate-900">المظهر الداكن</h3>
                      <p className="text-sm text-slate-600">استخدم المظهر الداكن</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
