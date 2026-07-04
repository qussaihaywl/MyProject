import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingBag, Trash2, ArrowLeft, Plus, Minus, Loader2, Heart, Share2, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function Cart() {
  return (
    <>
      
      <CartContent />
    </>
  );
}

function CartContent() {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [savedItems, setSavedItems] = useState<number[]>([]);

  // Queries
  const cartQuery = trpc.cart.getItems.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Mutations
  const removeItemMutation = trpc.cart.removeItem.useMutation();
  const updateQuantityMutation = trpc.cart.updateQuantity.useMutation();

  useEffect(() => {
    if (cartQuery.data) {
      setCartItems(cartQuery.data);
    }
  }, [cartQuery.data]);

  // Load saved items from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("savedItems");
    if (saved) {
      setSavedItems(JSON.parse(saved));
    }
  }, []);

  const handleRemoveItem = async (cartItemId: number) => {
    try {
      await removeItemMutation.mutateAsync({ cartItemId });
      setCartItems(cartItems.filter((item) => item.id !== cartItemId));
      toast.success("تمت إزالة المنتج من السلة");
    } catch (error) {
      toast.error("فشل إزالة المنتج");
    }
  };

  const handleUpdateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      await updateQuantityMutation.mutateAsync({ cartItemId, quantity: newQuantity });
      setCartItems(
        cartItems.map((item) =>
          item.id === cartItemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      toast.error("فشل تحديث الكمية");
    }
  };

  const handleSaveForLater = (productId: number) => {
    const newSaved = savedItems.includes(productId)
      ? savedItems.filter((id) => id !== productId)
      : [...savedItems, productId];
    setSavedItems(newSaved);
    localStorage.setItem("savedItems", JSON.stringify(newSaved));
    toast.success(
      savedItems.includes(productId)
        ? "تمت إزالة المنتج من المحفوظات"
        : "تم حفظ المنتج للاحقاً"
    );
  };

  const handleApplyPromoCode = () => {
    if (!promoCode.trim()) {
      toast.error("يرجى إدخال كود الخصم");
      return;
    }

    // محاكاة التحقق من كود الخصم
    if (promoCode === "WELCOME10") {
      setDiscount(10);
      toast.success("تم تطبيق كود الخصم بنجاح!");
    } else if (promoCode === "SAVE20") {
      setDiscount(20);
      toast.success("تم تطبيق كود الخصم بنجاح!");
    } else {
      toast.error("كود الخصم غير صحيح");
      setDiscount(0);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-12">
          <Card className="p-6 sm:p-8 lg:p-12 text-center max-w-md mx-auto bg-white shadow-lg rounded-lg">
            <ShoppingBag className="w-16 h-16 text-rose-400 mx-auto mb-4" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">يجب تسجيل الدخول أولاً</h2>
            <p className="text-gray-600 mb-6">يرجى تسجيل الدخول لعرض سلة التسوق</p>
            <Link href="/login">
              <a className="inline-block bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700 transition-all">
                تسجيل الدخول
              </a>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = (subtotal * discount) / 100;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const tax = subtotalAfterDiscount * 0.16;
  const shipping = subtotal > 500 ? 0 : 50; // شحن مجاني للطلبات فوق 500 د.ا
  const total = subtotalAfterDiscount + tax + shipping;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 pb-16">
      {/* Page Title */}
      <div className="bg-gradient-to-r from-rose-600 via-orange-500 to-rose-600 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">سلة التسوق</h1>
          <p className="text-rose-100 text-sm sm:text-base">استعرض المنتجات المختارة وأكمل عملية الشراء</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        {/* Free Shipping Info */}
        {subtotal > 0 && subtotal < 500 && (
          <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-600 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-green-800">
                أضف {(500 - subtotal).toFixed(0)} د.ا أخرى للحصول على شحن مجاني!
              </p>
              <p className="text-xs text-green-700 mt-1">الشحن المجاني للطلبات التي تزيد عن 500 د.ا</p>
            </div>
          </div>
        )}

        {cartQuery.isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-rose-600 animate-spin" />
          </div>
        ) : cartItems.length === 0 ? (
          <Card className="p-8 sm:p-12 text-center bg-white shadow-lg rounded-lg">
            <ShoppingBag className="w-16 h-16 text-rose-400 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">السلة فارغة</h3>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">لم تضف أي منتجات إلى السلة بعد</p>
            <Link href="/products">
              <a className="inline-block bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700 transition-all">
                تصفح المنتجات
              </a>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card
                  key={item.id}
                  className="p-4 sm:p-6 bg-white shadow-md hover:shadow-lg transition-all rounded-lg border-2 border-rose-100"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform"
                        />
                      ) : (
                        <ShoppingBag className="w-8 h-8 text-gray-400" />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${item.productId}`}>
                        <a className="block">
                          <h3 className="font-bold text-gray-900 text-sm sm:text-base hover:text-rose-600 transition-colors line-clamp-2">
                            {item.name}
                          </h3>
                        </a>
                      </Link>
                      <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-1">{item.description}</p>

                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-sm sm:text-base font-bold text-rose-600">
                          {item.price} د.ا
                        </span>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-rose-100 rounded transition-all"
                            title="تقليل الكمية"
                          >
                            <Minus className="w-4 h-4 text-gray-600" />
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-8 sm:w-10 text-center border-0 bg-transparent focus:outline-none font-bold"
                            min="1"
                          />
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-rose-100 rounded transition-all"
                            title="زيادة الكمية"
                          >
                            <Plus className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveForLater(item.productId)}
                            className={`p-2 rounded-lg transition-all ${
                              savedItems.includes(item.productId)
                                ? "bg-red-100 text-red-600"
                                : "hover:bg-gray-100 text-gray-600"
                            }`}
                            title="حفظ للاحقاً"
                          >
                            <Heart className={`w-5 h-5 ${savedItems.includes(item.productId) ? "fill-current" : ""}`} />
                          </button>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-all"
                            title="حذف من السلة"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <span className="text-xs sm:text-sm text-gray-600">
                          الإجمالي: <span className="font-bold text-rose-600">{(item.price * item.quantity).toFixed(2)} د.ا</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              {/* Promo Code */}
              <Card className="p-4 sm:p-6 bg-white shadow-lg rounded-lg border-2 border-rose-100">
                <h3 className="font-bold text-gray-900 mb-3 text-sm">كود الخصم</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="أدخل كود الخصم"
                    className="flex-1 px-3 py-2 border-2 border-rose-200 rounded-lg focus:border-rose-600 focus:outline-none text-sm"
                  />
                  <button
                    onClick={handleApplyPromoCode}
                    className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-all text-sm font-semibold"
                  >
                    تطبيق
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">جرب: WELCOME10 أو SAVE20</p>
              </Card>

              {/* Order Summary Card */}
              <Card className="p-4 sm:p-6 bg-white shadow-lg rounded-lg border-2 border-rose-100 sticky top-24">
                <h2 className="font-bold text-gray-900 mb-4 pb-3 border-b-2 border-rose-100">
                  ملخص الطلب
                </h2>

                <div className="space-y-3 mb-4 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>المجموع الفرعي:</span>
                    <span className="font-medium">{subtotal.toFixed(2)} د.ا</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>الخصم ({discount}%):</span>
                      <span className="font-medium">-{discountAmount.toFixed(2)} د.ا</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>الضريبة (16%):</span>
                    <span className="font-medium">{tax.toFixed(2)} د.ا</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>الشحن:</span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-green-600 font-bold">مجاني</span>
                      ) : (
                        `${shipping.toFixed(2)} د.ا`
                      )}
                    </span>
                  </div>
                  <div className="border-t-2 border-rose-100 pt-3 flex justify-between text-base font-bold">
                    <span className="text-gray-900">الإجمالي:</span>
                    <span className="bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent">
                      {total.toFixed(2)} د.ا
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href="/checkout">
                    <a className="block w-full bg-gradient-to-r from-rose-600 to-orange-500 text-white py-3 rounded-lg font-bold text-center hover:shadow-lg transition-all">
                      متابعة الشراء
                    </a>
                  </Link>
                  <Link href="/products">
                    <a className="block w-full bg-white text-rose-600 border-2 border-rose-200 py-3 rounded-lg font-bold text-center hover:bg-rose-50 transition-all">
                      متابعة التسوق
                    </a>
                  </Link>
                </div>

                {/* Info Box */}
                <div className="mt-4 p-3 bg-rose-50 rounded-lg border-l-4 border-rose-600">
                  <p className="text-xs text-gray-700">
                    <span className="font-bold text-rose-600">ملاحظة:</span> يمكنك تعديل الكميات أو حذف المنتجات قبل الشراء
                  </p>
                </div>
              </Card>

              {/* Saved Items */}
              {savedItems.length > 0 && (
                <Card className="p-4 sm:p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <h3 className="font-bold text-blue-900 mb-2 text-sm">المنتجات المحفوظة</h3>
                  <p className="text-xs text-blue-700">لديك {savedItems.length} منتج محفوظ للاحقاً</p>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
