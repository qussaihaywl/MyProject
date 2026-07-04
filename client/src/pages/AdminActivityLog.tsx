import { useState, useEffect } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
// import ActivityLog from '@/components/ActivityLog';
import DashboardLayout from '@/components/DashboardLayout';

interface Activity {
  id: number;
  timestamp: string;
  admin: string;
  action: 'create' | 'update' | 'delete' | 'role_change' | 'status_change' | 'login' | 'logout';
  targetUser?: string;
  targetId?: number;
  details: string;
  status: 'success' | 'failed' | 'pending';
  ipAddress?: string;
}

export default function AdminActivityLog() {
  const { user, loading } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 1,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      admin: 'أحمد محمد',
      action: 'role_change',
      targetUser: 'فاطمة علي',
      targetId: 5,
      details: 'تم تغيير الدور من مستخدم عادي إلى مندوب',
      status: 'success',
      ipAddress: '192.168.1.100',
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      admin: 'سارة خالد',
      action: 'update',
      targetUser: 'محمد سالم',
      targetId: 3,
      details: 'تم تحديث بيانات المستخدم (البريد الإلكتروني، رقم الهاتف)',
      status: 'success',
      ipAddress: '192.168.1.101',
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      admin: 'علي حسن',
      action: 'status_change',
      targetUser: 'ليلى محمود',
      targetId: 7,
      details: 'تم تغيير حالة المستخدم من نشط إلى معطل',
      status: 'success',
      ipAddress: '192.168.1.102',
    },
    {
      id: 4,
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      admin: 'أحمد محمد',
      action: 'delete',
      targetUser: 'خالد إبراهيم',
      targetId: 10,
      details: 'تم حذف حساب المستخدم بناءً على طلبه',
      status: 'success',
      ipAddress: '192.168.1.100',
    },
    {
      id: 5,
      timestamp: new Date(Date.now() - 18000000).toISOString(),
      admin: 'سارة خالد',
      action: 'create',
      targetUser: 'نور أحمد',
      targetId: 15,
      details: 'تم إنشاء حساب مستخدم جديد',
      status: 'success',
      ipAddress: '192.168.1.101',
    },
    {
      id: 6,
      timestamp: new Date(Date.now() - 21600000).toISOString(),
      admin: 'علي حسن',
      action: 'login',
      details: 'تسجيل دخول المسؤول',
      status: 'success',
      ipAddress: '192.168.1.102',
    },
    {
      id: 7,
      timestamp: new Date(Date.now() - 25200000).toISOString(),
      admin: 'أحمد محمد',
      action: 'update',
      targetUser: 'ريم سالم',
      targetId: 8,
      details: 'محاولة تحديث البيانات فشلت - بيانات غير صحيحة',
      status: 'failed',
      ipAddress: '192.168.1.100',
    },
  ]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-slate-600">جاري التحميل...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 font-semibold mb-2">غير مصرح</p>
            <p className="text-slate-600">ليس لديك صلاحية للوصول إلى هذه الصفحة</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const handleExport = () => {
    // تحويل البيانات إلى CSV
    const headers = ['التاريخ', 'المسؤول', 'الإجراء', 'المستخدم المستهدف', 'التفاصيل', 'الحالة', 'عنوان IP'];
    const rows = activities.map(activity => [
      new Date(activity.timestamp).toLocaleString('ar-SA'),
      activity.admin,
      activity.action,
      activity.targetUser || '-',
      activity.details,
      activity.status,
      activity.ipAddress || '-',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    // تحميل الملف
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `activity-log-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">سجل الأنشطة</h1>
          <p className="text-slate-600 mt-1">تتبع جميع الإجراءات والتعديلات التي تم إجراؤها على النظام</p>
                </div>
        {/* ActivityLog component would go here */}
        <div className="mt-6 text-center text-gray-500">
          لا توجد أنشطة حالياً
        </div>
      </div>
    </DashboardLayout>
  );
}
