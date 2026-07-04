'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Plus, Edit2, Trash2, Play } from 'lucide-react';
import { toast } from 'sonner';

export default function ShowcaseManagement() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    duration: 60,
    displayOrder: 0,
    isActive: true,
    category: '',
  });

  // جميع الصلاحيات متاحة للجميع
  // if (!user || user.role !== 'admin') {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="text-center">
  //         <h1 className="text-sm sm:text-base md:text-lg sm:text-base sm:text-sm sm:text-base md:text-lg md:text-xl md:text-2xl font-bold text-gray-800 mb-4">غير مصرح</h1>
  //         <p className="text-gray-600">ليس لديك صلاحية للوصول إلى هذه الصفحة</p>
  //       </div>
  //     </div>
  //   );
  // }

  const videosQuery = trpc.showcaseVideos.list.useQuery();
  const createMutation = trpc.showcaseVideos.create.useMutation();
  const updateMutation = trpc.showcaseVideos.update.useMutation();
  const deleteMutation = trpc.showcaseVideos.delete.useMutation();

  const videos = videosQuery.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          ...formData,
        });
        toast.success('تم تحديث الفيديو بنجاح');
      } else {
        await createMutation.mutateAsync(formData);
        toast.success('تم إضافة الفيديو بنجاح');
      }

      setIsOpen(false);
      setEditingId(null);
      setFormData({
        title: '',
        description: '',
        videoUrl: '',
        thumbnailUrl: '',
        duration: 60,
        displayOrder: 0,
        isActive: true,
        category: '',
      });

      videosQuery.refetch();
    } catch (error: any) {
      toast.error(error.message || 'حدث خطأ');
    }
  };

  const handleEdit = (video: any) => {
    setFormData({
      title: video.title,
      description: video.description || '',
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl || '',
      duration: video.duration,
      displayOrder: video.displayOrder,
      isActive: video.isActive,
      category: video.category || '',
    });
    setEditingId(video.id);
    setIsOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا الفيديو؟')) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success('تم حذف الفيديو بنجاح');
        videosQuery.refetch();
      } catch (error: any) {
        toast.error(error.message || 'حدث خطأ');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 p-2 sm:p-2.5 md:p-3 lg:p-4 md:p-3 sm:p-2 sm:p-2.5 md:p-3 lg:p-4 md:p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">إدارة شاشة العرض</h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">أضف وعدّل وأعد ترتيب فيديوهات العرض</p>
        </div>

        {/* Add Button */}
        <div className="mb-8">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    title: '',
                    description: '',
                    videoUrl: '',
                    thumbnailUrl: '',
                    duration: 60,
                    displayOrder: 0,
                    isActive: true,
                    category: '',
                  });
                }}
                className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white px-6 py-3 rounded-md sm:rounded-lg font-bold flex items-center gap-2"
              >
                <Plus size={20} />
                إضافة فيديو جديد
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingId ? 'تعديل الفيديو' : 'إضافة فيديو جديد'}</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">العنوان *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="مثال: ملابس نسائية"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="وصف الفيديو"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">رابط الفيديو *</label>
                  <Input
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://example.com/video.mp4"
                    type="url"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">رابط الصورة المصغرة</label>
                  <Input
                    value={formData.thumbnailUrl}
                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                    placeholder="https://example.com/thumbnail.jpg"
                    type="url"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 sm:p-2.5 md:p-3 lg:p-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">المدة (ثانية)</label>
                    <Input
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      type="number"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ترتيب العرض</label>
                    <Input
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                      type="number"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الفئة</label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="مثال: ملابس نسائية"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label className="text-sm font-medium text-gray-700">مفعّل</label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white"
                  >
                    {editingId ? 'تحديث' : 'إضافة'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="flex-1"
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Videos Grid */}
        <div className="grid gap-2 sm:p-2.5 md:p-3 lg:p-4">
          {videos.length === 0 ? (
            <Card className="p-3 sm:p-2 sm:p-2.5 md:p-3 lg:p-4 md:p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 lg:p-8 text-center">
              <p className="text-gray-600 text-sm sm:text-base md:text-lg">لا توجد فيديوهات حالياً</p>
            </Card>
          ) : (
            videos.map((video: any) => (
              <Card key={video.id} className="p-2 sm:p-2.5 md:p-3 lg:p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-2 sm:p-2.5 md:p-3 lg:p-4">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-md sm:rounded-lg overflow-hidden">
                    {video.thumbnailUrl ? (
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-300">
                        <Play size={32} className="text-gray-600" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800">{video.title}</h3>
                        {video.category && (
                          <p className="text-sm text-gray-600">الفئة: {video.category}</p>
                        )}
                      </div>
                      {video.isActive && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          مفعّل
                        </span>
                      )}
                    </div>

                    {video.description && (
                      <p className="text-sm text-gray-600 mb-2">{video.description}</p>
                    )}

                    <div className="flex items-center gap-2 sm:p-2.5 md:p-3 lg:p-4 text-sm text-gray-600 mb-4">
                      <span>المدة: {video.duration} ثانية</span>
                      <span>الترتيب: {video.displayOrder}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(video)}
                        className="flex items-center gap-2"
                      >
                        <Edit2 size={16} />
                        تعديل
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(video.id)}
                        className="flex items-center gap-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                        حذف
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
