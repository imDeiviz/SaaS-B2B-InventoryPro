// ============================================
// CONTEXTO DE DATOS - MULTI-TENANT PROFESIONAL
// Con soporte para Alertas y Auditoría
// ============================================

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { apiClient } from '../api/apiClient';
import {
  Product, Warehouse, Supplier, InventoryMovement, User, Role, Alert, AuditLog
} from '../types';
import {
  warehouses as initialWarehouses,
  suppliers as initialSuppliers,
  inventoryMovements as initialMovements,
  users as initialUsers,
  roles as initialRoles,
  alerts as initialAlerts,
  auditLogs as initialAuditLogs,
  calculateStockByWarehouse,
  calculateStockByProduct,
  getMovementsChartData,
  getTopProducts,
  getDashboardStats,
  getStockValueByCategory,
  getSupplierStats,
} from '../data/mockData';

interface DataContextType {
  // Data
  products: Product[];
  warehouses: Warehouse[];
  suppliers: Supplier[];
  movements: InventoryMovement[];
  users: User[];
  roles: Role[];
  alerts: Alert[];
  auditLogs: AuditLog[];
  isLoading: boolean;

  // Product CRUD
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Warehouse CRUD
  addWarehouse: (warehouse: Omit<Warehouse, 'id' | 'createdAt'>) => void;
  updateWarehouse: (id: string, warehouse: Partial<Warehouse>) => void;
  deleteWarehouse: (id: string) => void;

  // Supplier CRUD
  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt'>) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;

  // Movement
  addMovement: (movement: Omit<InventoryMovement, 'id'>) => void;

  // User CRUD
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;

  // Role CRUD
  addRole: (role: Omit<Role, 'id' | 'createdAt'>) => Role;
  updateRole: (id: string, role: Partial<Role>) => boolean;
  deleteRole: (id: string) => boolean;

  // Alerts
  markAlertAsRead: (id: string) => void;
  dismissAlert: (id: string) => void;
  resolveAlert: (id: string) => void;
  getUnreadAlertsCount: () => number;

  // Aggregations
  getStockByWarehouse: () => ReturnType<typeof calculateStockByWarehouse>;
  getStockByProduct: () => ReturnType<typeof calculateStockByProduct>;
  getMovementsChart: (days?: number) => ReturnType<typeof getMovementsChartData>;
  getTopMovedProducts: (limit?: number) => ReturnType<typeof getTopProducts>;
  getDashboardData: () => ReturnType<typeof getDashboardStats>;
  getStockByCategory: () => ReturnType<typeof getStockValueByCategory>;
  getSupplierStatistics: () => ReturnType<typeof getSupplierStats>;

