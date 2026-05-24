import React, { useState } from 'react';
import { Search, Eye, Filter, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useOrder, OrderStatus, Order } from '../../context/OrderContext';
import { formatPrice } from '../../utils/format';
import { OrderDetailModal } from '../../components/admin/OrderDetailModal';

export function AdminOrders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { orders, updateOrderStatus, deleteOrder } = useOrder();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Quản lý đơn hàng</h1>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" /> Lọc đơn hàng
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-zinc-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn, tên khách hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent text-sm"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="Chờ xác nhận">Chờ xác nhận</option>
              <option value="Đang xử lý">Đang xử lý</option>
              <option value="Đang giao">Đang giao</option>
              <option value="Đã giao">Đã giao</option>
              <option value="Đã hủy">Đã hủy</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-50 text-zinc-500 border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Mã đơn hàng</th>
                <th className="px-6 py-4 font-semibold">Khách hàng</th>
                <th className="px-6 py-4 font-semibold">Ngày đặt</th>
                <th className="px-6 py-4 font-semibold">Tổng tiền</th>
                <th className="px-6 py-4 font-semibold">Thanh toán</th>
                <th className="px-6 py-4 font-semibold">Trạng thái</th>
                <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-900">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-zinc-500">
                    Không tìm thấy đơn hàng nào
                  </td>
                </tr>
              ) : filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-zinc-50/80 transition-colors">
                  <td className="px-6 py-4 font-medium">{order.id}</td>
                  <td className="px-6 py-4">{order.customerName}</td>
                  <td className="px-6 py-4 text-zinc-500">{order.date}</td>
                  <td className="px-6 py-4 font-medium">{formatPrice(order.total)}</td>
                  <td className="px-6 py-4 text-zinc-500">{order.paymentMethod}</td>
                  <td className="px-6 py-4">
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className={`text-xs font-medium rounded-full px-2.5 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-zinc-900 ${
                        order.status === 'Đã giao' ? 'bg-emerald-100 text-emerald-800' :
                        order.status === 'Đang giao' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Đang xử lý' ? 'bg-amber-100 text-amber-800' :
                        order.status === 'Đã hủy' ? 'bg-red-100 text-red-800' :
                        'bg-zinc-100 text-zinc-800'
                      }`}
                    >
                      <option value="Chờ xác nhận">Chờ xác nhận</option>
                      <option value="Đang xử lý">Đang xử lý</option>
                      <option value="Đang giao">Đang giao</option>
                      <option value="Đã giao">Đã giao</option>
                      <option value="Đã hủy">Đã hủy</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsOrderModalOpen(true);
                        }}
                        className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors rounded-lg hover:bg-zinc-100" 
                        title="Xem chi tiết"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
                            deleteOrder(order.id);
                          }
                        }}
                        className="p-2 text-zinc-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50" 
                        title="Xóa đơn hàng"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-zinc-200 flex items-center justify-between text-sm text-zinc-500 bg-zinc-50/50">
          <span>Hiển thị {filteredOrders.length > 0 ? 1 : 0}-{filteredOrders.length} của {filteredOrders.length} đơn hàng</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-zinc-200 rounded-md hover:bg-zinc-100 disabled:opacity-50">Trước</button>
            <button className="px-3 py-1 border border-zinc-200 rounded-md bg-zinc-900 text-white">1</button>
            <button className="px-3 py-1 border border-zinc-200 rounded-md hover:bg-zinc-100 disabled:opacity-50">Sau</button>
          </div>
        </div>
      </div>

      <OrderDetailModal 
        order={selectedOrder} 
        isOpen={isOrderModalOpen} 
        onClose={() => setIsOrderModalOpen(false)} 
      />
    </div>
  );
}
