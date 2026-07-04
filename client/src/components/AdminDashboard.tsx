import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Menu, X, Home, Package, ShoppingCart, Users, BarChart3,
  Settings, LogOut, Bell, Search, ChevronDown, Plus, Edit2,
  Trash2, Eye, Download, Filter, TrendingUp, DollarSign,
  User, Lock, Shield, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';

// Sample data for charts
const salesData = [
  { month: 'يناير', sales: 4000, revenue: 2400 },
  { month: 'فبراير', sales: 3000, revenue: 1398 },
  { month: 'مارس', sales: 2000, revenue: 9800 },
  { month: 'أبريل', sales: 2780, revenue: 3908 },
  { month: 'مايو', sales: 1890, revenue: 4800 },
  { month: 'يونيو', sales: 2390, revenue: 3800 },
];

const categoryData = [
  { name: 'الملابس', value: 35, color: '#f59e0b' },
  { name: 'الأثاث', value: 30, color: '#d97706' },
  { name: 'الإكسسوارات', value: 25, color: '#b45309' },
  { name: 'أخرى', value: 10, color: '#92400e' },
];

const recentOrders = [
  { id: 1, customer: 'أحمد محمد', amount: '250 د.ا', status: 'مكتمل', date: '2026-06-12' },
  { id: 2, customer: 'فاطمة علي', amount: '180 د.ا', status: 'قيد المعالجة', date: '2026-06-11' },
  { id: 3, customer: 'محمود سالم', amount: '320 د.ا', status: 'معلق', date: '2026-06-10' },
  { id: 4, customer: 'نور خالد', amount: '150 د.ا', status: 'مكتمل', date: '2026-06-09' },
  { id: 5, customer: 'سارة يوسف', amount: '420 د.ا', status: 'مكتمل', date: '2026-06-08' },
];

const users = [
  { id: 1, name: 'أحمد محمد', email: 'ahmed@example.com', role: 'مسؤول', status: 'نشط' },
  { id: 2, name: 'فاطمة علي', email: 'fatima@example.com', role: 'مستخدم', status: 'نشط' },
  { id: 3, name: 'محمود سالم', email: 'mahmoud@example.com', role: 'مندوب', status: 'نشط' },
  { id: 4, name: 'نور خالد', email: 'noor@example.com', role: 'مشرف', status: 'معطل' },
  { id: 5, name: 'سارة يوسف', email: 'sarah@example.com', role: 'مستخدم', status: 'نشط' },
];

