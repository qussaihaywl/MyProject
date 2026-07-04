import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Users,
  ShoppingCart,
  DollarSign,
  Activity,
} from "lucide-react";

interface AnalyticsData {
  date: string;
  sales: number;
  orders: number;
  users: number;
  revenue: number;
}

interface CategorySales {
  name: string;
  value: number;
  percentage: number;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  userGrowth: number;
}

interface OrderStats {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
}

const COLORS = [
  "#8b5cf6",
  "#B2291E",
  "#D18E51",
  "#10b981",
  "#3b82f6",
  "#ef4444",
];

export default function Analytics() {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [categoryData, setCategoryData] = useState<CategorySales[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    newUsers: 0,
    userGrowth: 0,
  });
  const [orderStats, setOrderStats] = useState<OrderStats>({
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    cancelledOrders: 0,
  });

  // Fetch analytics data
  const { data: orders } = trpc.orders.getAll.useQuery();
  const { data: products } = trpc.products.list.useQuery({
    limit: 1000,
    offset: 0,
  });
  const { data: users } = trpc.users.getAllUsers.useQuery({ limit: 100, offset: 0 });

  useEffect(() => {
    if (!user || user.role !== "admin") return;

    // Generate mock analytics data for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toLocaleDateString("ar-JO", {
          month: "short",
          day: "numeric",
        }),
        sales: Math.floor(Math.random() * 50) + 20,
        orders: Math.floor(Math.random() * 30) + 10,
        users: Math.floor(Math.random() * 100) + 50,
        revenue: Math.floor(Math.random() * 5000) + 2000,
      };
    });
    setAnalyticsData(last7Days);

    // Category sales data
    const categories = [
      { name: "ملابس", value: 35, percentage: 35 },
      { name: "أثاث", value: 30, percentage: 30 },
      { name: "إكسسوارات", value: 25, percentage: 25 },
      { name: "أخرى", value: 10, percentage: 10 },
    ];
    setCategoryData(categories);

    // User statistics
    if (users && users.users) {
      const activeUsers = users.users.filter((u: any) => u.status === "active").length;
      const newUsers = users.users.filter((u: any) => {
        const createdAt = new Date(u.createdAt);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return createdAt > sevenDaysAgo;
      }).length;

      setUserStats({
        totalUsers: users.users.length,
        activeUsers,
        newUsers,
        userGrowth: ((newUsers / users.users.length) * 100) || 0,
      });
    }

    // Order statistics
    if (orders) {
      const completed = orders.filter(
        (o: any) => o.status === "delivered"
      ).length;
      const pending = orders.filter(
        (o: any) => o.status === "pending" || o.status === "processing"
      ).length;
      const cancelled = orders.filter((o: any) => o.status === "cancelled")
        .length;

      setOrderStats({
        totalOrders: orders.length,
        completedOrders: completed,
        pendingOrders: pending,
        cancelledOrders: cancelled,
      });
    }
  }, [user, orders, users]);

  if (!user || user.role !== "admin") {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg text-muted-foreground">
            ليس لديك صلاحية للوصول إلى هذه الصفحة
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-rose-950/20 to-slate-950">
      
      <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">التحليلات</h1>
          <p className="text-muted-foreground mt-2">
            عرض شامل لإحصائيات المتجر والمبيعات
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المبيعات</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()} د.ا
              </div>
              <p className="text-xs text-muted-foreground">
                +{Math.floor(Math.random() * 20) + 5}% من الشهر الماضي
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orderStats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                {orderStats.completedOrders} مكتملة
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {userStats.newUsers} مستخدم جديد
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">النشاط</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                مستخدمين نشطين الآن
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="sales" className="space-y-4">
          <TabsList>
            <TabsTrigger value="sales">المبيعات</TabsTrigger>
            <TabsTrigger value="orders">الطلبات</TabsTrigger>
            <TabsTrigger value="categories">الفئات</TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>المبيعات اليومية</CardTitle>
                <CardDescription>
                  إجمالي المبيعات لآخر 7 أيام
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8b5cf6"
                      name="الإيرادات (د.ا)"
                    />
                    <Line
                      type="monotone"
                      dataKey="orders"
                      stroke="#B2291E"
                      name="الطلبات"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>حالات الطلبات</CardTitle>
                <CardDescription>توزيع حالات الطلبات</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      {
                        name: "مكتملة",
                        value: orderStats.completedOrders,
                      },
                      {
                        name: "قيد الانتظار",
                        value: orderStats.pendingOrders,
                      },
                      {
                        name: "ملغاة",
                        value: orderStats.cancelledOrders,
                      },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>المبيعات حسب الفئة</CardTitle>
                <CardDescription>توزيع المبيعات بين الفئات</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) =>
                        `${name} ${percentage}%`
                      }
                      outerRadius={80}
                      fill="#8b5cf6"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Detailed Stats */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>إحصائيات المستخدمين</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">إجمالي المستخدمين</span>
                <span className="font-semibold">{userStats.totalUsers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">المستخدمين النشطين</span>
                <span className="font-semibold">{userStats.activeUsers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">المستخدمين الجدد</span>
                <span className="font-semibold">{userStats.newUsers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">معدل النمو</span>
                <span className="font-semibold">
                  {userStats.userGrowth.toFixed(1)}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>إحصائيات الطلبات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">إجمالي الطلبات</span>
                <span className="font-semibold">{orderStats.totalOrders}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">الطلبات المكتملة</span>
                <span className="font-semibold">{orderStats.completedOrders}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">الطلبات المعلقة</span>
                <span className="font-semibold">{orderStats.pendingOrders}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">الطلبات الملغاة</span>
                <span className="font-semibold">{orderStats.cancelledOrders}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
    </div>
  );
}
