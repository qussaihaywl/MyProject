import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Search, Plus, Edit2, Trash2, LogOut, BarChart3, Users, Package, ShoppingCart, Settings, FileText, Bell, Download, Filter, ChevronRight, Eye, EyeOff, Lock, Unlock } from 'lucide-react';

const UltraModernAdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string } | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Modal states
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);

  // Mock real data from database
  const [users] = useState([
    { id: '1', name: 'Qussai', email: 'roseonlien@gmail.com', role: 'admin', status: 'active', createdAt: new Date('2026-01-15') },
    { id: '2', name: 'Fatima Ahmed', email: 'fatima@example.com', role: 'user', status: 'active', createdAt: new Date('2026-02-20') },
    { id: '3', name: 'Sara Mohammed', email: 'sara@example.com', role: 'seller', status: 'active', createdAt: new Date('2026-03-10') },
    { id: '4', name: 'Layla Hassan', email: 'layla@example.com', role: 'supervisor', status: 'inactive', createdAt: new Date('2026-01-25') },
  ]);
  const [products] = useState([
    { id: '1', name: 'Premium Dress', category: 'Fashion', price: 150, stock: 45 },
    { id: '2', name: 'Gold Necklace', category: 'Accessories', price: 280, stock: 12 },
    { id: '3', name: 'Sofa Set', category: 'Furniture', price: 1200, stock: 5 },
    { id: '4', name: 'Silk Scarf', category: 'Fashion', price: 85, stock: 0 },
  ]);
  const stats = {
    totalOrders: 156,
    totalRevenue: 45230,
    totalProducts: 234,
    activeUsers: 1234,
  };
  const usersLoading = false;
  const productsLoading = false;

  // Filter functions
  const filteredUsers = useMemo(() => {
    return users.filter((u: any) => {
      const matchesSearch = (u.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
                           (u.email?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      const matchesRole = filterRole === 'all' || u.role === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, filterRole]);

  const filteredProducts = useMemo(() => {
    return products.filter((p: any) => (p.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()));
  }, [products, searchQuery]);

  // Tab navigation items
  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: BarChart3 },
    { id: 'users', label: 'المستخدمون', icon: Users },
    { id: 'products', label: 'المنتجات', icon: Package },
    { id: 'orders', label: 'الطلبات', icon: ShoppingCart },
    { id: 'reports', label: 'التقارير', icon: FileText },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b-2 border-pink-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
              R
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                Rose Online
              </h1>
              <p className="text-sm text-gray-600">لوحة التحكم الإدارية</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-pink-100 rounded-lg transition-colors relative">
              <Bell size={24} className="text-pink-600" />
              <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            </button>
            <button className="p-2 hover:bg-pink-100 rounded-lg transition-colors">
              <LogOut size={24} className="text-pink-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Vertical Tabs Sidebar */}
        <aside className="w-64 bg-white border-r-2 border-pink-200 shadow-lg overflow-y-auto max-h-[calc(100vh-80px)]">
          <nav className="p-4 space-y-2 sticky top-0">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-pink-50'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-semibold flex-1 text-right">{tab.label}</span>
                  {isActive && <ChevronRight size={20} className="ml-auto" />}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto max-h-[calc(100vh-80px)]">
          <div className="p-8 max-w-6xl">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">مرحباً بك {user?.name} 👋</h2>
                  <p className="text-gray-600">هنا ملخص أداء متجرك اليوم</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-gradient-to-br from-yellow-400 to-orange-400 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <ShoppingCart size={32} className="opacity-80" />
                      <span className="text-sm font-bold bg-white bg-opacity-30 px-3 py-1 rounded-full">↑ 12%</span>
                    </div>
                    <p className="text-sm opacity-90 mb-2">إجمالي الطلبات</p>
                    <p className="text-4xl font-bold">{stats.totalOrders || 0}</p>
                  </Card>

                  <Card className="bg-gradient-to-br from-pink-500 to-red-500 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <BarChart3 size={32} className="opacity-80" />
                      <span className="text-sm font-bold bg-white bg-opacity-30 px-3 py-1 rounded-full">↑ 8%</span>
                    </div>
                    <p className="text-sm opacity-90 mb-2">إجمالي الإيرادات</p>
                    <p className="text-4xl font-bold">${stats.totalRevenue || 0}</p>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-400 to-yellow-400 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <Package size={32} className="opacity-80" />
                      <span className="text-sm font-bold bg-white bg-opacity-30 px-3 py-1 rounded-full">↓ 3%</span>
                    </div>
                    <p className="text-sm opacity-90 mb-2">المنتجات</p>
                    <p className="text-4xl font-bold">{stats.totalProducts || 0}</p>
                  </Card>

                  <Card className="bg-gradient-to-br from-pink-400 to-orange-400 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <Users size={32} className="opacity-80" />
                      <span className="text-sm font-bold bg-white bg-opacity-30 px-3 py-1 rounded-full">↑ 15%</span>
                    </div>
                    <p className="text-sm opacity-90 mb-2">المستخدمون النشطون</p>
                    <p className="text-4xl font-bold">{stats.activeUsers || 0}</p>
                  </Card>
                </div>

                {/* Charts Placeholder */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-6 rounded-2xl shadow-lg">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">الطلبات والإيرادات</h3>
                    <div className="h-64 bg-gradient-to-br from-pink-100 to-orange-100 rounded-xl flex items-center justify-center">
                      <span className="text-gray-500">رسم بياني للطلبات والإيرادات</span>
                    </div>
                  </Card>
                  <Card className="p-6 rounded-2xl shadow-lg">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">توزيع المبيعات</h3>
                    <div className="h-64 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl flex items-center justify-center">
                      <span className="text-gray-500">رسم بياني لتوزيع المبيعات</span>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">إدارة المستخدمين</h2>
                    <p className="text-gray-600 mt-1">إجمالي المستخدمين: {filteredUsers.length}</p>
                  </div>
                  <Button
                    onClick={() => setShowAddUser(true)}
                    className="bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg flex items-center gap-2"
                  >
                    <Plus size={20} />
                    مستخدم جديد
                  </Button>
                </div>

                {/* Search and Filter */}
                <div className="flex gap-4 flex-col sm:flex-row">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                    <Input
                      placeholder="ابحث عن المستخدمين..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 py-3 rounded-lg border-2 border-pink-200 focus:border-pink-500"
                    />
                  </div>
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-full sm:w-40 rounded-lg border-2 border-pink-200">
                      <SelectValue placeholder="الدور" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأدوار</SelectItem>
                      <SelectItem value="admin">مسؤول</SelectItem>
                      <SelectItem value="user">مستخدم</SelectItem>
                      <SelectItem value="seller">بائع</SelectItem>
                      <SelectItem value="supervisor">مشرف</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-pink-100 to-orange-100 border-b-2 border-pink-200">
                        <th className="px-6 py-4 text-right font-bold text-gray-800">الاسم</th>
                        <th className="px-6 py-4 text-right font-bold text-gray-800">البريد الإلكتروني</th>
                        <th className="px-6 py-4 text-right font-bold text-gray-800">الدور</th>
                        <th className="px-6 py-4 text-right font-bold text-gray-800">الحالة</th>
                        <th className="px-6 py-4 text-right font-bold text-gray-800">تاريخ الانضمام</th>
                        <th className="px-6 py-4 text-right font-bold text-gray-800">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersLoading ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                            جاري تحميل البيانات...
                          </td>
                        </tr>
                      ) : filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                            لا توجد بيانات متاحة
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((u: any, idx: number) => (
                          <tr key={u.id || idx} className="border-b border-pink-100 hover:bg-pink-50 transition-colors">
                            <td className="px-6 py-4 font-semibold text-gray-800">{u.name || '-'}</td>
                            <td className="px-6 py-4 text-gray-600">{u.email || '-'}</td>
                            <td className="px-6 py-4">
                                          <span className="px-3 py-1 rounded-full text-sm font-bold bg-pink-100 text-pink-700">
                                {(u as any).role || '-'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                                (u as any).status === 'active' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {u.status === 'active' ? 'نشط' : 'غير نشط'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-600">{u.createdAt ? new Date(u.createdAt).toLocaleDateString('ar-JO') : '-'}</td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors">
                                  <Edit2 size={18} className="text-blue-600" />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm({ type: 'user', id: u.id })}
                                  className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                >
                                  <Trash2 size={18} className="text-red-600" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">إدارة المنتجات</h2>
                    <p className="text-gray-600 mt-1">إجمالي المنتجات: {filteredProducts.length}</p>
                  </div>
                  <Button
                    onClick={() => setShowAddProduct(true)}
                    className="bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg flex items-center gap-2"
                  >
                    <Plus size={20} />
                    منتج جديد
                  </Button>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <Input
                    placeholder="ابحث عن المنتجات..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 py-3 rounded-lg border-2 border-pink-200 focus:border-pink-500"
                  />
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {productsLoading ? (
                    <div className="col-span-full text-center py-8 text-gray-500">جاري تحميل البيانات...</div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="col-span-full text-center py-8 text-gray-500">لا توجد منتجات</div>
                  ) : (
                    filteredProducts.map((product: any, idx: number) => (
                      <Card key={product.id || idx} className="rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                        <div className="bg-gradient-to-r from-pink-100 to-orange-100 h-40 flex items-center justify-center">
                          <Package size={48} className="text-pink-400" />
                        </div>
                        <div className="p-6">
                          <h3 className="font-bold text-lg text-gray-800 mb-2">{product.name || '-'}</h3>
                          <p className="text-sm text-gray-600 mb-4">{product.category || '-'}</p>
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <p className="text-sm text-gray-600">السعر</p>
                              <p className="text-2xl font-bold text-pink-600">${product.price || 0}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">المخزون</p>
                              <p className="text-2xl font-bold text-orange-600">{product.stock || 0}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button className="flex-1 p-2 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center gap-2">
                              <Edit2 size={18} className="text-blue-600" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ type: 'product', id: product.id })}
                              className="flex-1 p-2 hover:bg-red-100 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                              <Trash2 size={18} className="text-red-600" />
                            </button>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-800">إدارة الطلبات</h2>
                <Card className="p-8 rounded-2xl shadow-lg text-center">
                  <ShoppingCart size={48} className="mx-auto text-pink-400 mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">إدارة الطلبات</h3>
                  <p className="text-gray-600">سيتم إضافة إدارة الطلبات المتقدمة قريباً...</p>
                </Card>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-800">التقارير</h2>
                <Card className="p-8 rounded-2xl shadow-lg text-center">
                  <FileText size={48} className="mx-auto text-pink-400 mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">التقارير المتقدمة</h3>
                  <p className="text-gray-600">سيتم إضافة التقارير المتقدمة قريباً...</p>
                </Card>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-800">الإعدادات</h2>
                <Card className="p-8 rounded-2xl shadow-lg">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">اسم المتجر</label>
                      <Input placeholder="Rose Online" className="rounded-lg border-2 border-pink-200 py-3" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">البريد الإلكتروني</label>
                      <Input placeholder="info@roseonline.com" className="rounded-lg border-2 border-pink-200 py-3" />
                    </div>
                    <Button className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg py-3 font-bold">
                      حفظ الإعدادات
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
          <AlertDialogDescription>
            هل أنت متأكد من رغبتك في حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.
          </AlertDialogDescription>
          <div className="flex gap-2">
            <AlertDialogCancel className="flex-1 rounded-lg">إلغاء</AlertDialogCancel>
            <AlertDialogAction className="flex-1 bg-red-600 text-white rounded-lg hover:bg-red-700">
              حذف
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UltraModernAdminDashboard;
