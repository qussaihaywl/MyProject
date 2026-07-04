'use client';

import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart, Area, AreaChart
} from 'recharts';
import {
  ShoppingCart, TrendingUp, Users, Package, DollarSign, Search, Filter, Download, Plus, Settings,
  Bell, User, LogOut, Edit, Trash2, Eye, CheckCircle, Clock, AlertCircle, Star, Heart, Share2,
  ChevronDown, ChevronRight, Calendar, MapPin, Phone, Mail, MessageSquare, MoreVertical, X, Save,
  FolderOpen, Warehouse, Tag, Grid3x3, Eye as EyeIcon, EyeOff, Copy, Download as DownloadIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/_core/hooks/useAuth';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

// ============ SAMPLE DATA ============
const chartData = [
  { date: 'Jun 8', orders: 2, revenue: 400 },
  { date: 'Jun 9', orders: 3, revenue: 600 },
  { date: 'Jun 10', orders: 2, revenue: 500 },
  { date: 'Jun 11', orders: 4, revenue: 800 },
  { date: 'Jun 12', orders: 5, revenue: 1200 },
  { date: 'Jun 13', orders: 3, revenue: 700 },
  { date: 'Jun 14', orders: 6, revenue: 1500 },
];

const orderStatusData = [
  { name: 'قيد الانتظار', value: 12, color: '#FFC107' },
  { name: 'قيد المعالجة', value: 8, color: '#E91E63' },
  { name: 'مشحون', value: 15, color: '#D4AF37' },
  { name: 'تم التسليم', value: 25, color: '#4CAF50' },
];

// ============ USERS MANAGEMENT ============
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'user' | 'representative';
  status: 'active' | 'inactive';
  joinDate: string;
  avatar?: string;
}

const initialUsers: User[] = [
  { id: '1', name: 'قصي', email: 'roseonlien@gmail.com', phone: '+962791234567', role: 'admin', status: 'active', joinDate: '2026-01-15', avatar: '👨‍💼' },
  { id: '2', name: 'فاطمة أحمد', email: 'fatima@gmail.com', phone: '+962791234568', role: 'manager', status: 'active', joinDate: '2026-02-20', avatar: '👩‍💼' },
  { id: '3', name: 'سارة محمد', email: 'sara@gmail.com', phone: '+962791234569', role: 'user', status: 'active', joinDate: '2026-03-10', avatar: '👩' },
  { id: '4', name: 'علي حسن', email: 'ali@gmail.com', phone: '+962791234570', role: 'representative', status: 'inactive', joinDate: '2026-04-05', avatar: '👨' },
];

// ============ PRODUCTS MANAGEMENT ============
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  sku: string;
  status: 'active' | 'inactive';
  image?: string;
  description?: string;
  createdDate: string;
}

const initialProducts: Product[] = [
  { id: '1', name: 'فستان فاخر', category: 'الملابس', price: 150, cost: 80, stock: 45, sku: 'DRS001', status: 'active', description: 'فستان نسائي فاخر', createdDate: '2026-05-01', image: '👗' },
  { id: '2', name: 'عقد ذهبي', category: 'الإكسسوارات', price: 280, cost: 150, stock: 12, sku: 'ACC001', status: 'active', description: 'عقد ذهبي عيار 18', createdDate: '2026-05-05', image: '✨' },
  { id: '3', name: 'أريكة فخمة', category: 'الأثاث', price: 1200, cost: 600, stock: 5, sku: 'FUR001', status: 'active', description: 'أريكة جلدية فاخرة', createdDate: '2026-05-10', image: '🛋️' },
];

// ============ CATEGORIES MANAGEMENT ============
interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  status: 'active' | 'inactive';
  createdDate: string;
  icon?: string;
}

