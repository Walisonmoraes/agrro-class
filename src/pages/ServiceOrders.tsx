import React, { useState, useEffect } from 'react';
import { Plus, Search, Clock, CheckCircle2, AlertCircle, Receipt, X, Save, Edit, Trash2, Eye } from 'lucide-react';
import { apiFetch } from '../services/api';

interface OSProps {
  onClassify: (id: number) => void;
  onBill: (id: number) => void;
}

export const ServiceOrders: React.FC<OSProps> = ({ onClassify, onBill }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any>(null);
  
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

  // Edit form state
  const [editFormData, setEditFormData] = useState({
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
    
    // Debug - verificar dados carregados
    setTimeout(() => {
      console.log('Dados dos selects:', {
        clients: clients.length,
        products: products.length,
        origins: origins.length,
        embarkationPoints: embarkationPoints.length,
        destinations: destinations.length,
        classifiers: classifiers.length
      });
    }, 1000);
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

  const handleEdit = async (id: number) => {
    try {
      const data = await apiFetch(`/api/service-orders/${id}`);
      console.log('Dados da OS para edição:', data); // Debug
      setEditingOrder(data);
      setEditFormData({
        client_id: data.client_id?.toString() || '',
        origin_id: data.origin_id?.toString() || '',
        embarkation_id: data.embarkation_id?.toString() || '',
        destination_id: data.destination_id?.toString() || '',
        product_id: data.product_id?.toString() || '',
        contract_number: data.contract_number || '',
        lot_weight: data.lot_weight?.toString() || '',
        producer_name: data.producer_name || '',
        quantity: data.quantity?.toString() || '',
        unit: data.unit || 'KG',
        classifier_id: data.classifier_id?.toString() || ''
      });
      setShowEditModal(true);
    } catch (error) {
      console.error('Erro ao carregar OS para edição:', error);
      alert('Erro ao carregar OS para edição');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    
    try {
      await apiFetch(`/api/service-orders/${editingOrder.id}`, {
        method: 'PUT',
        body: JSON.stringify(editFormData)
      });
      
      setShowEditModal(false);
      setEditingOrder(null);
      loadOrders();
      alert('Ordem de Serviço atualizada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao atualizar OS:', error);
      alert('Erro ao atualizar Ordem de Serviço: ' + (error.message || 'Erro desconhecido'));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta Ordem de Serviço? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    try {
      await apiFetch(`/api/service-orders/${id}`, {
        method: 'DELETE'
      });
      
      loadOrders();
      alert('Ordem de Serviço excluída com sucesso!');
    } catch (error: any) {
      console.error('Erro ao excluir OS:', error);
      alert('Erro ao excluir Ordem de Serviço: ' + (error.message || 'Erro desconhecido'));
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
                  <div className="flex items-center gap-2">
                    {order.status === 'OPEN' && (
                      <button 
                        onClick={() => onClassify(order.id)}
                        className="text-emerald-600 hover:text-emerald-700 p-2 rounded-lg hover:bg-emerald-50 transition-colors"
                        title="Classificar"
                      >
                        <CheckCircle2 size={16} />
                      </button>
                    )}
                    {order.status === 'FINISHED' && (
                      <button 
                        onClick={() => onBill(order.id)}
                        className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Faturar"
                      >
                        <Receipt size={16} />
                      </button>
                    )}
                    <button 
                      onClick={() => handleEdit(order.id)}
                      className="text-amber-600 hover:text-amber-700 p-2 rounded-lg hover:bg-amber-50 transition-colors"
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleViewDetails(order.id)}
                      className="text-stone-400 hover:text-stone-600 p-2 rounded-lg hover:bg-stone-50 transition-colors disabled:opacity-50"
                      disabled={loadingDetails}
                      title="Detalhes"
                    >
                      <Eye size={16} />
                    </button>
                    {order.status === 'OPEN' && (
                      <button 
                        onClick={() => handleDelete(order.id)}
                        className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
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

      {/* Modal Editar O.S. */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-stone-100 bg-stone-50">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-stone-900">Editar Ordem de Serviço</h2>
                <button 
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingOrder(null);
                  }}
                  className="p-2 hover:bg-stone-200 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleUpdate} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Debug - mostrar dados carregados */}
              {editingOrder && (
                <div className="bg-amber-50 p-4 rounded-lg mb-4">
                  <p className="text-xs text-amber-800">Debug - Editando OS: {editingOrder.os_number}</p>
                  <p className="text-xs text-amber-600">Cliente ID: {editFormData.client_id} | Produto ID: {editFormData.product_id}</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Cliente</label>
                  <select 
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                    value={editFormData.client_id}
                    onChange={e => {
                      console.log('Cliente alterado:', e.target.value);
                      setEditFormData({...editFormData, client_id: e.target.value});
                    }}
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
                    value={editFormData.product_id}
                    onChange={e => {
                      console.log('Produto alterado:', e.target.value);
                      setEditFormData({...editFormData, product_id: e.target.value});
                    }}
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
                    value={editFormData.origin_id}
                    onChange={e => {
                      const origin = origins.find(o => o.id === parseInt(e.target.value));
                      setEditFormData({
                        ...editFormData, 
                        origin_id: e.target.value,
                        producer_name: origin ? origin.producer_name : editFormData.producer_name
                      });
                    }}
                  >
                    <option value="">Selecione</option>
                    {origins.filter(o => !editFormData.client_id || o.client_id === parseInt(editFormData.client_id)).map(o => (
                      <option key={o.id} value={o.id}>{o.farm_name} ({o.producer_name})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Ponto de Embarque</label>
                  <select 
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                    value={editFormData.embarkation_id}
                    onChange={e => setEditFormData({...editFormData, embarkation_id: e.target.value})}
                  >
                    <option value="">Selecione</option>
                    {embarkationPoints.map(ep => <option key={ep.id} value={ep.id}>{ep.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Destino</label>
                  <select 
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                    value={editFormData.destination_id}
                    onChange={e => setEditFormData({...editFormData, destination_id: e.target.value})}
                  >
                    <option value="">Selecione</option>
                    {destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Classificador</label>
                  <select 
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                    value={editFormData.classifier_id}
                    onChange={e => setEditFormData({...editFormData, classifier_id: e.target.value})}
                    required
                  >
                    <option value="">Selecione</option>
                    {classifiers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Nº Contrato</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                    value={editFormData.contract_number}
                    onChange={e => setEditFormData({...editFormData, contract_number: e.target.value})}
                    placeholder="Número do contrato"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Produtor</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                    value={editFormData.producer_name}
                    onChange={e => setEditFormData({...editFormData, producer_name: e.target.value})}
                    placeholder="Nome do produtor"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Quantidade</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                    value={editFormData.quantity}
                    onChange={e => setEditFormData({...editFormData, quantity: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Unidade</label>
                  <select 
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                    value={editFormData.unit}
                    onChange={e => setEditFormData({...editFormData, unit: e.target.value})}
                  >
                    <option value="KG">Quilogramas (KG)</option>
                    <option value="TON">Toneladas (TON)</option>
                    <option value="SACA">Sacas (SACA)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Peso do Lote</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                    value={editFormData.lot_weight}
                    onChange={e => setEditFormData({...editFormData, lot_weight: e.target.value})}
                    placeholder="Peso total do lote"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-stone-100">
                <button 
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingOrder(null);
                  }}
                  className="px-8 py-3 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
                >
                  <Save size={18} />
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
