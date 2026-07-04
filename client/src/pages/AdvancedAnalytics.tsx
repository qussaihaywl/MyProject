'use client';

import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { TrendingUp, Download, Filter, Calendar } from 'lucide-react';

const AdvancedAnalytics = () => {
  const [dateRange, setDateRange] = useState('month');

  // Sales data
  const salesData = [
    { month: 'يناير', sales: 4000, revenue: 2400, customers: 240 },
    { month: 'فبراير', sales: 3000, revenue: 1398, customers: 221 },
    { month: 'مارس', sales: 2000, revenue: 9800, customers: 229 },
    { month: 'أبريل', sales: 2780, revenue: 3908, customers: 200 },
    { month: 'مايو', sales: 1890, revenue: 4800, customers: 221 },
    { month: 'يونيو', sales: 2390, revenue: 3800, customers: 250 },
  ];

  // Product category distribution
  const categoryData = [
    { name: 'ملابس', value: 45, color: '#D18E51' },
    { name: 'أثاث', value: 30, color: '#B2291E' },
    { name: 'إكسسوارات', value: 25, color: '#8B5CF6' },
  ];

  // Daily traffic
  const trafficData = [
    { day: 'السبت', visits: 400, bounce: 24 },
    { day: 'الأحد', visits: 300, bounce: 13 },
    { day: 'الاثنين', visits: 200, bounce: 9 },
    { day: 'الثلاثاء', visits: 278, bounce: 39 },
    { day: 'الأربعاء', visits: 189, bounce: 12 },
    { day: 'الخميس', visits: 239, bounce: 22 },
    { day: 'الجمعة', visits: 349, bounce: 43 },
  ];

  // Customer segments
  const segmentData = [
    { segment: 'عملاء جدد', count: 1200, growth: 12 },
    { segment: 'عملاء منتظمين', count: 3400, growth: 8 },
    { segment: 'عملاء VIP', count: 800, growth: 25 },
    { segment: 'عملاء غير نشطين', count: 600, growth: -15 },
  ];

  const stats = [
    { label: 'إجمالي المبيعات', value: '45,230 د.ا', change: '+12.5%', icon: '📈' },
    { label: 'عدد الطلبات', value: '1,234', change: '+8.2%', icon: '📦' },
    { label: 'معدل التحويل', value: '3.24%', change: '+2.1%', icon: '🎯' },
    { label: 'متوسط قيمة الطلب', value: '36.7 د.ا', change: '+5.3%', icon: '💰' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-amber-900" size={32} />
              <h1 className="text-4xl font-bold text-amber-900">التحليلات المتقدمة</h1>
            </div>
            <div className="flex gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border-2 border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="week">هذا الأسبوع</option>
                <option value="month">هذا الشهر</option>
                <option value="quarter">هذا الربع</option>
                <option value="year">هذه السنة</option>
              </select>
              <button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
                <Download size={18} /> تصدير
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-lg border-2 border-amber-200 p-6 hover:shadow-xl transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-amber-900 mt-2">{stat.value}</p>
                    <p className="text-green-600 text-sm mt-2">{stat.change}</p>
                  </div>
                  <span className="text-3xl">{stat.icon}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Trend */}
          <div className="bg-white rounded-lg shadow-lg border-2 border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-4">اتجاه المبيعات</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D18E51" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#D18E51" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="sales" stroke="#D18E51" fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue vs Customers */}
          <div className="bg-white rounded-lg shadow-lg border-2 border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-4">الإيرادات مقابل العملاء</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#B2291E" radius={[8, 8, 0, 0]} />
                <Bar dataKey="customers" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-lg shadow-lg border-2 border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-4">توزيع الفئات</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Traffic Analysis */}
          <div className="bg-white rounded-lg shadow-lg border-2 border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-4">تحليل حركة المرور</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="visits" stroke="#D18E51" strokeWidth={2} />
                <Line type="monotone" dataKey="bounce" stroke="#EF4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Segments */}
        <div className="bg-white rounded-lg shadow-lg border-2 border-amber-200 p-6">
          <h2 className="text-xl font-bold text-amber-900 mb-4">تقسيم العملاء</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {segmentData.map((segment, idx) => (
              <div key={idx} className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border-2 border-amber-200">
                <h3 className="font-bold text-amber-900 mb-2">{segment.segment}</h3>
                <p className="text-2xl font-bold text-amber-900">{segment.count.toLocaleString()}</p>
                <p className={`text-sm mt-2 ${segment.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {segment.growth >= 0 ? '+' : ''}{segment.growth}% من الشهر الماضي
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
