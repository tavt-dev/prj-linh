import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { AdminLayout } from './components/layout/AdminLayout';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Wishlist } from './pages/Wishlist';
import { Account } from './pages/Account';
import { News } from './pages/News';
import { NewsDetail } from './pages/NewsDetail';
import { NotFound } from './pages/NotFound';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminCategories } from './pages/admin/AdminCategories';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import { ProductProvider } from './context/ProductContext';
import { UserManagementProvider } from './context/UserManagementContext';
import { CategoryProvider } from './context/CategoryContext';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <UserManagementProvider>
          <CategoryProvider>
            <ProductProvider>
              <OrderProvider>
                <CartProvider>
                  <WishlistProvider>
            <Router>
              <Routes>
                {/* User Routes */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="products" element={<Products />} />
                  <Route path="product/:slug" element={<ProductDetail />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="wishlist" element={<Wishlist />} />
                  <Route path="account" element={<Account />} />
                  <Route path="news" element={<News />} />
                  <Route path="news/:id" element={<NewsDetail />} />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route path="*" element={<NotFound />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="users" element={<AdminUsers />} />
                </Route>
              </Routes>
            </Router>
                </WishlistProvider>
              </CartProvider>
            </OrderProvider>
          </ProductProvider>
          </CategoryProvider>
        </UserManagementProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
