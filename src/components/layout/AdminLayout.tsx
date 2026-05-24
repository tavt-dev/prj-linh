import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Menu, X, FolderTree } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function AdminLayout() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!isAdmin) {
      addToast('Bạn không có quyền truy cập trang này', 'error');
      navigate('/');
    }
  }, [user, isAdmin, navigate, addToast]);

  // Đóng menu mobile khi chuyển trang
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  if (!user || !isAdmin) return null;

  const handleLogout = () => {
    logout();
    addToast('Đã đăng xuất', 'success');
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin', label: 'Tổng quan', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Sản phẩm', icon: Package },
    { path: '/admin/categories', label: 'Danh mục', icon: FolderTree },
    { path: '/admin/orders', label: 'Đơn hàng', icon: ShoppingCart },
    { path: '/admin/users', label: 'Người dùng', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-zinc-900 text-white p-4 flex items-center justify-between sticky top-0 z-40">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center bg-white text-zinc-900 rounded-lg">
            <span className="font-bold text-lg leading-none font-serif">T</span>
          </div>
          <span className="text-xl font-bold tracking-tight">Admin Panel</span>
        </Link>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-zinc-400 hover:text-white focus:outline-none"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 text-white flex flex-col transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static md:h-screen md:sticky md:top-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-zinc-800 hidden md:block">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center bg-white text-zinc-900 rounded-lg">
              <span className="font-bold text-lg leading-none font-serif">T</span>
            </div>
            <span className="text-xl font-bold tracking-tight">
              Admin Panel
            </span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto mt-4 md:mt-0">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-zinc-800 text-white' 
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                user.name.split(' ').map(n => n[0]).slice(-2).join('').toUpperCase()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-zinc-400 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 w-full overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
