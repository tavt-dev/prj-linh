import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { useProduct } from '../context/ProductContext';
import { useCategory } from '../context/CategoryContext';
import { ProductGrid } from '../components/product/ProductGrid';
import { ProductFilters } from '../components/product/ProductFilters';
import { Button } from '../components/ui/Button';
import { Brand, Level, Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';

type SortOption = 'price-asc' | 'price-desc' | 'best-selling' | 'newest';

export function Products() {
  const { products: allProducts } = useProduct();
  const { categories } = useCategory();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [selectedBrands, setSelectedBrands] = useState<Brand[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<Level[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]);
  const [selectedWeights, setSelectedWeights] = useState<string[]>([]);
  const [selectedHeadSizes, setSelectedHeadSizes] = useState<string[]>([]);
  const [selectedBalances, setSelectedBalances] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const searchQuery = searchParams.get('search') || '';
  const brandQuery = searchParams.get('brand');
  const saleQuery = searchParams.get('sale');
  const categoryQuery = searchParams.get('category');

  useEffect(() => {
    if (brandQuery) {
      setSelectedBrands([brandQuery as Brand]);
    }
  }, [brandQuery]);

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query));
    }

    if (saleQuery === 'true') {
      result = result.filter((p) => p.salePrice !== undefined);
    }

    if (categoryQuery) {
      const targetCategory = categories.find(c => c.slug === categoryQuery);
      if (targetCategory) {
        result = result.filter((p) => p.category === targetCategory.name);
      } else {
        // Fallback if not found in context
        result = result.filter((p) => p.category.toLowerCase() === categoryQuery.toLowerCase());
      }
    }

    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    if (selectedLevels.length > 0) {
      result = result.filter((p) => p.level.some((l) => selectedLevels.includes(l)));
    }

    if (selectedWeights.length > 0) {
      result = result.filter((p) => {
        return selectedWeights.some(weightId => {
          if (weightId === 'under-260') return p.weight < 260;
          if (weightId === '260-280') return p.weight >= 260 && p.weight <= 280;
          if (weightId === '281-299') return p.weight >= 281 && p.weight <= 299;
          if (weightId === 'over-300') return p.weight >= 300;
          return false;
        });
      });
    }

    if (selectedHeadSizes.length > 0) {
      result = result.filter((p) => {
        return selectedHeadSizes.some(sizeId => {
          if (sizeId === 'midsize') return p.headSize < 95;
          if (sizeId === 'midplus') return p.headSize >= 95 && p.headSize <= 105;
          if (sizeId === 'oversize') return p.headSize > 105;
          return false;
        });
      });
    }

    if (selectedBalances.length > 0) {
      result = result.filter((p) => {
        return selectedBalances.some(balanceId => {
          if (balanceId === 'head-light') return p.balance < 320;
          if (balanceId === 'even') return p.balance === 320;
          if (balanceId === 'head-heavy') return p.balance > 320;
          return false;
        });
      });
    }

    result = result.filter((p) => {
      const currentPrice = p.salePrice || p.price;
      return currentPrice >= priceRange[0] && currentPrice <= priceRange[1];
    });

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case 'best-selling':
        result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
        break;
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }

    return result;
  }, [searchQuery, saleQuery, categoryQuery, selectedBrands, selectedLevels, priceRange, sortBy, categories, selectedWeights, selectedHeadSizes, selectedBalances]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-8 lg:pt-32 lg:pb-12">
      {/* Breadcrumbs & Title */}
      <div className="mb-8">
        <nav className="flex text-sm text-zinc-500 mb-4">
          <ol className="flex items-center space-x-2">
            <li><a href="/" className="hover:text-zinc-900">Trang chủ</a></li>
            <li><span className="mx-2">/</span></li>
            <li className="font-medium text-zinc-900">
              {categoryQuery ? categories.find(c => c.slug === categoryQuery)?.name || 'Sản phẩm' : 'Sản phẩm'}
            </li>
          </ol>
        </nav>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              {searchQuery ? `Kết quả tìm kiếm cho "${searchQuery}"` : 
               categoryQuery ? categories.find(c => c.slug === categoryQuery)?.name || 'Tất cả sản phẩm' : 
               'Tất cả sản phẩm'}
            </h1>
            <p className="mt-2 text-zinc-500">Hiển thị {filteredProducts.length} sản phẩm</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="flex items-center gap-2 lg:hidden text-sm font-medium text-zinc-900 bg-zinc-100 px-4 py-2 rounded-lg"
            >
              <Filter className="h-4 w-4" />
              Bộ lọc
            </button>
            
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-zinc-500 hidden md:block" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="text-sm font-medium text-zinc-900 bg-transparent border-none focus:ring-0 py-2 pl-2 pr-8 cursor-pointer"
              >
                <option value="newest">Mới nhất</option>
                <option value="best-selling">Bán chạy</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Filters */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <ProductFilters
              categorySlug={categoryQuery}
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
              selectedLevels={selectedLevels}
              setSelectedLevels={setSelectedLevels}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedWeights={selectedWeights}
              setSelectedWeights={setSelectedWeights}
              selectedHeadSizes={selectedHeadSizes}
              setSelectedHeadSizes={setSelectedHeadSizes}
              selectedBalances={selectedBalances}
              setSelectedBalances={setSelectedBalances}
            />
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <ProductGrid products={filteredProducts} />
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFiltersOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-4/5 max-w-sm bg-white shadow-2xl lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 p-4">
                <h2 className="text-lg font-semibold text-zinc-900">Bộ lọc</h2>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 transition-colors"
                >
                  <span className="sr-only">Đóng</span>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <ProductFilters
                  categorySlug={categoryQuery}
                  selectedBrands={selectedBrands}
                  setSelectedBrands={setSelectedBrands}
                  selectedLevels={selectedLevels}
                  setSelectedLevels={setSelectedLevels}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  selectedWeights={selectedWeights}
                  setSelectedWeights={setSelectedWeights}
                  selectedHeadSizes={selectedHeadSizes}
                  setSelectedHeadSizes={setSelectedHeadSizes}
                  selectedBalances={selectedBalances}
                  setSelectedBalances={setSelectedBalances}
                />
              </div>
              <div className="border-t border-zinc-100 p-4 flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setSelectedBrands([]);
                    setSelectedLevels([]);
                    setPriceRange([0, 100000000]);
                    setSelectedWeights([]);
                    setSelectedHeadSizes([]);
                    setSelectedBalances([]);
                  }}
                >
                  Xóa bộ lọc
                </Button>
                <Button className="flex-1" onClick={() => setIsMobileFiltersOpen(false)}>
                  Áp dụng
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
