import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, Truck, MapPin, Clock, CheckCircle, AlertCircle, Phone, MessageSquare } from "lucide-react";

interface TrackingStep {
  id: string;
  title: string;
  description: string;
  status: "completed" | "current" | "pending";
  timestamp?: string;
  location?: string;
  icon: React.ReactNode;
}

export default function OrderTracking() {
  return (
    <>
      
      <OrderTrackingContent />
    </>
  );
}

function OrderTrackingContent() {
  const [, setLocation] = useLocation();
  const [trackingNumber, setTrackingNumber] = useState("ORD123456");
  const [searchTrackingNumber, setSearchTrackingNumber] = useState("");

  // Mock tracking data
  const trackingData = {
    orderNumber: "ORD123456",
    date: "2024-01-15",
    total: 450.50,
    status: "shipped",
    estimatedDelivery: "2024-01-20",
    carrier: "DHL Express",
    trackingUrl: "https://tracking.dhl.com/...",
    customer: {
      name: "أحمد محمد",
      phone: "+962 7 9876 5432",
      address: "شارع الملك عبدالله، عمّان",
    },
    steps: [
      {
        id: "1",
        title: "تم استقبال الطلب",
        description: "تم استقبال طلبك بنجاح وبدء معالجته",
        status: "completed" as const,
        timestamp: "2024-01-15 10:30 AM",
        location: "مستودع عمّان",
        icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      },
      {
        id: "2",
        title: "تم التحضير",
        description: "جاري تحضير المنتجات وتعبئتها",
        status: "completed" as const,
        timestamp: "2024-01-15 02:45 PM",
        location: "مستودع عمّان",
        icon: <Package className="w-6 h-6 text-green-600" />,
      },
      {
        id: "3",
        title: "قيد الشحن",
        description: "الطلب في الطريق إليك الآن",
        status: "current" as const,
        timestamp: "2024-01-16 08:00 AM",
        location: "الطريق السريع - عمّان",
        icon: <Truck className="w-6 h-6 text-blue-600" />,
      },
      {
        id: "4",
        title: "في محطة التوزيع",
        description: "الطلب وصل إلى محطة التوزيع المحلية",
        status: "pending" as const,
        location: "محطة التوزيع - الزرقاء",
        icon: <MapPin className="w-6 h-6 text-gray-400" />,
      },
      {
        id: "5",
        title: "سيتم التوصيل",
        description: "سيتم توصيل الطلب إليك قريباً",
        status: "pending" as const,
        location: "عنوانك",
        icon: <CheckCircle className="w-6 h-6 text-gray-400" />,
      },
    ] as TrackingStep[],
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTrackingNumber.trim()) {
      setTrackingNumber(searchTrackingNumber);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 pb-16">
      {/* Header */}
      <div className="bg-white border-b border-rose-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">تتبع الطلب</h1>
            <Link href="/dashboard">
              <a className="flex items-center gap-2 text-rose-600 hover:text-rose-700 font-semibold">
                <ArrowLeft className="w-5 h-5" />
                العودة
              </a>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <Card className="p-6 bg-white shadow-lg rounded-lg mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">البحث عن طلب</h2>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              value={searchTrackingNumber}
              onChange={(e) => setSearchTrackingNumber(e.target.value)}
              placeholder="أدخل رقم الطلب (مثال: ORD123456)"
              className="flex-1 border-2 border-rose-200 rounded-lg focus:border-rose-600 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-rose-600 to-orange-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all font-bold"
            >
              بحث
            </button>
          </form>
        </Card>

        {/* Order Summary */}
        <Card className="p-6 bg-white shadow-lg rounded-lg mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">رقم الطلب</p>
              <p className="font-bold text-gray-900">{trackingData.orderNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">تاريخ الطلب</p>
              <p className="font-bold text-gray-900">{trackingData.date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">الإجمالي</p>
              <p className="font-bold text-rose-600 text-lg">{trackingData.total.toFixed(2)} د.ا</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">التوصيل المتوقع</p>
              <p className="font-bold text-gray-900">{trackingData.estimatedDelivery}</p>
            </div>
          </div>
        </Card>

        {/* Tracking Timeline */}
        <Card className="p-8 bg-white shadow-lg rounded-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">حالة الطلب</h2>
          
          <div className="space-y-6">
            {trackingData.steps.map((step, index) => (
              <div key={step.id} className="flex gap-4">
                {/* Timeline Line */}
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    step.status === "completed"
                      ? "bg-green-100"
                      : step.status === "current"
                      ? "bg-blue-100 animate-pulse"
                      : "bg-gray-100"
                  }`}>
                    {step.icon}
                  </div>
                  {index < trackingData.steps.length - 1 && (
                    <div className={`w-1 h-16 mt-2 ${
                      step.status === "completed"
                        ? "bg-green-300"
                        : step.status === "current"
                        ? "bg-blue-300"
                        : "bg-gray-200"
                    }`}></div>
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 pt-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className={`text-lg font-bold ${
                        step.status === "completed"
                          ? "text-green-700"
                          : step.status === "current"
                          ? "text-blue-700"
                          : "text-gray-700"
                      }`}>
                        {step.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">{step.description}</p>
                      {step.location && (
                        <p className="text-gray-500 text-sm mt-2 flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {step.location}
                        </p>
                      )}
                    </div>
                    {step.timestamp && (
                      <div className="text-right">
                        <p className="text-sm text-gray-500 flex items-center gap-1 justify-end">
                          <Clock className="w-4 h-4" />
                          {step.timestamp}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Shipping Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Carrier Information */}
          <Card className="p-6 bg-white shadow-lg rounded-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">معلومات الشحن</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">شركة الشحن</p>
                <p className="font-bold text-gray-900">{trackingData.carrier}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">رقم التتبع</p>
                <p className="font-bold text-gray-900">{trackingData.orderNumber}</p>
              </div>
              <button className="w-full bg-blue-100 text-blue-700 py-2 rounded-lg hover:bg-blue-200 transition-all font-semibold text-sm">
                تتبع على موقع شركة الشحن
              </button>
            </div>
          </Card>

          {/* Recipient Information */}
          <Card className="p-6 bg-white shadow-lg rounded-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">بيانات المستقبل</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">الاسم</p>
                <p className="font-bold text-gray-900">{trackingData.customer.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">الهاتف</p>
                <p className="font-bold text-gray-900">{trackingData.customer.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">العنوان</p>
                <p className="font-bold text-gray-900">{trackingData.customer.address}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Support Section */}
        <Card className="p-6 bg-gradient-to-r from-rose-50 to-orange-50 rounded-lg border-2 border-rose-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">هل تحتاج إلى مساعدة؟</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-all border-2 border-gray-200">
              <Phone className="w-5 h-5 text-rose-600" />
              <div className="text-left">
                <p className="font-bold text-gray-900">اتصل بنا</p>
                <p className="text-sm text-gray-600">+962 6 1234 5678</p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-all border-2 border-gray-200">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <p className="font-bold text-gray-900">راسلنا</p>
                <p className="text-sm text-gray-600">الدعم الفوري متاح 24/7</p>
              </div>
            </button>
          </div>
        </Card>

        {/* Additional Actions */}
        <div className="mt-8 flex gap-4">
          <Link href="/products">
            <a className="flex-1 bg-white text-rose-600 py-3 rounded-lg border-2 border-rose-200 hover:border-rose-600 transition-all font-bold text-center">
              متابعة التسوق
            </a>
          </Link>
          <Link href="/dashboard">
            <a className="flex-1 bg-gradient-to-r from-rose-600 to-orange-500 text-white py-3 rounded-lg hover:shadow-lg transition-all font-bold text-center">
              العودة إلى لوحة التحكم
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
