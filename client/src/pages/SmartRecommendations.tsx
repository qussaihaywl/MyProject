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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Sparkles,
  TrendingUp,
  Heart,
  ShoppingCart,
  Eye,
  Star,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

export default function SmartRecommendations() {
  const { user } = useAuth();

  // Mutations
  const addToCartMutation = trpc.cart.addItem.useMutation();
  const addToFavoritesMutation = trpc.favorites.addItem.useMutation();

  // Fetch recommendations
  const { data: recommendationsData } = trpc.recommendations.getForUser.useQuery();

  // Fetch trending products
  const { data: trendingData } = trpc.products.getTrending.useQuery();

  // Fetch similar products
  const { data: similarData } = trpc.products.getSimilar.useQuery({
    productId: 1,
  });

  const recommendations = recommendationsData || [];
  const trendingProducts = trendingData || [];
  const similarProducts = similarData || [];

  const addToCart = async (productId: number) => {
    try {
      addToCartMutation.mutate({
        productId,
        quantity: 1,
      });
      toast.success("تم إضافة المنتج إلى السلة");
    } catch (error) {
      toast.error("فشل إضافة المنتج");
    }
  };

  const addToFavorites = async (productId: number) => {
    try {
      addToFavoritesMutation.mutate({
        productId,
      });
      toast.success("تم إضافة المنتج إلى المفضلة");
    } catch (error) {
      toast.error("فشل إضافة المنتج");
    }
  };

  const ProductCard = ({ product, reason }: { product: any; reason?: string }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="mb-4 bg-slate-100 rounded-lg h-40 flex items-center justify-center">
          <Eye className="w-8 h-8 text-slate-400" />
        </div>

        {reason && (
          <Badge className="mb-2 bg-blue-100 text-blue-800">
            <Sparkles className="w-3 h-3 mr-1" />
            {reason}
          </Badge>
        )}

        <h3 className="font-semibold text-slate-900 line-clamp-2 mb-2">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.averageRating || 0)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-slate-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-slate-600">
            ({product.totalReviews || 0})
          </span>
        </div>

        <div className="mb-4">
          <p className="text-2xl font-bold text-slate-900">
            {product.price?.toFixed(2)} د.ا
          </p>
          {product.originalPrice && (
            <p className="text-xs text-slate-500 line-through">
              {product.originalPrice?.toFixed(2)} د.ا
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => addToCart(product.id)}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            size="sm"
          >
            <ShoppingCart className="w-3 h-3 mr-1" />
            إضافة
          </Button>
          <Button
            onClick={() => addToFavorites(product.id)}
            variant="outline"
            size="sm"
          >
            <Heart className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-blue-600" />
            التوصيات الذكية
          </h1>
          <p className="text-slate-600">
            اكتشف المنتجات المثالية بناءً على تفضيلاتك وسلوكك
          </p>
        </div>

        <Tabs defaultValue="personalized" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="personalized">
              <Sparkles className="w-4 h-4 mr-2" />
              موصى به لك
            </TabsTrigger>
            <TabsTrigger value="trending">
              <TrendingUp className="w-4 h-4 mr-2" />
              الاتجاهات
            </TabsTrigger>
            <TabsTrigger value="similar">
              <Zap className="w-4 h-4 mr-2" />
              منتجات مشابهة
            </TabsTrigger>
          </TabsList>

          {/* Personalized Recommendations */}
          <TabsContent value="personalized">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                منتجات موصى بها خصيصاً لك
              </h2>
              <p className="text-slate-600 mb-6">
                بناءً على تاريخ تصفحك والمنتجات المفضلة لديك
              </p>
            </div>

            {recommendations.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-slate-600">
                    لا توجد توصيات حالياً. تصفح المزيد من المنتجات لتحسين التوصيات
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {recommendations.map((rec: any) => (
                  <ProductCard
                    key={rec.productId}
                    product={rec.product}
                    reason={rec.reason}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Trending Products */}
          <TabsContent value="trending">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                المنتجات الرائجة الآن
              </h2>
              <p className="text-slate-600 mb-6">
                أكثر المنتجات مبيعاً والمفضلة لدى المستخدمين
              </p>
            </div>

            {trendingProducts.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-slate-600">لا توجد منتجات رائجة حالياً</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {trendingProducts.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Similar Products */}
          <TabsContent value="similar">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                منتجات مشابهة
              </h2>
              <p className="text-slate-600 mb-6">
                منتجات أخرى قد تنال إعجابك
              </p>
            </div>

            {similarProducts.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-slate-600">لا توجد منتجات مشابهة حالياً</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {similarProducts.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                ذكي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                خوارزمية متقدمة تتعلم من تفضيلاتك وتقدم توصيات دقيقة
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                محدث
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                التوصيات تتحدث باستمرار بناءً على آخر الاتجاهات والمبيعات
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-600" />
                شخصي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                كل توصية مخصصة خصيصاً لك بناءً على سلوكك وتاريخك
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
