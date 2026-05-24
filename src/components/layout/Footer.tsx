import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 lg:gap-12">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-zinc-950">
                <span className="font-bold text-lg leading-none">T</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                TennisPro
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-zinc-400">
              Điểm đến hàng đầu cho những người đam mê tennis. Chúng tôi cung cấp các sản phẩm chính hãng từ những thương hiệu hàng đầu thế giới với chất lượng và dịch vụ tốt nhất.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">Sản phẩm</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link to="/products?brand=Wilson" className="hover:text-white transition-colors">Vợt Wilson</Link>
              </li>
              <li>
                <Link to="/products?brand=Babolat" className="hover:text-white transition-colors">Vợt Babolat</Link>
              </li>
              <li>
                <Link to="/products?brand=Head" className="hover:text-white transition-colors">Vợt Head</Link>
              </li>
              <li>
                <Link to="/products?brand=Yonex" className="hover:text-white transition-colors">Vợt Yonex</Link>
              </li>
              <li>
                <Link to="/products?sale=true" className="hover:text-white transition-colors">Khuyến mãi</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">Hỗ trợ</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">Chính sách bảo hành</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Chính sách đổi trả</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Hướng dẫn chọn vợt</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Câu hỏi thường gặp</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Kiểm tra đơn hàng</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">Liên hệ</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-zinc-500 shrink-0" />
                <span>123 Đường Thể Thao, Quận 1, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-zinc-500 shrink-0" />
                <span>1900 1234</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-zinc-500 shrink-0" />
                <span>support@tennispro.vn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} TennisPro. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-zinc-500">
            <a href="#" className="hover:text-white transition-colors">Điều khoản</a>
            <a href="#" className="hover:text-white transition-colors">Bảo mật</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
