import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Heart, TrendingUp, Zap, Award } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

interface RecommendedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  discount?: number;
  reason: string;
  icon: React.ReactNode;
}

export default function Recommendations() {
  const [favorites, setFavorites] = useState<string[]>([]);

  const recommendations: RecommendedProduct[] = [
    {
      id: "R001",
      name: "فستان سهرة أسود فاخر",
      price: 250,
      image: "https://via.placeholder.com/200",
      category: "الملابس",
      rating: 4.8,
      reviews: 156,
      discount: 20,
      reason: "الأكثر مبيعاً في فئتك المفضلة",
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      id: "R002",
      name: "كنبة جلدية حمراء",
      price: 1200,
      image: "https://via.placeholder.com/200",
      category: "الأثاث",
      rating: 4.9,
      reviews: 89,
      discount: 15,
      reason: "يشتريها العملاء الذين اشتروا مثل منتجاتك",
      icon: <Award className="w-5 h-5" />,
    },
    {
      id: "R003",
      name: "حقيبة يد ذهبية",
      price: 180,
      image: "https://via.placeholder.com/200",
      category: "الإكسسوارات",
      rating: 4.7,
      reviews: 234,
      reason: "يتطابق مع أسلوبك",
      icon: <Zap className="w-5 h-5" />,
    },
    {
      id: "R004",
      name: "فستان سهرة أحمر",
      price: 280,
      image: "https://via.placeholder.com/200",
      category: "الملابس",
      rating: 4.6,
      reviews: 178,
      discount: 10,
      reason: "عرض خاص لك اليوم",
      icon: <Zap className="w-5 h-5" />,
    },
    {
      id: "R005",
      name: "طاولة قهوة حديثة",
      price: 350,
      image: "https://via.placeholder.com/200",
      category: "الأثاث",
      rating: 4.5,
      reviews: 92,
      reason: "يكمل ديكورك",
      icon: <Award className="w-5 h-5" />,
    },
    {
      id: "R006",
      name: "أقراط فضية",
      price: 95,
      image: "https://via.placeholder.com/200",
      category: "الإكسسوارات",
      rating: 4.8,
      reviews: 312,
      discount: 25,
      reason: "الأكثر شهرة هذا الأسبوع",
      icon: <TrendingUp className="w-5 h-5" />,
    },
  ];

  const handleAddToCart = (product: RecommendedProduct) => {
    toast.success(`تم إضافة ${product.name} إلى السلة`);
  };

  const handleToggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((fav) => fav !== id));
      toast.info("تم إزالة من المفضلة");
    } else {
      setFavorites([...favorites, id]);
      toast.success("تم إضافة إلى المفضلة");
    }
  };

  return (
    <>
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 pb-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">التوصيات الذكية</h1>
            <p className="text-white/90">منتجات مختارة خصيصاً لك بناءً على تفضيلاتك وسلوكك</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <h3 className="font-bold text-gray-900">الأكثر شهرة</h3>
              </div>
              <p className="text-sm text-gray-700">منتجات تحظى بإعجاب العملاء</p>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-6 h-6 text-green-600" />
                <h3 className="font-bold text-gray-900">مختارة لك</h3>
              </div>
              <p className="text-sm text-gray-700">بناءً على سجل تصفحك</p>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-6 h-6 text-orange-600" />
                <h3 className="font-bold text-gray-900">عروض خاصة</h3>
              </div>
              <p className="text-sm text-gray-700">خصومات حصرية لك اليوم</p>
            </Card>
          </div>

          {/* Recommendations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all rounded-lg"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-100 overflow-hidden group">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {product.discount && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      -{product.discount}%
                    </div>
                  )}
                  <button
                    onClick={() => handleToggleFavorite(product.id)}
                    className={`absolute top-2 left-2 p-2 rounded-full transition-all ${
                      favorites.includes(product.id)
                        ? "bg-red-500 text-white"
                        : "bg-white/80 text-gray-600 hover:bg-white"
                    }`}
                  >
                    <Heart className="w-5 h-5" fill={favorites.includes(product.id) ? "currentColor" : "none"} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Reason */}
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200">
                    {product.icon}
                    <span className="text-xs font-semibold text-purple-600">{product.reason}</span>
                  </div>

                  {/* Category */}
                  <p className="text-xs text-gray-500 mb-1">{product.category}</p>

                  {/* Name */}
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
                    <span className="text-xs text-gray-500">({product.reviews})</span>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-purple-600">{product.price} د.ا</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:shadow-lg transition-all font-bold flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      إضافة
                    </button>
                    <Link href={`/product/${product.id}`}>
                      <a className="flex-1 border-2 border-purple-600 text-purple-600 py-2 rounded-lg hover:bg-purple-50 transition-all font-bold">
                        عرض
                      </a>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* How It Works */}
          <Card className="mt-12 p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">كيف نختار التوصيات لك؟</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                  1
                </div>
                <h3 className="font-bold text-gray-900 mb-2">تحليل السلوك</h3>
                <p className="text-sm text-gray-600">نحلل تاريخ تصفحك وعمليات الشراء السابقة</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                  2
                </div>
                <h3 className="font-bold text-gray-900 mb-2">المقارنة مع العملاء</h3>
                <p className="text-sm text-gray-600">نقارن تفضيلاتك مع عملاء آخرين</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                  3
                </div>
                <h3 className="font-bold text-gray-900 mb-2">التقييمات والمراجعات</h3>
                <p className="text-sm text-gray-600">نأخذ بعين الاعتبار تقييمات المنتجات</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                  4
                </div>
                <h3 className="font-bold text-gray-900 mb-2">الاتجاهات الحالية</h3>
                <p className="text-sm text-gray-600">نتابع أحدث الاتجاهات والعروض</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
