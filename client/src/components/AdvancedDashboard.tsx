import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Package, ShoppingCart, Users, Settings, TrendingUp, Bell, Search, Menu, X, LogOut, Home, LayoutDashboard, FileText, BarChart3, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { trpc } from '../lib/trpc';
import { useAuth } from '../_core/hooks/useAuth';

interface DashboardTab {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

export const AdvancedDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const { data: products } = trpc.products.getAll.useQuery();

  // Mock data for charts
  const salesData = [
    { month: 'يناير', sales: 4000, revenue: 2400 },
    { month: 'فبراير', sales: 3000, revenue: 1398 },
    { month: 'مارس', sales: 2000, revenue: 9800 },
    { month: 'أبريل', sales: 2780, revenue: 3908 },
    { month: 'مايو', sales: 1890, revenue: 4800 },
    { month: 'يونيو', sales: 2390, revenue: 3800 },
  ];

  const categoryData = [
    { name: 'ملابس', value: 35 },
    { name: 'أثاث', value: 25 },
    { name: 'إكسسوارات', value: 20 },
    { name: 'أخرى', value: 20 },
  ];

  const COLORS = ['#f59e0b', '#d97706', '#b45309', '#92400e'];

  const tabs: DashboardTab[] = [
    {
      id: 'overview',
      label: 'نظرة عامة',
      icon: <Home className="w-5 h-5" />,
      component: <OverviewTab />,
    },
    {
      id: 'products',
      label: 'إدارة المنتجات',
      icon: <Package className="w-5 h-5" />,
      component: <ProductsTab />,
    },
    {
      id: 'orders',
      label: 'الطلبات',
      icon: <ShoppingCart className="w-5 h-5" />,
      component: <OrdersTab />,
    },
    {
      id: 'users',
      label: 'المستخدمون',
      icon: <Users className="w-5 h-5" />,
      component: <UsersTab />,
    },
    {
      id: 'analytics',
      label: 'التحليلات',
      icon: <BarChart3 className="w-5 h-5" />,
      component: <AnalyticsTab salesData={salesData} categoryData={categoryData} />,
    },
    {
      id: 'reports',
      label: 'التقارير',
      icon: <FileText className="w-5 h-5" />,
      component: <ReportsTab />,
    },
    {
      id: 'settings',
      label: 'الإعدادات',
      icon: <Settings className="w-5 h-5" />,
      component: <SettingsTab />,
    },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-amber-900 to-orange-900 text-white transition-all duration-300 shadow-2xl border-l border-amber-700`}
      >
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-2xl font-bold text-amber-300">Rose Admin</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-amber-800 rounded-lg transition"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="mt-8 space-y-2 px-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-gray-900 shadow-lg'
                  : 'text-amber-100 hover:bg-amber-800/50'
              }`}
            >
              {tab.icon}
              {sidebarOpen && <span className="text-sm font-medium">{tab.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <Search className="w-5 h-5 text-amber-100" />
            <Input
              placeholder="ابحث..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/20 rounded-lg transition">
              <Bell className="w-5 h-5" />
            </button>
            <div className="text-right">
              <p className="font-semibold">{user?.name || 'مسؤول'}</p>
              <p className="text-xs text-amber-100">مسؤول النظام</p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            {tabs.find((tab) => tab.id === activeTab)?.component}
          </div>
        </div>
      </div>
    </div>
  );
};

// Tab Components
const OverviewTab: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-white mb-6">نظرة عامة على النظام</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard icon={<Package className="w-8 h-8" />} label="المنتجات" value="245" color="amber" />
      <StatCard icon={<ShoppingCart className="w-8 h-8" />} label="الطلبات" value="1,234" color="orange" />
      <StatCard icon={<Users className="w-8 h-8" />} label="المستخدمون" value="567" color="yellow" />
      <StatCard icon={<TrendingUp className="w-8 h-8" />} label="الإيرادات" value="125,450 د.ا" color="red" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      <Card className="bg-gray-800 border-gray-700 p-6">
        <h3 className="text-xl font-bold text-white mb-4">المبيعات الشهرية</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={[
            { month: 'يناير', sales: 4000 },
            { month: 'فبراير', sales: 3000 },
            { month: 'مارس', sales: 2000 },
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
            <Line type="monotone" dataKey="sales" stroke="#f59e0b" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="bg-gray-800 border-gray-700 p-6">
        <h3 className="text-xl font-bold text-white mb-4">توزيع الفئات</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={[
              { name: 'ملابس', value: 35 },
              { name: 'أثاث', value: 25 },
            ]} cx="50%" cy="50%" labelLine={false} label={{ fill: '#fff' }} outerRadius={80} fill="#8884d8" dataKey="value">
              <Cell fill="#f59e0b" />
              <Cell fill="#d97706" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  </div>
);

const ProductsTab: React.FC = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-3xl font-bold text-white">إدارة المنتجات</h2>
      <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
        + إضافة منتج
      </Button>
    </div>
    
    <Card className="bg-gray-800 border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-amber-900 to-orange-900">
            <tr>
              <th className="px-6 py-4 text-right text-amber-200">اسم المنتج</th>
              <th className="px-6 py-4 text-right text-amber-200">السعر</th>
              <th className="px-6 py-4 text-right text-amber-200">المخزون</th>
              <th className="px-6 py-4 text-right text-amber-200">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="hover:bg-gray-700/50 transition">
                <td className="px-6 py-4 text-white">منتج {i}</td>
                <td className="px-6 py-4 text-amber-300">250 د.ا</td>
                <td className="px-6 py-4 text-white">45</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">تعديل</Button>
                    <Button size="sm" variant="outline" className="text-red-400">حذف</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);

const OrdersTab: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-white">الطلبات</h2>
    <Card className="bg-gray-800 border-gray-700 p-6">
      <p className="text-gray-300">لا توجد طلبات حالياً</p>
    </Card>
  </div>
);

