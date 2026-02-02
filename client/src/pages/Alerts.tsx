// ============================================
// PÁGINA DE ALERTAS Y NOTIFICACIONES
// Centro de mensajes del sistema
// ============================================

import { useState, useMemo } from 'react';
import { useData } from '@/store/DataContext';
import { useAuth } from '@/store/AuthContext';
import { AlertType, AlertPriority } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button, Badge, Tabs } from '@/components/ui';
import { useTheme } from '@/store/ThemeContext';
import {
  Bell, Package, Settings, ArrowLeftRight,
  CheckCircle, XCircle, Eye, Filter, Clock, Search
} from 'lucide-react';

type TabId = 'all' | 'unread' | 'low_stock' | 'system' | 'movement';

export function AlertsPage() {
  const { alerts, markAlertAsRead, dismissAlert, resolveAlert } = useData();
  const { hasPermission } = useAuth();
  const { currentTheme } = useTheme();
  const colors = currentTheme.colors;
  
  const [activeTab, setActiveTab] = useState<TabId>('all');
  const [search, setSearch] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<AlertPriority | 'all'>('all');

  const canManage = hasPermission('alerts_manage');

  const tabs = [
    { id: 'all', label: 'Todas', icon: <Bell size={16} /> },
    { id: 'unread', label: 'Sin leer', icon: <Eye size={16} /> },
    { id: 'low_stock', label: 'Stock Bajo', icon: <Package size={16} /> },
    { id: 'system', label: 'Sistema', icon: <Settings size={16} /> },
    { id: 'movement', label: 'Movimientos', icon: <ArrowLeftRight size={16} /> },
  ];

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      // Tab filter
      if (activeTab === 'unread' && alert.status !== 'unread') return false;
      if (activeTab !== 'all' && activeTab !== 'unread' && alert.type !== activeTab) return false;
      
      // Priority filter
      if (selectedPriority !== 'all' && alert.priority !== selectedPriority) return false;
      
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        return alert.title.toLowerCase().includes(searchLower) ||
               alert.message.toLowerCase().includes(searchLower);
      }
      
      return true;
    });
  }, [alerts, activeTab, selectedPriority, search]);

  const stats = useMemo(() => ({
    total: alerts.length,
    unread: alerts.filter(a => a.status === 'unread').length,
    critical: alerts.filter(a => a.priority === 'critical' && a.status === 'unread').length,
    high: alerts.filter(a => a.priority === 'high' && a.status === 'unread').length,
  }), [alerts]);

  const getTypeIcon = (type: AlertType) => {
    switch (type) {
      case 'low_stock': return <Package size={20} />;
      case 'system': return <Settings size={20} />;
      case 'movement': return <ArrowLeftRight size={20} />;
      case 'pending_audit': return <Eye size={20} />;
      default: return <Bell size={20} />;
    }
  };

  const getPriorityStyles = (priority: AlertPriority) => {
    switch (priority) {
      case 'critical':
        return { bg: colors.status.dangerBg, border: colors.status.dangerBorder, text: colors.status.dangerText, icon: colors.status.danger };
      case 'high':
        return { bg: colors.status.warningBg, border: colors.status.warningBorder, text: colors.status.warningText, icon: colors.status.warning };
      case 'medium':
        return { bg: colors.status.infoBg, border: colors.status.infoBorder, text: colors.status.infoText, icon: colors.status.info };
      default:
        return { bg: colors.bg.sunken, border: colors.border.default, text: colors.text.secondary, icon: colors.text.muted };
    }
  };

  const markAllAsRead = () => {
    alerts.filter(a => a.status === 'unread').forEach(a => markAlertAsRead(a.id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3" style={{ color: colors.text.primary }}>
            <Bell size={28} style={{ color: colors.brand.primary }} />
            Centro de Alertas
          </h1>
          <p style={{ color: colors.text.secondary }}>
            Gestiona las notificaciones y alertas del sistema
          </p>
        </div>
        {stats.unread > 0 && canManage && (
          <Button onClick={markAllAsRead} variant="outline" icon={<CheckCircle size={18} />}>
            Marcar todas como leídas
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="sm">
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: colors.text.primary }}>{stats.total}</p>
            <p className="text-sm" style={{ color: colors.text.muted }}>Total</p>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: colors.brand.primary }}>{stats.unread}</p>
            <p className="text-sm" style={{ color: colors.text.muted }}>Sin leer</p>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: colors.status.danger }}>{stats.critical}</p>
            <p className="text-sm" style={{ color: colors.text.muted }}>Críticas</p>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: colors.status.warning }}>{stats.high}</p>
            <p className="text-sm" style={{ color: colors.text.muted }}>Alta prioridad</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={(id) => setActiveTab(id as TabId)} />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} style={{ color: colors.text.muted }} />
            <input
              type="text"
              placeholder="Buscar alertas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl border focus:outline-none focus:ring-2 w-64"
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
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as AlertPriority | 'all')}
              className="px-3 py-2 rounded-xl border focus:outline-none"
              style={{
                backgroundColor: colors.bg.sunken,
                borderColor: colors.border.input,
                color: colors.text.primary,
              }}
            >
              <option value="all">Todas las prioridades</option>
              <option value="critical">Crítica</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredAlerts.map((alert) => {
            const priorityStyles = getPriorityStyles(alert.priority);
            const isUnread = alert.status === 'unread';
            
            return (
              <motion.div
                key={alert.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card 
                  padding="sm"
                  className={`relative overflow-hidden ${isUnread ? 'ring-2 ring-indigo-500' : ''}`}
                >
                  {/* Priority indicator */}
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-1"
                    style={{ backgroundColor: priorityStyles.icon }}
                  />
                  
                  <div className="flex items-start gap-4 pl-4">
                    {/* Icon */}
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: priorityStyles.bg }}
                    >
                      <span style={{ color: priorityStyles.icon }}>
                        {getTypeIcon(alert.type)}
                      </span>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 
                            className={`font-medium ${isUnread ? 'font-semibold' : ''}`}
                            style={{ color: colors.text.primary }}
                          >
                            {alert.title}
                          </h3>
                          <p className="text-sm mt-1" style={{ color: colors.text.secondary }}>
                            {alert.message}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="flex items-center gap-1 text-xs" style={{ color: colors.text.muted }}>
                              <Clock size={12} />
                              {format(new Date(alert.createdAt), "dd MMM yyyy, HH:mm", { locale: es })}
                            </span>
                            <Badge 
                              variant={
                                alert.priority === 'critical' ? 'danger' :
                                alert.priority === 'high' ? 'warning' :
                                alert.priority === 'medium' ? 'info' : 'default'
                              }
                              size="sm"
                            >
                              {alert.priority === 'critical' ? 'Crítica' :
                               alert.priority === 'high' ? 'Alta' :
                               alert.priority === 'medium' ? 'Media' : 'Baja'}
                            </Badge>
                            {alert.status === 'resolved' && (
                              <Badge variant="success" size="sm">
                                <CheckCircle size={12} className="mr-1" />
                                Resuelta
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {/* Actions */}
                        {canManage && alert.status !== 'resolved' && (
                          <div className="flex items-center gap-1 shrink-0">
                            {isUnread && (
                              <button
                                onClick={() => markAlertAsRead(alert.id)}
                                className="p-2 rounded-lg transition-colors"
                                style={{ color: colors.text.muted }}
                                title="Marcar como leída"
                              >
                                <Eye size={16} />
                              </button>
                            )}
                            {alert.type === 'low_stock' && (
                              <button
                                onClick={() => resolveAlert(alert.id)}
                                className="p-2 rounded-lg transition-colors"
                                style={{ color: colors.status.success }}
                                title="Marcar como resuelta"
                              >
                                <CheckCircle size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => dismissAlert(alert.id)}
                              className="p-2 rounded-lg transition-colors"
                              style={{ color: colors.status.danger }}
                              title="Descartar"
                            >
                              <XCircle size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredAlerts.length === 0 && (
          <Card className="text-center py-12">
            <Bell size={48} className="mx-auto mb-4" style={{ color: colors.text.disabled }} />
            <h3 className="text-lg font-medium" style={{ color: colors.text.primary }}>
              No hay alertas
            </h3>
            <p style={{ color: colors.text.muted }}>
              {activeTab === 'unread' 
                ? 'No tienes alertas sin leer'
                : 'No se encontraron alertas con los filtros seleccionados'}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