  // Helpers
  getProductById: (id: string) => Product | undefined;
  getWarehouseById: (id: string) => Warehouse | undefined;
  getSupplierById: (id: string) => Supplier | undefined;
  getUserById: (id: string) => User | undefined;
  getRoleById: (id: string) => Role | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>(initialWarehouses);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [movements, setMovements] = useState<InventoryMovement[]>(initialMovements);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [auditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from API on mount
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const [productsData, warehousesData, suppliersData, movementsData] = await Promise.all([
          apiClient.get<any[]>('/products'),
          apiClient.get<any[]>('/warehouses'),
          apiClient.get<any[]>('/suppliers'),
          apiClient.get<any[]>('/movements'),
        ]);

        // Map _id to id and ensure dates are Date objects
        setProducts(productsData.map(p => ({ ...p, id: p._id || p.id, createdAt: new Date(p.createdAt) })));
        setWarehouses(warehousesData.map(w => ({ ...w, id: w._id || w.id, createdAt: new Date(w.createdAt) })));
        setSuppliers(suppliersData.map(s => ({ ...s, id: s._id || s.id, createdAt: new Date(s.createdAt) })));
        setMovements(movementsData.map(m => ({ ...m, id: m._id || m.id, date: new Date(m.date) })));
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const generateId = (prefix: string) =>
    `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Product CRUD
  const addProduct = useCallback(async (product: Omit<Product, 'id' | 'createdAt'>) => {
    try {
      const newProduct = await apiClient.post<any>('/products', product);
      const mapped = { ...newProduct, id: newProduct._id || newProduct.id };
      setProducts(prev => [...prev, mapped]);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  }, []);

  const updateProduct = useCallback(async (id: string, product: Partial<Product>) => {
    try {
      const updatedProduct = await apiClient.put<any>(`/products/${id}`, product);
      const mapped = { ...updatedProduct, id: updatedProduct._id || updatedProduct.id };
      setProducts(prev => prev.map(p => p.id === id ? mapped : p));
    } catch (error) {
      console.error('Error updating product:', error);
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      await apiClient.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }, []);

  // Warehouse CRUD
  const addWarehouse = useCallback(async (warehouse: Omit<Warehouse, 'id' | 'createdAt'>) => {
    try {
      const newWh = await apiClient.post<any>('/warehouses', warehouse);
      setWarehouses(prev => [...prev, { ...newWh, id: newWh._id || newWh.id, createdAt: new Date(newWh.createdAt) }]);
    } catch (error) {
      console.error('Error adding warehouse:', error);
    }
  }, []);

  const updateWarehouse = useCallback(async (id: string, warehouse: Partial<Warehouse>) => {
    try {
      const updatedWh = await apiClient.put<any>(`/warehouses/${id}`, warehouse);
      const mapped = { ...updatedWh, id: updatedWh._id || updatedWh.id, createdAt: new Date(updatedWh.createdAt) };
      setWarehouses(prev => prev.map(w => w.id === id ? mapped : w));
    } catch (error) {
      console.error('Error updating warehouse:', error);
    }
  }, []);

  const deleteWarehouse = useCallback(async (id: string) => {
    try {
      await apiClient.delete(`/warehouses/${id}`);
      setWarehouses(prev => prev.filter(w => w.id !== id));
    } catch (error) {
      console.error('Error deleting warehouse:', error);
    }
  }, []);

  // Supplier CRUD
  const addSupplier = useCallback(async (supplier: Omit<Supplier, 'id' | 'createdAt'>) => {
    try {
      const newSup = await apiClient.post<any>('/suppliers', supplier);
      setSuppliers(prev => [...prev, { ...newSup, id: newSup._id || newSup.id, createdAt: new Date(newSup.createdAt) }]);
    } catch (error) {
      console.error('Error adding supplier:', error);
    }
  }, []);

  const updateSupplier = useCallback(async (id: string, supplier: Partial<Supplier>) => {
    try {
      const updatedSup = await apiClient.put<any>(`/suppliers/${id}`, supplier);
      const mapped = { ...updatedSup, id: updatedSup._id || updatedSup.id, createdAt: new Date(updatedSup.createdAt) };
      setSuppliers(prev => prev.map(s => s.id === id ? mapped : s));
    } catch (error) {
      console.error('Error updating supplier:', error);
    }
  }, []);

  const deleteSupplier = useCallback(async (id: string) => {
    try {
      await apiClient.delete(`/suppliers/${id}`);
      setSuppliers(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting supplier:', error);
    }
  }, []);

  // Movement
  const addMovement = useCallback(async (movement: Omit<InventoryMovement, 'id'>) => {
    try {
      const newMov = await apiClient.post<any>('/movements', movement);
      const mapped = { ...newMov, id: newMov._id || newMov.id, date: new Date(newMov.date) };
      setMovements(prev => [...prev, mapped]);
    } catch (error) {
      console.error('Error adding movement:', error);
    }
  }, []);

  // User CRUD
  const addUser = useCallback((user: Omit<User, 'id' | 'createdAt'>) => {
    setUsers(prev => [...prev, {
      ...user,
      id: generateId('user'),
      createdAt: new Date()
    }]);
  }, []);

  const updateUser = useCallback((id: string, user: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...user } : u));
  }, []);

  const deleteUser = useCallback((id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  }, []);

  // Role CRUD
  const addRole = useCallback((role: Omit<Role, 'id' | 'createdAt'>): Role => {
    const newRole: Role = {
      ...role,
      id: generateId('role'),
      createdAt: new Date(),
    };
    setRoles(prev => [...prev, newRole]);
    return newRole;
  }, []);

  const updateRole = useCallback((id: string, roleData: Partial<Role>): boolean => {
    const role = roles.find(r => r.id === id);
    if (!role || role.isSystem) return false;

    setRoles(prev => prev.map(r => r.id === id ? { ...r, ...roleData } : r));
    return true;
  }, [roles]);

  const deleteRole = useCallback((id: string): boolean => {
    const role = roles.find(r => r.id === id);
    if (!role || role.isSystem) return false;

    if (users.some(u => u.roleId === id)) return false;

    setRoles(prev => prev.filter(r => r.id !== id));
    return true;
  }, [roles, users]);

  // Alerts
  const markAlertAsRead = useCallback((id: string) => {
    setAlerts(prev => prev.map(a =>
      a.id === id ? { ...a, status: 'read' as const, readAt: new Date() } : a
    ));
  }, []);

  const dismissAlert = useCallback((id: string) => {
    setAlerts(prev => prev.map(a =>
      a.id === id ? { ...a, status: 'dismissed' as const } : a
    ));
  }, []);

  const resolveAlert = useCallback((id: string) => {
    setAlerts(prev => prev.map(a =>
      a.id === id ? { ...a, status: 'resolved' as const, resolvedAt: new Date() } : a
    ));
  }, []);

  const getUnreadAlertsCount = useCallback(() => {
    return alerts.filter(a => a.status === 'unread').length;
  }, [alerts]);

  // Aggregations using live data
  const getStockByWarehouse = useCallback(() => {
    const stockMap = new Map<string, number>();

    movements.forEach(mov => {
      const current = stockMap.get(mov.warehouseId) || 0;
      const change = mov.type === 'entrada' ? mov.quantity
        : mov.type === 'salida' ? -mov.quantity
          : mov.quantity;
      stockMap.set(mov.warehouseId, current + change);
    });

    return warehouses.filter(w => w.isActive).map(wh => ({
      warehouseId: wh.id,
      warehouseName: wh.name,
      warehouseCode: wh.code,
      city: wh.city,
      totalStock: Math.max(0, stockMap.get(wh.id) || 0),
      capacity: wh.capacity,
      percentage: Math.min(100, Math.max(0, ((stockMap.get(wh.id) || 0) / wh.capacity) * 100)),
    }));
  }, [movements, warehouses]);

  const getStockByProduct = useCallback(() => {
    const stockMap = new Map<string, number>();

    movements.forEach(mov => {
      const current = stockMap.get(mov.productId) || 0;
      const change = mov.type === 'entrada' ? mov.quantity
        : mov.type === 'salida' ? -mov.quantity
          : mov.quantity;
      stockMap.set(mov.productId, current + change);
    });

    return products.filter(p => p.isActive).map(prod => ({
      productId: prod.id,
      productName: prod.name,
      sku: prod.sku,
      category: prod.category,
      totalStock: Math.max(0, stockMap.get(prod.id) || 0),
      minStock: prod.minStock,
      price: prod.price,
      cost: prod.cost,
      supplierId: prod.supplierId,
    }));
  }, [movements, products]);

  const getMovementsChart = useCallback((days: number = 14) => {
    const result: { date: string; entradas: number; salidas: number; ajustes: number }[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayMovements = movements.filter(mov => {
        const movDate = new Date(mov.date).toISOString().split('T')[0];
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
  }, [movements]);

  const getTopMovedProducts = useCallback((limit: number = 5) => {
    const productCount = new Map<string, { movements: number; quantity: number }>();

    movements.forEach(mov => {
      const current = productCount.get(mov.productId) || { movements: 0, quantity: 0 };
      productCount.set(mov.productId, {
        movements: current.movements + 1,
        quantity: current.quantity + Math.abs(mov.quantity),
      });
    });

    return Array.from(productCount.entries())
      .map(([productId, data]) => ({
        productId,
        productName: products.find(p => p.id === productId)?.name || 'Unknown',
        sku: products.find(p => p.id === productId)?.sku || '',
        totalMovements: data.movements,
        totalQuantity: data.quantity,
      }))
      .sort((a, b) => b.totalMovements - a.totalMovements)
      .slice(0, limit);
  }, [movements, products]);

  const getDashboardData = useCallback(() => {
    const stockByProduct = getStockByProduct();
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

    const todayMovements = movements.filter(m =>
      new Date(m.date).toISOString().split('T')[0] === today
    );

    const weekMovements = movements.filter(m => {
      const movDate = new Date(m.date).toISOString().split('T')[0];
      return movDate >= weekAgo && movDate <= today;
    });

    const stockByCategory = getStockByCategory();
    const topCategory = stockByCategory[0]?.category || 'N/A';

    const unreadAlerts = alerts.filter(a => a.status === 'unread').length;

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
      topCategory,
      recentAlerts: unreadAlerts,
    };
  }, [movements, products, warehouses, suppliers, alerts, getStockByProduct]);

  const getStockByCategory = useCallback(() => {
    const stockByProduct = getStockByProduct();
    const categoryMap = new Map<string, { stock: number; value: number; count: number }>();

    stockByProduct.forEach(p => {
      const product = products.find(prod => prod.id === p.productId);
      if (product) {
        const current = categoryMap.get(product.category) || { stock: 0, value: 0, count: 0 };
        categoryMap.set(product.category, {
          stock: current.stock + p.totalStock,
          value: current.value + (p.totalStock * p.price),
          count: current.count + 1,
        });
      }
    });

    return Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        totalStock: data.stock,
        totalValue: data.value,
        productCount: data.count,
      }))
      .sort((a, b) => b.totalValue - a.totalValue);
  }, [getStockByProduct, products]);

  const getSupplierStatistics = useCallback(() => {
    const stockByProduct = getStockByProduct();

    return suppliers.filter(s => s.isActive).map(supplier => {
      const supplierProducts = products.filter(p => p.supplierId === supplier.id && p.isActive);
      const totalStock = supplierProducts.reduce((sum, p) => {
        const stock = stockByProduct.find(s => s.productId === p.id)?.totalStock || 0;
        return sum + stock;
      }, 0);
      const totalValue = supplierProducts.reduce((sum, p) => {
        const stock = stockByProduct.find(s => s.productId === p.id)?.totalStock || 0;
        return sum + (stock * p.price);
      }, 0);

      return {
        supplierId: supplier.id,
        supplierName: supplier.name,
        productCount: supplierProducts.length,
        totalStock,
        totalValue,
      };
    });
  }, [getStockByProduct, products, suppliers]);

  // Helpers
  const getProductById = useCallback((id: string) => products.find(p => p.id === id), [products]);
  const getWarehouseById = useCallback((id: string) => warehouses.find(w => w.id === id), [warehouses]);
  const getSupplierById = useCallback((id: string) => suppliers.find(s => s.id === id), [suppliers]);
  const getUserById = useCallback((id: string) => users.find(u => u.id === id), [users]);
  const getRoleById = useCallback((id: string) => roles.find(r => r.id === id), [roles]);

  return (
    <DataContext.Provider
      value={{
        products,
        warehouses,
        suppliers,
        movements,
        users,
        roles,
        alerts,
        auditLogs,
        isLoading,
        addProduct,
        updateProduct,
        deleteProduct,
        addWarehouse,
        updateWarehouse,
        deleteWarehouse,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        addMovement,
        addUser,
        updateUser,
        deleteUser,
        addRole,
        updateRole,
        deleteRole,
        markAlertAsRead,
        dismissAlert,
        resolveAlert,
        getUnreadAlertsCount,
        getStockByWarehouse,
        getStockByProduct,
        getMovementsChart,
        getTopMovedProducts,
        getDashboardData,
        getStockByCategory,
        getSupplierStatistics,
        getProductById,
        getWarehouseById,
        getSupplierById,
        getUserById,
        getRoleById,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
