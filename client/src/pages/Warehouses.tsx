// ============================================
// PÁGINA DE GESTIÓN DE ALMACENES
// ============================================

import { useState, useMemo } from 'react';
import { useData } from '@/store/DataContext';
import { useAuth } from '@/store/AuthContext';
import { useToast } from '@/store/ToastContext';
import { Warehouse } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button, Input, Modal, Badge, ConfirmDialog, ProgressBar } from '@/components/ui';
import { Plus, Edit2, Trash2, Search, Warehouse as WarehouseIcon, MapPin, Users } from 'lucide-react';

export function WarehousesPage() {
  const { warehouses, users, addWarehouse, updateWarehouse, deleteWarehouse, getStockByWarehouse } = useData();
  const { hasPermission } = useAuth();
  const toast = useToast();
  
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Warehouse | null>(null);

  const canCreate = hasPermission('warehouses_manage');
  const canEdit = hasPermission('warehouses_manage');
  const canDelete = hasPermission('warehouses_manage');

  const stockByWarehouse = useMemo(() => getStockByWarehouse(), [getStockByWarehouse]);

  const filteredWarehouses = useMemo(() => {
    return warehouses.filter(w =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.address.toLowerCase().includes(search.toLowerCase()) ||
      w.city.toLowerCase().includes(search.toLowerCase())
    );
  }, [warehouses, search]);

  const getStock = (warehouseId: string) => {
    const stock = stockByWarehouse.find(s => s.warehouseId === warehouseId);
    return stock?.totalStock || 0;
  };

  const getCapacityPercentage = (warehouseId: string) => {
    const stock = stockByWarehouse.find(s => s.warehouseId === warehouseId);
    return stock?.percentage || 0;
  };

  const getResponsibles = (ids: string[]) => {
    return ids.map(id => users.find(u => u.id === id)?.name || 'Desconocido').join(', ');
  };

  const handleSave = (data: Omit<Warehouse, 'id' | 'createdAt'>) => {
    if (editingWarehouse) {
      updateWarehouse(editingWarehouse.id, data);
      toast.success('Almacén actualizado exitosamente');
    } else {
      addWarehouse(data);
      toast.success('Almacén creado exitosamente');
    }
    setIsModalOpen(false);
    setEditingWarehouse(null);
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      deleteWarehouse(deleteConfirm.id);
      toast.success('Almacén eliminado exitosamente');
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Almacenes</h1>
          <p className="text-gray-500">Gestiona tus ubicaciones de almacenamiento</p>
        </div>
        {canCreate && (
          <Button
            onClick={() => { setEditingWarehouse(null); setIsModalOpen(true); }}
            icon={<Plus size={18} />}
          >
            Nuevo Almacén
          </Button>
        )}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar por nombre, dirección o ciudad..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredWarehouses.map((warehouse) => {
            const percentage = getCapacityPercentage(warehouse.id);
            return (
              <motion.div
                key={warehouse.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card hover className="relative">
                  {!warehouse.isActive && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="default">Inactivo</Badge>
                    </div>
                  )}
                  
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <WarehouseIcon size={24} className="text-purple-600" />
                    </div>
                    {(canEdit || canDelete) && warehouse.isActive && (
                      <div className="flex gap-1">
                        {canEdit && (
                          <button
                            onClick={() => { setEditingWarehouse(warehouse); setIsModalOpen(true); }}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                          >
                            <Edit2 size={16} />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => setDeleteConfirm(warehouse)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-1">{warehouse.name}</h3>
                  <Badge variant="info" size="sm">{warehouse.code}</Badge>
                  
                  <div className="flex items-start gap-2 text-sm text-gray-500 mt-3 mb-2">
                    <MapPin size={16} className="mt-0.5 shrink-0" />
                    <span>{warehouse.address}, {warehouse.city}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Users size={16} />
                    <span className="truncate">{getResponsibles(warehouse.responsibleIds)}</span>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm text-gray-500">Stock actual</p>
                        <p className="text-2xl font-bold text-indigo-600">{getStock(warehouse.id).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Capacidad</p>
                        <p className="text-lg font-semibold text-gray-900">{warehouse.capacity.toLocaleString()}</p>
                      </div>
                    </div>

                    <ProgressBar 
                      value={percentage} 
                      variant={percentage > 80 ? 'danger' : percentage > 60 ? 'warning' : 'default'}
                      showLabel
                    />
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredWarehouses.length === 0 && (
        <Card className="text-center py-12">
          <WarehouseIcon size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No se encontraron almacenes</h3>
          <p className="text-gray-500">Intenta con otros términos de búsqueda</p>
        </Card>
      )}

      <WarehouseModal
        isOpen={isModalOpen}
        warehouse={editingWarehouse}
        users={users}
        onSave={handleSave}
        onClose={() => { setIsModalOpen(false); setEditingWarehouse(null); }}
      />

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Eliminar Almacén"
        message={`¿Estás seguro de eliminar "${deleteConfirm?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
}

interface WarehouseModalProps {
  isOpen: boolean;
  warehouse: Warehouse | null;
  users: { id: string; name: string }[];
  onSave: (data: Omit<Warehouse, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

function WarehouseModal({ isOpen, warehouse, users, onSave, onClose }: WarehouseModalProps) {
  const [formData, setFormData] = useState({
    name: warehouse?.name || '',
    code: warehouse?.code || '',
    address: warehouse?.address || '',
    city: warehouse?.city || '',
    capacity: warehouse?.capacity || 1000,
    responsibleIds: warehouse?.responsibleIds || [],
    companyId: 'comp-001',
    isActive: warehouse?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const toggleResponsible = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      responsibleIds: prev.responsibleIds.includes(userId)
        ? prev.responsibleIds.filter(id => id !== userId)
        : [...prev.responsibleIds, userId]
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={warehouse ? 'Editar Almacén' : 'Nuevo Almacén'}
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>{warehouse ? 'Guardar' : 'Crear'}</Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Nombre"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Almacén Central"
            required
          />
          <Input
            label="Código"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            placeholder="CDMX-001"
            required
          />
        </div>
        
        <Input
          label="Dirección"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Av. Principal 123"
          required
        />
        
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Ciudad"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="Ciudad de México"
            required
          />
          <Input
            label="Capacidad (unidades)"
            type="number"
            min="1"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Responsables</label>
          <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-xl p-3">
            {users.filter(u => u.id !== 'user-004' && u.id !== 'user-005').map(user => (
              <label key={user.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.responsibleIds.includes(user.id)}
                  onChange={() => toggleResponsible(user.id)}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">{user.name}</span>
              </label>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm text-gray-700">Almacén activo</span>
        </label>
      </form>
    </Modal>
  );
}
