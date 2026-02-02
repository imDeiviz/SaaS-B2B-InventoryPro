/**
 * @file designTokens.ts
 * @description Centralized Design Tokens System for InventoryPro SaaS.
 * Follows WCAG 2.1 AA standards for accessibility.
 */

export const DESIGN_TOKENS = {
    colors: {
        // Basic palette (Scale)
        slate: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
            950: '#020617',
        },
        indigo: {
            50: '#eef2ff',
            500: '#6366f1',
            600: '#4f46e5',
            700: '#4338ca',
        },
        purple: {
            500: '#a855f7',
            600: '#9333ea',
        },
    },
    typography: {
        contrast: {
            light: {
                primary: '#0f172a',    // Slate 900 (High contrast on light bg)
                secondary: '#334155',  // Slate 700
                muted: '#475569',      // Slate 600 (WCAG AA compliant)
            },
            dark: {
                primary: '#f8fafc',    // Slate 50 (High contrast on dark bg)
                secondary: '#f1f5f9',  // Slate 100
                muted: '#cbd5e1',      // Slate 300
            }
        }
    }
};

export const semanticTokens = {
    light: {
        '--color-text-primary': DESIGN_TOKENS.typography.contrast.light.primary,
        '--color-text-secondary': DESIGN_TOKENS.typography.contrast.light.secondary,
        '--color-text-muted': DESIGN_TOKENS.typography.contrast.light.muted,
        '--color-bg-main': DESIGN_TOKENS.colors.slate[50],
        '--color-bg-card': '#ffffff',
        '--color-bg-input': '#ffffff',
        '--color-border': DESIGN_TOKENS.colors.slate[200],
        '--color-border-focus': DESIGN_TOKENS.colors.indigo[600],
    },
    dark: {
        '--color-text-primary': DESIGN_TOKENS.typography.contrast.dark.primary,
        '--color-text-secondary': DESIGN_TOKENS.typography.contrast.dark.secondary,
        '--color-text-muted': DESIGN_TOKENS.typography.contrast.dark.muted,
        '--color-bg-main': DESIGN_TOKENS.colors.slate[950],
        '--color-bg-card': DESIGN_TOKENS.colors.slate[900],
        '--color-bg-input': DESIGN_TOKENS.colors.slate[900],
        '--color-border': DESIGN_TOKENS.colors.slate[800],
        '--color-border-focus': DESIGN_TOKENS.colors.indigo[500],
    }
};
