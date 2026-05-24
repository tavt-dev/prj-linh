import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, X, ChevronDown, Heart, Package, LogOut, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useCategory } from '../../context/CategoryContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../utils/cn';

export function Header() {
  const { cartCount, setIsCartOpen } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { user, logout, isAdmin } = useAuth();
  const { addToast } = useToast();
  const { categories } = useCategory();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    addToast('Đã đăng xuất', 'success');
    navigate('/');
  };

  // Xử lý hiệu ứng sticky header khi cuộn
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Đóng menu mobile khi chuyển trang
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsSearchFocused(false);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ease-out",
        isScrolled 
          ? "bg-white/90 backdrop-blur-lg border-b border-zinc-200/50 shadow-sm py-3" 
          : "bg-white border-b border-transparent py-5"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4 lg:gap-8">
        
        {/* Trái: Menu Mobile & Logo & Điều hướng Desktop */}
        <div className="flex items-center gap-6 lg:gap-8 flex-1">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 text-zinc-500 hover:text-zinc-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 rounded-md"
            aria-label="Mở menu"
          >
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </button>
          
          <Link 
            to="/" 
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 rounded-sm flex-shrink-0"
            aria-label="Trang chủ TennisPro"
          >
            <div className="flex h-8 w-8 items-center justify-center bg-zinc-900 text-white transition-transform duration-300 group-hover:scale-105">
              <span className="font-bold text-lg leading-none font-serif">T</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900 hidden sm:block">
              TennisPro
            </span>
          </Link>

          {/* Điều hướng Desktop */}
          <nav className="hidden lg:flex items-center gap-8">
            {/* Mega Menu Sản phẩm */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 rounded-sm">
                Sản phẩm
                <ChevronDown className="h-3.5 w-3.5 text-zinc-400 transition-transform duration-300 group-hover:rotate-180" strokeWidth={2} />
              </button>
              
              {/* Dropdown Mega Menu */}
              <div className="absolute top-full left-0 pt-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out">
                <div className="w-[640px] rounded-xl bg-white p-8 shadow-2xl ring-1 ring-zinc-900/5 flex gap-10">
                  {/* Cột 1: Danh mục */}
                  <div className="flex-1">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-5">Danh mục sản phẩm</h3>
                    <ul className="space-y-4">
                      <li>
                        <Link to="/products" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:translate-x-1 transition-all inline-block">Tất cả sản phẩm</Link>
                      </li>
                      {categories.map(cat => (
                        <li key={cat.id}>
                          <Link to={`/products?category=${cat.slug}`} className="text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:translate-x-1 transition-all inline-block">{cat.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Cột 2: Thương hiệu */}
                  <div className="flex-1">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-5">Thương hiệu</h3>
                    <ul className="space-y-4">
                      <li>
                        <Link to="/products?brand=Wilson" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:translate-x-1 transition-all inline-block">Wilson</Link>
                      </li>
                      <li>
                        <Link to="/products?brand=Babolat" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:translate-x-1 transition-all inline-block">Babolat</Link>
                      </li>
                      <li>
                        <Link to="/products?brand=Head" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:translate-x-1 transition-all inline-block">Head</Link>
                      </li>
                      <li>
                        <Link to="/products?brand=Yonex" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:translate-x-1 transition-all inline-block">Yonex</Link>
                      </li>
                    </ul>
                  </div>

                  {/* Cột 3: Khám phá */}
                  <div className="flex-1 bg-zinc-50 -my-8 -mr-8 p-8 rounded-r-xl border-l border-zinc-100">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-5">Khám phá</h3>
                    <ul className="space-y-4">
                      <li>
                        <Link to="/products?sale=true" className="text-sm font-medium text-red-600 hover:text-red-700 hover:translate-x-1 transition-all inline-block">Khuyến mãi</Link>
                      </li>
                      <li>
                        <Link to="/products?category=accessories" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:translate-x-1 transition-all inline-block">Phụ kiện</Link>
                      </li>
                      <li>
                        <Link to="/guide" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:translate-x-1 transition-all inline-block">Hướng dẫn chọn vợt</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <Link 
              to="/news" 
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 rounded-sm"
            >
              Tin tức
            </Link>
          </nav>
        </div>

        {/* Giữa: Thanh tìm kiếm lớn */}
        <div className="hidden md:flex flex-1 justify-center max-w-3xl px-4">
          <form 
            onSubmit={handleSearch} 
            className="w-full relative flex items-center group"
          >
            <Search 
              className={cn(
                "absolute left-5 h-5 w-5 transition-colors duration-300 z-10",
                isSearchFocused ? "text-zinc-900" : "text-zinc-400"
              )} 
              strokeWidth={1.5} 
            />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm, thương hiệu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full h-12 rounded-full border border-zinc-200 bg-zinc-50/80 pl-12 pr-5 text-base text-zinc-900 placeholder:text-zinc-400 transition-all duration-300 ease-out focus:outline-none focus:border-zinc-300 focus:bg-white focus:ring-4 focus:ring-zinc-900/5 hover:bg-zinc-50 hover:border-zinc-300"
            />
          </form>
        </div>

        {/* Phải: Tài khoản, Giỏ hàng */}
        <div className="flex items-center justify-end gap-2 sm:gap-4 flex-1">
          
          {/* Nút Tìm kiếm trên Mobile */}
          <button 
            className="md:hidden relative flex items-center justify-center h-10 w-10 rounded-full text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-all focus:outline-none"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Search className="h-5 w-5" strokeWidth={1.5} />
          </button>

          {/* Dropdown Tài khoản */}
          <div className="relative group hidden sm:block">
            <Link 
              to={user ? (isAdmin ? "/admin" : "/account") : "/login"} 
              className="relative flex items-center justify-center h-10 w-10 rounded-full text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 overflow-hidden"
              aria-label="Tài khoản"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <User className="h-5 w-5" strokeWidth={1.5} />
              )}
              {/* Chấm đỏ nếu có sản phẩm yêu thích */}
              {wishlistItems.length > 0 && !user && (
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              )}
            </Link>

            {/* Menu Tài khoản */}
            <div className="absolute top-full right-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out z-50">
              <div className="w-56 rounded-xl bg-white p-2 shadow-xl ring-1 ring-zinc-900/5">
                {user ? (
                  <>
                    <div className="px-3 py-2 border-b border-zinc-100 mb-1">
                      <p className="text-sm font-medium text-zinc-900 truncate">{user.name}</p>
                      <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                    </div>
                    {isAdmin ? (
                      <Link to="/admin" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors">
                        <ShieldCheck className="h-4 w-4" strokeWidth={1.5} />
                        Trang quản trị
                      </Link>
                    ) : (
                      <Link to="/account" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors">
                        <User className="h-4 w-4" strokeWidth={1.5} />
                        Hồ sơ của tôi
                      </Link>
                    )}
                    <Link to="/wishlist" className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors">
                      <div className="flex items-center gap-3">
                        <Heart className="h-4 w-4" strokeWidth={1.5} />
                        Yêu thích
                      </div>
                      {wishlistItems.length > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 text-[10px] font-medium text-zinc-900">
                          {wishlistItems.length}
                        </span>
                      )}
                    </Link>
                    {!isAdmin && (
                      <Link to="/account" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors">
                        <Package className="h-4 w-4" strokeWidth={1.5} />
                        Đơn hàng
                      </Link>
                    )}
                    <div className="h-px bg-zinc-100 my-1" />
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left">
                      <LogOut className="h-4 w-4" strokeWidth={1.5} />
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <div className="px-3 py-2 border-b border-zinc-100 mb-1">
                      <p className="text-sm font-medium text-zinc-900">Khách</p>
                    </div>
                    <Link to="/login" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors">
                      <User className="h-4 w-4" strokeWidth={1.5} />
                      Đăng nhập
                    </Link>
                    <Link to="/register" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors">
                      <User className="h-4 w-4" strokeWidth={1.5} />
                      Đăng ký
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Nút Yêu thích */}
          <Link
            to="/wishlist"
            className="relative hidden sm:flex items-center justify-center h-10 w-10 rounded-full text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
            aria-label="Yêu thích"
          >
            <Heart className="h-5 w-5" strokeWidth={1.5} />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white ring-2 ring-white shadow-sm">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          {/* Nút Giỏ hàng */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center h-10 w-10 rounded-full text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
            aria-label="Giỏ hàng"
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-medium text-white ring-2 ring-white shadow-sm">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Drawer Menu Mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-menu-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-50 bg-zinc-900/40 backdrop-blur-sm lg:hidden"
          />
        )}
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-menu-panel"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 w-[85vw] max-w-[320px] bg-white shadow-2xl lg:hidden flex flex-col"
          >
            {/* Header Mobile */}
            <div className="flex items-center justify-between border-b border-zinc-100 p-5">
              <Link to="/" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="flex h-8 w-8 items-center justify-center bg-zinc-900 text-white">
                  <span className="font-bold text-lg leading-none font-serif">T</span>
                </div>
                <span className="text-xl font-bold tracking-tight text-zinc-900">
                  TennisPro
                </span>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Tìm kiếm Mobile */}
            <div className="p-5 border-b border-zinc-100">
              <form onSubmit={handleSearch} className="relative flex items-center">
                <Search className="absolute left-3 h-4 w-4 text-zinc-400" strokeWidth={1.5} />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11 w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm focus:border-zinc-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all"
                />
              </form>
            </div>

            {/* Điều hướng Mobile */}
            <nav className="flex-1 overflow-y-auto py-5 px-3">
              <div className="space-y-1">
                <div className="px-3 pb-2">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Danh mục</h3>
                </div>
                
                <div className="space-y-1">
                  <Link
                    to="/products"
                    className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50 transition-colors"
                  >
                    Tất cả sản phẩm
                  </Link>
                  {categories.map(cat => (
                    <Link
                      key={cat.id}
                      to={`/products?category=${cat.slug}`}
                      className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <Link
                    to="/products?sale=true"
                    className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Khuyến mãi
                  </Link>
                  <Link
                    to="/news"
                    className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50 transition-colors"
                  >
                    Tin tức
                  </Link>
                </div>
              </div>

              <div className="mt-8 space-y-1">
                <div className="px-3 pb-2">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Tài khoản</h3>
                </div>
                {user ? (
                  <>
                    <div className="px-3 py-2 mb-2">
                      <p className="text-sm font-medium text-zinc-900">{user.name}</p>
                      <p className="text-xs text-zinc-500">{user.email}</p>
                    </div>
                    {isAdmin ? (
                      <Link
                        to="/admin"
                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50 transition-colors"
                      >
                        <ShieldCheck className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
                        Trang quản trị
                      </Link>
                    ) : (
                      <Link
                        to="/account"
                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50 transition-colors"
                      >
                        <User className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
                        Tài khoản của tôi
                      </Link>
                    )}
                    <Link
                      to="/wishlist"
                      className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Heart className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
                        Yêu thích
                      </div>
                      {wishlistItems.length > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 text-[10px] font-medium text-zinc-900">
                          {wishlistItems.length}
                        </span>
                      )}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut className="h-4 w-4 text-red-500" strokeWidth={1.5} />
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50 transition-colors"
                    >
                      <User className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
                      Đăng nhập
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50 transition-colors"
                    >
                      <User className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
                      Đăng ký
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
