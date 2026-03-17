import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { apiFetch } from '../services/api';
import { Tractor, Lock, Mail, ArrowRight } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setAuth = useAuthStore(state => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setAuth(data.token, data.user);
    } catch (err: any) {
      setError(err.message || 'Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-2xl text-white mb-4 shadow-lg shadow-emerald-500/20">
            <Tractor size={32} />
          </div>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">AgroClass</h1>
          <p className="text-stone-500 mt-2">Sistema de Classificação de Grãos</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">E-mail Corporativo</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  placeholder="exemplo@empresa.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Senha de Acesso</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Autenticando...' : 'Entrar no Sistema'}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>
          
          <div className="mt-8 pt-8 border-t border-stone-100 text-center">
            <p className="text-xs text-stone-400 uppercase tracking-widest font-bold">Acesso Restrito</p>
            <p className="text-xs text-stone-400 mt-1">Utilize suas credenciais fornecidas pelo RH</p>
          </div>
        </div>
      </div>
    </div>
  );
};
