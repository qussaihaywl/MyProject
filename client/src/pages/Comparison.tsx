import { useState } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Check, ArrowLeft, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface ComparisonProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  stock: number;
  color: string;
  size: string;
  material: string;
  warranty: string;
  inStock: boolean;
}

export default function Comparison() {
  const [products, setProducts] = useState<ComparisonProduct[]>([
    {
      id: "P001",
      name: "فستان سهرة أسود",
      price: 250,
      image: "https://via.placeholder.com/200",
      category: "الملابس",
      rating: 4.5,
      stock: 15,
      color: "أسود",
      size: "M, L, XL",
      material: "حرير طبيعي",
      warranty: "ضمان سنة واحدة",
      inStock: true,
    },
    {
      id: "P002",
      name: "فستان سهرة أحمر",
      price: 280,
      image: "https://via.placeholder.com/200",
      category: "الملابس",
      rating: 4.8,
      stock: 8,
      color: "أحمر",
      size: "S, M, L",
      material: "قطن مخلوط",
      warranty: "ضمان سنة واحدة",
      inStock: true,
    },
    {
      id: "P003",
      name: "فستان سهرة ذهبي",
      price: 320,
      image: "https://via.placeholder.com/200",
      category: "الملابس",
      rating: 5,
      stock: 0,
      color: "ذهبي",
      size: "M, L",
      material: "حرير خالص",
      warranty: "ضمان سنتان",
      inStock: false,
    },
  ]);

  const handleRemoveProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
    toast.success("تم إزالة المنتج من المقارنة");
  };

  const handleAddToCart = (product: ComparisonProduct) => {
    if (!product.inStock) {
      toast.error("المنتج غير متوفر حالياً");
      return;
    }
    toast.success(`تم إضافة ${product.name} إلى السلة`);
  };

  const specs = [
    { label: "السعر", key: "price" },
    { label: "التقييم", key: "rating" },
    { label: "المخزون", key: "stock" },
    { label: "اللون", key: "color" },
    { label: "الأحجام", key: "size" },
    { label: "المادة", key: "material" },
    { label: "الضمان", key: "warranty" },
  ];

  return (
    <>
      
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 pb-16">
        {/* Header */}
        <div className="bg-white border-b border-rose-100 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">مقارنة المنتجات</h1>
              <Link href="/products">
                <a className="flex items-center gap-2 text-rose-600 hover:text-rose-700 font-semibold">
                  <ArrowLeft className="w-5 h-5" />
                  العودة
                </a>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {products.length === 0 ? (
            <Card className="p-12 bg-white shadow-lg rounded-lg text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">لا توجد منتجات للمقارنة</h2>
              <p className="text-gray-600 mb-6">أضف منتجات من صفحة المنتجات لمقارنتها</p>
              <Link href="/products">
                <a className="inline-block bg-gradient-to-r from-rose-600 to-orange-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-bold">
                  تصفح المنتجات
                </a>
              </Link>
            </Card>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-rose-600 to-orange-500 text-white">
                    <th className="p-4 text-right font-bold">المواصفات</th>
                    {products.map((product) => (
                      <th key={product.id} className="p-4 text-center font-bold min-w-[200px]">
                        <div className="relative">
                          <button
                            onClick={() => handleRemoveProduct(product.id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-32 object-cover rounded-lg mb-2"
                          />
                          <h3 className="font-bold text-sm">{product.name}</h3>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {specs.map((spec, idx) => (
                    <tr key={spec.key} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-4 font-semibold text-gray-900 border-r border-gray-200">
                        {spec.label}
                      </td>
                      {products.map((product) => (
                        <td key={product.id} className="p-4 text-center border-r border-gray-200">
                          {spec.key === "price" && (
                            <span className="text-lg font-bold text-rose-600">
                              {product.price} د.ا
                            </span>
                          )}
                          {spec.key === "rating" && (
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-yellow-500">★</span>
                              <span className="font-bold">{product.rating}</span>
                            </div>
                          )}
                          {spec.key === "stock" && (
                            <span
                              className={`px-3 py-1 rounded-full font-semibold ${
                                product.stock > 0
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {product.stock > 0 ? `${product.stock} متوفر` : "غير متوفر"}
                            </span>
                          )}
                          {spec.key === "color" && <span>{product.color}</span>}
                          {spec.key === "size" && <span className="text-sm">{product.size}</span>}
                          {spec.key === "material" && <span>{product.material}</span>}
                          {spec.key === "warranty" && <span className="text-sm">{product.warranty}</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {/* Action Row */}
                  <tr className="bg-gradient-to-r from-rose-50 to-orange-50 border-t-2 border-rose-200">
                    <td className="p-4 font-semibold text-gray-900">الإجراءات</td>
                    {products.map((product) => (
                      <td key={product.id} className="p-4 text-center border-r border-gray-200">
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={!product.inStock}
                          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                            product.inStock
                              ? "bg-gradient-to-r from-rose-600 to-orange-500 text-white hover:shadow-lg"
                              : "bg-gray-200 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          إضافة للسلة
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Recommendations */}
          {products.length > 0 && (
            <Card className="mt-8 p-6 bg-white shadow-lg rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">التوصيات</h3>
              <div className="space-y-2">
                {products
                  .sort((a, b) => b.rating - a.rating)
                  .slice(0, 1)
                  .map((product) => (
                    <div
                      key={product.id}
                      className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Check className="w-5 h-5 text-green-600" />
                        <span className="font-bold text-green-900">الخيار الأفضل</span>
                      </div>
                      <p className="text-gray-700">
                        <strong>{product.name}</strong> هو الخيار الأفضل بتقييم {product.rating} نجمة
                      </p>
                    </div>
                  ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
