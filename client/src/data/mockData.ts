// ============================================
// DATOS MOCK - SISTEMA PROFESIONAL DE INVENTARIO
// Con Alertas, Auditoría y datos extensos
// ============================================

import { 
  User, Company, Warehouse, Product, Supplier, 
  InventoryMovement, Role, Permission, MovementType,
  Alert, AuditLog, AuditAction, AuditEntity
} from '../types';

// ============================================
// PERMISOS DEL SISTEMA
// ============================================
export const systemPermissions: Permission[] = [
  // Inventario
  { id: 'perm-001', key: 'inventory_view', name: 'Ver Inventario', description: 'Ver productos y stock', category: 'inventory' },
  { id: 'perm-002', key: 'inventory_create', name: 'Crear Productos', description: 'Agregar nuevos productos', category: 'inventory' },
  { id: 'perm-003', key: 'inventory_edit', name: 'Editar Productos', description: 'Modificar productos existentes', category: 'inventory' },
  { id: 'perm-004', key: 'inventory_delete', name: 'Eliminar Productos', description: 'Eliminar productos del sistema', category: 'inventory' },
  { id: 'perm-005', key: 'movements_view', name: 'Ver Movimientos', description: 'Ver historial de movimientos', category: 'inventory' },
  { id: 'perm-006', key: 'movements_create', name: 'Registrar Movimientos', description: 'Crear entradas, salidas y ajustes', category: 'inventory' },
  { id: 'perm-007', key: 'warehouses_view', name: 'Ver Almacenes', description: 'Ver listado de almacenes', category: 'inventory' },
  { id: 'perm-008', key: 'warehouses_manage', name: 'Gestionar Almacenes', description: 'CRUD de almacenes', category: 'inventory' },
  { id: 'perm-009', key: 'suppliers_view', name: 'Ver Proveedores', description: 'Ver listado de proveedores', category: 'inventory' },
  { id: 'perm-010', key: 'suppliers_manage', name: 'Gestionar Proveedores', description: 'CRUD de proveedores', category: 'inventory' },
  
  // Usuarios
  { id: 'perm-011', key: 'users_view', name: 'Ver Usuarios', description: 'Ver lista de usuarios', category: 'users' },
  { id: 'perm-012', key: 'users_create', name: 'Crear Usuarios', description: 'Agregar nuevos usuarios', category: 'users' },
  { id: 'perm-013', key: 'users_edit', name: 'Editar Usuarios', description: 'Modificar usuarios existentes', category: 'users' },
  { id: 'perm-014', key: 'users_delete', name: 'Eliminar Usuarios', description: 'Eliminar usuarios del sistema', category: 'users' },
  { id: 'perm-015', key: 'roles_view', name: 'Ver Roles', description: 'Ver roles del sistema', category: 'users' },
  { id: 'perm-016', key: 'roles_manage', name: 'Gestionar Roles', description: 'Crear y editar roles personalizados', category: 'users' },
  
  // Reportes
  { id: 'perm-017', key: 'reports_view', name: 'Ver Reportes', description: 'Acceder a reportes y estadísticas', category: 'reports' },
  { id: 'perm-018', key: 'reports_export', name: 'Exportar Reportes', description: 'Descargar reportes en CSV/PDF', category: 'reports' },
  { id: 'perm-019', key: 'dashboard_view', name: 'Ver Dashboard', description: 'Acceder al panel de control', category: 'reports' },
  
  // Configuración
  { id: 'perm-020', key: 'settings_view', name: 'Ver Configuración', description: 'Ver configuración del sistema', category: 'settings' },
  { id: 'perm-021', key: 'settings_edit', name: 'Editar Configuración', description: 'Modificar configuración del sistema', category: 'settings' },
  { id: 'perm-022', key: 'company_manage', name: 'Gestionar Empresa', description: 'Configurar datos de la empresa', category: 'settings' },
  { id: 'perm-023', key: 'company_edit', name: 'Editar Empresa', description: 'Modificar datos de la empresa', category: 'settings' },
  
  // Auditoría
  { id: 'perm-024', key: 'audit_view', name: 'Ver Auditoría', description: 'Acceder a logs de auditoría', category: 'audit' },
  { id: 'perm-025', key: 'alerts_view', name: 'Ver Alertas', description: 'Ver centro de notificaciones', category: 'audit' },
  { id: 'perm-026', key: 'alerts_manage', name: 'Gestionar Alertas', description: 'Gestionar alertas del sistema', category: 'audit' },
];

