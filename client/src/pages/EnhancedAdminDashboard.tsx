import { useState, useMemo } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { downloadCSV, downloadBlob } from '@/lib/export-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Search, Plus, Edit2, Trash2, LogOut, BarChart3, Users, Package, ShoppingCart, Settings, FileText, Bell, Download, Filter, ChevronRight, Eye, EyeOff, Lock, Unlock, X } from 'lucide-react';
import { toast } from 'sonner';

const EnhancedAdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string } | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Modal states
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);

  // Form states
  const [formData, setFormData] = useState<any>({});

  // Mock real data from database
  const [users, setUsers] = useState([
    { id: '1', name: 'Qussai', email: 'roseonlien@gmail.com', role: 'admin', status: 'active', createdAt: new Date('2026-01-15'), phone: '+962791234567' },
    { id: '2', name: 'Fatima Ahmed', email: 'fatima@example.com', role: 'user', status: 'active', createdAt: new Date('2026-02-20'), phone: '+962791234568' },
    { id: '3', name: 'Sara Mohammed', email: 'sara@example.com', role: 'seller', status: 'active', createdAt: new Date('2026-03-10'), phone: '+962791234569' },
    { id: '4', name: 'Layla Hassan', email: 'layla@example.com', role: 'supervisor', status: 'inactive', createdAt: new Date('2026-01-25'), phone: '+962791234570' },
  ]);

  const [products, setProducts] = useState([
    { id: '1', name: 'Premium Dress', category: 'Fashion', price: 150, stock: 45, description: 'فستان فاخر من أفضل الأقمشة' },
    { id: '2', name: 'Gold Necklace', category: 'Accessories', price: 280, stock: 12, description: 'عقد ذهبي أصلي' },
    { id: '3', name: 'Sofa Set', category: 'Furniture', price: 1200, stock: 5, description: 'مجموعة أريكة فخمة' },
    { id: '4', name: 'Silk Scarf', category: 'Fashion', price: 85, stock: 0, description: 'وشاح حرير طبيعي' },
  ]);

  const stats = {
    totalOrders: 156,
    totalRevenue: 45230,
    totalProducts: 234,
    activeUsers: 1234,
  };

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

  // Add notification
  const addNotification = (type: string, message: string) => {
    const notification = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date(),
    };
    setNotifications([notification, ...notifications]);
    toast.success(message);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  // Handle add user
  const handleAddUser = () => {
    if (!formData.name || !formData.email) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    
    const newUser = {
      id: String(users.length + 1),
      ...formData,
      status: 'active',
      createdAt: new Date(),
    };
    
    setUsers([...users, newUser]);
    addNotification('user_added', `تم إضافة المستخدم ${formData.name} بنجاح`);
    setShowAddUser(false);
    setFormData({});
  };

  // Handle add product
  const handleAddProduct = () => {
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    
    const newProduct = {
      id: String(products.length + 1),
      ...formData,
      stock: formData.stock || 0,
    };
    
    setProducts([...products, newProduct]);
    addNotification('product_added', `تم إضافة المنتج ${formData.name} بنجاح`);
    setShowAddProduct(false);
    setFormData({});
  };

  // Handle edit user
  const handleEditUser = (user: any) => {
    setEditingItem(user);
    setFormData(user);
    setShowEditUser(true);
  };

  // Handle save edit user
  const handleSaveEditUser = () => {
    setUsers(users.map(u => u.id === editingItem.id ? { ...u, ...formData } : u));
    addNotification('user_updated', `تم تحديث المستخدم ${formData.name} بنجاح`);
    setShowEditUser(false);
    setEditingItem(null);
    setFormData({});
  };

  // Handle delete user
  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    addNotification('user_deleted', 'تم حذف المستخدم بنجاح');
    setDeleteConfirm(null);
  };

  // Handle delete product
  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    addNotification('product_deleted', 'تم حذف المنتج بنجاح');
    setDeleteConfirm(null);
  };

  // Export to CSV
  const exportToCSV = (data: any[], filename: string) => {
    const headers = Object.keys(data[0] || {});
    const rows = data.map(row => headers.map(h => row[h]));
    downloadCSV(headers, rows, `${filename}.csv`);

    addNotification('export_success', `تم تصدير ${filename} بنجاح`);
  };

  // Export to PDF (simplified)
  const exportToPDF = (data: any[], filename: string) => {
    downloadBlob(JSON.stringify(data, null, 2), `${filename}.pdf`, 'application/pdf');

    addNotification('export_success', `تم تصدير ${filename} إلى PDF بنجاح`);
  };

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
              <p className="text-sm text-gray-600">لوحة التحكم الإدارية المتقدمة</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Notifications Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-pink-100 rounded-lg transition-colors relative"
              >
                <Bell size={24} className="text-pink-600" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-pink-200 max-h-96 overflow-y-auto z-50">
                  <div className="p-4 border-b border-pink-200">
                    <h3 className="font-bold text-gray-800">الإشعارات</h3>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">لا توجد إشعارات</div>
                  ) : (
                    <div className="divide-y">
                      {notifications.map(notif => (
                        <div key={notif.id} className="p-4 hover:bg-pink-50 transition-colors">
                          <p className="text-sm text-gray-800">{notif.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notif.timestamp.toLocaleTimeString('ar-JO')}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            
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
                    className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white"
                  >
                    <Plus size={20} className="ml-2" />
                    مستخدم جديد
                  </Button>
                </div>

                {/* Search and Filter */}
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search size={20} className="absolute right-3 top-3 text-gray-400" />
                    <Input
                      placeholder="ابحث عن المستخدمين..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10"
                    />
                  </div>
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="جميع الأدوار" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأدوار</SelectItem>
                      <SelectItem value="admin">مسؤول</SelectItem>
                      <SelectItem value="user">مستخدم</SelectItem>
                      <SelectItem value="seller">بائع</SelectItem>
                      <SelectItem value="supervisor">مشرف</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={() => exportToCSV(filteredUsers, 'users')}
                    variant="outline"
                    className="border-pink-300"
                  >
                    <Download size={20} className="ml-2" />
                    CSV
                  </Button>
                  <Button 
                    onClick={() => exportToPDF(filteredUsers, 'users')}
                    variant="outline"
                    className="border-pink-300"
                  >
                    <Download size={20} className="ml-2" />
                    PDF
                  </Button>
                </div>

                {/* Users Table */}
                <Card className="p-6 rounded-2xl shadow-lg overflow-x-auto">
                  <table className="w-full text-right">
                    <thead>
                      <tr className="border-b-2 border-pink-200">
                        <th className="pb-4 font-bold text-gray-700">الاسم</th>
                        <th className="pb-4 font-bold text-gray-700">البريد الإلكتروني</th>
                        <th className="pb-4 font-bold text-gray-700">الدور</th>
                        <th className="pb-4 font-bold text-gray-700">الحالة</th>
                        <th className="pb-4 font-bold text-gray-700">تاريخ الانضمام</th>
                        <th className="pb-4 font-bold text-gray-700">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(u => (
                        <tr key={u.id} className="border-b border-pink-100 hover:bg-pink-50 transition-colors">
                          <td className="py-4">{u.name}</td>
                          <td className="py-4">{u.email}</td>
                          <td className="py-4">
                            <span className="px-3 py-1 rounded-full text-sm font-bold bg-pink-200 text-pink-800">
                              {u.role}
                            </span>
                          </td>
                          <td className="py-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                              u.status === 'active' 
                                ? 'bg-green-200 text-green-800' 
                                : 'bg-red-200 text-red-800'
                            }`}>
                              {u.status === 'active' ? 'نشط' : 'غير نشط'}
                            </span>
                          </td>
                          <td className="py-4">{u.createdAt.toLocaleDateString('ar-JO')}</td>
                          <td className="py-4 flex gap-2">
                            <button 
                              onClick={() => handleEditUser(u)}
                              className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              <Edit2 size={18} className="text-blue-600" />
                            </button>
                            <button 
                              onClick={() => setDeleteConfirm({ type: 'user', id: u.id })}
                              className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} className="text-red-600" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
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
                    className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white"
                  >
                    <Plus size={20} className="ml-2" />
                    منتج جديد
                  </Button>
                </div>

                {/* Search */}
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search size={20} className="absolute right-3 top-3 text-gray-400" />
                    <Input
                      placeholder="ابحث عن المنتجات..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10"
                    />
                  </div>
                  <Button 
                    onClick={() => exportToCSV(filteredProducts, 'products')}
                    variant="outline"
                    className="border-pink-300"
                  >
                    <Download size={20} className="ml-2" />
                    CSV
                  </Button>
                  <Button 
                    onClick={() => exportToPDF(filteredProducts, 'products')}
                    variant="outline"
                    className="border-pink-300"
                  >
                    <Download size={20} className="ml-2" />
                    PDF
                  </Button>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(p => (
                    <Card key={p.id} className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                      <div className="mb-4 h-40 bg-gradient-to-br from-pink-100 to-orange-100 rounded-xl flex items-center justify-center">
                        <Package size={48} className="text-pink-400" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{p.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{p.category}</p>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold text-pink-600">${p.price}</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                          p.stock > 10 
                            ? 'bg-green-200 text-green-800' 
                            : p.stock > 0
                            ? 'bg-yellow-200 text-yellow-800'
                            : 'bg-red-200 text-red-800'
                        }`}>
                          {p.stock > 0 ? `${p.stock} متوفر` : 'نفد المخزون'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 p-2 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center gap-2">
                          <Edit2 size={18} className="text-blue-600" />
                          <span className="text-sm">تعديل</span>
                        </button>
                        <button 
                          onClick={() => setDeleteConfirm({ type: 'product', id: p.id })}
                          className="flex-1 p-2 hover:bg-red-100 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <Trash2 size={18} className="text-red-600" />
                          <span className="text-sm">حذف</span>
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-800">إدارة الطلبات</h2>
                <Card className="p-8 rounded-2xl shadow-lg text-center">
                  <ShoppingCart size={48} className="mx-auto text-pink-400 mb-4" />
                  <p className="text-gray-600">سيتم إضافة إدارة الطلبات المتقدمة قريباً</p>
                </Card>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-800">التقارير</h2>
                <Card className="p-8 rounded-2xl shadow-lg text-center">
                  <FileText size={48} className="mx-auto text-pink-400 mb-4" />
                  <p className="text-gray-600">سيتم إضافة التقارير المتقدمة قريباً</p>
                </Card>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-800">الإعدادات</h2>
                <Card className="p-8 rounded-2xl shadow-lg text-center">
                  <Settings size={48} className="mx-auto text-pink-400 mb-4" />
                  <p className="text-gray-600">سيتم إضافة الإعدادات المتقدمة قريباً</p>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add User Modal */}
      <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>إضافة مستخدم جديد</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">الاسم</label>
              <Input
                placeholder="أدخل الاسم"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني</label>
              <Input
                type="email"
                placeholder="أدخل البريد الإلكتروني"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">الدور</label>
              <Select value={formData.role || 'user'} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">مستخدم</SelectItem>
                  <SelectItem value="seller">بائع</SelectItem>
                  <SelectItem value="admin">مسؤول</SelectItem>
                  <SelectItem value="supervisor">مشرف</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">رقم الهاتف</label>
              <Input
                placeholder="أدخل رقم الهاتف"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleAddUser}
                className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white"
              >
                إضافة
              </Button>
              <Button 
                onClick={() => setShowAddUser(false)}
                variant="outline"
                className="flex-1"
              >
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={showEditUser} onOpenChange={setShowEditUser}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>تعديل المستخدم</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">الاسم</label>
              <Input
                placeholder="أدخل الاسم"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني</label>
              <Input
                type="email"
                placeholder="أدخل البريد الإلكتروني"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">الدور</label>
              <Select value={formData.role || 'user'} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">مستخدم</SelectItem>
                  <SelectItem value="seller">بائع</SelectItem>
                  <SelectItem value="admin">مسؤول</SelectItem>
                  <SelectItem value="supervisor">مشرف</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">الحالة</label>
              <Select value={formData.status || 'active'} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="inactive">غير نشط</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleSaveEditUser}
                className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white"
              >
                حفظ
              </Button>
              <Button 
                onClick={() => setShowEditUser(false)}
                variant="outline"
                className="flex-1"
              >
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Product Modal */}
      <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>إضافة منتج جديد</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">اسم المنتج</label>
              <Input
                placeholder="أدخل اسم المنتج"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">الفئة</label>
              <Select value={formData.category || ''} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفئة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fashion">أزياء</SelectItem>
                  <SelectItem value="Accessories">إكسسوارات</SelectItem>
                  <SelectItem value="Furniture">أثاث</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">السعر</label>
              <Input
                type="number"
                placeholder="أدخل السعر"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">المخزون</label>
              <Input
                type="number"
                placeholder="أدخل كمية المخزون"
                value={formData.stock || ''}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleAddProduct}
                className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white"
              >
                إضافة
              </Button>
              <Button 
                onClick={() => setShowAddProduct(false)}
                variant="outline"
                className="flex-1"
              >
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
          <AlertDialogDescription>
            هل أنت متأكد من رغبتك في حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.
          </AlertDialogDescription>
          <div className="flex gap-2 pt-4">
            <AlertDialogAction 
              onClick={() => {
                if (deleteConfirm?.type === 'user') {
                  handleDeleteUser(deleteConfirm.id);
                } else if (deleteConfirm?.type === 'product') {
                  handleDeleteProduct(deleteConfirm.id);
                }
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              حذف
            </AlertDialogAction>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EnhancedAdminDashboard;
