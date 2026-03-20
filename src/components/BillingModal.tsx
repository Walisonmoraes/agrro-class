import React, { useState, useEffect } from 'react';
import { X, CreditCard, AlertCircle } from 'lucide-react';
import { apiFetch } from '../services/api';

interface BillingModalProps {
  osId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export const BillingModal: React.FC<BillingModalProps> = ({ osId, onClose, onSuccess }) => {
  const [osData, setOsData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    price_per_unit: '',
    payment_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadOSData();
  }, [osId]);

  const loadOSData = async () => {
    try {
      const data = await apiFetch(`/api/service-orders/${osId}`);
      setOsData(data);
    } catch (error) {
      console.error('Erro ao carregar dados da OS:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await apiFetch('/api/billing', {
        method: 'POST',
        body: JSON.stringify({
          os_id: osId,
          price_per_unit: parseFloat(formData.price_per_unit),
          payment_date: formData.payment_date
        })
      });
      
      // Mostrar mensagem de sucesso
      alert('✅ Faturamento realizado com sucesso!\n\nA O.S. foi movida para a página de faturamento e não aparece mais na lista de ordens de serviço.');
      
      onSuccess();
    } catch (error: any) {
      console.error('Erro ao faturar:', error);
      alert('Erro ao faturar: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  if (!osData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-stone-600">Carregando dados da OS...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-stone-100 bg-stone-50">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-stone-900">Faturamento de O.S.</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-stone-200 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-8 max-h-[80vh] overflow-y-auto">
          {/* Informações da OS */}
          <div className="bg-stone-50 p-6 rounded-2xl mb-6">
            <h3 className="text-lg font-semibold text-stone-900 mb-4">Dados da Ordem de Serviço</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-stone-500">Nº O.S.</p>
                <p className="font-mono font-bold text-stone-800">{osData.os_number}</p>
              </div>
              <div>
                <p className="text-sm text-stone-500">Cliente</p>
                <p className="font-semibold text-stone-800">{osData.client_name}</p>
              </div>
              <div>
                <p className="text-sm text-stone-500">Produto</p>
                <p className="font-semibold text-stone-800">{osData.product_name}</p>
              </div>
              <div>
                <p className="text-sm text-stone-500">Quantidade</p>
                <p className="font-semibold text-stone-800">{osData.quantity} {osData.unit}</p>
              </div>
              <div>
                <p className="text-sm text-stone-500">Status</p>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-wider">
                  Finalizada
                </span>
              </div>
              <div>
                <p className="text-sm text-stone-500">Data</p>
                <p className="font-semibold text-stone-800">{new Date(osData.date).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          </div>

          {/* Formulário de Faturamento */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-blue-600 mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-semibold text-blue-900">Atenção</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Após confirmar o faturamento, a O.S. será movida para o status "Faturada" e não poderá mais ser alterada.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-700">Valor por Unidade (TON/SACA)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-bold">R$</span>
                <input 
                  type="number" 
                  step="0.01"
                  className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-blue-500"
                  value={formData.price_per_unit}
                  onChange={e => setFormData({...formData, price_per_unit: e.target.value})}
                  placeholder="0,00"
                  required
                  disabled={loading}
                />
              </div>
              {formData.price_per_unit && (
                <p className="text-sm text-stone-600 mt-2">
                  Valor Total: <span className="font-bold text-emerald-600">
                    R$ {(parseFloat(formData.price_per_unit) * osData.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-700">Data do Pagamento</label>
              <input 
                type="date"
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-blue-500"
                value={formData.payment_date}
                onChange={e => setFormData({...formData, payment_date: e.target.value})}
                required
                disabled={loading}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-xl transition-all disabled:opacity-50"
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                disabled={loading || !formData.price_per_unit}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processando...
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    Confirmar Faturamento
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
