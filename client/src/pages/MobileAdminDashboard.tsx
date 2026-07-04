import React, { useState, useMemo } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Menu, X, Search, Plus, Edit2, Trash2, LogOut, BarChart3, Users, Package, ShoppingCart, Settings, FileText, Bell, Download, Filter } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'seller' | 'supervisor';
  status: 'active' | 'inactive';
  joinDate: string;
  permissions: string[];
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'low_stock' | 'out_of_stock';
  image?: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
}

interface Warehouse {
  id: string;
  name: string;
  location: string;
  totalItems: number;
  capacity: number;
}

const MobileAdminDashboard = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string } | null>(null);

  // Modal states
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddWarehouse, setShowAddWarehouse] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Sample data
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Qussai', email: 'roseonlien@gmail.com', role: 'admin', status: 'active', joinDate: '2026-01-15', permissions: ['all'] },
    { id: '2', name: 'Fatima Ahmed', email: 'fatima@example.com', role: 'user', status: 'active', joinDate: '2026-02-20', permissions: ['view', 'purchase'] },
    { id: '3', name: 'Sara Mohammed', email: 'sara@example.com', role: 'seller', status: 'active', joinDate: '2026-03-10', permissions: ['view', 'sell', 'manage'] },
    { id: '4', name: 'Layla Hassan', email: 'layla@example.com', role: 'supervisor', status: 'inactive', joinDate: '2026-01-25', permissions: ['view', 'manage'] },
  ]);

  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Premium Dress', category: 'Fashion', price: 150, stock: 45, status: 'active' },
    { id: '2', name: 'Gold Necklace', category: 'Accessories', price: 280, stock: 12, status: 'active' },
    { id: '3', name: 'Sofa Set', category: 'Furniture', price: 1200, stock: 5, status: 'low_stock' },
    { id: '4', name: 'Silk Scarf', category: 'Fashion', price: 85, stock: 0, status: 'out_of_stock' },
  ]);

  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Fashion', description: 'Clothing and Accessories', productCount: 45 },
    { id: '2', name: 'Furniture', description: 'Home Furniture', productCount: 28 },
    { id: '3', name: 'Accessories', description: 'Jewelry and Accessories', productCount: 62 },
  ]);

  const [warehouses, setWarehouses] = useState<Warehouse[]>([
    { id: '1', name: 'Main Warehouse', location: 'Amman', totalItems: 2500, capacity: 5000 },
    { id: '2', name: 'Secondary Warehouse', location: 'Zarqa', totalItems: 1200, capacity: 3000 },
  ]);

  // Filter functions
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = filterRole === 'all' || u.role === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, filterRole]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [products, searchQuery]);

  // Stats
  const stats = {
    totalOrders: 156,
    totalRevenue: 45230,
    totalProducts: 234,
    activeUsers: 1234,
  };

  // Handle delete
  const handleDelete = () => {
    if (!deleteConfirm) return;
    
    if (deleteConfirm.type === 'user') {
      setUsers(users.filter(u => u.id !== deleteConfirm.id));
    } else if (deleteConfirm.type === 'product') {
      setProducts(products.filter(p => p.id !== deleteConfirm.id));
    } else if (deleteConfirm.type === 'category') {
      setCategories(categories.filter(c => c.id !== deleteConfirm.id));
    } else if (deleteConfirm.type === 'warehouse') {
      setWarehouses(warehouses.filter(w => w.id !== deleteConfirm.id));
    }
    setDeleteConfirm(null);
  };

  // Handle logout
  const handleLogout = () => {
    // Logout logic
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50">
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-700 via-red-600 to-red-500 text-white shadow-lg">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Left: Menu Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-red-600 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Center: Logo & Store Name */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white border-2 border-white flex items-center justify-center">
              <span className="text-red-700 font-bold text-lg">R</span>
            </div>
            <span className="font-bold text-sm md:text-base">Rose Online</span>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-red-600 rounded-lg transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-300 rounded-full"></span>
            </button>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-red-600 rounded-lg transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div
        className={`fixed left-0 top-16 bottom-0 w-64 bg-white shadow-lg transform transition-transform duration-300 z-40 overflow-y-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="p-4 space-y-2">
          <button
            onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'overview' ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white' : 'hover:bg-gray-100'
            }`}
          >
            <BarChart3 size={20} />
            <span>نظرة عامة</span>
          </button>
          <button
            onClick={() => { setActiveTab('products'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'products' ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white' : 'hover:bg-gray-100'
            }`}
          >
            <Package size={20} />
            <span>المنتجات</span>
          </button>
          <button
            onClick={() => { setActiveTab('users'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'users' ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white' : 'hover:bg-gray-100'
            }`}
          >
            <Users size={20} />
            <span>المستخدمون</span>
          </button>
          <button
            onClick={() => { setActiveTab('categories'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'categories' ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white' : 'hover:bg-gray-100'
            }`}
          >
            <FileText size={20} />
            <span>الفئات</span>
          </button>
          <button
            onClick={() => { setActiveTab('warehouses'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'warehouses' ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white' : 'hover:bg-gray-100'
            }`}
          >
            <ShoppingCart size={20} />
            <span>المستودعات</span>
          </button>
          <button
            onClick={() => { setActiveTab('orders'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'orders' ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white' : 'hover:bg-gray-100'
            }`}
          >
            <ShoppingCart size={20} />
            <span>الطلبات</span>
          </button>
          <button
            onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'settings' ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white' : 'hover:bg-gray-100'
            }`}
          >
            <Settings size={20} />
            <span>الإعدادات</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <main className="pt-20 pb-20 px-4 md:ml-0">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">مرحباً بك {user?.name} 👋</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card className="bg-gradient-to-br from-yellow-400 to-orange-400 text-white p-4 rounded-lg shadow-lg">
                <div className="text-xs font-semibold opacity-80">إجمالي الطلبات</div>
                <div className="text-2xl font-bold mt-2">{stats.totalOrders}</div>
                <div className="text-xs mt-1">↑ 12%</div>
              </Card>
              <Card className="bg-gradient-to-br from-pink-500 to-red-500 text-white p-4 rounded-lg shadow-lg">
                <div className="text-xs font-semibold opacity-80">إجمالي الإيرادات</div>
                <div className="text-2xl font-bold mt-2">${stats.totalRevenue}</div>
                <div className="text-xs mt-1">↑ 8%</div>
              </Card>
              <Card className="bg-gradient-to-br from-orange-400 to-yellow-400 text-white p-4 rounded-lg shadow-lg">
                <div className="text-xs font-semibold opacity-80">المنتجات</div>
                <div className="text-2xl font-bold mt-2">{stats.totalProducts}</div>
                <div className="text-xs mt-1">↓ 3%</div>
              </Card>
              <Card className="bg-gradient-to-br from-pink-400 to-orange-400 text-white p-4 rounded-lg shadow-lg">
                <div className="text-xs font-semibold opacity-80">المستخدمون</div>
                <div className="text-2xl font-bold mt-2">{stats.activeUsers}</div>
                <div className="text-xs mt-1">↑ 15%</div>
              </Card>
            </div>

            {/* Charts Placeholder */}
            <Card className="p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-gray-800 mb-4">الطلبات والإيرادات</h3>
              <div className="h-64 bg-gradient-to-br from-pink-100 to-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">رسم بياني للطلبات والإيرادات</span>
              </div>
            </Card>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex gap-2 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <Input
                  placeholder="ابحث عن المنتجات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 py-2 rounded-lg border-2 border-pink-200"
                />
              </div>
              <Button
                onClick={() => setShowAddProduct(true)}
                className="bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg flex items-center gap-2"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">منتج جديد</span>
              </Button>
            </div>

            <div className="space-y-3">
              {filteredProducts.map(product => (
                <Card key={product.id} className="p-4 rounded-lg shadow-md">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-800">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.category}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      product.status === 'active' ? 'bg-green-100 text-green-700' :
                      product.status === 'low_stock' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {product.status === 'active' ? 'نشط' : product.status === 'low_stock' ? 'مخزون منخفض' : 'نفد المخزون'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">السعر: <span className="font-bold text-pink-600">${product.price}</span></p>
                      <p className="text-sm text-gray-600">المخزون: <span className="font-bold">{product.stock}</span></p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditingItem(product); setShowAddProduct(true); }}
                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ type: 'product', id: product.id })}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex gap-2 mb-4 flex-col sm:flex-row">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <Input
                  placeholder="ابحث عن المستخدمين..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 py-2 rounded-lg border-2 border-pink-200"
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
              <Button
                onClick={() => setShowAddUser(true)}
                className="bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg flex items-center gap-2"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">مستخدم جديد</span>
              </Button>
            </div>

            <div className="space-y-3">
              {filteredUsers.map(u => (
                <Card key={u.id} className="p-4 rounded-lg shadow-md">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-800">{u.name}</h3>
                      <p className="text-sm text-gray-600">{u.email}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {u.status === 'active' ? 'نشط' : 'غير نشط'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">{u.role}</span>
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">{u.joinDate}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditingItem(u); setShowAddUser(true); }}
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
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <Button
              onClick={() => setShowAddCategory(true)}
              className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg flex items-center justify-center gap-2 mb-4"
            >
              <Plus size={18} />
              فئة جديدة
            </Button>

            <div className="space-y-3">
              {categories.map(cat => (
                <Card key={cat.id} className="p-4 rounded-lg shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-800">{cat.name}</h3>
                      <p className="text-sm text-gray-600">{cat.description}</p>
                      <p className="text-sm text-gray-600 mt-1">عدد المنتجات: <span className="font-bold">{cat.productCount}</span></p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditingItem(cat); setShowAddCategory(true); }}
                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ type: 'category', id: cat.id })}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Warehouses Tab */}
        {activeTab === 'warehouses' && (
          <div className="space-y-4">
            <Button
              onClick={() => setShowAddWarehouse(true)}
              className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg flex items-center justify-center gap-2 mb-4"
            >
              <Plus size={18} />
              مستودع جديد
            </Button>

            <div className="space-y-3">
              {warehouses.map(warehouse => (
                <Card key={warehouse.id} className="p-4 rounded-lg shadow-md">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-800">{warehouse.name}</h3>
                      <p className="text-sm text-gray-600">{warehouse.location}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditingItem(warehouse); setShowAddWarehouse(true); }}
                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ type: 'warehouse', id: warehouse.id })}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">السعة المستخدمة</span>
                      <span className="text-sm font-bold">{warehouse.totalItems} / {warehouse.capacity}</span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-pink-500 to-orange-500 h-2 rounded-full"
                        style={{ width: `${(warehouse.totalItems / warehouse.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <Card className="p-6 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-bold text-gray-800 mb-2">إدارة الطلبات</h3>
              <p className="text-gray-600">سيتم إضافة إدارة الطلبات المتقدمة قريباً...</p>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            <Card className="p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-gray-800 mb-4">الإعدادات</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">اسم المتجر</label>
                  <Input placeholder="Rose Online" className="w-full rounded-lg border-2 border-pink-200" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">البريد الإلكتروني</label>
                  <Input placeholder="info@roseonline.com" className="w-full rounded-lg border-2 border-pink-200" />
                </div>
                <Button className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg">
                  حفظ الإعدادات
                </Button>
              </div>
            </Card>
          </div>
        )}
      </main>

      {/* Add Product Modal */}
      <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
        <DialogContent className="max-w-md rounded-lg">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'تعديل المنتج' : 'إضافة منتج جديد'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="اسم المنتج" className="rounded-lg border-2 border-pink-200" />
            <Select>
              <SelectTrigger className="rounded-lg border-2 border-pink-200">
                <SelectValue placeholder="اختر الفئة" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input placeholder="السعر" type="number" className="rounded-lg border-2 border-pink-200" />
            <Input placeholder="المخزون" type="number" className="rounded-lg border-2 border-pink-200" />
            <Select>
              <SelectTrigger className="rounded-lg border-2 border-pink-200">
                <SelectValue placeholder="اختر المستودع" />
              </SelectTrigger>
              <SelectContent>
                {warehouses.map(w => (
                  <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button onClick={() => setShowAddProduct(false)} variant="outline" className="flex-1 rounded-lg">
                إلغاء
              </Button>
              <Button className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg" onClick={() => setShowAddProduct(false)}>
                {editingItem ? 'تحديث' : 'إضافة'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add User Modal */}
      <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
        <DialogContent className="max-w-md rounded-lg">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="الاسم" className="rounded-lg border-2 border-pink-200" />
            <Input placeholder="البريد الإلكتروني" type="email" className="rounded-lg border-2 border-pink-200" />
            <Select>
              <SelectTrigger className="rounded-lg border-2 border-pink-200">
                <SelectValue placeholder="اختر الدور" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">مستخدم</SelectItem>
                <SelectItem value="seller">بائع</SelectItem>
                <SelectItem value="supervisor">مشرف</SelectItem>
                <SelectItem value="admin">مسؤول</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="كلمة المرور" type="password" className="rounded-lg border-2 border-pink-200" />
            <div className="flex gap-2">
              <Button onClick={() => setShowAddUser(false)} variant="outline" className="flex-1 rounded-lg">
                إلغاء
              </Button>
              <Button className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg" onClick={() => setShowAddUser(false)}>
                {editingItem ? 'تحديث' : 'إضافة'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent className="rounded-lg">
          <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
          <AlertDialogDescription>
            هل أنت متأكد من رغبتك في حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.
          </AlertDialogDescription>
          <div className="flex gap-2">
            <AlertDialogCancel className="flex-1 rounded-lg">إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="flex-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              حذف
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MobileAdminDashboard;
