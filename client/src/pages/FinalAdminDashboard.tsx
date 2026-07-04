import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Users, Package, Layers, Warehouse, BarChart3, Settings, Search, Plus, Edit2, Trash2, Download, X } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data - Will be replaced with real database queries
const mockUsers = [
  { id: 1, name: 'قصي', email: 'qussai@example.com', role: 'admin', status: 'active', createdAt: '2024-01-15' },
  { id: 2, name: 'فاطمة أحمد', email: 'fatima@example.com', role: 'user', status: 'active', createdAt: '2024-01-20' },
  { id: 3, name: 'سارة محمد', email: 'sarah@example.com', role: 'seller', status: 'active', createdAt: '2024-02-01' },
  { id: 4, name: 'علي حسن', email: 'ali@example.com', role: 'user', status: 'inactive', createdAt: '2024-02-10' },
];

const mockCategories = [
  { id: 1, name: 'الملابس', description: 'ملابس نسائية وحريمي', isActive: true, createdAt: '2024-01-01' },
  { id: 2, name: 'الأثاث', description: 'أثاث فاخر', isActive: true, createdAt: '2024-01-05' },
  { id: 3, name: 'الإكسسوارات', description: 'مجوهرات وإكسسوارات', isActive: true, createdAt: '2024-01-10' },
];

const mockWarehouses = [
  { id: 1, name: 'المستودع الرئيسي', code: 'WH001', location: 'عمّان', isActive: true, createdAt: '2024-01-01' },
  { id: 2, name: 'مستودع الزرقاء', code: 'WH002', location: 'الزرقاء', isActive: true, createdAt: '2024-01-15' },
  { id: 3, name: 'مستودع إربد', code: 'WH003', location: 'إربد', isActive: false, createdAt: '2024-02-01' },
];

const mockProducts = [
  { id: 1, name: 'فستان فاخر', category: 'الملابس', price: 150, stock: 25, status: 'active' },
  { id: 2, name: 'عقد ذهبي', category: 'الإكسسوارات', price: 300, stock: 5, status: 'low-stock' },
  { id: 3, name: 'أريكة فخمة', category: 'الأثاث', price: 1200, stock: 0, status: 'out-of-stock' },
];

const chartData = [
  { month: 'يناير', sales: 4000, revenue: 2400 },
  { month: 'فبراير', sales: 3000, revenue: 1398 },
  { month: 'مارس', sales: 2000, revenue: 9800 },
  { month: 'أبريل', sales: 2780, revenue: 3908 },
  { month: 'مايو', sales: 1890, revenue: 4800 },
];

const COLORS = ['#d97706', '#800020', '#f59e0b', '#fbbf24'];

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
}