const ALL_PERMISSIONS = systemPermissions.map(p => p.key);

// ============================================
// ROLES DEL SISTEMA
// ============================================
export const roles: Role[] = [
  {
    id: 'role-admin',
    name: 'Administrador',
    description: 'Acceso completo al sistema. Este rol no puede ser modificado.',
    permissions: ALL_PERMISSIONS,
    isSystem: true,
    color: '#ef4444',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'role-manager',
    name: 'Gerente',
    description: 'Gestión de inventario y reportes, sin acceso a configuración avanzada.',
    permissions: [
      'inventory_view', 'inventory_create', 'inventory_edit',
      'movements_view', 'movements_create',
      'warehouses_view', 'warehouses_manage',
      'suppliers_view', 'suppliers_manage',
      'users_view', 'roles_view',
      'reports_view', 'reports_export', 'dashboard_view',
      'alerts_view',
    ],
    isSystem: false,
    color: '#3b82f6',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'role-operator',
    name: 'Operador',
    description: 'Registro de movimientos de inventario y consultas básicas.',
    permissions: [
      'inventory_view',
      'movements_view', 'movements_create',
      'warehouses_view',
      'suppliers_view',
      'reports_view', 'dashboard_view',
      'alerts_view',
    ],
    isSystem: false,
    color: '#22c55e',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'role-viewer',
    name: 'Visualizador',
    description: 'Solo lectura. Puede ver datos y exportar reportes.',
    permissions: [
      'inventory_view',
      'movements_view',
      'warehouses_view',
      'suppliers_view',
      'reports_view', 'reports_export', 'dashboard_view',
      'alerts_view',
    ],
    isSystem: false,
    color: '#6b7280',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'role-auditor',
    name: 'Auditor',
    description: 'Acceso a reportes y logs de auditoría para revisiones.',
    permissions: [
      'inventory_view',
      'movements_view',
      'warehouses_view',
      'suppliers_view',
      'users_view',
      'reports_view', 'reports_export', 'dashboard_view',
      'audit_view',
      'alerts_view',
    ],
    isSystem: false,
    color: '#8b5cf6',
    createdAt: new Date('2024-01-01'),
  },
];

// ============================================
// COMPANY (TENANT)
// ============================================
export const companies: Company[] = [
  {
    id: 'comp-001',
    name: 'TechLogistics S.A.',
    identifier: 'TECLOG',
    logo: undefined,
    config: { 
      currency: 'USD', 
      timezone: 'America/Mexico_City',
      lowStockThreshold: 10 
    },
    plan: 'enterprise',
    createdAt: new Date('2024-01-01'),
  },
];

// ============================================
// USERS
// ============================================
export const users: User[] = [
  {
    id: 'user-001',
    name: 'Carlos Administrador',
    email: 'admin@techlogistics.com',
    password: 'admin123',
    roleId: 'role-admin',
    companyId: 'comp-001',
    avatar: 'CA',
    mustChangePassword: false,
    isActive: true,
    lastLogin: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'user-002',
    name: 'María Gerente',
    email: 'gerente@techlogistics.com',
    password: 'gerente123',
    roleId: 'role-manager',
    companyId: 'comp-001',
    avatar: 'MG',
    mustChangePassword: false,
    isActive: true,
    lastLogin: new Date(),
    createdAt: new Date('2024-01-05'),
  },
  {
    id: 'user-003',
    name: 'Pedro Operador',
    email: 'operador@techlogistics.com',
    password: 'operador123',
    roleId: 'role-operator',
    companyId: 'comp-001',
    avatar: 'PO',
    mustChangePassword: true,
    isActive: true,
    createdAt: new Date('2024-01-10'),
  },
  {
    id: 'user-004',
    name: 'Ana Visualizadora',
    email: 'viewer@techlogistics.com',
    password: 'viewer123',
    roleId: 'role-viewer',
    companyId: 'comp-001',
    avatar: 'AV',
    mustChangePassword: false,
    isActive: true,
    lastLogin: new Date(),
    createdAt: new Date('2024-01-12'),
  },
  {
    id: 'user-005',
    name: 'Roberto Auditor',
    email: 'auditor@techlogistics.com',
    password: 'auditor123',
    roleId: 'role-auditor',
    companyId: 'comp-001',
    avatar: 'RA',
    mustChangePassword: false,
    isActive: true,
    lastLogin: new Date(),
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'user-006',
    name: 'Laura Operadora',
    email: 'laura@techlogistics.com',
    password: 'laura123',
    roleId: 'role-operator',
    companyId: 'comp-001',
    avatar: 'LO',
    mustChangePassword: false,
    isActive: true,
    createdAt: new Date('2024-01-20'),
  },
];

