import { useState, useEffect } from 'react';
// Rose Online v2.0 - Mobile Optimized Design
import { Shirt, Sofa, Sparkles, Package, MessageCircle, Zap, Award, Truck, Shield, ShoppingBag, ShoppingCart, User, Home as HomeIcon, ChevronLeft, ChevronRight, Play, Pause, Film, Loader, Menu, X } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Link } from 'wouter';
import LazyLoad from 'react-lazyload';

// دالة لاستخراج معرف YouTube من الرابط
const extractYouTubeId = (url: string): string | null => {
  if (!url) return null;
  
  // معرفات YouTube المختلفة
  const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
  const match = url.match(youtubeRegex);
  return match ? match[1] : null;
};

// دالة للحصول على رابط iframe YouTube
const getYouTubeEmbedUrl = (url: string): string => {
  const videoId = extractYouTubeId(url);
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}`;
  }
  return url;
};

// دالة للتحقق من أن الفيديو من YouTube
const isYouTubeUrl = (url: string): boolean => {
  return url.includes('youtube.com') || url.includes('youtu.be');
};

export default function Home() {
  const categoriesQuery = trpc.categories.listForHomepage.useQuery();
  const videosQuery = trpc.showcaseVideos.list.useQuery();
  
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

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
      : [];

  const videos = videosQuery.data || [];
  const activeVideos = videos.filter((v: any) => v.isActive);

  useEffect(() => {
    if (!autoPlay || activeVideos.length === 0 || !isPlaying) return;
    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % activeVideos.length);
    }, activeVideos[currentVideoIndex]?.duration ? activeVideos[currentVideoIndex].duration * 1000 : 5000);
    return () => clearInterval(interval);
  }, [autoPlay, activeVideos, currentVideoIndex, isPlaying]);

  const currentVideo = activeVideos[currentVideoIndex];
  const isYouTube = currentVideo && isYouTubeUrl(currentVideo.videoUrl);
  const youtubeEmbedUrl = currentVideo && isYouTube ? getYouTubeEmbedUrl(currentVideo.videoUrl) : null;

  const services = [
    { icon: Zap, title: 'جودة عالية', description: 'منتجات مختارة بعناية فائقة' },
    { icon: Award, title: 'خدمة ممتازة', description: 'فريق متخصص جاهز لخدمتك 24/7' },
    { icon: Truck, title: 'توصيل سريع', description: 'شحن آمن وسريع للمملكة' },
    { icon: Shield, title: 'ضمان الرضا', description: 'ضمان استرجاع 100%' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50">
      
      <div className="flex flex-col">
        {/* Main Content */}
        <div className="flex-1 w-full">
          {/* Hero Banner - Optimized for Mobile */}
          <section className="w-full h-24 sm:h-32 md:h-40 lg:h-56 mt-0 overflow-hidden relative flex-shrink-0">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663711816913/PbM5MRSPLRoPndpAwMBnHr/rose-online-banner-compact-cp9A8Hz5wiZbHVyrxocfkr.webp"
              alt="Rose Online Banner"
              className="w-full h-full object-cover"
              loading="eager"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-amber-900/10 via-transparent to-transparent" />
          </section>

          {/* Video Section - Mobile Optimized */}
          <section className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-10">
            <div className="max-w-6xl mx-auto">
              {/* Section Title */}
              <div className="mb-4 sm:mb-6 md:mb-8">
                <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                  <Film className="w-6 h-6 sm:w-8 sm:h-8 text-amber-300 flex-shrink-0" />
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-amber-300">
                    عروض حصرية
                  </h2>
                </div>
                <p className="text-red-100/70 text-xs sm:text-sm md:text-base px-0">
                  اكتشف أحدث المنتجات والعروض الخاصة
                </p>
              </div>

              {/* Video Player - Mobile Optimized */}
              {videosQuery.isLoading ? (
                <div className="p-6 sm:p-8 text-center bg-red-800/30 rounded-lg sm:rounded-2xl border border-red-700/50 flex items-center justify-center min-h-40 sm:min-h-48">
                  <Loader className="w-6 h-6 sm:w-8 sm:h-8 text-amber-300 animate-spin" />
                </div>
              ) : activeVideos.length > 0 && currentVideo ? (
                <div className="group relative">
                  {/* Main Video Container */}
                  <div className="relative rounded-lg sm:rounded-2xl overflow-hidden bg-red-900/60 shadow-lg sm:shadow-2xl" style={{ aspectRatio: '16/9' }}>
                    {isYouTube && youtubeEmbedUrl ? (
                      // YouTube iframe
                      <iframe
                        key={currentVideo.id}
                        src={youtubeEmbedUrl}
                        title={currentVideo.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      // HTML5 video player
                      <video
                        key={currentVideo.id}
                        src={currentVideo.videoUrl}
                        autoPlay={isPlaying}
                        muted
                        loop
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('خطأ في تشغيل الفيديو:', e);
                        }}
                      />
                    )}
                    
                    {/* Overlay Controls */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Play/Pause Button */}
                    {!isYouTube && (
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-amber-400/80 hover:bg-amber-400 text-red-950 p-2 sm:p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                      >
                        {isPlaying ? <Pause className="w-5 h-5 sm:w-6 sm:h-6" /> : <Play className="w-5 h-5 sm:w-6 sm:h-6" />}
                      </button>
                    )}
                  </div>

                  {/* Video Navigation - Mobile Optimized */}
                  <div className="flex items-center justify-between mt-3 sm:mt-4 gap-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => setCurrentVideoIndex((prev) => (prev - 1 + activeVideos.length) % activeVideos.length)}
                      className="p-1.5 sm:p-2 bg-amber-400/20 hover:bg-amber-400/40 text-amber-300 rounded transition-all duration-300 transform hover:scale-110"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    {/* Video Indicators */}
                    <div className="flex gap-1 sm:gap-2 flex-1 justify-center">
                      {activeVideos.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentVideoIndex(index)}
                          className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                            index === currentVideoIndex
                              ? 'bg-amber-400 w-6 sm:w-8'
                              : 'bg-amber-400/30 w-1.5 sm:w-2 hover:bg-amber-400/60'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => setCurrentVideoIndex((prev) => (prev + 1) % activeVideos.length)}
                      className="p-1.5 sm:p-2 bg-amber-400/20 hover:bg-amber-400/40 text-amber-300 rounded transition-all duration-300 transform hover:scale-110"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>

                  {/* Video Info - Mobile Optimized */}
                  <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-red-900/40 rounded-lg sm:rounded-xl border border-amber-400/20">
                    <p className="text-amber-300 font-semibold text-xs sm:text-sm">
                      {currentVideo.title}
                    </p>
                    <p className="text-red-100/70 text-xs mt-1">
                      {currentVideo.description || 'استمتع بمشاهدة أحدث عروضنا الحصرية والمنتجات الجديدة'}
                    </p>
                    <p className="text-amber-300/60 text-xs mt-1">
                      الفيديو {currentVideoIndex + 1} من {activeVideos.length}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-6 sm:p-8 text-center bg-red-800/30 rounded-lg sm:rounded-2xl border border-red-700/50">
                  <p className="text-red-100 text-sm sm:text-base">لا توجد فيديوهات متاحة حالياً</p>
                </div>
              )}
            </div>
          </section>

          {/* Call to Action Button - Mobile Optimized */}
          <section className="w-full py-6 sm:py-8 md:py-10 lg:py-12 px-3 sm:px-4 md:px-6 bg-gradient-to-br from-amber-100 via-amber-50 to-amber-100">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-amber-900 mb-3 sm:mb-4">
                هل تريد تقديم طلب خاص؟
              </h2>
              <p className="text-amber-700 text-xs sm:text-sm md:text-base mb-4 sm:mb-6">
                تواصل معنا الآن وسنساعدك في إيجاد ما تبحث عنه
              </p>
              <Link href="/live-chat" className="inline-block px-4 sm:px-6 md:px-8 py-2 sm:py-3 bg-gradient-to-r from-red-900 to-red-800 text-amber-300 font-bold text-sm sm:text-base rounded hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                تحدث معنا الآن
              </Link>
            </div>
          </section>

          {/* Services Section - Mobile Optimized */}
          <section className="w-full py-6 sm:py-8 md:py-10 lg:py-12 px-3 sm:px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-amber-300 text-center mb-6 sm:mb-8">
                لماذا تختار Rose Online؟
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                {services.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <div key={index} className="p-2 sm:p-3 bg-red-900/40 rounded border border-amber-400/20 hover:border-amber-400/40 transition-all duration-300 text-center flex flex-col items-center justify-center">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300 mb-1" />
                      <h3 className="text-amber-300 font-bold text-xs sm:text-sm">{service.title}</h3>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Categories Section - Mobile Optimized */}
          <section className="w-full py-6 sm:py-8 md:py-10 lg:py-12 px-3 sm:px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-amber-300 text-center mb-6 sm:mb-8">
                تصفح الفئات
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {displayCategories.map((category: any) => {
                  const Icon = category.iconComponent;
                  return (
                    <Link
                      key={category.id}
                      href={`/products?category=${category.id}`}
                      className="group p-3 sm:p-4 bg-red-900/40 rounded-lg border border-amber-400/20 hover:border-amber-400/40 hover:bg-red-900/60 transition-all duration-300 text-center"
                    >
                      <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-amber-300 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <h3 className="text-amber-300 font-bold text-xs sm:text-sm line-clamp-2">{category.name}</h3>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Special Offers Section - Mobile Optimized */}
          <section className="w-full py-6 sm:py-8 md:py-10 lg:py-12 px-3 sm:px-4 md:px-6 bg-gradient-to-br from-red-900/20 via-amber-100/20 to-red-900/20">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-amber-300 text-center mb-6 sm:mb-8">
                عروض حصرية
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="p-4 sm:p-6 bg-red-900/40 rounded-lg border border-amber-400/20 text-center">
                  <h3 className="text-amber-300 font-bold text-sm sm:text-base mb-2">خصم 50% على الملابس</h3>
                  <p className="text-red-100/70 text-xs sm:text-sm">على جميع المنتجات المختارة</p>
                </div>
                <div className="p-4 sm:p-6 bg-red-900/40 rounded-lg border border-amber-400/20 text-center">
                  <h3 className="text-amber-300 font-bold text-sm sm:text-base mb-2">توصيل مجاني</h3>
                  <p className="text-red-100/70 text-xs sm:text-sm">للطلبات فوق 100 دينار</p>
                </div>
                <div className="p-4 sm:p-6 bg-red-900/40 rounded-lg border border-amber-400/20 text-center">
                  <h3 className="text-amber-300 font-bold text-sm sm:text-base mb-2">هدايا مجانية</h3>
                  <p className="text-red-100/70 text-xs sm:text-sm">مع كل شراء فوق 200 دينار</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
