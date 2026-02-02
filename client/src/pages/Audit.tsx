// ============================================
// PÁGINA DE AUDITORÍA - LOGS DEL SISTEMA
// Registro inmutable de actividades
// ============================================

import { useState, useMemo } from 'react';
import { useData } from '@/store/DataContext';
import { useAuth } from '@/store/AuthContext';
import { AuditAction, AuditEntity } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge, Button } from '@/components/ui';
import { useTheme } from '@/store/ThemeContext';
import {
  Shield, Search, Filter, Calendar, User, FileText,
  Package, Warehouse, Truck, Settings, LogIn, LogOut,
  Edit, Plus, Trash2, Download, Key, ArrowLeftRight, Clock,
  ChevronDown, ChevronUp
} from 'lucide-react';

export function AuditPage() {
  const { auditLogs, users } = useData();
  const { hasPermission } = useAuth();
  const { currentTheme } = useTheme();
  const colors = currentTheme.colors;
  
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState<AuditAction | 'all'>('all');
  const [entityFilter, setEntityFilter] = useState<AuditEntity | 'all'>('all');
  const [userFilter, setUserFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const canView = hasPermission('audit_view');

  if (!canView) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="text-center p-8">
          <Shield size={64} className="mx-auto mb-4" style={{ color: colors.text.disabled }} />
          <h2 className="text-xl font-semibold" style={{ color: colors.text.primary }}>Acceso Restringido</h2>
          <p style={{ color: colors.text.muted }}>No tienes permisos para ver los logs de auditoría.</p>
        </Card>
      </div>
    );
  }

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      // Action filter
      if (actionFilter !== 'all' && log.action !== actionFilter) return false;
      
      // Entity filter
      if (entityFilter !== 'all' && log.entity !== entityFilter) return false;
      
      // User filter
      if (userFilter !== 'all' && log.userId !== userFilter) return false;
      
      // Date range filter
      if (dateRange.start) {
        const logDate = new Date(log.timestamp);
        const startDate = new Date(dateRange.start);
        if (logDate < startDate) return false;
      }
      if (dateRange.end) {
        const logDate = new Date(log.timestamp);
        const endDate = new Date(dateRange.end + 'T23:59:59');
        if (logDate > endDate) return false;
      }
      
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        return log.entityName.toLowerCase().includes(searchLower) ||
               log.userName.toLowerCase().includes(searchLower) ||
               log.action.toLowerCase().includes(searchLower);
      }
      
      return true;
    });
  }, [auditLogs, actionFilter, entityFilter, userFilter, dateRange, search]);

  const paginatedLogs = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, page]);

  const totalPages = Math.ceil(filteredLogs.length / pageSize);

  const getActionIcon = (action: AuditAction) => {
    switch (action) {
      case 'create': return <Plus size={16} />;
      case 'update': return <Edit size={16} />;
      case 'delete': return <Trash2 size={16} />;
      case 'login': return <LogIn size={16} />;
      case 'logout': return <LogOut size={16} />;
      case 'password_change': return <Key size={16} />;
      case 'export': return <Download size={16} />;
      case 'movement_create': return <ArrowLeftRight size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const getActionColor = (action: AuditAction) => {
    switch (action) {
      case 'create': return colors.status.success;
      case 'update': return colors.status.info;
      case 'delete': return colors.status.danger;
      case 'login': return colors.brand.primary;
      case 'logout': return colors.text.muted;
      case 'password_change': return colors.status.warning;
      default: return colors.text.secondary;
    }
  };

  const getEntityIcon = (entity: AuditEntity) => {
    switch (entity) {
      case 'product': return <Package size={16} />;
      case 'warehouse': return <Warehouse size={16} />;
      case 'supplier': return <Truck size={16} />;
      case 'user': return <User size={16} />;
      case 'movement': return <ArrowLeftRight size={16} />;
      case 'company': return <Settings size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const getActionLabel = (action: AuditAction): string => {
    const labels: Record<AuditAction, string> = {
      create: 'Creación',
      update: 'Actualización',
      delete: 'Eliminación',
      login: 'Inicio de sesión',
      logout: 'Cierre de sesión',
      password_change: 'Cambio de contraseña',
      export: 'Exportación',
      import: 'Importación',
      role_change: 'Cambio de rol',
      permission_change: 'Cambio de permisos',
      stock_adjustment: 'Ajuste de stock',
      movement_create: 'Movimiento de inventario',
    };
    return labels[action] || action;
  };

  const getEntityLabel = (entity: AuditEntity): string => {
    const labels: Record<AuditEntity, string> = {
      user: 'Usuario',
      role: 'Rol',
      product: 'Producto',
      warehouse: 'Almacén',
      supplier: 'Proveedor',
      movement: 'Movimiento',
      company: 'Empresa',
      system: 'Sistema',
    };
    return labels[entity] || entity;
  };

  const stats = useMemo(() => ({
    total: auditLogs.length,
    today: auditLogs.filter(l => {
      const today = new Date().toISOString().split('T')[0];
      return new Date(l.timestamp).toISOString().split('T')[0] === today;
    }).length,
    logins: auditLogs.filter(l => l.action === 'login').length,
    changes: auditLogs.filter(l => ['create', 'update', 'delete'].includes(l.action)).length,
  }), [auditLogs]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3" style={{ color: colors.text.primary }}>
            <Shield size={28} style={{ color: colors.brand.primary }} />
            Auditoría del Sistema
          </h1>
          <p style={{ color: colors.text.secondary }}>
            Registro inmutable de todas las actividades del sistema
          </p>
        </div>
        <Button variant="outline" icon={<Download size={18} />}>
          Exportar Logs
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="sm">
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: colors.text.primary }}>{stats.total}</p>
            <p className="text-sm" style={{ color: colors.text.muted }}>Total Registros</p>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: colors.brand.primary }}>{stats.today}</p>
            <p className="text-sm" style={{ color: colors.text.muted }}>Hoy</p>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: colors.status.success }}>{stats.logins}</p>
            <p className="text-sm" style={{ color: colors.text.muted }}>Inicios de Sesión</p>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: colors.status.info }}>{stats.changes}</p>
            <p className="text-sm" style={{ color: colors.text.muted }}>Cambios</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} style={{ color: colors.text.muted }} />
            <input
              type="text"
              placeholder="Buscar por entidad, usuario o acción..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border focus:outline-none focus:ring-2"
              style={{
                backgroundColor: colors.bg.sunken,
                borderColor: colors.border.input,
                color: colors.text.primary,
              }}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={18} style={{ color: colors.text.muted }} />
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value as AuditAction | 'all')}
              className="px-3 py-2 rounded-xl border focus:outline-none text-sm"
              style={{
                backgroundColor: colors.bg.sunken,
                borderColor: colors.border.input,
                color: colors.text.primary,
              }}
            >
              <option value="all">Todas las acciones</option>
              <option value="create">Creación</option>
              <option value="update">Actualización</option>
              <option value="delete">Eliminación</option>
              <option value="login">Login</option>
              <option value="movement_create">Movimientos</option>
            </select>
          </div>
          
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value as AuditEntity | 'all')}
            className="px-3 py-2 rounded-xl border focus:outline-none text-sm"
            style={{
              backgroundColor: colors.bg.sunken,
              borderColor: colors.border.input,
              color: colors.text.primary,
            }}
          >
            <option value="all">Todas las entidades</option>
            <option value="product">Productos</option>
            <option value="warehouse">Almacenes</option>
            <option value="supplier">Proveedores</option>
            <option value="user">Usuarios</option>
            <option value="movement">Movimientos</option>
          </select>
          
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border focus:outline-none text-sm"
            style={{
              backgroundColor: colors.bg.sunken,
              borderColor: colors.border.input,
              color: colors.text.primary,
            }}
          >
            <option value="all">Todos los usuarios</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
          
          <div className="flex items-center gap-2">
            <Calendar size={18} style={{ color: colors.text.muted }} />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-3 py-2 rounded-xl border focus:outline-none text-sm"
              style={{
                backgroundColor: colors.bg.sunken,
                borderColor: colors.border.input,
                color: colors.text.primary,
              }}
            />
            <span style={{ color: colors.text.muted }}>a</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-3 py-2 rounded-xl border focus:outline-none text-sm"
              style={{
                backgroundColor: colors.bg.sunken,
                borderColor: colors.border.input,
                color: colors.text.primary,
              }}
            />
          </div>
        </div>
      </Card>

      {/* Logs List */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: colors.bg.sunken }}>
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold" style={{ color: colors.text.secondary }}>
                  Fecha/Hora
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold" style={{ color: colors.text.secondary }}>
                  Acción
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold" style={{ color: colors.text.secondary }}>
                  Entidad
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold" style={{ color: colors.text.secondary }}>
                  Usuario
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold" style={{ color: colors.text.secondary }}>
                  Detalles
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {paginatedLogs.map((log) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-t hover:bg-opacity-50 transition-colors"
                    style={{ borderColor: colors.border.light }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Clock size={14} style={{ color: colors.text.muted }} />
                        <div>
                          <p className="text-sm font-medium" style={{ color: colors.text.primary }}>
                            {format(new Date(log.timestamp), 'dd MMM yyyy', { locale: es })}
                          </p>
                          <p className="text-xs" style={{ color: colors.text.muted }}>
                            {format(new Date(log.timestamp), 'HH:mm:ss')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span style={{ color: getActionColor(log.action) }}>
                          {getActionIcon(log.action)}
                        </span>
                        <Badge 
                          variant={
                            log.action === 'create' ? 'success' :
                            log.action === 'update' ? 'info' :
                            log.action === 'delete' ? 'danger' :
                            log.action === 'login' ? 'purple' : 'default'
                          }
                          size="sm"
                        >
                          {getActionLabel(log.action)}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span style={{ color: colors.text.muted }}>
                          {getEntityIcon(log.entity)}
                        </span>
                        <div>
                          <p className="text-sm font-medium" style={{ color: colors.text.primary }}>
                            {getEntityLabel(log.entity)}
                          </p>
                          <p className="text-xs truncate max-w-[150px]" style={{ color: colors.text.muted }}>
                            {log.entityName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ 
                            background: `linear-gradient(135deg, ${colors.gradient.from}, ${colors.gradient.to})`,
                            color: colors.text.inverse
                          }}
                        >
                          {log.userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="text-sm" style={{ color: colors.text.primary }}>
                          {log.userName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                        className="flex items-center gap-1 text-sm px-3 py-1 rounded-lg transition-colors"
                        style={{ 
                          color: colors.brand.primary,
                          backgroundColor: expandedLog === log.id ? colors.brand.primaryLight : 'transparent'
                        }}
                      >
                        {expandedLog === log.id ? (
                          <>Ocultar <ChevronUp size={14} /></>
                        ) : (
                          <>Ver más <ChevronDown size={14} /></>
                        )}
                      </button>
                      
                      {expandedLog === log.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 p-3 rounded-lg text-xs"
                          style={{ backgroundColor: colors.bg.sunken }}
                        >
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span style={{ color: colors.text.muted }}>ID:</span>
                              <span className="ml-2 font-mono" style={{ color: colors.text.primary }}>{log.id}</span>
                            </div>
                            <div>
                              <span style={{ color: colors.text.muted }}>Entity ID:</span>
                              <span className="ml-2 font-mono" style={{ color: colors.text.primary }}>{log.entityId}</span>
                            </div>
                            {log.ipAddress && (
                              <div>
                                <span style={{ color: colors.text.muted }}>IP:</span>
                                <span className="ml-2" style={{ color: colors.text.primary }}>{log.ipAddress}</span>
                              </div>
                            )}
                            {log.changes && log.changes.length > 0 && (
                              <div className="col-span-2">
                                <span style={{ color: colors.text.muted }}>Cambios:</span>
                                <div className="mt-1 space-y-1">
                                  {log.changes.map((change, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                      <span className="font-medium" style={{ color: colors.text.secondary }}>{change.field}:</span>
                                      <span style={{ color: colors.status.danger }}>{String(change.oldValue)}</span>
                                      <span style={{ color: colors.text.muted }}>→</span>
                                      <span style={{ color: colors.status.success }}>{String(change.newValue)}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div 
            className="px-4 py-3 flex items-center justify-between border-t"
            style={{ borderColor: colors.border.light }}
          >
            <p className="text-sm" style={{ color: colors.text.muted }}>
              Mostrando {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, filteredLogs.length)} de {filteredLogs.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded-lg text-sm disabled:opacity-50"
                style={{ 
                  backgroundColor: colors.bg.sunken,
                  color: colors.text.primary
                }}
              >
                Anterior
              </button>
              <span className="text-sm" style={{ color: colors.text.secondary }}>
                Página {page} de {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 rounded-lg text-sm disabled:opacity-50"
                style={{ 
                  backgroundColor: colors.bg.sunken,
                  color: colors.text.primary
                }}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <Shield size={48} className="mx-auto mb-4" style={{ color: colors.text.disabled }} />
            <h3 className="text-lg font-medium" style={{ color: colors.text.primary }}>
              No hay registros
            </h3>
            <p style={{ color: colors.text.muted }}>
              No se encontraron logs con los filtros seleccionados
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
