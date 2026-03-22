import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { FileText, TrendingUp, Package, Users, Calendar } from 'lucide-react';
import { apiFetch } from '../services/api';

export const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    apiFetch('/api/dashboard/stats').then(setStats);
  }, []);

  if (!stats) return <div className="flex items-center justify-center h-64">Carregando indicadores...</div>;

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Header Moderno */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <TrendingUp className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Dashboard
                  </h1>
                  <p className="text-slate-500 font-medium">Visão geral das operações</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl">
                <Calendar className="text-slate-600" size={16} />
                <span className="text-sm font-medium text-slate-700">
                  {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">
      {/* Stats Grid Modernos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="group relative bg-white rounded-3xl border border-slate-200/60 p-8 hover:shadow-xl hover:shadow-slate-200/25 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-emerald-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <FileText className="text-white" size={28} />
              </div>
              <div className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                +12%
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-600 font-medium">O.S. em Aberto</p>
              <p className="text-4xl font-bold text-slate-900">{stats.openOS}</p>
            </div>
          </div>
        </div>

        <div className="group relative bg-white rounded-3xl border border-slate-200/60 p-8 hover:shadow-xl hover:shadow-slate-200/25 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <TrendingUp className="text-white" size={28} />
              </div>
              <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                Meta 85%
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-600 font-medium">Faturamento Mensal</p>
              <p className="text-4xl font-bold text-slate-900">R$ {stats.monthlyBilling}</p>
            </div>
          </div>
        <div className="group relative bg-white rounded-3xl border border-slate-200/60 p-8 hover:shadow-xl hover:shadow-slate-200/25 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-amber-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                <Package className="text-white" size={28} />
              </div>
              <div className="px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                +8%
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-600 font-medium">Produtos Cadastrados</p>
              <p className="text-4xl font-bold text-slate-900">{stats.totalProducts}</p>
            </div>
          </div>
        </div>
          </div>
          <p className="text-sm text-stone-500 font-medium">Volume Total Classificado</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-3xl font-bold text-stone-900">
              {stats.volumeByProduct.reduce((acc: any, curr: any) => acc + curr.volume, 0).toFixed(1)}
            </p>
            <span className="text-sm text-stone-500 font-medium">TON</span>
          </div>
        </div>
      </div>

      {/* Charts Row Moderna */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-lg shadow-slate-200/25 p-8">
          <h3 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-6">Volume por Produto</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.volumeByProduct}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="volume" radius={[6, 6, 0, 0]}>
                  {stats.volumeByProduct.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-lg shadow-slate-200/25 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Distribuição</h3>
              <p className="text-sm text-slate-500 mt-1">Volume por produto este mês</p>
            </div>
          </div>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.volumeByProduct}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="volume"
                >
                  {stats.volumeByProduct.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-200/60">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.volumeByProduct.map((item: any, index: number) => (
                <div key={item.name} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="w-4 h-4 rounded-lg shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 capitalize">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.volume} ton</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
