import React from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { motion } from 'motion/react';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <h3 className="text-xl font-semibold text-zinc-900 mb-2">Không tìm thấy sản phẩm</h3>
        <p className="text-zinc-500">Vui lòng thử lại với bộ lọc khác.</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
