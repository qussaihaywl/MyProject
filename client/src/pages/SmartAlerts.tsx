import { useState, useEffect } from "react";
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
  Switch,
} from "@/components/ui/switch";
import {
  Bell,
  Mail,
  MessageSquare,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Info,
  Trash2,
  Settings,
} from "lucide-react";
import { toast } from "sonner";

export default function SmartAlerts() {
  const { user } = useAuth();
  const [alertSettings, setAlertSettings] = useState({
    orderUpdates: true,
    commissionNotifications: true,
    priceDropAlerts: true,
    newProductAlerts: true,
    promotionAlerts: true,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
  });

  // Fetch alerts
  const { data: alertsData, refetch } = trpc.notifications.list.useQuery({ limit: 20, offset: 0 });

  // Delete alert mutation
  const deleteAlertMutation = trpc.notifications.delete.useMutation({
    onSuccess: () => {
      toast.success("تم حذف التنبيه");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || "فشل حذف التنبيه");
    },
  });

  // Mark as read mutation
  const markAsReadMutation = trpc.notifications.markAsRead.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const alerts = alertsData || [];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingBag className="w-5 h-5 text-blue-600" />;
      case "commission":
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case "price":
        return <TrendingUp className="w-5 h-5 text-amber-600" />;
      case "product":
        return <Bell className="w-5 h-5 text-purple-600" />;
      case "promotion":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Info className="w-5 h-5 text-slate-600" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "order":
        return "bg-blue-50 border-blue-200";
      case "commission":
        return "bg-green-50 border-green-200";
      case "price":
        return "bg-amber-50 border-amber-200";
      case "product":
        return "bg-purple-50 border-purple-200";
      case "promotion":
        return "bg-red-50 border-red-200";
      default:
        return "bg-slate-50 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Bell className="w-8 h-8 text-blue-600" />
            التنبيهات الذكية
          </h1>
          <p className="text-slate-600">
            أدر التنبيهات واختر ما تريد أن تتلقاه
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  إعدادات التنبيهات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Updates */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-blue-600" />
                    <label className="text-sm font-medium">تحديثات الطلبات</label>
                  </div>
                  <Switch
                    checked={alertSettings.orderUpdates}
                    onCheckedChange={(checked) =>
                      setAlertSettings({
                        ...alertSettings,
                        orderUpdates: checked,
                      })
                    }
                  />
                </div>

                {/* Commission Notifications */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <label className="text-sm font-medium">العمولات</label>
                  </div>
                  <Switch
                    checked={alertSettings.commissionNotifications}
                    onCheckedChange={(checked) =>
                      setAlertSettings({
                        ...alertSettings,
                        commissionNotifications: checked,
                      })
                    }
                  />
                </div>

                {/* Price Drop Alerts */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-600" />
                    <label className="text-sm font-medium">انخفاض الأسعار</label>
                  </div>
                  <Switch
                    checked={alertSettings.priceDropAlerts}
                    onCheckedChange={(checked) =>
                      setAlertSettings({
                        ...alertSettings,
                        priceDropAlerts: checked,
                      })
                    }
                  />
                </div>

                {/* New Product Alerts */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-purple-600" />
                    <label className="text-sm font-medium">منتجات جديدة</label>
                  </div>
                  <Switch
                    checked={alertSettings.newProductAlerts}
                    onCheckedChange={(checked) =>
                      setAlertSettings({
                        ...alertSettings,
                        newProductAlerts: checked,
                      })
                    }
                  />
                </div>

                {/* Promotion Alerts */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <label className="text-sm font-medium">العروض الخاصة</label>
                  </div>
                  <Switch
                    checked={alertSettings.promotionAlerts}
                    onCheckedChange={(checked) =>
                      setAlertSettings({
                        ...alertSettings,
                        promotionAlerts: checked,
                      })
                    }
                  />
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold text-slate-900 mb-3">
                    طرق التنبيه
                  </h4>

                  {/* Email Notifications */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-600" />
                      <label className="text-sm">البريد الإلكتروني</label>
                    </div>
                    <Switch
                      checked={alertSettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setAlertSettings({
                          ...alertSettings,
                          emailNotifications: checked,
                        })
                      }
                    />
                  </div>

                  {/* SMS Notifications */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-slate-600" />
                      <label className="text-sm">الرسائل النصية</label>
                    </div>
                    <Switch
                      checked={alertSettings.smsNotifications}
                      onCheckedChange={(checked) =>
                        setAlertSettings({
                          ...alertSettings,
                          smsNotifications: checked,
                        })
                      }
                    />
                  </div>

                  {/* Push Notifications */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-slate-600" />
                      <label className="text-sm">إشعارات الموقع</label>
                    </div>
                    <Switch
                      checked={alertSettings.pushNotifications}
                      onCheckedChange={(checked) =>
                        setAlertSettings({
                          ...alertSettings,
                          pushNotifications: checked,
                        })
                      }
                    />
                  </div>
                </div>

                <Button 
                  onClick={() => {
                    toast.success("تم حفظ الإعدادات بنجاح");
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  حفظ الإعدادات
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Alerts List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {alerts.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Bell className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">لا توجد تنبيهات حالياً</p>
                  </CardContent>
                </Card>
              ) : (
                alerts.map((alert: any) => (
                  <Card
                    key={alert.id}
                    className={`border ${getAlertColor(alert.type)}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="mt-1">
                          {getAlertIcon(alert.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-slate-900">
                              {alert.title}
                            </h3>
                            {alert.isRead ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <Badge className="bg-blue-600">جديد</Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-700 mb-2">
                            {alert.content}
                          </p>
                          <p className="text-xs text-slate-600">
                            {new Date(alert.createdAt).toLocaleDateString("ar-JO", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {!alert.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                markAsReadMutation.mutate({ notificationId: alert.id })
                              }
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              deleteAlertMutation.mutate({ notificationId: alert.id })
                            }
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
