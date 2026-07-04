'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { X, ImageIcon, Video, Loader2, ChevronRight, ChevronLeft, Package, CheckCircle2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';

const COLORS = [
  { name: 'أحمر', hex: '#EF4444' },
  { name: 'أزرق', hex: '#3B82F6' },
  { name: 'أخضر', hex: '#10B981' },
  { name: 'أصفر', hex: '#FBBF24' },
  { name: 'برتقالي', hex: '#F97316' },
  { name: 'بنفسجي', hex: '#A855F7' },
];

const SIZES = ['S', 'M', 'L', 'XL'];

const STEPS = [
  { id: 1, title: 'المعلومات الأساسية' },
  { id: 2, title: 'التفاصيل' },
  { id: 3, title: 'الصور' },
  { id: 4, title: 'المراجعة' },
];

interface AddProductFormProps {
  onSuccess?: () => void;
}

export default function AddProductForm({ onSuccess }: AddProductFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    colors: [] as string[],
    sizes: [] as string[],
    weight: '',
    warehouseCode: '',
    categoryId: 0,
  });

  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: categories } = trpc.categories.list.useQuery();
  const { data: warehouses } = trpc.warehouses.list.useQuery();
  const uploadImageMutation = trpc.products.uploadImage.useMutation();
  const utils = trpc.useUtils();
  const createProductMutation = trpc.products.create.useMutation({
    onSuccess: () => {
      utils.products.list.invalidate();
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleColorToggle = (color: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const handleSizeToggle = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files].slice(0, 5));
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setVideo(file);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = () => {
    setVideo(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // التحقق من البيانات المطلوبة
      if (!formData.name || !formData.price || !formData.categoryId || !formData.warehouseCode) {
        toast.error('الرجاء ملء جميع الحقول المطلوبة');
        setIsLoading(false);
        return;
      }

      if (images.length === 0) {
        toast.error('الرجاء إضافة صورة واحدة على الأقل');
        setIsLoading(false);
        return;
      }

      let imageUrl = '';
      
      try {
        const uploadResponse = await uploadImageMutation.mutateAsync({
          image: images[0] as any,
        });
        imageUrl = uploadResponse.url || '';
        
        if (!imageUrl) {
          toast.error('فشل رفع الصورة');
          setIsLoading(false);
          return;
        }
      } catch (uploadError) {
        console.error('خطأ في رفع الصورة:', uploadError);
        toast.error('فشل رفع الصورة');
        setIsLoading(false);
        return;
      }

      await createProductMutation.mutateAsync({
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        colors: formData.colors.join(','),
        sizes: formData.sizes.join(','),
        weight: formData.weight,
        warehouseCode: formData.warehouseCode,
        categoryId: formData.categoryId,
        image: imageUrl,
      });

      // تحديث قائمة المنتجات
      await utils.products.list.invalidate();
      
      toast.success('تم إضافة المنتج بنجاح!');
      
      // استدعاء onSuccess callback إذا كان موجوداً
      if (onSuccess) {
        onSuccess();
      } else {
        // إعادة توجيه إلى صفحة المنتجات بعد ثانية واحدة
        setTimeout(() => {
          window.location.href = '/products';
        }, 1000);
      }
      setFormData({
        name: '',
        price: '',
        description: '',
        colors: [],
        sizes: [],
        weight: '',
        warehouseCode: '',
        categoryId: 0,
      });
      setImages([]);
      setVideo(null);
      setCurrentStep(1);
    } catch (error: any) {
      const errorMessage = error?.message || 'فشل إضافة المنتج';
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.price;
      case 2:
        return formData.categoryId && formData.warehouseCode && formData.colors.length > 0;
      case 3:
        return images.length > 0;
      default:
        return true;
    }
  };

  const getWarehouseName = () => {
    const warehouse = warehouses?.find(w => w.code === formData.warehouseCode);
    return warehouse ? warehouse.name : 'اختر المستودع';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 flex items-center justify-center py-8 px-2 sm:px-4">
      <div className="w-full max-w-4xl">
        {/* شريط التقدم */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all duration-300 ${
                    currentStep >= step.id
                      ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {currentStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : step.id}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded transition-all duration-300 ${
                      currentStep > step.id
                        ? 'bg-gradient-to-r from-rose-500 to-orange-500'
                        : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center">{STEPS[currentStep - 1].title}</h2>
        </div>

        {/* النموذج */}
        <Card className="bg-white shadow-xl rounded-2xl border-0 p-6 md:p-10 max-h-96 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* الخطوة 1 */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">اسم المنتج</label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="أدخل اسم المنتج"
                    className="h-12 text-base border-2 border-gray-200 rounded-lg focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">السعر (د.ا)</label>
                  <Input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="أدخل السعر"
                    className="h-12 text-base border-2 border-gray-200 rounded-lg focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">الوصف</label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="أدخل وصف المنتج"
                    className="min-h-28 text-base border-2 border-gray-200 rounded-lg focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">الوزن (كجم)</label>
                  <Input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="أدخل الوزن"
                    className="h-12 text-base border-2 border-gray-200 rounded-lg focus:border-rose-500"
                  />
                </div>
              </div>
            )}

            {/* الخطوة 2 */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">القسم</label>
                  <Select value={formData.categoryId.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: parseInt(value) }))}>
                    <SelectTrigger className="h-16 text-lg border-2 border-gray-200 rounded-lg font-semibold">
                      <SelectValue placeholder="اختر القسم" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map(category => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">كود المستودع</label>
                  <Select value={formData.warehouseCode} onValueChange={(value) => setFormData(prev => ({ ...prev, warehouseCode: value }))}>
                    <SelectTrigger className="h-12 text-base border-2 border-gray-200 rounded-lg">
                      <SelectValue placeholder="اختر المستودع" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses?.map(warehouse => (
                        <SelectItem key={warehouse.code} value={warehouse.code}>
                          {warehouse.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">الألوان (نصية)</label>
                  <Input
                    type="text"
                    name="colors"
                    value={formData.colors.join(', ')}
                    onChange={(e) => setFormData(prev => ({ ...prev, colors: e.target.value.split(',').map(c => c.trim()).filter(c => c) }))}
                    placeholder="مثال: أحمر، أزرق، أخضر"
                    className="h-12 text-base border-2 border-gray-200 rounded-lg focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">المقاسات (نصية)</label>
                  <Input
                    type="text"
                    name="sizes"
                    value={formData.sizes.join(', ')}
                    onChange={(e) => setFormData(prev => ({ ...prev, sizes: e.target.value.split(',').map(s => s.trim()).filter(s => s) }))}
                    placeholder="مثال: S، M، L، XL"
                    className="h-12 text-base border-2 border-gray-200 rounded-lg focus:border-rose-500"
                  />
                </div>
              </div>
            )}

            {/* الخطوة 3 */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">الصور (حد أقصى 5)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-rose-500 transition-colors cursor-pointer">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <ImageIcon className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">انقر لرفع الصور أو اسحبها هنا</p>
                    </label>
                  </div>

                  {images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`صورة ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">الفيديو (اختياري)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-rose-500 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                      id="video-upload"
                    />
                    <label htmlFor="video-upload" className="cursor-pointer">
                      <Video className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">انقر لرفع فيديو</p>
                    </label>
                  </div>

                  {video && (
                    <div className="mt-4 relative group">
                      <video
                        src={URL.createObjectURL(video)}
                        className="w-full h-32 bg-black rounded-lg"
                        controls
                      />
                      <button
                        type="button"
                        onClick={removeVideo}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* الخطوة 4 - المراجعة */}
            {currentStep === 4 && (
              <div className="space-y-5">
                <div className="bg-gradient-to-r from-rose-50 to-orange-50 rounded-lg p-6 border border-rose-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ملخص المنتج
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700">الاسم:</span>
                      <span className="text-gray-600">{formData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700">السعر:</span>
                      <span className="text-gray-600">{formData.price} د.ا</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700">القسم:</span>
                      <span className="text-gray-600">{categories?.find(c => c.id === formData.categoryId)?.name || 'لم يتم الاختيار'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700">المستودع:</span>
                      <span className="text-gray-600">{getWarehouseName()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700">الألوان:</span>
                      <span className="text-gray-600">{formData.colors.length} ألوان</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700">المقاسات:</span>
                      <span className="text-gray-600">{formData.sizes.join(', ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700">الصور:</span>
                      <span className="text-gray-600">{images.length} صورة</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* الأزرار */}
            <div className="flex gap-4 pt-6">
              {currentStep > 1 && (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  variant="outline"
                  className="flex-1 h-12 text-base"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  السابق
                </Button>
              )}

              {currentStep < 4 ? (
                <Button
                  type="button"
                  onClick={() => isStepValid() && setCurrentStep(currentStep + 1)}
                  disabled={!isStepValid()}
                  className="flex-1 h-12 text-base bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600"
                >
                  التالي
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 h-12 text-base bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      جاري الإضافة...
                    </>
                  ) : (
                    <>
                      <Package className="w-5 h-5 mr-2" />
                      إضافة المنتج
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
