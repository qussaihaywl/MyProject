import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { X, ImageIcon, Loader2, ChevronRight, ChevronLeft } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface EditProductFormProps {
  product: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

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
  { id: 3, title: 'الصورة' },
  { id: 4, title: 'المراجعة' },
];

export default function EditProductForm({ product, onSuccess, onCancel }: EditProductFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price?.toString() || '',
    description: product?.description || '',
    colors: product?.colors ? (typeof product.colors === 'string' ? product.colors.split(',') : product.colors) : [],
    sizes: product?.sizes ? (typeof product.sizes === 'string' ? product.sizes.split(',') : product.sizes) : [],
    weight: product?.weight || '',
    warehouseCode: product?.warehouseCode || '',
    categoryId: product?.categoryId || 0,
  });

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(product?.image || '');
  const [isLoading, setIsLoading] = useState(false);

  const { data: categories } = trpc.categories.list.useQuery();
  const { data: warehouses } = trpc.warehouses.list.useQuery();
  const uploadImageMutation = trpc.products.uploadImage.useMutation();
  const updateProductMutation = trpc.products.update.useMutation();
  const utils = trpc.useUtils();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleColorToggle = (color: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c: string) => c !== color)
        : [...prev.colors, color]
    }));
  };

  const handleSizeToggle = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s: string) => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.name || !formData.price || !formData.categoryId) {
        toast.error('الرجاء ملء جميع الحقول المطلوبة');
        setIsLoading(false);
        return;
      }

      let imageUrl = imagePreview;

      // Upload new image if selected
      if (image) {
        try {
          const uploadResponse = await uploadImageMutation.mutateAsync({
            image: image as any,
          });
          imageUrl = uploadResponse.url || imagePreview;

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
      }

      await updateProductMutation.mutateAsync({
        id: product.id,
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

      await utils.products.getAll.invalidate();
      toast.success('تم تحديث المنتج بنجاح!');

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'فشل تحديث المنتج';
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step.id <= currentStep
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {step.id}
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-all ${
                    step.id < currentStep ? 'bg-amber-500' : 'bg-amber-100'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <p className="text-center mt-4 text-amber-700 font-semibold">{STEPS[currentStep - 1]?.title}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <Card className="border-2 border-amber-200 p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">اسم المنتج *</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="أدخل اسم المنتج"
                className="border-2 border-amber-200 rounded-lg focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">السعر *</label>
              <Input
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="أدخل السعر"
                className="border-2 border-amber-200 rounded-lg focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">الفئة *</label>
              <Select value={formData.categoryId.toString()} onValueChange={(val) => setFormData(prev => ({ ...prev, categoryId: parseInt(val) }))}>
                <SelectTrigger className="border-2 border-amber-200 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>
        )}

        {/* Step 2: Details */}
        {currentStep === 2 && (
          <Card className="border-2 border-amber-200 p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">الوصف</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="أدخل وصف المنتج"
                className="border-2 border-amber-200 rounded-lg focus:border-amber-400 min-h-24"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">الألوان المتاحة</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => handleColorToggle(color.name)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      formData.colors.includes(color.name)
                        ? 'ring-2 ring-amber-500 bg-amber-100'
                        : 'bg-gray-100'
                    }`}
                    style={formData.colors.includes(color.name) ? { backgroundColor: color.hex + '20' } : {}}
                  >
                    {color.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">الأحجام المتاحة</label>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeToggle(size)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      formData.sizes.includes(size)
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-100'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">الوزن</label>
              <Input
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="أدخل الوزن (كجم)"
                className="border-2 border-amber-200 rounded-lg focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">كود المستودع</label>
              <Select value={formData.warehouseCode} onValueChange={(val) => setFormData(prev => ({ ...prev, warehouseCode: val }))}>
                <SelectTrigger className="border-2 border-amber-200 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {warehouses?.map((warehouse: any) => (
                    <SelectItem key={warehouse.id} value={warehouse.code}>
                      {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>
        )}

        {/* Step 3: Image */}
        {currentStep === 3 && (
          <Card className="border-2 border-amber-200 p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-4">صورة المنتج</label>
              
              {imagePreview && (
                <div className="relative mb-4">
                  <img
                    src={imagePreview}
                    alt="معاينة"
                    className="w-full h-64 object-cover rounded-lg border-2 border-amber-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(product?.image || '');
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}

              <label className="flex items-center justify-center w-full p-6 border-2 border-dashed border-amber-300 rounded-lg cursor-pointer hover:bg-amber-50 transition-all">
                <div className="flex flex-col items-center justify-center">
                  <ImageIcon className="text-amber-500 mb-2" size={32} />
                  <span className="text-amber-700 font-semibold">انقر لاختيار صورة</span>
                  <span className="text-amber-600 text-sm">أو اسحب الصورة هنا</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </Card>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <Card className="border-2 border-amber-200 p-6 space-y-4">
            <h3 className="text-lg font-bold text-amber-900">مراجعة المنتج</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-amber-700">الاسم</p>
                <p className="font-semibold text-amber-900">{formData.name}</p>
              </div>
              <div>
                <p className="text-sm text-amber-700">السعر</p>
                <p className="font-semibold text-amber-900">{formData.price} د.ا</p>
              </div>
              <div>
                <p className="text-sm text-amber-700">الفئة</p>
                <p className="font-semibold text-amber-900">
                  {categories?.find((c: any) => c.id === formData.categoryId)?.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-amber-700">الوزن</p>
                <p className="font-semibold text-amber-900">{formData.weight || 'لم يتم تحديده'}</p>
              </div>
            </div>

            {formData.description && (
              <div>
                <p className="text-sm text-amber-700">الوصف</p>
                <p className="text-amber-900">{formData.description}</p>
              </div>
            )}

            {imagePreview && (
              <div>
                <p className="text-sm text-amber-700 mb-2">الصورة</p>
                <img src={imagePreview} alt="المنتج" className="w-full h-40 object-cover rounded-lg" />
              </div>
            )}
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 justify-between">
          <Button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg"
          >
            <ChevronLeft size={20} />
            السابق
          </Button>

          <div className="flex gap-2">
            {onCancel && (
              <Button
                type="button"
                onClick={onCancel}
                className="bg-gray-400 hover:bg-gray-500 text-white rounded-lg"
              >
                إلغاء
              </Button>
            )}

            {currentStep === STEPS.length ? (
              <Button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    جاري التحديث...
                  </>
                ) : (
                  'حفظ التغييرات'
                )}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg"
              >
                التالي
                <ChevronRight size={20} />
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
