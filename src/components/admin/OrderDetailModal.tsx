import React from 'react';
import { X, Package, Truck, CreditCard, Calendar, User, MapPin } from 'lucide-react';
import { Order } from '../../context/OrderContext';
import { formatPrice } from '../../utils/format';
import { motion, AnimatePresence } from 'motion/react';

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderDetailModal({ order, isOpen, onClose }: OrderDetailModalProps) {
  if (!isOpen || !order) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Chờ xác nhận': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Đang xử lý': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Đang giao': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Đã giao': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Đã hủy': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-zinc-100 text-zinc-700 border-zinc-200';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-zinc-100 bg-zinc-50/50">
            <div>
              <h2 className="text-xl font-bold text-zinc-900">Chi tiết đơn hàng</h2>
              <p className="text-sm text-zinc-500 mt-1">Mã đơn: <span className="font-mono font-medium text-zinc-900">{order.id}</span></p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Status & Date */}
              <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <Package className="h-5 w-5 text-zinc-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-500">Trạng thái</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border mt-1 ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <Calendar className="h-5 w-5 text-zinc-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-500">Ngày đặt</p>
                    <p className="text-sm font-semibold text-zinc-900 mt-1">{order.date}</p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100">
                <div className="flex items-start gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                    <User className="h-5 w-5 text-zinc-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-500">Khách hàng</p>
                    <p className="text-sm font-semibold text-zinc-900 mt-1">{order.customerName}</p>
                    <p className="text-sm text-zinc-600">{order.customerPhone}</p>
                    <p className="text-sm text-zinc-600">{order.customerEmail}</p>
                  </div>
                </div>
              </div>

              {/* Shipping & Payment */}
              <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                    <MapPin className="h-5 w-5 text-zinc-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-500">Địa chỉ giao hàng</p>
                    <p className="text-sm font-medium text-zinc-900 mt-1 leading-relaxed">{order.shippingAddress}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                    <CreditCard className="h-5 w-5 text-zinc-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-500">Phương thức thanh toán</p>
                    <p className="text-sm font-medium text-zinc-900 mt-1">{order.paymentMethod}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-lg font-bold text-zinc-900 mb-4">Sản phẩm đã đặt</h3>
              <div className="border border-zinc-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-zinc-50 text-zinc-500 border-b border-zinc-200">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Sản phẩm</th>
                      <th className="px-4 py-3 font-semibold text-center">Số lượng</th>
                      <th className="px-4 py-3 font-semibold text-right">Đơn giá</th>
                      <th className="px-4 py-3 font-semibold text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {order.items.map((item, index) => (
                      <tr key={index} className="hover:bg-zinc-50/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-lg bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200">
                              <img src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-cover" />
                            </div>
                            <div>
                              <p className="font-medium text-zinc-900 truncate max-w-[200px] sm:max-w-[300px]">{item.product.name}</p>
                              <p className="text-xs text-zinc-500 mt-0.5">Grip: {item.gripSize}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center font-medium text-zinc-900">{item.quantity}</td>
                        <td className="px-4 py-3 text-right text-zinc-600">{formatPrice(item.product.salePrice || item.product.price)}</td>
                        <td className="px-4 py-3 text-right font-bold text-zinc-900">
                          {formatPrice((item.product.salePrice || item.product.price) * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total */}
            <div className="mt-6 flex justify-end">
              <div className="w-full sm:w-1/2 lg:w-1/3 space-y-3">
                <div className="flex justify-between text-sm text-zinc-500">
                  <span>Tạm tính</span>
                  <span className="font-medium text-zinc-900">{formatPrice(order.total)}</span>
                </div>
                <div className="flex justify-between text-sm text-zinc-500">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium text-emerald-600">Miễn phí</span>
                </div>
                <div className="pt-3 border-t border-zinc-200 flex justify-between">
                  <span className="font-bold text-zinc-900">Tổng cộng</span>
                  <span className="font-bold text-xl text-zinc-900">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-zinc-100 bg-zinc-50/50 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-zinc-900 text-white font-medium rounded-full hover:bg-zinc-800 transition-colors"
            >
              Đóng
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
