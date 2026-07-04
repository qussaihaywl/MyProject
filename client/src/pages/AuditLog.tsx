import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Download, Eye, Filter, Calendar } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export default function AuditLog() {
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filters, setFilters] = useState({
    userId: '',
    activityType: '',
    search: '',
  });

  const { data: auditLogs, isLoading } = trpc.users.getAuditLog.useQuery({
    userId: filters.userId ? parseInt(filters.userId) : undefined,
    activityType: filters.activityType || undefined,
    limit: 100,
    offset: 0,
  });

  const activityTypes = [
    'update_user',
    'delete_user',
    'update_user_role',
    'update_user_permissions',
    'reset_user_password',
    'bulk_import_users',
    'login',
    'logout',
  ];

  const getActivityIcon = (type: string) => {
    const icons: Record<string, string> = {
      update_user: '✏️',
      delete_user: '🗑️',
      update_user_role: '👤',
      update_user_permissions: '🔐',
      reset_user_password: '🔑',
      bulk_import_users: '📥',
      login: '🔓',
      logout: '🔒',
    };
    return icons[type] || '📋';
  };

  const getActivityColor = (type: string) => {
    if (type.includes('delete')) return 'destructive';
    if (type.includes('import')) return 'default';
    if (type.includes('permission') || type.includes('password')) return 'secondary';
    return 'outline';
  };

  const exportToCSV = () => {
    if (!auditLogs?.logs) {
      toast.error('لا توجد بيانات للتصدير');
      return;
    }

    const headers = ['المعرف', 'نوع النشاط', 'الوصف', 'التاريخ', 'التفاصيل'];
    const rows = auditLogs.logs.map((log: any) => [
      log.userId,
      log.activityType,
      log.description,
      new Date(log.createdAt).toLocaleString('ar-SA'),
      JSON.stringify(log.metadata),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row: any) => row.map((cell: any) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `audit-log-${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    toast.success('تم تصدير السجل بنجاح');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-red-900 mb-2">سجل التدقيق الشامل</h1>
          <p className="text-red-700">تتبع جميع التغييرات والعمليات على النظام</p>
        </div>

        {/* Filters Card */}
        <Card className="border-2 border-red-200 mb-6 shadow-lg">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-red-600" />
                <Input
                  placeholder="ابحث عن معرف المستخدم..."
                  value={filters.userId}
                  onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
                  className="pl-10 border-red-200 focus:border-red-500"
                />
              </div>

              {/* Activity Type Filter */}
              <Select value={filters.activityType} onValueChange={(value) => setFilters({ ...filters, activityType: value })}>
                <SelectTrigger className="border-red-200 focus:border-red-500">
                  <SelectValue placeholder="نوع النشاط" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">جميع الأنواع</SelectItem>
                  {activityTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Export Button */}
              <Button
                onClick={exportToCSV}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                تصدير CSV
              </Button>

              {/* Clear Filters */}
              <Button
                onClick={() => setFilters({ userId: '', activityType: '', search: '' })}
                variant="outline"
                className="border-red-300 text-red-700"
              >
                <Filter className="w-4 h-4 mr-2" />
                مسح الفلاتر
              </Button>
            </div>
          </div>
        </Card>

        {/* Logs Table */}
        <Card className="border-2 border-red-200 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-red-50">
                <TableRow>
                  <TableHead className="text-red-900">النوع</TableHead>
                  <TableHead className="text-red-900">الوصف</TableHead>
                  <TableHead className="text-red-900">معرف المستخدم</TableHead>
                  <TableHead className="text-red-900">التاريخ والوقت</TableHead>
                  <TableHead className="text-red-900">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-red-700">
                      جاري التحميل...
                    </TableCell>
                  </TableRow>
                ) : auditLogs?.logs && auditLogs.logs.length > 0 ? (
                  auditLogs.logs.map((log: any, index: number) => (
                    <TableRow key={index} className="hover:bg-red-50 transition">
                      <TableCell>
                        <Badge variant={getActivityColor(log.activityType) as any}>
                          {getActivityIcon(log.activityType)} {log.activityType}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-red-900">
                        {log.description}
                      </TableCell>
                      <TableCell className="text-red-700 font-semibold">
                        {log.userId}
                      </TableCell>
                      <TableCell className="text-red-700 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-red-600" />
                          {new Date(log.createdAt).toLocaleString('ar-SA')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedLog(log);
                            setShowDetails(true);
                          }}
                          className="border-red-300 text-red-700 hover:bg-red-50"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-red-700">
                      لا توجد سجلات
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Details Dialog */}
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-red-900">تفاصيل السجل</DialogTitle>
            </DialogHeader>
            {selectedLog && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm text-red-700 mb-1">نوع النشاط</p>
                    <p className="font-semibold text-red-900">{selectedLog.activityType}</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm text-red-700 mb-1">معرف المستخدم</p>
                    <p className="font-semibold text-red-900">{selectedLog.userId}</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200 col-span-2">
                    <p className="text-sm text-red-700 mb-1">الوصف</p>
                    <p className="font-semibold text-red-900">{selectedLog.description}</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200 col-span-2">
                    <p className="text-sm text-red-700 mb-1">التاريخ والوقت</p>
                    <p className="font-semibold text-red-900">
                      {new Date(selectedLog.createdAt).toLocaleString('ar-SA')}
                    </p>
                  </div>
                </div>

                {/* Metadata */}
                {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700 mb-3 font-semibold">البيانات الإضافية</p>
                    <div className="space-y-2">
                      {Object.entries(selectedLog.metadata).map(([key, value]: [string, any]) => (
                        <div key={key} className="flex justify-between items-start">
                          <span className="text-blue-900 font-medium">{key}:</span>
                          <span className="text-blue-700 text-right break-words max-w-xs">
                            {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* IP Address and User Agent */}
                {selectedLog.ipAddress && (
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-700 mb-1">عنوان IP</p>
                    <p className="font-mono text-yellow-900">{selectedLog.ipAddress}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Stats Card */}
        <Card className="mt-8 border-2 border-green-200 bg-green-50">
          <div className="p-6">
            <h3 className="font-semibold text-green-900 mb-4">📊 إحصائيات السجل</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <p className="text-sm text-green-700">إجمالي السجلات</p>
                <p className="text-2xl font-bold text-green-600">{auditLogs?.total || 0}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <p className="text-sm text-green-700">تحديثات المستخدمين</p>
                <p className="text-2xl font-bold text-green-600">
                  {auditLogs?.logs?.filter((l: any) => l.activityType === 'update_user').length || 0}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <p className="text-sm text-green-700">عمليات الحذف</p>
                <p className="text-2xl font-bold text-green-600">
                  {auditLogs?.logs?.filter((l: any) => l.activityType === 'delete_user').length || 0}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <p className="text-sm text-green-700">عمليات الاستيراد</p>
                <p className="text-2xl font-bold text-green-600">
                  {auditLogs?.logs?.filter((l: any) => l.activityType === 'bulk_import_users').length || 0}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
