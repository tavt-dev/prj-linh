import React, { useState } from 'react';
import { Search, Edit2, Trash2, Plus, FolderTree } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useCategory, Category } from '../../context/CategoryContext';
import { CategoryModal } from '../../components/admin/CategoryModal';
import { motion, AnimatePresence } from 'motion/react';

export function AdminCategories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategory();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveCategory = (categoryData: Omit<Category, 'id'>) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, categoryData);
    } else {
      addCategory(categoryData);
    }
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete);
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Quản lý danh mục</h1>
          <p className="text-sm text-zinc-500 mt-1">Quản lý các danh mục sản phẩm của cửa hàng</p>
        </div>
        <Button 
          className="rounded-full px-6 h-12 shadow-sm"
          onClick={() => {
            setEditingCategory(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="h-5 w-5 mr-2" />
          Thêm danh mục
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Tìm kiếm danh mục..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-500 uppercase bg-zinc-50/50 border-b border-zinc-100">
              <tr>
                <th className="px-6 py-4 font-medium">Tên danh mục</th>
                <th className="px-6 py-4 font-medium">Đường dẫn (Slug)</th>
                <th className="px-6 py-4 font-medium hidden sm:table-cell">Mô tả</th>
                <th className="px-6 py-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredCategories.map((category) => (
                <tr key={category.id} className="hover:bg-zinc-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-600">
                        <FolderTree className="h-5 w-5" />
                      </div>
                      <span className="font-medium text-zinc-900">{category.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-100 text-zinc-800">
                      {category.slug}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell text-zinc-500">
                    {category.description || '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => {
                          setEditingCategory(category);
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => setCategoryToDelete(category.id)}
                        className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                    Không tìm thấy danh mục nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={handleSaveCategory}
        category={editingCategory}
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {categoryToDelete && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCategoryToDelete(null)}
              className="fixed inset-0 z-[100] bg-zinc-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 z-[110] w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-4"
            >
              <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="p-6 sm:p-8">
                  <h3 className="text-xl font-bold text-zinc-900 mb-2">Xóa danh mục</h3>
                  <p className="text-zinc-500 mb-8">Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác.</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="outline" className="flex-1 rounded-xl h-12" onClick={() => setCategoryToDelete(null)}>
                      Hủy
                    </Button>
                    <Button variant="danger" className="flex-1 rounded-xl h-12" onClick={confirmDelete}>
                      Xóa danh mục
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
