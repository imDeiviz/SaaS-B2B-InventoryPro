// ============================================
// VALIDATORS - UTILIDADES DE VALIDACIÓN
// ============================================

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// ============================================
// STRING VALIDATORS
// ============================================

export function isEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
}

export function isAlphanumeric(str: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(str);
}

export function isSKU(sku: string): boolean {
  return /^[A-Z0-9-]+$/.test(sku);
}

// ============================================
// NUMBER VALIDATORS
// ============================================

export function isPositive(num: number): boolean {
  return num > 0;
}

export function isNonNegative(num: number): boolean {
  return num >= 0;
}

export function isInRange(num: number, min: number, max: number): boolean {
  return num >= min && num <= max;
}

export function isInteger(num: number): boolean {
  return Number.isInteger(num);
}

// ============================================
// PASSWORD VALIDATORS
// ============================================

export interface PasswordStrength {
  score: number; // 0-5
  label: 'very_weak' | 'weak' | 'fair' | 'strong' | 'very_strong';
  requirements: {
    minLength: boolean;
    hasLowercase: boolean;
    hasUppercase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
}

export function validatePassword(password: string, minLength: number = 8): PasswordStrength {
  const requirements = {
    minLength: password.length >= minLength,
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const score = Object.values(requirements).filter(Boolean).length;

  const labels: PasswordStrength['label'][] = [
    'very_weak', 'very_weak', 'weak', 'fair', 'strong', 'very_strong'
  ];

  return {
    score,
    label: labels[score],
    requirements,
  };
}

export function isStrongPassword(password: string): boolean {
  const { score } = validatePassword(password);
  return score >= 4;
}

// ============================================
// FORM FIELD VALIDATORS
// ============================================

export function required(value: unknown): string | null {
  if (value === undefined || value === null) return 'Este campo es requerido';
  if (typeof value === 'string' && !value.trim()) return 'Este campo es requerido';
  if (Array.isArray(value) && value.length === 0) return 'Este campo es requerido';
  return null;
}

export function minLength(value: string, min: number): string | null {
  if (value.length < min) return `Mínimo ${min} caracteres`;
  return null;
}

export function maxLength(value: string, max: number): string | null {
  if (value.length > max) return `Máximo ${max} caracteres`;
  return null;
}

export function email(value: string): string | null {
  if (!isEmail(value)) return 'Email inválido';
  return null;
}

export function phone(value: string): string | null {
  if (!isPhone(value)) return 'Teléfono inválido';
  return null;
}

export function min(value: number, minValue: number): string | null {
  if (value < minValue) return `El valor mínimo es ${minValue}`;
  return null;
}

export function max(value: number, maxValue: number): string | null {
  if (value > maxValue) return `El valor máximo es ${maxValue}`;
  return null;
}

export function pattern(value: string, regex: RegExp, message: string): string | null {
  if (!regex.test(value)) return message;
  return null;
}

// ============================================
// COMPOSITE VALIDATORS
// ============================================

export function validateForm<T extends Record<string, unknown>>(
  data: T,
  rules: Record<keyof T, ((value: unknown) => string | null)[]>
): { isValid: boolean; errors: Partial<Record<keyof T, string>> } {
  const errors: Partial<Record<keyof T, string>> = {};
  
  for (const field in rules) {
    const value = data[field];
    for (const validator of rules[field]) {
      const error = validator(value);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
