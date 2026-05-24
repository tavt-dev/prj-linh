import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/format';
import { Link } from 'react-router-dom';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity, gripSize } = item;

  return (
    <div className="flex gap-4 py-2">
      <Link to={`/product/${product.slug}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center"
        />
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between gap-2">
          <div>
            <Link to={`/product/${product.slug}`} className="text-sm font-medium text-zinc-900 hover:underline line-clamp-2">
              {product.name}
            </Link>
            <p className="mt-1 text-xs text-zinc-500">Grip Size: {gripSize}</p>
          </div>
          <p className="text-sm font-semibold text-zinc-900 text-right shrink-0">
            {formatPrice(product.salePrice || product.price)}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center rounded-lg border border-zinc-200">
            <button
              onClick={() => updateQuantity(product.id, gripSize, quantity - 1)}
              className="p-1.5 text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center text-sm font-medium text-zinc-900">
              {quantity}
            </span>
            <button
              onClick={() => updateQuantity(product.id, gripSize, quantity + 1)}
              className="p-1.5 text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => removeFromCart(product.id, gripSize)}
            className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Xóa</span>
          </button>
        </div>
      </div>
    </div>
  );
}
