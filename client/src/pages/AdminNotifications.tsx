import { useState, useEffect, useMemo } from "react";
import { Bell, Trash2, CheckCircle, AlertCircle, User, ShoppingBag, MessageSquare, Settings, Filter, Clock, Eye, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

interface NotificationItem {
  id: number;
  userId: number;
  type: "order" | "promotion" | "review" | "message" | "system" | "payment";
  title: string;
  content: string;
  actionUrl: string | null;
  isRead: boolean;
  readAt: Date | null;
  createdAt: Date;
}

export default function AdminNotifications() {
  return (
    <AdminNotificationsContent />
  );
}

function AdminNotificationsContent() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | "unread" | "order" | "system" | "message">("all");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  // جلب الإشعارات من قاعدة البيانات
  const notificationsQuery = trpc.notifications.list.useQuery({ limit: 50, offset: 0 });
  const markAsReadMutation = trpc.notifications.markAsRead.useMutation();
  const unreadCountQuery = trpc.notifications.getUnreadCount.useQuery();

  useEffect(() => {
    if (notificationsQuery.data) {
      setNotifications(notificationsQuery.data);
      setLoading(false);
    }
  }, [notificationsQuery.data]);

  const filteredNotifications = notifications.filter(notif => {
    if (filter === "all") return true;
    if (filter === "unread") return !notif.isRead;
    return notif.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsReadMutation.mutateAsync({ notificationId: id });
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, isRead: true, readAt: new Date() } : n
      ));
      toast.success("تم تحديث الإشعار");
    } catch (error) {
      toast.error("فشل تحديث الإشعار");
    }
  };

  const handleDelete = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success("تم حذف الإشعار");
  };

  const handleMarkAllAsRead = async () => {
    try {
      for (const notif of notifications.filter(n => !n.isRead)) {
        await markAsReadMutation.mutateAsync({ notificationId: notif.id });
      }
      setNotifications(notifications.map(n => ({ ...n, isRead: true, readAt: new Date() })));
      toast.success("تم تحديث جميع الإشعارات");
    } catch (error) {
      toast.error("فشل تحديث الإشعارات");
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingBag className="w-5 h-5" />;
      case "message":
        return <MessageSquare className="w-5 h-5" />;
      case "system":
        return <AlertCircle className="w-5 h-5" />;
      case "payment":
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "order":
        return "from-green-500 to-green-600";
      case "message":
        return "from-purple-500 to-purple-600";
      case "system":
        return "from-yellow-500 to-yellow-600";
      case "payment":
        return "from-blue-500 to-blue-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getArabicType = (type: string) => {
    const typeMap: Record<string, string> = {
      order: "طلب",
      promotion: "عرض ترويجي",
      review: "تقييم",
      message: "رسالة",
      system: "نظام",
      payment: "دفع"
    };
    return typeMap[type] || type;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 pb-20">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-rose-600 via-orange-500 to-rose-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">الإشعارات</h1>
              <p className="text-rose-100">إدارة جميع إشعارات النظام والطلبات والرسائل</p>
            </div>
            <div className="bg-white bg-opacity-20 px-6 py-3 rounded-lg backdrop-blur">
              <p className="text-2xl font-bold">{unreadCount}</p>
              <p className="text-sm text-rose-100">إشعارات غير مقروءة</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter Bar */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            onClick={() => setFilter("all")}
            variant={filter === "all" ? "default" : "outline"}
            className={filter === "all" ? "bg-gradient-to-r from-rose-600 to-orange-500" : ""}
          >
            جميع الإشعارات
          </Button>
          <Button
            onClick={() => setFilter("unread")}
            variant={filter === "unread" ? "default" : "outline"}
            className={filter === "unread" ? "bg-gradient-to-r from-rose-600 to-orange-500" : ""}
          >
            غير مقروءة ({unreadCount})
          </Button>
          <Button
            onClick={() => setFilter("order")}
            variant={filter === "order" ? "default" : "outline"}
            className={filter === "order" ? "bg-gradient-to-r from-rose-600 to-orange-500" : ""}
          >
            الطلبات
          </Button>
          <Button
            onClick={() => setFilter("message")}
            variant={filter === "message" ? "default" : "outline"}
            className={filter === "message" ? "bg-gradient-to-r from-rose-600 to-orange-500" : ""}
          >
            الرسائل
          </Button>
          <Button
            onClick={() => setFilter("system")}
            variant={filter === "system" ? "default" : "outline"}
            className={filter === "system" ? "bg-gradient-to-r from-rose-600 to-orange-500" : ""}
          >
            النظام
          </Button>

          {unreadCount > 0 && (
            <Button
              onClick={handleMarkAllAsRead}
              className="ml-auto bg-gradient-to-r from-green-600 to-green-500"
            >
              <CheckCircle className="w-4 h-4 ml-2" />
              تحديث الكل
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {loading ? (
            <Card className="p-8 text-center">
              <p className="text-gray-600">جاري تحميل الإشعارات...</p>
            </Card>
          ) : filteredNotifications.length === 0 ? (
            <Card className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">لا توجد إشعارات</p>
            </Card>
          ) : (
            filteredNotifications.map((notif) => (
              <Card
                key={notif.id}
                className={`p-6 border-l-4 transition-all hover:shadow-lg ${
                  notif.isRead
                    ? "bg-white border-l-gray-300"
                    : "bg-gradient-to-r from-rose-50 to-orange-50 border-l-rose-600"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getNotificationColor(notif.type)} flex items-center justify-center text-white flex-shrink-0`}>
                      {getNotificationIcon(notif.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-gray-900 text-lg">{notif.title}</h3>
                        <Badge className="bg-gradient-to-r from-rose-600 to-orange-500 text-white">
                          {getArabicType(notif.type)}
                        </Badge>
                        {!notif.isRead && (
                          <Badge className="bg-red-500 text-white">جديد</Badge>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{notif.content}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(notif.createdAt).toLocaleString("ar-SA")}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    {!notif.isRead && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="border-rose-600 text-rose-600 hover:bg-rose-50"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    {notif.actionUrl && (
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-rose-600 to-orange-500 text-white"
                        onClick={() => window.location.href = notif.actionUrl!}
                      >
                        عرض
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(notif.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
