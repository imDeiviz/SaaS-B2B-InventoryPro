// ============================================
// SISTEMA DE TEMAS - CONFIGURACIÓN COMPLETA
// 3 Temas Claros + 3 Temas Oscuros
// Con contraste optimizado (WCAG AA compliant)
// ============================================

// ============================================
// INTERFACES
// ============================================

export interface TextColorScale {
  primary: string;    // Texto principal - máximo contraste (4.5:1 min)
  secondary: string;  // Texto secundario - alto contraste
  muted: string;      // Texto atenuado - contraste medio
  disabled: string;   // Texto deshabilitado
  inverse: string;    // Texto inverso para fondos oscuros/claros
  link: string;       // Enlaces
  linkHover: string;  // Enlaces hover
}

export interface BackgroundScale {
  main: string;
  elevated: string;
  sunken: string;
  overlay: string;
  sidebar: string;
  sidebarHover: string;
  sidebarActive: string;
  header: string;
  tooltip: string;
  hover: string;
  active: string;
  input: string;
  card: string;
}

export interface BorderScale {
  default: string;
  light: string;
  dark: string;
  focus: string;
  input: string;
  divider: string;
}

export interface BrandColors {
  primary: string;
  primaryHover: string;
  primaryActive: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryHover: string;
  accent: string;
  accentHover: string;
}

export interface StatusColors {
  success: string;
  successBg: string;
  successBorder: string;
  successText: string;
  warning: string;
  warningBg: string;
  warningBorder: string;
  warningText: string;
  danger: string;
  dangerBg: string;
  dangerBorder: string;
  dangerText: string;
  info: string;
  infoBg: string;
  infoBorder: string;
  infoText: string;
}

export interface SidebarColors {
  text: string;
  textMuted: string;
  textActive: string;
  iconDefault: string;
  iconActive: string;
}

export interface ShadowColors {
  color: string;
  colorStrong: string;
}

export interface GradientColors {
  from: string;
  to: string;
}

export interface ThemeColors {
  text: TextColorScale;
  bg: BackgroundScale;
  border: BorderScale;
  brand: BrandColors;
  status: StatusColors;
  sidebar: SidebarColors;
  chart: string[];
  shadow: ShadowColors;
  gradient: GradientColors;
}

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  isDark: boolean;
  colors: ThemeColors;
}

// ============================================
// 3 TEMAS CLAROS
// Regla de Oro: Textos oscuros (Slate 900-600)
// Fondos claros para máximo contraste
// ============================================

const lightCorporate: ThemePreset = {
  id: 'light-corporate',
  name: 'Corporativo Claro',
  description: 'Profesional y moderno con índigo/púrpura',
  icon: '☀️',
  isDark: false,
  colors: {
    text: {
      primary: '#0f172a',      // Slate 900 - 15.8:1 contrast
      secondary: '#334155',    // Slate 700 - 9.5:1 contrast
      muted: '#64748b',        // Slate 500 - 4.6:1 contrast
      disabled: '#94a3b8',     // Slate 400
      inverse: '#ffffff',
      link: '#4f46e5',
      linkHover: '#4338ca',
    },
    bg: {
      main: '#f8fafc',
      elevated: '#ffffff',
      sunken: '#f1f5f9',
      overlay: 'rgba(15, 23, 42, 0.6)',
      sidebar: '#1e293b',
      sidebarHover: '#334155',
      sidebarActive: '#4f46e5',
      header: 'rgba(255, 255, 255, 0.9)',
      tooltip: '#1e293b',
      hover: '#f1f5f9',
      active: '#e2e8f0',
      input: '#ffffff',
      card: '#ffffff',
    },
    border: {
      default: '#e2e8f0',
      light: '#f1f5f9',
      dark: '#cbd5e1',
      focus: '#4f46e5',
      input: '#cbd5e1',
      divider: '#e2e8f0',
    },
    brand: {
      primary: '#4f46e5',
      primaryHover: '#4338ca',
      primaryActive: '#3730a3',
      primaryLight: '#e0e7ff',
      primaryDark: '#3730a3',
      secondary: '#7c3aed',
      secondaryHover: '#6d28d9',
      accent: '#06b6d4',
      accentHover: '#0891b2',
    },
    status: {
      success: '#16a34a',
      successBg: '#dcfce7',
      successBorder: '#bbf7d0',
      successText: '#15803d',
      warning: '#d97706',
      warningBg: '#fef3c7',
      warningBorder: '#fde68a',
      warningText: '#b45309',
      danger: '#dc2626',
      dangerBg: '#fee2e2',
      dangerBorder: '#fecaca',
      dangerText: '#b91c1c',
      info: '#2563eb',
      infoBg: '#dbeafe',
      infoBorder: '#bfdbfe',
      infoText: '#1d4ed8',
    },
    sidebar: {
      text: '#f1f5f9',
      textMuted: '#94a3b8',
      textActive: '#ffffff',
      iconDefault: '#94a3b8',
      iconActive: '#ffffff',
    },
    chart: ['#4f46e5', '#7c3aed', '#a855f7', '#06b6d4', '#10b981', '#f59e0b'],
    shadow: {
      color: '79, 70, 229',
      colorStrong: '30, 41, 59',
    },
    gradient: {
      from: '#4f46e5',
      to: '#7c3aed',
    },
  },
};

