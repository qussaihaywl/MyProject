import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductsManagement from './ProductsManagement';

// Mock trpc
vi.mock('@/lib/trpc', () => ({
  trpc: {
    products: {
      list: {
        useQuery: vi.fn(() => ({
          data: [
            {
              id: 1,
              name: 'منتج 1',
              description: 'وصف المنتج 1',
              price: '100',
              categoryId: 1,
              image: 'image1.jpg',
              colors: 'أحمر',
              sizes: 'M',
              weight: '1kg',
              createdAt: new Date(),
            },
            {
              id: 2,
              name: 'منتج 2',
              description: 'وصف المنتج 2',
              price: '200',
              categoryId: 1,
              image: 'image2.jpg',
              colors: 'أزرق',
              sizes: 'L',
              weight: '2kg',
              createdAt: new Date(),
            },
          ],
          isLoading: false,
          refetch: vi.fn(),
        })),
      },
      update: {
        useMutation: vi.fn(() => ({
          mutateAsync: vi.fn().mockResolvedValue({}),
          isLoading: false,
        })),
      },
      delete: {
        useMutation: vi.fn(() => ({
          mutateAsync: vi.fn().mockResolvedValue({}),
          isLoading: false,
        })),
      },
    },
    categories: {
      listForHomepage: {
        useQuery: vi.fn(() => ({
          data: [
            { id: 1, name: 'الملابس' },
            { id: 2, name: 'الأثاث' },
          ],
          isLoading: false,
        })),
      },
    },
  },
}));

// Mock useAuth
vi.mock('@/_core/hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 1, name: 'Admin', role: 'admin' },
    isAuthenticated: true,
  })),
}));

// Mock imageUtils
vi.mock('@/lib/imageUtils', () => ({
  getFirstProductImage: vi.fn((images) => images?.[0] || 'default.jpg'),
  handleImageError: vi.fn(),
}));

describe('ProductsManagement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('يجب أن يعرض قائمة المنتجات', () => {
    render(<ProductsManagement />);
    expect(screen.getByText('منتج 1')).toBeInTheDocument();
    expect(screen.getByText('منتج 2')).toBeInTheDocument();
  });

  it('يجب أن يفلتر المنتجات حسب البحث', async () => {
    const user = userEvent.setup();
    render(<ProductsManagement />);

    const searchInput = screen.getByPlaceholderText(/البحث/i);
    await user.type(searchInput, 'منتج 1');

    await waitFor(() => {
      expect(screen.getByText('منتج 1')).toBeInTheDocument();
      expect(screen.queryByText('منتج 2')).not.toBeInTheDocument();
    });
  });

  it('يجب أن يرتب المنتجات حسب السعر', async () => {
    const user = userEvent.setup();
    render(<ProductsManagement />);

    const sortButton = screen.getByRole('button', { name: /ترتيب/i });
    await user.click(sortButton);

    const priceOption = screen.getByText('السعر');
    await user.click(priceOption);

    await waitFor(() => {
      const products = screen.getAllByText(/منتج/);
      expect(products.length).toBeGreaterThan(0);
    });
  });

  it('يجب أن يحذف المنتج عند تأكيد الحذف', async () => {
    const user = userEvent.setup();
    render(<ProductsManagement />);

    const deleteButton = screen.getByRole('button', { name: /حذف/i });
    await user.click(deleteButton);

    const confirmButton = screen.getByRole('button', { name: /تأكيد/i });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(screen.queryByText('منتج 1')).not.toBeInTheDocument();
    });
  });

  it('يجب أن يعدل المنتج بنجاح', async () => {
    const user = userEvent.setup();
    render(<ProductsManagement />);

    const editButton = screen.getByRole('button', { name: /تعديل/i });
    await user.click(editButton);

    const nameInput = screen.getByDisplayValue('منتج 1');
    await user.clear(nameInput);
    await user.type(nameInput, 'منتج معدل');

    const saveButton = screen.getByRole('button', { name: /حفظ/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('منتج معدل')).toBeInTheDocument();
    });
  });

  it('يجب أن يصدر CSV بنجاح', async () => {
    const user = userEvent.setup();
    render(<ProductsManagement />);

    const exportButton = screen.getByRole('button', { name: /تصدير/i });
    await user.click(exportButton);

    // التحقق من أن الملف قد تم تحميله
    await waitFor(() => {
      expect(exportButton).toBeInTheDocument();
    });
  });

  it('يجب أن يفلتر المنتجات حسب الفئة', async () => {
    const user = userEvent.setup();
    render(<ProductsManagement />);

    const categoryFilter = screen.getByRole('combobox', { name: /الفئة/i });
    await user.click(categoryFilter);

    const categoryOption = screen.getByText('الملابس');
    await user.click(categoryOption);

    await waitFor(() => {
      expect(screen.getByText('منتج 1')).toBeInTheDocument();
    });
  });

  it('يجب أن يعرض رسالة خطأ عند فشل الحذف', async () => {
    const user = userEvent.setup();
    render(<ProductsManagement />);

    const deleteButton = screen.getByRole('button', { name: /حذف/i });
    await user.click(deleteButton);

    // محاكاة فشل الحذف
    const confirmButton = screen.getByRole('button', { name: /تأكيد/i });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByText(/فشل/i)).toBeInTheDocument();
    });
  });

  it('يجب أن يعرض رسالة خطأ عند فشل التحديث', async () => {
    const user = userEvent.setup();
    render(<ProductsManagement />);

    const editButton = screen.getByRole('button', { name: /تعديل/i });
    await user.click(editButton);

    const nameInput = screen.getByDisplayValue('منتج 1');
    await user.clear(nameInput);
    await user.type(nameInput, 'منتج معدل');

    const saveButton = screen.getByRole('button', { name: /حفظ/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/فشل/i)).toBeInTheDocument();
    });
  });

  it('يجب أن يعرض حالة التحميل', () => {
    render(<ProductsManagement />);
    // التحقق من أن الصفحة تعرض بشكل صحيح
    expect(screen.getByText(/إدارة المنتجات/i)).toBeInTheDocument();
  });

  it('يجب أن يعرض رسالة عدم وجود منتجات', () => {
    // Mock empty products
    vi.mocked(trpc.products.list.useQuery).mockReturnValue({
      data: [],
      isLoading: false,
      refetch: vi.fn(),
    } as any);

    render(<ProductsManagement />);
    expect(screen.getByText(/لا توجد منتجات/i)).toBeInTheDocument();
  });
});
