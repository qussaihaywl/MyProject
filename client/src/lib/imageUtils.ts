/**
 * Image Utility Functions
 * مساعدات لمعالجة الصور
 */

// صورة افتراضية للمنتجات
export const DEFAULT_PRODUCT_IMAGE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663711816913/PbM5MRSPLRoPndpAwMBnHr/rose-placeholder-product-image.webp';

/**
 * الحصول على قائمة الصور من المنتج
 * @param product - بيانات المنتج
 * @returns مصفوفة من رابط الصور
 */
export function getProductImages(product: any): string[] {
  const images: string[] = [];

  // محاولة الحصول على الصور من حقل images
  if (product.images) {
    try {
      const parsed = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
      if (Array.isArray(parsed) && parsed.length > 0) {
        images.push(...parsed.filter((img: string) => img && img.trim()));
      }
    } catch (error) {
      console.warn('خطأ في تحليل حقل images:', error);
    }
  }

  // إضافة الصورة الرئيسية
  if (product.image && product.image.trim()) {
    if (!images.includes(product.image)) {
      images.push(product.image);
    }
  }

  // إذا لم تكن هناك صور، استخدم الصورة الافتراضية
  if (images.length === 0) {
    images.push(DEFAULT_PRODUCT_IMAGE);
  }

  return images;
}

/**
 * الحصول على الصورة الأولى للمنتج
 * @param product - بيانات المنتج
 * @returns رابط الصورة
 */
export function getFirstProductImage(product: any): string {
  // التحقق من الصورة الرئيسية أولاً
  if (product.image && product.image.trim() && product.image !== DEFAULT_PRODUCT_IMAGE) {
    return product.image;
  }
  
  // ثم التحقق من قائمة الصور
  const images = getProductImages(product);
  return images[0] || DEFAULT_PRODUCT_IMAGE;
}

/**
 * معالج خطأ تحميل الصورة
 * @param event - حدث الخطأ
 */
export function handleImageError(event: React.SyntheticEvent<HTMLImageElement>) {
  const img = event.target as HTMLImageElement;
  if (img.src !== DEFAULT_PRODUCT_IMAGE) {
    img.src = DEFAULT_PRODUCT_IMAGE;
  }
}