const initialCategories: Category[] = [
  { id: '1', name: 'الملابس', description: 'ملابس نسائية ورجالية', productCount: 45, status: 'active', createdDate: '2026-01-01', icon: '👗' },
  { id: '2', name: 'الإكسسوارات', description: 'مجوهرات وإكسسوارات', productCount: 32, status: 'active', createdDate: '2026-01-05', icon: '✨' },
  { id: '3', name: 'الأثاث', description: 'أثاث منزلي وديكور', productCount: 18, status: 'active', createdDate: '2026-01-10', icon: '🛋️' },
];

// ============ INVENTORY MANAGEMENT ============
interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  warehouse: string;
  quantity: number;
  minStock: number;
  maxStock: number;
  status: 'ok' | 'low' | 'critical';
  lastUpdated: string;
}

const initialInventory: InventoryItem[] = [
  { id: '1', productId: '1', productName: 'فستان فاخر', warehouse: 'المستودع الرئيسي', quantity: 45, minStock: 10, maxStock: 100, status: 'ok', lastUpdated: '2026-06-14' },
  { id: '2', productId: '2', productName: 'عقد ذهبي', warehouse: 'مستودع الإكسسوارات', quantity: 5, minStock: 5, maxStock: 50, status: 'low', lastUpdated: '2026-06-14' },
  { id: '3', productId: '3', productName: 'أريكة فخمة', warehouse: 'مستودع الأثاث', quantity: 2, minStock: 3, maxStock: 20, status: 'critical', lastUpdated: '2026-06-14' },
];