const lightOcean: ThemePreset = {
  id: 'light-ocean',
  name: 'Océano Claro',
  description: 'Fresco y relajante con tonos cyan/teal',
  icon: '🌊',
  isDark: false,
  colors: {
    text: {
      primary: '#0f172a',
      secondary: '#334155',
      muted: '#64748b',
      disabled: '#94a3b8',
      inverse: '#ffffff',
      link: '#0891b2',
      linkHover: '#0e7490',
    },
    bg: {
      main: '#f0fdfa',
      elevated: '#ffffff',
      sunken: '#ccfbf1',
      overlay: 'rgba(19, 78, 74, 0.6)',
      sidebar: '#134e4a',
      sidebarHover: '#115e59',
      sidebarActive: '#0891b2',
      header: 'rgba(255, 255, 255, 0.9)',
      tooltip: '#134e4a',
      hover: '#ccfbf1',
      active: '#99f6e4',
      input: '#ffffff',
      card: '#ffffff',
    },
    border: {
      default: '#99f6e4',
      light: '#ccfbf1',
      dark: '#5eead4',
      focus: '#0891b2',
      input: '#5eead4',
      divider: '#99f6e4',
    },
    brand: {
      primary: '#0891b2',
      primaryHover: '#0e7490',
      primaryActive: '#155e75',
      primaryLight: '#cffafe',
      primaryDark: '#155e75',
      secondary: '#14b8a6',
      secondaryHover: '#0d9488',
      accent: '#06b6d4',
      accentHover: '#0891b2',
    },
    status: {
      success: '#059669',
      successBg: '#d1fae5',
      successBorder: '#a7f3d0',
      successText: '#047857',
      warning: '#d97706',
      warningBg: '#fef3c7',
      warningBorder: '#fde68a',
      warningText: '#b45309',
      danger: '#dc2626',
      dangerBg: '#fee2e2',
      dangerBorder: '#fecaca',
      dangerText: '#b91c1c',
      info: '#0284c7',
      infoBg: '#e0f2fe',
      infoBorder: '#bae6fd',
      infoText: '#0369a1',
    },
    sidebar: {
      text: '#ccfbf1',
      textMuted: '#5eead4',
      textActive: '#ffffff',
      iconDefault: '#5eead4',
      iconActive: '#ffffff',
    },
    chart: ['#0891b2', '#14b8a6', '#06b6d4', '#0d9488', '#10b981', '#059669'],
    shadow: {
      color: '8, 145, 178',
      colorStrong: '19, 78, 74',
    },
    gradient: {
      from: '#0891b2',
      to: '#14b8a6',
    },
  },
};

