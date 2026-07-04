import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, ShoppingCart, ArrowRight, Star } from "lucide-react";
import { useLocation } from "wouter";

export function Favorites() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data: favoritesList, isLoading: isFetching } = trpc.favorites.list.useQuery(
    undefined,
    { enabled: !!user }
  );

  const removeMutation = trpc.favorites.remove.useMutation();

  useEffect(() => {
    if (favoritesList) {
      setFavorites(favoritesList);
      setIsLoading(false);
    }
  }, [favoritesList]);

  const handleRemove = async (productId: number) => {
    try {
      await removeMutation.mutateAsync({ productId });
      setFavorites(favorites.filter(f => f.productId !== productId));
    } catch (error) {
      console.error("Failed to remove from favorites:", error);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">المفضلة</h1>
        <p className="text-gray-600 mb-6">يجب تسجيل الدخول لعرض المفضلة</p>
        <Button onClick={() => navigate("/login")}>تسجيل الدخول</Button>
      </div>
    );
  }

  if (isLoading || isFetching) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">المفضلة</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-64 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h1 className="text-3xl font-bold mb-4">المفضلة</h1>
        <p className="text-gray-600 mb-6">لم تضف أي منتجات إلى المفضلة بعد</p>
        <Button onClick={() => navigate("/products")}>استكشف المنتجات</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">المفضلة</h1>
        <p className="text-gray-600">{favorites.length} منتج في المفضلة</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {favorites.map((favorite) => (
          <Card key={favorite.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative bg-gray-100 h-48">
              {favorite.image ? (
                <img
                  src={favorite.image}
                  alt={favorite.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  لا توجد صورة
                </div>
              )}
              <button
                onClick={() => handleRemove(favorite.productId)}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>
            </div>

            <div className="p-4">
              <h3 className="font-bold text-lg mb-2 line-clamp-2">{favorite.name}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{favorite.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-amber-600">
                  {parseFloat(favorite.price).toFixed(2)} د.ا
                </span>
                {favorite.rating && (
                  <span className="flex items-center gap-1 text-sm text-yellow-500">
                    <Star className="w-4 h-4 fill-yellow-500" />
                    5.0
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => navigate(`/product/${favorite.productId}`)}
                  variant="outline"
                  className="flex-1"
                >
                  <ArrowRight className="w-4 h-4 ml-2" />
                  عرض
                </Button>
                <Button className="flex-1 bg-amber-600 hover:bg-amber-700">
                  <ShoppingCart className="w-4 h-4 ml-2" />
                  إضافة
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