// ============================================
// WAREHOUSES
// ============================================
export const warehouses: Warehouse[] = [
  {
    id: 'wh-001',
    name: 'Almacén Central CDMX',
    code: 'CDMX-001',
    address: 'Av. Insurgentes Sur 1234, Col. Del Valle',
    city: 'Ciudad de México',
    companyId: 'comp-001',
    responsibleIds: ['user-001', 'user-002'],
    capacity: 10000,
    isActive: true,
    createdAt: new Date('2024-01-02'),
  },
  {
    id: 'wh-002',
    name: 'Almacén Norte MTY',
    code: 'MTY-001',
    address: 'Blvd. Díaz Ordaz 567, Col. Santa María',
    city: 'Monterrey',
    companyId: 'comp-001',
    responsibleIds: ['user-002'],
    capacity: 7500,
    isActive: true,
    createdAt: new Date('2024-01-03'),
  },
  {
    id: 'wh-003',
    name: 'Almacén Sur GDL',
    code: 'GDL-001',
    address: 'Av. Vallarta 890, Col. Americana',
    city: 'Guadalajara',
    companyId: 'comp-001',
    responsibleIds: ['user-002', 'user-003'],
    capacity: 5000,
    isActive: true,
    createdAt: new Date('2024-01-04'),
  },
  {
    id: 'wh-004',
    name: 'Centro de Distribución QRO',
    code: 'QRO-001',
    address: 'Parque Industrial Querétaro, Nave 15',
    city: 'Querétaro',
    companyId: 'comp-001',
    responsibleIds: ['user-006'],
    capacity: 12000,
    isActive: true,
    createdAt: new Date('2024-02-01'),
  },
  {
    id: 'wh-005',
    name: 'Almacén Express TIJ',
    code: 'TIJ-001',
    address: 'Zona Industrial Otay, Edificio 23',
    city: 'Tijuana',
    companyId: 'comp-001',
    responsibleIds: ['user-003'],
    capacity: 3000,
    isActive: false,
    createdAt: new Date('2024-02-15'),
  },
];

// ============================================
// SUPPLIERS
// ============================================
export const suppliers: Supplier[] = [
  {
    id: 'sup-001',
    name: 'ElectroSupply Corp',
    email: 'ventas@electrosupply.com',
    phone: '+52 55 1234 5678',
    address: 'Polanco, CDMX',
    taxId: 'ESC850101XXX',
    companyId: 'comp-001',
    isActive: true,
    createdAt: new Date('2024-01-02'),
  },
  {
    id: 'sup-002',
    name: 'TechParts Internacional',
    email: 'orders@techparts.com',
    phone: '+52 81 9876 5432',
    address: 'San Pedro, MTY',
    taxId: 'TPI900215YYY',
    companyId: 'comp-001',
    isActive: true,
    createdAt: new Date('2024-01-03'),
  },
  {
    id: 'sup-003',
    name: 'Distribuidora Global MX',
    email: 'info@distglobal.mx',
    phone: '+52 33 5555 1234',
    address: 'Zapopan, GDL',
    taxId: 'DGM880520ZZZ',
    companyId: 'comp-001',
    isActive: true,
    createdAt: new Date('2024-01-04'),
  },
  {
    id: 'sup-004',
    name: 'Importadora Asia Pacific',
    email: 'ventas@asiapacific.com',
    phone: '+52 55 8888 9999',
    address: 'Santa Fe, CDMX',
    taxId: 'IAP920101ABC',
    companyId: 'comp-001',
    isActive: true,
    createdAt: new Date('2024-01-20'),
  },
  {
    id: 'sup-005',
    name: 'Suministros Industriales del Norte',
    email: 'contacto@sumnorte.com',
    phone: '+52 81 1111 2222',
    address: 'Apodaca, NL',
    taxId: 'SIN870301DEF',
    companyId: 'comp-001',
    isActive: false,
    createdAt: new Date('2024-02-01'),
  },
];

