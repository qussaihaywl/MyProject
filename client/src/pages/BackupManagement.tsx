'use client';

import React, { useState } from 'react';
import { Database, Download, Clock, CheckCircle, AlertCircle, Play, Pause, Trash2, Plus } from 'lucide-react';

interface Backup {
  id: number;
  name: string;
  date: string;
  size: string;
  status: 'completed' | 'in_progress' | 'failed';
  type: 'manual' | 'automatic';
  dataCount: {
    users: number;
    products: number;
    orders: number;
  };
}

interface BackupSchedule {
  id: number;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  enabled: boolean;
  lastRun: string;
  nextRun: string;
}

const BackupManagement = () => {
  const [backups, setBackups] = useState<Backup[]>([
    {
      id: 1,
      name: 'نسخة احتياطية - 17 يونيو 2026',
      date: '17/06/2026 14:30',
      size: '245 MB',
      status: 'completed',
      type: 'automatic',
      dataCount: { users: 1234, products: 5678, orders: 890 },
    },
    {
      id: 2,
      name: 'نسخة احتياطية - 16 يونيو 2026',
      date: '16/06/2026 14:30',
      size: '242 MB',
      status: 'completed',
      type: 'automatic',
      dataCount: { users: 1230, products: 5670, orders: 885 },
    },
    {
      id: 3,
      name: 'نسخة احتياطية يدوية - 15 يونيو 2026',
      date: '15/06/2026 10:15',
      size: '240 MB',
      status: 'completed',
      type: 'manual',
      dataCount: { users: 1225, products: 5650, orders: 880 },
    },
  ]);

  const [schedules, setSchedules] = useState<BackupSchedule[]>([
    {
      id: 1,
      name: 'النسخ الاحتياطية اليومية',
      frequency: 'daily',
      time: '02:00 صباحاً',
      enabled: true,
      lastRun: '17/06/2026 02:00',
      nextRun: '18/06/2026 02:00',
    },
    {
      id: 2,
      name: 'النسخ الاحتياطية الأسبوعية',
      frequency: 'weekly',
      time: 'الأحد 03:00 صباحاً',
      enabled: true,
      lastRun: '15/06/2026 03:00',
      nextRun: '22/06/2026 03:00',
    },
    {
      id: 3,
      name: 'النسخ الاحتياطية الشهرية',
      frequency: 'monthly',
      time: '1 من كل شهر 04:00 صباحاً',
      enabled: true,
      lastRun: '01/06/2026 04:00',
      nextRun: '01/07/2026 04:00',
    },
  ]);

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleCreateBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      const newBackup: Backup = {
        id: backups.length + 1,
        name: `نسخة احتياطية يدوية - ${new Date().toLocaleDateString('ar-SA')}`,
        date: new Date().toLocaleString('ar-SA'),
        size: '246 MB',
        status: 'completed',
        type: 'manual',
        dataCount: { users: 1234, products: 5678, orders: 890 },
      };
      setBackups([newBackup, ...backups]);
      setIsBackingUp(false);
    }, 3000);
  };

  const handleToggleSchedule = (id: number) => {
    setSchedules(schedules.map(s =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'in_progress':
        return <Clock className="text-blue-600 animate-spin" size={20} />;
      case 'failed':
        return <AlertCircle className="text-red-600" size={20} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Database className="text-amber-900" size={32} />
              <h1 className="text-4xl font-bold text-amber-900">إدارة النسخ الاحتياطية</h1>
            </div>
            <button
              onClick={handleCreateBackup}
              disabled={isBackingUp}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Plus size={20} /> {isBackingUp ? 'جاري الإنشاء...' : 'إنشاء نسخة احتياطية'}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-lg border-2 border-amber-200 p-6">
              <p className="text-gray-600 text-sm">إجمالي النسخ الاحتياطية</p>
              <p className="text-3xl font-bold text-amber-900 mt-2">{backups.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg border-2 border-amber-200 p-6">
              <p className="text-gray-600 text-sm">آخر نسخة احتياطية</p>
              <p className="text-lg font-bold text-amber-900 mt-2">{backups[0]?.date}</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg border-2 border-amber-200 p-6">
              <p className="text-gray-600 text-sm">إجمالي المساحة المستخدمة</p>
              <p className="text-3xl font-bold text-amber-900 mt-2">
                {(parseInt(backups[0]?.size || '0') * backups.length).toFixed(0)} MB
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Backups List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg border-2 border-amber-200 p-6">
              <h2 className="text-2xl font-bold text-amber-900 mb-6">النسخ الاحتياطية</h2>
              <div className="space-y-4">
                {backups.map((backup) => (
                  <div key={backup.id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-amber-300 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(backup.status)}
                        <div>
                          <h3 className="font-bold text-amber-900">{backup.name}</h3>
                          <p className="text-sm text-gray-600">{backup.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm border-2 ${getStatusColor(backup.status)}`}>
                          {backup.status === 'completed' && 'مكتملة'}
                          {backup.status === 'in_progress' && 'قيد المعالجة'}
                          {backup.status === 'failed' && 'فشلت'}
                        </span>
                        <span className="text-sm font-semibold text-gray-600">{backup.size}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3 bg-gray-50 p-3 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-600">المستخدمون</p>
                        <p className="font-bold text-amber-900">{backup.dataCount.users.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">المنتجات</p>
                        <p className="font-bold text-amber-900">{backup.dataCount.products.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">الطلبات</p>
                        <p className="font-bold text-amber-900">{backup.dataCount.orders.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
                        <Download size={16} /> تحميل
                      </button>
                      <button className="flex-1 bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-all">
                        استعادة
                      </button>
                      <button className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Backup Schedules */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg border-2 border-amber-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-amber-900">الجداول الزمنية</h2>
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="bg-gradient-to-r from-pink-500 to-rose-600 text-white p-2 rounded-lg hover:shadow-lg transition-all"
                >
                  <Plus size={18} />
                </button>
              </div>

              <div className="space-y-3">
                {schedules.map((schedule) => (
                  <div key={schedule.id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-amber-300 transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-amber-900">{schedule.name}</h3>
                        <p className="text-xs text-gray-600 mt-1">الوقت: {schedule.time}</p>
                      </div>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={schedule.enabled}
                          onChange={() => handleToggleSchedule(schedule.id)}
                          className="w-5 h-5 rounded cursor-pointer"
                        />
                      </label>
                    </div>

                    <div className="bg-gray-50 p-2 rounded text-xs space-y-1 mt-2">
                      <p className="text-gray-600">آخر تشغيل: <span className="font-semibold text-gray-800">{schedule.lastRun}</span></p>
                      <p className="text-gray-600">التشغيل التالي: <span className="font-semibold text-amber-900">{schedule.nextRun}</span></p>
                    </div>

                    {schedule.enabled && (
                      <div className="mt-3 bg-green-50 border-l-4 border-green-500 p-2">
                        <p className="text-xs text-green-700">✓ مفعل</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Modal */}
        {showScheduleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-6 flex justify-between items-center">
                <h2 className="text-xl font-bold">إضافة جدول زمني جديد</h2>
                <button onClick={() => setShowScheduleModal(false)} className="text-white hover:text-gray-200">
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">اسم الجدول</label>
                  <input
                    type="text"
                    placeholder="مثال: النسخ الاحتياطية اليومية"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">التكرار</label>
                  <select className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                    <option>يومي</option>
                    <option>أسبوعي</option>
                    <option>شهري</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">الوقت</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowScheduleModal(false)}
                    className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-all"
                  >
                    إلغاء
                  </button>
                  <button className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg transition-all">
                    إضافة
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackupManagement;
