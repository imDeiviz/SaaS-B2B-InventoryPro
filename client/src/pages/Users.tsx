// ============================================
// PÁGINA DE GESTIÓN DE USUARIOS - RBAC
// ============================================

import { useState, useMemo } from 'react';
import { useData } from '@/store/DataContext';
import { useAuth } from '@/store/AuthContext';
import { useToast } from '@/store/ToastContext';
import { User } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button, Input, Modal, Badge, Select, ConfirmDialog } from '@/components/ui';
import { 
  Plus, Edit2, Trash2, Search, Users as UsersIcon, 
  Shield, Mail, Calendar, CheckCircle, XCircle, Key
} from 'lucide-react';

export function UsersPage() {
  const { users, roles, addUser, updateUser, deleteUser } = useData();
  const { user: currentUser, canManageUsers, isAdmin } = useAuth();
  const toast = useToast();
  
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<User | null>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);

  if (!canManageUsers) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="text-center p-8">
          <Shield size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Acceso Restringido</h2>
          <p className="text-gray-500 mt-2">No tienes permisos para gestionar usuarios.</p>
        </Card>
      </div>
    );
  }

  const filteredUsers = useMemo(() => {
    return users.filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  const getRoleInfo = (roleId: string) => {
    return roles.find(r => r.id === roleId);
  };

  const handleSave = (userData: Omit<User, 'id' | 'createdAt'>) => {
    if (editingUser) {
      updateUser(editingUser.id, userData);
      toast.success('Usuario actualizado exitosamente');
    } else {
      addUser(userData);
      toast.success('Usuario creado exitosamente');
    }
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleDelete = () => {
    if (!deleteConfirm) return;
    
    if (deleteConfirm.id === currentUser?.id) {
      toast.error('No puedes eliminar tu propio usuario');
      setDeleteConfirm(null);
      return;
    }
    
    deleteUser(deleteConfirm.id);
    toast.success('Usuario eliminado exitosamente');
    setDeleteConfirm(null);
  };

  const handleResetPassword = () => {
    if (!resetPasswordUser) return;
    
    updateUser(resetPasswordUser.id, { 
      password: 'temp123',
      mustChangePassword: true 
    });
    toast.success(`Contraseña restablecida. Nueva contraseña temporal: temp123`);
    setResetPasswordUser(null);
  };

  const toggleUserStatus = (user: User) => {
    if (user.id === currentUser?.id) {
      toast.error('No puedes desactivar tu propio usuario');
      return;
    }
    
    updateUser(user.id, { isActive: !user.isActive });
    toast.success(user.isActive ? 'Usuario desactivado' : 'Usuario activado');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <UsersIcon size={28} className="text-indigo-600" />
            Usuarios
          </h1>
          <p className="text-gray-500 mt-1">Gestiona los usuarios y sus roles en el sistema</p>
        </div>
        {isAdmin && (
          <Button
            onClick={() => {
              setEditingUser(null);
              setIsModalOpen(true);
            }}
            icon={<Plus size={18} />}
          >
            Nuevo Usuario
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            <p className="text-sm text-gray-500">Total Usuarios</p>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{users.filter(u => u.isActive).length}</p>
            <p className="text-sm text-gray-500">Activos</p>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-600">{users.filter(u => u.mustChangePassword).length}</p>
            <p className="text-sm text-gray-500">Pendientes</p>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">{roles.length}</p>
            <p className="text-sm text-gray-500">Roles</p>
          </div>
        </Card>
      </div>

      {/* Search */}
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

      {/* Users Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900">Usuario</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900">Rol</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900">Estado</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900">Último Acceso</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence>
                {filteredUsers.map((user) => {
                  const role = getRoleInfo(user.roleId);
                  const isCurrentUser = user.id === currentUser?.id;
                  
                  return (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`hover:bg-gray-50 transition-colors ${isCurrentUser ? 'bg-indigo-50' : ''}`}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                            style={{ backgroundColor: role?.color || '#6b7280' }}
                          >
                            {user.avatar || user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 flex items-center gap-2">
                              {user.name}
                              {isCurrentUser && (
                                <span className="text-xs text-indigo-600 font-normal">(Tú)</span>
                              )}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Mail size={12} />
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge 
                          variant={role?.id === 'role-admin' ? 'danger' : 'info'}
                          dot
                        >
                          {role?.name || 'Sin rol'}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1">
                          <Badge variant={user.isActive ? 'success' : 'default'}>
                            {user.isActive ? (
                              <><CheckCircle size={12} className="mr-1" /> Activo</>
                            ) : (
                              <><XCircle size={12} className="mr-1" /> Inactivo</>
                            )}
                          </Badge>
                          {user.mustChangePassword && (
                            <Badge variant="warning">
                              <Key size={12} className="mr-1" />
                              Cambio pendiente
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {user.lastLogin ? (
                          <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            {format(new Date(user.lastLogin), "dd MMM yyyy, HH:mm", { locale: es })}
                          </div>
                        ) : (
                          <span className="text-gray-400">Nunca</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => toggleUserStatus(user)}
                            disabled={isCurrentUser}
                            className={`p-2 rounded-lg transition-colors ${
                              user.isActive 
                                ? 'text-gray-500 hover:text-amber-600 hover:bg-amber-50'
                                : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                            } disabled:opacity-30 disabled:cursor-not-allowed`}
                            title={user.isActive ? 'Desactivar' : 'Activar'}
                          >
                            {user.isActive ? <XCircle size={16} /> : <CheckCircle size={16} />}
                          </button>
                          <button
                            onClick={() => setResetPasswordUser(user)}
                            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Restablecer contraseña"
                          >
                            <Key size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setEditingUser(user);
                              setIsModalOpen(true);
                            }}
                            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(user)}
                            disabled={isCurrentUser}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <UsersIcon size={48} className="mx-auto mb-4 opacity-50" />
            <p>No se encontraron usuarios</p>
          </div>
        )}
      </Card>

      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        user={editingUser}
        roles={roles}
        onSave={handleSave}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Eliminar Usuario"
        message={`¿Estás seguro de eliminar a "${deleteConfirm?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="danger"
      />

      {/* Reset Password Confirmation */}
      <ConfirmDialog
        isOpen={!!resetPasswordUser}
        onClose={() => setResetPasswordUser(null)}
        onConfirm={handleResetPassword}
        title="Restablecer Contraseña"
        message={`Se restablecerá la contraseña de "${resetPasswordUser?.name}" a una temporal. El usuario deberá cambiarla en su próximo inicio de sesión.`}
        confirmText="Restablecer"
        variant="warning"
      />
    </div>
  );
}

// ============================================
// USER MODAL
// ============================================
interface UserModalProps {
  isOpen: boolean;
  user: User | null;
  roles: { id: string; name: string; color: string }[];
  onSave: (data: Omit<User, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

function UserModal({ isOpen, user, roles, onSave, onClose }: UserModalProps) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    roleId: user?.roleId || roles[0]?.id || '',
    isActive: user?.isActive ?? true,
    mustChangePassword: user?.mustChangePassword ?? true,
    companyId: 'comp-001',
    avatar: user?.avatar || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.email.trim()) newErrors.email = 'El email es requerido';
    if (!user && !formData.password) newErrors.password = 'La contraseña es requerida';
    if (!formData.roleId) newErrors.roleId = 'Selecciona un rol';
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    
    const avatar = formData.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
    
    onSave({
      ...formData,
      avatar,
      password: formData.password || user?.password || 'temp123',
    });
  };

  const roleOptions = roles.map(r => ({ value: r.id, label: r.name }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? 'Editar Usuario' : 'Nuevo Usuario'}
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            {user ? 'Guardar Cambios' : 'Crear Usuario'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre Completo"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Juan Pérez"
          error={errors.name}
        />
        
        <Input
          label="Correo Electrónico"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="juan@empresa.com"
          error={errors.email}
        />
        
        <Input
          label={user ? "Nueva Contraseña (dejar vacío para mantener)" : "Contraseña"}
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="••••••••"
          error={errors.password}
        />
        
        <Select
          label="Rol"
          value={formData.roleId}
          onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
          options={roleOptions}
          error={errors.roleId}
        />

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Usuario activo</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.mustChangePassword}
              onChange={(e) => setFormData({ ...formData, mustChangePassword: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Forzar cambio de contraseña</span>
          </label>
        </div>
      </form>
    </Modal>
  );
}
