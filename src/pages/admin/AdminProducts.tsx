import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useProduct } from '../../context/ProductContext';
import { ProductModal } from '../../components/admin/ProductModal';
import { Product } from '../../types';
import { useCategory } from '../../context/CategoryContext';

export function AdminProducts() {
  const { products: initialProducts, addProduct, updateProduct, deleteProduct } = useProduct();
  const { categories } = useCategory();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleSaveProduct = (productData: Partial<Product>) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct({
        ...productData,
        id: Date.now().toString(),
        slug: productData.name?.toLowerCase().replace(/ /g, '-') || '',
        rating: 5,
        reviewsCount: 0,
        level: ['Beginner'],
        weight: 300,
        headSize: 100,
        balance: 320,
        length: 27,
        material: 'Graphite',
        gripSizes: ['4 1/4'],
        isNew: true,
        isBestSeller: false,
      } as Product);
    }
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const filteredProducts = useMemo(() => {
    return initialProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter, initialProducts]);

  const getStatus = (stock: number) => {
    if (stock === 0) return 'Hết hàng';
    if (stock < 10) return 'Sắp hết';
    return 'Còn hàng';
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Quản lý sản phẩm</h1>
        <Button 
          className="flex items-center gap-2"
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4" /> Thêm sản phẩm
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-zinc-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent text-sm"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select 
              className="w-full sm:w-auto px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Tất cả danh mục</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-50 text-zinc-500 border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Tên sản phẩm</th>
                <th className="px-6 py-4 font-semibold">Danh mục</th>
                <th className="px-6 py-4 font-semibold">Giá bán</th>
                <th className="px-6 py-4 font-semibold">Tồn kho</th>
                <th className="px-6 py-4 font-semibold">Trạng thái</th>
                <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-900">
              {filteredProducts.map((product) => {
                const status = getStatus(product.stock);
                return (
                  <tr key={product.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-500">{product.category}</td>
                    <td className="px-6 py-4 font-medium">{(product.salePrice || product.price).toLocaleString('vi-VN')}đ</td>
                    <td className="px-6 py-4">{product.stock}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        status === 'Còn hàng' ? 'bg-emerald-100 text-emerald-800' :
                        status === 'Sắp hết' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            setEditingProduct(product);
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors rounded-lg hover:bg-zinc-100"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
                              deleteProduct(product.id);
                            }
                          }}
                          className="p-2 text-zinc-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-zinc-200 flex items-center justify-between text-sm text-zinc-500 bg-zinc-50/50">
          <span>Hiển thị {filteredProducts.length > 0 ? 1 : 0}-{filteredProducts.length} của {filteredProducts.length} sản phẩm</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-zinc-200 rounded-md hover:bg-zinc-100 disabled:opacity-50">Trước</button>
            <button className="px-3 py-1 border border-zinc-200 rounded-md bg-zinc-900 text-white">1</button>
            <button className="px-3 py-1 border border-zinc-200 rounded-md hover:bg-zinc-100 disabled:opacity-50">Sau</button>
          </div>
        </div>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        product={editingProduct}
      />
    </div>
  );
}
