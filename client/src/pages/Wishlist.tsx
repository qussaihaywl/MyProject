import { useState } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, ShoppingCart, ArrowLeft, Share2 } from "lucide-react";
import { toast } from "sonner";

interface WishlistItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  image: string;
  category: string;
  addedDate: string;
  inStock: boolean;
}

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    {
      id: "1",
      productId: "P001",
      productName: "فستان سهرة أسود",
      price: 250,
      image: "https://via.placeholder.com/200",
      category: "الملابس",
      addedDate: "2024-01-15",
      inStock: true,
    },
    {
      id: "2",
      productId: "P002",
      productName: "كنبة جلدية بنية",
      price: 1500,
      image: "https://via.placeholder.com/200",
      category: "الأثاث",
      addedDate: "2024-01-10",
      inStock: true,
    },
    {
      id: "3",
      productId: "P003",
      productName: "عقد ذهبي فاخر",
      price: 800,
      image: "https://via.placeholder.com/200",
      category: "الإكسسوارات",
      addedDate: "2024-01-05",
      inStock: false,
    },
  ]);

  const handleRemoveFromWishlist = (id: string) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id));
    toast.success("تم إزالة المنتج من المفضلة");
  };

  const handleAddToCart = (item: WishlistItem) => {
    if (!item.inStock) {
      toast.error("المنتج غير متوفر حالياً");
      return;
    }
    toast.success(`تم إضافة ${item.productName} إلى السلة`);
  };

  const handleShare = (item: WishlistItem) => {
    const shareText = `تحقق من هذا المنتج: ${item.productName} - ${item.price} د.ا`;
    if (navigator.share) {
      navigator.share({
        title: "Rose Online",
        text: shareText,
        url: window.location.href,
      });
    } else {
      toast.success("تم نسخ رابط المشاركة");
    }
  };

  const totalValue = wishlistItems.reduce((sum, item) => sum + item.price, 0);
  const inStockCount = wishlistItems.filter((item) => item.inStock).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">المفضلة</h1>
              <Link href="/products">
                <a className="flex items-center gap-2 text-rose-600 hover:text-rose-700 font-semibold">
                  <ArrowLeft className="w-5 h-5" />
                  العودة
                </a>
              </Link>
            </div>
          </div>
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="p-6 bg-white shadow-lg rounded-lg">
              <p className="text-gray-600 text-sm mb-1">إجمالي المفضلة</p>
              <p className="text-3xl font-bold text-rose-600">{wishlistItems.length}</p>
            </Card>
            <Card className="p-6 bg-white shadow-lg rounded-lg">
              <p className="text-gray-600 text-sm mb-1">المتوفرة</p>
              <p className="text-3xl font-bold text-green-600">{inStockCount}</p>
            </Card>
            <Card className="p-6 bg-white shadow-lg rounded-lg">
              <p className="text-gray-600 text-sm mb-1">القيمة الإجمالية</p>
              <p className="text-3xl font-bold text-blue-600">{totalValue.toFixed(2)} د.ا</p>
            </Card>
          </div>

          {/* Wishlist Items */}
          {wishlistItems.length === 0 ? (
            <Card className="p-12 bg-white shadow-lg rounded-lg text-center">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">لا توجد منتجات مفضلة</h2>
              <p className="text-gray-600 mb-6">ابدأ بإضافة منتجاتك المفضلة الآن</p>
              <Link href="/products">
                <a className="inline-block bg-gradient-to-r from-rose-600 to-orange-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-bold">
                  تصفح المنتجات
                </a>
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {wishlistItems.map((item) => (
                <Card key={item.id} className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition-all">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    {/* Product Image */}
                    <div className="md:col-span-1">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{item.productName}</h3>
                      <p className="text-sm text-gray-600 mb-2">الفئة: {item.category}</p>
                      <p className="text-sm text-gray-500">
                        تاريخ الإضافة: {new Date(item.addedDate).toLocaleDateString("ar-JO")}
                      </p>
                      <div className="mt-2">
                        {item.inStock ? (
                          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                            متوفر
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                            غير متوفر
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price and Actions */}
                    <div className="md:col-span-1 flex flex-col items-end gap-3">
                      <p className="text-2xl font-bold text-rose-600">{item.price.toFixed(2)} د.ا</p>
                      <div className="flex gap-2 w-full">
                        <button
                          onClick={() => handleShare(item)}
                          className="flex-1 flex items-center justify-center gap-2 bg-blue-100 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-200 transition-all font-semibold text-sm"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveFromWishlist(item.id)}
                          className="flex-1 flex items-center justify-center gap-2 bg-red-100 text-red-600 px-3 py-2 rounded-lg hover:bg-red-200 transition-all font-semibold text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.inStock}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                          item.inStock
                            ? "bg-gradient-to-r from-rose-600 to-orange-500 text-white hover:shadow-lg"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        إضافة للسلة
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          {wishlistItems.length > 0 && (
            <div className="mt-8 flex gap-4">
              <Link href="/products">
                <a className="flex-1 bg-white text-rose-600 py-3 rounded-lg border-2 border-rose-200 hover:border-rose-600 transition-all font-bold text-center">
                  متابعة التسوق
                </a>
              </Link>
              <button className="flex-1 bg-gradient-to-r from-rose-600 to-orange-500 text-white py-3 rounded-lg hover:shadow-lg transition-all font-bold">
                إضافة الكل للسلة
              </button>
            </div>
          )}
        </div>
    </div>
  );
}
