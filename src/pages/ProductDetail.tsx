import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Heart, Share2, ShieldCheck, Truck, RotateCcw, ChevronRight } from 'lucide-react';
import { useProduct } from '../context/ProductContext';
import { ProductGallery } from '../components/product/ProductGallery';
import { ProductGrid } from '../components/product/ProductGrid';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatPrice } from '../utils/format';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'motion/react';

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { products } = useProduct();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const product = products.find((p) => p.slug === slug);
  
  const [selectedGrip, setSelectedGrip] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product && product.gripSizes.length > 0) {
      setSelectedGrip(product.gripSizes[0]);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold text-zinc-900 mb-4">Không tìm thấy sản phẩm</h2>
        <p className="text-zinc-500 mb-8">Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <Button onClick={() => navigate('/products')}>Quay lại cửa hàng</Button>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const relatedProducts = products.filter((p) => p.brand === product.brand && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedGrip) return;
    addToCart(product, quantity, selectedGrip);
  };

  const handleBuyNow = () => {
    if (!selectedGrip) return;
    addToCart(product, quantity, selectedGrip);
    navigate('/checkout');
  };

  const handleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-8 lg:pt-32 lg:pb-12">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-zinc-500 mb-8">
        <ol className="flex items-center space-x-2">
          <li><Link to="/" className="hover:text-zinc-900 transition-colors">Trang chủ</Link></li>
          <li><ChevronRight className="h-4 w-4" /></li>
          <li><Link to="/products" className="hover:text-zinc-900 transition-colors">Vợt Tennis</Link></li>
          <li><ChevronRight className="h-4 w-4" /></li>
          <li><Link to={`/products?brand=${product.brand}`} className="hover:text-zinc-900 transition-colors">{product.brand}</Link></li>
          <li><ChevronRight className="h-4 w-4" /></li>
          <li className="font-medium text-zinc-900 truncate max-w-[200px] sm:max-w-none">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Gallery */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ProductGallery images={product.images} video={product.video} />
        </motion.div>

        {/* Product Info */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="flex flex-col"
        >
          <motion.div variants={staggerItem} className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{product.brand}</p>
            <div className="flex items-center gap-4">
              <button className="text-zinc-400 hover:text-zinc-900 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
              <button onClick={handleWishlist} className="text-zinc-400 hover:text-red-500 transition-colors">
                <Heart className={cn("h-5 w-5 transition-transform active:scale-75", isWishlisted && "fill-red-500 text-red-500")} />
              </button>
            </div>
          </motion.div>

          <motion.h1 variants={staggerItem} className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 mb-4 leading-tight">
            {product.name}
          </motion.h1>

          <motion.div variants={staggerItem} className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1 text-zinc-900">
              <Star className="h-4 w-4 fill-current text-amber-400" />
              <span className="text-sm font-semibold">{product.rating}</span>
            </div>
            <span className="text-sm text-zinc-500 underline cursor-pointer hover:text-zinc-900 transition-colors">
              {product.reviewsCount} đánh giá
            </span>
            <div className="flex gap-2 ml-auto">
              {product.isNew && <Badge variant="success">Mới</Badge>}
              {product.isBestSeller && <Badge variant="warning">Bán chạy</Badge>}
            </div>
          </motion.div>

          <motion.div variants={staggerItem} className="flex items-end gap-4 mb-8">
            {product.salePrice ? (
              <>
                <span className="text-4xl font-bold text-red-600 tracking-tight">{formatPrice(product.salePrice)}</span>
                <span className="text-xl text-zinc-400 line-through mb-1">{formatPrice(product.price)}</span>
                <Badge variant="danger" className="mb-2">-{product.discountPercent}%</Badge>
              </>
            ) : (
              <span className="text-4xl font-bold text-zinc-900 tracking-tight">{formatPrice(product.price)}</span>
            )}
          </motion.div>

          <motion.p variants={staggerItem} className="text-base text-zinc-600 mb-8 leading-relaxed font-light">
            {product.description}
          </motion.p>

          <motion.div variants={staggerItem} className="space-y-8 mb-10">
            {/* Grip Size / Size */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
                  {product.category === 'Quần áo thể thao' ? 'Kích cỡ (Size)' : 
                   product.category === 'Bóng Tennis' || product.category === 'Quả cầu lông' ? 'Loại' : 
                   'Kích cỡ cán vợt (Grip Size)'}
                </h3>
                <a href="#" className="text-sm text-zinc-500 underline hover:text-zinc-900 transition-colors">Hướng dẫn chọn size</a>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.gripSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedGrip(size)}
                    className={cn(
                      "flex h-12 min-w-[4rem] items-center justify-center rounded-xl border-2 px-4 text-sm font-semibold transition-all duration-200",
                      selectedGrip === size
                        ? "border-zinc-900 bg-zinc-900 text-white shadow-md scale-105"
                        : "border-zinc-200 bg-white text-zinc-900 hover:border-zinc-900 hover:bg-zinc-50"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-sm font-bold text-zinc-900 mb-4 uppercase tracking-wider">Số lượng</h3>
              <div className="flex items-center w-36 rounded-xl border-2 border-zinc-200 p-1 bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
                >
                  -
                </button>
                <span className="flex-1 text-center font-semibold text-zinc-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
                >
                  +
                </button>
              </div>
              <p className="text-xs text-zinc-500 mt-2">Còn {product.stock} sản phẩm trong kho</p>
            </div>
          </motion.div>

          <motion.div variants={staggerItem} className="flex flex-col sm:flex-row gap-4 mb-10">
            <Button
              size="lg"
              variant="outline"
              className="flex-1 h-14 rounded-full text-base font-semibold border-2"
              onClick={handleAddToCart}
              disabled={!selectedGrip}
            >
              Thêm vào giỏ hàng
            </Button>
            <Button
              size="lg"
              className="flex-1 h-14 rounded-full text-base font-semibold shadow-lg shadow-zinc-900/20"
              onClick={handleBuyNow}
              disabled={!selectedGrip}
            >
              Mua ngay
            </Button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div variants={staggerItem} className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8 border-y border-zinc-200">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100">
                <ShieldCheck className="h-5 w-5 text-zinc-900 shrink-0" />
              </div>
              <span className="text-sm font-medium text-zinc-700">Bảo hành chính hãng 1 năm</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100">
                <Truck className="h-5 w-5 text-zinc-900 shrink-0" />
              </div>
              <span className="text-sm font-medium text-zinc-700">Giao hàng toàn quốc</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100">
                <RotateCcw className="h-5 w-5 text-zinc-900 shrink-0" />
              </div>
              <span className="text-sm font-medium text-zinc-700">Đổi trả trong 7 ngày</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="mt-16 lg:mt-24">
        <div className="border-b border-zinc-200">
          <nav className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide">
            {(['description', 'specifications', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "whitespace-nowrap text-base font-bold uppercase tracking-wider transition-colors relative px-1",
                  activeTab === tab ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
                )}
              >
                {tab === 'description' ? 'Mô tả chi tiết' : tab === 'specifications' ? 'Thông số kỹ thuật' : 'Đánh giá'}
                {activeTab === tab && (
                  <motion.span 
                    layoutId="activeTab"
                    className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-zinc-900" 
                  />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="py-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'description' && (
                <div className="prose prose-zinc max-w-none text-zinc-600 font-light">
                  <p className="text-lg leading-relaxed">{product.description}</p>
                  <p className="mt-6 text-lg leading-relaxed">
                    Được thiết kế dành cho những người chơi đam mê, sản phẩm này mang lại sự kết hợp hoàn hảo giữa công nghệ hiện đại và thiết kế tinh tế. Sản phẩm được tối ưu hóa để tăng cường độ ổn định và cảm giác, giúp bạn tự tin trong từng khoảnh khắc trên sân.
                  </p>
                </div>
              )}
              
              {activeTab === 'specifications' && (
                <div className="max-w-3xl">
                  <div className="divide-y divide-zinc-100 border border-zinc-200 rounded-2xl overflow-hidden">
                    {Object.entries(product.specifications).map(([key, value], index) => (
                      <div key={key} className={cn("flex py-4 px-6", index % 2 === 0 ? "bg-zinc-50" : "bg-white")}>
                        <dt className="w-1/2 text-sm font-semibold text-zinc-900">{key}</dt>
                        <dd className="w-1/2 text-sm text-zinc-600">{value}</dd>
                      </div>
                    ))}
                    <div className="flex py-4 px-6 bg-zinc-50">
                      <dt className="w-1/2 text-sm font-semibold text-zinc-900">Chất liệu</dt>
                      <dd className="w-1/2 text-sm text-zinc-600">{product.material}</dd>
                    </div>
                    <div className="flex py-4 px-6 bg-white">
                      <dt className="w-1/2 text-sm font-semibold text-zinc-900">Trình độ</dt>
                      <dd className="w-1/2 text-sm text-zinc-600">{product.level.join(', ')}</dd>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="max-w-3xl">
                  <div className="flex items-center gap-6 mb-10 bg-zinc-50 p-8 rounded-3xl">
                    <div className="text-6xl font-bold text-zinc-900">{product.rating}</div>
                    <div>
                      <div className="flex items-center gap-1 text-zinc-900 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={cn("h-6 w-6", star <= Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-zinc-300")} />
                        ))}
                      </div>
                      <p className="text-sm font-medium text-zinc-500">Dựa trên {product.reviewsCount} đánh giá</p>
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    {/* Mock Reviews */}
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="border-b border-zinc-100 pb-8 last:border-0">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-zinc-500">
                              KH
                            </div>
                            <div>
                              <div className="font-bold text-zinc-900">Khách hàng {i}</div>
                              <div className="text-xs text-zinc-500">2 ngày trước</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="h-4 w-4 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-zinc-600 text-sm leading-relaxed mt-4">
                          Vợt đánh rất êm, kiểm soát bóng tốt. Giao hàng nhanh chóng và đóng gói cẩn thận. Rất hài lòng với sản phẩm và dịch vụ.
                        </p>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="mt-8 w-full sm:w-auto rounded-full">Xem tất cả đánh giá</Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 lg:mt-24">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-10">Sản Phẩm Cùng Thương Hiệu</h2>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  );
}
