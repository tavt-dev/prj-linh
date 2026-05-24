import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/Button';
import { formatPrice } from '../utils/format';

export function Wishlist() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-16 lg:pt-40 lg:pb-24 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-zinc-100 mb-6">
          <Heart className="h-10 w-10 text-zinc-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">Danh sách yêu thích trống</h1>
        <p className="text-zinc-500 mb-8 max-w-md mx-auto">
          Lưu lại những sản phẩm bạn yêu thích để dễ dàng tìm lại và mua sắm sau này.
        </p>
        <Link to="/products">
          <Button size="lg">
            Khám phá sản phẩm
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-8 lg:pt-32 lg:pb-12">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-8">Sản phẩm yêu thích ({items.length})</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((product) => (
          <div key={product.id} className="group flex flex-col gap-4 border border-zinc-200 rounded-2xl p-4 hover:border-zinc-300 transition-colors">
            <Link to={`/product/${product.slug}`} className="relative aspect-square overflow-hidden rounded-xl bg-zinc-100">
              <img
                src={product.images[0]}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
            </Link>

            <div className="flex flex-col gap-2 flex-1">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{product.brand}</p>
              <Link to={`/product/${product.slug}`} className="text-base font-semibold text-zinc-900 line-clamp-2 hover:underline">
                {product.name}
              </Link>
              <div className="flex items-center gap-2 mt-auto pt-2">
                {product.salePrice ? (
                  <>
                    <span className="text-lg font-bold text-red-600">{formatPrice(product.salePrice)}</span>
                    <span className="text-sm text-zinc-400 line-through">{formatPrice(product.price)}</span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-zinc-900">{formatPrice(product.price)}</span>
                )}
              </div>
            </div>

            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => addToCart(product, 1, product.gripSizes[0])}
              >
                <ShoppingBag className="w-4 h-4 mr-2" /> Thêm
              </Button>
              <Button
                variant="ghost"
                className="px-3 text-zinc-400 hover:text-red-500 hover:bg-red-50"
                onClick={() => removeFromWishlist(product.id)}
              >
                Xóa
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
