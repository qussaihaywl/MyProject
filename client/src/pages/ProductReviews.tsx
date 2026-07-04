'use client';

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Star,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  User,
  Calendar,
  Image as ImageIcon,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";

export default function ProductReviews({ productId }: { productId?: number }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  // Fetch reviews
  const { data: reviews, isLoading, refetch } = trpc.reviews.getByProduct.useQuery({
    productId: productId || 1,
  });

  // Create review mutation
  const createReviewMutation = trpc.reviews.create.useMutation({
    onSuccess: () => {
      toast.success("تم إضافة المراجعة بنجاح!");
      setRating(5);
      setTitle("");
      setContent("");
      setImages([]);
      setShowForm(false);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "حدث خطأ في إضافة المراجعة");
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      toast.error("يمكنك إضافة 5 صور كحد أقصى");
      return;
    }
    setImages([...images, ...files]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    createReviewMutation.mutate({
      productId: productId || 1,
      rating,
      title,
      content,
      imageUrls: images.map((img) => img.name),
    });
  };

  const reviewsList = reviews || [];
  const averageRating =
    reviewsList.length > 0
      ? (
          reviewsList.reduce((sum: number, r: any) => sum + r.rating, 0) /
          reviewsList.length
        ).toFixed(1)
      : 0;

  const ratingDistribution = {
    5: reviewsList.filter((r: any) => r.rating === 5).length,
    4: reviewsList.filter((r: any) => r.rating === 4).length,
    3: reviewsList.filter((r: any) => r.rating === 3).length,
    2: reviewsList.filter((r: any) => r.rating === 2).length,
    1: reviewsList.filter((r: any) => r.rating === 1).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-amber-500 bg-clip-text text-transparent mb-2 flex items-center gap-3">
            <MessageSquare className="w-10 h-10 text-rose-600" />
            تقييمات المنتج
          </h1>
          <p className="text-slate-600">
            اقرأ آراء المشترين وشارك تقييمك الخاص
          </p>
        </div>

        {/* Summary Card */}
        <Card className="border-0 shadow-lg mb-8 bg-gradient-to-r from-rose-50 to-amber-50 hover:shadow-xl transition-all duration-300">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Average Rating */}
              <div className="flex flex-col items-center justify-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-rose-600 to-amber-500 bg-clip-text text-transparent mb-2">
                  {averageRating}
                </div>
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(Number(averageRating))
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-slate-600">
                  {reviewsList.length} تقييم
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 w-8 flex items-center gap-1">
                      {[...Array(stars)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-rose-500 to-amber-400 h-2 rounded-full transition-all"
                        style={{
                          width: `${
                            reviewsList.length > 0
                              ? (ratingDistribution[stars as keyof typeof ratingDistribution] /
                                  reviewsList.length) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-slate-600 w-8">
                      {ratingDistribution[stars as keyof typeof ratingDistribution]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Review Button */}
        {user && (
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button className="w-full mb-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-6 text-lg">
                <Star className="w-5 h-5 ml-2" />
                أضف تقييماً
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>أضف تقييماً للمنتج</DialogTitle>
                <DialogDescription>
                  شارك رأيك وساعد المشترين الآخرين
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    التقييم
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= (hoveredRating || rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    عنوان التقييم
                  </label>
                  <Input
                    placeholder="مثال: منتج رائع جداً"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    تفاصيل التقييم
                  </label>
                  <Textarea
                    placeholder="شارك تجربتك مع المنتج..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                  />
                </div>

                {/* Images */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    صور (اختياري - حد أقصى 5 صور)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <label className="cursor-pointer flex flex-col items-center gap-2">
                      <Upload className="w-6 h-6 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        اضغط لاختيار الصور
                      </span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Selected Images */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-4">
                      {images.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative bg-gray-100 rounded-lg p-2"
                        >
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                          <button
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <p className="text-xs text-gray-600 mt-1 truncate">
                            {img.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={handleSubmitReview}
                    disabled={createReviewMutation.isPending}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {createReviewMutation.isPending ? "جاري الإرسال..." : "إرسال التقييم"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="flex-1"
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {isLoading ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6 text-center">
                جاري التحميل...
              </CardContent>
            </Card>
          ) : reviewsList.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6 text-center text-slate-600">
                لا توجد تقييمات بعد. كن أول من يقيم هذا المنتج!
              </CardContent>
            </Card>
          ) : (
            reviewsList.map((review: any) => (
              <Card key={review.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                        {review.userName?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {review.userName}
                        </p>
                        <p className="text-sm text-slate-500">
                          {new Date(review.createdAt).toLocaleDateString("ar-SA")}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Title and Content */}
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {review.title}
                  </h3>
                  <p className="text-slate-700 mb-4">{review.content}</p>

                  {/* Images */}
                  {review.images && review.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {review.images.map((img: string, idx: number) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Review image ${idx + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex gap-4 pt-4 border-t">
                    <button className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm">مفيد</span>
                    </button>
                    <button className="flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors">
                      <ThumbsDown className="w-4 h-4" />
                      <span className="text-sm">غير مفيد</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
