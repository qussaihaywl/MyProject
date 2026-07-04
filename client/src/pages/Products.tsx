import { useState, useMemo, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Search, ShoppingBag, Heart, ChevronLeft, ChevronRight, Filter, Loader2, Star, X, Grid3X3, List, Edit2, Trash2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getFirstProductImage, handleImageError } from "@/lib/imageUtils";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// الأقسام
const CATEGORIES = [
  { id: 1, name: "ملابس", icon: "👔" },
  { id: 2, name: "أثاث", icon: "🛋️" },
  { id: 3, name: "إكسسوارات", icon: "💍" },
];

// قائمة الألوان المتاحة
const AVAILABLE_COLORS = [
  { id: "red", name: "أحمر", hex: "#EF4444" },
  { id: "blue", name: "أزرق", hex: "#3B82F6" },
  { id: "green", name: "أخضر", hex: "#10B981" },
  { id: "yellow", name: "أصفر", hex: "#FBBF24" },
  { id: "purple", name: "بنفسجي", hex: "#A855F7" },
  { id: "pink", name: "وردي", hex: "#EC4899" },
  { id: "black", name: "أسود", hex: "#1F2937" },
  { id: "white", name: "أبيض", hex: "#F3F4F6" },
];

// قائمة الأحجام المتاحة
const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"];

// قائمة التقييمات
const RATING_OPTIONS = [
  { value: 5, label: "5 نجوم" },
  { value: 4, label: "4 نجوم وأعلى" },
  { value: 3, label: "3 نجوم وأعلى" },
  { value: 1, label: "جميع التقييمات" },
];

export default function Products() {
  return (
    <>
      
      <ProductsContent />
    </>
  );
}