export const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: Home },
    { id: 'products', label: 'المنتجات', icon: Package },
    { id: 'orders', label: 'الطلبات', icon: ShoppingCart },
    { id: 'users', label: 'المستخدمون', icon: Users },
    { id: 'analytics', label: 'التحليلات', icon: BarChart3 },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ];

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <Card className={`p-6 rounded-lg border-0 shadow-lg bg-gradient-to-br ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold text-white mt-2">{value}</p>
        </div>
        <Icon className="w-12 h-12 text-white/20" />
      </div>
    </Card>
  );

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-800 border-r border-gray-700 transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <div className={`flex items-center gap-3 ${!sidebarOpen && 'hidden'}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white">RO</span>
            </div>
            <span className="font-bold text-lg">Rose Online</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-gray-700 rounded-lg transition"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                    : 'text-gray-400 hover:bg-gray-700'
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{tab.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-lg transition"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>تسجيل الخروج</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-500" size={20} />
              <Input
                placeholder="ابحث هنا..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-700 rounded-lg transition relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-700">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center font-bold">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="text-sm">
                <p className="font-medium">{user?.name || 'مسؤول'}</p>
                <p className="text-gray-400 text-xs">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  icon={DollarSign}
                  label="إجمالي الإيرادات"
                  value="45,230 د.ا"
                  color="from-blue-600 to-blue-700"
                />
                <StatCard
                  icon={ShoppingCart}
                  label="الطلبات اليومية"
                  value="234"
                  color="from-green-600 to-green-700"
                />
                <StatCard
                  icon={Users}
                  label="العملاء النشطين"
                  value="1,234"
                  color="from-purple-600 to-purple-700"
                />
                <StatCard
                  icon={TrendingUp}
                  label="معدل النمو"
                  value="24.5%"
                  color="from-orange-600 to-orange-700"
                />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 p-6 bg-gray-800 border-gray-700">
                  <h3 className="text-lg font-bold mb-4">المبيعات والإيرادات</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                      <Legend />
                      <Line type="monotone" dataKey="sales" stroke="#f59e0b" strokeWidth={2} />
                      <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="p-6 bg-gray-800 border-gray-700">
                  <h3 className="text-lg font-bold mb-4">توزيع الفئات</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* Recent Orders */}
              <Card className="p-6 bg-gray-800 border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">الطلبات الأخيرة</h3>
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                    <Plus size={16} className="mr-2" />
                    طلب جديد
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-right py-3 px-4 text-gray-400">رقم الطلب</th>
                        <th className="text-right py-3 px-4 text-gray-400">العميل</th>
                        <th className="text-right py-3 px-4 text-gray-400">المبلغ</th>
                        <th className="text-right py-3 px-4 text-gray-400">الحالة</th>
                        <th className="text-right py-3 px-4 text-gray-400">التاريخ</th>
                        <th className="text-right py-3 px-4 text-gray-400">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition">
                          <td className="py-3 px-4">#{order.id}</td>
                          <td className="py-3 px-4">{order.customer}</td>
                          <td className="py-3 px-4 font-semibold text-green-400">{order.amount}</td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              order.status === 'مكتمل' ? 'bg-green-900/30 text-green-400' :
                              order.status === 'قيد المعالجة' ? 'bg-blue-900/30 text-blue-400' :
                              'bg-yellow-900/30 text-yellow-400'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-400">{order.date}</td>
                          <td className="py-3 px-4 flex gap-2">
                            <button className="p-1 hover:bg-gray-600 rounded transition">
                              <Eye size={16} />
                            </button>
                            <button className="p-1 hover:bg-gray-600 rounded transition">
                              <Edit2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">إدارة المستخدمين</h2>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                  <Plus size={16} className="mr-2" />
                  مستخدم جديد
                </Button>
              </div>

              <Card className="p-6 bg-gray-800 border-gray-700">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-right py-3 px-4 text-gray-400">الاسم</th>
                        <th className="text-right py-3 px-4 text-gray-400">البريد الإلكتروني</th>
                        <th className="text-right py-3 px-4 text-gray-400">الدور</th>
                        <th className="text-right py-3 px-4 text-gray-400">الحالة</th>
                        <th className="text-right py-3 px-4 text-gray-400">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition">
                          <td className="py-3 px-4 font-medium">{user.name}</td>
                          <td className="py-3 px-4 text-gray-400">{user.email}</td>
                          <td className="py-3 px-4">
                            <span className="px-3 py-1 rounded-full text-sm bg-amber-900/30 text-amber-400">
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              user.status === 'نشط' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 flex gap-2">
                            <button className="p-1 hover:bg-gray-600 rounded transition">
                              <Edit2 size={16} />
                            </button>
                            <button className="p-1 hover:bg-gray-600 rounded transition">
                              <Lock size={16} />
                            </button>
                            <button className="p-1 hover:bg-red-600 rounded transition">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">الإعدادات</h2>
              <Card className="p-6 bg-gray-800 border-gray-700">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Shield size={20} />
                      إعدادات الأمان
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded cursor-pointer transition">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span>المصادقة الثنائية</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded cursor-pointer transition">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span>تنبيهات تسجيل الدخول</span>
                      </label>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Zap size={20} />
                      الإشعارات
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded cursor-pointer transition">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span>إشعارات الطلبات الجديدة</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded cursor-pointer transition">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span>إشعارات الرسائل</span>
                      </label>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto mb-4 text-gray-500" />
              <p className="text-gray-400">انتقل إلى لوحة إدارة المنتجات للتحكم في المنتجات</p>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="text-center py-12">
              <ShoppingCart size={48} className="mx-auto mb-4 text-gray-500" />
              <p className="text-gray-400">سيتم إضافة إدارة الطلبات قريباً</p>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="text-center py-12">
              <BarChart3 size={48} className="mx-auto mb-4 text-gray-500" />
              <p className="text-gray-400">سيتم إضافة التحليلات المتقدمة قريباً</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
