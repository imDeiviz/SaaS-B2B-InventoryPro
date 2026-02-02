// ============================================
// THEME CONTEXT - GESTIÓN COMPLETA DE TEMAS
// Con persistencia en LocalStorage y DB simulada
// ============================================

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  ThemePreset,
  ThemeColors,
  getThemeById,
  getDefaultTheme,
  injectThemeVariables,
  colorPalette,
  allThemes,
} from '@/config/themeConfig';

const API_BASE = (import.meta as any).env?.DEV ? 'http://127.0.0.1:4000/api' : '/api';

// ============================================
// TYPES
// ============================================

interface CustomColors {
  primary: string;
  secondary: string;
  accent: string;
}

interface ThemeState {
  themeId: string;
  customColors: CustomColors;
  companyName: string;
}

interface ThemeContextType {
  // State
  currentTheme: ThemePreset;
  customColors: CustomColors;
  isDark: boolean;
  companyName: string;

  // Actions
  setTheme: (themeId: string) => void;
  updateCustomColor: (key: keyof CustomColors, value: string) => void;
  resetCustomColors: () => void;
  updateCompanyName: (name: string) => void;
  saveSettings: () => Promise<void>;

  // Helpers
  getColor: (colorKey: keyof ThemeColors) => unknown;
  colorPalette: string[];
  allThemes: ThemePreset[];
}

const defaultCustomColors: CustomColors = {
  primary: '',
  secondary: '',
  accent: '',
};

// Default state for reference
const _defaultState: ThemeState = {
  themeId: 'light-corporate',
  customColors: defaultCustomColors,
  companyName: 'TechLogistics Pro',
};
void _defaultState; // Prevent unused warning

// ============================================
// CONTEXT
// ============================================

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ============================================
// STORAGE KEYS
// ============================================

const STORAGE_KEY = 'inventorypro_theme';

// ============================================
// PROVIDER
// ============================================

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemePreset>(getDefaultTheme());
  const [customColors, setCustomColors] = useState<CustomColors>(defaultCustomColors);
  const [companyName, setCompanyName] = useState('TechLogistics Pro');
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch global settings from backend on mount
  useEffect(() => {
    const fetchGlobalSettings = async () => {
      try {
        const response = await fetch(`${API_BASE}/settings`);
        if (response.ok) {
          const state: ThemeState = await response.json();

          const theme = getThemeById(state.themeId);
          if (theme) {
            setCurrentTheme(theme);
          }

          if (state.customColors) {
            setCustomColors(state.customColors);
          }

          if (state.companyName) {
            setCompanyName(state.companyName);
          }
        }
      } catch (error) {
        console.error('Error loading global settings from backend:', error);
        // Fallback to localStorage if API fails
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const state: ThemeState = JSON.parse(saved);
          const theme = getThemeById(state.themeId);
          if (theme) setCurrentTheme(theme);
          if (state.customColors) setCustomColors(state.customColors);
          if (state.companyName) setCompanyName(state.companyName);
        }
      } finally {
        setIsInitialized(true);
      }
    };

    fetchGlobalSettings();
  }, []);

  // Apply theme whenever it changes
  useEffect(() => {
    if (!isInitialized) return;

    // Inject base theme variables
    injectThemeVariables(currentTheme);

    // Apply custom colors if set
    const root = document.documentElement;

    if (customColors.primary) {
      root.style.setProperty('--color-primary', customColors.primary);
      root.style.setProperty('--color-gradient-from', customColors.primary);
      root.style.setProperty('--color-border-focus', customColors.primary);
    }

    if (customColors.secondary) {
      root.style.setProperty('--color-secondary', customColors.secondary);
      root.style.setProperty('--color-gradient-to', customColors.secondary);
    }

    if (customColors.accent) {
      root.style.setProperty('--color-accent', customColors.accent);
    }

    // Update meta theme-color
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', currentTheme.colors.bg.sidebar);
    }

    // Save to localStorage as quick cache
    const state: ThemeState = {
      themeId: currentTheme.id,
      customColors,
      companyName,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [currentTheme, customColors, companyName, isInitialized]);

  // Set theme by ID
  const setTheme = useCallback((themeId: string) => {
    const theme = getThemeById(themeId);
    if (theme) {
      setCurrentTheme(theme);
      // Reset custom colors when changing theme
      setCustomColors(defaultCustomColors);
    }
  }, []);

  // Update custom color
  const updateCustomColor = useCallback((key: keyof CustomColors, value: string) => {
    setCustomColors(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Reset custom colors
  const resetCustomColors = useCallback(() => {
    setCustomColors(defaultCustomColors);
    // Re-inject original theme
    injectThemeVariables(currentTheme);
  }, [currentTheme]);

  // Update company name
  const updateCompanyName = useCallback((name: string) => {
    setCompanyName(name);
  }, []);

  // Save settings globally (backend API)
  const saveSettings = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE}/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          themeId: currentTheme.id,
          customColors,
          companyName
        }),
      });

      if (!response.ok) throw new Error('Failed to save settings');

      const updatedSettings = await response.json();
      console.log('Settings successfully saved to backend:', updatedSettings);
    } catch (error) {
      console.error('Error saving settings to backend:', error);
      throw error;
    }
  }, [currentTheme.id, customColors, companyName]);

  // Get color by key
  const getColor = useCallback((colorKey: keyof ThemeColors) => {
    return currentTheme.colors[colorKey];
  }, [currentTheme]);

  const value: ThemeContextType = {
    currentTheme,
    customColors,
    isDark: currentTheme.isDark,
    companyName,
    setTheme,
    updateCustomColor,
    resetCustomColors,
    updateCompanyName,
    saveSettings,
    getColor,
    colorPalette,
    allThemes,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// ============================================
// HOOK
// ============================================

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Re-export types
export type { ThemePreset, ThemeColors, CustomColors };
