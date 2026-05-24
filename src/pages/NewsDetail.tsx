import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, User } from 'lucide-react';

export function NewsDetail() {
  const { id } = useParams();

  // Mock data for demonstration
  const article = {
    title: 'Đánh giá chi tiết Wilson Pro Staff v14: Sự trở lại của huyền thoại',
    content: 'Phiên bản mới nhất của dòng vợt huyền thoại Pro Staff mang đến những cải tiến đáng kể về công nghệ Braid 45 và thiết kế Paradigm Bending, giúp tăng cường độ chính xác và cảm giác bóng. \n\nVới thiết kế sang trọng và hiệu suất vượt trội, đây là lựa chọn hàng đầu cho những người chơi chuyên nghiệp và phong trào.',
    image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=2000',
    date: '15/10/2024',
    author: 'Minh Tuấn',
    category: 'Đánh giá vợt'
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-28 pb-12 lg:pt-32 lg:pb-20">
      <Link to="/news" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Quay lại tin tức
      </Link>

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 text-center">
          <div className="inline-block bg-zinc-100 px-3 py-1 rounded-full text-xs font-semibold text-zinc-900 mb-4">
            {article.category}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-5xl mb-6 leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center justify-center gap-6 text-sm text-zinc-500">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {article.date}
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {article.author}
            </div>
          </div>
        </div>

        <img
          src={article.image}
          alt={article.title}
          referrerPolicy="no-referrer"
          className="w-full h-[400px] object-cover rounded-3xl mb-12 shadow-sm"
        />

        <div className="prose prose-zinc max-w-none prose-lg">
          {article.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-zinc-600 leading-relaxed mb-6">
              {paragraph}
            </p>
          ))}
        </div>
      </motion.article>
    </div>
  );
}
