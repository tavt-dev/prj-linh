import React from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../../context/CartContext';
import { CartItem } from './CartItem';
import { Button } from '../ui/Button';
import { formatPrice } from '../../utils/format';
import { Link, useNavigate } from 'react-router-dom';

export function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, cartTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-zinc-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Giỏ hàng ({items.length})
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
                  <div className="rounded-full bg-zinc-100 p-6">
                    <ShoppingBag className="h-12 w-12 text-zinc-300" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-zinc-900">Giỏ hàng trống</p>
                    <p className="text-sm text-zinc-500 mt-1">Bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
                  </div>
                  <Button onClick={() => setIsCartOpen(false)} className="mt-4">
                    Tiếp tục mua sắm
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <CartItem key={`${item.product.id}-${item.gripSize}`} item={item} />
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-zinc-100 bg-zinc-50 p-6 space-y-4">
                <div className="flex items-center justify-between text-base font-medium text-zinc-900">
                  <p>Tạm tính</p>
                  <p>{formatPrice(cartTotal)}</p>
                </div>
                <p className="text-sm text-zinc-500">Phí vận chuyển và thuế sẽ được tính khi thanh toán.</p>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" onClick={() => { setIsCartOpen(false); navigate('/cart'); }}>
                    Xem giỏ hàng
                  </Button>
                  <Button onClick={handleCheckout}>
                    Thanh toán
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
