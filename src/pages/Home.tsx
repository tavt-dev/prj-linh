import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, RotateCcw, HeadphonesIcon } from 'lucide-react';
import { useProduct } from '../context/ProductContext';
import { ProductGrid } from '../components/product/ProductGrid';
import { Button } from '../components/ui/Button';
import { motion } from 'motion/react';

export function Home() {
  const navigate = useNavigate();
  const { products } = useProduct();
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);

  const features = [
    {
      icon: <Truck className="h-6 w-6" />,
      title: 'Giao hàng miễn phí',
      description: 'Cho đơn hàng trên 2.000.000đ',
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: 'Hàng chính hãng 100%',
      description: 'Cam kết chất lượng tuyệt đối',
    },
    {
      icon: <RotateCcw className="h-6 w-6" />,
      title: 'Đổi trả dễ dàng',
      description: 'Trong vòng 7 ngày',
    },
    {
      icon: <HeadphonesIcon className="h-6 w-6" />,
      title: 'Hỗ trợ 24/7',
      description: 'Luôn sẵn sàng giải đáp',
    },
  ];

  const brands = [
    { name: 'Wilson', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Wilson_Sporting_Goods_logo.svg/2560px-Wilson_Sporting_Goods_logo.svg.png' },
    { name: 'Babolat', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Babolat_logo.svg/2560px-Babolat_logo.svg.png' },
    { name: 'Head', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Head_logo.svg/2560px-Head_logo.svg.png' },
    { name: 'Yonex', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Yonex_logo.svg/2560px-Yonex_logo.svg.png' },
    { name: 'Nike', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/2560px-Logo_NIKE.svg.png' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
  };

  return (
    <div className="flex flex-col gap-16 pb-16 lg:gap-24 lg:pb-24">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden bg-zinc-50">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.15 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          src="https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=2000"
          alt="Tennis Racket"
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover grayscale opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
        <div className="absolute inset-0 mx-auto flex max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl space-y-8"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/50 px-4 py-2 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-900">Bộ sưu tập mới 2024</span>
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-5xl font-bold tracking-tight text-zinc-950 sm:text-6xl lg:text-8xl leading-[1.1]">
              Nâng Tầm <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-600 to-zinc-900">Trận Đấu Của Bạn</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="max-w-xl text-lg leading-relaxed text-zinc-600 sm:text-xl font-light">
              Khám phá bộ sưu tập sản phẩm thể thao chuyên nghiệp từ các thương hiệu hàng đầu thế giới. Trải nghiệm sức mạnh, độ xoáy và khả năng kiểm soát tuyệt đỉnh.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="bg-zinc-900 text-white hover:bg-zinc-800 h-14 px-8 text-lg rounded-full" onClick={() => navigate('/products')}>
                Mua ngay
              </Button>
              <Button size="lg" variant="outline" className="border-zinc-200 text-zinc-900 hover:bg-zinc-50 h-14 px-8 text-lg rounded-full backdrop-blur-sm" onClick={() => navigate('/products?sale=true')}>
                Xem khuyến mãi
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 border-y border-zinc-200 py-12"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants} className="flex items-center gap-4 group">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-900 transition-all duration-300 group-hover:bg-zinc-900 group-hover:text-white group-hover:scale-110 group-hover:rotate-3">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900">{feature.title}</h3>
                <p className="text-sm text-zinc-500 mt-0.5">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Best Sellers */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">Bán Chạy Nhất</h2>
            <p className="mt-3 text-lg text-zinc-500">Những sản phẩm được yêu thích nhất bởi cộng đồng thể thao.</p>
          </div>
          <Link to="/products?sort=best-selling" className="hidden sm:flex items-center gap-2 text-sm font-bold text-zinc-900 hover:text-zinc-600 transition-colors group">
            Xem tất cả <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
        <ProductGrid products={bestSellers} />
        <div className="mt-10 flex justify-center sm:hidden">
          <Button variant="outline" className="w-full rounded-full h-12" onClick={() => navigate('/products?sort=best-selling')}>
            Xem tất cả
          </Button>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-[2.5rem] bg-zinc-100 group"
        >
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=2000"
              alt="Promo"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover opacity-20 grayscale transition-transform duration-1000 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
          <div className="relative flex flex-col items-start justify-center px-8 py-24 sm:px-16 lg:py-32 max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl"
            >
              Sức Mạnh <br/> Vượt Trội
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-6 text-lg text-zinc-600 font-light"
            >
              Công nghệ tiên tiến nhất. Thiết kế đột phá. Nâng cấp lối chơi của bạn ngay hôm nay với những siêu phẩm mới nhất từ các thương hiệu hàng đầu.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Button size="lg" className="mt-10 bg-zinc-900 text-white hover:bg-zinc-800 rounded-full h-14 px-8" onClick={() => navigate('/products?new=true')}>
                Khám phá ngay
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* New Arrivals */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">Hàng Mới Về</h2>
            <p className="mt-3 text-lg text-zinc-500">Cập nhật những xu hướng và công nghệ mới nhất.</p>
          </div>
          <Link to="/products?sort=newest" className="hidden sm:flex items-center gap-2 text-sm font-bold text-zinc-900 hover:text-zinc-600 transition-colors group">
            Xem tất cả <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
        <ProductGrid products={newArrivals} />
        <div className="mt-10 flex justify-center sm:hidden">
          <Button variant="outline" className="w-full rounded-full h-12" onClick={() => navigate('/products?sort=newest')}>
            Xem tất cả
          </Button>
        </div>
      </section>

      {/* Latest News */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">Tin Tức Mới Nhất</h2>
            <p className="mt-3 text-lg text-zinc-500">Cập nhật thông tin và đánh giá từ chuyên gia.</p>
          </div>
          <Link to="/news" className="hidden sm:flex items-center gap-2 text-sm font-bold text-zinc-900 hover:text-zinc-600 transition-colors group">
            Xem tất cả <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              id: 1,
              title: 'Đánh giá chi tiết Wilson Pro Staff v14: Sự trở lại của huyền thoại',
              image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=1000',
              category: 'Đánh giá vợt',
              date: '15/10/2024'
            },
            {
              id: 2,
              title: 'Hướng dẫn chọn dây đan vợt phù hợp với lối chơi của bạn',
              image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=1000',
              category: 'Hướng dẫn',
              date: '12/10/2024'
            },
            {
              id: 3,
              title: 'Babolat Pure Aero 2024: Vũ khí tạo xoáy tối thượng',
              image: 'https://images.unsplash.com/photo-1530915365347-231c4bb4b5b7?auto=format&fit=crop&q=80&w=1000',
              category: 'Tin tức sản phẩm',
              date: '08/10/2024'
            }
          ].map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group flex flex-col cursor-pointer"
              onClick={() => navigate(`/news/${item.id}`)}
            >
              <div className="relative h-60 overflow-hidden rounded-2xl mb-4">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-zinc-900">
                  {item.category}
                </div>
              </div>
              <div className="text-xs text-zinc-500 mb-2">{item.date}</div>
              <h3 className="text-lg font-bold text-zinc-900 line-clamp-2 group-hover:text-zinc-600 transition-colors">
                {item.title}
              </h3>
            </motion.article>
          ))}
        </div>
        <div className="mt-10 flex justify-center sm:hidden">
          <Button variant="outline" className="w-full rounded-full h-12" onClick={() => navigate('/news')}>
            Xem tất cả
          </Button>
        </div>
      </section>

      {/* Brands */}
      <section className="bg-zinc-50 py-20 lg:py-28 rounded-[3rem] mx-4 sm:mx-6 lg:mx-8 mb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-3xl font-bold tracking-tight text-zinc-900 mb-16"
          >
            Thương Hiệu Hàng Đầu
          </motion.h2>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-12 md:grid-cols-5 items-center justify-items-center"
          >
            {brands.map((brand) => (
              <motion.div key={brand.name} variants={itemVariants}>
                <Link to={`/products?brand=${brand.name}`} className="group flex items-center justify-center p-4">
                  <img 
                    src={brand.logo} 
                    alt={brand.name} 
                    referrerPolicy="no-referrer"
                    className="h-12 object-contain sm:h-16 opacity-40 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110" 
                  />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
