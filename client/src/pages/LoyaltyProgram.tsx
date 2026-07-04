import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Star, TrendingUp, Zap, Award, Lock } from "lucide-react";

interface LoyaltyTier {
  name: string;
  minPoints: number;
  maxPoints: number;
  benefits: string[];
  color: string;
  icon: React.ReactNode;
}

export default function LoyaltyProgram() {
  const userPoints = 2450;
  const userTier = "ذهبي";
  const pointsToNextTier = 5000 - userPoints;

  const loyaltyTiers: LoyaltyTier[] = [
    {
      name: "برونزي",
      minPoints: 0,
      maxPoints: 1000,
      benefits: ["1 نقطة لكل د.ا", "خصم 5% على المنتجات", "دعم أولوي"],
      color: "from-amber-600 to-amber-700",
      icon: <Award className="w-6 h-6" />,
    },
    {
      name: "فضي",
      minPoints: 1000,
      maxPoints: 2500,
      benefits: ["1.5 نقطة لكل د.ا", "خصم 10% على المنتجات", "شحن مجاني", "هدايا خاصة"],
      color: "from-gray-400 to-gray-500",
      icon: <Star className="w-6 h-6" />,
    },
    {
      name: "ذهبي",
      minPoints: 2500,
      maxPoints: 5000,
      benefits: ["2 نقطة لكل د.ا", "خصم 15% على المنتجات", "شحن مجاني", "هدايا حصرية", "ولوج VIP"],
      color: "from-yellow-400 to-yellow-500",
      icon: <Gift className="w-6 h-6" />,
    },
    {
      name: "بلاتيني",
      minPoints: 5000,
      maxPoints: Infinity,
      benefits: ["3 نقطة لكل د.ا", "خصم 25% على المنتجات", "شحن مجاني", "هدايا VIP", "مدير حساب شخصي"],
      color: "from-blue-400 to-blue-600",
      icon: <Zap className="w-6 h-6" />,
    },
  ];

  const rewards = [
    { points: 100, reward: "خصم 10 د.ا", icon: "🎟️" },
    { points: 250, reward: "خصم 30 د.ا", icon: "🎁" },
    { points: 500, reward: "خصم 75 د.ا", icon: "🏆" },
    { points: 1000, reward: "خصم 200 د.ا", icon: "👑" },
  ];

  const recentActivities = [
    { date: "2024-01-15", action: "شراء", points: 150, description: "شراء فستان سهرة" },
    { date: "2024-01-10", action: "مكافأة", points: 50, description: "تقييم منتج" },
    { date: "2024-01-05", action: "شراء", points: 200, description: "شراء كنبة جلدية" },
    { date: "2024-01-01", action: "مكافأة", points: 100, description: "دعوة صديق" },
  ];

  return (
    <>
      
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 pb-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">برنامج الولاء</h1>
            <p className="text-white/90">اكسب النقاط مع كل عملية شراء واستمتع بالمزايا الحصرية</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* User Status Card */}
          <Card className="p-8 bg-gradient-to-br from-white to-yellow-50 shadow-xl rounded-lg mb-8 border-2 border-yellow-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Current Tier */}
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-2">المستوى الحالي</p>
                <div className="text-4xl font-bold text-yellow-600 mb-2">{userTier}</div>
                <Star className="w-8 h-8 text-yellow-500 mx-auto" />
              </div>

              {/* Current Points */}
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-2">النقاط الحالية</p>
                <div className="text-4xl font-bold text-orange-600">{userPoints}</div>
                <p className="text-sm text-gray-600 mt-2">نقطة</p>
              </div>

              {/* Points to Next Tier */}
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-2">النقاط المتبقية</p>
                <div className="text-4xl font-bold text-red-600">{pointsToNextTier}</div>
                <p className="text-sm text-gray-600 mt-2">للمستوى البلاتيني</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">التقدم نحو المستوى البلاتيني</span>
                <span className="text-sm font-bold text-orange-600">{Math.round((userPoints / 5000) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all"
                  style={{ width: `${Math.min((userPoints / 5000) * 100, 100)}%` }}
                />
              </div>
            </div>
          </Card>

          {/* Loyalty Tiers */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">مستويات الولاء</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {loyaltyTiers.map((tier) => (
                <Card
                  key={tier.name}
                  className={`p-6 bg-gradient-to-br ${tier.color} text-white rounded-lg shadow-lg hover:shadow-xl transition-all ${
                    tier.name === userTier ? "ring-4 ring-white" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">{tier.name}</h3>
                    {tier.icon}
                  </div>

                  <p className="text-sm text-white/80 mb-4">
                    {tier.minPoints} - {tier.maxPoints === Infinity ? "∞" : tier.maxPoints} نقطة
                  </p>

                  <div className="space-y-2">
                    {tier.benefits.map((benefit) => (
                      <div key={benefit} className="flex items-start gap-2">
                        <span className="text-lg">✓</span>
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {tier.name === userTier && (
                    <div className="mt-4 pt-4 border-t border-white/30">
                      <span className="inline-block bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold">
                        مستواك الحالي
                      </span>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* Rewards Catalog */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">كتالوج المكافآت</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {rewards.map((reward) => (
                <Card key={reward.points} className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition-all">
                  <div className="text-4xl mb-3">{reward.icon}</div>
                  <p className="text-2xl font-bold text-orange-600 mb-2">{reward.points}</p>
                  <p className="text-sm text-gray-600 mb-4">نقطة</p>
                  <p className="font-semibold text-gray-900 mb-4">{reward.reward}</p>
                  <button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-2 rounded-lg hover:shadow-lg transition-all font-bold">
                    استبدال
                  </button>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">النشاط الأخير</h2>
            <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                    <tr>
                      <th className="px-6 py-3 text-right font-bold">التاريخ</th>
                      <th className="px-6 py-3 text-right font-bold">الإجراء</th>
                      <th className="px-6 py-3 text-right font-bold">النقاط</th>
                      <th className="px-6 py-3 text-right font-bold">الوصف</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivities.map((activity, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-6 py-3 text-gray-900">{activity.date}</td>
                        <td className="px-6 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              activity.action === "شراء"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {activity.action}
                          </span>
                        </td>
                        <td className="px-6 py-3 font-bold text-orange-600">+{activity.points}</td>
                        <td className="px-6 py-3 text-gray-600">{activity.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* How It Works */}
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg rounded-lg border-2 border-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">كيف يعمل البرنامج؟</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="font-bold text-gray-900 mb-2">اشتر المنتجات</h3>
                <p className="text-gray-600 text-sm">اشتر أي منتج واكسب نقاط بناءً على المبلغ</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="font-bold text-gray-900 mb-2">اجمع النقاط</h3>
                <p className="text-gray-600 text-sm">اجمع النقاط من الشراء والنشاطات الأخرى</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="font-bold text-gray-900 mb-2">استبدل المكافآت</h3>
                <p className="text-gray-600 text-sm">استبدل النقاط بخصومات وهدايا حصرية</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