const lightForest: ThemePreset = {
  id: 'light-forest',
  name: 'Bosque Claro',
  description: 'Natural y ecológico con tonos verdes',
  icon: '🌲',
  isDark: false,
  colors: {
    text: {
      primary: '#052e16',      // Green 950
      secondary: '#166534',    // Green 800
      muted: '#15803d',        // Green 700
      disabled: '#86efac',
      inverse: '#ffffff',
      link: '#16a34a',
      linkHover: '#15803d',
    },
    bg: {
      main: '#f0fdf4',
      elevated: '#ffffff',
      sunken: '#dcfce7',
      overlay: 'rgba(20, 83, 45, 0.6)',
      sidebar: '#14532d',
      sidebarHover: '#166534',
      sidebarActive: '#16a34a',
      header: 'rgba(255, 255, 255, 0.9)',
      tooltip: '#14532d',
      hover: '#dcfce7',
      active: '#bbf7d0',
      input: '#ffffff',
      card: '#ffffff',
    },
    border: {
      default: '#bbf7d0',
      light: '#dcfce7',
      dark: '#86efac',
      focus: '#16a34a',
      input: '#86efac',
      divider: '#bbf7d0',
    },
    brand: {
      primary: '#16a34a',
      primaryHover: '#15803d',
      primaryActive: '#166534',
      primaryLight: '#dcfce7',
      primaryDark: '#166534',
      secondary: '#84cc16',
      secondaryHover: '#65a30d',
      accent: '#22c55e',
      accentHover: '#16a34a',
    },
    status: {
      success: '#16a34a',
      successBg: '#dcfce7',
      successBorder: '#bbf7d0',
      successText: '#15803d',
      warning: '#ca8a04',
      warningBg: '#fef9c3',
      warningBorder: '#fef08a',
      warningText: '#a16207',
      danger: '#dc2626',
      dangerBg: '#fee2e2',
      dangerBorder: '#fecaca',
      dangerText: '#b91c1c',
      info: '#0284c7',
      infoBg: '#e0f2fe',
      infoBorder: '#bae6fd',
      infoText: '#0369a1',
    },
    sidebar: {
      text: '#dcfce7',
      textMuted: '#86efac',
      textActive: '#ffffff',
      iconDefault: '#86efac',
      iconActive: '#ffffff',
    },
    chart: ['#16a34a', '#22c55e', '#84cc16', '#10b981', '#059669', '#65a30d'],
    shadow: {
      color: '22, 163, 74',
      colorStrong: '20, 83, 45',
    },
    gradient: {
      from: '#16a34a',
      to: '#84cc16',
    },
  },
};

// ============================================
// 3 NUEVOS TEMAS CLAROS (Antes Oscuros)
// ============================================

const lightPurple: ThemePreset = {
  id: 'light-purple',
  name: 'Púrpura Suave',
  description: 'Elegante y creativo con tonos lavanda',
  icon: '🔮',
  isDark: false,
  colors: {
    text: {
      primary: '#2e1065',      // Purple 950
      secondary: '#5b21b6',    // Purple 800
      muted: '#7c3aed',        // Purple 600
      disabled: '#ddd6fe',
      inverse: '#ffffff',
      link: '#7c3aed',
      linkHover: '#6d28d9',
    },
    bg: {
      main: '#f5f3ff',         // Purple 50
      elevated: '#ffffff',
      sunken: '#ede9fe',
      overlay: 'rgba(46, 16, 101, 0.6)',
      sidebar: '#2e1065',
      sidebarHover: '#4c1d95',
      sidebarActive: '#7c3aed',
      header: 'rgba(255, 255, 255, 0.9)',
      tooltip: '#2e1065',
      hover: '#f3f0ff',
      active: '#ddd6fe',
      input: '#ffffff',
      card: '#ffffff',
    },
    border: {
      default: '#ddd6fe',
      light: '#ede9fe',
      dark: '#c4b5fd',
      focus: '#7c3aed',
      input: '#c4b5fd',
      divider: '#ddd6fe',
    },
    brand: {
      primary: '#7c3aed',
      primaryHover: '#6d28d9',
      primaryActive: '#5b21b6',
      primaryLight: '#f5f3ff',
      primaryDark: '#5b21b6',
      secondary: '#a855f7',
      secondaryHover: '#9333ea',
      accent: '#d946ef',
      accentHover: '#c084fc',
    },
    status: {
      success: '#16a34a',
      successBg: '#dcfce7',
      successBorder: '#bbf7d0',
      successText: '#15803d',
      warning: '#d97706',
      warningBg: '#fef3c7',
      warningBorder: '#fde68a',
      warningText: '#b45309',
      danger: '#dc2626',
      dangerBg: '#fee2e2',
      dangerBorder: '#fecaca',
      dangerText: '#b91c1c',
      info: '#2563eb',
      infoBg: '#dbeafe',
      infoBorder: '#bfdbfe',
      infoText: '#1d4ed8',
    },
    sidebar: {
      text: '#f5f3ff',
      textMuted: '#c4b5fd',
      textActive: '#ffffff',
      iconDefault: '#c4b5fd',
      iconActive: '#ffffff',
    },
    chart: ['#7c3aed', '#a855f7', '#d946ef', '#10b981', '#f59e0b', '#dc2626'],
    shadow: {
      color: '124, 58, 237',
      colorStrong: '46, 16, 101',
    },
    gradient: {
      from: '#7c3aed',
      to: '#a855f7',
    },
  },
};

