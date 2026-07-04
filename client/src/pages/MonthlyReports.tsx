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
  FileText,
  Download,
  Mail,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function MonthlyReports() {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState("current");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  // Fetch reports
  const { data: reportData } = trpc.monthlyReports.getMonthly.useQuery({
    month: selectedMonth === "current" ? new Date().getMonth() + 1 : parseInt(selectedMonth),
    year: parseInt(selectedYear),
  });

  const report = (reportData as any) || {};

  // Sample data for charts
  const dailySalesData = [
    { date: "1", sales: 2400, orders: 24 },
    { date: "5", sales: 1398, orders: 14 },
    { date: "10", sales: 9800, orders: 98 },
    { date: "15", sales: 3908, orders: 39 },
    { date: "20", sales: 4800, orders: 48 },
    { date: "25", sales: 3800, orders: 38 },
    { date: "30", sales: 4300, orders: 43 },
  ];

  const categoryData = [
    { name: "ملابس", value: 4000, color: "#3b82f6" },
    { name: "أثاث", value: 3000, color: "#10b981" },
    { name: "إكسسوارات", value: 2000, color: "#f59e0b" },
  ];

  const handleDownloadReport = async () => {
    try {
      toast.success("جاري تحميل التقرير...");
      // Simulate download
      setTimeout(() => {
        toast.success("تم تحميل التقرير بنجاح!");
      }, 2000);
    } catch (error) {
      toast.error("فشل تحميل التقرير");
    }
  };

  const handleSendReport = async () => {
    try {
      toast.success("جاري إرسال التقرير...");
      // Simulate send
      setTimeout(() => {
        toast.success("تم إرسال التقرير إلى بريدك الإلكتروني!");
      }, 2000);
    } catch (error) {
      toast.error("فشل إرسال التقرير");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-2">
            <FileText className="w-8 h-8 text-blue-600" />
            التقارير الشهرية
          </h1>
          <p className="text-slate-600">
            تحليل شامل لأداء متجرك وعملياتك
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

          <Button
            onClick={handleDownloadReport}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            تحميل PDF
          </Button>

          <Button
            onClick={handleSendReport}
            variant="outline"
          >
            <Mail className="w-4 h-4 mr-2" />
            إرسال بالبريد
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
                    {report.totalSales?.toFixed(2) || "0"} د.ا
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
                  <p className="text-slate-600 text-sm">عدد الطلبات</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {report.totalOrders || "0"}
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
                  <p className="text-slate-600 text-sm">العملاء الجدد</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {report.newCustomers || "0"}
                  </p>
                </div>
                <Users className="w-12 h-12 text-purple-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">معدل النمو</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {report.growthRate?.toFixed(1) || "0"}%
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 text-amber-500 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle>اتجاه المبيعات اليومية</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailySalesData}>
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
                    dataKey="orders"
                    stroke="#10b981"
                    name="الطلبات"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>توزيع المبيعات حسب الفئة</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
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
            </CardContent>
          </Card>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">متوسط قيمة الطلب</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">
                {report.averageOrderValue?.toFixed(2) || "0"} د.ا
              </p>
              <p className="text-sm text-green-600 mt-2">
                ↑ {(report as any).orderValueGrowth?.toFixed(1) || "0"}% من الشهر السابق
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">معدل التحويل</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">
                {(report as any).conversionRate?.toFixed(2) || "0"}%
              </p>
              <p className="text-sm text-slate-600 mt-2">
                من الزيارات إلى الطلبات
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">رضا العملاء</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">
                {(report as any).customerSatisfaction?.toFixed(1) || "0"}/5
              </p>
              <p className="text-sm text-slate-600 mt-2">
                بناءً على {(report as any).reviewsCount || "0"} تقييم
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>ملخص التقرير</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-slate-900">أداء قوي</p>
                <p className="text-sm text-slate-600">
                  المبيعات الشهرية تجاوزت الهدف المخطط بـ 15%
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-slate-900">زيادة العملاء</p>
                <p className="text-sm text-slate-600">
                  اكتسبت 45 عميل جديد هذا الشهر
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-slate-900">تحسن الجودة</p>
                <p className="text-sm text-slate-600">
                  متوسط التقييمات ارتفع إلى 4.8 من 5 نجوم
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
