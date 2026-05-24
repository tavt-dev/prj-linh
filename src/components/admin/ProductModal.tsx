import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Product, Brand } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { useCategory } from '../../context/CategoryContext';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Partial<Product>) => void;
  product?: Product | null;
}

export function ProductModal({ isOpen, onClose, onSave, product }: ProductModalProps) {
  const { categories } = useCategory();
  const defaultCategory = categories.length > 0 ? categories[0].name : 'Control';

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    brand: '' as Brand,
    price: 0,
    salePrice: undefined,
    stock: 0,
    category: defaultCategory,
    images: ['https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=800'],
    description: '',
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        name: '',
        brand: '' as Brand,
        price: 0,
        salePrice: undefined,
        stock: 0,
        category: defaultCategory,
        images: ['https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=800'],
        description: '',
      });
    }
  }, [product, isOpen, defaultCategory]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'salePrice' || name === 'stock' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="flex items-center justify-between p-6 border-b border-zinc-100 bg-zinc-50/50">
            <h2 className="text-xl font-bold text-zinc-900">
              {product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="Tên sản phẩm"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Thương hiệu"
                  name="brand"
                  value={formData.brand || ''}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Giá bán (VNĐ)"
                  name="price"
                  type="number"
                  value={formData.price || ''}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Giá khuyến mãi (VNĐ)"
                  name="salePrice"
                  type="number"
                  value={formData.salePrice || ''}
                  onChange={handleChange}
                />
                <Input
                  label="Tồn kho"
                  name="stock"
                  type="number"
                  value={formData.stock || ''}
                  onChange={handleChange}
                  required
                />
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-zinc-700">Danh mục</label>
                  <select
                    name="category"
                    value={formData.category || defaultCategory}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all bg-white text-zinc-900"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <Input
                    label="Hình ảnh (URL, cách nhau bằng dấu phẩy)"
                    name="images"
                    value={formData.images?.join(', ') || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, images: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-zinc-700">Mô tả</label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all bg-white text-zinc-900 resize-none"
                />
              </div>
            </form>
          </div>

          <div className="p-6 border-t border-zinc-100 bg-zinc-50/50 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-full px-6">
              Hủy
            </Button>
            <Button type="submit" form="product-form" className="rounded-full px-8">
              Lưu
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
