// ============================================
// PÁGINA DE GESTIÓN DE ROLES - RBAC DINÁMICO
// Admin inmutable, demás roles editables
// ============================================

import { useState, useMemo } from 'react';
import { useData } from '@/store/DataContext';
import { useAuth } from '@/store/AuthContext';
import { useToast } from '@/store/ToastContext';
import { Role, Permission } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button, Input, Modal, Badge, ConfirmDialog } from '@/components/ui';
import { 
  Shield, Plus, Edit2, Trash2, Lock, Users, Search,
  Package, FileBarChart, Settings, Check, X, AlertTriangle
} from 'lucide-react';

// Permission categories with icons
const permissionCategories = [
  { key: 'inventory', label: 'Inventario', icon: <Package size={18} /> },
  { key: 'users', label: 'Usuarios', icon: <Users size={18} /> },
  { key: 'reports', label: 'Reportes', icon: <FileBarChart size={18} /> },
  { key: 'settings', label: 'Configuración', icon: <Settings size={18} /> },
];

export function RolesPage() {
  const { roles, users, addRole, updateRole, deleteRole } = useData();
  const { allPermissions, isAdmin } = useAuth();
  const toast = useToast();
  
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Role | null>(null);

  const filteredRoles = useMemo(() => {
    return roles.filter(r =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [roles, search]);

  const getUsersCount = (roleId: string) => {
    return users.filter(u => u.roleId === roleId).length;
  };

  const handleSave = (roleData: Omit<Role, 'id' | 'createdAt' | 'isSystem'>) => {
    if (editingRole) {
      const success = updateRole(editingRole.id, roleData);
      if (success) {
        toast.success('Rol actualizado exitosamente');
      } else {
        toast.error('No se puede modificar este rol');
      }
    } else {
      addRole({ ...roleData, isSystem: false });
      toast.success('Rol creado exitosamente');
    }
    setIsModalOpen(false);
    setEditingRole(null);
  };

  const handleDelete = () => {
    if (!deleteConfirm) return;
    
    const usersWithRole = getUsersCount(deleteConfirm.id);
    if (usersWithRole > 0) {
      toast.error(`No se puede eliminar. Hay ${usersWithRole} usuarios con este rol.`);
      setDeleteConfirm(null);
      return;
    }
    
    const success = deleteRole(deleteConfirm.id);
    if (success) {
      toast.success('Rol eliminado exitosamente');
    } else {
      toast.error('No se puede eliminar este rol');
    }
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Shield size={28} className="text-indigo-600" />
            Gestión de Roles
          </h1>
          <p className="text-gray-500 mt-1">
            Administra roles y permisos del sistema. El rol <span className="font-medium text-red-600">Administrador</span> es inmutable.
          </p>
        </div>
        {isAdmin && (
          <Button
            onClick={() => {
              setEditingRole(null);
              setIsModalOpen(true);
            }}
            icon={<Plus size={18} />}
          >
            Nuevo Rol
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar roles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        />
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredRoles.map((role) => (
            <motion.div
              key={role.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card 
                hover 
                className={`relative overflow-hidden ${
                  role.isSystem ? 'border-2 border-red-200' : ''
                }`}
              >
                {/* System role badge */}
                {role.isSystem && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="danger" dot>
                      <Lock size={12} className="mr-1" />
                      Inmutable
                    </Badge>
                  </div>
                )}

                {/* Role color indicator */}
                <div 
                  className="absolute top-0 left-0 w-1 h-full"
                  style={{ backgroundColor: role.color }}
                />

                <div className="pl-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${role.color}20` }}
                      >
                        <Shield size={24} style={{ color: role.color }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{role.name}</h3>
                        <p className="text-sm text-gray-500">
                          {getUsersCount(role.id)} usuarios
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {role.description}
                  </p>

                  {/* Permissions summary */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {permissionCategories.map(cat => {
                      const catPermissions = allPermissions.filter(p => p.category === cat.key);
                      const hasPermissions = catPermissions.some(p => role.permissions.includes(p.key));
                      
                      return (
                        <span
                          key={cat.key}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${
                            hasPermissions 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {cat.icon}
                          {cat.label}
                        </span>
                      );
                    })}
                  </div>

                  {/* Permissions count */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">
                      <span className="font-semibold text-gray-900">{role.permissions.length}</span>
                      {' '}de {allPermissions.length} permisos
                    </span>
                    
                    {!role.isSystem && isAdmin && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingRole(role);
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(role)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredRoles.length === 0 && (
        <Card className="text-center py-12">
          <Shield size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No hay roles</h3>
          <p className="text-gray-500">Crea un nuevo rol para comenzar</p>
        </Card>
      )}

      {/* Role Modal */}
      <RoleModal
        isOpen={isModalOpen}
        role={editingRole}
        permissions={allPermissions}
        onSave={handleSave}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRole(null);
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Eliminar Rol"
        message={`¿Estás seguro de eliminar el rol "${deleteConfirm?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
}

// ============================================
// ROLE MODAL WITH PERMISSION TOGGLES
// ============================================
interface RoleModalProps {
  isOpen: boolean;
  role: Role | null;
  permissions: Permission[];
  onSave: (data: Omit<Role, 'id' | 'createdAt' | 'isSystem'>) => void;
  onClose: () => void;
}

function RoleModal({ isOpen, role, permissions, onSave, onClose }: RoleModalProps) {
  const [formData, setFormData] = useState({
    name: role?.name || '',
    description: role?.description || '',
    permissions: role?.permissions || [],
    color: role?.color || '#6366f1',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeCategory, setActiveCategory] = useState('inventory');

  // Reset form when modal opens
  useState(() => {
    if (isOpen) {
      setFormData({
        name: role?.name || '',
        description: role?.description || '',
        permissions: role?.permissions || [],
        color: role?.color || '#6366f1',
      });
      setErrors({});
    }
  });

  const togglePermission = (permKey: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permKey)
        ? prev.permissions.filter(p => p !== permKey)
        : [...prev.permissions, permKey]
    }));
  };

  const toggleCategory = (category: string) => {
    const categoryPerms = permissions.filter(p => p.category === category).map(p => p.key);
    const hasAll = categoryPerms.every(p => formData.permissions.includes(p));
    
    setFormData(prev => ({
      ...prev,
      permissions: hasAll
        ? prev.permissions.filter(p => !categoryPerms.includes(p))
        : [...new Set([...prev.permissions, ...categoryPerms])]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
    if (formData.permissions.length === 0) newErrors.permissions = 'Selecciona al menos un permiso';
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    
    onSave(formData);
  };

  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e',
    '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6',
    '#a855f7', '#d946ef', '#ec4899', '#6b7280'
  ];

  const getCategoryPermissions = (category: string) => {
    return permissions.filter(p => p.category === category);
  };

  const getCategoryProgress = (category: string) => {
    const catPerms = getCategoryPermissions(category);
    const selected = catPerms.filter(p => formData.permissions.includes(p.key)).length;
    return { selected, total: catPerms.length };
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={role ? 'Editar Rol' : 'Nuevo Rol'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre del Rol"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: Supervisor"
            error={errors.name}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-lg transition-transform ${
                    formData.color === color ? 'scale-110 ring-2 ring-offset-2 ring-gray-400' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Descripción
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe las responsabilidades de este rol..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            rows={2}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Permissions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Permisos ({formData.permissions.length} seleccionados)
            </label>
            {errors.permissions && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertTriangle size={14} />
                {errors.permissions}
              </p>
            )}
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {permissionCategories.map(cat => {
              const progress = getCategoryProgress(cat.key);
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setActiveCategory(cat.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === cat.key
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.icon}
                  {cat.label}
                  <span className={`ml-1 px-1.5 py-0.5 rounded text-xs ${
                    progress.selected === progress.total && progress.total > 0
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {progress.selected}/{progress.total}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Category permissions */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">
                {permissionCategories.find(c => c.key === activeCategory)?.label}
              </span>
              <button
                type="button"
                onClick={() => toggleCategory(activeCategory)}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                {getCategoryProgress(activeCategory).selected === getCategoryProgress(activeCategory).total
                  ? 'Deseleccionar todos'
                  : 'Seleccionar todos'}
              </button>
            </div>

            <div className="space-y-2">
              {getCategoryPermissions(activeCategory).map(perm => {
                const isSelected = formData.permissions.includes(perm.key);
                return (
                  <motion.button
                    key={perm.id}
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => togglePermission(perm.key)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="text-left">
                      <p className={`font-medium ${isSelected ? 'text-indigo-700' : 'text-gray-900'}`}>
                        {perm.name}
                      </p>
                      <p className="text-sm text-gray-500">{perm.description}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}>
                      {isSelected ? (
                        <Check size={14} className="text-white" />
                      ) : (
                        <X size={14} className="text-gray-400" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">
            {role ? 'Guardar Cambios' : 'Crear Rol'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
