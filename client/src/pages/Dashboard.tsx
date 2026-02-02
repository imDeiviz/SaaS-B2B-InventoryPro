// ============================================
// DASHBOARD PRINCIPAL - DISEÑO PROFESIONAL
// Con soporte completo para theming
// ============================================

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '@/store/DataContext';
import { useAuth } from '@/store/AuthContext';
import { useTheme } from '@/store/ThemeContext';
import { Card, StatCard, Badge, ProgressBar } from '@/components/ui';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart
} from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Package, Warehouse, Truck, ArrowLeftRight, TrendingUp, AlertTriangle,
  ArrowUpRight, ArrowDownRight, Activity, DollarSign, ShoppingCart,
  Clock, CheckCircle2
} from 'lucide-react';

export function DashboardPage() {
  const { user } = useAuth();
  const { currentTheme } = useTheme();
  const colors = currentTheme.colors;
  const CHART_COLORS = colors.chart;

  const {
    products, warehouses, movements,
    getDashboardData, getMovementsChart, getStockByWarehouse,
    getTopMovedProducts, getStockByProduct, getProductById, getWarehouseById
  } = useData();

  const stats = useMemo(() => getDashboardData(), [getDashboardData]);
  const movementsChart = useMemo(() => getMovementsChart(14), [getMovementsChart]);
  const stockByWarehouse = useMemo(() => getStockByWarehouse(), [getStockByWarehouse]);
  const topProducts = useMemo(() => getTopMovedProducts(5), [getTopMovedProducts]);
  const stockByProduct = useMemo(() => getStockByProduct(), [getStockByProduct]);

  // Recent movements
  const recentMovements = useMemo(() =>
    movements
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5),
    [movements]
  );

  // Low stock products
  const lowStockProducts = useMemo(() =>
    stockByProduct
      .filter(p => p.totalStock < p.minStock)
      .slice(0, 5),
    [stockByProduct]
  );

  // Products by category for pie chart
  const productsByCategory = useMemo(() => {
    const categories = [...new Set(products.map(p => p.category))];
    return categories.map(cat => ({
      name: cat,
      value: products.filter(p => p.category === cat).length
    }));
  }, [products]);

  // Value metrics
  const totalInventoryValue = useMemo(() => {
    return products.reduce((total, product) => {
      const stock = stockByProduct.find(s => s.productId === product.id)?.totalStock || 0;
      return total + (product.price * stock);
    }, 0);
  }, [products, stockByProduct]);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-primary">
            {getTimeGreeting()}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="mt-1 text-secondary">
            Aquí está el resumen de tu inventario para hoy, {format(new Date(), "EEEE d 'de' MMMM", { locale: es })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/movements"
            className="px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 bg-card border border-themed text-primary"
          >
            <Clock size={16} />
            Ver Historial
          </Link>
          <Link
            to="/reports"
            className="px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 bg-brand-gradient text-white shadow-themed"
          >
            <TrendingUp size={16} />
            Ver Reportes
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Productos"
          value={stats.totalProducts}
          icon={<Package size={24} className="text-indigo-600" />}
          trend={{ value: '+12% vs mes anterior', up: true }}
        />
        <StatCard
          title="Almacenes Activos"
          value={stats.totalWarehouses}
          icon={<Warehouse size={24} className="text-purple-600" />}
        />
        <StatCard
          title="Proveedores"
          value={stats.totalSuppliers}
          icon={<Truck size={24} className="text-blue-600" />}
        />
        <StatCard
          title="Movimientos (Mes)"
          value={stats.totalMovements}
          icon={<ArrowLeftRight size={24} className="text-emerald-600" />}
          trend={{ value: '+8% vs semana anterior', up: true }}
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Stock Total"
          value={stats.totalStock}
          icon={<ShoppingCart size={24} />}
          variant="gradient"
          gradientFrom="from-indigo-500"
          gradientTo="to-purple-600"
        />
        <StatCard
          title="Valor del Inventario"
          value={`$${totalInventoryValue.toLocaleString('en-US', { minimumFractionDigits: 0 })}`}
          icon={<DollarSign size={24} />}
          variant="gradient"
          gradientFrom="from-emerald-500"
          gradientTo="to-teal-600"
        />
        <StatCard
          title="Alertas de Stock"
          value={stats.lowStockProducts}
          icon={<AlertTriangle size={24} />}
          variant="gradient"
          gradientFrom="from-amber-500"
          gradientTo="to-orange-600"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Movements Line Chart */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-primary">Movimientos de Inventario</h3>
              <p className="text-sm text-muted">Últimos 14 días</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.status.success }} />
                <span className="text-secondary">Entradas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.status.danger }} />
                <span className="text-secondary">Salidas</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={movementsChart}>
              <defs>
                <linearGradient id="colorEntradas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.status.success} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={colors.status.success} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSalidas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.status.danger} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={colors.status.danger} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.border.default} />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => format(new Date(value), 'dd/MM')}
                tick={{ fontSize: 12, fill: colors.text.muted }}
                axisLine={{ stroke: colors.border.default }}
              />
              <YAxis tick={{ fontSize: 12, fill: colors.text.muted }} axisLine={{ stroke: colors.border.default }} />
              <Tooltip
                labelFormatter={(value) => format(new Date(value), "EEEE d 'de' MMMM", { locale: es })}
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  backgroundColor: colors.bg.elevated,
                  color: colors.text.primary
                }}
              />
              <Area
                type="monotone"
                dataKey="entradas"
                stroke={colors.status.success}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorEntradas)"
                name="Entradas"
              />
              <Area
                type="monotone"
                dataKey="salidas"
                stroke={colors.status.danger}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSalidas)"
                name="Salidas"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Products by Category Pie */}
        <Card>
          <h3 className="text-lg font-semibold mb-6 text-primary">Productos por Categoría</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={productsByCategory}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {productsByCategory.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock by Warehouse */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-primary">Stock por Almacén</h3>
            <Link
              to="/warehouses"
              className="text-sm font-medium flex items-center gap-1 text-blue-600"
            >
              Ver todos <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="space-y-4">
            {stockByWarehouse.map((item, index) => {
              const warehouse = warehouses.find(w => w.id === item.warehouseId);
              const percentage = warehouse ? (item.totalStock / warehouse.capacity) * 100 : 0;
              return (
                <div key={item.warehouseId}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: `var(--color-chart-${(index % 6) + 1})` }}
                      />
                      <span className="text-sm font-medium text-secondary">
                        {item.warehouseName}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-primary">
                        {item.totalStock.toLocaleString()}
                      </span>
                      <span className="text-xs ml-1 text-muted">
                        / {warehouse?.capacity.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <ProgressBar
                    value={percentage}
                    variant={percentage > 80 ? 'danger' : percentage > 60 ? 'warning' : 'default'}
                  />
                </div>
              );
            })}
          </div>
        </Card>

        {/* Top Products */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-primary">Productos Más Movidos</h3>
            <Link
              to="/products"
              className="text-sm font-medium flex items-center gap-1 text-blue-600"
            >
              Ver todos <ArrowUpRight size={14} />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={colors.border.default} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: colors.text.muted }} />
              <YAxis
                dataKey="productName"
                type="category"
                width={100}
                tick={{ fontSize: 11, fill: colors.text.secondary }}
                tickFormatter={(value) => value.length > 15 ? value.substring(0, 15) + '...' : value}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  backgroundColor: colors.bg.elevated,
                  color: colors.text.primary
                }}
              />
              <Bar
                dataKey="totalMovements"
                fill="url(#barGradient)"
                radius={[0, 8, 8, 0]}
                name="Movimientos"
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={colors.gradient.from} />
                    <stop offset="100%" stopColor={colors.gradient.to} />
                  </linearGradient>
                </defs>
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-primary">
              <Activity size={20} className="text-primary" />
              Actividad Reciente
            </h3>
            <Link
              to="/movements"
              className="text-sm font-medium text-blue-600"
            >
              Ver todo
            </Link>
          </div>
          <div className="space-y-4">
            {recentMovements.map((movement) => {
              const product = getProductById(movement.productId);
              const warehouse = getWarehouseById(movement.warehouseId);

              return (
                <div
                  key={movement.id}
                  className="flex items-center gap-4 p-3 rounded-xl transition-colors"
                  style={{ backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bg.hover}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: movement.type === 'entrada' ? colors.status.successBg :
                        movement.type === 'salida' ? colors.status.dangerBg : colors.status.warningBg
                    }}
                  >
                    {movement.type === 'entrada' ? (
                      <ArrowDownRight style={{ color: colors.status.success }} size={20} />
                    ) : movement.type === 'salida' ? (
                      <ArrowUpRight style={{ color: colors.status.danger }} size={20} />
                    ) : (
                      <Activity style={{ color: colors.status.warning }} size={20} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-primary">
                      {product?.name}
                    </p>
                    <p className="text-xs text-muted">
                      {warehouse?.name} • {movement.reason}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className="text-sm font-bold"
                      style={{
                        color: movement.type === 'entrada' ? colors.status.success :
                          movement.type === 'salida' ? colors.status.danger : colors.status.warning
                      }}
                    >
                      {movement.type === 'entrada' ? '+' : movement.type === 'salida' ? '-' : ''}
                      {Math.abs(movement.quantity)}
                    </p>
                    <p className="text-xs text-muted">
                      {format(new Date(movement.date), 'HH:mm')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Low Stock Alerts */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-primary">
              <AlertTriangle size={20} style={{ color: colors.status.warning }} />
              Alertas de Stock Bajo
            </h3>
            <Badge variant="warning" dot>{lowStockProducts.length} alertas</Badge>
          </div>

          {lowStockProducts.length > 0 ? (
            <div className="space-y-3">
              {lowStockProducts.map((product) => (
                <div
                  key={product.productId}
                  className="flex items-center justify-between p-4 rounded-xl"
                  style={{
                    background: `linear-gradient(135deg, ${colors.status.warningBg}, ${colors.status.warningBg})`,
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: colors.status.warningBorder
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: colors.status.warningBg }}
                    >
                      <Package size={20} style={{ color: colors.status.warning }} />
                    </div>
                    <div>
                      <p className="font-medium text-primary">{product.productName}</p>
                      <p className="text-sm text-muted">SKU: {product.sku}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold" style={{ color: colors.status.warning }}>{product.totalStock}</p>
                    <p className="text-xs text-muted">Mínimo: {product.minStock}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: colors.status.successBg }}
              >
                <CheckCircle2 size={32} style={{ color: colors.status.success }} />
              </div>
              <h4 className="font-semibold text-primary">¡Todo en orden!</h4>
              <p className="text-sm mt-1 text-muted">Todos los productos tienen stock suficiente</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
