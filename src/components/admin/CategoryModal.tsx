import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Category } from '../../context/CategoryContext';
import { motion, AnimatePresence } from 'motion/react';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Omit<Category, 'id'>) => void;
  category?: Category | null;
}

export function CategoryModal({ isOpen, onClose, onSave, category }: CategoryModalProps) {
  const [formData, setFormData] = useState<Omit<Category, 'id'>>({
    name: '',
    slug: '',
    description: '',
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
      });
    }
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="flex items-center justify-between p-6 border-b border-zinc-100 bg-zinc-50/50">
            <h2 className="text-xl font-bold text-zinc-900">
              {category ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <form id="category-form" onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Tên danh mục"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Input
                label="Đường dẫn (Slug)"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-zinc-700">Mô tả</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-xl border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm focus:border-zinc-900 focus:ring-zinc-900 transition-colors resize-none"
                />
              </div>
            </form>
          </div>

          <div className="p-6 border-t border-zinc-100 bg-zinc-50/50 flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-xl h-12"
              onClick={onClose}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              form="category-form"
              className="flex-1 rounded-xl h-12"
            >
              {category ? 'Lưu thay đổi' : 'Thêm danh mục'}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
