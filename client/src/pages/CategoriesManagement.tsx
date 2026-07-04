import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';

interface Category {
  id: number;
  name: string;
  description?: string | null;
  image?: string | null;
  displayOrder?: number;
  showOnHomepage?: boolean;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function CategoriesManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    displayOrder: 0,
    showOnHomepage: false,
    isActive: true,
  });

  // Fetch categories
  const categoriesQuery = trpc.categories.list.useQuery();
  const categories = categoriesQuery.data || [];

  // Mutations
  const createCategoryMutation = trpc.categories.create.useMutation({
    onSuccess: () => {
      toast.success('تم إضافة القسم بنجاح');
      categoriesQuery.refetch();
      setIsAddDialogOpen(false);
      setFormData({ name: '', description: '', displayOrder: 0, showOnHomepage: false, isActive: true });
    },
    onError: (error) => {
      toast.error(error.message || 'حدث خطأ أثناء إضافة القسم');
    },
  });

  const updateCategoryMutation = trpc.categories.update.useMutation({
    onSuccess: () => {
      toast.success('تم تحديث القسم بنجاح');
      categoriesQuery.refetch();
      setIsEditDialogOpen(false);
      setSelectedCategory(null);
    },
    onError: (error) => {
      toast.error(error.message || 'حدث خطأ أثناء تحديث القسم');
    },
  });

  const deleteCategoryMutation = trpc.categories.delete.useMutation({
    onSuccess: () => {
      toast.success('تم حذف القسم بنجاح');
      categoriesQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message || 'حدث خطأ أثناء حذف القسم');
    },
  });

  // Filter and search
  const filteredCategories = useMemo(() => {
    return categories.filter(category => {
      const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
      const matchesFilter = filterActive === null || category.isActive === filterActive;
      return matchesSearch && matchesFilter;
    });
  }, [categories, searchTerm, filterActive]);

  const handleAddCategory = async () => {
    if (!formData.name.trim()) {
      toast.error('يرجى إدخال اسم القسم');
      return;
    }

    try {
      await createCategoryMutation.mutateAsync({
        name: formData.name,
        description: formData.description,
        displayOrder: formData.displayOrder,
        showOnHomepage: formData.showOnHomepage,
        isActive: formData.isActive,
      });
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleUpdateCategory = async () => {
    if (!selectedCategory || !formData.name.trim()) {
      toast.error('يرجى إدخال اسم القسم');
      return;
    }

    try {
      await updateCategoryMutation.mutateAsync({
        id: selectedCategory.id,
        name: formData.name,
        description: formData.description,
        displayOrder: formData.displayOrder,
        showOnHomepage: formData.showOnHomepage,
        isActive: formData.isActive,
      });
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    if (window.confirm(`هل أنت متأكد من حذف القسم "${category.name}"؟`)) {
      try {
        await deleteCategoryMutation.mutateAsync({ id: category.id });
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      displayOrder: category.displayOrder || 0,
      showOnHomepage: category.showOnHomepage || false,
      isActive: category.isActive !== false,
    });
    setIsEditDialogOpen(true);
  };

  const handleAddClick = () => {
    setSelectedCategory(null);
    setFormData({ name: '', description: '', displayOrder: 0, showOnHomepage: false, isActive: true });
    setIsAddDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">إدارة الأقسام</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleAddClick}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              <Plus className="w-5 h-5 ml-2" />
              قسم جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-white/20 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">إضافة قسم جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-white text-sm font-medium mb-2 block">اسم القسم *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="أدخل اسم القسم"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <label className="text-white text-sm font-medium mb-2 block">الوصف</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="أدخل وصف القسم"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <label className="text-white text-sm font-medium mb-2 block">ترتيب العرض</label>
                <Input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                  placeholder="0"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="flex items-center gap-2 sm:p-2.5 md:p-3 lg:p-4">
                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showOnHomepage}
                    onChange={(e) => setFormData({ ...formData, showOnHomepage: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span>عرض على الصفحة الرئيسية</span>
                </label>
                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span>نشط</span>
                </label>
              </div>
              <Button
                onClick={handleAddCategory}
                disabled={createCategoryMutation.isPending}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                {createCategoryMutation.isPending ? 'جاري الإضافة...' : 'إضافة القسم'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-2 sm:p-2.5 md:p-3 lg:p-4 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث عن قسم..."
            className="bg-gray-800 border-gray-700 text-white pr-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setFilterActive(null)}
            variant={filterActive === null ? 'default' : 'outline'}
            className={filterActive === null ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-600 text-white hover:bg-gray-800'}
          >
            <Filter className="w-4 h-4 ml-2" />
            الكل
          </Button>
          <Button
            onClick={() => setFilterActive(true)}
            variant={filterActive === true ? 'default' : 'outline'}
            className={filterActive === true ? 'bg-green-600 hover:bg-green-700' : 'border-gray-600 text-white hover:bg-gray-800'}
          >
            نشط
          </Button>
          <Button
            onClick={() => setFilterActive(false)}
            variant={filterActive === false ? 'default' : 'outline'}
            className={filterActive === false ? 'bg-red-600 hover:bg-red-700' : 'border-gray-600 text-white hover:bg-gray-800'}
          >
            معطل
          </Button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6">
        {filteredCategories.length === 0 ? (
          <Card className="col-span-full bg-white/10 border-white/20 p-3 sm:p-2 sm:p-2.5 md:p-3 lg:p-4 md:p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 lg:p-8 text-center">
            <p className="text-gray-400 text-sm sm:text-base md:text-lg">لا توجد أقسام</p>
          </Card>
        ) : (
          filteredCategories.map((category) => (
            <Card
              key={category.id}
              className="bg-gradient-to-br from-gray-800 to-gray-900 border-white/20 p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-base sm:text-sm sm:text-base md:text-lg md:text-xl font-bold text-white mb-2">{category.name}</h3>
                  {category.description && (
                    <p className="text-sm text-gray-400 mb-3">{category.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Dialog open={isEditDialogOpen && selectedCategory?.id === category.id} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <button
                        onClick={() => handleEditClick(category)}
                        className="p-2 hover:bg-white/10 rounded transition-colors"
                      >
                        <Edit2 className="w-5 h-5 text-blue-400" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-900 border-white/20 max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-white">تعديل القسم</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-white text-sm font-medium mb-2 block">اسم القسم *</label>
                          <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="أدخل اسم القسم"
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-white text-sm font-medium mb-2 block">الوصف</label>
                          <Input
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="أدخل وصف القسم"
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-white text-sm font-medium mb-2 block">ترتيب العرض</label>
                          <Input
                            type="number"
                            value={formData.displayOrder}
                            onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                            placeholder="0"
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        <div className="flex items-center gap-2 sm:p-2.5 md:p-3 lg:p-4">
                          <label className="flex items-center gap-2 text-white cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.showOnHomepage}
                              onChange={(e) => setFormData({ ...formData, showOnHomepage: e.target.checked })}
                              className="w-4 h-4"
                            />
                            <span>عرض على الصفحة الرئيسية</span>
                          </label>
                          <label className="flex items-center gap-2 text-white cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.isActive}
                              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                              className="w-4 h-4"
                            />
                            <span>نشط</span>
                          </label>
                        </div>
                        <Button
                          onClick={handleUpdateCategory}
                          disabled={updateCategoryMutation.isPending}
                          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                        >
                          {updateCategoryMutation.isPending ? 'جاري التحديث...' : 'تحديث القسم'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <button
                    onClick={() => handleDeleteCategory(category)}
                    className="p-2 hover:bg-white/10 rounded transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </button>
                </div>
              </div>

              {/* Category Info */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">ترتيب العرض:</span>
                  <span className="text-white font-medium">{category.displayOrder || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">الحالة:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    category.isActive
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}>
                    {category.isActive ? 'نشط' : 'معطل'}
                  </span>
                </div>
                {category.showOnHomepage && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">معروض على:</span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                      الصفحة الرئيسية
                    </span>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:p-2.5 md:p-3 lg:p-4">
        <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-500/20 p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6">
          <p className="text-blue-300 text-sm mb-2">إجمالي الأقسام</p>
          <p className="text-3xl font-bold text-white">{categories.length}</p>
        </Card>
        <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-500/20 p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6">
          <p className="text-green-300 text-sm mb-2">أقسام نشطة</p>
          <p className="text-3xl font-bold text-white">{categories.filter(c => c.isActive).length}</p>
        </Card>
        <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-500/20 p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6">
          <p className="text-purple-300 text-sm mb-2">معروضة على الرئيسية</p>
          <p className="text-3xl font-bold text-white">{categories.filter(c => c.showOnHomepage).length}</p>
        </Card>
      </div>
    </div>
  );
}