const lightCyber: ThemePreset = {
  id: 'light-cyber',
  name: 'Cyber Light',
  description: 'Tecnológico y limpio con azul cian',
  icon: '🏙️',
  isDark: false,
  colors: {
    text: {
      primary: '#082f49',      // Sky 950
      secondary: '#075985',    // Sky 800
      muted: '#0284c7',        // Sky 600
      disabled: '#bae6fd',
      inverse: '#ffffff',
      link: '#0ea5e9',
      linkHover: '#0284c7',
    },
    bg: {
      main: '#f0f9ff',         // Sky 50
      elevated: '#ffffff',
      sunken: '#e0f2fe',
      overlay: 'rgba(8, 47, 73, 0.6)',
      sidebar: '#082f49',
      sidebarHover: '#0c4a6e',
      sidebarActive: '#0ea5e9',
      header: 'rgba(255, 255, 255, 0.9)',
      tooltip: '#082f49',
      hover: '#e0f2fe',
      active: '#bae6fd',
      input: '#ffffff',
      card: '#ffffff',
    },
    border: {
      default: '#bae6fd',
      light: '#e0f2fe',
      dark: '#7dd3fc',
      focus: '#0ea5e9',
      input: '#7dd3fc',
      divider: '#bae6fd',
    },
    brand: {
      primary: '#0ea5e9',
      primaryHover: '#0284c7',
      primaryActive: '#075985',
      primaryLight: '#f0f9ff',
      primaryDark: '#075985',
      secondary: '#06b6d4',
      secondaryHover: '#0891b2',
      accent: '#22d3ee',
      accentHover: '#67e8f9',
    },
    status: {
      success: '#10b981',
      successBg: '#ecfdf5',
      successBorder: '#d1fae5',
      successText: '#059669',
      warning: '#f59e0b',
      warningBg: '#fffbeb',
      warningBorder: '#fef3c7',
      warningText: '#d97706',
      danger: '#ef4444',
      dangerBg: '#fef2f2',
      dangerBorder: '#fee2e2',
      dangerText: '#dc2626',
      info: '#0ea5e9',
      infoBg: '#f0f9ff',
      infoBorder: '#e0f2fe',
      infoText: '#0284c7',
    },
    sidebar: {
      text: '#f0f9ff',
      textMuted: '#7dd3fc',
      textActive: '#ffffff',
      iconDefault: '#7dd3fc',
      iconActive: '#ffffff',
    },
    chart: ['#0ea5e9', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
    shadow: {
      color: '14, 165, 233',
      colorStrong: '8, 47, 73',
    },
    gradient: {
      from: '#0ea5e9',
      to: '#06b6d4',
    },
  },
};

const lightAmber: ThemePreset = {
  id: 'light-amber',
  name: 'Ambar Cálido',
  description: 'Energético y acogedor con tonos naranjas',
  icon: '🍊',
  isDark: false,
  colors: {
    text: {
      primary: '#451a03',      // Amber 950
      secondary: '#92400e',    // Amber 800
      muted: '#b45309',        // Amber 700
      disabled: '#fde68a',
      inverse: '#ffffff',
      link: '#f97316',
      linkHover: '#ea580c',
    },
    bg: {
      main: '#fffbeb',         // Amber 50
      elevated: '#ffffff',
      sunken: '#fef3c7',
      overlay: 'rgba(69, 26, 3, 0.6)',
      sidebar: '#451a03',
      sidebarHover: '#78350f',
      sidebarActive: '#f97316',
      header: 'rgba(255, 255, 255, 0.9)',
      tooltip: '#451a03',
      hover: '#fef3c7',
      active: '#fde68a',
      input: '#ffffff',
      card: '#ffffff',
    },
    border: {
      default: '#fde68a',
      light: '#fef3c7',
      dark: '#fcd34d',
      focus: '#f97316',
      input: '#fcd34d',
      divider: '#fde68a',
    },
    brand: {
      primary: '#f97316',
      primaryHover: '#ea580c',
      primaryActive: '#92400e',
      primaryLight: '#fff7ed',
      primaryDark: '#92400e',
      secondary: '#fbbf24',
      secondaryHover: '#f59e0b',
      accent: '#f59e0b',
      accentHover: '#d97706',
    },
    status: {
      success: '#16a34a',
      successBg: '#dcfce7',
      successBorder: '#bbf7d0',
      successText: '#15803d',
      warning: '#d97706',
      warningBg: '#fef3c7',
      warningBorder: '#fde68a',
      warningText: '#b45309',
      danger: '#dc2626',
      dangerBg: '#fee2e2',
      dangerBorder: '#fecaca',
      dangerText: '#b91c1c',
      info: '#2563eb',
      infoBg: '#dbeafe',
      infoBorder: '#bfdbfe',
      infoText: '#1d4ed8',
    },
    sidebar: {
      text: '#fffbeb',
      textMuted: '#fcd34d',
      textActive: '#ffffff',
      iconDefault: '#fcd34d',
      iconActive: '#ffffff',
    },
    chart: ['#f97316', '#fbbf24', '#f59e0b', '#16a34a', '#2563eb', '#dc2626'],
    shadow: {
      color: '249, 115, 22',
      colorStrong: '69, 26, 3',
    },
    gradient: {
      from: '#f97316',
      to: '#fbbf24',
    },
  },
};

// ============================================
// EXPORTACIONES
// ============================================

export const lightThemes: ThemePreset[] = [
  lightCorporate,
  lightOcean,
  lightForest,
  lightPurple,
  lightCyber,
  lightAmber
];

export const allThemes: ThemePreset[] = [...lightThemes];
export const defaultTheme = lightCorporate;

export function getThemeById(id: string): ThemePreset | undefined {
  return allThemes.find(t => t.id === id);
}

export function getDefaultTheme(): ThemePreset {
  return defaultTheme;
}

// ============================================
// CSS VARIABLE INJECTION
// ============================================

export function injectThemeVariables(theme: ThemePreset): void {
  const root = document.documentElement;
  const { colors } = theme;

  // Text
  root.style.setProperty('--color-text', colors.text.primary);
  root.style.setProperty('--color-text-primary', colors.text.primary);
  root.style.setProperty('--color-text-secondary', colors.text.secondary);
  root.style.setProperty('--color-text-muted', colors.text.muted);
  root.style.setProperty('--color-text-disabled', colors.text.disabled);
  root.style.setProperty('--color-text-inverse', colors.text.inverse);
  root.style.setProperty('--color-text-link', colors.text.link);
  root.style.setProperty('--color-text-link-hover', colors.text.linkHover);

  // Backgrounds
  root.style.setProperty('--color-bg-main', colors.bg.main);
  root.style.setProperty('--color-bg-elevated', colors.bg.elevated);
  root.style.setProperty('--color-bg-sunken', colors.bg.sunken);
  root.style.setProperty('--color-bg-overlay', colors.bg.overlay);
  root.style.setProperty('--color-bg-sidebar', colors.bg.sidebar);
  root.style.setProperty('--color-bg-sidebar-hover', colors.bg.sidebarHover);
  root.style.setProperty('--color-bg-sidebar-active', colors.bg.sidebarActive);
  root.style.setProperty('--color-bg-header', colors.bg.header);
  root.style.setProperty('--color-bg-tooltip', colors.bg.tooltip);
  root.style.setProperty('--color-bg-hover', colors.bg.hover);
  root.style.setProperty('--color-bg-active', colors.bg.active);
  root.style.setProperty('--color-bg-input', colors.bg.input);
  root.style.setProperty('--color-bg-card', colors.bg.card);

  // Borders
  root.style.setProperty('--color-border', colors.border.default);
  root.style.setProperty('--color-border-light', colors.border.light);
  root.style.setProperty('--color-border-dark', colors.border.dark);
  root.style.setProperty('--color-border-focus', colors.border.focus);
  root.style.setProperty('--color-border-input', colors.border.input);
  root.style.setProperty('--color-border-divider', colors.border.divider);

  // Brand
  root.style.setProperty('--color-primary', colors.brand.primary);
  root.style.setProperty('--color-primary-hover', colors.brand.primaryHover);
  root.style.setProperty('--color-primary-active', colors.brand.primaryActive);
  root.style.setProperty('--color-primary-light', colors.brand.primaryLight);
  root.style.setProperty('--color-primary-dark', colors.brand.primaryDark);
  root.style.setProperty('--color-secondary', colors.brand.secondary);
  root.style.setProperty('--color-secondary-hover', colors.brand.secondaryHover);
  root.style.setProperty('--color-accent', colors.brand.accent);
  root.style.setProperty('--color-accent-hover', colors.brand.accentHover);

  // Status
  root.style.setProperty('--color-success', colors.status.success);
  root.style.setProperty('--color-success-bg', colors.status.successBg);
  root.style.setProperty('--color-success-border', colors.status.successBorder);
  root.style.setProperty('--color-success-text', colors.status.successText);
  root.style.setProperty('--color-warning', colors.status.warning);
  root.style.setProperty('--color-warning-bg', colors.status.warningBg);
  root.style.setProperty('--color-warning-border', colors.status.warningBorder);
  root.style.setProperty('--color-warning-text', colors.status.warningText);
  root.style.setProperty('--color-danger', colors.status.danger);
  root.style.setProperty('--color-danger-bg', colors.status.dangerBg);
  root.style.setProperty('--color-danger-border', colors.status.dangerBorder);
  root.style.setProperty('--color-danger-text', colors.status.dangerText);
  root.style.setProperty('--color-info', colors.status.info);
  root.style.setProperty('--color-info-bg', colors.status.infoBg);
  root.style.setProperty('--color-info-border', colors.status.infoBorder);
  root.style.setProperty('--color-info-text', colors.status.infoText);

  // Sidebar
  root.style.setProperty('--color-sidebar-text', colors.sidebar.text);
  root.style.setProperty('--color-sidebar-text-muted', colors.sidebar.textMuted);
  root.style.setProperty('--color-sidebar-text-active', colors.sidebar.textActive);
  root.style.setProperty('--color-sidebar-icon', colors.sidebar.iconDefault);
  root.style.setProperty('--color-sidebar-icon-active', colors.sidebar.iconActive);

  // Charts
  colors.chart.forEach((color, i) => {
    root.style.setProperty(`--color-chart-${i + 1}`, color);
  });

  // Shadow & Gradient
  root.style.setProperty('--color-shadow', colors.shadow.color);
  root.style.setProperty('--color-shadow-strong', colors.shadow.colorStrong);
  root.style.setProperty('--color-gradient-from', colors.gradient.from);
  root.style.setProperty('--color-gradient-to', colors.gradient.to);

  // Dark mode class and attribute
  if (theme.isDark) {
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
  } else {
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
  }

  // Update body bg immediately
  document.body.style.backgroundColor = colors.bg.main;
  document.body.style.color = colors.text.primary;
}

// ============================================
// COLOR PALETTE
// ============================================

export const colorPalette = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#78716c', '#64748b', '#475569',
];
