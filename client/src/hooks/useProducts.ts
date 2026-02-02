// ============================================
// USE PRODUCTS HOOK - GESTIÓN DE PRODUCTOS
// ============================================

import { useState, useCallback, useMemo } from 'react';
import { Product } from '@/types';
import { productService, inventoryAggregations } from '@/api/inventory.service';

export interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  
  // CRUD operations
  fetchProducts: () => Promise<void>;
  createProduct: (data: Omit<Product, 'id' | 'createdAt'>) => Promise<boolean>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  
  // Helpers
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  getProductStock: (productId: string) => number;
  getLowStockProducts: () => { product: Product; stock: number }[];
  
  // Computed
  categories: string[];
  totalValue: number;
}

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getAll();
      if (response.success && response.data) {
        setProducts(response.data);
      } else {
        setError(response.error || 'Error al cargar productos');
      }
    } catch (e) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create product
  const createProduct = useCallback(async (data: Omit<Product, 'id' | 'createdAt'>): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await productService.create(data);
      if (response.success && response.data) {
        setProducts(prev => [...prev, response.data!]);
        return true;
      }
      setError(response.error || 'Error al crear producto');
      return false;
    } catch {
      setError('Error de conexión');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update product
  const updateProduct = useCallback(async (id: string, data: Partial<Product>): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await productService.update(id, data);
      if (response.success && response.data) {
        setProducts(prev => prev.map(p => p.id === id ? response.data! : p));
        return true;
      }
      setError(response.error || 'Error al actualizar producto');
      return false;
    } catch {
      setError('Error de conexión');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete product
  const deleteProduct = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await productService.delete(id);
      if (response.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
        return true;
      }
      setError(response.error || 'Error al eliminar producto');
      return false;
    } catch {
      setError('Error de conexión');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get product by ID
  const getProductById = useCallback((id: string): Product | undefined => {
    return products.find(p => p.id === id);
  }, [products]);

  // Get products by category
  const getProductsByCategory = useCallback((category: string): Product[] => {
    return products.filter(p => p.category === category);
  }, [products]);

  // Get stock for a product
  const stockByProduct = useMemo(() => inventoryAggregations.getStockByProduct(), [products]);
  
  const getProductStock = useCallback((productId: string): number => {
    return stockByProduct.find(s => s.productId === productId)?.totalStock || 0;
  }, [stockByProduct]);

  // Get low stock products
  const getLowStockProducts = useCallback(() => {
    return products
      .filter(p => p.isActive)
      .map(product => ({
        product,
        stock: getProductStock(product.id),
      }))
      .filter(({ product, stock }) => stock < product.minStock);
  }, [products, getProductStock]);

  // Computed: unique categories
  const categories = useMemo(() => {
    return [...new Set(products.map(p => p.category))];
  }, [products]);

  // Computed: total inventory value
  const totalValue = useMemo(() => {
    return products.reduce((total, product) => {
      const stock = getProductStock(product.id);
      return total + (product.price * stock);
    }, 0);
  }, [products, getProductStock]);

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProductsByCategory,
    getProductStock,
    getLowStockProducts,
    categories,
    totalValue,
  };
}