const UsersTab: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-white">المستخدمون</h2>
    <Card className="bg-gray-800 border-gray-700 p-6">
      <p className="text-gray-300">إدارة المستخدمين والأدوار</p>
    </Card>
  </div>
);

const AnalyticsTab: React.FC<{ salesData: any; categoryData: any }> = ({ salesData, categoryData }) => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-white">التحليلات</h2>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-gray-800 border-gray-700 p-6">
        <h3 className="text-xl font-bold text-white mb-4">المبيعات والإيرادات</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
            <Legend />
            <Bar dataKey="sales" fill="#f59e0b" />
            <Bar dataKey="revenue" fill="#d97706" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="bg-gray-800 border-gray-700 p-6">
        <h3 className="text-xl font-bold text-white mb-4">توزيع الفئات</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={categoryData} cx="50%" cy="50%" labelLine={false} label={{ fill: '#fff' }} outerRadius={80} fill="#8884d8" dataKey="value">
              {categoryData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={['#f59e0b', '#d97706', '#b45309', '#92400e'][index % 4]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  </div>
);

const ReportsTab: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-white">التقارير</h2>
    <Card className="bg-gray-800 border-gray-700 p-6">
      <p className="text-gray-300">تقارير مفصلة عن الأداء والمبيعات</p>
    </Card>
  </div>
);

const SettingsTab: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-white">الإعدادات</h2>
    <Card className="bg-gray-800 border-gray-700 p-6">
      <p className="text-gray-300">إعدادات النظام والحساب</p>
    </Card>
  </div>
);

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; color: string }> = ({ icon, label, value, color }) => {
  const colorClasses: Record<string, string> = {
    amber: 'from-amber-900 to-amber-800 border-amber-700 bg-amber-700/50 text-amber-300',
    orange: 'from-orange-900 to-orange-800 border-orange-700 bg-orange-700/50 text-orange-300',
    yellow: 'from-yellow-900 to-yellow-800 border-yellow-700 bg-yellow-700/50 text-yellow-300',
    red: 'from-red-900 to-red-800 border-red-700 bg-red-700/50 text-red-300',
  };
  
  return (
    <Card className={`bg-gradient-to-br ${colorClasses[color] || colorClasses.amber} p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-300 text-sm">{label}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
        </div>
        <div className={`p-4 rounded-lg ${colorClasses[color]?.split(' ').slice(2).join(' ') || ''}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};
