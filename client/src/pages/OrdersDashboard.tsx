import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { toast } from 'sonner';
import { Search, Download, Eye, Trash2, CheckCircle, Clock, Truck } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'قيد الانتظار',
  processing: 'قيد المعالجة',
  shipped: 'تم الشحن',
  delivered: 'تم التسليم',
  cancelled: 'ملغى',
};

export default function OrdersDashboard() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);

  const { data: orders, isLoading } = trpc.advancedOrders.list.useQuery();
  const updateOrderMutation = trpc.advancedOrders.update.useMutation();
  const deleteOrderMutation = trpc.advancedOrders.delete.useMutation();

  useEffect(() => {
    if (!orders) return;

    let filtered = orders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderNumber.includes(searchTerm) ||
        order.customerName.includes(searchTerm) ||
        order.customerPhone.includes(searchTerm)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Only show orders for non-admin users
    if (user?.role !== 'admin') {
      filtered = filtered.filter(order => order.customerId === user?.id);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, user]);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await updateOrderMutation.mutateAsync({
        id: orderId,
        status: newStatus as any,
      });
      toast.success('تم تحديث حالة الطلب');
    } catch (error: any) {
      toast.error(error.message || 'فشل تحديث الطلب');
    }
  };

  const handleDelete = async (orderId: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;

    try {
      await deleteOrderMutation.mutateAsync({ id: orderId });
      toast.success('تم حذف الطلب');
    } catch (error: any) {
      toast.error(error.message || 'فشل حذف الطلب');
    }
  };

  const handleExportCSV = () => {
    const headers = ['رقم الطلب', 'اسم العميل', 'الهاتف', 'المنتج', 'السعر', 'الحالة', 'التاريخ'];
    const rows = filteredOrders.map(order => [
      order.orderNumber,
      order.customerName,
      order.customerPhone,
      order.productName,
      order.totalAmount,
      STATUS_LABELS[order.status],
      new Date(order.createdAt).toLocaleDateString('ar-JO'),
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `orders-${Date.now()}.csv`;
    link.click();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-rose-700">يجب تسجيل الدخول لعرض الطلبات</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-rose-900 mb-2">📦 لوحة تحكم الطلبات</h1>
          <p className="text-rose-700">إدارة وتتبع جميع الطلبات الخاصة</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-white border-2 border-rose-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-rose-600">{filteredOrders.length}</div>
              <div className="text-sm text-rose-700">إجمالي الطلبات</div>
            </div>
          </Card>
          <Card className="p-4 bg-white border-2 border-yellow-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {filteredOrders.filter(o => o.status === 'pending').length}
              </div>
              <div className="text-sm text-yellow-700">قيد الانتظار</div>
            </div>
          </Card>
          <Card className="p-4 bg-white border-2 border-blue-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {filteredOrders.filter(o => o.status === 'processing').length}
              </div>
              <div className="text-sm text-blue-700">قيد المعالجة</div>
            </div>
          </Card>
          <Card className="p-4 bg-white border-2 border-green-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {filteredOrders.filter(o => o.status === 'delivered').length}
              </div>
              <div className="text-sm text-green-700">تم التسليم</div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8 border-2 border-rose-200 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-rose-500" />
              <Input
                placeholder="ابحث برقم الطلب أو اسم العميل..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-2 border-rose-200 focus:border-rose-500"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-2 border-rose-200 focus:border-rose-500">
                <SelectValue placeholder="تصفية حسب الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="pending">قيد الانتظار</SelectItem>
                <SelectItem value="processing">قيد المعالجة</SelectItem>
                <SelectItem value="shipped">تم الشحن</SelectItem>
                <SelectItem value="delivered">تم التسليم</SelectItem>
                <SelectItem value="cancelled">ملغى</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleExportCSV}
              className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              تحميل CSV
            </Button>
          </div>
        </Card>

        {/* Orders Table */}
        {isLoading ? (
          <Card className="p-8 text-center">
            <p className="text-rose-700">جاري تحميل الطلبات...</p>
          </Card>
        ) : filteredOrders.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-rose-700">لا توجد طلبات</p>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-rose-500 to-pink-500 text-white">
                  <th className="px-4 py-3 text-right">رقم الطلب</th>
                  <th className="px-4 py-3 text-right">العميل</th>
                  <th className="px-4 py-3 text-right">المنتج</th>
                  <th className="px-4 py-3 text-right">السعر</th>
                  <th className="px-4 py-3 text-right">الحالة</th>
                  <th className="px-4 py-3 text-right">التاريخ</th>
                  <th className="px-4 py-3 text-right">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-rose-200 hover:bg-rose-50">
                    <td className="px-4 py-3 font-bold text-rose-700">{order.orderNumber}</td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-semibold text-rose-900">{order.customerName}</div>
                        <div className="text-sm text-rose-600">{order.customerPhone}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-rose-900">{order.productName}</td>
                    <td className="px-4 py-3 font-bold text-rose-700">{order.totalAmount} د.ا</td>
                    <td className="px-4 py-3">
                      {user?.role === 'admin' ? (
                        <Select value={order.status} onValueChange={(value) => handleStatusChange(order.id, value)}>
                          <SelectTrigger className="w-32 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">قيد الانتظار</SelectItem>
                            <SelectItem value="processing">قيد المعالجة</SelectItem>
                            <SelectItem value="shipped">تم الشحن</SelectItem>
                            <SelectItem value="delivered">تم التسليم</SelectItem>
                            <SelectItem value="cancelled">ملغى</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge className={STATUS_COLORS[order.status]}>
                          {STATUS_LABELS[order.status]}
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-rose-600">
                      {new Date(order.createdAt).toLocaleDateString('ar-JO')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {user?.role === 'admin' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(order.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
