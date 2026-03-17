import React, { useState, useEffect } from 'react';
import { Plus, Search, Clock, CheckCircle2, AlertCircle, Receipt, X, Save } from 'lucide-react';
import { apiFetch } from '../services/api';

interface OSProps {
  onClassify: (id: number) => void;
  onBill: (id: number) => void;
}

export const ServiceOrders: React.FC<OSProps> = ({ onClassify, onBill }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  // Data for selects
  const [clients, setClients] = useState<any[]>([]);
  const [origins, setOrigins] = useState<any[]>([]);
  const [embarkationPoints, setEmbarkationPoints] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [classifiers, setClassifiers] = useState<any[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    client_id: '',
    origin_id: '',
    embarkation_id: '',
    destination_id: '',
    product_id: '',
    contract_number: '',
    lot_weight: '',
    producer_name: '',
    quantity: '',
    unit: 'KG',
    classifier_id: ''
  });

  useEffect(() => {
    loadOrders();
    loadSelectData();
  }, []);

  const loadOrders = () => apiFetch('/api/service-orders').then(setOrders);
  
  const loadSelectData = () => {
    apiFetch('/api/clients').then(setClients).catch(console.error);
    apiFetch('/api/origins').then(setOrigins).catch(console.error);
    apiFetch('/api/embarkation-points').then(setEmbarkationPoints).catch(console.error);
    apiFetch('/api/destinations').then(setDestinations).catch(console.error);
    apiFetch('/api/products').then(setProducts).catch(console.error);
    apiFetch('/api/classifiers').then(setClassifiers).catch(console.error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.client_id || !formData.product_id || !formData.classifier_id || !formData.lot_weight) {
        alert('Por favor, preencha todos os campos obrigatórios (Cliente, Produto, Classificador e Lote).');
        return;
      }

      await apiFetch('/api/service-orders', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          lot_weight: parseFloat(formData.lot_weight),
          quantity: parseFloat(formData.quantity || formData.lot_weight)
        })
      });
      
      setShowModal(false);
      setFormData({
        client_id: '', origin_id: '', embarkation_id: '', destination_id: '', product_id: '',
        contract_number: '', lot_weight: '', producer_name: '', quantity: '', unit: 'KG', classifier_id: ''
      });
      loadOrders();
      alert('Ordem de Serviço gerada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao gerar OS:', error);
      alert('Erro ao gerar Ordem de Serviço: ' + (error.message || 'Erro desconhecido'));
    }
  };
  
  const handleViewDetails = async (id: number) => {
    setLoadingDetails(true);
    try {
      const data = await apiFetch(`/api/service-orders/${id}`);
      setSelectedOrder(data);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
      alert('Erro ao carregar detalhes da OS');
    } finally {
      setLoadingDetails(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN': return <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><Clock size={10} /> Aberta</span>;
      case 'ANALYZING': return <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><AlertCircle size={10} /> Em Análise</span>;
      case 'FINISHED': return <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><CheckCircle2 size={10} /> Finalizada</span>;
      case 'BILLED': return <span className="px-2 py-1 bg-stone-100 text-stone-500 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><Receipt size={10} /> Faturada</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-stone-500 text-sm font-medium">Gerencie suas ordens de serviço e laudos</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-all shadow-lg shadow-emerald-600/10"
        >
          <Plus size={20} />
          Nova O.S.
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-stone-50 text-stone-500 text-xs uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4">Nº O.S / Data</th>
              <th className="px-6 py-4">Cliente / Produtor</th>
              <th className="px-6 py-4">Embarque / Destino</th>
              <th className="px-6 py-4">Produto / Lote</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-mono font-bold text-stone-800">{order.os_number}</p>
                  <p className="text-xs text-stone-500">{new Date(order.date).toLocaleDateString('pt-BR')}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-stone-800">{order.client_name}</p>
                  <p className="text-xs text-stone-500">{order.origin_name || order.producer_name || 'N/A'}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-stone-800">{order.embarkation_name || 'N/A'}</p>
                  <p className="text-xs text-stone-500">{order.destination_name || 'N/A'}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-stone-800">{order.product_name}</p>
                  <p className="text-xs text-stone-500">{order.lot_weight ? `${order.lot_weight} KG` : 'N/A'}</p>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(order.status)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    {order.status === 'OPEN' && (
                      <button 
                        onClick={() => onClassify(order.id)}
                        className="text-emerald-600 hover:text-emerald-700 font-bold text-xs uppercase tracking-widest"
                      >
                        Classificar
                      </button>
                    )}
                    {order.status === 'FINISHED' && (
                      <button 
                        onClick={() => onBill(order.id)}
                        className="text-blue-600 hover:text-blue-700 font-bold text-xs uppercase tracking-widest"
                      >
                        Faturar
                      </button>
                    )}
                    <button 
                      onClick={() => handleViewDetails(order.id)}
                      className="text-stone-400 hover:text-stone-600 font-bold text-xs uppercase tracking-widest disabled:opacity-50"
                      disabled={loadingDetails}
                    >
                      {loadingDetails && selectedOrder?.id === order.id ? '...' : 'Detalhes'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Nova O.S. */}
      {showModal && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-stone-200">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <h3 className="text-lg font-bold text-stone-800">Registrar Ordem de Serviço</h3>
              <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Cliente</label>
                  <select 
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                    value={formData.client_id}
                    onChange={e => setFormData({...formData, client_id: e.target.value})}
                    required
                  >
                    <option value="">Selecione</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Produto</label>
                  <select 
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                    value={formData.product_id}
                    onChange={e => setFormData({...formData, product_id: e.target.value})}
                    required
                  >
                    <option value="">Selecione</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Origem / Fazenda</label>
                  <select 
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                    value={formData.origin_id}
                    onChange={e => {
                      const origin = origins.find(o => o.id === parseInt(e.target.value));
                      setFormData({
                        ...formData, 
                        origin_id: e.target.value,
                        producer_name: origin ? origin.producer_name : formData.producer_name
                      });
                    }}
                  >
                    <option value="">Selecione</option>
                    {origins.filter(o => !formData.client_id || o.client_id === parseInt(formData.client_id)).map(o => (
                      <option key={o.id} value={o.id}>{o.farm_name} ({o.producer_name})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Embarque</label>
                  <select 
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                    value={formData.embarkation_id}
                    onChange={e => setFormData({...formData, embarkation_id: e.target.value})}
                  >
                    <option value="">Selecione</option>
                    {embarkationPoints.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Destino</label>
                  <select 
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                    value={formData.destination_id}
                    onChange={e => setFormData({...formData, destination_id: e.target.value})}
                  >
                    <option value="">Selecione</option>
                    {destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Contrato</label>
                  <input 
                    type="text"
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                    value={formData.contract_number}
                    onChange={e => setFormData({...formData, contract_number: e.target.value})}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Lote (kg)</label>
                  <input 
                    type="number"
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                    value={formData.lot_weight}
                    onChange={e => setFormData({...formData, lot_weight: e.target.value, quantity: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Produtor</label>
                  <input 
                    type="text"
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                    value={formData.producer_name}
                    onChange={e => setFormData({...formData, producer_name: e.target.value})}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Classificador(a)</label>
                  <select 
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                    value={formData.classifier_id}
                    onChange={e => setFormData({...formData, classifier_id: e.target.value})}
                    required
                  >
                    <option value="">Selecione</option>
                    {classifiers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
                >
                  <Save size={20} />
                  Gerar Ordem de Serviço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detalhes O.S. */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden border border-stone-200">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-800">Detalhes da Ordem de Serviço</h3>
                  <p className="text-xs text-stone-500 font-mono uppercase tracking-widest">{selectedOrder.os_number}</p>
                </div>
              </div>
              <button onClick={() => setShowDetailsModal(false)} className="text-stone-400 hover:text-stone-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-8 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Status Atual</label>
                  <div className="pt-1">{getStatusBadge(selectedOrder.status)}</div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Data de Registro</label>
                  <p className="text-stone-800 font-medium">{new Date(selectedOrder.date).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Classificador Responsável</label>
                  <p className="text-stone-800 font-medium">{selectedOrder.classifier_name}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-stone-100">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider border-l-2 border-emerald-500 pl-2">Informações do Cliente</h4>
                  <div className="space-y-3 bg-stone-50 p-4 rounded-2xl">
                    <div>
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Cliente / Empresa</label>
                      <p className="text-stone-800 font-semibold">{selectedOrder.client_name}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Produtor / Origem</label>
                      <p className="text-stone-800">{selectedOrder.origin_name || selectedOrder.producer_name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Nº Contrato</label>
                      <p className="text-stone-800 font-mono">{selectedOrder.contract_number || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider border-l-2 border-emerald-500 pl-2">Logística e Produto</h4>
                  <div className="space-y-3 bg-stone-50 p-4 rounded-2xl">
                    <div>
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Produto</label>
                      <p className="text-stone-800 font-semibold">{selectedOrder.product_name}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Peso Lote</label>
                        <p className="text-stone-800">{selectedOrder.lot_weight} {selectedOrder.unit}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Quantidade</label>
                        <p className="text-stone-800">{selectedOrder.quantity} {selectedOrder.unit}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Embarque</label>
                        <p className="text-stone-800">{selectedOrder.embarkation_name || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Destino</label>
                        <p className="text-stone-800">{selectedOrder.destination_name || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {(selectedOrder.status === 'FINISHED' || selectedOrder.status === 'BILLED') && (
                <div className="space-y-4 pt-4 border-t border-stone-100">
                  <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider border-l-2 border-amber-500 pl-2">Resultado da Classificação</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-amber-50 p-6 rounded-3xl border border-amber-100">
                    <div className="text-center p-4 bg-white rounded-2xl shadow-sm">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-1">Classificação Final</label>
                      <p className="text-xl font-black text-amber-600">{selectedOrder.final_classification}</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-2xl shadow-sm">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-1">Umidade</label>
                      <p className="text-xl font-black text-stone-800">{selectedOrder.humidity}%</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-2xl shadow-sm">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-1">Impurezas</label>
                      <p className="text-xl font-black text-stone-800">{selectedOrder.impurities}%</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedOrder.status === 'BILLED' && (
                <div className="space-y-4 pt-4 border-t border-stone-100">
                  <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider border-l-2 border-blue-500 pl-2">Informações de Faturamento</h4>
                  <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex items-center justify-between">
                    <div>
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-1">Valor Total Faturado</label>
                      <p className="text-2xl font-black text-blue-600">R$ {selectedOrder.billed_amount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="w-12 h-12 bg-white text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                      <Receipt size={24} />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-stone-100 bg-stone-50 flex justify-end">
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="px-8 py-3 bg-stone-800 hover:bg-stone-900 text-white font-bold rounded-xl transition-all shadow-lg shadow-stone-800/20"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
