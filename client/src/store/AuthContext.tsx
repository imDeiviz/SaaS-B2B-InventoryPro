// ============================================
// CONTEXTO DE AUTENTICACIÓN - RBAC AVANZADO
// Con flujo First-Login y permisos dinámicos
// ============================================

import { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import { apiClient } from '../api/apiClient';
import { User, Role, Company, Permission } from '../types';
import { users, roles, companies, systemPermissions, getRoleById } from '../data/mockData';

// ============================================
// STATE & ACTIONS
// ============================================
interface AuthState {
  user: User | null;
  role: Role | null;
  company: Company | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  mustChangePassword: boolean;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; role: Role; company: Company } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'PASSWORD_CHANGED' }
  | { type: 'UPDATE_USER'; payload: User };

const initialState: AuthState = {
  user: null,
  role: null,
  company: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  mustChangePassword: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null };

    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        role: action.payload.role,
        company: action.payload.company,
        isAuthenticated: true,
        loading: false,
        error: null,
        mustChangePassword: action.payload.user.mustChangePassword,
      };

    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        role: null,
        company: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
        mustChangePassword: false,
      };

    case 'LOGOUT':
      return { ...initialState, loading: false };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    case 'PASSWORD_CHANGED':
      return {
        ...state,
        mustChangePassword: false,
        user: state.user ? { ...state.user, mustChangePassword: false } : null,
      };

    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
        role: getRoleById(action.payload.roleId) || state.role,
      };

    default:
      return state;
  }
}

// ============================================
// CONTEXT INTERFACE
// ============================================
interface AuthContextType extends AuthState {
  // Auth actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  updateCurrentUser: (updates: Partial<User>) => void;

  // Permission checks
  hasPermission: (permissionKey: string) => boolean;
  hasAnyPermission: (permissionKeys: string[]) => boolean;
  hasAllPermissions: (permissionKeys: string[]) => boolean;

  // Role checks
  isAdmin: boolean;
  canManageUsers: boolean;
  canManageRoles: boolean;
  canEditInventory: boolean;
  canViewReports: boolean;
  canExportReports: boolean;

  // System data
  allPermissions: Permission[];
  allRoles: Role[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// PROVIDER
// ============================================
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check stored session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('inventorypro_token');
      if (!token) {
        dispatch({ type: 'LOGOUT' });
        return;
      }

      try {
        const userData = await apiClient.get<any>('/auth/me');
        // Map _id and fetch role/company
        const mappedUser = { ...userData, id: userData._id || userData.id };

        // For simplicity, we'll use mock role/company for now if not in DB
        const role = roles.find(r => r.id === (mappedUser.role || 'role-admin')) || roles[0];
        const company = companies[0];

        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: mappedUser, role, company },
        });
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('inventorypro_token');
        dispatch({ type: 'LOGOUT' });
      }
    };

    checkAuth();
  }, []);

  // Login
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'AUTH_START' });

    try {
      const response = await apiClient.post<any>('/auth/login', { email, password });
      const { token, user } = response;

      const mappedUser = { ...user, id: user._id || user.id };
      const role = roles.find(r => r.id === (mappedUser.role || 'role-admin')) || roles[0];
      const company = companies[0];

      localStorage.setItem('inventorypro_token', token);

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: mappedUser, role, company },
      });

      return true;
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message || 'Error de autenticación' });
      return false;
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem('inventorypro_session');
    dispatch({ type: 'LOGOUT' });
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Change password
  const changePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!state.user) return false;

    await new Promise(resolve => setTimeout(resolve, 500));

    // Find user and verify current password
    const userIndex = users.findIndex(u => u.id === state.user?.id);
    if (userIndex === -1) return false;

    if (users[userIndex].password !== currentPassword) {
      return false;
    }

    // Update password (mock)
    users[userIndex].password = newPassword;
    users[userIndex].mustChangePassword = false;

    dispatch({ type: 'PASSWORD_CHANGED' });

    return true;
  }, [state.user]);

  // Update current user
  const updateCurrentUser = useCallback((updates: Partial<User>) => {
    if (!state.user) return;

    const userIndex = users.findIndex(u => u.id === state.user?.id);
    if (userIndex === -1) return;

    users[userIndex] = { ...users[userIndex], ...updates };
    dispatch({ type: 'UPDATE_USER', payload: users[userIndex] });
  }, [state.user]);

  // Permission check functions
  const hasPermission = useCallback((permissionKey: string): boolean => {
    if (!state.role) return false;
    return state.role.permissions.includes(permissionKey);
  }, [state.role]);

  const hasAnyPermission = useCallback((permissionKeys: string[]): boolean => {
    if (!state.role) return false;
    return permissionKeys.some(key => state.role!.permissions.includes(key));
  }, [state.role]);

  const hasAllPermissions = useCallback((permissionKeys: string[]): boolean => {
    if (!state.role) return false;
    return permissionKeys.every(key => state.role!.permissions.includes(key));
  }, [state.role]);

  // Computed permission flags
  const isAdmin = state.role?.id === 'role-admin';
  const canManageUsers = hasAnyPermission(['users_create', 'users_edit', 'users_delete']);
  const canManageRoles = hasPermission('roles_manage');
  const canEditInventory = hasAnyPermission(['inventory_create', 'inventory_edit', 'inventory_delete']);
  const canViewReports = hasPermission('reports_view');
  const canExportReports = hasPermission('reports_export');

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        clearError,
        changePassword,
        updateCurrentUser,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        isAdmin,
        canManageUsers,
        canManageRoles,
        canEditInventory,
        canViewReports,
        canExportReports,
        allPermissions: systemPermissions,
        allRoles: roles,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ============================================
// HOOK
// ============================================
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// ============================================
// ROLE MANAGEMENT HOOK
// ============================================
export function useRoleManagement() {
  const { isAdmin, canManageRoles } = useAuth();

  const updateRole = useCallback((roleId: string, updates: Partial<Role>): boolean => {
    if (!isAdmin && !canManageRoles) return false;

    const roleIndex = roles.findIndex(r => r.id === roleId);
    if (roleIndex === -1) return false;

    // Cannot modify system roles (Admin)
    if (roles[roleIndex].isSystem) return false;

    roles[roleIndex] = { ...roles[roleIndex], ...updates };
    return true;
  }, [isAdmin, canManageRoles]);

  const createRole = useCallback((roleData: Omit<Role, 'id' | 'createdAt' | 'isSystem'>): Role | null => {
    if (!isAdmin && !canManageRoles) return null;

    const newRole: Role = {
      ...roleData,
      id: `role-${Date.now()}`,
      isSystem: false,
      createdAt: new Date(),
    };

    roles.push(newRole);
    return newRole;
  }, [isAdmin, canManageRoles]);

  const deleteRole = useCallback((roleId: string): boolean => {
    if (!isAdmin && !canManageRoles) return false;

    const roleIndex = roles.findIndex(r => r.id === roleId);
    if (roleIndex === -1) return false;

    // Cannot delete system roles
    if (roles[roleIndex].isSystem) return false;

    // Check if any users have this role
    const usersWithRole = users.filter(u => u.roleId === roleId);
    if (usersWithRole.length > 0) return false;

    roles.splice(roleIndex, 1);
    return true;
  }, [isAdmin, canManageRoles]);

  return {
    roles,
    systemPermissions,
    updateRole,
    createRole,
    deleteRole,
  };
}
