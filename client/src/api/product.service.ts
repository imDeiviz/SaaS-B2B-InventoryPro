import { apiClient } from './apiClient';
import { Product } from '../types';

export const productService = {
    getProducts: () => apiClient.get<Product[]>('/products'),
    getProduct: (id: string) => apiClient.get<Product>(`/products/${id}`),
    createProduct: (data: any) => apiClient.post<Product>('/products', data),
    updateProduct: (id: string, data: any) => apiClient.put<Product>(`/products/${id}`, data),
    deleteProduct: (id: string) => apiClient.delete(`/products/${id}`),
};
