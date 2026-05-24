import React, { createContext, useContext } from 'react';
import { Product } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from './ToastContext';

interface WishlistContextType {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useLocalStorage<Product[]>('tennis-wishlist', []);
  const { addToast } = useToast();

  const addToWishlist = (product: Product) => {
    if (!isInWishlist(product.id)) {
      setItems((prev) => [...prev, product]);
      addToast(`Đã thêm ${product.name} vào mục yêu thích`);
    }
  };

  const removeFromWishlist = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
