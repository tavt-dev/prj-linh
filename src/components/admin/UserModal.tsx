import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { AdminUser } from '../../context/UserManagementContext';
import { motion, AnimatePresence } from 'motion/react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Partial<AdminUser>) => void;
  user?: AdminUser | null;
}

export function UserModal({ isOpen, onClose, onSave, user }: UserModalProps) {
  const [formData, setFormData] = useState<Partial<AdminUser>>({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    status: 'Hoạt động',
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'user',
        status: 'Hoạt động',
      });
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
              {user ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <form id="user-form" onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Họ và tên"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                required
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleChange}
                required
              />
              <Input
                label="Số điện thoại"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                required
              />
              <Input
                label="URL Ảnh đại diện"
                name="avatar"
                value={formData.avatar || ''}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-zinc-700">Vai trò</label>
                <select
                  name="role"
                  value={formData.role || 'user'}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all bg-white text-zinc-900"
                >
                  <option value="user">Người dùng</option>
                  <option value="admin">Quản trị viên</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-zinc-700">Trạng thái</label>
                <select
                  name="status"
                  value={formData.status || 'Hoạt động'}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all bg-white text-zinc-900"
                >
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Khóa">Khóa</option>
                </select>
              </div>
            </form>
          </div>

          <div className="p-6 border-t border-zinc-100 bg-zinc-50/50 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-full px-6">
              Hủy
            </Button>
            <Button type="submit" form="user-form" className="rounded-full px-8">
              Lưu
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
