import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import {
  HiOutlineHome,
  HiOutlineCube,
  HiOutlineOfficeBuilding,
  HiOutlineTruck,
  HiOutlineArrowsExpand,
  HiOutlineChartBar,
  HiOutlineUsers,
  HiOutlineShieldCheck,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineBell,
  HiOutlineUser,
  HiOutlineChevronDown,
  HiOutlineClipboardList,
} from 'react-icons/hi';
import { BrandIcon } from '@/components/ui';
import { useAuth } from '@/store/AuthContext';
import { useTheme } from '@/store/ThemeContext';

// ============================================
// NAVIGATION ITEMS
// ============================================

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: HiOutlineHome, permission: null },
  { name: 'Productos', href: '/products', icon: HiOutlineCube, permission: 'inventory_view' },
  { name: 'Almacenes', href: '/warehouses', icon: HiOutlineOfficeBuilding, permission: 'warehouses_view' },
  { name: 'Proveedores', href: '/suppliers', icon: HiOutlineTruck, permission: 'suppliers_view' },
  { name: 'Movimientos', href: '/movements', icon: HiOutlineArrowsExpand, permission: 'movements_view' },
  { name: 'Reportes', href: '/reports', icon: HiOutlineChartBar, permission: 'reports_view' },
];

const systemItems = [
  { name: 'Alertas', href: '/alerts', icon: HiOutlineBell, permission: 'alerts_view' },
  { name: 'Auditoría', href: '/audit', icon: HiOutlineClipboardList, permission: 'audit_view' },
];

const adminItems = [
  { name: 'Usuarios', href: '/users', icon: HiOutlineUsers, permission: 'users_view' },
  { name: 'Roles', href: '/roles', icon: HiOutlineShieldCheck, permission: 'roles_view' },
];

