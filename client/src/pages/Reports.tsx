// ============================================
// PÁGINA DE REPORTES - PROFESIONAL CON EXPORTACIÓN
// ============================================

import { useState, useMemo } from 'react';
import { useData } from '@/store/DataContext';
import { useToast } from '@/store/ToastContext';
import { Card, Button, Badge, Tabs } from '@/components/ui';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
  FileBarChart, Download, FileText, Calendar,
  Package, Warehouse, Truck, TrendingUp, DollarSign
} from 'lucide-react';

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#22c55e', '#f59e0b', '#ef4444'];

type ReportType = 'overview' | 'stock' | 'movements' | 'suppliers';

export function ReportsPage() {
  const toast = useToast();
  const { 
    products, suppliers, movements, warehouses,
    getStockByWarehouse, getStockByProduct, getMovementsChart,
    getProductById, getWarehouseById
  } = useData();
  
  const [reportType, setReportType] = useState<ReportType>('overview');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [exporting, setExporting] = useState<'csv' | 'pdf' | null>(null);

  // Data para reportes
  const stockByWarehouse = useMemo(() => getStockByWarehouse(), [getStockByWarehouse]);
  const stockByProduct = useMemo(() => getStockByProduct(), [getStockByProduct]);
  const movementsChart = useMemo(() => getMovementsChart(30), [getMovementsChart]);

  const filteredMovements = useMemo(() => {
    if (!dateRange.start && !dateRange.end) return movements;
    
    return movements.filter(m => {
      const movDate = new Date(m.date);
      if (dateRange.start && movDate < new Date(dateRange.start)) return false;
      if (dateRange.end && movDate > new Date(dateRange.end + 'T23:59:59')) return false;
      return true;
    });
  }, [movements, dateRange]);

  const productsByCategory = useMemo(() => {
    const categories = [...new Set(products.map(p => p.category))];
    return categories.map(cat => ({
      name: cat,
      value: products.filter(p => p.category === cat).length
    }));
  }, [products]);

  const productsBySupplier = useMemo(() => {
    return suppliers.map(s => ({
      name: s.name.length > 15 ? s.name.substring(0, 15) + '...' : s.name,
      products: products.filter(p => p.supplierId === s.id).length,
    }));
  }, [suppliers, products]);

  // Total inventory value
  const totalValue = useMemo(() => {
    return products.reduce((total, product) => {
      const stock = stockByProduct.find(s => s.productId === product.id)?.totalStock || 0;
      return total + (product.price * stock);
    }, 0);
  }, [products, stockByProduct]);

  // Movement stats
  const movementStats = useMemo(() => {
    const entries = filteredMovements.filter(m => m.type === 'entrada');
    const exits = filteredMovements.filter(m => m.type === 'salida');
    const adjustments = filteredMovements.filter(m => m.type === 'ajuste');
    
    return {
      totalEntries: entries.reduce((sum, m) => sum + m.quantity, 0),
      totalExits: exits.reduce((sum, m) => sum + Math.abs(m.quantity), 0),
      totalAdjustments: adjustments.length,
      entriesCount: entries.length,
      exitsCount: exits.length,
    };
  }, [filteredMovements]);

  // Tabs configuration
  const tabs = [
    { id: 'overview', label: 'Resumen General', icon: <TrendingUp size={16} /> },
    { id: 'stock', label: 'Stock', icon: <Package size={16} /> },
    { id: 'movements', label: 'Movimientos', icon: <FileBarChart size={16} /> },
    { id: 'suppliers', label: 'Proveedores', icon: <Truck size={16} /> },
  ];

  // Exportar a CSV
  const exportToCSV = async () => {
    setExporting('csv');
    await new Promise(r => setTimeout(r, 500));

    let csvContent = '';
    let filename = '';

    switch (reportType) {
      case 'overview':
      case 'stock':
        csvContent = 'Producto,SKU,Categoría,Precio,Stock Actual,Stock Mínimo,Estado,Valor Total\n';
        stockByProduct.forEach(item => {
          const product = products.find(p => p.id === item.productId);
          if (product) {
            const status = item.totalStock < item.minStock ? 'Bajo' : 'Normal';
            const value = product.price * item.totalStock;
            csvContent += `"${item.productName}","${item.sku}","${product.category}",${product.price},${item.totalStock},${item.minStock},${status},${value.toFixed(2)}\n`;
          }
        });
        filename = 'reporte_stock.csv';
        break;

      case 'movements':
        csvContent = 'Fecha,Hora,Tipo,Producto,SKU,Almacén,Cantidad,Motivo\n';
        filteredMovements.slice(0, 500).forEach(m => {
          const product = getProductById(m.productId);
          const warehouse = getWarehouseById(m.warehouseId);
          csvContent += `"${format(new Date(m.date), 'dd/MM/yyyy')}","${format(new Date(m.date), 'HH:mm')}","${m.type}","${product?.name || 'N/A'}","${product?.sku || ''}","${warehouse?.name || 'N/A'}",${m.quantity},"${m.reason}"\n`;
        });
        filename = 'reporte_movimientos.csv';
        break;

      case 'suppliers':
        csvContent = 'Proveedor,Email,Teléfono,Dirección,Productos,Valor Total\n';
        suppliers.forEach(s => {
          const supplierProducts = products.filter(p => p.supplierId === s.id);
          const totalSupplierValue = supplierProducts.reduce((sum, p) => {
            const stock = stockByProduct.find(st => st.productId === p.id)?.totalStock || 0;
            return sum + (p.price * stock);
          }, 0);
          csvContent += `"${s.name}","${s.email}","${s.phone}","${s.address}",${supplierProducts.length},${totalSupplierValue.toFixed(2)}\n`;
        });
        filename = 'reporte_proveedores.csv';
        break;
    }

    // Descargar
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    toast.success('Reporte CSV descargado exitosamente');
    setExporting(null);
  };

  // Exportar a PDF
  const exportToPDF = async () => {
    setExporting('pdf');
    await new Promise(r => setTimeout(r, 500));

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(99, 102, 241);
    doc.rect(0, 0, pageWidth, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('InventoryPro', 14, 18);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Sistema de Gestión de Inventarios', 14, 25);
    doc.text('TechLogistics S.A.', 14, 31);

    // Report title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    const titles: Record<ReportType, string> = {
      overview: 'Reporte General de Inventario',
      stock: 'Reporte de Stock por Producto',
      movements: 'Reporte de Movimientos',
      suppliers: 'Reporte de Proveedores',
    };
    doc.text(titles[reportType], 14, 50);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Generado: ${format(new Date(), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}`, 14, 58);

    // Stats summary
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(14, 65, pageWidth - 28, 25, 3, 3, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.text(`Total Productos: ${products.length}`, 20, 75);
    doc.text(`Total Almacenes: ${warehouses.length}`, 70, 75);
    doc.text(`Total Proveedores: ${suppliers.length}`, 120, 75);
    doc.text(`Valor Inventario: $${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 20, 83);

    // Table data
    let tableData: string[][] = [];
    let tableHeaders: string[] = [];
    let startY = 100;

    switch (reportType) {
      case 'overview':
      case 'stock':
        tableHeaders = ['Producto', 'SKU', 'Categoría', 'Precio', 'Stock', 'Estado'];
        tableData = stockByProduct.slice(0, 30).map(item => {
          const product = products.find(p => p.id === item.productId);
          return [
            item.productName.substring(0, 25),
            item.sku,
            product?.category || 'N/A',
            `$${product?.price.toFixed(2) || '0.00'}`,
            item.totalStock.toString(),
            item.totalStock < item.minStock ? '⚠ Bajo' : '✓ OK'
          ];
        });
        break;

      case 'movements':
        tableHeaders = ['Fecha', 'Tipo', 'Producto', 'Almacén', 'Cantidad', 'Motivo'];
        tableData = filteredMovements.slice(0, 40).map(m => [
          format(new Date(m.date), 'dd/MM/yy HH:mm'),
          m.type.toUpperCase(),
          getProductById(m.productId)?.name.substring(0, 18) || 'N/A',
          getWarehouseById(m.warehouseId)?.name.substring(0, 15) || 'N/A',
          (m.type === 'entrada' ? '+' : m.type === 'salida' ? '-' : '') + m.quantity,
          m.reason.substring(0, 20)
        ]);
        break;

      case 'suppliers':
        tableHeaders = ['Proveedor', 'Email', 'Teléfono', 'Productos', 'Valor'];
        tableData = suppliers.map(s => {
          const supplierProducts = products.filter(p => p.supplierId === s.id);
          const totalSupplierValue = supplierProducts.reduce((sum, p) => {
            const stock = stockByProduct.find(st => st.productId === p.id)?.totalStock || 0;
            return sum + (p.price * stock);
          }, 0);
          return [
            s.name.substring(0, 22),
            s.email.substring(0, 25),
            s.phone,
            supplierProducts.length.toString(),
            `$${totalSupplierValue.toLocaleString('en-US', { minimumFractionDigits: 0 })}`
          ];
        });
        break;
    }

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      startY: startY,
      theme: 'striped',
      headStyles: { 
        fillColor: [99, 102, 241],
        fontSize: 9,
        fontStyle: 'bold'
      },
      bodyStyles: { fontSize: 8 },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      margin: { left: 14, right: 14 },
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Página ${i} de ${pageCount} | InventoryPro - Reporte generado automáticamente`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    doc.save(`inventorypro_${reportType}_${format(new Date(), 'yyyyMMdd')}.pdf`);
    toast.success('Reporte PDF descargado exitosamente');
    setExporting(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <FileBarChart size={28} className="text-indigo-600" />
            Reportes
          </h1>
          <p className="text-gray-500 mt-1">Genera y exporta reportes detallados de tu inventario</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="success"
            onClick={exportToCSV}
            loading={exporting === 'csv'}
            icon={<Download size={18} />}
          >
            Exportar CSV
          </Button>
          <Button
            variant="danger"
            onClick={exportToPDF}
            loading={exporting === 'pdf'}
            icon={<FileText size={18} />}
          >
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={reportType}
        onChange={(id) => setReportType(id as ReportType)}
      />

      {/* Date Filter for Movements */}
      {reportType === 'movements' && (
        <Card padding="sm">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={18} />
              <span className="font-medium">Filtrar por fecha:</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-gray-400">a</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {(dateRange.start || dateRange.end) && (
              <button
                onClick={() => setDateRange({ start: '', end: '' })}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </Card>
      )}

      {/* Overview Report */}
      {reportType === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Summary Cards */}
          <Card className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen Ejecutivo</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                <div className="flex items-center gap-2 text-indigo-600 mb-2">
                  <Package size={20} />
                  <span className="text-sm font-medium">Productos</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
                <div className="flex items-center gap-2 text-emerald-600 mb-2">
                  <DollarSign size={20} />
                  <span className="text-sm font-medium">Valor Total</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  ${(totalValue / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <Warehouse size={20} />
                  <span className="text-sm font-medium">Almacenes</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{warehouses.length}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl">
                <div className="flex items-center gap-2 text-amber-600 mb-2">
                  <Truck size={20} />
                  <span className="text-sm font-medium">Proveedores</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{suppliers.length}</p>
              </div>
            </div>
          </Card>

          {/* Stock by Warehouse */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock por Almacén</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stockByWarehouse} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis 
                  dataKey="warehouseName" 
                  type="category" 
                  width={100}
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => value.length > 12 ? value.substring(0, 12) + '...' : value}
                />
                <Tooltip />
                <Bar 
                  dataKey="totalStock" 
                  fill="url(#stockGradient)" 
                  radius={[0, 8, 8, 0]}
                  name="Stock"
                >
                  <defs>
                    <linearGradient id="stockGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Products by Category */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Productos por Categoría</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={productsByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {productsByCategory.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Stock Report */}
      {reportType === 'stock' && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalle de Stock por Producto</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Producto</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">SKU</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Categoría</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-700">Precio</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-700">Stock</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-700">Valor</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {stockByProduct.map(item => {
                  const product = products.find(p => p.id === item.productId);
                  const isLow = item.totalStock < item.minStock;
                  const value = (product?.price || 0) * item.totalStock;
                  return (
                    <tr key={item.productId} className={isLow ? 'bg-amber-50' : 'hover:bg-gray-50'}>
                      <td className="px-4 py-3 font-medium">{item.productName}</td>
                      <td className="px-4 py-3">
                        <code className="text-xs bg-gray-100 px-2 py-0.5 rounded">{item.sku}</code>
                      </td>
                      <td className="px-4 py-3">{product?.category}</td>
                      <td className="px-4 py-3 text-right">${product?.price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-bold">{item.totalStock}</td>
                      <td className="px-4 py-3 text-right text-emerald-600 font-medium">
                        ${value.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={isLow ? 'warning' : 'success'} dot>
                          {isLow ? 'Bajo' : 'Normal'}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Movements Report */}
      {reportType === 'movements' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card padding="sm">
              <p className="text-sm text-gray-500">Total Movimientos</p>
              <p className="text-2xl font-bold text-gray-900">{filteredMovements.length}</p>
            </Card>
            <Card padding="sm">
              <p className="text-sm text-gray-500">Entradas</p>
              <p className="text-2xl font-bold text-emerald-600">+{movementStats.totalEntries}</p>
            </Card>
            <Card padding="sm">
              <p className="text-sm text-gray-500">Salidas</p>
              <p className="text-2xl font-bold text-red-600">-{movementStats.totalExits}</p>
            </Card>
            <Card padding="sm">
              <p className="text-sm text-gray-500">Ajustes</p>
              <p className="text-2xl font-bold text-amber-600">{movementStats.totalAdjustments}</p>
            </Card>
          </div>

          {/* Chart */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia de Movimientos (30 días)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={movementsChart}>
                <defs>
                  <linearGradient id="colorEntradas2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSalidas2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => format(new Date(value), 'dd/MM')}
                  tick={{ fontSize: 11 }}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip 
                  labelFormatter={(value) => format(new Date(value), "EEEE d 'de' MMMM", { locale: es })}
                />
                <Area 
                  type="monotone" 
                  dataKey="entradas" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  fill="url(#colorEntradas2)"
                  name="Entradas"
                />
                <Area 
                  type="monotone" 
                  dataKey="salidas" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  fill="url(#colorSalidas2)"
                  name="Salidas"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Suppliers Report */}
      {reportType === 'suppliers' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Productos por Proveedor</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productsBySupplier}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="products" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="Productos" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalle de Proveedores</h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {suppliers.map(supplier => {
                const supplierProducts = products.filter(p => p.supplierId === supplier.id);
                const totalSupplierValue = supplierProducts.reduce((sum, p) => {
                  const stock = stockByProduct.find(st => st.productId === p.id)?.totalStock || 0;
                  return sum + (p.price * stock);
                }, 0);
                
                return (
                  <div key={supplier.id} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{supplier.name}</p>
                        <p className="text-sm text-gray-500">{supplier.email}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="purple">{supplierProducts.length} productos</Badge>
                        <p className="text-sm text-emerald-600 font-medium mt-1">
                          ${totalSupplierValue.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
