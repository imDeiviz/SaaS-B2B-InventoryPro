// ============================================
// API SERVICE - CAPA DE ABSTRACCIÓN HTTP
// Simula llamadas a un backend real
// ============================================

import { ApiResponse } from '@/types';

// Base URL para API (en producción sería una variable de entorno)
const API_BASE_URL = '/api';

// Simulated network delay
const NETWORK_DELAY = 300;

// ============================================
// HTTP CLIENT SIMULADO
// ============================================

class ApiClient {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  private async simulateDelay(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, NETWORK_DELAY));
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    return headers;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    await this.simulateDelay();
    console.log(`[API] GET ${this.baseUrl}${endpoint}`, { headers: this.getHeaders() });
    // En producción: return fetch(`${this.baseUrl}${endpoint}`, { headers: this.getHeaders() });
    return { success: true, data: undefined as T };
  }

  async post<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    await this.simulateDelay();
    console.log(`[API] POST ${this.baseUrl}${endpoint}`, { data, headers: this.getHeaders() });
    return { success: true, data: undefined as T };
  }

  async patch<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    await this.simulateDelay();
    console.log(`[API] PATCH ${this.baseUrl}${endpoint}`, { data, headers: this.getHeaders() });
    return { success: true, data: undefined as T };
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    await this.simulateDelay();
    console.log(`[API] DELETE ${this.baseUrl}${endpoint}`, { headers: this.getHeaders() });
    return { success: true, data: undefined as T };
  }
}

// Singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// ============================================
// ENDPOINTS REGISTRY
// ============================================

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  
  // Users
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    RESET_PASSWORD: (id: string) => `/users/${id}/reset-password`,
  },
  
  // Roles
  ROLES: {
    BASE: '/roles',
    BY_ID: (id: string) => `/roles/${id}`,
    PERMISSIONS: '/roles/permissions',
  },
  
  // Products
  PRODUCTS: {
    BASE: '/products',
    BY_ID: (id: string) => `/products/${id}`,
    BY_CATEGORY: (category: string) => `/products/category/${category}`,
    STOCK: (id: string) => `/products/${id}/stock`,
  },
  
  // Warehouses
  WAREHOUSES: {
    BASE: '/warehouses',
    BY_ID: (id: string) => `/warehouses/${id}`,
    STOCK: (id: string) => `/warehouses/${id}/stock`,
  },
  
  // Suppliers
  SUPPLIERS: {
    BASE: '/suppliers',
    BY_ID: (id: string) => `/suppliers/${id}`,
    PRODUCTS: (id: string) => `/suppliers/${id}/products`,
  },
  
  // Inventory Movements
  MOVEMENTS: {
    BASE: '/movements',
    BY_ID: (id: string) => `/movements/${id}`,
    BY_PRODUCT: (productId: string) => `/movements/product/${productId}`,
    BY_WAREHOUSE: (warehouseId: string) => `/movements/warehouse/${warehouseId}`,
  },
  
  // Reports
  REPORTS: {
    DASHBOARD: '/reports/dashboard',
    STOCK: '/reports/stock',
    MOVEMENTS: '/reports/movements',
    SUPPLIERS: '/reports/suppliers',
    EXPORT_CSV: '/reports/export/csv',
    EXPORT_PDF: '/reports/export/pdf',
  },
  
  // Alerts
  ALERTS: {
    BASE: '/alerts',
    BY_ID: (id: string) => `/alerts/${id}`,
    MARK_READ: (id: string) => `/alerts/${id}/read`,
    DISMISS: (id: string) => `/alerts/${id}/dismiss`,
  },
  
  // Audit
  AUDIT: {
    BASE: '/audit',
    BY_USER: (userId: string) => `/audit/user/${userId}`,
    BY_ENTITY: (entity: string, entityId: string) => `/audit/${entity}/${entityId}`,
  },
  
  // Settings
  SETTINGS: {
    PROFILE: '/settings/profile',
    COMPANY: '/settings/company',
    THEME: '/settings/theme',
  },
} as const;
