import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { formatPrice } from '../../utils/format';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { Badge } from '../ui/Badge';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isWishlisted = isInWishlist(product.id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, product.gripSizes[0]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/product/${product.slug}`} className="group flex flex-col gap-4">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-100">
          <img
            src={product.images[0]}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
          
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {product.isNew && <Badge variant="success">Mới</Badge>}
            {product.isBestSeller && <Badge variant="warning">Bán chạy</Badge>}
            {product.discountPercent && (
              <Badge variant="danger">-{product.discountPercent}%</Badge>
            )}
          </div>
          
          <button
            onClick={handleWishlist}
            className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-zinc-900 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-red-500 hover:scale-110 active:scale-95"
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
          </button>

          {/* Quick Add Button */}
          <div className="absolute bottom-0 left-0 w-full translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
            <button
              onClick={handleQuickAdd}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/90 py-3 text-sm font-semibold text-zinc-900 shadow-lg backdrop-blur-md transition-all hover:bg-zinc-900 hover:text-white active:scale-95"
            >
              <ShoppingBag className="h-4 w-4" />
              Thêm nhanh
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 px-1">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{product.brand}</p>
            <div className="flex items-center gap-1 text-zinc-900">
              <Star className="h-3.5 w-3.5 fill-current text-amber-400" />
              <span className="text-xs font-semibold">{product.rating}</span>
            </div>
          </div>
          <h3 className="text-base font-semibold text-zinc-900 line-clamp-1 group-hover:text-zinc-600 transition-colors">
            {product.name}
          </h3>
          {(product.weight > 0 || product.headSize > 0) && (
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              {product.weight > 0 && <span>{product.weight}g</span>}
              {product.weight > 0 && product.headSize > 0 && <span>•</span>}
              {product.headSize > 0 && <span>{product.headSize} sq.in</span>}
            </div>
          )}
          <div className="flex items-center gap-2 mt-1">
            {product.salePrice ? (
              <>
                <span className="text-lg font-bold text-red-600">{formatPrice(product.salePrice)}</span>
                <span className="text-sm font-medium text-zinc-400 line-through">{formatPrice(product.price)}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-zinc-900">{formatPrice(product.price)}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
