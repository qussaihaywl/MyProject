import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Gift, Percent, Calendar, Tag } from "lucide-react";
import { toast } from "sonner";

interface Coupon {
  id: string;
  code: string;
  discount: number;
  discountType: "percentage" | "fixed";
  description: string;
  minPurchase: number;
  maxDiscount?: number;
  expiryDate: string;
  usageCount: number;
  maxUsage: number;
  categories: string[];
  isActive: boolean;
}

export default function Coupons() {
  const [coupons] = useState<Coupon[]>([
    {
      id: "1",
      code: "WELCOME10",
      discount: 10,
      discountType: "percentage",
      description: "خصم 10% على أول عملية شراء",
      minPurchase: 0,
      maxDiscount: 100,
      expiryDate: "2024-12-31",
      usageCount: 245,
      maxUsage: 1000,
      categories: ["الملابس", "الأثاث", "الإكسسوارات"],
      isActive: true,
    },
    {
      id: "2",
      code: "SAVE20",
      discount: 20,
      discountType: "percentage",
      description: "خصم 20% على الملابس",
      minPurchase: 100,
      maxDiscount: 200,
      expiryDate: "2024-11-30",
      usageCount: 512,
      maxUsage: 500,
      categories: ["الملابس"],
      isActive: true,
    },
    {
      id: "3",
      code: "FURNITURE50",
      discount: 50,
      discountType: "fixed",
      description: "خصم 50 د.ا على الأثاث",
      minPurchase: 500,
      expiryDate: "2024-10-31",
      usageCount: 89,
      maxUsage: 200,
      categories: ["الأثاث"],
      isActive: false,
    },
    {
      id: "4",
      code: "SUMMER30",
      discount: 30,
      discountType: "percentage",
      description: "خصم 30% على جميع المنتجات",
      minPurchase: 200,
      maxDiscount: 300,
      expiryDate: "2024-08-31",
      usageCount: 1200,
      maxUsage: 1500,
      categories: ["الملابس", "الأثاث", "الإكسسوارات"],
      isActive: true,
    },
    {
      id: "5",
      code: "VIPONLY",
      discount: 15,
      discountType: "percentage",
      description: "خصم 15% للعملاء المميزين",
      minPurchase: 300,
      maxDiscount: 250,
      expiryDate: "2024-12-31",
      usageCount: 156,
      maxUsage: 300,
      categories: ["الملابس", "الأثاث", "الإكسسوارات"],
      isActive: true,
    },
  ]);

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success("تم نسخ الكود");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date();
  };

  const isLimitReached = (coupon: Coupon) => {
    return coupon.usageCount >= coupon.maxUsage;
  };

  const activeCoupons = coupons.filter((c) => c.isActive && !isExpired(c.expiryDate));
  const expiredCoupons = coupons.filter((c) => isExpired(c.expiryDate));
  const inactiveCoupons = coupons.filter((c) => !c.isActive);

  return (
    <>
      
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 pb-16">
        {/* Header */}
        <div className="bg-white border-b border-rose-100 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">الكوبونات والخصومات</h1>
            <p className="text-gray-600 mt-1">استخدم الكوبونات التالية للحصول على خصومات مميزة</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Active Coupons */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Gift className="w-6 h-6 text-rose-600" />
              الكوبونات النشطة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeCoupons.map((coupon) => (
                <Card
                  key={coupon.id}
                  className="p-6 bg-gradient-to-br from-white to-rose-50 shadow-lg rounded-lg border-2 border-rose-200 hover:shadow-xl transition-all"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{coupon.description}</h3>
                      <p className="text-sm text-gray-600 mt-1">الكود: {coupon.code}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-rose-600">
                        {coupon.discount}
                        {coupon.discountType === "percentage" ? "%" : " د.ا"}
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4 pb-4 border-b border-rose-200">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Tag className="w-4 h-4 text-gray-500" />
                      <span>الحد الأدنى للشراء: {coupon.minPurchase} د.ا</span>
                    </div>
                    {coupon.maxDiscount && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Percent className="w-4 h-4 text-gray-500" />
                        <span>الحد الأقصى للخصم: {coupon.maxDiscount} د.ا</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>ينتهي في: {new Date(coupon.expiryDate).toLocaleDateString("ar-JO")}</span>
                    </div>
                  </div>

                  {/* Usage */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700">الاستخدام</span>
                      <span className="text-sm text-gray-600">
                        {coupon.usageCount} / {coupon.maxUsage}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-rose-600 to-orange-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.min((coupon.usageCount / coupon.maxUsage) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-600 mb-2">الفئات المطبقة:</p>
                    <div className="flex flex-wrap gap-2">
                      {coupon.categories.map((cat) => (
                        <span
                          key={cat}
                          className="px-2 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-semibold"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopyCoupon(coupon.code)}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold transition-all ${
                      copiedCode === coupon.code
                        ? "bg-green-600 text-white"
                        : "bg-gradient-to-r from-rose-600 to-orange-500 text-white hover:shadow-lg"
                    }`}
                  >
                    {copiedCode === coupon.code ? (
                      <>
                        <Check className="w-5 h-5" />
                        تم النسخ
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        نسخ الكود
                      </>
                    )}
                  </button>
                </Card>
              ))}
            </div>
          </div>

          {/* Expired Coupons */}
          {expiredCoupons.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">الكوبونات المنتهية</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {expiredCoupons.map((coupon) => (
                  <Card key={coupon.id} className="p-6 bg-gray-100 rounded-lg opacity-60">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-700">{coupon.description}</h3>
                        <p className="text-sm text-gray-600 mt-1">الكود: {coupon.code}</p>
                      </div>
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                        منتهي
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Statistics */}
          <Card className="p-6 bg-white shadow-lg rounded-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">الإحصائيات</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-600 text-sm font-semibold mb-1">الكوبونات النشطة</p>
                <p className="text-3xl font-bold text-blue-700">{activeCoupons.length}</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-red-600 text-sm font-semibold mb-1">الكوبونات المنتهية</p>
                <p className="text-3xl font-bold text-red-700">{expiredCoupons.length}</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-yellow-600 text-sm font-semibold mb-1">الكوبونات المعطلة</p>
                <p className="text-3xl font-bold text-yellow-700">{inactiveCoupons.length}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-green-600 text-sm font-semibold mb-1">إجمالي الكوبونات</p>
                <p className="text-3xl font-bold text-green-700">{coupons.length}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