function ProductsContent() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const itemsPerPage = 12;

  const productsQuery = trpc.products.list.useQuery({ limit: 1000 });
  const categoriesQuery = trpc.categories.list.useQuery();
  const addToCartMutation = trpc.cart.addItem.useMutation();
  const deleteProductMutation = trpc.products.delete.useMutation();
  const utils = trpc.useUtils();
  
  // استخدام الأقسام من قاعدة البيانات أو الافتراضية
  const categories = categoriesQuery.data || CATEGORIES;

  const filteredProducts = useMemo(() => {
    let filtered = productsQuery.data || [];

    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.categoryId === selectedCategory);
    }

    filtered = filtered.filter((p: any) => {
      const price = parseFloat(p.price?.toString() || "0");
      return price >= priceRange[0] && price <= priceRange[1];
    });

    if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "price-low") {
      filtered.sort((a: any, b: any) => parseFloat(a.price?.toString() || "0") - parseFloat(b.price?.toString() || "0"));
    } else if (sortBy === "price-high") {
      filtered.sort((a: any, b: any) => parseFloat(b.price?.toString() || "0") - parseFloat(a.price?.toString() || "0"));
    } else if (sortBy === "popular") {
      filtered.sort((a: any, b: any) => (b.views || 0) - (a.views || 0));
    }

    return filtered;
  }, [productsQuery.data, searchTerm, selectedCategory, priceRange, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleColor = useCallback((colorId: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorId) ? prev.filter((c) => c !== colorId) : [...prev, colorId]
    );
    setCurrentPage(1);
  }, []);

  const toggleSize = useCallback((size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
    setCurrentPage(1);
  }, []);

  const handleAddToCart = useCallback(async (productId: number) => {
    try {
      await addToCartMutation.mutateAsync({ productId, quantity: 1 });
      toast.success("تم إضافة المنتج إلى السلة");
    } catch (error) {
      toast.error("فشل إضافة المنتج إلى السلة");
    }
  }, [addToCartMutation]);

  const handleDeleteProduct = useCallback(async () => {
    if (!productToDelete) return;

    try {
      const result = await deleteProductMutation.mutateAsync({ id: productToDelete });
      console.log('Delete result:', result);
      
      // تحديث البيانات
      await utils.products.list.invalidate();
      
      // إغلاق الحوار وإعادة تعيين الحالة
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      
      // إظهار رسالة النجاح
      toast.success("تم حذف المنتج بنجاح");
    } catch (error: any) {
      console.error('Delete error:', error);
      const errorMessage = error?.message || "فشل حذف المنتج";
      toast.error(errorMessage);
    }
  }, [productToDelete, deleteProductMutation, utils]);

  const handleEditProduct = useCallback((productId: number) => {
    navigate(`/admin/products/${productId}/edit`);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <div className={`${
              showFilters ? "block" : "hidden"
            } lg:block bg-white rounded-lg p-6 shadow-md sticky top-4`}>
              <div className="flex justify-between items-center mb-4 lg:hidden">
                <h2 className="font-bold text-lg">الفلاتر</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="ابحث عن المنتجات..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pr-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h4 className="font-bold text-gray-800 mb-3 text-sm">الفئات</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-right px-3 py-2 rounded-md text-sm transition-all ${
                      selectedCategory === null
                        ? "bg-rose-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-rose-100"
                    }`}
                  >
                    جميع الفئات
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-right px-3 py-2 rounded-md text-sm transition-all ${
                        selectedCategory === category.id
                          ? "bg-rose-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-rose-100"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h4 className="font-bold text-gray-800 mb-3 text-sm">نطاق السعر</h4>
                <Slider
                  value={priceRange}
                  onValueChange={(value) => {
                    setPriceRange(value as [number, number]);
                    setCurrentPage(1);
                  }}
                  min={0}
                  max={10000}
                  step={100}
                  className="mb-2"
                />
                <div className="text-sm text-gray-600 text-center font-semibold">
                  {priceRange[0]} - {priceRange[1]} د.ا
                </div>
              </div>

              {/* Color Filter */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h4 className="font-bold text-gray-800 mb-3 text-sm">الألوان</h4>
                <div className="grid grid-cols-4 gap-2">
                  {AVAILABLE_COLORS.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => toggleColor(color.id)}
                      title={color.name}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColors.includes(color.id)
                          ? "border-gray-800 scale-110"
                          : "border-gray-300 hover:border-gray-500"
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Size Filter */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h4 className="font-bold text-gray-800 mb-3 text-sm">الحجم</h4>
                <div className="grid grid-cols-3 gap-2">
                  {AVAILABLE_SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`px-2 py-1 rounded text-xs font-semibold transition-all ${
                        selectedSizes.includes(size)
                          ? "bg-rose-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-rose-100"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h4 className="font-bold text-gray-800 mb-3 text-sm">التقييم</h4>
                <div className="space-y-2">
                  {RATING_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSelectedRating(option.value);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-right px-3 py-2 rounded-md text-sm transition-all flex items-center gap-2 ${
                        selectedRating === option.value
                          ? "bg-rose-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-rose-100"
                      }`}
                    >
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < option.value ? "fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Filter */}
              <div>
                <h4 className="font-bold text-gray-800 mb-3 text-sm">الترتيب</h4>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 rounded-md border-2 border-rose-200 focus:border-rose-600 text-sm"
                >
                  <option value="newest">الأحدث</option>
                  <option value="price-low">الأرخص</option>
                  <option value="price-high">الأغلى</option>
                  <option value="popular">الأكثر شهرة</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">المنتجات</h1>
                  <p className="text-gray-600">اكتشف مجموعة واسعة من منتجاتنا المميزة</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex-1 sm:flex-none bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    الفلاتر
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === 'grid'
                        ? 'bg-rose-600 text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                    title="عرض شبكة"
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === 'list'
                        ? 'bg-rose-600 text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                    title="عرض قائمة"
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className="text-gray-500 text-sm mt-2">عدد المنتجات: {filteredProducts.length}</p>
            </div>

            {/* Products Grid */}
            {productsQuery.isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 text-rose-600 animate-spin" />
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 text-base">لا توجد منتجات متاحة</p>
                <p className="text-gray-500 text-sm mt-1">جرب تغيير معايير البحث</p>
              </div>
            ) : (
              <>
                <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-4'} gap-4 mb-8`}>
                  {paginatedProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
                    >
                      <Link href={`/product/${product.id}`}>
                        <a className="block">
                          <div className="relative bg-gray-200 h-40 sm:h-48 overflow-hidden">
                            {product.image ? (
                              <img
                                src={getFirstProductImage(product)}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                onError={handleImageError}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-100 to-orange-100">
                                <ShoppingBag className="w-8 h-8 text-rose-400" />
                              </div>
                            )}
                            {(product as any).discount && (
                              <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                -{(product as any).discount}%
                              </div>
                            )}
                          </div>
                        </a>
                      </Link>

                      <div className="p-4">
                        <Link href={`/product/${product.id}`}>
                          <a className="block">
                            <h3 className="font-bold text-gray-800 text-base line-clamp-2 hover:text-rose-600 transition-colors">
                              {product.name}
                            </h3>
                          </a>
                        </Link>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mt-2 mb-3">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < ((product as any).rating || 4)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-600">({(product as any).reviews || 0})</span>
                        </div>

                        {/* Price and Actions */}
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <span className="text-base font-bold text-rose-600">
                              {product.price} د.ا
                            </span>
                            {(product as any).originalPrice && (
                              <span className="text-xs text-gray-400 line-through ml-2">
                                {(product as any).originalPrice} د.ا
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddToCart(product.id)}
                            className="flex-1 bg-gradient-to-r from-rose-600 to-orange-500 text-white px-3 py-2 rounded-lg hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2 text-sm font-semibold"
                            title="إضافة إلى السلة"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            إضافة
                          </button>
                          
                          {user?.role === 'admin' && (
                            <>
                              <button
                                onClick={() => handleEditProduct(product.id)}
                                className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-all hover:scale-105"
                                title="تعديل المنتج"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setProductToDelete(product.id);
                                  setDeleteDialogOpen(true);
                                }}
                                className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-all hover:scale-105"
                                title="حذف المنتج"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg bg-rose-600 text-white disabled:opacity-50 hover:shadow-lg transition-all hover:bg-rose-700"
                      title="الصفحة السابقة"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    <div className="flex gap-1 sm:gap-2">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        const page = currentPage > 3 ? currentPage - 2 + i : i + 1;
                        return page <= totalPages ? (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-sm transition-all ${
                              currentPage === page
                                ? "bg-rose-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-rose-100"
                            }`}
                          >
                            {page}
                          </button>
                        ) : null;
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg bg-rose-600 text-white disabled:opacity-50 hover:shadow-lg transition-all hover:bg-rose-700"
                      title="الصفحة التالية"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من رغبتك في حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <button
              onClick={handleDeleteProduct}
              disabled={deleteProductMutation.isPending}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {deleteProductMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                  جاري الحذف...
                </>
              ) : (
                'حذف'
              )}
            </button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