// ============================================
// PRODUCTS - CATÁLOGO EXTENSO
// ============================================
export const products: Product[] = [
  // Electrónicos
  {
    id: 'prod-001',
    name: 'Laptop Dell XPS 15',
    sku: 'LAP-DELL-XPS15',
    category: 'Electrónicos',
    description: 'Laptop profesional 15" con procesador Intel i7, 16GB RAM, 512GB SSD',
    minStock: 10,
    price: 1499.99,
    cost: 1100.00,
    unit: 'pieza',
    companyId: 'comp-001',
    supplierId: 'sup-001',
    isActive: true,
    createdAt: new Date('2024-01-05'),
  },
  {
    id: 'prod-002',
    name: 'Monitor LG UltraWide 34"',
    sku: 'MON-LG-UW34',
    category: 'Electrónicos',
    description: 'Monitor curvo 34" 4K IPS HDR para profesionales',
    minStock: 15,
    price: 599.99,
    cost: 420.00,
    unit: 'pieza',
    companyId: 'comp-001',
    supplierId: 'sup-001',
    isActive: true,
    createdAt: new Date('2024-01-05'),
  },
  {
    id: 'prod-003',
    name: 'MacBook Pro 14"',
    sku: 'LAP-MAC-PRO14',
    category: 'Electrónicos',
    description: 'MacBook Pro M3 Pro, 18GB RAM, 512GB SSD',
    minStock: 8,
    price: 1999.99,
    cost: 1600.00,
    unit: 'pieza',
    companyId: 'comp-001',
    supplierId: 'sup-004',
    isActive: true,
    createdAt: new Date('2024-01-10'),
  },
  // Accesorios
  {
    id: 'prod-004',
    name: 'Teclado Logitech MX Keys',
    sku: 'TEC-LOG-MXKEYS',
    category: 'Accesorios',
    description: 'Teclado mecánico inalámbrico premium con retroiluminación',
    minStock: 25,
    price: 149.99,
    cost: 95.00,
    unit: 'pieza',
    companyId: 'comp-001',
    supplierId: 'sup-001',
    isActive: true,
    createdAt: new Date('2024-01-06'),
  },
  {
    id: 'prod-005',
    name: 'Mouse Logitech MX Master 3S',
    sku: 'MOU-LOG-MX3S',
    category: 'Accesorios',
    description: 'Mouse ergonómico profesional con sensor 8K DPI',
    minStock: 30,
    price: 99.99,
    cost: 65.00,
    unit: 'pieza',
    companyId: 'comp-001',
    supplierId: 'sup-001',
    isActive: true,
    createdAt: new Date('2024-01-06'),
  },
  {
    id: 'prod-006',
    name: 'Webcam Logitech C920',
    sku: 'CAM-LOG-C920',
    category: 'Accesorios',
    description: 'Cámara web HD 1080p con micrófono estéreo integrado',
    minStock: 20,
    price: 89.99,
    cost: 55.00,
    unit: 'pieza',
    companyId: 'comp-001',
    supplierId: 'sup-002',
    isActive: true,
    createdAt: new Date('2024-01-07'),
  },
  {
    id: 'prod-007',
    name: 'Hub USB-C 12 en 1',
    sku: 'HUB-USC-12IN1',
    category: 'Accesorios',
    description: 'Docking Station USB-C con HDMI, Ethernet, SD, USB-A y PD 100W',
    minStock: 18,
    price: 129.99,
    cost: 75.00,
    unit: 'pieza',
    companyId: 'comp-001',
    supplierId: 'sup-003',
    isActive: true,
    createdAt: new Date('2024-01-08'),
  },
  // Audio
  {
    id: 'prod-008',
    name: 'Auriculares Sony WH-1000XM5',
    sku: 'AUR-SON-XM5',
    category: 'Audio',
    description: 'Auriculares over-ear con cancelación de ruido activa premium',
    minStock: 12,
    price: 349.99,
    cost: 240.00,
    unit: 'pieza',
    companyId: 'comp-001',
    supplierId: 'sup-003',
    isActive: true,
    createdAt: new Date('2024-01-07'),
  },
  {
    id: 'prod-009',
    name: 'AirPods Pro 2da Gen',
    sku: 'AUR-APP-PRO2',
    category: 'Audio',
    description: 'Auriculares inalámbricos con ANC y audio espacial',
    minStock: 20,
    price: 249.99,
    cost: 180.00,
    unit: 'pieza',
    companyId: 'comp-001',
    supplierId: 'sup-004',
    isActive: true,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'prod-010',
    name: 'Bocina JBL Flip 6',
    sku: 'BOC-JBL-FLIP6',
    category: 'Audio',
    description: 'Bocina portátil Bluetooth IP67 resistente al agua',
    minStock: 25,
    price: 129.99,
    cost: 80.00,
    unit: 'pieza',
    companyId: 'comp-001',
    supplierId: 'sup-003',
    isActive: true,
    createdAt: new Date('2024-01-20'),
  },
  // Almacenamiento
  {
    id: 'prod-011',
    name: 'SSD Samsung 990 Pro 1TB',
    sku: 'SSD-SAM-990P1T',
    category: 'Almacenamiento',
    description: 'Disco sólido NVMe Gen4 7450MB/s de alta velocidad',
    minStock: 25,
    price: 149.99,
    cost: 95.00,
    unit: 'pieza',
    companyId: 'comp-001',
    supplierId: 'sup-002',
    isActive: true,
    createdAt: new Date('2024-01-08'),
  },
  {
    id: 'prod-012',
    name: 'SSD Samsung 990 Pro 2TB',
    sku: 'SSD-SAM-990P2T',
    category: 'Almacenamiento',
    description: 'Disco sólido NVMe Gen4 7450MB/s capacidad doble',
    minStock: 15,
    price: 249.99,
    cost: 160.00,
    unit: 'pieza',
    companyId: 'comp-001',
    supplierId: 'sup-002',
    isActive: true,
    createdAt: new Date('2024-01-08'),
  },
  {
    id: 'prod-013',
    name: 'HDD Externo WD 4TB',
    sku: 'HDD-WD-EXT4TB',
    category: 'Almacenamiento',
    description: 'Disco duro externo USB 3.0 para respaldos',
    minStock: 20,
    price: 109.99,
    cost: 70.00,
    unit: 'pieza',
    companyId: 'comp-001',
    supplierId: 'sup-002',
    isActive: true,
    createdAt: new Date('2024-01-25'),
  },
  // Cables y Conectores
  {
    id: 'prod-014',
    name: 'Cable USB-C a USB-C 2m',
    sku: 'CAB-USCC-2M',
    category: 'Cables',
    description: 'Cable USB-C PD 100W con soporte de datos 10Gbps',
    minStock: 50,
    price: 19.99,
    cost: 8.00,
    unit: 'pieza',
    companyId: 'comp-001',
    supplierId: 'sup-003',
    isActive: true,
    createdAt: new Date('2024-01-10'),
  },
  {
    id: 'prod-015',
    name: 'Cable HDMI 2.1 3m',
    sku: 'CAB-HDMI21-3M',
    category: 'Cables',
    description: 'Cable HDMI 2.1 8K 60Hz / 4K 120Hz certificado',
    minStock: 40,
    price: 29.99,
    cost: 12.00,
    unit: 'pieza',
    companyId: 'comp-001',
    supplierId: 'sup-003',
    isActive: true,
    createdAt: new Date('2024-01-10'),
  },
  // Redes
  {
    id: 'prod-016',
    name: 'Router WiFi 6 TP-Link AX5400',
    sku: 'ROU-TPL-AX5400',
    category: 'Redes',
    description: 'Router tri-banda WiFi 6 con cobertura hasta 200m²',
    minStock: 10,
    price: 179.99,
    cost: 110.00,
    unit: 'pieza',
    companyId: 'comp-001',
    supplierId: 'sup-002',
    isActive: true,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'prod-017',
    name: 'Switch Gigabit 8 Puertos',
    sku: 'SWI-GIG-8P',
    category: 'Redes',
    description: 'Switch no administrado 8 puertos 10/100/1000 Mbps',
    minStock: 15,
    price: 49.99,
    cost: 28.00,
    unit: 'pieza',
    companyId: 'comp-001',
    supplierId: 'sup-002',
    isActive: true,
    createdAt: new Date('2024-01-15'),
  },
  // Periféricos Gaming
  {
    id: 'prod-018',
    name: 'Mouse Razer DeathAdder V3',
    sku: 'MOU-RAZ-DAV3',
    category: 'Gaming',
    description: 'Mouse gaming ergonómico 30K DPI Focus Pro',
    minStock: 20,
    price: 89.99,
    cost: 55.00,
    unit: 'pieza',
    companyId: 'comp-001',
    supplierId: 'sup-004',
    isActive: true,
    createdAt: new Date('2024-02-01'),
  },
  {
    id: 'prod-019',
    name: 'Teclado Corsair K70 RGB',
    sku: 'TEC-COR-K70RGB',
    category: 'Gaming',
    description: 'Teclado mecánico Cherry MX Red con RGB per-key',
    minStock: 15,
    price: 169.99,
    cost: 110.00,
    unit: 'pieza',
    companyId: 'comp-001',
    supplierId: 'sup-004',
    isActive: true,
    createdAt: new Date('2024-02-01'),
  },
  {
    id: 'prod-020',
    name: 'Monitor Samsung Odyssey G7 32"',
    sku: 'MON-SAM-G732',
    category: 'Gaming',
    description: 'Monitor gaming curvo 240Hz 1ms QHD',
    minStock: 8,
    price: 699.99,
    cost: 480.00,
    unit: 'pieza',
    companyId: 'comp-001',
    supplierId: 'sup-001',
    isActive: true,
    createdAt: new Date('2024-02-05'),
  },
];