// ============================================
// LAYOUT COMPONENT
// ============================================

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, logout, hasPermission } = useAuth();
  const { currentTheme, companyName } = useTheme();

  const colors = currentTheme.colors;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredNavItems = navigationItems.filter(
    item => !item.permission || hasPermission(item.permission)
  );

  const filteredSystemItems = systemItems.filter(
    item => hasPermission(item.permission)
  );

  const filteredAdminItems = adminItems.filter(
    item => hasPermission(item.permission)
  );

  // ============================================
  // SIDEBAR COMPONENT
  // ============================================

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <motion.aside
      initial={mobile ? { x: -280 } : false}
      animate={mobile ? { x: 0 } : undefined}
      exit={mobile ? { x: -280 } : undefined}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className={`
        ${mobile ? 'fixed inset-y-0 left-0 z-50 w-72' : 'hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col'}
      `}
      style={{ backgroundColor: 'var(--color-bg-sidebar)' }}
    >
      {/* Logo Area */}
      <div className="flex h-16 items-center justify-between px-6 border-b"
        style={{ borderColor: 'var(--color-border)' }}>
        <Link to="/dashboard" className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand-gradient shadow-themed"
            style={{
              color: 'var(--color-text-inverse)'
            }}
          >
            <BrandIcon className="w-6 h-6" color="currentColor" size={24} />
          </div>
          <div>
            <h1 className="text-sm font-bold" style={{ color: 'var(--color-sidebar-text)' }}>
              {companyName}
            </h1>
            <p className="text-sm opacity-70" style={{ color: 'var(--color-sidebar-text)' }}>
              Gestión de Inventario
            </p>
          </div>
        </Link>

        {mobile && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg transition-colors"
            style={{ color: colors.sidebar.textMuted }}
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        <div className="mb-6">
          <p className="px-3 text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: colors.sidebar.textMuted }}>
            Principal
          </p>
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => mobile && setSidebarOpen(false)}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive ? "bg-brand-gradient shadow-themed text-white" : "text-muted hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </div>

        {filteredSystemItems.length > 0 && (
          <div className="pt-4 border-t" style={{ borderColor: colors.border.divider }}>
            <p className="px-3 text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: colors.sidebar.textMuted }}>
              Sistema
            </p>
            {filteredSystemItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => mobile && setSidebarOpen(false)}
                  className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                  style={isActive ? {
                    background: `linear-gradient(135deg, ${colors.gradient.from}, ${colors.gradient.to})`,
                    color: colors.text.inverse,
                    boxShadow: `0 4px 12px rgba(${colors.shadow.color}, 0.3)`,
                  } : {
                    color: colors.sidebar.textMuted,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = colors.bg.sidebarHover;
                      e.currentTarget.style.color = colors.sidebar.text;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = colors.sidebar.textMuted;
                    }
                  }}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        )}

        {filteredAdminItems.length > 0 && (
          <div className="pt-4 border-t" style={{ borderColor: colors.border.divider }}>
            <p className="px-3 text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: colors.sidebar.textMuted }}>
              Administración
            </p>
            {filteredAdminItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => mobile && setSidebarOpen(false)}
                  className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                  style={isActive ? {
                    background: `linear-gradient(135deg, ${colors.gradient.from}, ${colors.gradient.to})`,
                    color: colors.text.inverse,
                    boxShadow: `0 4px 12px rgba(${colors.shadow.color}, 0.3)`,
                  } : {
                    color: colors.sidebar.textMuted,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = colors.bg.sidebarHover;
                      e.currentTarget.style.color = colors.sidebar.text;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = colors.sidebar.textMuted;
                    }
                  }}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        )}

        {/* Settings Link */}
        <div className="pt-4 border-t" style={{ borderColor: colors.border.divider }}>
          <Link
            to="/settings"
            onClick={() => mobile && setSidebarOpen(false)}
            className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
            style={location.pathname === '/settings' ? {
              background: `linear-gradient(135deg, ${colors.gradient.from}, ${colors.gradient.to})`,
              color: colors.text.inverse,
              boxShadow: `0 4px 12px rgba(${colors.shadow.color}, 0.3)`,
            } : {
              color: colors.sidebar.textMuted,
            }}
          >
            <HiOutlineCog className="w-5 h-5 mr-3" />
            Configuración
          </Link>
        </div>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t" style={{ borderColor: colors.border.divider }}>
        <div className="flex items-center p-3 rounded-xl"
          style={{ backgroundColor: colors.bg.sidebarHover }}>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
            style={{
              background: `linear-gradient(135deg, ${colors.status.success}, ${colors.brand.accent})`,
              color: colors.text.inverse
            }}
          >
            {user?.name?.substring(0, 2).toUpperCase()}
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: colors.sidebar.text }}>
              {user?.name}
            </p>
            <p className="text-xs truncate" style={{ color: colors.sidebar.textMuted }}>
              {role?.name}
            </p>
          </div>
        </div>
      </div>
    </motion.aside>
  );

  // ============================================
  // MAIN LAYOUT
  // ============================================

  return (
    <div className={cn("min-h-screen", "bg-main")}>
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 lg:hidden"
            style={{ backgroundColor: colors.bg.overlay }}
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && <Sidebar mobile />}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Header */}
        <header
          className="sticky top-0 z-30 border-b backdrop-blur-xl"
          style={{
            backgroundColor: colors.bg.header,
            borderColor: colors.border.light,
            boxShadow: `0 1px 3px rgba(${colors.shadow.colorStrong}, 0.05)`
          }}
        >
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg transition-colors text-secondary"
            >
              <HiOutlineMenu className="w-6 h-6" />
            </button>

            {/* Page title - hidden on mobile */}
            <div className="hidden sm:block">
              <h2 className={cn("text-lg font-semibold", "text-primary")}>
                {navigationItems.find(item => item.href === location.pathname)?.name ||
                  systemItems.find(item => item.href === location.pathname)?.name ||
                  adminItems.find(item => item.href === location.pathname)?.name ||
                  (location.pathname === '/settings' ? 'Configuración' : 'Dashboard')}
              </h2>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <button
                className="relative p-2 rounded-xl transition-all duration-200 text-muted hover:bg-main hover:text-primary"
              >
                <HiOutlineBell className="w-5 h-5" />
                <span
                  className="absolute top-1 right-1 w-2 h-2 rounded-full"
                  style={{ backgroundColor: colors.status.danger }}
                />
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-xl transition-all duration-200"
                  style={{
                    backgroundColor: userMenuOpen ? 'var(--color-bg-hover)' : 'transparent',
                    borderColor: 'var(--color-border)'
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: `linear-gradient(135deg, ${colors.gradient.from}, ${colors.gradient.to})`,
                      color: colors.text.inverse
                    }}
                  >
                    {user?.name?.substring(0, 2).toUpperCase()}
                  </div>
                  <span className={cn("hidden sm:block text-sm font-medium", "text-primary")}>
                    {user?.name}
                  </span>
                  <HiOutlineChevronDown
                    className="hidden sm:block w-4 h-4 text-muted"
                  />
                </button>

                {/* Dropdown menu */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 rounded-xl shadow-lg border overflow-hidden"
                      style={{
                        backgroundColor: 'var(--color-bg-elevated)',
                        borderColor: 'var(--color-border)'
                      }}
                    >
                      <div className="p-3 border-b" style={{ borderColor: colors.border.light }}>
                        <p className={cn("text-sm font-medium", "text-primary")}>
                          {user?.name}
                        </p>
                        <p className={cn("text-xs", "text-muted")}>
                          {user?.email}
                        </p>
                      </div>
                      <div className="p-2">
                        <Link
                          to="/settings"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center px-3 py-2 rounded-lg text-sm transition-colors text-secondary hover:bg-main"
                        >
                          <HiOutlineUser className={cn("w-4 h-4 mr-3", "text-muted")} />
                          Mi Perfil
                        </Link>
                        <Link
                          to="/settings"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center px-3 py-2 rounded-lg text-sm transition-colors text-secondary hover:bg-main"
                        >
                          <HiOutlineCog className={cn("w-4 h-4 mr-3", "text-muted")} />
                          Configuración
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors"
                          style={{ color: colors.status.danger }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = colors.status.dangerBg;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <HiOutlineLogout className="w-4 h-4 mr-3" />
                          Cerrar Sesión
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="px-4 sm:px-6 lg:px-8 py-4 text-center border-t"
          style={{ borderColor: colors.border.light }}>
          <p className={cn("text-xs", "text-muted")}>
            © 2024 {companyName}. Sistema de Gestión de Inventarios v2.0
          </p>
        </footer>
      </div>
    </div>
  );
}
