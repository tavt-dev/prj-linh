import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from './ToastContext';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number, gripSize: string) => void;
  removeFromCart: (productId: string, gripSize: string) => void;
  updateQuantity: (productId: string, gripSize: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useLocalStorage<CartItem[]>('tennis-cart', []);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { addToast } = useToast();

  const addToCart = (product: Product, quantity: number, gripSize: string) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product.id === product.id && item.gripSize === gripSize
      );

      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      }

      return [...prevItems, { product, quantity, gripSize }];
    });
    addToast(`Đã thêm ${product.name} vào giỏ hàng`);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, gripSize: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => !(item.product.id === productId && item.gripSize === gripSize))
    );
  };

  const updateQuantity = (productId: string, gripSize: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, gripSize);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId && item.gripSize === gripSize
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartTotal = items.reduce(
    (total, item) => total + (item.product.salePrice || item.product.price) * item.quantity,
    0
  );

  const cartCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