// ============================================
// INVENTORY MOVEMENTS - GENERADOR
// ============================================
function generateMovements(): InventoryMovement[] {
  const movements: InventoryMovement[] = [];
  const types: MovementType[] = ['entrada', 'salida', 'ajuste'];
  const reasons: Record<MovementType, string[]> = {
    entrada: ['Compra a proveedor', 'Devolución de cliente', 'Transferencia entrada', 'Producción', 'Inventario inicial'],
    salida: ['Venta a cliente', 'Transferencia salida', 'Producto dañado', 'Muestra comercial', 'Garantía'],
    ajuste: ['Inventario físico', 'Corrección de error', 'Ajuste por merma', 'Regularización', 'Caducidad'],
    transferencia: ['Reubicación', 'Balance de stock', 'Consolidación'],
  };

  let id = 1;
  const activeWarehouses = warehouses.filter(w => w.isActive);
  const activeProducts = products.filter(p => p.isActive);
  const activeUsers = users.filter(u => u.isActive && ['role-admin', 'role-manager', 'role-operator'].includes(u.roleId));
  
  for (let day = 60; day >= 0; day--) {
    const date = new Date();
    date.setDate(date.getDate() - day);
    
    const movementsPerDay = Math.floor(Math.random() * 12) + 5;
    
    for (let m = 0; m < movementsPerDay; m++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const product = activeProducts[Math.floor(Math.random() * activeProducts.length)];
      const warehouse = activeWarehouses[Math.floor(Math.random() * activeWarehouses.length)];
      const user = activeUsers[Math.floor(Math.random() * activeUsers.length)];
      
      const hour = Math.floor(Math.random() * 10) + 8;
      const minute = Math.floor(Math.random() * 60);
      date.setHours(hour, minute, 0, 0);
      
      movements.push({
        id: `mov-${String(id++).padStart(5, '0')}`,
        productId: product.id,
        warehouseId: warehouse.id,
        type,
        quantity: type === 'entrada' 
          ? Math.floor(Math.random() * 100) + 20 
          : type === 'salida' 
            ? Math.floor(Math.random() * 40) + 5 
            : Math.floor(Math.random() * 30) - 15,
        unitCost: product.cost,
        userId: user.id,
        reason: reasons[type][Math.floor(Math.random() * reasons[type].length)],
        reference: `REF-${Date.now().toString().slice(-6)}-${id}`,
        date: new Date(date),
        companyId: 'comp-001',
      });
    }
  }
  
  return movements;
}

