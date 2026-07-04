import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit2, Trash2, Share2, Plus, Search } from "lucide-react";
import AddProductForm from "./AddProductForm";
import EditProductForm from "./EditProductForm";
import { toast } from "sonner";

export default function ProductManagementDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: products = [], refetch } = trpc.products.getAll.useQuery();
  const deleteProductMutation = trpc.products.delete.useMutation();

  const filteredProducts = products.filter((product: any) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      try {
        await deleteProductMutation.mutateAsync({ id });
        toast.success("تم حذف المنتج بنجاح");
        refetch();
      } catch (error) {
        toast.error("فشل حذف المنتج");
      }
    }
  };

  const handleShareFacebook = (product: any) => {
    const text = `🌹 ${product.name}\n📝 ${product.description || ""}\n💰 السعر: ${product.price} د.ا\n🛍️ تسوق الآن!`;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}&quote=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "width=600,height=600");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">📦 إدارة المنتجات</h1>
          <p className="text-amber-700">إدارة شاملة لجميع منتجات المتجر</p>
        </div>

        {/* Search and Add Button */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-amber-600" size={20} />
            <Input
              placeholder="ابحث عن منتج..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-amber-200"
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                <Plus size={20} className="mr-2" />
                إضافة منتج
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>إضافة منتج جديد</DialogTitle>
              </DialogHeader>
              <AddProductForm
                onSuccess={() => {
                  setIsAddDialogOpen(false);
                  refetch();
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product: any) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gray-200 overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-amber-100">
                    <span className="text-amber-600">لا توجد صورة</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 text-amber-900">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-amber-600">{product.price} د.ا</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    product.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {product.isActive ? "نشط" : "معطل"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Dialog open={isEditDialogOpen && selectedProduct?.id === product.id} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <Edit2 size={16} className="mr-1" />
                        تعديل
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>تعديل المنتج</DialogTitle>
                      </DialogHeader>
                      {selectedProduct && (
                        <EditProductForm
                          product={selectedProduct}
                          onSuccess={() => {
                            setIsEditDialogOpen(false);
                            setSelectedProduct(null);
                            refetch();
                          }}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleShareFacebook(product)}
                  >
                    <Share2 size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">لا توجد منتجات</p>
          </div>
        )}
      </div>
    </div>
  );
}
