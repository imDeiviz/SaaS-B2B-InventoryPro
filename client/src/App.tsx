// ============================================
// APP PRINCIPAL - INVENTORYPRO SAAS B2B
// Con RBAC Avanzado y First-Login Flow
// ============================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/store/AuthContext';
import { DataProvider } from '@/store/DataContext';
import { ToastProvider } from '@/store/ToastContext';
import { ThemeProvider } from '@/store/ThemeContext';
import Layout from '@/components/layout/BaseLayout';
import { LoginPage } from '@/pages/Login';
import { ChangePasswordPage } from '@/pages/ChangePassword';
import { DashboardPage } from '@/pages/Dashboard';
import { ProductsPage } from '@/pages/Products';
import { WarehousesPage } from '@/pages/Warehouses';
import { SuppliersPage } from '@/pages/Suppliers';
import { MovementsPage } from '@/pages/Movements';
import { ReportsPage } from '@/pages/Reports';
import { UsersPage } from '@/pages/Users';
import { RolesPage } from '@/pages/Roles';
import { AlertsPage } from '@/pages/Alerts';
import { AuditPage } from '@/pages/Audit';
import Settings from '@/pages/Settings';
import { motion } from 'framer-motion';

// Loading Component
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl"
        >
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full" />
        </motion.div>
        <p className="text-indigo-200 font-medium">Cargando InventoryPro...</p>
      </motion.div>
    </div>
  );
}

// Protected Route Component
function ProtectedRoute({ children, permission }: { children: React.ReactNode; permission?: string }) {
  const { isAuthenticated, loading, hasPermission, mustChangePassword } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Must change password redirect is handled in Layout
  if (mustChangePassword) {
    return <Navigate to="/change-password" replace />;
  }

  // Check permission if specified
  if (permission && !hasPermission(permission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

// Public Route Component
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, mustChangePassword } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    if (mustChangePassword) {
      return <Navigate to="/change-password" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

// Force Password Change Route
function PasswordChangeRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// App Routes
function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* Force Password Change */}
      <Route
        path="/change-password"
        element={
          <PasswordChangeRoute>
            <ChangePasswordPage />
          </PasswordChangeRoute>
        }
      />

      {/* Protected routes with Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />

        <Route
          path="products"
          element={
            <ProtectedRoute permission="inventory_view">
              <ProductsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="warehouses"
          element={
            <ProtectedRoute permission="warehouses_manage">
              <WarehousesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="suppliers"
          element={
            <ProtectedRoute permission="suppliers_manage">
              <SuppliersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="movements"
          element={
            <ProtectedRoute permission="movements_view">
              <MovementsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="reports"
          element={
            <ProtectedRoute permission="reports_view">
              <ReportsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="users"
          element={
            <ProtectedRoute permission="users_view">
              <UsersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="roles"
          element={
            <ProtectedRoute permission="roles_manage">
              <RolesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="alerts"
          element={
            <ProtectedRoute permission="alerts_view">
              <AlertsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="audit"
          element={
            <ProtectedRoute permission="audit_view">
              <AuditPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

// Main App
export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <DataProvider>
            <ToastProvider>
              <AppRoutes />
            </ToastProvider>
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
