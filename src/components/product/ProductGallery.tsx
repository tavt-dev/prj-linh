import React, { useState } from 'react';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'motion/react';
import { Play } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  video?: string;
}

export function ProductGallery({ images, video }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const media = video 
    ? [{ type: 'video', url: video }, ...images.map(url => ({ type: 'image', url }))]
    : images.map(url => ({ type: 'image', url }));

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
        {media.map((item, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={cn(
              'relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 bg-zinc-100',
              activeIndex === index 
                ? 'border-zinc-900 scale-100 opacity-100' 
                : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'
            )}
          >
            {item.type === 'video' ? (
              <div className="flex h-full w-full items-center justify-center bg-zinc-900">
                <Play className="h-6 w-6 text-white" />
              </div>
            ) : (
              <img src={item.url} alt={`Thumbnail ${index + 1}`} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
            )}
          </button>
        ))}
      </div>
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-zinc-100 lg:aspect-auto lg:h-[600px]">
        <AnimatePresence mode="wait">
          {media[activeIndex].type === 'video' ? (
            <motion.video
              key={`video-${activeIndex}`}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              src={media[activeIndex].url}
              autoPlay
              muted
              loop
              controls
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          ) : (
            <motion.img
              key={`img-${activeIndex}`}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              src={media[activeIndex].url}
              alt="Product"
              referrerPolicy="no-referrer"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
