import React, { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BadgePercent,
  CheckCircle2,
  ChevronDown,
  Clock3,
  HeadphonesIcon,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useProduct } from '../context/ProductContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ProductGrid } from '../components/product/ProductGrid';
import { formatPrice } from '../utils/format';

interface LeadData {
  id: string;
  name: string;
  phone: string;
  email: string;
  level: string;
  interest: string;
  createdAt: string;
}

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=85&w=2200';

const COURT_IMAGE =
  'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=85&w=1800';

function getStoredLeads() {
  try {
    return JSON.parse(localStorage.getItem('tennis-leads') || '[]') as LeadData[];
  } catch {
    return [];
  }
}

export function Home() {
  const navigate = useNavigate();
  const { products } = useProduct();
  const { addToast } = useToast();
  const formRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const featuredProducts = useMemo(
    () => products.filter((product) => product.isBestSeller || product.salePrice).slice(0, 4),
    [products]
  );

  const heroProduct = featuredProducts[0] || products[0];
  const heroPrice = heroProduct ? heroProduct.salePrice || heroProduct.price : 0;

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleLeadSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const lead: LeadData = {
      id: Date.now().toString(),
      name: String(formData.get('name') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      level: String(formData.get('level') || ''),
      interest: String(formData.get('interest') || ''),
      createdAt: new Date().toISOString(),
    };

    if (!lead.name || !lead.phone || !lead.email) {
      addToast('Vui lòng điền đầy đủ họ tên, số điện thoại và email', 'error');
      setIsSubmitting(false);
      return;
    }

    const leads = getStoredLeads();
    localStorage.setItem('tennis-leads', JSON.stringify([lead, ...leads]));

    window.setTimeout(() => {
      setIsSubmitting(false);
      event.currentTarget.reset();
      addToast('Đã nhận thông tin. TennisPro sẽ liên hệ tư vấn trong hôm nay.', 'success');
    }, 600);
  };

  const benefits = [
    {
      icon: HeadphonesIcon,
      title: 'Tư vấn đúng lối chơi',
      description: 'Phân tích trình độ, lực tay và mục tiêu thi đấu để chọn đúng dòng vợt.',
    },
    {
      icon: BadgePercent,
      title: 'Ưu đãi landing page',
      description: 'Nhận mã giảm 10% cho đơn hàng đầu tiên sau khi để lại thông tin.',
    },
    {
      icon: ShieldCheck,
      title: 'Hàng chính hãng',
      description: 'Sản phẩm có nguồn gốc rõ ràng, bảo hành và đổi trả theo chính sách.',
    },
  ];

  const steps = [
    'Để lại thông tin tư vấn',
    'Chuyên viên gọi xác nhận nhu cầu',
    'Nhận gợi ý vợt và mã ưu đãi',
    'Đặt hàng hoặc thử thêm sản phẩm phù hợp',
  ];

  return (
    <div className="bg-white">
      <section className="relative min-h-[calc(100vh-24px)] overflow-hidden bg-zinc-950 pt-24 text-white">
        <img
          src={HERO_IMAGE}
          alt="Vợt tennis trên sân"
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,9,11,0.94)_0%,rgba(9,9,11,0.78)_42%,rgba(9,9,11,0.18)_100%)]" />
        <div className="relative mx-auto grid min-h-[calc(100vh-24px)] max-w-7xl grid-cols-1 items-center px-4 pb-24 pt-12 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
              <Sparkles className="h-4 w-4 text-emerald-300" />
              Chiến dịch TennisPro Fit Day
            </div>
            <h1 className="max-w-4xl text-5xl font-bold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
              Chọn đúng vợt tennis trong 15 phút
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-200 sm:text-xl">
              Nhận tư vấn miễn phí theo trình độ, lực tay và phong cách đánh. Đăng ký hôm nay để nhận mã ưu đãi 10% cho bộ vợt đầu tiên.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={scrollToForm} className="bg-emerald-500 text-zinc-950 hover:bg-emerald-400">
                Nhận tư vấn miễn phí <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/products?sale=true')}
                className="border-white/30 bg-white/5 text-white hover:border-white hover:bg-white/10"
              >
                Xem sản phẩm ưu đãi
              </Button>
            </div>
            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-4 border-t border-white/15 pt-6">
              {[
                ['1.200+', 'khách đã tư vấn'],
                ['4.8/5', 'điểm hài lòng'],
                ['10%', 'ưu đãi đăng ký'],
              ].map(([value, label]) => (
                <div key={value}>
                  <div className="text-2xl font-bold text-white">{value}</div>
                  <div className="mt-1 text-sm text-zinc-300">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {heroProduct && (
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-12 hidden lg:block"
            >
              <Link to={`/product/${heroProduct.slug}`} className="group block rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur-md transition hover:bg-white/15">
                <div className="aspect-[4/5] overflow-hidden rounded-md bg-white">
                  <img
                    src={heroProduct.images[0]}
                    alt={heroProduct.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="mt-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-emerald-300">{heroProduct.brand}</p>
                    <h2 className="mt-1 text-xl font-bold text-white">{heroProduct.name}</h2>
                  </div>
                  <div className="text-right text-lg font-bold text-white">{formatPrice(heroPrice)}</div>
                </div>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      <section ref={formRef} className="bg-zinc-50 py-14 lg:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Form thu lead</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
              Để lại thông tin để nhận tư vấn và mã giảm giá
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              Landing page này chỉ tập trung vào một hành động chuyển đổi: thu thông tin khách hàng quan tâm đến vợt tennis và hỗ trợ họ mua đúng sản phẩm.
            </p>
            <div className="mt-8 space-y-4">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div key={benefit.title} className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-950">{benefit.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-zinc-600">{benefit.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
            <form onSubmit={handleLeadSubmit} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input name="name" label="Họ và tên" placeholder="Nguyễn Văn A" required />
              <Input name="phone" label="Số điện thoại" type="tel" placeholder="0901234567" required />
              <div className="sm:col-span-2">
                <Input name="email" label="Email" type="email" placeholder="you@example.com" required />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700">Trình độ chơi</label>
                <select name="level" className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-zinc-900">
                  <option value="beginner">Người mới chơi</option>
                  <option value="intermediate">Trung cấp</option>
                  <option value="advanced">Nâng cao</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700">Nhu cầu chính</label>
                <select name="interest" className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-zinc-900">
                  <option value="control">Tăng kiểm soát</option>
                  <option value="power">Tăng lực đánh</option>
                  <option value="spin">Tăng độ xoáy</option>
                  <option value="comfort">Giảm rung, dễ chơi</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full bg-zinc-950 hover:bg-zinc-800">
                  Nhận tư vấn và mã giảm giá
                </Button>
                <p className="mt-3 text-center text-xs text-zinc-500">
                  Thông tin được lưu nội bộ để chăm sóc khách hàng và không hiển thị công khai.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-red-600">Lý do đăng ký</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
                Mua vợt theo cảm tính rất dễ sai thông số
              </h2>
              <p className="mt-4 text-base leading-7 text-zinc-600">
                Trọng lượng, mặt vợt, điểm cân bằng và độ cứng khung ảnh hưởng trực tiếp đến cảm giác bóng. TennisPro rút gọn quá trình chọn vợt bằng bộ câu hỏi tư vấn và danh sách gợi ý phù hợp.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                ['Sai trọng lượng', 'Dễ mỏi tay, chậm phản xạ khi đánh lâu.'],
                ['Sai mặt vợt', 'Bóng thiếu kiểm soát hoặc không đủ lực.'],
                ['Sai grip size', 'Cầm không chắc, tăng rủi ro đau cổ tay.'],
              ].map(([title, description]) => (
                <div key={title} className="rounded-lg border border-zinc-200 p-5">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  <h3 className="mt-4 font-bold text-zinc-950">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 py-16 text-white lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div className="relative overflow-hidden rounded-lg">
              <img src={COURT_IMAGE} alt="Bộ vợt tennis" referrerPolicy="no-referrer" className="aspect-[4/3] w-full object-cover" />
              <div className="absolute bottom-4 left-4 rounded-md bg-white px-4 py-3 text-zinc-950 shadow-lg">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  Bộ đề xuất theo lối chơi
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-300">Quy trình chuyển đổi</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Từ khách truy cập thành khách hàng tiềm năng</h2>
              <div className="mt-8 space-y-4">
                {steps.map((step, index) => (
                  <div key={step} className="flex items-center gap-4 border-b border-white/10 pb-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-zinc-950">
                      {index + 1}
                    </div>
                    <p className="font-medium text-zinc-100">{step}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex items-center gap-3 text-sm text-zinc-300">
                <Clock3 className="h-5 w-5 text-emerald-300" />
                Thời gian phản hồi trung bình trong giờ làm việc: 30 phút
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Sản phẩm dẫn dắt</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">Các lựa chọn đang được tư vấn nhiều</h2>
            </div>
            <Link to="/products" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-950 hover:text-emerald-700">
              Xem tất cả sản phẩm <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ProductGrid products={featuredProducts} />
        </div>
      </section>

      <section className="bg-emerald-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-800">Câu hỏi thường gặp</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950">Thông tin trước khi đăng ký</h2>
            </div>
            <div className="space-y-3">
              {[
                ['Tư vấn có mất phí không?', 'Không. Bạn chỉ cần để lại thông tin để đội ngũ TennisPro liên hệ và tư vấn sản phẩm phù hợp.'],
                ['Mã giảm giá dùng thế nào?', 'Mã TENNIS10 áp dụng khi thanh toán trên website cho đơn hàng hợp lệ.'],
                ['Tôi chưa biết thông số vợt thì sao?', 'Bạn chỉ cần mô tả trình độ và nhu cầu. Chuyên viên sẽ gợi ý trọng lượng, mặt vợt và grip size.'],
              ].map(([question, answer]) => (
                <details key={question} className="group rounded-lg border border-emerald-200 bg-white p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-zinc-950">
                    {question}
                    <ChevronDown className="h-5 w-5 shrink-0 text-emerald-700 transition group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-zinc-950 px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <div className="mb-4 flex items-center gap-1 text-amber-300">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <h2 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
              Sẵn sàng chọn đúng cây vợt cho trận đấu tiếp theo?
            </h2>
          </div>
          <Button size="lg" onClick={scrollToForm} className="bg-emerald-500 text-zinc-950 hover:bg-emerald-400">
            Đăng ký ngay <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
