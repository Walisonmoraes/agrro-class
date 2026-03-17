import React from 'react';
import { FileText, Plus, Search, Filter, Download, Eye } from 'lucide-react';

export const Faturas = () => {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Faturas</h1>
            <p className="text-stone-500 mt-1">Gerencie as faturas emitidas para clientes</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors">
              <Plus size={18} />
              Nova Fatura
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-stone-200 px-8 py-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input
              type="text"
              placeholder="Buscar faturas..."
              className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors">
            <Filter size={18} />
            Filtros
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-stone-200">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-stone-900">Faturas Registradas</h2>
              <span className="text-sm text-stone-500">0 faturas encontradas</span>
            </div>
          </div>

          {/* Empty State */}
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-stone-100 rounded-2xl text-stone-400 mb-4">
              <FileText size={32} />
            </div>
            <h3 className="text-lg font-semibold text-stone-900 mb-2">Nenhuma fatura encontrada</h3>
            <p className="text-stone-500 mb-6">Nenhuma fatura foi registrada ainda. Comece emitindo sua primeira fatura.</p>
            <button className="flex items-center gap-2 mx-auto px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors">
              <Plus size={18} />
              Emitir Primeira Fatura
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
