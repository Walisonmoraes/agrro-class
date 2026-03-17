import React, { useState } from 'react';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { apiFetch } from '../services/api';

export const Billing = ({ osId, onBack }: { osId: number, onBack: () => void }) => {
  const [price, setPrice] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch('/api/billing', {
      method: 'POST',
      body: JSON.stringify({ os_id: osId, price_per_unit: parseFloat(price) })
    });
    onBack();
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-stone-500 hover:text-stone-800 transition-all font-medium">
        <ArrowLeft size={20} /> Voltar
      </button>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200">
        <h2 className="text-2xl font-bold text-stone-900 mb-6">Faturamento de O.S.</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-stone-700">Valor por Unidade (TON/SACA)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-bold">R$</span>
              <input 
                type="number" step="0.01"
                className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="0,00"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/10"
          >
            <CreditCard size={20} />
            Confirmar Faturamento
          </button>
        </form>
      </div>
    </div>
  );
};
