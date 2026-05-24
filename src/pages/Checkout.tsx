import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, CreditCard, Wallet, Truck, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useOrder } from '../context/OrderContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { formatPrice } from '../utils/format';
import { Modal } from '../components/ui/Modal';

export function Checkout() {
  const { items, cartTotal, discount, finalTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const { addOrder } = useOrder();
  const navigate = useNavigate();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'transfer'>('cod');
  const [createdOrderId, setCreatedOrderId] = useState('');
  
  const defaultAddress = user?.addresses?.find(a => a.isDefault) || user?.addresses?.[0];
  const [selectedAddressId, setSelectedAddressId] = useState<string>(defaultAddress?.id || '');
  const [customAddress, setCustomAddress] = useState('');

  // If cart is empty and not just completed checkout, redirect
  useEffect(() => {
    if (!user) {
      addToast('Vui lòng đăng nhập để tiếp tục thanh toán', 'error');
      navigate('/login');
      return;
    }
    
    if (items.length === 0 && !isSuccessModalOpen) {
      navigate('/cart');
    }
  }, [items.length, isSuccessModalOpen, navigate, user, addToast]);

  if (!user || (items.length === 0 && !isSuccessModalOpen)) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let finalAddress = '';
    if (selectedAddressId === 'custom') {
      finalAddress = customAddress.trim();
    } else {
      const addr = user?.addresses?.find(a => a.id === selectedAddressId);
      finalAddress = addr ? addr.address : customAddress.trim();
    }

    if (!finalAddress) {
      addToast('Vui lòng nhập địa chỉ giao hàng', 'error');
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const customerName = (formData.get('customerName') as string) || user!.name;
    const customerPhone = (formData.get('customerPhone') as string) || user!.phone || '';
    const customerEmail = (formData.get('customerEmail') as string) || user!.email;

    const orderMethodMap: Record<string, string> = {
      cod: 'Thanh toán khi nhận hàng (COD)',
      transfer: 'Chuyển khoản ngân hàng',
      card: 'Thẻ tín dụng / Ghi nợ'
    };
    
    // Simulate API call
    setTimeout(() => {
      const newOrder = addOrder({
        userId: user!.id,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress: finalAddress,
        items: [...items],
        total: finalTotal,
        paymentMethod: orderMethodMap[paymentMethod]
      });
      
      setCreatedOrderId(newOrder.id);
      setIsSubmitting(false);
      setIsSuccessModalOpen(true);
      clearCart();
    }, 1500);
  };

  const handleCloseModal = () => {
    setIsSuccessModalOpen(false);
    navigate('/account#orders');
  };

  return (
    <div className="bg-zinc-50 min-h-screen pt-28 pb-8 lg:pt-32 lg:pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-8">Thanh toán</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Form Section */}
          <div className="lg:col-span-7 xl:col-span-8">
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Info */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-zinc-100">
                <h2 className="text-xl font-semibold text-zinc-900 mb-6">Thông tin liên hệ</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input name="customerName" label="Họ và tên" placeholder="Nhập họ tên của bạn" defaultValue={user?.name || ''} required />
                  <Input name="customerPhone" label="Số điện thoại" type="tel" placeholder="Nhập số điện thoại" defaultValue={user?.phone || ''} required />
                  <div className="sm:col-span-2">
                    <Input name="customerEmail" label="Email" type="email" placeholder="Nhập địa chỉ email" defaultValue={user?.email || ''} required />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-zinc-100">
                <h2 className="text-xl font-semibold text-zinc-900 mb-6">Địa chỉ giao hàng</h2>
                
                {user?.addresses && user.addresses.length > 0 && (
                  <div className="mb-6 space-y-3">
                    <p className="text-sm font-medium text-zinc-700">Chọn địa chỉ đã lưu:</p>
                    {user.addresses.map(addr => (
                      <label key={addr.id} className={`flex items-start p-4 border rounded-xl cursor-pointer transition-colors ${selectedAddressId === addr.id ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-200 hover:border-zinc-300'}`}>
                        <input
                          type="radio"
                          name="savedAddress"
                          value={addr.id}
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="mt-1 w-4 h-4 text-zinc-900 focus:ring-zinc-900 border-zinc-300"
                        />
                        <div className="ml-3">
                          <p className="font-medium text-zinc-900">{addr.name} {addr.phone ? `- ${addr.phone}` : ''}</p>
                          <p className="text-sm text-zinc-500 mt-1">{addr.address}</p>
                        </div>
                      </label>
                    ))}
                    <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${selectedAddressId === 'custom' ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-200 hover:border-zinc-300'}`}>
                      <input
                        type="radio"
                        name="savedAddress"
                        value="custom"
                        checked={selectedAddressId === 'custom'}
                        onChange={() => setSelectedAddressId('custom')}
                        className="w-4 h-4 text-zinc-900 focus:ring-zinc-900 border-zinc-300"
                      />
                      <span className="ml-3 font-medium text-zinc-900">Sử dụng địa chỉ khác</span>
                    </label>
                  </div>
                )}

                {(!user?.addresses || user.addresses.length === 0 || selectedAddressId === 'custom') && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="sm:col-span-2">
                      <Input 
                        label="Địa chỉ cụ thể (Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố)" 
                        placeholder="Ví dụ: 123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh" 
                        value={customAddress}
                        onChange={(e) => setCustomAddress(e.target.value)}
                        required={selectedAddressId === 'custom' || !user?.addresses || user.addresses.length === 0} 
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Input label="Ghi chú đơn hàng (Tùy chọn)" placeholder="Ghi chú thêm về thời gian giao hàng..." />
                    </div>
                  </div>
                )}
                
                {selectedAddressId !== 'custom' && user?.addresses && user.addresses.length > 0 && (
                  <div className="mt-4">
                    <Input label="Ghi chú đơn hàng (Tùy chọn)" placeholder="Ghi chú thêm về thời gian giao hàng..." />
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-zinc-100">
                <h2 className="text-xl font-semibold text-zinc-900 mb-6">Phương thức thanh toán</h2>
                <div className="space-y-4">
                  <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-200 hover:border-zinc-300'}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="w-4 h-4 text-zinc-900 focus:ring-zinc-900 border-zinc-300"
                    />
                    <div className="ml-4 flex items-center gap-3">
                      <Truck className="h-6 w-6 text-zinc-500" />
                      <div>
                        <p className="font-medium text-zinc-900">Thanh toán khi nhận hàng (COD)</p>
                        <p className="text-sm text-zinc-500">Thanh toán bằng tiền mặt khi giao hàng</p>
                      </div>
                    </div>
                  </label>

                  <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'transfer' ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-200 hover:border-zinc-300'}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="transfer"
                      checked={paymentMethod === 'transfer'}
                      onChange={() => setPaymentMethod('transfer')}
                      className="w-4 h-4 text-zinc-900 focus:ring-zinc-900 border-zinc-300"
                    />
                    <div className="ml-4 flex items-center gap-3">
                      <Wallet className="h-6 w-6 text-zinc-500" />
                      <div>
                        <p className="font-medium text-zinc-900">Chuyển khoản ngân hàng</p>
                        <p className="text-sm text-zinc-500">Chuyển khoản trực tiếp qua tài khoản ngân hàng</p>
                      </div>
                    </div>
                  </label>

                  <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-200 hover:border-zinc-300'}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="w-4 h-4 text-zinc-900 focus:ring-zinc-900 border-zinc-300"
                    />
                    <div className="ml-4 flex items-center gap-3">
                      <CreditCard className="h-6 w-6 text-zinc-500" />
                      <div>
                        <p className="font-medium text-zinc-900">Thẻ tín dụng / Ghi nợ</p>
                        <p className="text-sm text-zinc-500">Thanh toán an toàn qua cổng thanh toán</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-zinc-100 sticky top-24">
              <h2 className="text-lg font-semibold text-zinc-900 mb-6">Đơn hàng của bạn</h2>
              
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.gripSize}`} className="flex gap-4">
                    <div className="relative h-16 w-16 shrink-0 rounded-lg bg-zinc-100 overflow-hidden border border-zinc-200">
                      <img src={item.product.images[0]} alt={item.product.name} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                      <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-bold text-white">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900 truncate">{item.product.name}</p>
                      <p className="text-xs text-zinc-500 mt-1">Grip: {item.gripSize}</p>
                      <p className="text-sm font-semibold text-zinc-900 mt-1">
                        {formatPrice((item.product.salePrice || item.product.price) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm text-zinc-600 border-t border-zinc-100 pt-6 mb-6">
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

              <div className="border-t border-zinc-200 pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold text-zinc-900">Tổng cộng</span>
                  <span className="text-2xl font-bold text-zinc-900">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              <Button
                type="submit"
                form="checkout-form"
                size="lg"
                className="w-full"
                isLoading={isSubmitting}
              >
                Đặt hàng
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal isOpen={isSuccessModalOpen} onClose={handleCloseModal}>
        <div className="text-center py-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mb-6">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">Đặt hàng thành công!</h2>
          <p className="text-zinc-500 mb-8">
            Cảm ơn bạn đã mua sắm tại TennisPro. Mã đơn hàng của bạn là <span className="font-semibold text-zinc-900">{createdOrderId}</span>. Chúng tôi sẽ sớm liên hệ để xác nhận đơn hàng.
          </p>
          <Button onClick={handleCloseModal} className="w-full">
            Xem đơn hàng
          </Button>
        </div>
      </Modal>
    </div>
  );
}
