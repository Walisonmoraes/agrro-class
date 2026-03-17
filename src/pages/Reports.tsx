import React, { useState, useEffect } from 'react';
import { Download, Filter, TrendingUp, Users, Package, Receipt } from 'lucide-react';
import { apiFetch } from '../services/api';

export const Reports = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    apiFetch('/api/dashboard/stats').then(setStats);
  }, []);

  const reportTypes = [
    { id: 'clients', label: 'Relatório por Cliente', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'products', label: 'Relatório por Produto', icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'billing', label: 'Relatório de Faturamento', icon: Receipt, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 'ranking', label: 'Ranking de Clientes', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportTypes.map((report) => (
          <div key={report.id} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className={`w-12 h-12 ${report.bg} ${report.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <report.icon size={24} />
            </div>
            <h3 className="font-bold text-stone-800 mb-1">{report.label}</h3>
            <p className="text-xs text-stone-500">Gere e exporte dados detalhados em PDF ou Excel.</p>
            <button className="mt-4 flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700">
              <Download size={16} /> Exportar Dados
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <h3 className="font-bold text-stone-800">Faturamento Mensal Detalhado</h3>
          <button className="flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-800">
            <Filter size={16} /> Filtrar Período
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center h-48 bg-stone-50 rounded-xl border-2 border-dashed border-stone-200">
            <p className="text-stone-400 text-sm italic">Selecione os filtros acima para gerar a visualização dos dados.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