// ============ MAIN COMPONENT ============
export default function PremiumAdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);

  // ============ MODALS STATE ============
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddInventoryModal, setShowAddInventoryModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingInventory, setEditingInventory] = useState<InventoryItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string } | null>(null);

  // ============ FORM STATE ============
  const [userForm, setUserForm] = useState<{ name: string; email: string; phone: string; role: 'admin' | 'manager' | 'user' | 'representative'; status: 'active' | 'inactive' }>({ name: '', email: '', phone: '', role: 'user', status: 'active' });
  const [productForm, setProductForm] = useState({ name: '', category: '', price: 0, cost: 0, stock: 0, sku: '', description: '' });
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', icon: '📁' });
  const [inventoryForm, setInventoryForm] = useState({ productId: '', warehouse: '', quantity: 0, minStock: 0, maxStock: 0 });

  // ============ USER HANDLERS ============
  const handleAddUser = () => {
    if (!userForm.name || !userForm.email) {
      toast.error('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }
    const newUser: User = {
      id: Date.now().toString(),
      ...userForm,
      joinDate: new Date().toISOString().split('T')[0],
      avatar: '👤',
    };
    setUsers([...users, newUser]);
    setUserForm({ name: '', email: '', phone: '', role: 'user', status: 'active' });
    setShowAddUserModal(false);
    toast.success('تم إضافة المستخدم بنجاح');
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserForm({ name: user.name, email: user.email, phone: user.phone, role: user.role, status: user.status });
    setShowAddUserModal(true);
  };

  const handleSaveUser = () => {
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...userForm } : u));
      toast.success('تم تحديث المستخدم بنجاح');
    }
    setEditingUser(null);
    setUserForm({ name: '', email: '', phone: '', role: 'user', status: 'active' });
    setShowAddUserModal(false);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    toast.success('تم حذف المستخدم بنجاح');
    setDeleteConfirm(null);
  };

  // ============ PRODUCT HANDLERS ============
  const handleAddProduct = () => {
    if (!productForm.name || !productForm.category) {
      toast.error('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }
    const newProduct: Product = {
      id: Date.now().toString(),
      ...productForm,
      status: 'active',
      createdDate: new Date().toISOString().split('T')[0],
      image: '📦',
    };
    setProducts([...products, newProduct]);
    setProductForm({ name: '', category: '', price: 0, cost: 0, stock: 0, sku: '', description: '' });
    setShowAddProductModal(false);
    toast.success('تم إضافة المنتج بنجاح');
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({ name: product.name, category: product.category, price: product.price, cost: product.cost, stock: product.stock, sku: product.sku, description: product.description || '' });
    setShowAddProductModal(true);
  };

  const handleSaveProduct = () => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...productForm } : p));
      toast.success('تم تحديث المنتج بنجاح');
    }
    setEditingProduct(null);
    setProductForm({ name: '', category: '', price: 0, cost: 0, stock: 0, sku: '', description: '' });
    setShowAddProductModal(false);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success('تم حذف المنتج بنجاح');
    setDeleteConfirm(null);
  };

  // ============ CATEGORY HANDLERS ============
  const handleAddCategory = () => {
    if (!categoryForm.name) {
      toast.error('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }
    const newCategory: Category = {
      id: Date.now().toString(),
      ...categoryForm,
      productCount: 0,
      status: 'active',
      createdDate: new Date().toISOString().split('T')[0],
    };
    setCategories([...categories, newCategory]);
    setCategoryForm({ name: '', description: '', icon: '📁' });
    setShowAddCategoryModal(false);
    toast.success('تم إضافة الفئة بنجاح');
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({ name: category.name, description: category.description, icon: category.icon || '📁' });
    setShowAddCategoryModal(true);
  };

  const handleSaveCategory = () => {
    if (editingCategory) {
      setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, ...categoryForm } : c));
      toast.success('تم تحديث الفئة بنجاح');
    }
    setEditingCategory(null);
    setCategoryForm({ name: '', description: '', icon: '📁' });
    setShowAddCategoryModal(false);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
    toast.success('تم حذف الفئة بنجاح');
    setDeleteConfirm(null);
  };

  // ============ INVENTORY HANDLERS ============
  const handleAddInventory = () => {
    if (!inventoryForm.productId || !inventoryForm.warehouse) {
      toast.error('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }
    const newInventory: InventoryItem = {
      id: Date.now().toString(),
      ...inventoryForm,
      productName: products.find(p => p.id === inventoryForm.productId)?.name || '',
      status: 'ok',
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    setInventory([...inventory, newInventory]);
    setInventoryForm({ productId: '', warehouse: '', quantity: 0, minStock: 0, maxStock: 0 });
    setShowAddInventoryModal(false);
    toast.success('تم إضافة المستودع بنجاح');
  };

  const handleEditInventory = (item: InventoryItem) => {
    setEditingInventory(item);
    setInventoryForm({ productId: item.productId, warehouse: item.warehouse, quantity: item.quantity, minStock: item.minStock, maxStock: item.maxStock });
    setShowAddInventoryModal(true);
  };

  const handleSaveInventory = () => {
    if (editingInventory) {
      setInventory(inventory.map(i => i.id === editingInventory.id ? { ...i, ...inventoryForm } : i));
      toast.success('تم تحديث المستودع بنجاح');
    }
    setEditingInventory(null);
    setInventoryForm({ productId: '', warehouse: '', quantity: 0, minStock: 0, maxStock: 0 });
    setShowAddInventoryModal(false);
  };

  const handleDeleteInventory = (id: string) => {
    setInventory(inventory.filter(i => i.id !== id));
    toast.success('تم حذف المستودع بنجاح');
    setDeleteConfirm(null);
  };

  // ============ EXPORT HANDLERS ============
  const handleExportData = (type: string) => {
    let data = '';
    if (type === 'users') {
      data = JSON.stringify(users, null, 2);
    } else if (type === 'products') {
      data = JSON.stringify(products, null, 2);
    } else if (type === 'categories') {
      data = JSON.stringify(categories, null, 2);
    } else if (type === 'inventory') {
      data = JSON.stringify(inventory, null, 2);
    }
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    element.setAttribute('download', `${type}-export-${new Date().toISOString().split('T')[0]}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success(`تم تصدير بيانات ${type} بنجاح`);
  };

  // ============ FILTERED DATA ============
  const filteredUsers = useMemo(() => {
    return users.filter(u => u.name.includes(searchQuery) || u.email.includes(searchQuery));
  }, [users, searchQuery]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => p.name.includes(searchQuery) || p.sku.includes(searchQuery));
  }, [products, searchQuery]);

  const filteredCategories = useMemo(() => {
    return categories.filter(c => c.name.includes(searchQuery));
  }, [categories, searchQuery]);

  const filteredInventory = useMemo(() => {
    return inventory.filter(i => i.productName.includes(searchQuery) || i.warehouse.includes(searchQuery));
  }, [inventory, searchQuery]);

  // ============ RENDER FUNCTIONS ============
  const renderUserModal = () => (
    <Dialog open={showAddUserModal} onOpenChange={setShowAddUserModal}>
      <DialogContent className="bg-gradient-to-br from-pink-50 to-yellow-50 border-2 border-pink-200 rounded-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-yellow-600">
            {editingUser ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="الاسم"
            value={userForm.name}
            onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
            className="border-2 border-pink-300 rounded-lg"
          />
          <Input
            placeholder="البريد الإلكتروني"
            value={userForm.email}
            onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
            className="border-2 border-pink-300 rounded-lg"
          />
          <Input
            placeholder="رقم الهاتف"
            value={userForm.phone}
            onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
            className="border-2 border-pink-300 rounded-lg"
          />
          <Select value={userForm.role} onValueChange={(value: any) => setUserForm({ ...userForm, role: value })}>
            <SelectTrigger className="border-2 border-pink-300 rounded-lg">
              <SelectValue placeholder="اختر الدور" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">مستخدم</SelectItem>
              <SelectItem value="manager">مدير</SelectItem>
              <SelectItem value="admin">مسؤول</SelectItem>
              <SelectItem value="representative">ممثل</SelectItem>
            </SelectContent>
          </Select>
          <Select value={userForm.status} onValueChange={(value: any) => setUserForm({ ...userForm, status: value })}>
            <SelectTrigger className="border-2 border-pink-300 rounded-lg">
              <SelectValue placeholder="اختر الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">نشط</SelectItem>
              <SelectItem value="inactive">غير نشط</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button
              onClick={editingUser ? handleSaveUser : handleAddUser}
              className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold rounded-lg"
            >
              <Save className="w-4 h-4 mr-2" />
              {editingUser ? 'حفظ التغييرات' : 'إضافة'}
            </Button>
            <Button
              onClick={() => {
                setShowAddUserModal(false);
                setEditingUser(null);
                setUserForm({ name: '', email: '', phone: '', role: 'user', status: 'active' });
              }}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-lg"
            >
              إلغاء
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderProductModal = () => (
    <Dialog open={showAddProductModal} onOpenChange={setShowAddProductModal}>
      <DialogContent className="bg-gradient-to-br from-pink-50 to-yellow-50 border-2 border-pink-200 rounded-2xl max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-yellow-600">
            {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="اسم المنتج"
            value={productForm.name}
            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
            className="border-2 border-pink-300 rounded-lg"
          />
          <Select value={productForm.category} onValueChange={(value) => setProductForm({ ...productForm, category: value })}>
            <SelectTrigger className="border-2 border-pink-300 rounded-lg">
              <SelectValue placeholder="اختر الفئة" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(c => (
                <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="السعر"
            type="number"
            value={productForm.price}
            onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) })}
            className="border-2 border-pink-300 rounded-lg"
          />
          <Input
            placeholder="التكلفة"
            type="number"
            value={productForm.cost}
            onChange={(e) => setProductForm({ ...productForm, cost: parseFloat(e.target.value) })}
            className="border-2 border-pink-300 rounded-lg"
          />
          <Input
            placeholder="المخزون"
            type="number"
            value={productForm.stock}
            onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) })}
            className="border-2 border-pink-300 rounded-lg"
          />
          <Input
            placeholder="رمز المنتج (SKU)"
            value={productForm.sku}
            onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
            className="border-2 border-pink-300 rounded-lg"
          />
          <Textarea
            placeholder="الوصف"
            value={productForm.description}
            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
            className="border-2 border-pink-300 rounded-lg"
          />
          <div className="flex gap-2">
            <Button
              onClick={editingProduct ? handleSaveProduct : handleAddProduct}
              className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold rounded-lg"
            >
              <Save className="w-4 h-4 mr-2" />
              {editingProduct ? 'حفظ التغييرات' : 'إضافة'}
            </Button>
            <Button
              onClick={() => {
                setShowAddProductModal(false);
                setEditingProduct(null);
                setProductForm({ name: '', category: '', price: 0, cost: 0, stock: 0, sku: '', description: '' });
              }}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-lg"
            >
              إلغاء
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderCategoryModal = () => (
    <Dialog open={showAddCategoryModal} onOpenChange={setShowAddCategoryModal}>
      <DialogContent className="bg-gradient-to-br from-pink-50 to-yellow-50 border-2 border-pink-200 rounded-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-yellow-600">
            {editingCategory ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="اسم الفئة"
            value={categoryForm.name}
            onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
            className="border-2 border-pink-300 rounded-lg"
          />
          <Textarea
            placeholder="وصف الفئة"
            value={categoryForm.description}
            onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
            className="border-2 border-pink-300 rounded-lg"
          />
          <Input
            placeholder="الأيقونة (emoji)"
            value={categoryForm.icon}
            onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
            className="border-2 border-pink-300 rounded-lg"
          />
          <div className="flex gap-2">
            <Button
              onClick={editingCategory ? handleSaveCategory : handleAddCategory}
              className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold rounded-lg"
            >
              <Save className="w-4 h-4 mr-2" />
              {editingCategory ? 'حفظ التغييرات' : 'إضافة'}
            </Button>
            <Button
              onClick={() => {
                setShowAddCategoryModal(false);
                setEditingCategory(null);
                setCategoryForm({ name: '', description: '', icon: '📁' });
              }}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-lg"
            >
              إلغاء
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderInventoryModal = () => (
    <Dialog open={showAddInventoryModal} onOpenChange={setShowAddInventoryModal}>
      <DialogContent className="bg-gradient-to-br from-pink-50 to-yellow-50 border-2 border-pink-200 rounded-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-yellow-600">
            {editingInventory ? 'تعديل المستودع' : 'إضافة مستودع جديد'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select value={inventoryForm.productId} onValueChange={(value) => setInventoryForm({ ...inventoryForm, productId: value })}>
            <SelectTrigger className="border-2 border-pink-300 rounded-lg">
              <SelectValue placeholder="اختر المنتج" />
            </SelectTrigger>
            <SelectContent>
              {products.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="اسم المستودع"
            value={inventoryForm.warehouse}
            onChange={(e) => setInventoryForm({ ...inventoryForm, warehouse: e.target.value })}
            className="border-2 border-pink-300 rounded-lg"
          />
          <Input
            placeholder="الكمية"
            type="number"
            value={inventoryForm.quantity}
            onChange={(e) => setInventoryForm({ ...inventoryForm, quantity: parseInt(e.target.value) })}
            className="border-2 border-pink-300 rounded-lg"
          />
          <Input
            placeholder="الحد الأدنى"
            type="number"
            value={inventoryForm.minStock}
            onChange={(e) => setInventoryForm({ ...inventoryForm, minStock: parseInt(e.target.value) })}
            className="border-2 border-pink-300 rounded-lg"
          />
          <Input
            placeholder="الحد الأقصى"
            type="number"
            value={inventoryForm.maxStock}
            onChange={(e) => setInventoryForm({ ...inventoryForm, maxStock: parseInt(e.target.value) })}
            className="border-2 border-pink-300 rounded-lg"
          />
          <div className="flex gap-2">
            <Button
              onClick={editingInventory ? handleSaveInventory : handleAddInventory}
              className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold rounded-lg"
            >
              <Save className="w-4 h-4 mr-2" />
              {editingInventory ? 'حفظ التغييرات' : 'إضافة'}
            </Button>
            <Button
              onClick={() => {
                setShowAddInventoryModal(false);
                setEditingInventory(null);
                setInventoryForm({ productId: '', warehouse: '', quantity: 0, minStock: 0, maxStock: 0 });
              }}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-lg"
            >
              إلغاء
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-yellow-50 to-pink-50 p-6 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-yellow-600 to-pink-600 mb-2">
            لوحة التحكم الإدارية المتقدمة
          </h1>
          <p className="text-gray-600">مرحباً بك {user?.name} 👋</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-yellow-400 to-yellow-500 border-0 shadow-lg hover:shadow-xl transition-shadow p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-900 font-semibold">إجمالي الطلبات</p>
                <p className="text-3xl font-bold text-white">156</p>
                <p className="text-yellow-800 text-sm">↑ 12%</p>
              </div>
              <ShoppingCart className="w-12 h-12 text-yellow-900 opacity-30" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-pink-400 to-pink-500 border-0 shadow-lg hover:shadow-xl transition-shadow p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-900 font-semibold">إجمالي الإيرادات</p>
                <p className="text-3xl font-bold text-white">$45,230</p>
                <p className="text-pink-800 text-sm">↑ 8%</p>
              </div>
              <DollarSign className="w-12 h-12 text-pink-900 opacity-30" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-rose-400 to-rose-500 border-0 shadow-lg hover:shadow-xl transition-shadow p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-rose-900 font-semibold">المنتجات المتاحة</p>
                <p className="text-3xl font-bold text-white">234</p>
                <p className="text-rose-800 text-sm">↓ 3%</p>
              </div>
              <Package className="w-12 h-12 text-rose-900 opacity-30" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-amber-400 to-amber-500 border-0 shadow-lg hover:shadow-xl transition-shadow p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-900 font-semibold">المستخدمون النشطون</p>
                <p className="text-3xl font-bold text-white">1,234</p>
                <p className="text-amber-800 text-sm">↑ 15%</p>
              </div>
              <Users className="w-12 h-12 text-amber-900 opacity-30" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-7 w-full bg-gradient-to-r from-pink-200 to-yellow-200 p-2 rounded-2xl border-2 border-pink-300 mb-6">
            <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-pink-600 data-[state=active]:text-white">نظرة عامة</TabsTrigger>
            <TabsTrigger value="products" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-pink-600 data-[state=active]:text-white">المنتجات</TabsTrigger>
            <TabsTrigger value="orders" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-pink-600 data-[state=active]:text-white">الطلبات</TabsTrigger>
            <TabsTrigger value="users" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-pink-600 data-[state=active]:text-white">المستخدمون</TabsTrigger>
            <TabsTrigger value="categories" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-pink-600 data-[state=active]:text-white">الفئات</TabsTrigger>
            <TabsTrigger value="inventory" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-pink-600 data-[state=active]:text-white">المستودعات</TabsTrigger>
            <TabsTrigger value="reports" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-pink-600 data-[state=active]:text-white">التقارير</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border-2 border-pink-200 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-pink-600 mb-4">📈 الطلبات والإيرادات</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E91E63" opacity={0.2} />
                    <XAxis dataKey="date" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="#D4AF37" fillOpacity={1} fill="url(#colorRevenue)" name="الإيرادات" />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              <Card className="bg-white border-2 border-pink-200 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-pink-600 mb-4">🎯 توزيع حالات الطلبات</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={orderStatusData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-4">
            <div className="flex gap-4 mb-4">
              <Input
                placeholder="ابحث عن المنتجات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-2 border-pink-300 rounded-lg"
              />
              <Button
                onClick={() => {
                  setShowAddProductModal(true);
                  setEditingProduct(null);
                  setProductForm({ name: '', category: '', price: 0, cost: 0, stock: 0, sku: '', description: '' });
                }}
                className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold rounded-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                منتج جديد
              </Button>
              <Button
                onClick={() => handleExportData('products')}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold rounded-lg"
              >
                <Download className="w-4 h-4 mr-2" />
                تصدير
              </Button>
            </div>

            <Card className="bg-white border-2 border-pink-200 rounded-2xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
                    <tr>
                      <th className="px-6 py-3 text-right">اسم المنتج</th>
                      <th className="px-6 py-3 text-right">الفئة</th>
                      <th className="px-6 py-3 text-right">السعر</th>
                      <th className="px-6 py-3 text-right">المخزون</th>
                      <th className="px-6 py-3 text-right">الحالة</th>
                      <th className="px-6 py-3 text-right">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b border-pink-200 hover:bg-pink-50 transition-colors">
                        <td className="px-6 py-3">{product.name}</td>
                        <td className="px-6 py-3">{product.category}</td>
                        <td className="px-6 py-3">${product.price}</td>
                        <td className="px-6 py-3">{product.stock}</td>
                        <td className="px-6 py-3">
                          <Badge className={`${product.status === 'active' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                            {product.status === 'active' ? 'نشط' : 'غير نشط'}
                          </Badge>
                        </td>
                        <td className="px-6 py-3 flex gap-2">
                          <Button
                            onClick={() => handleEditProduct(product)}
                            size="sm"
                            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => setDeleteConfirm({ type: 'product', id: product.id })}
                            size="sm"
                            className="bg-red-500 hover:bg-red-600 text-white rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex gap-4 mb-4">
              <Input
                placeholder="ابحث عن المستخدمين..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-2 border-pink-300 rounded-lg"
              />
              <Button
                onClick={() => {
                  setShowAddUserModal(true);
                  setEditingUser(null);
                  setUserForm({ name: '', email: '', phone: '', role: 'user', status: 'active' });
                }}
                className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold rounded-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                مستخدم جديد
              </Button>
              <Button
                onClick={() => handleExportData('users')}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold rounded-lg"
              >
                <Download className="w-4 h-4 mr-2" />
                تصدير
              </Button>
            </div>

            <Card className="bg-white border-2 border-pink-200 rounded-2xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
                    <tr>
                      <th className="px-6 py-3 text-right">الاسم</th>
                      <th className="px-6 py-3 text-right">البريد الإلكتروني</th>
                      <th className="px-6 py-3 text-right">الدور</th>
                      <th className="px-6 py-3 text-right">الحالة</th>
                      <th className="px-6 py-3 text-right">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-pink-200 hover:bg-pink-50 transition-colors">
                        <td className="px-6 py-3">{user.name}</td>
                        <td className="px-6 py-3">{user.email}</td>
                        <td className="px-6 py-3">
                          <Badge className="bg-purple-500 text-white">
                            {user.role === 'admin' ? 'مسؤول' : user.role === 'manager' ? 'مدير' : user.role === 'user' ? 'مستخدم' : 'ممثل'}
                          </Badge>
                        </td>
                        <td className="px-6 py-3">
                          <Badge className={`${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                            {user.status === 'active' ? 'نشط' : 'غير نشط'}
                          </Badge>
                        </td>
                        <td className="px-6 py-3 flex gap-2">
                          <Button
                            onClick={() => handleEditUser(user)}
                            size="sm"
                            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => setDeleteConfirm({ type: 'user', id: user.id })}
                            size="sm"
                            className="bg-red-500 hover:bg-red-600 text-white rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-4">
            <div className="flex gap-4 mb-4">
              <Input
                placeholder="ابحث عن الفئات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-2 border-pink-300 rounded-lg"
              />
              <Button
                onClick={() => {
                  setShowAddCategoryModal(true);
                  setEditingCategory(null);
                  setCategoryForm({ name: '', description: '', icon: '📁' });
                }}
                className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold rounded-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                فئة جديدة
              </Button>
              <Button
                onClick={() => handleExportData('categories')}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold rounded-lg"
              >
                <Download className="w-4 h-4 mr-2" />
                تصدير
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCategories.map((category) => (
                <Card key={category.id} className="bg-white border-2 border-pink-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{category.icon}</div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEditCategory(category)}
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => setDeleteConfirm({ type: 'category', id: category.id })}
                        size="sm"
                        className="bg-red-500 hover:bg-red-600 text-white rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-pink-600 mb-2">{category.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">المنتجات: {category.productCount}</span>
                    <Badge className={`${category.status === 'active' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                      {category.status === 'active' ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-4">
            <div className="flex gap-4 mb-4">
              <Input
                placeholder="ابحث عن المستودعات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-2 border-pink-300 rounded-lg"
              />
              <Button
                onClick={() => {
                  setShowAddInventoryModal(true);
                  setEditingInventory(null);
                  setInventoryForm({ productId: '', warehouse: '', quantity: 0, minStock: 0, maxStock: 0 });
                }}
                className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold rounded-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                مستودع جديد
              </Button>
              <Button
                onClick={() => handleExportData('inventory')}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold rounded-lg"
              >
                <Download className="w-4 h-4 mr-2" />
                تصدير
              </Button>
            </div>

            <Card className="bg-white border-2 border-pink-200 rounded-2xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
                    <tr>
                      <th className="px-6 py-3 text-right">المنتج</th>
                      <th className="px-6 py-3 text-right">المستودع</th>
                      <th className="px-6 py-3 text-right">الكمية</th>
                      <th className="px-6 py-3 text-right">الحد الأدنى</th>
                      <th className="px-6 py-3 text-right">الحالة</th>
                      <th className="px-6 py-3 text-right">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventory.map((item) => (
                      <tr key={item.id} className="border-b border-pink-200 hover:bg-pink-50 transition-colors">
                        <td className="px-6 py-3">{item.productName}</td>
                        <td className="px-6 py-3">{item.warehouse}</td>
                        <td className="px-6 py-3">{item.quantity}</td>
                        <td className="px-6 py-3">{item.minStock}</td>
                        <td className="px-6 py-3">
                          <Badge className={`${item.status === 'ok' ? 'bg-green-500' : item.status === 'low' ? 'bg-yellow-500' : 'bg-red-500'} text-white`}>
                            {item.status === 'ok' ? 'جيد' : item.status === 'low' ? 'منخفض' : 'حرج'}
                          </Badge>
                        </td>
                        <td className="px-6 py-3 flex gap-2">
                          <Button
                            onClick={() => handleEditInventory(item)}
                            size="sm"
                            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => setDeleteConfirm({ type: 'inventory', id: item.id })}
                            size="sm"
                            className="bg-red-500 hover:bg-red-600 text-white rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <Card className="bg-white border-2 border-pink-200 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-pink-600 mb-4">📊 التقارير المتقدمة</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-lg p-6 h-auto flex flex-col items-center gap-2">
                  <BarChart className="w-8 h-8" />
                  تقرير المبيعات الشهري
                </Button>
                <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-lg p-6 h-auto flex flex-col items-center gap-2">
                  <LineChart className="w-8 h-8" />
                  تقرير الإيرادات
                </Button>
                <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold rounded-lg p-6 h-auto flex flex-col items-center gap-2">
                  <Users className="w-8 h-8" />
                  تقرير المستخدمين
                </Button>
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-lg p-6 h-auto flex flex-col items-center gap-2">
                  <Package className="w-8 h-8" />
                  تقرير المخزون
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        {deleteConfirm && (
          <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
            <DialogContent className="bg-white border-2 border-red-300 rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-red-600">تأكيد الحذف</DialogTitle>
              </DialogHeader>
              <p className="text-gray-600 mb-4">هل أنت متأكد من رغبتك في حذف هذا العنصر؟</p>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    if (deleteConfirm.type === 'user') handleDeleteUser(deleteConfirm.id);
                    else if (deleteConfirm.type === 'product') handleDeleteProduct(deleteConfirm.id);
                    else if (deleteConfirm.type === 'category') handleDeleteCategory(deleteConfirm.id);
                    else if (deleteConfirm.type === 'inventory') handleDeleteInventory(deleteConfirm.id);
                  }}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg"
                >
                  حذف
                </Button>
                <Button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-lg"
                >
                  إلغاء
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Modals */}
        {renderUserModal()}
        {renderProductModal()}
        {renderCategoryModal()}
        {renderInventoryModal()}
      </div>
    </div>
  );
}
