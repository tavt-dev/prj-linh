import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, User } from 'lucide-react';

const newsItems = [
  {
    id: 1,
    title: 'Đánh giá chi tiết Wilson Pro Staff v14: Sự trở lại của huyền thoại',
    excerpt: 'Phiên bản mới nhất của dòng vợt huyền thoại Pro Staff mang đến những cải tiến đáng kể về công nghệ Braid 45 và thiết kế Paradigm Bending, giúp tăng cường độ chính xác và cảm giác bóng.',
    image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=1000',
    date: '15/10/2024',
    author: 'Minh Tuấn',
    category: 'Đánh giá vợt'
  },
  {
    id: 2,
    title: 'Hướng dẫn chọn dây đan vợt phù hợp với lối chơi của bạn',
    excerpt: 'Dây đan vợt đóng vai trò quan trọng không kém gì cây vợt. Bài viết này sẽ giúp bạn hiểu rõ về các loại dây (Polyester, Multifilament, Natural Gut) và cách chọn mức căng phù hợp.',
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=1000',
    date: '12/10/2024',
    author: 'Hoàng Nam',
    category: 'Hướng dẫn'
  },
  {
    id: 3,
    title: 'Babolat Pure Aero 2024: Vũ khí tạo xoáy tối thượng của Carlos Alcaraz',
    excerpt: 'Khám phá những công nghệ mới được tích hợp trên cây vợt Pure Aero 2024, giúp người chơi tạo ra những cú đánh xoáy topspin uy lực và hiểm hóc như tay vợt số 1 thế giới.',
    image: 'https://images.unsplash.com/photo-1530915534664-4ac6423816b7?auto=format&fit=crop&q=80&w=1000',
    date: '08/10/2024',
    author: 'Thanh Bình',
    category: 'Tin tức sản phẩm'
  },
  {
    id: 4,
    title: 'Top 5 đôi giày tennis tốt nhất cho mặt sân cứng năm 2024',
    excerpt: 'Lựa chọn giày tennis phù hợp giúp bảo vệ đôi chân và tăng cường hiệu suất thi đấu. Cùng điểm qua 5 mẫu giày được đánh giá cao nhất về độ bền và khả năng hỗ trợ trên mặt sân cứng.',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=1000',
    date: '05/10/2024',
    author: 'Minh Tuấn',
    category: 'Đánh giá phụ kiện'
  },
  {
    id: 5,
    title: 'Head Speed 2024: Sự kết hợp hoàn hảo giữa tốc độ và kiểm soát',
    excerpt: 'Dòng vợt Head Speed luôn được yêu thích bởi sự linh hoạt. Phiên bản 2024 với công nghệ Auxetic 2.0 hứa hẹn mang lại cảm giác đánh êm ái và ổn định hơn bao giờ hết.',
    image: 'https://images.unsplash.com/photo-1574271143515-5cddf8da19be?auto=format&fit=crop&q=80&w=1000',
    date: '01/10/2024',
    author: 'Hoàng Nam',
    category: 'Tin tức sản phẩm'
  },
  {
    id: 6,
    title: 'Cách bảo quản vợt tennis để kéo dài tuổi thọ',
    excerpt: 'Những mẹo nhỏ nhưng hữu ích giúp bạn bảo quản cây vợt yêu quý của mình luôn trong tình trạng tốt nhất, từ việc tránh nhiệt độ cao đến cách thay quấn cán định kỳ.',
    image: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?auto=format&fit=crop&q=80&w=1000',
    date: '28/09/2024',
    author: 'Thanh Bình',
    category: 'Hướng dẫn'
  }
];

export function News() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-12 lg:pt-32 lg:pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">Tin tức & Bài viết</h1>
        <p className="mt-4 text-lg text-zinc-500 max-w-2xl mx-auto">
          Cập nhật những thông tin mới nhất về sản phẩm, đánh giá chuyên sâu và hướng dẫn hữu ích từ các chuyên gia tennis.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {newsItems.map((item, index) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <Link to={`/news/${item.id}`} className="relative h-64 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-zinc-900">
                {item.category}
              </div>
            </Link>
            
            <div className="flex flex-col flex-1 p-6">
              <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {item.date}
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  {item.author}
                </div>
              </div>
              
              <Link to={`/news/${item.id}`} className="block mb-3">
                <h2 className="text-xl font-bold text-zinc-900 line-clamp-2 group-hover:text-zinc-600 transition-colors leading-tight">
                  {item.title}
                </h2>
              </Link>
              
              <p className="text-zinc-500 text-sm line-clamp-3 mb-6 flex-1">
                {item.excerpt}
              </p>
              
              <Link 
                to={`/news/${item.id}`}
                className="inline-flex items-center gap-2 text-sm font-bold text-zinc-900 hover:text-zinc-600 transition-colors mt-auto"
              >
                Đọc tiếp <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
