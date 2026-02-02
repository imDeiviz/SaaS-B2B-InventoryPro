// ============================================
// PÁGINA DE GESTIÓN DE PROVEEDORES
// ============================================

import { useState, useMemo } from 'react';
import { useData } from '@/store/DataContext';
import { useAuth } from '@/store/AuthContext';
import { useToast } from '@/store/ToastContext';
import { Supplier } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button, Input, Modal, Badge, ConfirmDialog } from '@/components/ui';
import { Plus, Edit2, Trash2, Search, Truck, Mail, Phone, MapPin, FileText } from 'lucide-react';

export function SuppliersPage() {
  const { suppliers, products, addSupplier, updateSupplier, deleteSupplier } = useData();
  const { hasPermission } = useAuth();
  const toast = useToast();
  
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Supplier | null>(null);

  const canCreate = hasPermission('suppliers_manage');
  const canEdit = hasPermission('suppliers_manage');
  const canDelete = hasPermission('suppliers_manage');

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [suppliers, search]);

  const getProductCount = (supplierId: string) => {
    return products.filter(p => p.supplierId === supplierId).length;
  };

  const handleSave = (data: Omit<Supplier, 'id' | 'createdAt'>) => {
    if (editingSupplier) {
      updateSupplier(editingSupplier.id, data);
      toast.success('Proveedor actualizado exitosamente');
    } else {
      addSupplier(data);
      toast.success('Proveedor creado exitosamente');
    }
    setIsModalOpen(false);
    setEditingSupplier(null);
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      deleteSupplier(deleteConfirm.id);
      toast.success('Proveedor eliminado exitosamente');
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Proveedores</h1>
          <p className="text-gray-500">Gestiona tus proveedores y contactos</p>
        </div>
        {canCreate && (
          <Button
            onClick={() => { setEditingSupplier(null); setIsModalOpen(true); }}
            icon={<Plus size={18} />}
          >
            Nuevo Proveedor
          </Button>
        )}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredSuppliers.map((supplier) => (
            <motion.div
              key={supplier.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card hover className="relative">
                {!supplier.isActive && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="default">Inactivo</Badge>
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Truck size={24} className="text-blue-600" />
                  </div>
                  {(canEdit || canDelete) && supplier.isActive && (
                    <div className="flex gap-1">
                      {canEdit && (
                        <button
                          onClick={() => { setEditingSupplier(supplier); setIsModalOpen(true); }}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                        >
                          <Edit2 size={16} />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => setDeleteConfirm(supplier)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <h3 className="font-semibold text-gray-900 mb-3">{supplier.name}</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Mail size={16} />
                    <span className="truncate">{supplier.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Phone size={16} />
                    <span>{supplier.phone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-500">
                    <MapPin size={16} className="mt-0.5 shrink-0" />
                    <span className="line-clamp-2">{supplier.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <FileText size={16} />
                    <span>RFC: {supplier.taxId}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Badge variant="info">
                    {getProductCount(supplier.id)} productos
                  </Badge>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredSuppliers.length === 0 && (
        <Card className="text-center py-12">
          <Truck size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No se encontraron proveedores</h3>
          <p className="text-gray-500">Intenta con otros términos de búsqueda</p>
        </Card>
      )}

      <SupplierModal
        isOpen={isModalOpen}
        supplier={editingSupplier}
        onSave={handleSave}
        onClose={() => { setIsModalOpen(false); setEditingSupplier(null); }}
      />

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Eliminar Proveedor"
        message={`¿Estás seguro de eliminar "${deleteConfirm?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
}

interface SupplierModalProps {
  isOpen: boolean;
  supplier: Supplier | null;
  onSave: (data: Omit<Supplier, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

function SupplierModal({ isOpen, supplier, onSave, onClose }: SupplierModalProps) {
  const [formData, setFormData] = useState({
    name: supplier?.name || '',
    email: supplier?.email || '',
    phone: supplier?.phone || '',
    address: supplier?.address || '',
    taxId: supplier?.taxId || '',
    companyId: 'comp-001',
    isActive: supplier?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={supplier ? 'Editar Proveedor' : 'Nuevo Proveedor'}
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>{supplier ? 'Guardar' : 'Crear'}</Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Nombre del proveedor"
          required
        />
        
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="contacto@proveedor.com"
            required
          />
          <Input
            label="Teléfono"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+52 55 1234 5678"
            required
          />
        </div>
        
        <Input
          label="RFC / Tax ID"
          value={formData.taxId}
          onChange={(e) => setFormData({ ...formData, taxId: e.target.value.toUpperCase() })}
          placeholder="XXX000000XXX"
          required
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Dirección</label>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            rows={2}
            placeholder="Dirección completa"
            required
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm text-gray-700">Proveedor activo</span>
        </label>
      </form>
    </Modal>
  );
}
