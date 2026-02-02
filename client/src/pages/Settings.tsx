// ============================================
// SETTINGS PAGE - MOBILE-FIRST CON THEMING
// ============================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineUser,
  HiOutlineLockClosed,
  HiOutlineColorSwatch,
  HiOutlineOfficeBuilding,
  HiOutlineCheck,
  HiOutlineRefresh,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineUpload,
} from 'react-icons/hi';
import { useAuth } from '@/store/AuthContext';
import { useTheme } from '@/store/ThemeContext';
import { useToast } from '@/store/ToastContext';
import { Badge, BrandIcon } from '@/components/ui';
import { allThemes, ThemePreset } from '@/config/themeConfig';

// ============================================
// TYPES
// ============================================

type TabId = 'profile' | 'appearance' | 'company';

interface Tab {
  id: TabId;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

const tabs: Tab[] = [
  { id: 'profile', name: 'Perfil', icon: HiOutlineUser },
  { id: 'appearance', name: 'Apariencia', icon: HiOutlineColorSwatch, adminOnly: true },
  { id: 'company', name: 'Empresa', icon: HiOutlineOfficeBuilding, adminOnly: true },
];

// ============================================
// COMPONENTS
// ============================================

const ThemePreview = ({ theme, customColors = {} }: { theme: ThemePreset, customColors?: any }) => {
  const p = customColors.primary || theme.colors.brand.primary;
  const s = customColors.secondary || theme.colors.brand.secondary;
  const bg = theme.colors.bg.main;
  const card = theme.colors.bg.card;
  const sidebar = theme.colors.bg.sidebar;
  const border = theme.colors.border.default;

  return (
    <div className="w-full h-28 rounded-xl overflow-hidden border flex mb-4 group-hover:shadow-md transition-all duration-300" style={{ backgroundColor: bg, borderColor: border }}>
      {/* Mini Sidebar */}
      <div className="w-1/4 h-full flex flex-col p-1.5 gap-1.5" style={{ backgroundColor: sidebar }}>
        <div className="w-full h-2 rounded-full bg-white/20" />
        <div className="w-1/2 h-1.5 rounded-full bg-white/40" />
        <div className="w-2/3 h-1.5 rounded-full bg-white/20" />
        <div className="mt-auto w-full h-3 rounded-lg flex items-center justify-center" style={{ backgroundColor: p }}>
          <div className="w-2/3 h-0.5 bg-white/50 rounded-full" />
        </div>
      </div>
      {/* Mini Main */}
      <div className="flex-1 p-2 flex flex-col gap-2">
        <div className="w-full h-4 rounded-lg flex items-center justify-between px-1.5" style={{ backgroundColor: card, border: `1px solid ${border}` }}>
          <div className="w-1/3 h-1.5 bg-slate-200 rounded-full" />
          <div className="w-3 h-3 rounded-full bg-slate-100 border flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p }} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="h-10 rounded-lg p-1.5 flex flex-col justify-end" style={{ backgroundColor: card, border: `1px solid ${border}` }}>
            <div className="w-full h-1 bg-slate-100 rounded-full mb-1" />
            <div className="w-1/2 h-2.5 rounded-lg" style={{ backgroundColor: p }} />
          </div>
          <div className="h-10 rounded-lg p-1.5 flex flex-col justify-end" style={{ backgroundColor: card, border: `1px solid ${border}` }}>
            <div className="w-full h-1 bg-slate-100 rounded-full mb-1" />
            <div className="w-1/2 h-2.5 rounded-lg" style={{ backgroundColor: s }} />
          </div>
        </div>
        <div className="w-full h-4 rounded-lg overflow-hidden" style={{ backgroundColor: card, border: `1px solid ${border}` }}>
          <div className="w-full h-full opacity-20" style={{ background: `linear-gradient(90deg, ${p}, ${s})` }} />
        </div>
      </div>
    </div>
  );
};

export default function Settings() {
  const [activeTab, setActiveTab] = useState<TabId>('profile');
  const { user, hasPermission, changePassword, updateCurrentUser } = useAuth();
  const {
    currentTheme,
    customColors,
    setTheme,
    updateCustomColor,
    resetCustomColors,
    companyName,
    updateCompanyName,
    saveSettings,
    colorPalette
  } = useTheme();
  const toast = useToast();

  const colors = currentTheme.colors;
  const isAdmin = hasPermission('company_edit');

  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Update form when user changes
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  // Filter tabs
  const visibleTabs = tabs.filter(tab => !tab.adminOnly || isAdmin);

  // Password strength calculator
  const getPasswordStrength = (password: string) => {
    if (!password) return { level: 0, text: '', color: colors.text.muted };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { level: strength, text: 'Débil', color: colors.status.danger };
    if (strength <= 3) return { level: strength, text: 'Media', color: colors.status.warning };
    return { level: strength, text: 'Fuerte', color: colors.status.success };
  };

  const passwordStrength = getPasswordStrength(passwordForm.newPassword);

  // Save profile
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      updateCurrentUser({
        name: profileForm.name,
        email: profileForm.email,
      });
      toast.success('Perfil actualizado correctamente');
    } catch {
      toast.error('Error al actualizar el perfil');
    } finally {
      setIsSaving(false);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    // Validations
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setIsSaving(true);
    try {
      const success = await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      if (success) {
        toast.success('Contraseña actualizada correctamente');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error('Contraseña actual incorrecta');
      }
    } catch {
      toast.error('Error al cambiar la contraseña');
    } finally {
      setIsSaving(false);
    }
  };

