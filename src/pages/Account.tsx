import React, { useState, useEffect } from 'react';
import { User, Package, Heart, LogOut, MapPin, Edit2, Plus, Trash2, ChevronRight, ShieldCheck, Camera } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { formatPrice } from '../utils/format';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useOrder, Order } from '../context/OrderContext';
import { OrderDetailModal } from '../components/admin/OrderDetailModal';

export function Account() {
  const { addToast } = useToast();
  const { user, logout, updateUser } = useAuth();
  const { getUserOrders } = useOrder();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses'>('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);

  useEffect(() => {
    if (location.hash === '#orders') {
      setActiveTab('orders');
    } else if (location.hash === '#addresses') {
      setActiveTab('addresses');
    } else if (location.hash === '#profile') {
      setActiveTab('profile');
    }
  }, [location.hash]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const addresses = user?.addresses || [];

  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const handleSaveAddress = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newAddr = {
      id: editingAddress ? editingAddress.id : Date.now().toString(),
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      type: formData.get('type') as string,
      isDefault: formData.get('isDefault') === 'on'
    };

    let updatedAddresses = [...addresses];
    if (newAddr.isDefault) {
      updatedAddresses = updatedAddresses.map(a => ({ ...a, isDefault: false }));
    }

    if (editingAddress) {
      updatedAddresses = updatedAddresses.map(a => a.id === editingAddress.id ? { ...a, ...newAddr } : a);
    } else {
      updatedAddresses.push(newAddr);
    }

    if (updatedAddresses.length > 0 && !updatedAddresses.some(a => a.isDefault)) {
      updatedAddresses[0].isDefault = true;
    }

    updateUser({ addresses: updatedAddresses });
    setEditingAddress(null);
    setIsAdding(false);
    addToast(editingAddress ? 'Cập nhật địa chỉ thành công!' : 'Thêm địa chỉ mới thành công!', 'success');
  };

  const handleDeleteAddress = (id: string) => {
    setAddressToDelete(id);
  };

  const confirmDeleteAddress = () => {
    if (addressToDelete) {
      let updated = addresses.filter(a => a.id !== addressToDelete);
      if (updated.length > 0 && !updated.some(a => a.isDefault)) {
        updated[0].isDefault = true;
      }
      updateUser({ addresses: updated });
      setAddressToDelete(null);
      addToast('Đã xóa địa chỉ thành công!', 'success');
    }
  };

  const userOrders = getUserOrders(user?.id || '');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đã giao': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Đang giao': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Đang xử lý': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Đã hủy': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-zinc-100 text-zinc-800 border-zinc-200';
    }
  };

  const tabs = [
    { id: 'profile', label: 'Thông tin tài khoản', icon: User },
    { id: 'orders', label: 'Quản lý đơn hàng', icon: Package },
    { id: 'addresses', label: 'Sổ địa chỉ', icon: MapPin },
  ] as const;

  const [profile, setProfile] = useState({
    name: user?.name || 'Nguyễn Văn A',
    phone: user?.phone || '0901234567',
    email: user?.email || 'nguyenvana@example.com',
    avatar: user?.avatar || ''
  });

  const handleSaveProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newName = formData.get('name') as string;
    const newPhone = formData.get('phone') as string;
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    
    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        addToast('Mật khẩu mới không khớp!', 'error');
        return;
      }
      if (!currentPassword) {
        addToast('Vui lòng nhập mật khẩu hiện tại!', 'error');
        return;
      }
      // In a real app, we would verify currentPassword and update it here
      addToast('Cập nhật mật khẩu thành công!', 'success');
    }
    
    setProfile({
      ...profile,
      name: newName,
      phone: newPhone,
    });
    updateUser({ name: newName, phone: newPhone });
    setIsEditingProfile(false);
    addToast('Cập nhật thông tin cá nhân thành công!', 'success');
  };

  const handleSaveAvatar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newAvatar = formData.get('avatar') as string;
    setProfile(prev => ({ ...prev, avatar: newAvatar }));
    updateUser({ avatar: newAvatar });
    setIsEditingAvatar(false);
    addToast('Cập nhật ảnh đại diện thành công!', 'success');
  };

  const handleLogout = () => {
    logout();
    addToast('Đã đăng xuất', 'success');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-8 lg:pt-32 lg:pb-12">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Sidebar */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-3xl p-6 mb-6 border border-zinc-200 shadow-sm sticky top-24">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="relative group cursor-pointer mb-4" onClick={() => setIsEditingAvatar(true)}>
                <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-white overflow-hidden">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
                  ) : (
                    profile.name.split(' ').map(n => n[0]).slice(-2).join('').toUpperCase()
                  )}
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <button className="absolute bottom-0 right-0 h-8 w-8 bg-white rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:text-zinc-900 shadow-sm transition-colors hover:scale-105">
                  <Edit2 className="h-4 w-4" />
                </button>
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-900">{profile.name}</h2>
                <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full border border-emerald-100">
                  <ShieldCheck className="h-4 w-4" /> {user.role === 'admin' ? 'Quản trị viên' : 'Thành viên Bạc'}
                </div>
              </div>
            </div>

            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-between w-full px-4 py-3.5 text-sm font-medium rounded-2xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-zinc-900 text-white shadow-md' 
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-zinc-400'}`} /> 
                      {tab.label}
                    </div>
                    {isActive && <ChevronRight className="h-4 w-4 text-white/70" />}
                  </button>
                );
              })}
              
              <Link
                to="/wishlist"
                className="flex items-center justify-between w-full px-4 py-3.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 rounded-2xl transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-zinc-400" /> Sản phẩm yêu thích
                </div>
              </Link>
              
              <div className="pt-4 mt-4 border-t border-zinc-100">
                <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-2xl transition-colors">
                  <LogOut className="h-5 w-5 text-red-500" /> Đăng xuất
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div 
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden"
              >
                <div className="p-6 sm:p-8 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                  <div>
                    <h3 className="text-2xl font-bold text-zinc-900">Thông tin cá nhân</h3>
                    <p className="text-zinc-500 mt-1">Quản lý thông tin cá nhân và bảo mật tài khoản của bạn.</p>
                  </div>
                  {!isEditingProfile && (
                    <Button variant="outline" onClick={() => setIsEditingProfile(true)} className="rounded-full">
                      <Edit2 className="h-4 w-4 mr-2" /> Chỉnh sửa
                    </Button>
                  )}
                </div>
                
                <div className="p-6 sm:p-8">
                  {isEditingProfile ? (
                    <form onSubmit={handleSaveProfile} className="space-y-8 max-w-2xl">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Input name="name" label="Họ và tên" defaultValue={profile.name} required />
                        <Input name="phone" label="Số điện thoại" defaultValue={profile.phone} required />
                      </div>
                      <Input label="Email" type="email" defaultValue={profile.email} disabled />
                      
                      <div className="pt-8 mt-8 border-t border-zinc-100">
                        <div className="mb-6">
                          <h4 className="text-lg font-bold text-zinc-900">Thay đổi mật khẩu</h4>
                          <p className="text-sm text-zinc-500 mt-1">Để trống nếu bạn không muốn thay đổi mật khẩu.</p>
                        </div>
                        <div className="space-y-5 bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                          <Input name="currentPassword" label="Mật khẩu hiện tại" type="password" />
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Input name="newPassword" label="Mật khẩu mới" type="password" />
                            <Input name="confirmPassword" label="Xác nhận mật khẩu mới" type="password" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-3 pt-6">
                        <Button type="button" variant="outline" onClick={() => setIsEditingProfile(false)} className="rounded-full px-6">Hủy</Button>
                        <Button type="submit" className="rounded-full px-8">Lưu thay đổi</Button>
                      </div>
                    </form>
                  ) : (
                    <div className="max-w-2xl">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6">
                        <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                          <p className="text-sm font-medium text-zinc-500 mb-1">Họ và tên</p>
                          <p className="text-base font-semibold text-zinc-900">{profile.name}</p>
                        </div>
                        <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                          <p className="text-sm font-medium text-zinc-500 mb-1">Số điện thoại</p>
                          <p className="text-base font-semibold text-zinc-900">{profile.phone}</p>
                        </div>
                        <div className="sm:col-span-2 bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                          <p className="text-sm font-medium text-zinc-500 mb-1">Email</p>
                          <p className="text-base font-semibold text-zinc-900">{profile.email}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div 
                key="orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm"
              >
                <div className="p-6 sm:p-8 border-b border-zinc-100 bg-zinc-50/50">
                  <h3 className="text-2xl font-bold text-zinc-900">Lịch sử đơn hàng</h3>
                  <p className="text-zinc-500 mt-1">Theo dõi và quản lý các đơn hàng bạn đã đặt.</p>
                </div>
                
                <div className="overflow-x-auto">
                  {userOrders.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center justify-center">
                      <div className="h-20 w-20 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
                        <Package className="h-10 w-10 text-zinc-300" />
                      </div>
                      <h4 className="text-lg font-bold text-zinc-900 mb-2">Chưa có đơn hàng nào</h4>
                      <p className="text-zinc-500 mb-6 max-w-sm">Bạn chưa thực hiện bất kỳ đơn hàng nào. Hãy khám phá các sản phẩm của chúng tôi.</p>
                      <Button onClick={() => navigate('/products')} className="rounded-full px-8">
                        Mua sắm ngay
                      </Button>
                    </div>
                  ) : (
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-zinc-50/50 text-zinc-500 border-b border-zinc-200">
                        <tr>
                          <th className="px-6 py-4 font-semibold">Mã đơn hàng</th>
                          <th className="px-6 py-4 font-semibold">Ngày đặt</th>
                          <th className="px-6 py-4 font-semibold">Sản phẩm</th>
                          <th className="px-6 py-4 font-semibold">Tổng tiền</th>
                          <th className="px-6 py-4 font-semibold">Trạng thái</th>
                          <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 text-zinc-900">
                        {userOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-zinc-50/80 transition-colors group">
                            <td className="px-6 py-5 font-bold text-zinc-900">{order.id}</td>
                            <td className="px-6 py-5 text-zinc-500">{order.date}</td>
                            <td className="px-6 py-5 text-zinc-600">{order.items.length} sản phẩm</td>
                            <td className="px-6 py-5 font-bold">{formatPrice(order.total)}</td>
                            <td className="px-6 py-5">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-right">
                              <button 
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setIsOrderModalOpen(true);
                                }}
                                className="inline-flex items-center justify-center h-9 px-5 rounded-full bg-white border border-zinc-200 text-sm font-medium text-zinc-700 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all shadow-sm"
                              >
                                Chi tiết
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'addresses' && (
              <motion.div 
                key="addresses"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden"
              >
                {isAdding || editingAddress ? (
                  <div className="p-6 sm:p-8">
                    <div className="mb-8 pb-6 border-b border-zinc-100">
                      <h3 className="text-2xl font-bold text-zinc-900">
                        {editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
                      </h3>
                      <p className="text-zinc-500 mt-1">Vui lòng điền đầy đủ thông tin bên dưới.</p>
                    </div>
                    <form onSubmit={handleSaveAddress} className="space-y-6 max-w-2xl">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Input label="Họ và tên" name="name" defaultValue={editingAddress?.name || ''} required />
                        <Input label="Số điện thoại" name="phone" defaultValue={editingAddress?.phone || ''} required />
                      </div>
                      <Input label="Địa chỉ chi tiết" name="address" defaultValue={editingAddress?.address || ''} required />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Input label="Loại địa chỉ (VD: Nhà riêng, Công ty)" name="type" defaultValue={editingAddress?.type || ''} />
                      </div>
                      <div className="flex items-center gap-3 mt-6 bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                        <input 
                          type="checkbox" 
                          id="isDefault" 
                          name="isDefault" 
                          defaultChecked={editingAddress?.isDefault || false}
                          className="w-5 h-5 text-zinc-900 border-zinc-300 rounded focus:ring-zinc-900"
                        />
                        <label htmlFor="isDefault" className="text-sm font-medium text-zinc-700 cursor-pointer">Đặt làm địa chỉ mặc định</label>
                      </div>
                      
                      <div className="flex justify-end gap-3 pt-6 mt-8 border-t border-zinc-100">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => { setEditingAddress(null); setIsAdding(false); }}
                          className="rounded-full px-6"
                        >
                          Hủy
                        </Button>
                        <Button type="submit" className="rounded-full px-8">Lưu địa chỉ</Button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <>
                    <div className="p-6 sm:p-8 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-50/50">
                      <div>
                        <h3 className="text-2xl font-bold text-zinc-900">Sổ địa chỉ</h3>
                        <p className="text-zinc-500 mt-1">Quản lý địa chỉ giao hàng của bạn.</p>
                      </div>
                      <Button onClick={() => setIsAdding(true)} className="rounded-full gap-2 shrink-0 shadow-sm">
                        <Plus className="h-4 w-4" /> Thêm địa chỉ mới
                      </Button>
                    </div>
                    
                    <div className="p-6 sm:p-8">
                      {addresses.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="h-20 w-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPin className="h-10 w-10 text-zinc-300" />
                          </div>
                          <h4 className="text-lg font-bold text-zinc-900 mb-2">Chưa có địa chỉ nào</h4>
                          <p className="text-zinc-500 mb-6 max-w-sm mx-auto">Bạn chưa lưu địa chỉ nào. Thêm địa chỉ để thanh toán nhanh chóng hơn.</p>
                          <Button onClick={() => setIsAdding(true)} variant="outline" className="rounded-full px-8">
                            Thêm địa chỉ ngay
                          </Button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {addresses.map((addr) => (
                            <div key={addr.id} className={`border rounded-3xl p-6 relative flex flex-col transition-all duration-200 ${addr.isDefault ? 'border-zinc-900 bg-zinc-50/50 shadow-md ring-1 ring-zinc-900' : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm'}`}>
                              {addr.isDefault && (
                                <div className="absolute top-6 right-6 bg-zinc-900 text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-full shadow-sm">
                                  Mặc định
                                </div>
                              )}
                              <div className="flex items-start gap-4 mb-5">
                                <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${addr.isDefault ? 'bg-zinc-200/50 text-zinc-700' : 'bg-zinc-100 text-zinc-500'}`}>
                                  <MapPin className="h-6 w-6" />
                                </div>
                                <div className="pt-1">
                                  <p className="font-bold text-zinc-900 text-lg flex items-center gap-2">
                                    {addr.name} 
                                    {addr.type && <span className="text-xs font-medium px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded-md">{addr.type}</span>}
                                  </p>
                                  <p className="text-sm text-zinc-500 mt-1">{addr.phone}</p>
                                </div>
                              </div>
                              <p className="text-sm text-zinc-600 mb-8 leading-relaxed bg-zinc-50/50 p-4 rounded-2xl border border-zinc-100">
                                {addr.address}
                              </p>
                              <div className="flex items-center gap-3 mt-auto">
                                <Button onClick={() => setEditingAddress(addr)} variant="outline" className="flex-1 rounded-xl gap-2 h-11 bg-white">
                                  <Edit2 className="h-4 w-4" /> Chỉnh sửa
                                </Button>
                                {!addr.isDefault && (
                                  <Button onClick={() => handleDeleteAddress(addr.id)} variant="outline" className="flex-1 rounded-xl gap-2 h-11 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 bg-white">
                                    <Trash2 className="h-4 w-4" /> Xóa
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {/* Delete Address Modal */}
      <AnimatePresence>
        {addressToDelete && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAddressToDelete(null)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-4"
            >
              <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="p-6 sm:p-8">
                  <h3 className="text-xl font-bold text-zinc-900 mb-2">Xóa địa chỉ</h3>
                  <p className="text-zinc-500 mb-8">Bạn có chắc chắn muốn xóa địa chỉ này? Hành động này không thể hoàn tác.</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="outline" className="flex-1 rounded-xl h-12" onClick={() => setAddressToDelete(null)}>
                      Hủy
                    </Button>
                    <Button variant="danger" className="flex-1 rounded-xl h-12" onClick={confirmDeleteAddress}>
                      Xóa địa chỉ
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <OrderDetailModal 
        order={selectedOrder} 
        isOpen={isOrderModalOpen} 
        onClose={() => setIsOrderModalOpen(false)} 
      />

      {/* Edit Avatar Modal */}
      <AnimatePresence>
        {isEditingAvatar && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditingAvatar(false)}
              className="fixed inset-0 z-40 bg-zinc-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-4"
            >
              <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="p-6 sm:p-8">
                  <h3 className="text-xl font-bold text-zinc-900 mb-6">Cập nhật ảnh đại diện</h3>
                  <form onSubmit={handleSaveAvatar} className="space-y-6">
                    <Input
                      name="avatar"
                      label="URL Ảnh đại diện"
                      defaultValue={profile.avatar}
                      placeholder="https://example.com/avatar.jpg"
                      required
                    />
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button type="button" variant="outline" className="flex-1 rounded-xl h-12" onClick={() => setIsEditingAvatar(false)}>
                        Hủy
                      </Button>
                      <Button type="submit" className="flex-1 rounded-xl h-12">
                        Lưu thay đổi
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
