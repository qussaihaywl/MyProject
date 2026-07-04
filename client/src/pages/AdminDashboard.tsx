import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart, Area, AreaChart
} from 'recharts';
import {
  ShoppingCart, TrendingUp, Users, Package, DollarSign, Search, Filter, Download, Plus, Settings,
  Bell, User, LogOut, Edit, Trash2, Eye, CheckCircle, Clock, AlertCircle, Star, Heart, Share2,
  ChevronDown, ChevronRight, Calendar, MapPin, Phone, Mail, MessageSquare, MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/_core/hooks/useAuth';

// Sample data
const chartData = [
  { date: 'Jun 8', orders: 2, revenue: 400 },
  { date: 'Jun 9', orders: 3, revenue: 600 },
  { date: 'Jun 10', orders: 2, revenue: 500 },
  { date: 'Jun 11', orders: 4, revenue: 800 },
  { date: 'Jun 12', orders: 5, revenue: 1200 },
  { date: 'Jun 13', orders: 3, revenue: 700 },
  { date: 'Jun 14', orders: 6, revenue: 1500 },
];

const orderStatusData = [
  { name: 'Pending', value: 12, color: '#FFC107' },
  { name: 'Processing', value: 8, color: '#B2291E' },
  { name: 'Shipped', value: 15, color: '#CD894E' },
  { name: 'Delivered', value: 25, color: '#4CAF50' },
];

const products = [
  { id: 1, name: 'Premium Dress', category: 'Fashion', price: 150, stock: 45, status: 'Active' },
  { id: 2, name: 'Gold Necklace', category: 'Accessories', price: 280, stock: 12, status: 'Active' },
  { id: 3, name: 'Sofa Set', category: 'Furniture', price: 1200, stock: 5, status: 'Low Stock' },
  { id: 4, name: 'Silk Scarf', category: 'Fashion', price: 85, stock: 0, status: 'Out of Stock' },
  { id: 5, name: 'Diamond Ring', category: 'Accessories', price: 450, stock: 8, status: 'Active' },
];

const orders = [
  { id: 'ORD001', customer: 'Fatima Ahmed', amount: 450, status: 'Delivered', date: '2026-06-14' },
  { id: 'ORD002', customer: 'Sara Mohammed', amount: 280, status: 'Shipped', date: '2026-06-13' },
  { id: 'ORD003', customer: 'Layla Hassan', amount: 1200, status: 'Processing', date: '2026-06-12' },
  { id: 'ORD004', customer: 'Noor Ali', amount: 150, status: 'Pending', date: '2026-06-14' },
  { id: 'ORD005', customer: 'Hana Ibrahim', amount: 600, status: 'Delivered', date: '2026-06-11' },
];

const users = [
  { id: 1, name: 'Qussai', email: 'roseonlien@gmail.com', role: 'Admin', status: 'Active', joinDate: '2026-01-15' },
  { id: 2, name: 'Fatima Ahmed', email: 'fatima@example.com', role: 'User', status: 'Active', joinDate: '2026-02-20' },
  { id: 3, name: 'Sara Mohammed', email: 'sara@example.com', role: 'User', status: 'Active', joinDate: '2026-03-10' },
  { id: 4, name: 'Layla Hassan', email: 'layla@example.com', role: 'Seller', status: 'Inactive', joinDate: '2026-01-25' },
];

// Advanced KPI Card Component
const KPICard = ({ icon: Icon, title, value, change, color }: any) => (
  <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer group`}
    style={{
      background: `linear-gradient(135deg, ${color === 'gold' ? '#CD894E' : color === 'pink' ? '#B2291E' : color === 'rose' ? '#C2185B' : '#F4D03F'} 0%, ${color === 'gold' ? '#F4D03F' : color === 'pink' ? '#F06292' : color === 'rose' ? '#B2291E' : '#FFC107'} 100%)`,
    }}>
    {/* Background decoration */}
    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-300"></div>
    
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm group-hover:bg-white/30 transition-colors">
          <Icon size={24} />
        </div>
        <div className={`text-sm font-bold px-2 py-1 rounded-full ${change >= 0 ? 'bg-green-500/30' : 'bg-red-500/30'}`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
        </div>
      </div>
      <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  </div>
);

// Advanced Table Component
const DataTable = ({ columns, data, actions }: any) => (
  <div className="rounded-2xl overflow-hidden shadow-lg border border-gold-200/20">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gradient-to-r from-gold-50 to-pink-50 border-b border-gold-200/30">
            {columns.map((col: any) => (
              <th key={col.key} className="px-6 py-4 text-left text-sm font-bold text-gold-900">
                {col.label}
              </th>
            ))}
            {actions && <th className="px-6 py-4 text-left text-sm font-bold text-gold-900">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row: any, idx: number) => (
            <tr key={idx} className="border-b border-gold-100/30 hover:bg-gold-50/50 transition-colors">
              {columns.map((col: any) => (
                <td key={col.key} className="px-6 py-4 text-sm text-gray-700">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              {actions && (
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gold-100 rounded-lg transition-colors" title="Edit">
                      <Edit size={16} className="text-gold-600" />
                    </button>
                    <button className="p-2 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Status Badge
const StatusBadge = ({ status }: any) => {
  const statusConfig: any = {
    'Active': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
    'Inactive': { bg: 'bg-gray-100', text: 'text-gray-800', icon: Clock },
    'Pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
    'Processing': { bg: 'bg-blue-100', text: 'text-blue-800', icon: TrendingUp },
    'Shipped': { bg: 'bg-purple-100', text: 'text-purple-800', icon: Package },
    'Delivered': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
    'Low Stock': { bg: 'bg-orange-100', text: 'text-orange-800', icon: AlertCircle },
    'Out of Stock': { bg: 'bg-red-100', text: 'text-red-800', icon: AlertCircle },
  };
  
  const config = statusConfig[status] || statusConfig['Active'];
  const Icon = config.icon;
  
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>
      <Icon size={14} />
      {status}
    </span>
  );
};

export default function AdvancedAdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  const filteredProducts = useMemo(
    () => products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [searchTerm]
  );

  const filteredOrders = useMemo(
    () => orders.filter(o => o.customer.toLowerCase().includes(searchTerm.toLowerCase())),
    [searchTerm]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gold-50 via-pink-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gold-200/30 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Title */}
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gold-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                لوحة التحكم الإدارية المتقدمة
              </h1>
              <p className="text-sm text-gray-600 mt-1">مرحباً بك {user?.name} 👋</p>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center bg-gold-50 rounded-lg px-4 py-2 border border-gold-200/50">
                <Search size={18} className="text-gold-600" />
                <input
                  type="text"
                  placeholder="ابحث..."
                  className="bg-transparent ml-2 outline-none text-sm w-32"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="p-2 hover:bg-gold-100 rounded-lg transition-colors relative">
                <Bell size={20} className="text-gold-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-gold-100 rounded-lg transition-colors">
                <User size={20} className="text-gold-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard icon={ShoppingCart} title="إجمالي الطلبات" value="156" change={12} color="gold" />
          <KPICard icon={DollarSign} title="إجمالي الإيرادات" value="$45,230" change={8} color="pink" />
          <KPICard icon={Package} title="المنتجات المتاحة" value="234" change={-3} color="rose" />
          <KPICard icon={Users} title="المستخدمون النشطون" value="1,234" change={15} color="gold" />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-9 bg-white/50 backdrop-blur-sm p-1 rounded-xl border border-gold-200/30 mb-8">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg">
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg">
              المنتجات
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg">
              الطلبات
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg">
              المستخدمون
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg">
              التحليلات
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg">
              التقارير
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg">
              الإعدادات
            </TabsTrigger>
            <TabsTrigger value="addproduct" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg">
              إضافة منتج
            </TabsTrigger>
            <TabsTrigger value="categories" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg">
              الفئات
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Orders Chart */}
              <Card className="p-6 rounded-2xl shadow-lg border-gold-200/30">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="text-gold-600" />
                  الطلبات والإيرادات
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                    <XAxis dataKey="date" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '2px solid #CD894E', borderRadius: '8px' }} />
                    <Legend />
                    <Area type="monotone" dataKey="revenue" fill="#CD894E" stroke="#CD894E" fillOpacity={0.2} />
                    <Bar dataKey="orders" fill="#B2291E" />
                  </ComposedChart>
                </ResponsiveContainer>
              </Card>

              {/* Status Distribution */}
              <Card className="p-6 rounded-2xl shadow-lg border-gold-200/30">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="text-pink-600" />
                  توزيع حالات الطلبات
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={orderStatusData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={100} fill="#8884d8" dataKey="value">
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card className="p-6 rounded-2xl shadow-lg border-gold-200/30">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ShoppingCart className="text-gold-600" />
                آخر الطلبات
              </h3>
              <DataTable
                columns={[
                  { key: 'id', label: 'رقم الطلب' },
                  { key: 'customer', label: 'العميل' },
                  { key: 'amount', label: 'المبلغ', render: (val: any) => `$${val}` },
                  { key: 'status', label: 'الحالة', render: (val: any) => <StatusBadge status={val} /> },
                  { key: 'date', label: 'التاريخ' },
                ]}
                data={orders}
                actions
              />
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex gap-4 mb-6">
              <div className="flex-1 flex items-center bg-white rounded-lg px-4 py-2 border border-gold-200/50 shadow-sm">
                <Search size={18} className="text-gold-600" />
                <input
                  type="text"
                  placeholder="ابحث عن المنتجات..."
                  className="bg-transparent ml-2 outline-none flex-1"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="px-6 py-2 bg-gradient-to-r from-gold-500 to-pink-500 text-white rounded-lg font-bold hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2">
                <Plus size={18} />
                منتج جديد
              </button>
            </div>

            <Card className="p-6 rounded-2xl shadow-lg border-gold-200/30">
              <p className="text-gray-600 text-center py-8">عدد المنتجات: 56 منتج متاح</p>
              <div className="text-center text-sm text-gray-500">
                <p>يمكنك إضافة منتجات جديدة باستخدام الزر أعلاه</p>
              </div>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex gap-4 mb-6">
              <div className="flex-1 flex items-center bg-white rounded-lg px-4 py-2 border border-gold-200/50 shadow-sm">
                <Search size={18} className="text-gold-600" />
                <input
                  type="text"
                  placeholder="ابحث عن الطلبات..."
                  className="bg-transparent ml-2 outline-none flex-1"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="px-6 py-2 bg-gradient-to-r from-gold-500 to-pink-500 text-white rounded-lg font-bold hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2">
                <Download size={18} />
                تصدير
              </button>
            </div>

            <Card className="p-6 rounded-2xl shadow-lg border-gold-200/30">
              <p className="text-gray-600 text-center py-8">لا توجد طلبات حالياً. يمكن للعملاء إنشاء طلبات من صفحة المنتجات.</p>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex gap-4 mb-6">
              <button className="px-6 py-2 bg-gradient-to-r from-gold-500 to-pink-500 text-white rounded-lg font-bold hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2">
                <Plus size={18} />
                مستخدم جديد
              </button>
            </div>

            <DataTable
              columns={[
                { key: 'name', label: 'الاسم' },
                { key: 'email', label: 'البريد الإلكتروني' },
                { key: 'role', label: 'الدور', render: (val: any) => <Badge className="bg-gold-100 text-gold-900">{val}</Badge> },
                { key: 'status', label: 'الحالة', render: (val: any) => <StatusBadge status={val} /> },
                { key: 'joinDate', label: 'تاريخ الانضمام' },
              ]}
              data={users}
              actions
            />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="p-6 rounded-2xl shadow-lg border-gold-200/30">
              <h3 className="text-lg font-bold text-gray-900 mb-4">تحليلات متقدمة</h3>
              <p className="text-gray-600">سيتم إضافة التحليلات المتقدمة قريباً...</p>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card className="p-6 rounded-2xl shadow-lg border-gold-200/30">
              <h3 className="text-lg font-bold text-gray-900 mb-4">التقارير</h3>
              <p className="text-gray-600">سيتم إضافة التقارير قريباً...</p>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="p-6 rounded-2xl shadow-lg border-gold-200/30">
              <h3 className="text-lg font-bold text-gray-900 mb-4">الإعدادات</h3>
              <p className="text-gray-600">سيتم إضافة الإعدادات قريباً...</p>
            </Card>
          </TabsContent>

          {/* Add Product Tab */}
          <TabsContent value="addproduct" className="space-y-6">
            <Card className="p-8 rounded-2xl shadow-lg border-gold-200/30">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">إضافة منتج جديد</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">اسم المنتج</label>
                  <input type="text" placeholder="أدخل اسم المنتج" className="w-full px-4 py-2 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">السعر</label>
                  <input type="number" placeholder="أدخل السعر" className="w-full px-4 py-2 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">الفئة</label>
                  <select className="w-full px-4 py-2 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500">
                    <option>اختر الفئة</option>
                    <option>الملابس</option>
                    <option>الأثاث</option>
                    <option>الإكسسوارات</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">المخزون</label>
                  <input type="number" placeholder="أدخل كمية المخزون" className="w-full px-4 py-2 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500" />
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">الوصف</label>
                <textarea placeholder="أدخل وصف المنتج" rows={4} className="w-full px-4 py-2 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"></textarea>
              </div>
              <div className="mt-6 flex gap-4">
                <button className="px-6 py-2 bg-gradient-to-r from-gold-500 to-pink-500 text-white rounded-lg font-bold hover:shadow-lg transition-all hover:scale-105">
                  حفظ المنتج
                </button>
                <button className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-400 transition-all">
                  إلغاء
                </button>
              </div>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div className="flex gap-4 mb-6">
              <button className="px-6 py-2 bg-gradient-to-r from-gold-500 to-pink-500 text-white rounded-lg font-bold hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2">
                <Plus size={18} />
                فئة جديدة
              </button>
            </div>
            <Card className="p-6 rounded-2xl shadow-lg border-gold-200/30">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['الملابس', 'الأثاث', 'الإكسسوارات'].map((cat) => (
                  <div key={cat} className="p-4 border border-gold-200 rounded-lg hover:shadow-lg transition-all">
                    <h4 className="font-bold text-gray-900 mb-2">{cat}</h4>
                    <p className="text-sm text-gray-600 mb-4">نشطة</p>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">تعديل</button>
                      <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">حذف</button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-gold-500 to-pink-500 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all flex items-center justify-center group">
        <Plus size={28} className="group-hover:rotate-90 transition-transform" />
      </button>
    </div>
  );
}
