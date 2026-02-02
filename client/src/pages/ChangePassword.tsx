// ============================================
// PÁGINA DE CAMBIO DE CONTRASEÑA - FIRST LOGIN
// ============================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/AuthContext';
import { useToast } from '@/store/ToastContext';
import { motion } from 'framer-motion';
import { Button, Input, Card } from '@/components/ui';
import { Package, Lock, Eye, EyeOff, AlertTriangle, ShieldCheck } from 'lucide-react';

export function ChangePasswordPage() {
  const { user, changePassword, mustChangePassword, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validatePassword = (password: string): string[] => {
    const issues: string[] = [];
    if (password.length < 8) issues.push('Mínimo 8 caracteres');
    if (!/[A-Z]/.test(password)) issues.push('Al menos una mayúscula');
    if (!/[a-z]/.test(password)) issues.push('Al menos una minúscula');
    if (!/[0-9]/.test(password)) issues.push('Al menos un número');
    return issues;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!currentPassword) {
      newErrors.currentPassword = 'Ingresa tu contraseña actual';
    }
    
    const passwordIssues = validatePassword(newPassword);
    if (passwordIssues.length > 0) {
      newErrors.newPassword = passwordIssues.join('. ');
    }
    
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (currentPassword === newPassword) {
      newErrors.newPassword = 'La nueva contraseña debe ser diferente a la actual';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) return;
    
    setLoading(true);
    
    const success = await changePassword(currentPassword, newPassword);
    
    setLoading(false);
    
    if (success) {
      toast.success('Contraseña actualizada exitosamente');
      navigate('/dashboard');
    } else {
      setErrors({ currentPassword: 'Contraseña actual incorrecta' });
    }
  };

  const passwordStrength = () => {
    const issues = validatePassword(newPassword);
    const strength = 4 - issues.length;
    return strength;
  };

  const getStrengthColor = () => {
    const strength = passwordStrength();
    if (strength <= 1) return 'bg-red-500';
    if (strength <= 2) return 'bg-orange-500';
    if (strength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    const strength = passwordStrength();
    if (strength <= 1) return 'Muy débil';
    if (strength <= 2) return 'Débil';
    if (strength <= 3) return 'Buena';
    return 'Fuerte';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/30 mb-4"
          >
            <Package size={32} className="text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white">InventoryPro</h1>
          <p className="text-indigo-300 text-sm">Sistema de Gestión de Inventarios</p>
        </div>

        <Card className="p-8">
          {/* Warning banner for first login */}
          {mustChangePassword && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3"
            >
              <AlertTriangle className="text-amber-500 shrink-0 mt-0.5\" size={20} />
              <div>
                <p className="font-medium text-amber-800">Cambio de contraseña requerido</p>
                <p className="text-sm text-amber-700 mt-1">
                  Por seguridad, debes cambiar tu contraseña antes de continuar.
                </p>
              </div>
            </motion.div>
          )}

          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={28} className="text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {mustChangePassword ? 'Establece tu nueva contraseña' : 'Cambiar Contraseña'}
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              Hola, <span className="font-medium text-gray-700">{user?.name}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Contraseña actual"
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock size={18} />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
              error={errors.currentPassword}
            />

            <div>
              <Input
                label="Nueva contraseña"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                leftIcon={<Lock size={18} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                error={errors.newPassword}
              />
              
              {/* Password strength indicator */}
              {newPassword && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          passwordStrength() >= level ? getStrengthColor() : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs ${
                    passwordStrength() >= 3 ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    Fortaleza: {getStrengthText()}
                  </p>
                </div>
              )}
            </div>

            <Input
              label="Confirmar nueva contraseña"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock size={18} />}
              error={errors.confirmPassword}
            />

            {/* Password requirements */}
            <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-500 space-y-1">
              <p className="font-medium text-gray-700">Requisitos de contraseña:</p>
              <ul className="space-y-0.5">
                <li className={newPassword.length >= 8 ? 'text-green-600' : ''}>
                  • Mínimo 8 caracteres
                </li>
                <li className={/[A-Z]/.test(newPassword) ? 'text-green-600' : ''}>
                  • Al menos una letra mayúscula
                </li>
                <li className={/[a-z]/.test(newPassword) ? 'text-green-600' : ''}>
                  • Al menos una letra minúscula
                </li>
                <li className={/[0-9]/.test(newPassword) ? 'text-green-600' : ''}>
                  • Al menos un número
                </li>
              </ul>
            </div>

            <div className="pt-4 space-y-3">
              <Button type="submit" className="w-full" size="lg" loading={loading}>
                Actualizar Contraseña
              </Button>
              
              {!mustChangePassword && (
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => navigate(-1)}
                >
                  Cancelar
                </Button>
              )}
              
              {mustChangePassword && (
                <button
                  type="button"
                  onClick={logout}
                  className="w-full text-sm text-gray-500 hover:text-gray-700"
                >
                  Cerrar sesión
                </button>
              )}
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
