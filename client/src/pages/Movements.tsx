// ============================================
// PÁGINA DE MOVIMIENTOS DE INVENTARIO
// ============================================

import { useState, useMemo } from 'react';
import { useData } from '@/store/DataContext';
import { useAuth } from '@/store/AuthContext';
import { useToast } from '@/store/ToastContext';
import { MovementType } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button, Modal, Select, Input, Badge } from '@/components/ui';
import {
  Plus, Search, ArrowLeftRight, ArrowUpCircle, ArrowDownCircle, RefreshCw, Filter
} from 'lucide-react';

export function MovementsPage() {
  const { movements, products, warehouses, addMovement, getProductById, getWarehouseById, getUserById } = useData();
  const { user, hasPermission } = useAuth();
  const toast = useToast();
  
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<MovementType | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const canCreate = hasPermission('movements_create');

  const filteredMovements = useMemo(() => {
    return movements
      .filter(m => {
        const product = getProductById(m.productId);
        const warehouse = getWarehouseById(m.warehouseId);
        const matchesSearch = 
          product?.name.toLowerCase().includes(search.toLowerCase()) ||
          warehouse?.name.toLowerCase().includes(search.toLowerCase()) ||
          m.reason.toLowerCase().includes(search.toLowerCase());
        const matchesType = typeFilter === 'all' || m.type === typeFilter;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [movements, search, typeFilter, getProductById, getWarehouseById]);

  const getTypeIcon = (type: MovementType) => {
    switch (type) {
      case 'entrada': return <ArrowUpCircle size={18} className="text-green-500" />;
      case 'salida': return <ArrowDownCircle size={18} className="text-red-500" />;
      case 'ajuste': return <RefreshCw size={18} className="text-amber-500" />;
      case 'transferencia': return <ArrowLeftRight size={18} className="text-blue-500" />;
    }
  };

  const getTypeBadgeVariant = (type: MovementType): 'success' | 'danger' | 'warning' | 'info' => {
    switch (type) {
      case 'entrada': return 'success';
      case 'salida': return 'danger';
      case 'ajuste': return 'warning';
      case 'transferencia': return 'info';
    }
  };

  const handleSave = (data: { productId: string; warehouseId: string; type: MovementType; quantity: number; reason: string }) => {
    addMovement({
      ...data,
      userId: user?.id || '',
      date: new Date(),
      companyId: 'comp-001',
    });
    toast.success('Movimiento registrado exitosamente');
    setIsModalOpen(false);
  };

  // Stats
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayMovements = movements.filter(m => 
      new Date(m.date).toISOString().split('T')[0] === today
    );
    
    return {
      total: movements.length,
      today: todayMovements.length,
      entradas: todayMovements.filter(m => m.type === 'entrada').reduce((sum, m) => sum + m.quantity, 0),
      salidas: todayMovements.filter(m => m.type === 'salida').reduce((sum, m) => sum + Math.abs(m.quantity), 0),
    };
  }, [movements]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Movimientos</h1>
          <p className="text-gray-500">Historial de entradas, salidas y ajustes de inventario</p>
        </div>
        {canCreate && (
          <Button onClick={() => setIsModalOpen(true)} icon={<Plus size={18} />}>
            Nuevo Movimiento
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-500">Total Histórico</p>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">{stats.today}</p>
            <p className="text-sm text-gray-500">Hoy</p>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">+{stats.entradas}</p>
            <p className="text-sm text-gray-500">Entradas Hoy</p>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">-{stats.salidas}</p>
            <p className="text-sm text-gray-500">Salidas Hoy</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por producto, almacén o motivo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as MovementType | 'all')}
            className="px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="all">Todos los tipos</option>
            <option value="entrada">Entradas</option>
            <option value="salida">Salidas</option>
            <option value="ajuste">Ajustes</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900">Fecha</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900">Tipo</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900">Producto</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900">Almacén</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-gray-900">Cantidad</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900">Motivo</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900">Usuario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence>
                {filteredMovements.slice(0, 50).map((movement) => {
                  const product = getProductById(movement.productId);
                  const warehouse = getWarehouseById(movement.warehouseId);
                  const movUser = getUserById(movement.userId);
                  
                  return (
                    <motion.tr 
                      key={movement.id} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm">
                        <div className="font-medium text-gray-900">
                          {format(new Date(movement.date), 'dd MMM yyyy', { locale: es })}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {format(new Date(movement.date), 'HH:mm', { locale: es })}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={getTypeBadgeVariant(movement.type)}>
                          {getTypeIcon(movement.type)}
                          <span className="ml-1 capitalize">{movement.type}</span>
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{product?.name || 'N/A'}</div>
                        <div className="text-xs text-gray-500">{product?.sku}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{warehouse?.name || 'N/A'}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-bold ${
                          movement.type === 'entrada' ? 'text-green-600' : 
                          movement.type === 'salida' ? 'text-red-600' : 'text-amber-600'
                        }`}>
                          {movement.type === 'entrada' ? '+' : movement.type === 'salida' ? '-' : ''}
                          {Math.abs(movement.quantity)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-[200px] truncate">
                        {movement.reason}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-medium text-indigo-600">
                            {movUser?.name.charAt(0)}
                          </div>
                          <span className="text-sm text-gray-700">{movUser?.name.split(' ')[0]}</span>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {filteredMovements.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <ArrowLeftRight size={48} className="mx-auto mb-4 opacity-50" />
            <p>No se encontraron movimientos</p>
          </div>
        )}
        
        {filteredMovements.length > 50 && (
          <div className="px-4 py-3 bg-gray-50 border-t text-center text-sm text-gray-500">
            Mostrando 50 de {filteredMovements.length} movimientos
          </div>
        )}
      </Card>

      <MovementModal
        isOpen={isModalOpen}
        products={products}
        warehouses={warehouses}
        onSave={handleSave}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

interface MovementModalProps {
  isOpen: boolean;
  products: { id: string; name: string; sku: string }[];
  warehouses: { id: string; name: string }[];
  onSave: (data: { productId: string; warehouseId: string; type: MovementType; quantity: number; reason: string }) => void;
  onClose: () => void;
}

function MovementModal({ isOpen, products, warehouses, onSave, onClose }: MovementModalProps) {
  const [formData, setFormData] = useState({
    productId: products[0]?.id || '',
    warehouseId: warehouses[0]?.id || '',
    type: 'entrada' as MovementType,
    quantity: 1,
    reason: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.reason) {
      return;
    }
    onSave(formData);
  };

  const reasons: Record<string, string[]> = {
    entrada: ['Compra a proveedor', 'Devolución de cliente', 'Transferencia entrada', 'Producción', 'Otro'],
    salida: ['Venta a cliente', 'Transferencia salida', 'Producto dañado', 'Muestra', 'Otro'],
    ajuste: ['Inventario físico', 'Corrección de error', 'Ajuste por merma', 'Regularización', 'Otro'],
    transferencia: ['Reubicación', 'Balance de stock', 'Otro'],
  };

  const productOptions = products.map(p => ({ value: p.id, label: `${p.name} (${p.sku})` }));
  const warehouseOptions = warehouses.map(w => ({ value: w.id, label: w.name }));
  const reasonOptions = (reasons[formData.type] || []).map(r => ({ value: r, label: r }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nuevo Movimiento"
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>Registrar</Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Movimiento</label>
          <div className="grid grid-cols-3 gap-2">
            {(['entrada', 'salida', 'ajuste'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData({ ...formData, type, reason: '' })}
                className={`p-3 rounded-xl border-2 text-center transition-colors ${
                  formData.type === type
                    ? type === 'entrada' ? 'border-green-500 bg-green-50 text-green-700' :
                      type === 'salida' ? 'border-red-500 bg-red-50 text-red-700' :
                      'border-amber-500 bg-amber-50 text-amber-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-center mb-1">
                  {type === 'entrada' && <ArrowUpCircle size={24} />}
                  {type === 'salida' && <ArrowDownCircle size={24} />}
                  {type === 'ajuste' && <RefreshCw size={24} />}
                </div>
                <span className="text-sm font-medium capitalize">{type}</span>
              </button>
            ))}
          </div>
        </div>

        <Select
          label="Producto"
          value={formData.productId}
          onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
          options={productOptions}
        />

        <Select
          label="Almacén"
          value={formData.warehouseId}
          onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
          options={warehouseOptions}
        />

        <Input
          label="Cantidad"
          type="number"
          min="1"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
        />

        <Select
          label="Motivo"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          options={[{ value: '', label: 'Seleccionar motivo...' }, ...reasonOptions]}
        />
      </form>
    </Modal>
  );
}
