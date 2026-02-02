// ============================================
// FORMATTERS - UTILIDADES DE FORMATO
// ============================================

import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

// ============================================
// CURRENCY FORMATTING
// ============================================

export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatCompactCurrency(amount: number, currency: string = 'USD'): string {
  if (amount >= 1000000) {
    return `${currency === 'USD' ? '$' : ''}${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `${currency === 'USD' ? '$' : ''}${(amount / 1000).toFixed(1)}K`;
  }
  return formatCurrency(amount, currency);
}

// ============================================
// NUMBER FORMATTING
// ============================================

export function formatNumber(num: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(num);
}

export function formatCompactNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

// ============================================
// DATE FORMATTING
// ============================================

export function formatDate(
  date: Date | string | null | undefined,
  formatStr: string = 'dd MMM yyyy'
): string {
  if (!date) return '-';
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return '-';
  
  return format(dateObj, formatStr, { locale: es });
}

export function formatDateTime(date: Date | string | null | undefined): string {
  return formatDate(date, "dd MMM yyyy, HH:mm");
}

export function formatTime(date: Date | string | null | undefined): string {
  return formatDate(date, 'HH:mm');
}

export function formatRelativeTime(date: Date | string | null | undefined): string {
  if (!date) return '-';
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return '-';
  
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: es });
}

export function formatDateRange(start: Date | string, end: Date | string): string {
  return `${formatDate(start, 'dd MMM')} - ${formatDate(end, 'dd MMM yyyy')}`;
}

// ============================================
// TEXT FORMATTING
// ============================================

export function truncate(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function titleCase(text: string): string {
  return text.split(' ').map(capitalize).join(' ');
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getInitials(name: string, maxChars: number = 2): string {
  return name
    .split(' ')
    .map(n => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, maxChars);
}

// ============================================
// FILE SIZE FORMATTING
// ============================================

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

// ============================================
// PHONE FORMATTING
// ============================================

export function formatPhone(phone: string): string {
  // Remove non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  if (cleaned.length === 12 && cleaned.startsWith('52')) {
    return `+52 ${cleaned.slice(2, 4)} ${cleaned.slice(4, 8)} ${cleaned.slice(8)}`;
  }
  
  return phone;
}
