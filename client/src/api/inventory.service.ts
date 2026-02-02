// ============================================
// INVENTORY SERVICE - GESTIÓN DE INVENTARIO
// Products, Warehouses, Suppliers, Movements
// ============================================

import { 
  Product, Warehouse, Supplier, InventoryMovement,
  ApiResponse, PaginatedResult 
} from '@/types';
import { 
  products as mockProducts,
  warehouses as mockWarehouses,
  suppliers as mockSuppliers,
  inventoryMovements as mockMovements,
} from '@/data/mockData';

// ============================================
// INTERNAL STATE (simula DB)
// ============================================

let products = [...mockProducts];
let warehouses = [...mockWarehouses];
let suppliers = [...mockSuppliers];
let movements = [...mockMovements];

// ============================================
// HELPER FUNCTIONS
// ============================================

const generateId = (prefix: string): string => 
  `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const delay = (ms: number = 300): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

// ============================================
// PRODUCTS SERVICE
// ============================================

export const productService = {
  async getAll(): Promise<ApiResponse<Product[]>> {
    await delay();
    return { success: true, data: products };
  },

  async getById(id: string): Promise<ApiResponse<Product | null>> {
    await delay();
    const product = products.find(p => p.id === id) || null;
    return { success: true, data: product };
  },

  async getByCategory(category: string): Promise<ApiResponse<Product[]>> {
    await delay();
    const filtered = products.filter(p => p.category === category);
    return { success: true, data: filtered };
  },

  async create(data: Omit<Product, 'id' | 'createdAt'>): Promise<ApiResponse<Product>> {
    await delay();
    const newProduct: Product = {
      ...data,
      id: generateId('prod'),
      createdAt: new Date(),
    };
    products.push(newProduct);
    return { success: true, data: newProduct, message: 'Producto creado exitosamente' };
  },

  async update(id: string, data: Partial<Product>): Promise<ApiResponse<Product | null>> {
    await delay();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      return { success: false, error: 'Producto no encontrado' };
    }
    products[index] = { ...products[index], ...data };
    return { success: true, data: products[index], message: 'Producto actualizado exitosamente' };
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    await delay();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      return { success: false, error: 'Producto no encontrado' };
    }
    products.splice(index, 1);
    return { success: true, message: 'Producto eliminado exitosamente' };
  },

  async getStock(productId: string): Promise<ApiResponse<number>> {
    await delay();
    const stock = movements
      .filter(m => m.productId === productId)
      .reduce((total, m) => {
        if (m.type === 'entrada') return total + m.quantity;
        if (m.type === 'salida') return total - m.quantity;
        return total + m.quantity; // ajuste
      }, 0);
    return { success: true, data: Math.max(0, stock) };
  },

  // Get all products with stock calculated
  async getAllWithStock(): Promise<ApiResponse<(Product & { stock: number })[]>> {
    await delay();
    const stockMap = new Map<string, number>();
    
    movements.forEach(m => {
      const current = stockMap.get(m.productId) || 0;
      const change = m.type === 'entrada' ? m.quantity :
                     m.type === 'salida' ? -m.quantity : m.quantity;
      stockMap.set(m.productId, current + change);
    });

    const productsWithStock = products.map(p => ({
      ...p,
      stock: Math.max(0, stockMap.get(p.id) || 0),
    }));

    return { success: true, data: productsWithStock };
  },
};

// ============================================
// WAREHOUSES SERVICE
// ============================================

export const warehouseService = {
  async getAll(): Promise<ApiResponse<Warehouse[]>> {
    await delay();
    return { success: true, data: warehouses };
  },

  async getById(id: string): Promise<ApiResponse<Warehouse | null>> {
    await delay();
    const warehouse = warehouses.find(w => w.id === id) || null;
    return { success: true, data: warehouse };
  },

  async create(data: Omit<Warehouse, 'id' | 'createdAt'>): Promise<ApiResponse<Warehouse>> {
    await delay();
    const newWarehouse: Warehouse = {
      ...data,
      id: generateId('wh'),
      createdAt: new Date(),
    };
    warehouses.push(newWarehouse);
    return { success: true, data: newWarehouse, message: 'Almacén creado exitosamente' };
  },

  async update(id: string, data: Partial<Warehouse>): Promise<ApiResponse<Warehouse | null>> {
    await delay();
    const index = warehouses.findIndex(w => w.id === id);
    if (index === -1) {
      return { success: false, error: 'Almacén no encontrado' };
    }
    warehouses[index] = { ...warehouses[index], ...data };
    return { success: true, data: warehouses[index], message: 'Almacén actualizado exitosamente' };
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    await delay();
    const index = warehouses.findIndex(w => w.id === id);
    if (index === -1) {
      return { success: false, error: 'Almacén no encontrado' };
    }
    warehouses.splice(index, 1);
    return { success: true, message: 'Almacén eliminado exitosamente' };
  },

  async getStock(warehouseId: string): Promise<ApiResponse<number>> {
    await delay();
    const stock = movements
      .filter(m => m.warehouseId === warehouseId)
      .reduce((total, m) => {
        if (m.type === 'entrada') return total + m.quantity;
        if (m.type === 'salida') return total - m.quantity;
        return total + m.quantity;
      }, 0);
    return { success: true, data: Math.max(0, stock) };
  },
};

// ============================================
// SUPPLIERS SERVICE
// ============================================

export const supplierService = {
  async getAll(): Promise<ApiResponse<Supplier[]>> {
    await delay();
    return { success: true, data: suppliers };
  },

  async getById(id: string): Promise<ApiResponse<Supplier | null>> {
    await delay();
    const supplier = suppliers.find(s => s.id === id) || null;
    return { success: true, data: supplier };
  },

  async create(data: Omit<Supplier, 'id' | 'createdAt'>): Promise<ApiResponse<Supplier>> {
    await delay();
    const newSupplier: Supplier = {
      ...data,
      id: generateId('sup'),
      createdAt: new Date(),
    };
    suppliers.push(newSupplier);
    return { success: true, data: newSupplier, message: 'Proveedor creado exitosamente' };
  },

  async update(id: string, data: Partial<Supplier>): Promise<ApiResponse<Supplier | null>> {
    await delay();
    const index = suppliers.findIndex(s => s.id === id);
    if (index === -1) {
      return { success: false, error: 'Proveedor no encontrado' };
    }
    suppliers[index] = { ...suppliers[index], ...data };
    return { success: true, data: suppliers[index], message: 'Proveedor actualizado exitosamente' };
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    await delay();
    const index = suppliers.findIndex(s => s.id === id);
    if (index === -1) {
      return { success: false, error: 'Proveedor no encontrado' };
    }
    suppliers.splice(index, 1);
    return { success: true, message: 'Proveedor eliminado exitosamente' };
  },

  async getProducts(supplierId: string): Promise<ApiResponse<Product[]>> {
    await delay();
    const supplierProducts = products.filter(p => p.supplierId === supplierId);
    return { success: true, data: supplierProducts };
  },
};

// ============================================
// MOVEMENTS SERVICE
// ============================================

export const movementService = {
  async getAll(params?: {
    page?: number;
    pageSize?: number;
    type?: string;
    warehouseId?: string;
    productId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<PaginatedResult<InventoryMovement>>> {
    await delay();
    
    let filtered = [...movements];

    // Apply filters
    if (params?.type && params.type !== 'all') {
      filtered = filtered.filter(m => m.type === params.type);
    }
    if (params?.warehouseId) {
      filtered = filtered.filter(m => m.warehouseId === params.warehouseId);
    }
    if (params?.productId) {
      filtered = filtered.filter(m => m.productId === params.productId);
    }
    if (params?.startDate) {
      const start = new Date(params.startDate);
      filtered = filtered.filter(m => new Date(m.date) >= start);
    }
    if (params?.endDate) {
      const end = new Date(params.endDate + 'T23:59:59');
      filtered = filtered.filter(m => new Date(m.date) <= end);
    }

    // Sort by date descending
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Pagination
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 20;
    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    return {
      success: true,
      data: {
        data,
        pagination: { page, pageSize, total, totalPages },
      },
    };
  },

  async getById(id: string): Promise<ApiResponse<InventoryMovement | null>> {
    await delay();
    const movement = movements.find(m => m.id === id) || null;
    return { success: true, data: movement };
  },

  async create(data: Omit<InventoryMovement, 'id'>): Promise<ApiResponse<InventoryMovement>> {
    await delay();
    const newMovement: InventoryMovement = {
      ...data,
      id: generateId('mov'),
    };
    movements.push(newMovement);
    return { success: true, data: newMovement, message: 'Movimiento registrado exitosamente' };
  },

  async getByProduct(productId: string): Promise<ApiResponse<InventoryMovement[]>> {
    await delay();
    const productMovements = movements.filter(m => m.productId === productId);
    return { success: true, data: productMovements };
  },

  async getByWarehouse(warehouseId: string): Promise<ApiResponse<InventoryMovement[]>> {
    await delay();
    const warehouseMovements = movements.filter(m => m.warehouseId === warehouseId);
    return { success: true, data: warehouseMovements };
  },
};

// ============================================
// AGGREGATION HELPERS (simulan MongoDB pipelines)
// ============================================

export const inventoryAggregations = {
  // Stock by warehouse
  getStockByWarehouse(): { warehouseId: string; warehouseName: string; totalStock: number; capacity: number; percentage: number }[] {
    const stockMap = new Map<string, number>();
    
    movements.forEach(m => {
      const current = stockMap.get(m.warehouseId) || 0;
      const change = m.type === 'entrada' ? m.quantity :
                     m.type === 'salida' ? -m.quantity : m.quantity;
      stockMap.set(m.warehouseId, current + change);
    });

    return warehouses.filter(w => w.isActive).map(wh => ({
      warehouseId: wh.id,
      warehouseName: wh.name,
      totalStock: Math.max(0, stockMap.get(wh.id) || 0),
      capacity: wh.capacity,
      percentage: Math.min(100, Math.max(0, ((stockMap.get(wh.id) || 0) / wh.capacity) * 100)),
    }));
  },

  // Stock by product
  getStockByProduct(): { productId: string; productName: string; sku: string; category: string; totalStock: number; minStock: number; price: number }[] {
    const stockMap = new Map<string, number>();
    
    movements.forEach(m => {
      const current = stockMap.get(m.productId) || 0;
      const change = m.type === 'entrada' ? m.quantity :
                     m.type === 'salida' ? -m.quantity : m.quantity;
      stockMap.set(m.productId, current + change);
    });

    return products.filter(p => p.isActive).map(prod => ({
      productId: prod.id,
      productName: prod.name,
      sku: prod.sku,
      category: prod.category,
      totalStock: Math.max(0, stockMap.get(prod.id) || 0),
      minStock: prod.minStock,
      price: prod.price,
    }));
  },

  // Movement trends by date
  getMovementTrends(days: number = 14): { date: string; entradas: number; salidas: number; ajustes: number }[] {
    const result: { date: string; entradas: number; salidas: number; ajustes: number }[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayMovements = movements.filter(m => {
        const movDate = new Date(m.date).toISOString().split('T')[0];
        return movDate === dateStr;
      });
      
      result.push({
        date: dateStr,
        entradas: dayMovements.filter(m => m.type === 'entrada').reduce((sum, m) => sum + m.quantity, 0),
        salidas: dayMovements.filter(m => m.type === 'salida').reduce((sum, m) => sum + Math.abs(m.quantity), 0),
        ajustes: dayMovements.filter(m => m.type === 'ajuste').length,
      });
    }
    
    return result;
  },

  // Top moved products
  getTopProducts(limit: number = 5): { productId: string; productName: string; totalMovements: number; totalQuantity: number }[] {
    const productCount = new Map<string, { movements: number; quantity: number }>();
    
    movements.forEach(m => {
      const current = productCount.get(m.productId) || { movements: 0, quantity: 0 };
      productCount.set(m.productId, {
        movements: current.movements + 1,
        quantity: current.quantity + Math.abs(m.quantity),
      });
    });
    
    return Array.from(productCount.entries())
      .map(([productId, data]) => ({
        productId,
        productName: products.find(p => p.id === productId)?.name || 'Unknown',
        totalMovements: data.movements,
        totalQuantity: data.quantity,
      }))
      .sort((a, b) => b.totalMovements - a.totalMovements)
      .slice(0, limit);
  },

  // Dashboard stats
  getDashboardStats() {
    const stockByProduct = this.getStockByProduct();
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
    
    const todayMovements = movements.filter(m => 
      new Date(m.date).toISOString().split('T')[0] === today
    );
    
    const weekMovements = movements.filter(m => {
      const movDate = new Date(m.date).toISOString().split('T')[0];
      return movDate >= weekAgo && movDate <= today;
    });
    
    return {
      totalProducts: products.filter(p => p.isActive).length,
      totalWarehouses: warehouses.filter(w => w.isActive).length,
      totalSuppliers: suppliers.filter(s => s.isActive).length,
      totalMovements: movements.length,
      totalStock: stockByProduct.reduce((sum, p) => sum + p.totalStock, 0),
      lowStockProducts: stockByProduct.filter(p => p.totalStock < p.minStock).length,
      inventoryValue: stockByProduct.reduce((sum, p) => sum + (p.totalStock * p.price), 0),
      movementsToday: todayMovements.length,
      movementsWeek: weekMovements.length,
    };
  },
};
