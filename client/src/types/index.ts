// ============================================
// TIPOS Y MODELOS - RBAC AVANZADO + MULTI-TENANT
// Sistema Profesional de Gestión de Inventarios
// ============================================

// ============================================
// PERMISOS Y ROLES
// ============================================

export interface Permission {
  id: string;
  key: string;
  name: string;
  description: string;
  category: 'inventory' | 'users' | 'reports' | 'settings' | 'audit';
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
  color: string;
  createdAt: Date;
}

// ============================================
// USUARIO Y EMPRESA
// ============================================

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  roleId: string;
  companyId: string;
  avatar?: string;
  mustChangePassword: boolean;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

export interface Company {
  id: string;
  name: string;
  identifier: string;
  logo?: string;
  config: {
    currency: string;
    timezone: string;
    lowStockThreshold: number;
  };
  plan: 'starter' | 'professional' | 'enterprise';
  createdAt: Date;
}

// ============================================
// ALMACENES
// ============================================

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  companyId: string;
  responsibleIds: string[];
  capacity: number;
  isActive: boolean;
  createdAt: Date;
}

// ============================================
// PRODUCTOS
// ============================================

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  minStock: number;
  price: number;
  cost: number;
  unit: string;
  companyId: string;
  supplierId: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
}

// ============================================
// PROVEEDORES
// ============================================

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  companyId: string;
  isActive: boolean;
  createdAt: Date;
}

// ============================================
// MOVIMIENTOS DE INVENTARIO
// ============================================

export type MovementType = 'entrada' | 'salida' | 'ajuste' | 'transferencia';

export interface InventoryMovement {
  id: string;
  productId: string;
  warehouseId: string;
  warehouseDestinationId?: string;
  type: MovementType;
  quantity: number;
  unitCost?: number;
  userId: string;
  reason: string;
  reference?: string;
  notes?: string;
  date: Date;
  companyId: string;
}

// ============================================
// POSICIÓN DE STOCK
// ============================================

export interface StockPosition {
  productId: string;
  warehouseId: string;
  quantity: number;
  reservedQuantity: number;
  lastMovementDate: Date;
}

// ============================================
// ALERTAS Y NOTIFICACIONES
// ============================================

export type AlertType = 'low_stock' | 'expiring' | 'pending_audit' | 'system' | 'movement';
export type AlertPriority = 'low' | 'medium' | 'high' | 'critical';
export type AlertStatus = 'unread' | 'read' | 'dismissed' | 'resolved';

export interface Alert {
  id: string;
  type: AlertType;
  priority: AlertPriority;
  status: AlertStatus;
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
  userId?: string;
  companyId: string;
  createdAt: Date;
  readAt?: Date;
  resolvedAt?: Date;
}

// ============================================
// LOGS DE AUDITORÍA
// ============================================

export type AuditAction = 
  | 'create' | 'update' | 'delete' 
  | 'login' | 'logout' | 'password_change'
  | 'export' | 'import'
  | 'role_change' | 'permission_change'
  | 'stock_adjustment' | 'movement_create';

export type AuditEntity = 
  | 'user' | 'role' | 'product' | 'warehouse' 
  | 'supplier' | 'movement' | 'company' | 'system';

export interface AuditLog {
  id: string;
  action: AuditAction;
  entity: AuditEntity;
  entityId: string;
  entityName: string;
  userId: string;
  userName: string;
  companyId: string;
  changes?: {
    field: string;
    oldValue: unknown;
    newValue: unknown;
  }[];
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

// ============================================
// DASHBOARD Y ESTADÍSTICAS
// ============================================

export interface DashboardStats {
  totalProducts: number;
  totalWarehouses: number;
  totalSuppliers: number;
  totalMovements: number;
  totalStock: number;
  lowStockProducts: number;
  inventoryValue: number;
  movementsToday: number;
  movementsWeek: number;
  topCategory: string;
  recentAlerts: number;
}

export interface MovementChartData {
  date: string;
  entradas: number;
  salidas: number;
  ajustes: number;
}

export interface StockByWarehouseData {
  warehouseId: string;
  warehouseName: string;
  totalStock: number;
  capacity: number;
  percentage: number;
}

export interface TopProductData {
  productId: string;
  productName: string;
  totalMovements: number;
  totalQuantity: number;
}

export interface StockValueByCategory {
  category: string;
  totalStock: number;
  totalValue: number;
  productCount: number;
}

// ============================================
// ESTADO DE AUTENTICACIÓN
// ============================================

export interface AuthState {
  user: User | null;
  role: Role | null;
  company: Company | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// ============================================
// VALIDACIÓN Y RESPUESTAS
// ============================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ============================================
// FILTROS DE BÚSQUEDA
// ============================================

export interface ProductFilters {
  search: string;
  category: string;
  supplier: string;
  stockStatus: 'all' | 'low' | 'normal' | 'out';
  priceRange: { min: number; max: number } | null;
  isActive: boolean | null;
}

export interface MovementFilters {
  search: string;
  type: MovementType | 'all';
  warehouseId: string;
  productId: string;
  userId: string;
  dateRange: { start: string; end: string } | null;
}

export interface AuditFilters {
  search: string;
  action: AuditAction | 'all';
  entity: AuditEntity | 'all';
  userId: string;
  dateRange: { start: string; end: string } | null;
}

// ============================================
// PAGINACIÓN
// ============================================

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationState;
}

// ============================================
// NOTIFICACIÓN TOAST
// ============================================

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}
