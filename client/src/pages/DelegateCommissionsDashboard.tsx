import { useState, useMemo } from "react";
import { downloadCSV } from "@/lib/export-utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Download, TrendingUp, Users, DollarSign, Package, AlertCircle, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface DelegateCommission {
  id: number;
  delegateName: string;
  orderId?: number;
  commissionType: "percentage" | "fixed";
  commissionRate: string;
  totalOrderAmount: string;
  commissionAmount: string;
  status: "pending" | "approved" | "paid";
  notes?: string;
  createdAt: Date;
}

const COLORS = ["#f43f5e", "#ec4899", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6"];

export default function DelegateCommissionsDashboard() {
  const commissionsQuery = trpc.commissions.delegate.getAll.useQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "delegate">("date");

  const commissions = commissionsQuery.data || [];

  const filteredAndSortedCommissions = useMemo(() => {
    let filtered = commissions.filter((c: DelegateCommission) => {
      const matchesSearch = c.delegateName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "all" || c.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a: DelegateCommission, b: DelegateCommission) => {
      if (sortBy === "date") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === "amount") {
        return parseFloat(b.commissionAmount) - parseFloat(a.commissionAmount);
      } else if (sortBy === "delegate") {
        return a.delegateName.localeCompare(b.delegateName);
      }
      return 0;
    });

    return filtered;
  }, [commissions, searchTerm, filterStatus, sortBy]);

  // Group by delegate
  const delegateStats = useMemo(() => {
    const grouped: Record<string, any> = {};
    (commissions as DelegateCommission[]).forEach((c: DelegateCommission) => {
      if (!grouped[c.delegateName]) {
        grouped[c.delegateName] = {
          name: c.delegateName,
          totalCommission: 0,
          totalOrders: 0,
          pending: 0,
          approved: 0,
          paid: 0,
          orders: []
        };
      }
      grouped[c.delegateName].totalCommission += parseFloat(c.commissionAmount);
      grouped[c.delegateName].totalOrders += 1;
      grouped[c.delegateName][c.status] += 1;
      if (c.orderId) {
        grouped[c.delegateName].orders.push(c.orderId);
      }
    });
    return Object.values(grouped);
  }, [commissions]);

  const stats = useMemo(() => {
    const total = commissions.length;
    const pending = commissions.filter((c: DelegateCommission) => c.status === "pending").length;
    const approved = commissions.filter((c: DelegateCommission) => c.status === "approved").length;
    const paid = commissions.filter((c: DelegateCommission) => c.status === "paid").length;
    const totalAmount = commissions.reduce((sum: number, c: DelegateCommission) => sum + parseFloat(c.commissionAmount), 0);
    const totalDelegates = new Set(commissions.map((c: DelegateCommission) => c.delegateName)).size;

    return { total, pending, approved, paid, totalAmount, totalDelegates };
  }, [commissions]);

  const handleExport = () => {
    const headers = ["اسم المندوب", "نوع العمولة", "نسبة العمولة", "المبلغ الإجمالي", "مبلغ العمولة", "الحالة", "التاريخ"];
    const rows = filteredAndSortedCommissions.map((c: DelegateCommission) => [
      c.delegateName,
      c.commissionType === "percentage" ? "نسبة مئوية" : "مبلغ ثابت",
      c.commissionRate,
      c.totalOrderAmount,
      c.commissionAmount,
      c.status,
      new Date(c.createdAt).toLocaleDateString("ar-JO")
    ]);

    downloadCSV(headers, rows, `delegate-commissions-${new Date().toISOString().split('T')[0]}.csv`);
    toast.success("تم تحميل التقرير!");
  };

  if (commissionsQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 sm:h-10 md:h-12 w-8 sm:w-10 md:w-12 border-b-2 border-rose-600"></div>
          <p className="mt-4 text-rose-900 font-semibold">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600 mb-2">
            👥 عمولات المندوبين
          </h1>
          <p className="text-gray-600">إدارة وتتبع عمولات وطلبات المندوبين</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-2 sm:p-2.5 md:p-3 lg:p-4 mb-8">
          <Card className="p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-semibold">إجمالي العمولات</p>
                <p className="text-sm sm:text-base md:text-lg sm:text-base sm:text-sm sm:text-base md:text-lg md:text-xl md:text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <BarChart3 className="w-10 h-10 text-blue-400 opacity-50" />
            </div>
          </Card>

          <Card className="p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-semibold">عدد المندوبين</p>
                <p className="text-sm sm:text-base md:text-lg sm:text-base sm:text-sm sm:text-base md:text-lg md:text-xl md:text-2xl font-bold text-purple-900">{stats.totalDelegates}</p>
              </div>
              <Users className="w-10 h-10 text-purple-400 opacity-50" />
            </div>
          </Card>

          <Card className="p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-semibold">قيد الانتظار</p>
                <p className="text-sm sm:text-base md:text-lg sm:text-base sm:text-sm sm:text-base md:text-lg md:text-xl md:text-2xl font-bold text-yellow-900">{stats.pending}</p>
              </div>
              <Package className="w-10 h-10 text-purple-400 opacity-50" />
            </div>
          </Card>

          <Card className="p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-semibold">موافق عليها</p>
                <p className="text-sm sm:text-base md:text-lg sm:text-base sm:text-sm sm:text-base md:text-lg md:text-xl md:text-2xl font-bold text-orange-900">{stats.approved}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-orange-400 opacity-50" />
            </div>
          </Card>

          <Card className="p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-semibold">مدفوعة</p>
                <p className="text-sm sm:text-base md:text-lg sm:text-base sm:text-sm sm:text-base md:text-lg md:text-xl md:text-2xl font-bold text-green-900">{stats.paid}</p>
              </div>
              <DollarSign className="w-10 h-10 text-green-400 opacity-50" />
            </div>
          </Card>

          <Card className="p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-rose-600 text-sm font-semibold">إجمالي المبلغ</p>
                <p className="text-sm sm:text-base md:text-lg sm:text-base sm:text-sm sm:text-base md:text-lg md:text-xl md:text-2xl font-bold text-rose-900">{stats.totalAmount.toFixed(2)}</p>
              </div>
              <DollarSign className="w-10 h-10 text-rose-400 opacity-50" />
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:p-2 sm:p-2.5 md:p-3 lg:p-4 md:p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 lg:p-8 mb-8">
          {/* Bar Chart */}
          <Card className="p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 shadow-lg border-rose-200">
            <h3 className="text-base sm:text-sm sm:text-base md:text-lg md:text-xl font-bold text-rose-900 mb-4">📊 عمولات المندوبين</h3>
                  {delegateStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={delegateStats as any}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="totalCommission" fill="#f43f5e" name="إجمالي العمولة" />
                  <Bar dataKey="totalOrders" fill="#3b82f6" name="عدد الطلبات" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">لا توجد بيانات</p>
            )}
          </Card>

          {/* Pie Chart */}
          <Card className="p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 shadow-lg border-rose-200">
            <h3 className="text-base sm:text-sm sm:text-base md:text-lg md:text-xl font-bold text-rose-900 mb-4">🥧 توزيع الحالات</h3>
            {stats.total > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "قيد الانتظار", value: stats.pending },
                      { name: "موافق عليها", value: stats.approved },
                      { name: "مدفوعة", value: stats.paid }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[0, 1, 2].map((index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">لا توجد بيانات</p>
            )}
          </Card>
        </div>

        {/* Controls */}
        <Card className="p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 mb-8 shadow-lg border-rose-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:p-2.5 md:p-3 lg:p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث عن اسم المندوب..."
                className="pl-10 border-2 border-rose-200 focus:border-rose-500 rounded-md sm:rounded-lg"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border-2 border-rose-200 focus:border-rose-500 rounded-md sm:rounded-lg p-2 bg-white"
            >
              <option value="all">جميع الحالات</option>
              <option value="pending">قيد الانتظار</option>
              <option value="approved">موافق عليها</option>
              <option value="paid">مدفوعة</option>
            </select>

            <Button
              onClick={handleExport}
              className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              تحميل التقرير
            </Button>
          </div>
        </Card>

        {/* Table */}
        {filteredAndSortedCommissions.length === 0 ? (
          <Card className="p-12 text-center shadow-lg border-rose-200">
            <AlertCircle className="w-16 h-16 text-rose-300 mx-auto mb-4" />
            <p className="text-base sm:text-sm sm:text-base md:text-lg md:text-xl text-gray-600 font-semibold">لا توجد عمولات</p>
          </Card>
        ) : (
          <Card className="overflow-hidden shadow-lg border-rose-200">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gradient-to-r from-rose-50 to-pink-50 border-b-2 border-rose-200">
                  <TableRow>
                    <TableHead className="text-rose-900 font-bold">اسم المندوب</TableHead>
                    <TableHead className="text-rose-900 font-bold">نوع العمولة</TableHead>
                    <TableHead className="text-rose-900 font-bold">النسبة</TableHead>
                    <TableHead className="text-rose-900 font-bold">المبلغ الإجمالي</TableHead>
                    <TableHead className="text-rose-900 font-bold">مبلغ العمولة</TableHead>
                    <TableHead className="text-rose-900 font-bold">الحالة</TableHead>
                    <TableHead className="text-rose-900 font-bold">الملاحظات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedCommissions.map((commission: DelegateCommission) => (
                    <TableRow key={commission.id} className="border-b border-rose-100 hover:bg-rose-50 transition-colors">
                      <TableCell className="font-bold text-rose-900">{commission.delegateName}</TableCell>
                      <TableCell className="text-gray-700">
                        {commission.commissionType === "percentage" ? "نسبة مئوية" : "مبلغ ثابت"}
                      </TableCell>
                      <TableCell className="text-gray-700 font-mono">{commission.commissionRate}%</TableCell>
                      <TableCell className="text-gray-700">{parseFloat(commission.totalOrderAmount).toFixed(2)} د.ا</TableCell>
                      <TableCell className="font-bold text-rose-600">{parseFloat(commission.commissionAmount).toFixed(2)} د.ا</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            commission.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : commission.status === "approved"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-green-100 text-green-800"
                          }
                        >
                          {commission.status === "pending"
                            ? "قيد الانتظار"
                            : commission.status === "approved"
                            ? "موافق عليها"
                            : "مدفوعة"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600 text-sm">{commission.notes || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