export default function FinalAdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  
  // Modal states
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showWarehouseModal, setShowWarehouseModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState<any>({});
  const [editingId, setEditingId] = useState<number | null>(null);

  // Filtered data
  const filteredUsers = useMemo(() => {
    return mockUsers.filter(user => {
      const matchesSearch = user.name.includes(searchTerm) || user.email.includes(searchTerm);
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [searchTerm, filterRole]);

  const addNotification = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const notification: Notification = {
      id: Date.now(),
      title,
      message,
      type,
      timestamp: new Date(),
    };
    setNotifications(prev => [notification, ...prev].slice(0, 5));
  };

  const handleAddUser = () => {
    setEditingId(null);
    setFormData({});
    setShowUserModal(true);
  };

  const handleSaveUser = () => {
    addNotification('نجح', `تم ${editingId ? 'تحديث' : 'إضافة'} المستخدم بنجاح`, 'success');
    setShowUserModal(false);
    setFormData({});
  };

  const handleDeleteUser = (id: number) => {
    addNotification('تم الحذف', 'تم حذف المستخدم بنجاح', 'success');
  };

  const handleAddCategory = () => {
    setEditingId(null);
    setFormData({});
    setShowCategoryModal(true);
  };

  const handleSaveCategory = () => {
    addNotification('نجح', `تم ${editingId ? 'تحديث' : 'إضافة'} الفئة بنجاح`, 'success');
    setShowCategoryModal(false);
    setFormData({});
  };

  const handleAddWarehouse = () => {
    setEditingId(null);
    setFormData({});
    setShowWarehouseModal(true);
  };

  const handleSaveWarehouse = () => {
    addNotification('نجح', `تم ${editingId ? 'تحديث' : 'إضافة'} المستودع بنجاح`, 'success');
    setShowWarehouseModal(false);
    setFormData({});
  };

  const handleAddProduct = () => {
    setEditingId(null);
    setFormData({});
    setShowProductModal(true);
  };

  const handleSaveProduct = () => {
    addNotification('نجح', `تم ${editingId ? 'تحديث' : 'إضافة'} المنتج بنجاح`, 'success');
    setShowProductModal(false);
    setFormData({});
  };

  const exportToCSV = (data: any[], filename: string) => {
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    addNotification('تم التصدير', `تم تصدير ${filename} بنجاح`, 'success');
  };

  if (!user) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-amber-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
              لوحة التحكم الإدارية
            </h1>
            <p className="text-sm text-gray-600">مرحباً {user.name}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition"
              >
                <Bell size={24} />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-amber-200 max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-amber-200">
                    <h3 className="font-bold text-amber-900">الإشعارات</h3>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">لا توجد إشعارات</div>
                  ) : (
                    notifications.map(notif => (
                      <div key={notif.id} className="p-3 border-b border-amber-100 hover:bg-amber-50">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-amber-900">{notif.title}</p>
                            <p className="text-sm text-gray-600">{notif.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{notif.timestamp.toLocaleTimeString('ar-JO')}</p>
                          </div>
                          <Badge className={`${
                            notif.type === 'success' ? 'bg-green-100 text-green-800' :
                            notif.type === 'error' ? 'bg-red-100 text-red-800' :
                            notif.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {notif.type}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 bg-white border border-amber-200 rounded-lg p-1 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 size={16} />
              <span className="hidden sm:inline">نظرة عامة</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users size={16} />
              <span className="hidden sm:inline">المستخدمون</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package size={16} />
              <span className="hidden sm:inline">المنتجات</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Layers size={16} />
              <span className="hidden sm:inline">الفئات</span>
            </TabsTrigger>
            <TabsTrigger value="warehouses" className="flex items-center gap-2">
              <Warehouse size={16} />
              <span className="hidden sm:inline">المستودعات</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 size={16} />
              <span className="hidden sm:inline">التحليلات</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings size={16} />
              <span className="hidden sm:inline">الإعدادات</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-amber-400 to-amber-600 text-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100">إجمالي الإيرادات</p>
                    <p className="text-3xl font-bold">45,230</p>
                    <p className="text-sm text-amber-100 mt-1">د.ا</p>
                  </div>
                  <BarChart3 size={40} className="opacity-50" />
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-rose-400 to-rose-600 text-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-rose-100">الطلبات اليومية</p>
                    <p className="text-3xl font-bold">234</p>
                    <p className="text-sm text-rose-100 mt-1">طلب</p>
                  </div>
                  <Package size={40} className="opacity-50" />
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-orange-400 to-orange-600 text-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">العملاء النشطين</p>
                    <p className="text-3xl font-bold">1,234</p>
                    <p className="text-sm text-orange-100 mt-1">عميل</p>
                  </div>
                  <Users size={40} className="opacity-50" />
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100">معدل النمو</p>
                    <p className="text-3xl font-bold">24.5%</p>
                    <p className="text-sm text-yellow-100 mt-1">↑ هذا الشهر</p>
                  </div>
                  <BarChart3 size={40} className="opacity-50" />
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 bg-white rounded-xl shadow-md border border-amber-100">
                <h3 className="text-lg font-bold text-amber-900 mb-4">مبيعات هذا الشهر</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#fcd34d" />
                    <XAxis dataKey="month" stroke="#92400e" />
                    <YAxis stroke="#92400e" />
                    <Tooltip contentStyle={{ backgroundColor: '#fef3c7', border: '1px solid #d97706' }} />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#d97706" strokeWidth={2} name="المبيعات" />
                    <Line type="monotone" dataKey="revenue" stroke="#800020" strokeWidth={2} name="الإيرادات" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6 bg-white rounded-xl shadow-md border border-amber-100">
                <h3 className="text-lg font-bold text-amber-900 mb-4">توزيع الفئات</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockCategories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name }) => name}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="id"
                    >
                      {mockCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 rounded-xl border border-amber-200">
              <div className="flex-1 flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 text-amber-600" size={18} />
                  <Input
                    placeholder="ابحث عن مستخدم..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-amber-200 focus:border-amber-600"
                  />
                </div>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-40 border-amber-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأدوار</SelectItem>
                    <SelectItem value="admin">مسؤول</SelectItem>
                    <SelectItem value="user">مستخدم</SelectItem>
                    <SelectItem value="seller">بائع</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button onClick={handleAddUser} className="flex-1 sm:flex-none bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white">
                  <Plus size={18} className="mr-2" />
                  مستخدم جديد
                </Button>
                <Button onClick={() => exportToCSV(filteredUsers, 'المستخدمون')} variant="outline" className="flex-1 sm:flex-none border-amber-200 text-amber-600 hover:bg-amber-50">
                  <Download size={18} className="mr-2" />
                  تصدير
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto bg-white rounded-xl border border-amber-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
                    <th className="px-4 py-3 text-right text-amber-900 font-semibold">الاسم</th>
                    <th className="px-4 py-3 text-right text-amber-900 font-semibold">البريد الإلكتروني</th>
                    <th className="px-4 py-3 text-right text-amber-900 font-semibold">الدور</th>
                    <th className="px-4 py-3 text-right text-amber-900 font-semibold">الحالة</th>
                    <th className="px-4 py-3 text-right text-amber-900 font-semibold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-amber-100 hover:bg-amber-50 transition">
                      <td className="px-4 py-3 text-amber-900">{user.name}</td>
                      <td className="px-4 py-3 text-gray-600">{user.email}</td>
                      <td className="px-4 py-3">
                        <Badge className="bg-amber-100 text-amber-800">{user.role}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {user.status === 'active' ? 'نشط' : 'غير نشط'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <button onClick={() => handleAddUser()} className="p-2 text-amber-600 hover:bg-amber-100 rounded transition">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-rose-600 hover:bg-rose-100 rounded transition">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 rounded-xl border border-amber-200">
              <div className="flex-1 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-amber-600" size={18} />
                  <Input
                    placeholder="ابحث عن منتج..."
                    className="pl-10 border-amber-200 focus:border-amber-600"
                  />
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button onClick={handleAddProduct} className="flex-1 sm:flex-none bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white">
                  <Plus size={18} className="mr-2" />
                  منتج جديد
                </Button>
                <Button onClick={() => exportToCSV(mockProducts, 'المنتجات')} variant="outline" className="flex-1 sm:flex-none border-amber-200 text-amber-600 hover:bg-amber-50">
                  <Download size={18} className="mr-2" />
                  تصدير
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockProducts.map((product) => (
                <Card key={product.id} className="bg-white border border-amber-200 rounded-xl overflow-hidden hover:shadow-lg transition">
                  <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-4 h-32 flex items-center justify-center">
                    <Package size={48} className="text-amber-600 opacity-50" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-amber-900 mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">الفئة: {product.category}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-amber-600">{product.price} د.ا</span>
                      <Badge className={
                        product.status === 'active' ? 'bg-green-100 text-green-800' :
                        product.status === 'low-stock' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {product.status === 'active' ? 'متاح' : product.status === 'low-stock' ? 'مخزون منخفض' : 'نفد المخزون'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">المخزون: {product.stock}</p>
                    <div className="flex gap-2">
                      <button className="flex-1 p-2 text-amber-600 hover:bg-amber-100 rounded transition flex items-center justify-center gap-1">
                        <Edit2 size={16} />
                        تعديل
                      </button>
                      <button className="flex-1 p-2 text-rose-600 hover:bg-rose-100 rounded transition flex items-center justify-center gap-1">
                        <Trash2 size={16} />
                        حذف
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 rounded-xl border border-amber-200">
              <div className="flex-1 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-amber-600" size={18} />
                  <Input
                    placeholder="ابحث عن فئة..."
                    className="pl-10 border-amber-200 focus:border-amber-600"
                  />
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button onClick={handleAddCategory} className="flex-1 sm:flex-none bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white">
                  <Plus size={18} className="mr-2" />
                  فئة جديدة
                </Button>
                <Button onClick={() => exportToCSV(mockCategories, 'الفئات')} variant="outline" className="flex-1 sm:flex-none border-amber-200 text-amber-600 hover:bg-amber-50">
                  <Download size={18} className="mr-2" />
                  تصدير
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto bg-white rounded-xl border border-amber-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
                    <th className="px-4 py-3 text-right text-amber-900 font-semibold">اسم الفئة</th>
                    <th className="px-4 py-3 text-right text-amber-900 font-semibold">الوصف</th>
                    <th className="px-4 py-3 text-right text-amber-900 font-semibold">الحالة</th>
                    <th className="px-4 py-3 text-right text-amber-900 font-semibold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {mockCategories.map((category) => (
                    <tr key={category.id} className="border-b border-amber-100 hover:bg-amber-50 transition">
                      <td className="px-4 py-3 text-amber-900 font-semibold">{category.name}</td>
                      <td className="px-4 py-3 text-gray-600">{category.description}</td>
                      <td className="px-4 py-3">
                        <Badge className="bg-green-100 text-green-800">نشطة</Badge>
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <button className="p-2 text-amber-600 hover:bg-amber-100 rounded transition">
                          <Edit2 size={16} />
                        </button>
                        <button className="p-2 text-rose-600 hover:bg-rose-100 rounded transition">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Warehouses Tab */}
          <TabsContent value="warehouses" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 rounded-xl border border-amber-200">
              <div className="flex-1 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-amber-600" size={18} />
                  <Input
                    placeholder="ابحث عن مستودع..."
                    className="pl-10 border-amber-200 focus:border-amber-600"
                  />
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button onClick={handleAddWarehouse} className="flex-1 sm:flex-none bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white">
                  <Plus size={18} className="mr-2" />
                  مستودع جديد
                </Button>
                <Button onClick={() => exportToCSV(mockWarehouses, 'المستودعات')} variant="outline" className="flex-1 sm:flex-none border-amber-200 text-amber-600 hover:bg-amber-50">
                  <Download size={18} className="mr-2" />
                  تصدير
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockWarehouses.map((warehouse) => (
                <Card key={warehouse.id} className="bg-white border border-amber-200 rounded-xl p-6 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-amber-900 text-lg">{warehouse.name}</h3>
                      <p className="text-sm text-gray-600">الكود: {warehouse.code}</p>
                    </div>
                    <Warehouse size={24} className="text-amber-600" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">الموقع: {warehouse.location}</p>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={warehouse.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {warehouse.isActive ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 p-2 text-amber-600 hover:bg-amber-100 rounded transition flex items-center justify-center gap-1">
                      <Edit2 size={16} />
                      تعديل
                    </button>
                    <button className="flex-1 p-2 text-rose-600 hover:bg-rose-100 rounded transition flex items-center justify-center gap-1">
                      <Trash2 size={16} />
                      حذف
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="p-6 bg-white rounded-xl shadow-md border border-amber-100">
              <h3 className="text-lg font-bold text-amber-900 mb-4">تحليل المبيعات</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#fcd34d" />
                  <XAxis dataKey="month" stroke="#92400e" />
                  <YAxis stroke="#92400e" />
                  <Tooltip contentStyle={{ backgroundColor: '#fef3c7', border: '1px solid #d97706' }} />
                  <Legend />
                  <Bar dataKey="sales" fill="#d97706" name="المبيعات" />
                  <Bar dataKey="revenue" fill="#800020" name="الإيرادات" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card className="p-6 bg-white rounded-xl border border-amber-200">
              <h3 className="text-lg font-bold text-amber-900 mb-4">إعدادات النظام</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-amber-900 mb-2">اسم المتجر</label>
                  <Input defaultValue="Rose Online" className="border-amber-200" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-amber-900 mb-2">البريد الإلكتروني</label>
                  <Input type="email" defaultValue="info@roseonline.com" className="border-amber-200" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-amber-900 mb-2">رقم الهاتف</label>
                  <Input defaultValue="+962 6 1234567" className="border-amber-200" />
                </div>
                <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white">
                  حفظ الإعدادات
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent className="bg-white border border-amber-200">
          <DialogHeader>
            <DialogTitle className="text-amber-900">
              {editingId ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="الاسم" className="border-amber-200" />
            <Input placeholder="البريد الإلكتروني" type="email" className="border-amber-200" />
            <Select>
              <SelectTrigger className="border-amber-200">
                <SelectValue placeholder="اختر الدور" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">مسؤول</SelectItem>
                <SelectItem value="user">مستخدم</SelectItem>
                <SelectItem value="seller">بائع</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button onClick={handleSaveUser} className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
                حفظ
              </Button>
              <Button onClick={() => setShowUserModal(false)} variant="outline" className="flex-1 border-amber-200">
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
        <DialogContent className="bg-white border border-amber-200 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-amber-900">
              {editingId ? 'تعديل المنتج' : 'إضافة منتج جديد'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <Input placeholder="اسم المنتج" className="border-amber-200" />
            <Textarea placeholder="وصف المنتج" className="border-amber-200" />
            <Select>
              <SelectTrigger className="border-amber-200">
                <SelectValue placeholder="اختر الفئة" />
              </SelectTrigger>
              <SelectContent>
                {mockCategories.map(cat => (
                  <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input placeholder="السعر" type="number" className="border-amber-200" />
            <Input placeholder="المخزون" type="number" className="border-amber-200" />
            <Select>
              <SelectTrigger className="border-amber-200">
                <SelectValue placeholder="اختر المستودع" />
              </SelectTrigger>
              <SelectContent>
                {mockWarehouses.map(wh => (
                  <SelectItem key={wh.id} value={wh.code}>{wh.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button onClick={handleSaveProduct} className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
                حفظ
              </Button>
              <Button onClick={() => setShowProductModal(false)} variant="outline" className="flex-1 border-amber-200">
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCategoryModal} onOpenChange={setShowCategoryModal}>
        <DialogContent className="bg-white border border-amber-200">
          <DialogHeader>
            <DialogTitle className="text-amber-900">
              {editingId ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="اسم الفئة" className="border-amber-200" />
            <Textarea placeholder="وصف الفئة" className="border-amber-200" />
            <div className="flex gap-2">
              <Button onClick={handleSaveCategory} className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
                حفظ
              </Button>
              <Button onClick={() => setShowCategoryModal(false)} variant="outline" className="flex-1 border-amber-200">
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showWarehouseModal} onOpenChange={setShowWarehouseModal}>
        <DialogContent className="bg-white border border-amber-200">
          <DialogHeader>
            <DialogTitle className="text-amber-900">
              {editingId ? 'تعديل المستودع' : 'إضافة مستودع جديد'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="اسم المستودع" className="border-amber-200" />
            <Input placeholder="كود المستودع" className="border-amber-200" />
            <Input placeholder="الموقع" className="border-amber-200" />
            <div className="flex gap-2">
              <Button onClick={handleSaveWarehouse} className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
                حفظ
              </Button>
              <Button onClick={() => setShowWarehouseModal(false)} variant="outline" className="flex-1 border-amber-200">
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
