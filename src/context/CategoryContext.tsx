import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

const initialCategories: Category[] = [
  { id: '1', name: 'Power', slug: 'power', description: 'Vợt trợ lực' },
  { id: '2', name: 'Control', slug: 'control', description: 'Vợt kiểm soát' },
  { id: '3', name: 'Spin', slug: 'spin', description: 'Vợt tạo xoáy' },
  { id: '4', name: 'All-Round', slug: 'all-round', description: 'Vợt toàn diện' },
  { id: '5', name: 'Bóng Tennis', slug: 'tennis-balls', description: 'Bóng tennis các loại' },
  { id: '6', name: 'Quần áo thể thao', slug: 'apparel', description: 'Trang phục thi đấu và tập luyện' },
  { id: '7', name: 'Phụ kiện', slug: 'accessories', description: 'Phụ kiện tennis' },
];

interface CategoryContextType {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useLocalStorage<Category[]>('tennis-categories', initialCategories);

  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString(),
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (id: string, categoryData: Partial<Category>) => {
    setCategories(prev => prev.map(cat => cat.id === id ? { ...cat, ...categoryData } : cat));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
  };

  return (
    <CategoryContext.Provider value={{ categories, addCategory, updateCategory, deleteCategory }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategory() {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategory must be used within a CategoryProvider');
  }
  return context;
}
