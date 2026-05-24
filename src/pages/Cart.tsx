import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CartItem } from '../components/cart/CartItem';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { formatPrice } from '../utils/format';
import { useToast } from '../context/ToastContext';

export function Cart() {
  const { items, cartTotal, discount, finalTotal, couponCode: appliedCouponCode, applyCoupon } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (applyCoupon(couponCode)) {
      addToast('Áp dụng mã giảm giá thành công!', 'success');
    } else {
      addToast('Mã giảm giá không hợp lệ', 'error');
    }
  };

  const handleCheckout = () => {
    if (!user) {
      addToast('Vui lòng đăng nhập để tiếp tục thanh toán', 'error');
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-16 lg:pt-40 lg:pb-24 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-zinc-100 mb-6">
          <ShoppingBag className="h-10 w-10 text-zinc-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">Giỏ hàng của bạn đang trống</h1>
        <p className="text-zinc-500 mb-8 max-w-md mx-auto">
          Có vẻ như bạn chưa thêm bất kỳ sản phẩm nào vào giỏ hàng. Hãy khám phá các sản phẩm tuyệt vời của chúng tôi.
        </p>
        <Button size="lg" onClick={() => navigate('/products')}>
          Tiếp tục mua sắm
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-8 lg:pt-32 lg:pb-12">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-8">Giỏ hàng</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <div className="space-y-6 divide-y divide-zinc-200">
            {items.map((item) => (
              <div key={`${item.product.id}-${item.gripSize}`} className="pt-6 first:pt-0">
                <CartItem item={item} />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="rounded-2xl bg-zinc-50 p-6 lg:p-8 sticky top-24">
            <h2 className="text-lg font-semibold text-zinc-900 mb-6">Tóm tắt đơn hàng</h2>
            
            <div className="space-y-4 text-sm text-zinc-600 mb-6">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span className="font-medium text-zinc-900">{formatPrice(cartTotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Giảm giá</span>
                  <span className="font-medium">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span>Miễn phí</span>
              </div>
            </div>

            <div className="border-t border-zinc-200 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-base font-semibold text-zinc-900">Tổng cộng</span>
                <span className="text-2xl font-bold text-zinc-900">{formatPrice(finalTotal)}</span>
              </div>
              <p className="text-xs text-zinc-500 mt-1 text-right">Đã bao gồm VAT</p>
            </div>

            <form onSubmit={handleApplyCoupon} className="mb-6">
              <label htmlFor="coupon" className="block text-sm font-medium text-zinc-700 mb-2 flex items-center gap-2">
                <Tag className="h-4 w-4" /> Mã giảm giá (Thử: TENNIS10)
              </label>
              <div className="flex gap-2">
                <Input
                  id="coupon"
                  placeholder="Nhập mã..."
                  value={couponCode || appliedCouponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" variant="outline">Áp dụng</Button>
              </div>
            </form>

            <Button size="lg" className="w-full" onClick={handleCheckout}>
              Tiến hành thanh toán <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <div className="mt-6 text-center">
              <Link to="/products" className="text-sm text-zinc-500 hover:text-zinc-900 underline transition-colors">
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
