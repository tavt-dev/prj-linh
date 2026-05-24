import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { Product } from '../types';
import { products as initialProducts } from '../data/products';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { slugify } from '../utils/slug';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=800';

function normalizeProduct(product: Product): Product {
  const salePrice = product.salePrice && product.salePrice > 0 ? product.salePrice : undefined;
  const discountPercent = salePrice
    ? Math.round(((product.price - salePrice) / product.price) * 100)
    : undefined;
  const slug = product.slug && /^[a-z0-9-]+$/.test(product.slug)
    ? product.slug
    : slugify(product.name);

  return {
    ...product,
    slug,
    category: product.category === 'Quả bóng tennis' ? 'Bóng Tennis' : product.category,
    images: product.images?.length ? product.images : [DEFAULT_IMAGE],
    salePrice,
    discountPercent,
    rating: product.rating ?? 5,
    reviewsCount: product.reviewsCount ?? 0,
    level: product.level?.length ? product.level : ['Beginner'],
    weight: product.weight ?? 0,
    headSize: product.headSize ?? 0,
    balance: product.balance ?? 0,
    length: product.length ?? 0,
    material: product.material || 'Graphite',
    gripSizes: product.gripSizes?.length ? product.gripSizes : ['Standard'],
    stock: Math.max(0, product.stock ?? 0),
    isNew: product.isNew ?? false,
    isBestSeller: product.isBestSeller ?? false,
    description: product.description || '',
    specifications: product.specifications || {},
  };
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [storedProducts, setStoredProducts] = useLocalStorage<Product[]>(
    'tennis-products',
    initialProducts.map(normalizeProduct)
  );
  const products = useMemo(() => storedProducts.map(normalizeProduct), [storedProducts]);

  const addProduct = (product: Product) => {
    setStoredProducts(prev => [...prev, normalizeProduct(product)]);
  };

  const updateProduct = (id: string, updatedData: Partial<Product>) => {
    setStoredProducts(prev => 
      prev.map(product => 
        product.id === id ? normalizeProduct({ ...product, ...updatedData }) : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    setStoredProducts(prev => prev.filter(product => product.id !== id));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
}
