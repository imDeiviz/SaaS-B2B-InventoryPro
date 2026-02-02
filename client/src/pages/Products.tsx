// ============================================
// PÁGINA DE PRODUCTOS - PROFESIONAL
// ============================================

import { useState, useMemo } from 'react';
import { useData } from '@/store/DataContext';
import { useAuth } from '@/store/AuthContext';
import { useToast } from '@/store/ToastContext';
import { Product } from '@/types';
import { DataTable, Column } from '@/components/common/DataTable';
import { motion } from 'framer-motion';
import { Button, Modal, Input, Select, Badge, ConfirmDialog, Card } from '@/components/ui';
import { Plus, Edit2, Trash2, Package, AlertTriangle, DollarSign, Tag } from 'lucide-react';

export function ProductsPage() {
  const { products, suppliers, addProduct, updateProduct, deleteProduct, getStockByProduct } = useData();
  const { hasPermission } = useAuth();
  const toast = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);

  const canCreate = hasPermission('inventory_create');
  const canEdit = hasPermission('inventory_edit');
  const canDelete = hasPermission('inventory_delete');

  const stockByProduct = useMemo(() => getStockByProduct(), [getStockByProduct]);

  const getStock = (productId: string) => {
    return stockByProduct.find(s => s.productId === productId)?.totalStock || 0;
  };

  const isLowStock = (productId: string, minStock: number) => {
    return getStock(productId) < minStock;
  };

  const handleSave = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      toast.success('Producto actualizado exitosamente');
    } else {
      addProduct(productData);
      toast.success('Producto creado exitosamente');
    }
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      deleteProduct(deleteConfirm.id);
      toast.success('Producto eliminado exitosamente');
      setDeleteConfirm(null);
    }
  };

  const categories = [...new Set(products.map(p => p.category))];

  // Table columns
  const columns: Column<Product>[] = [
    {
      key: 'name',
      header: 'Producto',
      sortable: true,
      render: (product) => (
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center"
          >
            <Package size={18} className="text-indigo-600" />
          </motion.div>
          <div>
            <p className="font-medium text-gray-900">{product.name}</p>
            <p className="text-sm text-gray-500 truncate max-w-[200px]">{product.description}</p>
          </div>
        </div>
      )
    },
    {
      key: 'sku',
      header: 'SKU',
      sortable: true,
      render: (product) => (
        <code className="text-xs bg-gray-100 px-2.5 py-1 rounded-lg font-mono">
          {product.sku}
        </code>
      )
    },
    {
      key: 'category',
      header: 'Categoría',
      sortable: true,
      render: (product) => (
        <Badge variant="purple">
          <Tag size={12} className="mr-1" />
          {product.category}
        </Badge>
      )
    },
    {
      key: 'price',
      header: 'Precio',
      sortable: true,
      align: 'right',
      render: (product) => (
        <span className="font-semibold text-gray-900">
          ${product.price.toFixed(2)}
        </span>
      )
    },
    {
      key: 'stock',
      header: 'Stock',
      sortable: false,
      align: 'right',
      render: (product) => {
        const stock = getStock(product.id);
        const isLow = isLowStock(product.id, product.minStock);
        return (
          <div className="flex items-center justify-end gap-2">
            {isLow && <AlertTriangle size={16} className="text-amber-500" />}
            <span className={`font-bold ${isLow ? 'text-amber-600' : 'text-gray-900'}`}>
              {stock}
            </span>
            <span className="text-gray-400 text-sm">/ {product.minStock}</span>
          </div>
        );
      }
    },
  ];

  // Stats
  const totalValue = useMemo(() => {
    return products.reduce((total, product) => {
      const stock = getStock(product.id);
      return total + (product.price * stock);
    }, 0);
  }, [products, stockByProduct]);

  const lowStockCount = useMemo(() => {
    return stockByProduct.filter(p => p.totalStock < p.minStock).length;
  }, [stockByProduct]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-500">Gestiona tu catálogo de productos e inventario</p>
        </div>
        {canCreate && (
          <Button
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
            icon={<Plus size={18} />}
          >
            Nuevo Producto
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card padding="sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Package size={24} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Productos</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <DollarSign size={24} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Valor Total</p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <AlertTriangle size={24} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Stock Bajo</p>
              <p className="text-2xl font-bold text-amber-600">{lowStockCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Table */}
      <DataTable
        data={products}
        columns={columns}
        searchPlaceholder="Buscar por nombre, SKU o categoría..."
        searchFn={(item, search) => 
          item.name.toLowerCase().includes(search) ||
          item.sku.toLowerCase().includes(search) ||
          item.category.toLowerCase().includes(search)
        }
        emptyIcon={<Package size={32} />}
        emptyTitle="No hay productos"
        emptyDescription="Comienza agregando tu primer producto al catálogo"
        getId={(item) => item.id}
        actions={(product) => (
          <div className="flex items-center gap-1">
            {canEdit && (
              <button
                onClick={() => {
                  setEditingProduct(product);
                  setIsModalOpen(true);
                }}
                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                <Edit2 size={16} />
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => setDeleteConfirm(product)}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        )}
      />

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        product={editingProduct}
        suppliers={suppliers}
        categories={categories}
        onSave={handleSave}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Eliminar Producto"
        message={`¿Estás seguro de eliminar "${deleteConfirm?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
}

// Product Modal Component
interface ProductModalProps {
  isOpen: boolean;
  product: Product | null;
  suppliers: { id: string; name: string }[];
  categories: string[];
  onSave: (data: Omit<Product, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

function ProductModal({ isOpen, product, suppliers, categories, onSave, onClose }: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    sku: product?.sku || '',
    category: product?.category || categories[0] || 'General',
    description: product?.description || '',
    minStock: product?.minStock || 10,
    price: product?.price || 0,
    cost: product?.cost || 0,
    unit: product?.unit || 'pieza',
    supplierId: product?.supplierId || suppliers[0]?.id || '',
    companyId: 'comp-001',
    isActive: product?.isActive ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.sku.trim()) newErrors.sku = 'El SKU es requerido';
    if (formData.price <= 0) newErrors.price = 'El precio debe ser mayor a 0';
    if (formData.minStock < 0) newErrors.minStock = 'El stock mínimo no puede ser negativo';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  const supplierOptions = suppliers.map(s => ({ value: s.id, label: s.name }));
  const unitOptions = [
    { value: 'pieza', label: 'Pieza' },
    { value: 'kg', label: 'Kilogramo' },
    { value: 'lt', label: 'Litro' },
    { value: 'mt', label: 'Metro' },
    { value: 'caja', label: 'Caja' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Editar Producto' : 'Nuevo Producto'}
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            {product ? 'Guardar Cambios' : 'Crear Producto'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Nombre del Producto"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
              placeholder="Ej: Laptop Dell XPS 15"
            />
          </div>

          <Input
            label="SKU (Código)"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
            error={errors.sku}
            placeholder="Ej: LAP-DELL-001"
          />

          <Input
            label="Categoría"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="Ej: Electrónicos"
          />

          <Input
            label="Precio de Venta ($)"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            error={errors.price}
            leftIcon={<DollarSign size={16} />}
          />

          <Input
            label="Costo ($)"
            type="number"
            step="0.01"
            min="0"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
            leftIcon={<DollarSign size={16} />}
          />

          <Input
            label="Stock Mínimo"
            type="number"
            min="0"
            value={formData.minStock}
            onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
            error={errors.minStock}
            hint="Alerta cuando el stock esté por debajo"
          />

          <Select
            label="Unidad de Medida"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            options={unitOptions}
          />

          <div className="md:col-span-2">
            <Select
              label="Proveedor"
              value={formData.supplierId}
              onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
              options={supplierOptions}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              rows={3}
              placeholder="Descripción detallada del producto..."
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