  // Save theme settings
  const handleSaveTheme = async () => {
    setIsSaving(true);
    try {
      await saveSettings();
      toast.success('Configuración de tema guardada');
      setHasChanges(false);
    } catch {
      toast.error('Error al guardar la configuración');
    } finally {
      setIsSaving(false);
    }
  };

  // Theme card renderer
  const renderThemeCard = (theme: ThemePreset) => {
    const isSelected = currentTheme.id === theme.id;

    return (
      <motion.button
        key={theme.id}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          setTheme(theme.id);
          setHasChanges(true);
        }}
        className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 w-full`}
        style={{
          backgroundColor: theme.colors.bg.elevated,
          borderColor: isSelected ? theme.colors.brand.primary : theme.colors.border.default,
          boxShadow: isSelected ? `0 0 0 3px ${theme.colors.brand.primary}30` : 'none',
        }}
      >
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: theme.colors.brand.primary }}
          >
            <HiOutlineCheck className="w-4 h-4" style={{ color: theme.colors.text.inverse }} />
          </motion.div>
        )}

        <ThemePreview theme={theme} />

        <div className="flex items-center space-x-2 mb-1">
          <span className="text-lg">{theme.icon}</span>
          <span className="font-semibold" style={{ color: theme.colors.text.primary }}>
            {theme.name}
          </span>
        </div>
        <p className="text-xs line-clamp-2" style={{ color: theme.colors.text.muted }}>
          {theme.description}
        </p>
      </motion.button>
    );
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
          Configuración
        </h1>
        <p style={{ color: colors.text.secondary }}>
          Gestiona tu perfil, preferencias y configuración de la empresa
        </p>
      </div>

      {/* Tabs - Mobile scrollable */}
      <div
        className="flex space-x-1 p-1 rounded-xl overflow-x-auto hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{ backgroundColor: colors.bg.sunken }}
      >
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0"
            style={activeTab === tab.id ? {
              backgroundColor: colors.bg.elevated,
              color: colors.text.primary,
              boxShadow: `0 2px 8px rgba(${colors.shadow.color}, 0.15)`,
            } : {
              color: colors.text.muted,
            }}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* ============================================
              PROFILE TAB
              ============================================ */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Profile Info Card */}
              <div
                className="p-6 rounded-xl border"
                style={{ backgroundColor: colors.bg.elevated, borderColor: colors.border.default }}
              >
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2" style={{ color: colors.text.primary }}>
                  <HiOutlineUser className="w-5 h-5" style={{ color: colors.brand.primary }} />
                  Información Personal
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.bg.input,
                        borderColor: colors.border.input,
                        color: colors.text.primary,
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.bg.input,
                        borderColor: colors.border.input,
                        color: colors.text.primary,
                      }}
                    />
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                    style={{
                      background: `linear-gradient(135deg, ${colors.gradient.from}, ${colors.gradient.to})`,
                      color: colors.text.inverse,
                      boxShadow: `0 4px 12px rgba(${colors.shadow.color}, 0.3)`,
                    }}
                  >
                    {isSaving ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <HiOutlineCheck className="w-4 h-4" />
                        <span>Guardar Cambios</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Change Password Card */}
              <div
                className="p-6 rounded-xl border"
                style={{ backgroundColor: colors.bg.elevated, borderColor: colors.border.default }}
              >
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2" style={{ color: colors.text.primary }}>
                  <HiOutlineLockClosed className="w-5 h-5" style={{ color: colors.brand.primary }} />
                  Cambiar Contraseña
                </h3>

                <div className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>
                      Contraseña actual
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        className="w-full px-4 py-2.5 pr-12 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: colors.bg.input,
                          borderColor: colors.border.input,
                          color: colors.text.primary,
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                        style={{ color: colors.text.muted }}
                      >
                        {showPasswords.current ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>
                      Nueva contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="w-full px-4 py-2.5 pr-12 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: colors.bg.input,
                          borderColor: colors.border.input,
                          color: colors.text.primary,
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                        style={{ color: colors.text.muted }}
                      >
                        {showPasswords.new ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* Strength indicator */}
                    {passwordForm.newPassword && (
                      <div className="mt-2">
                        <div className="flex space-x-1 mb-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className="h-1.5 flex-1 rounded-full transition-all"
                              style={{
                                backgroundColor: level <= passwordStrength.level
                                  ? passwordStrength.color
                                  : colors.border.default
                              }}
                            />
                          ))}
                        </div>
                        <p className="text-xs font-medium" style={{ color: passwordStrength.color }}>
                          Fortaleza: {passwordStrength.text}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>
                      Confirmar contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className="w-full px-4 py-2.5 pr-12 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: colors.bg.input,
                          borderColor: passwordForm.confirmPassword && passwordForm.confirmPassword !== passwordForm.newPassword
                            ? colors.status.danger
                            : colors.border.input,
                          color: colors.text.primary,
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                        style={{ color: colors.text.muted }}
                      >
                        {showPasswords.confirm ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                      </button>
                    </div>
                    {passwordForm.confirmPassword && passwordForm.confirmPassword !== passwordForm.newPassword && (
                      <p className="text-xs mt-1" style={{ color: colors.status.danger }}>
                        Las contraseñas no coinciden
                      </p>
                    )}
                  </div>

                  {/* Requirements */}
                  <div className="p-3 rounded-lg text-xs space-y-1" style={{ backgroundColor: colors.bg.sunken }}>
                    <p className="font-medium" style={{ color: colors.text.secondary }}>Requisitos:</p>
                    <ul className="space-y-0.5" style={{ color: colors.text.muted }}>
                      <li style={{ color: passwordForm.newPassword.length >= 8 ? colors.status.success : undefined }}>
                        • Mínimo 8 caracteres
                      </li>
                      <li style={{ color: /[A-Z]/.test(passwordForm.newPassword) ? colors.status.success : undefined }}>
                        • Al menos una mayúscula
                      </li>
                      <li style={{ color: /[a-z]/.test(passwordForm.newPassword) ? colors.status.success : undefined }}>
                        • Al menos una minúscula
                      </li>
                      <li style={{ color: /[0-9]/.test(passwordForm.newPassword) ? colors.status.success : undefined }}>
                        • Al menos un número
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={handleChangePassword}
                    disabled={!passwordForm.currentPassword || !passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword || isSaving}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
                    style={{
                      backgroundColor: colors.bg.hover,
                      color: colors.text.primary,
                    }}
                  >
                    Actualizar Contraseña
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================
              APPEARANCE TAB
              ============================================ */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div
                className="p-6 rounded-xl border"
                style={{ backgroundColor: colors.bg.elevated, borderColor: colors.border.default }}
              >
                <div className="flex items-center space-x-2 mb-4">
                  <HiOutlineColorSwatch className="w-5 h-5" style={{ color: colors.brand.primary }} />
                  <h3 className="text-lg font-semibold" style={{ color: colors.text.primary }}>
                    Seleccionar Tema
                  </h3>
                </div>
                <p className="text-sm mb-6" style={{ color: colors.text.muted }}>
                  Elige una combinación de colores que se adapte a tu estilo preferido.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allThemes.map(renderThemeCard)}
                </div>
              </div>

              {/* Color Customization */}
              <div
                className="p-6 rounded-xl border"
                style={{ backgroundColor: colors.bg.elevated, borderColor: colors.border.default }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold" style={{ color: colors.text.primary }}>
                    Personalización de Colores
                  </h3>
                  <button
                    onClick={() => {
                      resetCustomColors();
                      setHasChanges(true);
                    }}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm transition-colors"
                    style={{ color: colors.text.muted, backgroundColor: colors.bg.hover }}
                  >
                    <HiOutlineRefresh className="w-4 h-4" />
                    <span>Restaurar</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Primary Color */}
                  <div>
                    <label className="block text-sm font-medium mb-3" style={{ color: colors.text.secondary }}>
                      Color Primario
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {colorPalette.slice(0, 10).map((color) => (
                        <button
                          key={color}
                          onClick={() => {
                            updateCustomColor('primary', color);
                            setHasChanges(true);
                          }}
                          className={`w-8 h-8 rounded-lg transition-transform hover:scale-110 ${(customColors.primary || colors.brand.primary) === color ? 'ring-2 ring-offset-2' : ''
                            }`}
                          style={{
                            backgroundColor: color,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          }}
                        />
                      ))}
                    </div>
                    <input
                      type="color"
                      value={customColors.primary || colors.brand.primary}
                      onChange={(e) => {
                        updateCustomColor('primary', e.target.value);
                        setHasChanges(true);
                      }}
                      className="w-full h-10 rounded-lg cursor-pointer border-0"
                    />
                  </div>

                  {/* Secondary Color */}
                  <div>
                    <label className="block text-sm font-medium mb-3" style={{ color: colors.text.secondary }}>
                      Color Secundario
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {colorPalette.slice(10, 20).map((color) => (
                        <button
                          key={color}
                          onClick={() => {
                            updateCustomColor('secondary', color);
                            setHasChanges(true);
                          }}
                          className={`w-8 h-8 rounded-lg transition-transform hover:scale-110 ${(customColors.secondary || colors.brand.secondary) === color ? 'ring-2 ring-offset-2' : ''
                            }`}
                          style={{
                            backgroundColor: color,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          }}
                        />
                      ))}
                    </div>
                    <input
                      type="color"
                      value={customColors.secondary || colors.brand.secondary}
                      onChange={(e) => {
                        updateCustomColor('secondary', e.target.value);
                        setHasChanges(true);
                      }}
                      className="w-full h-10 rounded-lg cursor-pointer border-0"
                    />
                  </div>

                  {/* Accent Color */}
                  <div>
                    <label className="block text-sm font-medium mb-3" style={{ color: colors.text.secondary }}>
                      Color de Acento
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {colorPalette.slice(0, 10).map((color) => (
                        <button
                          key={color}
                          onClick={() => {
                            updateCustomColor('accent', color);
                            setHasChanges(true);
                          }}
                          className={`w-8 h-8 rounded-lg transition-transform hover:scale-110 ${(customColors.accent || colors.brand.accent) === color ? 'ring-2 ring-offset-2' : ''
                            }`}
                          style={{
                            backgroundColor: color,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          }}
                        />
                      ))}
                    </div>
                    <input
                      type="color"
                      value={customColors.accent || colors.brand.accent}
                      onChange={(e) => {
                        updateCustomColor('accent', e.target.value);
                        setHasChanges(true);
                      }}
                      className="w-full h-10 rounded-lg cursor-pointer border-0"
                    />
                  </div>
                </div>

                {/* Enhanced Preview Section */}
                <div className="mt-8 pt-8 border-t" style={{ borderColor: colors.border.divider }}>
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-sm font-semibold uppercase tracking-wider" style={{ color: colors.text.muted }}>
                      Vista Previa de Personalización
                    </h4>
                    <Badge variant="info">Modo en vivo</Badge>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Visual Interface Preview */}
                    <div className="space-y-4">
                      <p className="text-xs font-medium" style={{ color: colors.text.secondary }}>Interfaz del Sistema:</p>
                      <div className="scale-110 origin-top-left transform transition-all">
                        <ThemePreview theme={currentTheme} customColors={customColors} />
                      </div>
                    </div>

                    {/* Component Elements Preview */}
                    <div className="space-y-6">
                      <p className="text-xs font-medium" style={{ color: colors.text.secondary }}>Elementos de Acción:</p>
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap gap-3">
                          <button
                            className="px-6 py-2.5 rounded-xl font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
                            style={{
                              background: `linear-gradient(135deg, ${customColors.primary || colors.gradient.from}, ${customColors.secondary || colors.gradient.to})`,
                              color: colors.text.inverse,
                              boxShadow: `0 4px 15px rgba(${customColors.primary ? '0,0,0' : colors.shadow.color}, 0.3)`,
                            }}
                          >
                            Botón Principal
                          </button>
                          <button
                            className="px-6 py-2.5 rounded-xl font-bold border-2 transition-all hover:bg-slate-50"
                            style={{
                              borderColor: customColors.primary || colors.brand.primary,
                              color: customColors.primary || colors.brand.primary,
                            }}
                          >
                            Outline
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                            style={{ background: `linear-gradient(135deg, ${customColors.primary || colors.gradient.from}, ${customColors.secondary || colors.gradient.to})` }}>
                            <BrandIcon className="w-6 h-6" color="currentColor" size={24} />
                          </div>
                          <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: '75%' }}
                              className="h-full rounded-full shadow-sm"
                              style={{ background: `linear-gradient(90deg, ${customColors.primary || colors.gradient.from}, ${customColors.secondary || colors.gradient.to})` }}
                            />
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <span className="px-3 py-1 rounded-lg text-xs font-bold"
                            style={{ backgroundColor: colors.status.successBg, color: colors.status.successText }}>
                            ÉXITO
                          </span>
                          <span className="px-3 py-1 rounded-lg text-xs font-bold text-white"
                            style={{ backgroundColor: customColors.accent || colors.brand.accent }}>
                            ACENTO
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              {hasChanges && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="sticky bottom-4 flex justify-center"
                >
                  <button
                    onClick={handleSaveTheme}
                    disabled={isSaving}
                    className="px-8 py-3 rounded-xl font-medium shadow-xl flex items-center space-x-2 disabled:opacity-50"
                    style={{
                      background: `linear-gradient(135deg, ${colors.gradient.from}, ${colors.gradient.to})`,
                      color: colors.text.inverse,
                      boxShadow: `0 8px 24px rgba(${colors.shadow.color}, 0.4)`,
                    }}
                  >
                    {isSaving ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <HiOutlineCheck className="w-5 h-5" />
                        <span>Guardar Preferencias de Tema</span>
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </div>
          )}

          {/* ============================================
              COMPANY TAB (Admin Only)
              ============================================ */}
          {activeTab === 'company' && isAdmin && (
            <div
              className="p-6 rounded-xl border"
              style={{ backgroundColor: colors.bg.elevated, borderColor: colors.border.default }}
            >
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2" style={{ color: colors.text.primary }}>
                <HiOutlineOfficeBuilding className="w-5 h-5" style={{ color: colors.brand.primary }} />
                Configuración de la Empresa
              </h3>

              <div className="space-y-6 max-w-xl">
                {/* Logo Section */}
                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: colors.text.secondary }}>
                    Logo de la Empresa
                  </label>
                  <div className="flex items-center space-x-6">
                    <div
                      className="w-24 h-24 rounded-2xl border-2 flex items-center justify-center bg-white overflow-hidden group relative transition-all duration-300 hover:shadow-md"
                      style={{ borderColor: colors.border.default }}
                    >
                      <BrandIcon className="w-16 h-16" color={colors.brand.primary} size={48} />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <HiOutlineUpload className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-sm font-bold tracking-tight" style={{ color: colors.text.primary }}>INVENTORY_PRO_BRAND.SVG</p>
                      <p className="text-xs" style={{ color: colors.text.muted }}>Usando el icono oficial del sistema</p>
                      <button
                        className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors"
                        style={{ backgroundColor: colors.brand.primaryLight, color: colors.brand.primary }}
                      >
                        Cambiar Imagen
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>
                    Nombre de la Empresa
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => {
                      updateCompanyName(e.target.value);
                      setHasChanges(true);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: colors.bg.input,
                      borderColor: colors.border.input,
                      color: colors.text.primary,
                    }}
                  />
                  <p className="text-xs mt-2" style={{ color: colors.text.muted }}>
                    Este nombre aparecerá en el sidebar y en los reportes exportados
                  </p>
                </div>

                <div
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: colors.status.infoBg }}
                >
                  <p className="text-sm" style={{ color: colors.status.infoText }}>
                    💡 Los cambios en la configuración de empresa se aplicarán a todos los usuarios de tu organización.
                  </p>
                </div>

                <button
                  onClick={handleSaveTheme}
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
                  style={{
                    background: `linear-gradient(135deg, ${colors.gradient.from}, ${colors.gradient.to})`,
                    color: colors.text.inverse,
                    boxShadow: `0 4px 12px rgba(${colors.shadow.color}, 0.3)`,
                  }}
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <HiOutlineCheck className="w-4 h-4" />
                      <span>Guardar Configuración</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
