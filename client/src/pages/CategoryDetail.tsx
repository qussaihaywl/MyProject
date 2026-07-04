'use client';

import { useParams, Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ShoppingCart, Heart } from 'lucide-react';
import { useState } from 'react';
import { getFirstProductImage, handleImageError } from '@/lib/imageUtils';

export default function CategoryDetail() {
  const params = useParams();
  const categoryId = parseInt(params?.id as string) || 0;
  const [favorites, setFavorites] = useState<number[]>([]);

  const productsQuery = trpc.products.list.useQuery({ limit: 100 });
  const categoriesQuery = trpc.categories.listForHomepage.useQuery();

  // Filter products by category
  const categoryProducts = productsQuery.data?.filter(
    (product: any) => product.categoryId === categoryId
  ) || [];

  // Get category name
  const category = categoriesQuery.data?.find((cat: any) => cat.id === categoryId);

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      

      {/* Breadcrumb */}
      <section className="w-full bg-gray-50 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-gray-600">
          <Link href="/">
            <span className="hover:text-rose-600 cursor-pointer">الرئيسية</span>
          </Link>
          <span>/</span>
          <Link href="/categories">
            <span className="hover:text-rose-600 cursor-pointer">الأقسام</span>
          </Link>
          <span>/</span>
          <span className="text-rose-600 font-semibold">{category?.name || 'القسم'}</span>
        </div>
      </section>

      {/* Category Header */}
      <section className="w-full bg-gradient-to-r from-rose-600 to-orange-500 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 sm:p-2.5 md:p-3 lg:p-4 mb-4">
            <Link href="/categories">
              <button className="p-2 hover:bg-white/20 rounded-md sm:rounded-lg transition-all duration-300">
                <ChevronLeft className="w-6 h-6" />
              </button>
            </Link>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">{category?.name || 'القسم'}</h1>
          <p className="text-sm sm:text-base md:text-lg sm:text-base sm:text-sm sm:text-base md:text-lg md:text-xl text-rose-50">{category?.description || ''}</p>
          <p className="text-rose-100 mt-4">
            عدد المنتجات: <span className="font-bold text-sm sm:text-base md:text-lg">{categoryProducts.length}</span>
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-rose-50">
        <div className="max-w-7xl mx-auto">
          {categoryProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6">
              {categoryProducts.map((product: any) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group bg-white">
                    {/* Product Image */}
                    <div className="relative w-full h-64 bg-gray-100 overflow-hidden">
                      {product.image ? (
                        <img
                          src={getFirstProductImage(product)}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={handleImageError}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span>لا توجد صورة</span>
                        </div>
                      )}

                      {/* Badge */}
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-rose-600 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        جديد
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(product.id);
                        }}
                        className="absolute top-3 left-3 p-2 bg-white/90 hover:bg-white rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            favorites.includes(product.id)
                              ? 'fill-rose-600 text-rose-600'
                              : 'text-gray-400'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="p-2 sm:p-2.5 md:p-3 lg:p-4 sm:p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6">
                      {/* Title */}
                      <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-rose-600 transition-colors duration-300">
                        {product.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {product.description || 'منتج مميز'}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-purple-400">
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">(5.0)</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm sm:text-base md:text-lg sm:text-base sm:text-sm sm:text-base md:text-lg md:text-xl md:text-2xl font-bold text-rose-600">
                            {product.price}د.ا
                          </p>
                        </div>
                      </div>

                      {/* Add to Cart Button */}
                      <button className="w-full px-4 py-2 bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-700 hover:to-orange-600 text-white font-bold rounded-md sm:rounded-lg transition-all duration-300 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        أضف للسلة
                      </button>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-600 text-base sm:text-sm sm:text-base md:text-lg md:text-xl">لا توجد منتجات في هذا القسم حالياً</p>
              <Link href="/categories">
                <button className="mt-6 px-6 py-3 bg-gradient-to-r from-rose-600 to-orange-500 text-white font-bold rounded-md sm:rounded-lg hover:shadow-lg transition-all duration-300">
                  العودة للأقسام
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gradient-to-r from-rose-900 to-orange-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:p-2 sm:p-2.5 md:p-3 lg:p-4 md:p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 lg:p-8 mb-8">
            {/* About */}
            <div>
              <h3 className="text-sm sm:text-base md:text-lg sm:text-base sm:text-sm sm:text-base md:text-lg md:text-xl md:text-2xl font-bold mb-4">Rose Online</h3>
              <p className="text-gray-300">
                متجرك الأول للملابس والأثاث والإكسسوارات بجودة عالية وأسعار منافسة
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-base sm:text-sm sm:text-base md:text-lg md:text-xl font-bold mb-4">روابط سريعة</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/">الرئيسية</Link>
                </li>
                <li>
                  <Link href="/categories">الأقسام</Link>
                </li>
                <li>
                  <Link href="/contact">اتصل بنا</Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-base sm:text-sm sm:text-base md:text-lg md:text-xl font-bold mb-4">تواصل معنا</h4>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center gap-2">
                  <span>📞</span>
                  <span>+962 77 8989 135</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📧</span>
                  <span>info@roseonline.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* WhatsApp Button */}
          <div className="text-center pt-8 border-t border-white/20">
            <a
              href="https://wa.me/962778989135"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-md sm:rounded-lg transition-all duration-300 hover:scale-105"
            >
              💬 اتصل بنا عبر WhatsApp
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center mt-8 text-gray-400 text-sm">
            <p>&copy; 2024 Rose Online. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
