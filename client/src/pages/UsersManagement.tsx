import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { 
  Plus, Edit2, Trash2, Search, Download, 
  CheckCircle, XCircle, Mail, Phone, Calendar, Shield, 
  TrendingUp, Users, Zap 
} from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export default function UsersManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>({});

  const usersQuery = trpc.users.getAllUsers.useQuery({
    search: searchTerm || undefined,
    role: roleFilter !== 'all' ? (roleFilter as any) : undefined,
    status: statusFilter !== 'all' ? (statusFilter as any) : undefined,
    limit: 100,
    offset: 0,
  });
  const users = usersQuery.data?.users ?? [];

  // دالة حذف المستخدم
  const utils = trpc.useUtils();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const deleteUserMutation = trpc.users.deleteUser.useMutation({
    onSuccess: () => {
      toast.success("تم حذف المستخدم بنجاح");
      utils.users.getAllUsers.invalidate();
    },
    onError: (error) => {
      toast.error("فشل حذف المستخدم: " + (error?.message || "خطأ غير معروف"));
    },
  });

  const handleDeleteUser = (userId: number, userName: string) => {
    if (window.confirm(`هل أنت متأكد من حذف المستخدم "${userName}"؟`)) {
      deleteUserMutation.mutate({ userId });
    }
  };

  // دالة تحديث المستخدم
  const updateUserMutation = trpc.users.updateUser.useMutation({
    onSuccess: () => {
      toast.success("تم تحديث المستخدم بنجاح");
      utils.users.getAllUsers.invalidate();
      setEditingUser(null);
    },
    onError: (error) => {
      toast.error("فشل تحديث المستخدم: " + (error?.message || "خطأ غير معروف"));
    },
  });

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "user",
      isActive: user.status === "active" || user.isActive,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    await updateUserMutation.mutateAsync({
      id: editingUser.id,
      ...editFormData,
    });
  };

  // فلترة وترتيب المستخدمين
  const filteredUsers = useMemo(() => {
    let result = [...users];

    // الترتيب
    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [users, sortBy]);

  // الإحصائيات
  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter(u => u.isActive).length,
    inactive: users.filter(u => !u.isActive).length,
    admins: users.filter(u => u.role === "admin").length,
    delegates: users.filter(u => u.role === "delegate").length,
    supervisors: users.filter(u => u.role === "supervisor").length,
  }), [users]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500/20 text-red-700 border-red-300";
      case "delegate":
        return "bg-purple-500/20 text-purple-700 border-purple-300";
      case "supervisor":
        return "bg-blue-500/20 text-blue-700 border-blue-300";
      default:
        return "bg-gray-500/20 text-gray-700 border-gray-300";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "مسؤول";
      case "delegate":
        return "مندوب";
      case "supervisor":
        return "مشرف";
      default:
        return "مستخدم عادي";
    }
  };

  const exportToCSV = () => {
    const headers = ["الاسم", "البريد الإلكتروني", "الهاتف", "الدور", "الحالة", "تاريخ التسجيل"];
    const data = filteredUsers.map(u => [
      u.name,
      u.email,
      u.phone || "-",
      getRoleLabel(u.role),
      u.isActive ? "نشط" : "معطل",
      new Date(u.createdAt).toLocaleDateString('ar-EG'),
    ]);

    const csv = [headers, ...data].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success("تم تصدير البيانات بنجاح");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">إدارة المستخدمين</h1>
            <p className="text-gray-300">إدارة شاملة وكاملة لجميع المستخدمين</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
            <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/30 hover:border-blue-500/50 transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">إجمالي المستخدمين</p>
                  <p className="text-3xl font-bold text-blue-400">{stats.total}</p>
                </div>
                <Users className="w-10 h-10 text-blue-500/50" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/30 hover:border-green-500/50 transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">نشطون</p>
                  <p className="text-3xl font-bold text-green-400">{stats.active}</p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-500/50" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-red-500/10 to-red-600/10 border-red-500/30 hover:border-red-500/50 transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">معطلون</p>
                  <p className="text-3xl font-bold text-red-400">{stats.inactive}</p>
                </div>
                <XCircle className="w-10 h-10 text-red-500/50" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/30 hover:border-orange-500/50 transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">مسؤولون</p>
                  <p className="text-3xl font-bold text-orange-400">{stats.admins}</p>
                </div>
                <Shield className="w-10 h-10 text-orange-500/50" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/30 hover:border-purple-500/50 transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">مندوبون</p>
                  <p className="text-3xl font-bold text-purple-400">{stats.delegates}</p>
                </div>
                <TrendingUp className="w-10 h-10 text-purple-500/50" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 border-cyan-500/30 hover:border-cyan-500/50 transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">مشرفون</p>
                  <p className="text-3xl font-bold text-cyan-400">{stats.supervisors}</p>
                </div>
                <Zap className="w-10 h-10 text-cyan-500/50" />
              </div>
            </Card>
          </div>

          {/* Search and Filter Bar */}
          <Card className="p-6 bg-slate-800/50 border-slate-700/50 backdrop-blur mb-8">
            <div className="space-y-4">
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="ابحث عن مستخدم..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-slate-700/50 border-slate-600/50 text-white placeholder-gray-500 pr-10"
                    />
                  </div>
                </div>

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg"
                >
                  <option value="all">جميع الأدوار</option>
                  <option value="user">مستخدم عادي</option>
                  <option value="delegate">مندوب</option>
                  <option value="supervisor">مشرف</option>
                  <option value="admin">مسؤول</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="active">نشط</option>
                  <option value="inactive">معطل</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg"
                >
                  <option value="newest">الأحدث</option>
                  <option value="oldest">الأقدم</option>
                  <option value="name">الاسم</option>
                </select>

                <Button
                  onClick={exportToCSV}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                >
                  <Download className="w-5 h-5 ml-2" />
                  تصدير
                </Button>
              </div>
            </div>
          </Card>

          {/* Users Table */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50 bg-slate-900/50">
                    <th className="text-right py-4 px-6 text-gray-300 font-semibold">الاسم</th>
                    <th className="text-right py-4 px-6 text-gray-300 font-semibold">البريد الإلكتروني</th>
                    <th className="text-right py-4 px-6 text-gray-300 font-semibold">الهاتف</th>
                    <th className="text-right py-4 px-6 text-gray-300 font-semibold">الدور</th>
                    <th className="text-right py-4 px-6 text-gray-300 font-semibold">الحالة</th>
                    <th className="text-right py-4 px-6 text-gray-300 font-semibold">التسجيل</th>
                    <th className="text-right py-4 px-6 text-gray-300 font-semibold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition">
                      <td className="py-4 px-6">
                        <p className="text-white font-medium">{user.name}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-gray-400 text-sm flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-gray-400 text-sm flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {user.phone || "-"}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <Badge className={`${getRoleColor(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <Badge className={`${user.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                          {user.isActive ? "نشط" : "معطل"}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-gray-400 text-sm flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-blue-400 border-blue-400/50 hover:bg-blue-500/10"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-400 border-red-400/50 hover:bg-red-500/10"
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            disabled={deleteUserMutation.isPending}
                          >
                            {deleteUserMutation.isPending ? (
                              <Spinner className="w-4 h-4" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-500 mx-auto mb-4 opacity-50" />
                <p className="text-gray-400">لا توجد مستخدمين مطابقة للبحث</p>
              </div>
            )}
          </Card>

          {/* Footer Stats */}
          <div className="mt-8 text-center text-gray-400">
            <p>عدد المستخدمين المعروضين: <span className="text-white font-bold">{filteredUsers.length}</span> من <span className="text-white font-bold">{stats.total}</span></p>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-slate-800 border-slate-700 max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6">تحديث المستخدم</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">الاسم</label>
                  <Input
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="bg-slate-700/50 border-slate-600/50 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">البريد الإلكتروني</label>
                  <Input
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="bg-slate-700/50 border-slate-600/50 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">الهاتف</label>
                  <Input
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="bg-slate-700/50 border-slate-600/50 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">الدور</label>
                  <select
                    value={editFormData.role}
                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg"
                  >
                    <option value="user">مستخدم عادي</option>
                    <option value="delegate">مندوب</option>
                    <option value="supervisor">مشرف</option>
                    <option value="admin">مسؤول</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-300">
                    <input
                      type="checkbox"
                      checked={editFormData.isActive}
                      onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.checked })}
                      className="rounded"
                    />
                    <span>نشط</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => {
                    handleSaveUser();
                    setIsEditModalOpen(false);
                  }}
                  disabled={updateUserMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                >
                  {updateUserMutation.isPending ? <Spinner className="w-4 h-4" /> : "حفظ"}
                </Button>
                <Button
                  onClick={() => setIsEditModalOpen(false)}
                  variant="outline"
                  className="flex-1 text-gray-300 border-slate-600/50"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
