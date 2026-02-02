// ============================================
// PÁGINA DE LOGIN - DISEÑO PROFESIONAL
// ============================================

import { useState } from 'react';
import { useAuth } from '@/store/AuthContext';
import { motion } from 'framer-motion';
import { Button, Input, Card } from '@/components/ui';
import { 
  Package, AlertCircle, Eye, EyeOff, Shield, User, 
  Zap, BarChart3, Lock, CheckCircle
} from 'lucide-react';

export function LoginPage() {
  const { login, loading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  const demoUsers = [
    { email: 'admin@techlogistics.com', password: 'admin123', role: 'Administrador', color: '#ef4444', desc: 'Acceso completo' },
    { email: 'gerente@techlogistics.com', password: 'gerente123', role: 'Gerente', color: '#3b82f6', desc: 'Gestión de inventario' },
    { email: 'operador@techlogistics.com', password: 'operador123', role: 'Operador', color: '#22c55e', desc: 'Movimientos (Debe cambiar contraseña)' },
    { email: 'viewer@techlogistics.com', password: 'viewer123', role: 'Visualizador', color: '#6b7280', desc: 'Solo lectura' },
  ];

  const features = [
    { icon: <Package size={24} />, title: 'Gestión de Inventario', desc: 'Control total de productos y almacenes' },
    { icon: <BarChart3 size={24} />, title: 'Reportes Avanzados', desc: 'Analíticas y exportación CSV/PDF' },
    { icon: <Shield size={24} />, title: 'RBAC Dinámico', desc: 'Roles y permisos personalizables' },
    { icon: <Zap size={24} />, title: 'Multi-Tenant', desc: 'Arquitectura SaaS escalable' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Floating Elements */}
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-32 right-10 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-pink-500/20 rounded-full blur-2xl" 
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 py-12 w-full">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-12"
          >
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 10 }}
              className="w-14 h-14 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/30"
            >
              <Package size={30} className="text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-white">InventoryPro</h1>
              <p className="text-indigo-300 text-sm">Enterprise Edition</p>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              Sistema de Gestión de<br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Inventarios B2B
              </span>
            </h2>
            <p className="text-lg text-indigo-200 mb-12 max-w-md">
              Controla tus productos, almacenes, proveedores y movimientos 
              con nuestra plataforma SaaS empresarial.
            </p>
          </motion.div>

          {/* Features */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.03, y: -2 }}
                className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="text-indigo-400 mb-2">{feature.icon}</div>
                <h3 className="font-semibold text-white text-sm">{feature.title}</h3>
                <p className="text-indigo-300 text-xs mt-1">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Footer */}
          <p className="mt-auto text-indigo-400 text-sm">
            © 2024 InventoryPro - Todos los derechos reservados
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-slate-100">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-4"
            >
              <Package size={32} className="text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900">InventoryPro</h1>
            <p className="text-gray-500">Dashboard SaaS B2B</p>
          </div>

          {/* Login Form Card */}
          <Card className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Bienvenido de nuevo</h2>
              <p className="text-gray-500 mt-2">Ingresa tus credenciales para continuar</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
              >
                <AlertCircle className="text-red-500 shrink-0" size={20} />
                <span className="text-sm text-red-700 flex-1">{error}</span>
                <button 
                  onClick={clearError} 
                  className="text-red-400 hover:text-red-600 text-xl leading-none"
                >
                  ×
                </button>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Correo electrónico"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@empresa.com"
                leftIcon={<User size={18} />}
                required
              />

              <Input
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                leftIcon={<Lock size={18} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                required
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  Recordarme
                </label>
                <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg" 
                loading={loading}
              >
                Iniciar sesión
              </Button>
            </form>
          </Card>

          {/* Demo Credentials */}
          <Card className="mt-6 p-6">
            <p className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
              <Shield size={16} className="text-indigo-500" />
              Credenciales de demostración
            </p>
            <div className="space-y-2">
              {demoUsers.map((user) => (
                <motion.button
                  key={user.email}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    setEmail(user.email);
                    setPassword(user.password);
                  }}
                  className="w-full text-left p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: user.color }}
                      >
                        {user.role.charAt(0)}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                          {user.role}
                        </span>
                        <p className="text-xs text-gray-400">{user.desc}</p>
                      </div>
                    </div>
                    <CheckCircle size={16} className="text-gray-300 group-hover:text-indigo-500 transition-colors" />
                  </div>
                </motion.button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">
              El usuario "Operador" tiene el flag <code className="bg-gray-200 px-1 rounded">mustChangePassword</code> activo
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
