import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { trpc } from '@/lib/trpc';
import { Spinner } from '@/components/ui/spinner';

export default function WarehouseCommissions() {
  return (
    <>
      <WarehouseCommissionsContent />
    </>
  );
}

function WarehouseCommissionsContent() {
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetch warehouse commissions
  const { data: commissions, isLoading } = trpc.commissions.warehouse.getAll.useQuery({
    warehouseId: selectedWarehouse && selectedWarehouse !== 'all' ? selectedWarehouse : undefined,
    status: statusFilter && statusFilter !== 'all' ? statusFilter : undefined,
  });

  // Fetch warehouse stats
  const { data: allStats } = trpc.commissions.warehouse.getAllStats.useQuery();

  // Filter and search
  const filteredCommissions = useMemo(() => {
    if (!commissions) return [];
    return commissions.filter((c: any) =>
      c.warehouseCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [commissions, searchTerm]);

  // Calculate totals
  const totals = useMemo(() => {
    return {
      totalCommission: filteredCommissions.reduce((sum: number, c: any) => sum + parseFloat(c.commissionAmount.toString()), 0),
      totalOrders: filteredCommissions.reduce((sum: number, c: any) => sum + (c.orderId ? 1 : 0), 0),
      pending: filteredCommissions.filter((c: any) => c.status === 'pending').length,
      approved: filteredCommissions.filter((c: any) => c.status === 'approved').length,
      paid: filteredCommissions.filter((c: any) => c.status === 'paid').length,
    };
  }, [filteredCommissions]);

  // Chart data
  const chartData = useMemo(() => {
    if (!allStats) return [];
    return allStats.map(stat => ({
      name: stat.warehouseCode,
      commission: parseFloat(stat.commissionAmount?.toString() || '0'),
      orders: 1,
    }));
  }, [allStats]);

  // Status distribution
  const statusData = useMemo(() => {
    return [
      { name: 'قيد الانتظار', value: totals.pending, color: '#f59e0b' },
      { name: 'موافق عليه', value: totals.approved, color: '#3b82f6' },
      { name: 'مدفوع', value: totals.paid, color: '#10b981' },
    ];
  }, [totals]);

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: any }> = {
      pending: { label: 'قيد الانتظار', variant: 'outline' },
      approved: { label: 'موافق عليه', variant: 'secondary' },
      paid: { label: 'مدفوع', variant: 'default' },
    };
    return statusConfig[status] || { label: status, variant: 'outline' };
  };

  return (
    <div className="space-y-8 p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 min-h-screen">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-rose-900">لوحة عمولات المستودعات</h1>
        <p className="text-rose-700">إدارة وحساب عمولات المستودعات بسهولة</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:p-2.5 md:p-3 lg:p-4">
        <Card className="border-rose-200 bg-white/80 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-rose-900">إجمالي العمولات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-600">{totals.totalCommission.toFixed(2)}</div>
            <p className="text-xs text-rose-600 mt-1">دينار أردني</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-white/80 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-900">عدد الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{totals.totalOrders}</div>
            <p className="text-xs text-blue-600 mt-1">طلب</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-white/80 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-amber-900">قيد الانتظار</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{totals.pending}</div>
            <p className="text-xs text-amber-600 mt-1">عمولة</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-white/80 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-900">مدفوع</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{totals.paid}</div>
            <p className="text-xs text-green-600 mt-1">عمولة</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6">
        {/* Bar Chart */}
        <Card className="border-rose-200 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle>العمولات حسب المستودع</CardTitle>
            <CardDescription>توزيع العمولات على المستودعات</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3e8e8" />
                <XAxis dataKey="name" stroke="#9f1239" />
                <YAxis stroke="#9f1239" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff7ed',
                    border: '2px solid #fb7185',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="commission" fill="#fb7185" name="العمولة (دينار)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="orders" fill="#fca5a5" name="عدد الطلبات" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="border-rose-200 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle>توزيع الحالات</CardTitle>
            <CardDescription>توزيع العمولات حسب الحالة</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-rose-200 bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle>الفلاتر</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:p-2.5 md:p-3 lg:p-4">
            <div>
              <label className="text-sm font-medium text-rose-900">البحث</label>
              <Input
                placeholder="ابحث عن رمز المستودع..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-2 border-rose-200 focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-rose-900">الحالة</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="mt-2 border-rose-200">
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="pending">قيد الانتظار</SelectItem>
                  <SelectItem value="approved">موافق عليه</SelectItem>
                  <SelectItem value="paid">مدفوع</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-rose-900">المستودع</label>
              <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                <SelectTrigger className="mt-2 border-rose-200">
                  <SelectValue placeholder="اختر المستودع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="WH001">مستودع عمّان</SelectItem>
                  <SelectItem value="WH002">مستودع إربد</SelectItem>
                  <SelectItem value="WH003">مستودع الزرقاء</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-rose-200 bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle>قائمة العمولات</CardTitle>
          <CardDescription>جميع عمولات المستودعات</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Spinner />
            </div>
          ) : filteredCommissions.length === 0 ? (
            <div className="text-center py-12 text-rose-600">
              <p>لا توجد عمولات</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-rose-200">
                    <th className="text-right py-3 px-4 font-semibold text-rose-900">رمز المستودع</th>
                    <th className="text-right py-3 px-4 font-semibold text-rose-900">إجمالي الطلب</th>
                    <th className="text-right py-3 px-4 font-semibold text-rose-900">نسبة العمولة</th>
                    <th className="text-right py-3 px-4 font-semibold text-rose-900">العمولة</th>
                    <th className="text-right py-3 px-4 font-semibold text-rose-900">الحالة</th>
                    <th className="text-right py-3 px-4 font-semibold text-rose-900">التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCommissions.map((commission: any) => (
                    <tr key={commission.id} className="border-b border-rose-100 hover:bg-rose-50 transition">
                      <td className="py-3 px-4 text-rose-900 font-medium">{commission.warehouseCode}</td>
                      <td className="py-3 px-4 text-rose-700">{parseFloat(commission.totalOrderAmount.toString()).toFixed(2)} د.ا</td>
                      <td className="py-3 px-4 text-rose-700">{parseFloat(commission.commissionRate.toString()).toFixed(2)}%</td>
                      <td className="py-3 px-4 text-rose-900 font-semibold">{parseFloat(commission.commissionAmount.toString()).toFixed(2)} د.ا</td>
                      <td className="py-3 px-4">
                        <Badge variant={getStatusBadge(commission.status).variant as any}>
                          {getStatusBadge(commission.status).label}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-rose-700">
                        {new Date(commission.createdAt).toLocaleDateString('ar-JO')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

}
