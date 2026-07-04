'use client';

import { Shirt, Sofa, Sparkles, Package, ChevronRight, MessageCircle } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';

export default function Categories() {
  const categoriesQuery = trpc.categories.listForHomepage.useQuery();

  const getCategoryIcon = (name: string) => {
    if (name.includes('ملابس') || name.includes('عبايات') || name.includes('أثواب')) return Shirt;
    if (name.includes('أثاث') || name.includes('سجاد') || name.includes('مفروشات')) return Sofa;
    if (name.includes('إكسسوارات') || name.includes('ذهب') || name.includes('عناية')) return Sparkles;
    return Package;
  };

  const displayCategories =
    categoriesQuery.data && categoriesQuery.data.length > 0
      ? categoriesQuery.data.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          iconComponent: getCategoryIcon(cat.name),
          description: cat.description || '',
          image: cat.image
        }))
      : [
          { id: 1, name: 'ملابس', iconComponent: Shirt, description: 'تشكيلة واسعة من الملابس العصرية' },
          { id: 2, name: 'أثاث', iconComponent: Sofa, description: 'أثاث أنيق وعملي لمنزلك' },
          { id: 3, name: 'إكسسوارات', iconComponent: Sparkles, description: 'إكسسوارات تكمل إطلالتك' },
          { id: 4, name: 'ملابس نسائية', iconComponent: Shirt, description: 'تشكيلة متنوعة من الملابس النسائية' }
        ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      

      {/* Page Header */}
      <section className="w-full bg-gradient-to-r from-rose-600 to-orange-500 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">أقسام المنتجات</h1>
          <p className="text-sm sm:text-base md:text-lg sm:text-base sm:text-sm sm:text-base md:text-lg md:text-xl text-rose-50">اختر القسم الذي تريده واكتشف منتجاتنا الفاخرة</p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-rose-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 sm:gap-3 sm:p-2 sm:p-2.5 md:p-3 lg:p-4 md:p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 lg:p-8">
            {displayCategories.map((category: any) => {
              const IconComponent = category.iconComponent;
              return (
                <Link key={category.id} href={`/category/${category.id}`}>
                  <Card className="h-full p-3 sm:p-2 sm:p-2.5 md:p-3 lg:p-4 md:p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 lg:p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer bg-white border-2 border-rose-100 hover:border-rose-300 group">
                    <div className="flex flex-col items-center gap-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 h-full">
                      {/* Icon */}
                      <div className="p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 bg-gradient-to-br from-rose-100 to-orange-100 rounded-full group-hover:from-rose-200 group-hover:to-orange-200 transition-all duration-300">
                        <IconComponent className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 text-rose-600" />
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-sm sm:text-base md:text-lg sm:text-base sm:text-sm sm:text-base md:text-lg md:text-xl md:text-2xl text-gray-800 text-center group-hover:text-rose-600 transition-colors duration-300">
                        {category.name}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 text-center text-base line-clamp-3">
                        {category.description}
                      </p>

                      {/* Arrow */}
                      <div className="mt-auto pt-4 flex items-center gap-2 text-rose-600 group-hover:gap-3 transition-all duration-300">
                        <span className="font-semibold">اكتشف المزيد</span>
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
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
              <MessageCircle className="w-5 h-5" />
              اتصل بنا عبر WhatsApp
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
