import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Users,
  Award,
  Calendar,
  Download,
  Eye,
} from "lucide-react";

export default function DelegateStatsDashboard() {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState("current");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  // Fetch delegate commissions
  const { data: commissionsData } = trpc.commissions.delegate.getDelegateCommissions.useQuery({
    delegateId: user?.id || 0,
    month: selectedMonth === "current" ? new Date().getMonth() + 1 : parseInt(selectedMonth),
    year: parseInt(selectedYear),
  });

  // Fetch delegate orders
  const { data: ordersData } = trpc.orders.getByDelegate.useQuery({
    delegateId: user?.id || 0,
  });

  const commissions = commissionsData || [];
  const orders = ordersData || [];

  // Calculate statistics
  const totalSales = orders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);
  const totalCommission = commissions.reduce((sum: number, c: any) => sum + (c.commissionAmount || 0), 0);
  const paidCommission = commissions
    .filter((c: any) => c.status === "paid")
    .reduce((sum: number, c: any) => sum + (c.commissionAmount || 0), 0);
  const pendingCommission = totalCommission - paidCommission;

  // Sales trend data
  const salesTrendData = [
    { date: "1-5", sales: 2400, commission: 240 },
    { date: "6-10", sales: 1398, commission: 140 },
    { date: "11-15", sales: 9800, commission: 980 },
    { date: "16-20", sales: 3908, commission: 391 },
    { date: "21-25", sales: 4800, commission: 480 },
    { date: "26-30", sales: 3800, commission: 380 },
  ];

  // Commission status data
  const commissionStatusData = [
    { name: "مدفوع", value: paidCommission, color: "#10b981" },
    { name: "قيد الانتظار", value: pendingCommission, color: "#f59e0b" },
  ];

  // Top products
  const topProducts = orders
    .flatMap((o: any) => o.items || [])
    .reduce((acc: any, item: any) => {
      const existing = acc.find((p: any) => p.productId === item.productId);
      if (existing) {
        existing.quantity += item.quantity;
        existing.revenue += item.price * item.quantity;
      } else {
        acc.push({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          revenue: item.price * item.quantity,
        });
      }
      return acc;
    }, [])
    .sort((a: any, b: any) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            📊 لوحة إحصائيات المندوب
          </h1>
          <p className="text-slate-600">
            تابع مبيعاتك والعمولات والأداء
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">الشهر الحالي</SelectItem>
              <SelectItem value="1">يناير</SelectItem>
              <SelectItem value="2">فبراير</SelectItem>
              <SelectItem value="3">مارس</SelectItem>
              <SelectItem value="4">أبريل</SelectItem>
              <SelectItem value="5">مايو</SelectItem>
              <SelectItem value="6">يونيو</SelectItem>
              <SelectItem value="7">يوليو</SelectItem>
              <SelectItem value="8">أغسطس</SelectItem>
              <SelectItem value="9">سبتمبر</SelectItem>
              <SelectItem value="10">أكتوبر</SelectItem>
              <SelectItem value="11">نوفمبر</SelectItem>
              <SelectItem value="12">ديسمبر</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2026">2026</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
            </SelectContent>
          </Select>

          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            تحميل التقرير
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">إجمالي المبيعات</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {totalSales.toFixed(2)} د.ا
                  </p>
                </div>
                <ShoppingBag className="w-12 h-12 text-blue-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">إجمالي العمولات</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {totalCommission.toFixed(2)} د.ا
                  </p>
                </div>
                <DollarSign className="w-12 h-12 text-green-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">العمولات المدفوعة</p>
                  <p className="text-3xl font-bold text-green-600">
                    {paidCommission.toFixed(2)} د.ا
                  </p>
                </div>
                <Award className="w-12 h-12 text-green-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">قيد الانتظار</p>
                  <p className="text-3xl font-bold text-amber-600">
                    {pendingCommission.toFixed(2)} د.ا
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 text-amber-500 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Sales Trend */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>اتجاه المبيعات والعمولات</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#3b82f6"
                    name="المبيعات"
                  />
                  <Line
                    type="monotone"
                    dataKey="commission"
                    stroke="#10b981"
                    name="العمولات"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Commission Status */}
          <Card>
            <CardHeader>
              <CardTitle>حالة العمولات</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={commissionStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value.toFixed(0)}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {commissionStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>أفضل المنتجات مبيعاً</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product: any, index: number) => (
                <div
                  key={product.productId}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="text-lg">
                      #{index + 1}
                    </Badge>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {product.productName}
                      </p>
                      <p className="text-sm text-slate-600">
                        {product.quantity} وحدة
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">
                      {product.revenue.toFixed(2)} د.ا
                    </p>
                    <p className="text-sm text-slate-600">
                      {((product.revenue / totalSales) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Commissions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>آخر العمولات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {commissions.slice(0, 5).map((commission: any) => (
                <div
                  key={commission.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      طلب #{commission.orderId}
                    </p>
                    <p className="text-sm text-slate-600">
                      {new Date(commission.createdAt).toLocaleDateString("ar-JO")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">
                      {commission.commissionAmount?.toFixed(2)} د.ا
                    </p>
                    <Badge
                      variant={
                        commission.status === "paid" ? "default" : "secondary"
                      }
                    >
                      {commission.status === "paid" ? "مدفوع" : "قيد الانتظار"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