export const inventoryMovements: InventoryMovement[] = generateMovements();

// ============================================
// ALERTAS DEL SISTEMA
// ============================================
function generateAlerts(): Alert[] {
  const alerts: Alert[] = [];
  
  // Alertas de stock bajo
  const stockByProduct = calculateStockByProduct();
  stockByProduct.filter(p => p.totalStock < p.minStock).forEach((p, i) => {
    const product = products.find(prod => prod.id === p.productId);
    alerts.push({
      id: `alert-stock-${i}`,
      type: 'low_stock',
      priority: p.totalStock === 0 ? 'critical' : p.totalStock < p.minStock / 2 ? 'high' : 'medium',
      status: 'unread',
      title: `Stock bajo: ${product?.name}`,
      message: `El producto ${product?.name} (${product?.sku}) tiene ${p.totalStock} unidades. Mínimo requerido: ${p.minStock}`,
      metadata: { productId: p.productId, currentStock: p.totalStock, minStock: p.minStock },
      companyId: 'comp-001',
      createdAt: new Date(Date.now() - Math.random() * 86400000 * 3),
    });
  });
  
  // Alertas del sistema
  alerts.push({
    id: 'alert-sys-001',
    type: 'system',
    priority: 'low',
    status: 'read',
    title: 'Respaldo completado',
    message: 'El respaldo automático del sistema se completó exitosamente.',
    companyId: 'comp-001',
    createdAt: new Date(Date.now() - 86400000),
    readAt: new Date(),
  });
  
  alerts.push({
    id: 'alert-sys-002',
    type: 'system',
    priority: 'medium',
    status: 'unread',
    title: 'Actualización disponible',
    message: 'Hay una nueva versión del sistema disponible (v2.1.0).',
    companyId: 'comp-001',
    createdAt: new Date(Date.now() - 43200000),
  });
  
  // Alertas de movimientos recientes
  const recentMovements = inventoryMovements.slice(-5);
  recentMovements.forEach((m, i) => {
    const product = products.find(p => p.id === m.productId);
    alerts.push({
      id: `alert-mov-${i}`,
      type: 'movement',
      priority: 'low',
      status: i < 2 ? 'unread' : 'read',
      title: `${m.type === 'entrada' ? 'Entrada' : m.type === 'salida' ? 'Salida' : 'Ajuste'} registrada`,
      message: `Se registró un movimiento de ${Math.abs(m.quantity)} unidades de ${product?.name}.`,
      metadata: { movementId: m.id, productId: m.productId, quantity: m.quantity },
      userId: m.userId,
      companyId: 'comp-001',
      createdAt: m.date,
      readAt: i >= 2 ? new Date() : undefined,
    });
  });
  
  return alerts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export const alerts: Alert[] = generateAlerts();

// ============================================
// LOGS DE AUDITORÍA
// ============================================
function generateAuditLogs(): AuditLog[] {
  const logs: AuditLog[] = [];
  const actions: AuditAction[] = ['create', 'update', 'delete', 'login', 'export', 'movement_create'];
  const entities: AuditEntity[] = ['product', 'warehouse', 'supplier', 'user', 'movement'];
  
  let id = 1;
  
  // Logs de login
  users.forEach(user => {
    if (user.lastLogin) {
      logs.push({
        id: `log-${String(id++).padStart(5, '0')}`,
        action: 'login',
        entity: 'user',
        entityId: user.id,
        entityName: user.name,
        userId: user.id,
        userName: user.name,
        companyId: 'comp-001',
        ipAddress: '192.168.1.' + Math.floor(Math.random() * 255),
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
        timestamp: user.lastLogin,
      });
    }
  });
  
  // Logs de movimientos recientes
  inventoryMovements.slice(-50).forEach(m => {
    const user = users.find(u => u.id === m.userId);
    const product = products.find(p => p.id === m.productId);
    logs.push({
      id: `log-${String(id++).padStart(5, '0')}`,
      action: 'movement_create',
      entity: 'movement',
      entityId: m.id,
      entityName: `${m.type} - ${product?.name || 'N/A'}`,
      userId: m.userId,
      userName: user?.name || 'Sistema',
      companyId: 'comp-001',
      metadata: {
        type: m.type,
        quantity: m.quantity,
        productId: m.productId,
        warehouseId: m.warehouseId,
      },
      timestamp: m.date,
    });
  });
  
  // Logs variados
  for (let i = 0; i < 30; i++) {
    const action = actions[Math.floor(Math.random() * actions.length)];
    const entity = entities[Math.floor(Math.random() * entities.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const date = new Date(Date.now() - Math.random() * 86400000 * 30);
    
    let entityName = '';
    let entityId = '';
    
    if (entity === 'product') {
      const p = products[Math.floor(Math.random() * products.length)];
      entityName = p.name;
      entityId = p.id;
    } else if (entity === 'warehouse') {
      const w = warehouses[Math.floor(Math.random() * warehouses.length)];
      entityName = w.name;
      entityId = w.id;
    } else if (entity === 'supplier') {
      const s = suppliers[Math.floor(Math.random() * suppliers.length)];
      entityName = s.name;
      entityId = s.id;
    } else if (entity === 'user') {
      entityName = user.name;
      entityId = user.id;
    }
    
    logs.push({
      id: `log-${String(id++).padStart(5, '0')}`,
      action,
      entity,
      entityId,
      entityName,
      userId: user.id,
      userName: user.name,
      companyId: 'comp-001',
      changes: action === 'update' ? [
        { field: 'name', oldValue: 'Valor anterior', newValue: 'Valor nuevo' },
      ] : undefined,
      timestamp: date,
    });
  }
  
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export const auditLogs: AuditLog[] = generateAuditLogs();

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getRoleById(roleId: string): Role | undefined {
  return roles.find(r => r.id === roleId);
}

export function getUserRole(user: User): Role | undefined {
  return getRoleById(user.roleId);
}

export function hasPermission(role: Role | undefined, permission: string): boolean {
  if (!role) return false;
  return role.permissions.includes(permission);
}

export function calculateStockByWarehouse() {
  const stockMap = new Map<string, number>();
  
  inventoryMovements.forEach(mov => {
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
}

export function calculateStockByProduct() {
  const stockMap = new Map<string, number>();
  
  inventoryMovements.forEach(mov => {
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
}

export function getMovementsChartData(days: number = 14) {
  const result: { date: string; entradas: number; salidas: number; ajustes: number }[] = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayMovements = inventoryMovements.filter(mov => {
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
}

export function getTopProducts(limit: number = 5) {
  const productCount = new Map<string, { movements: number; quantity: number }>();
  
  inventoryMovements.forEach(mov => {
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
}

export function getStockValueByCategory() {
  const stockByProduct = calculateStockByProduct();
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
}

export function getDashboardStats() {
  const stockByProduct = calculateStockByProduct();
  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
  
  const todayMovements = inventoryMovements.filter(m => 
    new Date(m.date).toISOString().split('T')[0] === today
  );
  
  const weekMovements = inventoryMovements.filter(m => {
    const movDate = new Date(m.date).toISOString().split('T')[0];
    return movDate >= weekAgo && movDate <= today;
  });
  
  const stockByCategory = getStockValueByCategory();
  const topCategory = stockByCategory[0]?.category || 'N/A';
  
  const unreadAlerts = alerts.filter(a => a.status === 'unread').length;
  
  return {
    totalProducts: products.filter(p => p.isActive).length,
    totalWarehouses: warehouses.filter(w => w.isActive).length,
    totalSuppliers: suppliers.filter(s => s.isActive).length,
    totalMovements: inventoryMovements.length,
    totalStock: stockByProduct.reduce((sum, p) => sum + p.totalStock, 0),
    lowStockProducts: stockByProduct.filter(p => p.totalStock < p.minStock).length,
    inventoryValue: stockByProduct.reduce((sum, p) => sum + (p.totalStock * p.price), 0),
    movementsToday: todayMovements.length,
    movementsWeek: weekMovements.length,
    topCategory,
    recentAlerts: unreadAlerts,
  };
}

export function getSupplierStats() {
  const stockByProduct = calculateStockByProduct();
  
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
}
