import React from 'react';
import { Users, ShoppingCart, DollarSign, Package } from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import { useProduct } from '../../context/ProductContext';
import { useUserManagement } from '../../context/UserManagementContext';
import { formatPrice } from '../../utils/format';

export function AdminDashboard() {
  const { orders } = useOrder();
  const { products } = useProduct();
  const { users } = useUserManagement();
  
  const totalRevenue = orders.filter(o => o.status === 'Đã giao').reduce((sum, o) => sum + o.total, 0);
  const newOrdersCount = orders.filter(o => o.status === 'Chờ xác nhận' || o.status === 'Đang xử lý').length;

  const stats = [
    { label: 'Tổng doanh thu', value: formatPrice(totalRevenue), icon: DollarSign, trend: '+12.5%' },
    { label: 'Đơn hàng mới', value: newOrdersCount.toString(), icon: ShoppingCart, trend: '+5.2%' },
    { label: 'Khách hàng', value: users.length.toString(), icon: Users, trend: '+18.1%' },
    { label: 'Sản phẩm', value: products.length.toString(), icon: Package, trend: '0%' },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-8">Tổng quan</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.trend.startsWith('+');
          return (
            <div key={index} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-zinc-100 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-zinc-600" />
                </div>
                <span className={`text-sm font-medium px-2.5 py-1 rounded-full ${
                  isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-600'
                }`}>
                  {stat.trend}
                </span>
              </div>
              <p className="text-sm font-medium text-zinc-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-zinc-900">{stat.value}</h3>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-zinc-900 mb-6">Đơn hàng gần đây</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-50 text-zinc-500 border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4 font-semibold rounded-tl-xl">Mã đơn hàng</th>
                <th className="px-6 py-4 font-semibold">Khách hàng</th>
                <th className="px-6 py-4 font-semibold">Ngày đặt</th>
                <th className="px-6 py-4 font-semibold">Tổng tiền</th>
                <th className="px-6 py-4 font-semibold">Trạng thái</th>
                <th className="px-6 py-4 font-semibold rounded-tr-xl text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-900">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                    Chưa có đơn hàng nào
                  </td>
                </tr>
              ) : recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-zinc-50/80 transition-colors">
                  <td className="px-6 py-4 font-medium">{order.id}</td>
                  <td className="px-6 py-4">{order.customerName}</td>
                  <td className="px-6 py-4 text-zinc-500">{order.date}</td>
                  <td className="px-6 py-4 font-medium">{formatPrice(order.total)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Đã giao' ? 'bg-emerald-100 text-emerald-800' :
                      order.status === 'Đang giao' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'Đang xử lý' ? 'bg-amber-100 text-amber-800' :
                      order.status === 'Đã hủy' ? 'bg-red-100 text-red-800' :
                      'bg-zinc-100 text-zinc-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-zinc-500 hover:text-zinc-900 font-medium">Chi tiết</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
