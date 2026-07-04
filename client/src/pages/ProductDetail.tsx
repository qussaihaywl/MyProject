import { useState } from "react";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Heart, ArrowLeft, Star, Truck, Shield, RotateCcw, Loader2, Send, User, Share2, MessageCircle, Facebook } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { getProductImages, handleImageError } from "@/lib/imageUtils";

export default function ProductDetail() {
  return (
    <>
      
      <ProductDetailContent />
    </>
  );
}

function ProductDetailContent() {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id ? parseInt(params.id) : null;
  const { isAuthenticated, user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [reviews, setReviews] = useState<any[]>([
    {
      id: 1,
      author: "فاطمة محمود",
      rating: 5,
      date: "2024-01-15",
      title: "منتج رائع جداً",
      comment: "المنتج بجودة عالية جداً وسعر مناسب. التوصيل كان سريع جداً. أنصح به بشدة!",
      helpful: 12,
    },
    {
      id: 2,
      author: "أحمد علي",
      rating: 4,
      date: "2024-01-10",
      title: "جيد جداً",
      comment: "المنتج جيد وسعره معقول. لكن الشحن استغرق وقتاً أطول من المتوقع.",
      helpful: 8,
    },
  ]);
  const [newReview, setNewReview] = useState({ rating: 5, title: "", comment: "" });

  // Fetch product
  const productQuery = trpc.products.getById.useQuery(
    { id: productId! },
    { enabled: !!productId }
  );

  // Mutations
  const addToCartMutation = trpc.cart.addItem.useMutation();

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }

    if (!productId) return;

    try {
      await addToCartMutation.mutateAsync({
        productId,
        quantity,
      });
      toast.success("تمت إضافة المنتج إلى السلة بنجاح!");
      setQuantity(1);
    } catch (error) {
      toast.error("فشل إضافة المنتج إلى السلة");
    }
  };

  const handleSubmitReview = () => {
    if (!isAuthenticated) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    if (!newReview.title.trim() || !newReview.comment.trim()) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }

    const review = {
      id: reviews.length + 1,
      author: user?.name || "مستخدم",
      rating: newReview.rating,
      date: new Date().toISOString().split("T")[0],
      title: newReview.title,
      comment: newReview.comment,
      helpful: 0,
    };

    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, title: "", comment: "" });
    toast.success("شكراً على تقييمك!");
  };

  const handleShareWhatsApp = () => {
    const text = `تحقق من هذا المنتج الرائع: ${product.name}\nالسعر: ${product.price} د.ا\nرابط المنتج: ${window.location.href}`;
    const whatsappUrl = `https://wa.me/962778989135?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShareFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `تحقق من هذا المنتج: ${product.name} - ${product.price} د.ا`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };

  if (!productId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md mx-4 bg-white shadow-lg rounded-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">المنتج غير موجود</h2>
          <Link href="/products">
            <a className="inline-block bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700 transition-all">
              العودة إلى المنتجات
            </a>
          </Link>
        </Card>
      </div>
    );
  }

  if (productQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-rose-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل المنتج...</p>
        </div>
      </div>
    );
  }

  if (!productQuery.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md mx-4 bg-white shadow-lg rounded-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">المنتج غير موجود</h2>
          <Link href="/products">
            <a className="inline-block bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700 transition-all">
              العودة إلى المنتجات
            </a>
          </Link>
        </Card>
      </div>
    );
  }

  const product = productQuery.data;
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 pb-16">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/">
              <a className="text-rose-600 hover:text-rose-700">الرئيسية</a>
            </Link>
            <span>/</span>
            <Link href="/products">
              <a className="text-rose-600 hover:text-rose-700">المنتجات</a>
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Product Image - Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <Card className="overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 h-64 sm:h-96 flex items-center justify-center shadow-lg rounded-lg relative group">
              {product.image ? (
                <>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={handleImageError}
                  />
                  <div className="absolute top-4 right-4 bg-rose-600 text-white px-3 py-1 rounded-full text-sm font-bold">جديد</div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <ShoppingBag className="w-16 h-16 text-gray-400" />
                  <span className="text-gray-500 text-sm">لا توجد صورة</span>
                </div>
              )}
            </Card>
            
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2">
              {(() => {
                const images = getProductImages(product);
                // إذا كانت هناك صورة واحدة فقط، كررها 4 مرات للعرض
                const displayImages = images.length < 4
                  ? [...images, ...Array(4 - images.length).fill(images[0])]
                  : images.slice(0, 4);

                return displayImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === i ? 'border-rose-600 shadow-lg' : 'border-gray-200 hover:border-rose-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`صورة ${i + 1}`}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  </button>
                ));
              })()}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4 sm:space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(averageRating as any)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-bold text-yellow-600">{averageRating}</span>
                <span className="text-sm text-gray-600">({reviews.length} تقييم)</span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-rose-600 to-orange-500 text-white p-6 rounded-lg shadow-lg">
              <div className="text-sm text-rose-100 mb-2">السعر</div>
              <div className="text-4xl sm:text-5xl font-bold">
                {product.price} د.ا
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-lg shadow-md border-2 border-rose-100">
              <h3 className="font-bold text-gray-900 mb-3">الوصف</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description || "لا يوجد وصف متاح"}
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-rose-600">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-5 h-5 text-rose-600" />
                  <span className="font-bold text-gray-900 text-sm">توصيل سريع</span>
                </div>
                <p className="text-xs text-gray-600">توصيل آمن وسريع</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-orange-500">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-orange-500" />
                  <span className="font-bold text-gray-900 text-sm">ضمان الجودة</span>
                </div>
                <p className="text-xs text-gray-600">جودة مضمونة 100%</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-pink-600">
                <div className="flex items-center gap-2 mb-2">
                  <RotateCcw className="w-5 h-5 text-pink-600" />
                  <span className="font-bold text-gray-900 text-sm">إرجاع سهل</span>
                </div>
                <p className="text-xs text-gray-600">سياسة إرجاع ميسرة</p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="bg-white p-6 rounded-lg shadow-md border-2 border-rose-100">
              <label className="block text-gray-900 font-bold mb-3">الكمية</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 transition-all font-bold"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center border-2 border-rose-200 rounded-lg focus:border-rose-600 focus:outline-none py-2 font-bold"
                  min="1"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 transition-all font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending}
                className="w-full bg-gradient-to-r from-rose-600 to-orange-500 text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {addToCartMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    جاري الإضافة...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    أضف إلى السلة
                  </>
                )}
              </button>

              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`w-full py-3 rounded-lg font-bold transition-all border-2 flex items-center justify-center gap-2 ${
                  isFavorite
                    ? "bg-rose-600 text-white border-rose-600"
                    : "bg-white text-rose-600 border-rose-200 hover:border-rose-600"
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
                {isFavorite ? "أضيف إلى المفضلة" : "أضف إلى المفضلة"}
              </button>

              {/* Share Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleShareWhatsApp}
                  className="w-full py-3 rounded-lg font-bold transition-all border-2 border-green-500 bg-white text-green-600 hover:bg-green-50 flex items-center justify-center gap-2"
                  title="شارك على WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm">WhatsApp</span>
                </button>

                <button
                  onClick={handleShareFacebook}
                  className="w-full py-3 rounded-lg font-bold transition-all border-2 border-blue-600 bg-white text-blue-600 hover:bg-blue-50 flex items-center justify-center gap-2"
                  title="شارك على Facebook"
                >
                  <Facebook className="w-5 h-5" />
                  <span className="text-sm">Facebook</span>
                </button>
              </div>
            </div>

            {/* Additional Info */}
            <Card className="p-6 bg-white shadow-md border-2 border-rose-100">
              <h3 className="font-bold text-gray-900 mb-4">معلومات إضافية</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between pb-3 border-b border-gray-200">
                  <span className="text-gray-600">الفئة:</span>
                  <span className="font-medium text-gray-900">
                    {product.categoryId === 1 ? "ملابس" : product.categoryId === 2 ? "أثاث" : "إكسسوارات"}
                  </span>
                </div>
                <div className="flex justify-between pb-3 border-b border-gray-200">
                  <span className="text-gray-600">الحالة:</span>
                  <span className="font-medium text-green-600">متوفر</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">رمز المنتج:</span>
                  <span className="font-medium text-gray-900">#{product.id}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">التقييمات والمراجعات</h2>

          {/* Add Review Form */}
          {isAuthenticated && (
            <Card className="p-6 bg-white shadow-lg rounded-lg border-2 border-rose-100">
              <h3 className="font-bold text-gray-900 mb-4">أضف تقييمك</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">التقييم</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="transition-all"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= newReview.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">العنوان</label>
                  <Input
                    placeholder="مثال: منتج رائع جداً"
                    value={newReview.title}
                    onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                    className="border-2 border-rose-200 focus:border-rose-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">التعليق</label>
                  <textarea
                    placeholder="شارك رأيك عن المنتج..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border-2 border-rose-200 rounded-lg focus:border-rose-600 focus:outline-none resize-none"
                  />
                </div>

                <button
                  onClick={handleSubmitReview}
                  className="w-full bg-gradient-to-r from-rose-600 to-orange-500 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  إرسال التقييم
                </button>
              </div>
            </Card>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <Card className="p-8 text-center bg-white shadow-md rounded-lg">
                <p className="text-gray-600">لا توجد تقييمات حتى الآن. كن أول من يقيم هذا المنتج!</p>
              </Card>
            ) : (
              reviews.map((review) => (
                <Card key={review.id} className="p-6 bg-white shadow-md rounded-lg border-l-4 border-rose-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold">
                        {review.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{review.author}</p>
                        <p className="text-xs text-gray-500">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <h4 className="font-bold text-gray-900 mb-2">{review.title}</h4>
                  <p className="text-gray-700 mb-3">{review.comment}</p>

                  <div className="flex items-center gap-4 pt-3 border-t border-gray-200">
                    <button className="text-sm text-gray-600 hover:text-rose-600 transition-all">
                      👍 مفيد ({review.helpful})
                    </button>
                    <button className="text-sm text-gray-600 hover:text-rose-600 transition-all">
                      👎 غير مفيد
                    </button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
