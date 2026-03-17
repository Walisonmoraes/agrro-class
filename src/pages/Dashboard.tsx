import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { FileText, TrendingUp, Package, Users } from 'lucide-react';
import { apiFetch } from '../services/api';

export const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    apiFetch('/api/dashboard/stats').then(setStats);
  }, []);

  if (!stats) return <div className="flex items-center justify-center h-64">Carregando indicadores...</div>;

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <FileText size={24} />
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
          </div>
          <p className="text-sm text-stone-500 font-medium">O.S. em Aberto</p>
          <p className="text-3xl font-bold text-stone-900 mt-1">{stats.openOS}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <TrendingUp size={24} />
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Meta 85%</span>
          </div>
          <p className="text-sm text-stone-500 font-medium">Faturamento Mensal</p>
          <p className="text-3xl font-bold text-stone-900 mt-1">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.monthlyBilling)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
              <Package size={24} />
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
          <h3 className="text-lg font-semibold text-stone-800 mb-6">Volume por Produto</h3>
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

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
          <h3 className="text-lg font-semibold text-stone-800 mb-6">Distribuição de Carga</h3>
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
          <div className="flex justify-center gap-6 mt-4">
            {stats.volumeByProduct.map((item: any, index: number) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-sm text-stone-600 font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
