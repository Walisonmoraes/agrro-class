import React, { useState, useEffect } from 'react';
import { Search, Plus, CreditCard, CheckCircle2, Clock, AlertCircle, Receipt, TrendingUp, TrendingDown, Calendar, Filter, X, Eye, Edit, Trash2, DollarSign, FileText } from 'lucide-react';
import { apiFetch } from '../services/api';

interface BillingProps {
  showOnlyBilled?: boolean;
}

export const Billing: React.FC<BillingProps> = ({ showOnlyBilled }) => {
  const [billings, setBillings] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBilling, setSelectedBilling] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [availableOrders, setAvailableOrders] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form state
  const [formData, setFormData] = useState({
    os_id: '',
    price_per_unit: '',
    payment_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    // Modo de gestão de faturamento
    loadBillings();
    loadStats();
    loadAvailableOrders();
    
    // Se showOnlyBilled for true, filtra para mostrar apenas faturas pagas
    if (showOnlyBilled) {
      setStatusFilter('PAID');
    }
  }, [showOnlyBilled]);

  useEffect(() => {
    // Resetar página quando filtros mudam
    setCurrentPage(1);
  }, [searchTerm, statusFilter, itemsPerPage]);

  useEffect(() => {
    // Carregar O.S. disponíveis quando o modal for aberto
    if (showModal) {
      loadAvailableOrders();
    }
  }, [showModal]);

  const loadAvailableOrders = async () => {
    try {
      const data = await apiFetch('/api/service-orders');
      setAvailableOrders(data || []);
    } catch (error) {
      console.error('Erro ao carregar O.S. disponíveis:', error);
      // Definir array vazio para evitar erros de renderização
      setAvailableOrders([]);
    }
  };

  const loadBillings = async () => {
    try {
      setLoading(true);
      console.log('Carregando lista de faturas...');
      const data = await apiFetch('/api/billing/list');
      console.log('Dados recebidos:', data);
      setBillings(data || []);
      console.log('Lista de faturas atualizada:', data?.length || 0, 'itens');
    } catch (error) {
      console.error('Erro ao carregar faturas:', error);
      console.error('Detalhes do erro:', error.message);
      // Definir array vazio para evitar erros de renderização
      setBillings([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      console.log('🔄 Carregando estatísticas...');
      const data = await apiFetch('/api/billing/stats');
      console.log('📊 Dados recebidos da API:', data);
      setStats(data || {
        totalBilled: 0,
        paidAmount: 0,
        pendingAmount: 0,
        totalInvoices: 0,
        pendingInvoices: 0,
        monthlyGrowth: 0
      });
    } catch (error: any) {
      console.error('❌ Erro ao carregar estatísticas:', error);
      setStats({
        totalBilled: 0,
        paidAmount: 0,
        pendingAmount: 0,
        totalInvoices: 0,
        pendingInvoices: 0,
        monthlyGrowth: 0
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/api/billing', {
        method: 'POST',
        body: JSON.stringify({
          os_id: parseInt(formData.os_id),
          price_per_unit: parseFloat(formData.price_per_unit),
          payment_date: formData.payment_date
        })
      });
      
      setShowModal(false);
      setFormData({
        os_id: '',
        price_per_unit: '',
        payment_date: new Date().toISOString().split('T')[0]
      });
      
      loadBillings();
      loadStats();
      alert('Faturamento realizado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao faturar:', error);
      alert('Erro ao faturar: ' + (error.message || 'Erro desconhecido'));
    }
  };

  const handleMarkAsPaid = async (id: number) => {
    try {
      await apiFetch(`/api/billing/${id}/pay`, {
        method: 'PUT'
      });
      loadBillings();
      loadStats();
      alert('Fatura marcada como paga!');
    } catch (error: any) {
      console.error('Erro ao marcar como paga:', error);
      alert('Erro ao marcar como paga: ' + (error.message || 'Erro desconhecido'));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta fatura?')) return;
    
    try {
      await apiFetch(`/api/billing/${id}`, {
        method: 'DELETE'
      });
      loadBillings();
      loadStats();
      alert('Fatura excluída com sucesso!');
    } catch (error: any) {
      console.error('Erro ao excluir fatura:', error);
      alert('Erro ao excluir fatura: ' + (error.message || 'Erro desconhecido'));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID': 
        return <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 w-fit">
          <CheckCircle2 size={12} /> Paga
        </span>;
      case 'PENDING': 
        return <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 w-fit">
          <Clock size={12} /> Pendente
        </span>;
      default: 
        return <span className="px-3 py-1 bg-stone-100 text-stone-500 rounded-full text-xs font-bold uppercase tracking-wider">
          Desconhecido
        </span>;
    }
  };

  const filteredBillings = billings.filter(billing => {
    const matchesSearch = billing.os_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         billing.client_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || billing.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Paginação
  const totalPages = Math.ceil(filteredBillings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBillings = filteredBillings.slice(startIndex, endIndex);

  console.log('Paginação debug:', {
    totalBillings: billings.length,
    filteredBillings: filteredBillings.length,
    itemsPerPage,
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    showPagination: totalPages > 1
  });

  console.log('Filtrando faturas:', {
    total: filteredBillings.length,
    filtradas: paginatedBillings.length,
    currentPage,
    totalPages,
    itemsPerPage,
    searchTerm,
    statusFilter
  });

  // Modo de gestão completa
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">
            {showOnlyBilled ? 'O.S. Faturadas' : 'Faturamento'}
          </h1>
          <p className="text-stone-500 mt-1">
            {showOnlyBilled ? 'Lista de Ordens de Serviço faturadas' : 'Gestão de faturas e recebimentos'}
          </p>
        </div>
        {!showOnlyBilled && (
          <button 
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-600/10"
          >
            <Plus size={20} />
            Nova Fatura
          </button>
        )}
      </div>

      {/* Filters */}
      {!showOnlyBilled && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por O.S. ou cliente..."
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-blue-500"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <select
              className="px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-blue-500"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos Status</option>
              <option value="PENDING">Pendentes</option>
              <option value="PAID">Pagas</option>
            </select>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {!showOnlyBilled && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-stone-500 font-medium">Total Faturado</span>
              <DollarSign className="text-blue-600" size={18} />
            </div>
            <p className="text-xl font-bold text-stone-900">R$ {(stats.totalBilled || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-stone-500 font-medium">A Receber</span>
              <Clock className="text-amber-600" size={18} />
            </div>
            <p className="text-xl font-bold text-amber-600">R$ {(stats.pendingAmount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-stone-500 font-medium">Recebido</span>
              <CheckCircle2 className="text-emerald-600" size={18} />
            </div>
            <p className="text-xl font-bold text-emerald-600">R$ {(stats.paidAmount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-stone-500 font-medium">Crescimento</span>
              {(stats.monthlyGrowth || 0) >= 0 ? <TrendingUp className="text-emerald-600" size={18} /> : <TrendingDown className="text-red-600" size={18} />}
            </div>
            <p className={`text-xl font-bold ${(stats.monthlyGrowth || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {(stats.monthlyGrowth || 0) >= 0 ? '+' : ''}{(stats.monthlyGrowth || 0)}%
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-stone-500 font-medium">Total Faturas</span>
              <FileText className="text-stone-600" size={18} />
            </div>
            <p className="text-xl font-bold text-stone-900">{stats.totalInvoices || 0}</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-stone-500 font-medium">Pendentes</span>
              <AlertCircle className="text-amber-600" size={18} />
            </div>
            <p className="text-xl font-bold text-amber-600">{stats.pendingInvoices || 0}</p>
          </div>
        </div>
      )}

      {/* Lista de OS Faturadas */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="p-6 border-b border-stone-100">
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Receipt className="text-blue-600" size={24} />
            Ordens de Serviço Faturadas
          </h2>
          <p className="text-stone-500 mt-2">Lista completa de todas as OS que já foram faturadas no sistema</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">O.S.</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Cliente</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Produto</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Qtd</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Valor Unit.</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Valor Total</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-stone-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-stone-500 mt-2">Carregando...</p>
                  </td>
                </tr>
              ) : filteredBillings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center">
                    <Receipt className="mx-auto text-stone-300 mb-4" size={48} />
                    <p className="text-stone-500 mb-2">
                      {showOnlyBilled ? 'Nenhuma O.S. faturada encontrada' : 'Nenhuma fatura encontrada'}
                    </p>
                    {billings.length === 0 && !showOnlyBilled && (
                      <p className="text-stone-400 text-sm">
                        💡 Dica: Use o botão "Nova Fatura" acima para criar sua primeira fatura
                      </p>
                    )}
                    {billings.length > 0 && searchTerm === '' && statusFilter === 'all' && (
                      <p className="text-stone-400 text-sm">
                        ℹ️ Todas as faturas foram filtradas. Tente ajustar os filtros.
                      </p>
                    )}
                  </td>
                </tr>
              ) : (
                paginatedBillings.map((billing) => (
                  <tr key={billing.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-bold text-stone-800">{billing.os_number || 'N/A'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-stone-800 text-sm">{billing.client_name || 'N/A'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-stone-600 text-sm">{billing.product_name || 'N/A'}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-stone-600 text-sm">{billing.quantity || 0} {billing.unit || ''}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-stone-800 text-sm">
                        R$ {parseFloat(billing.price_per_unit || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-emerald-600 text-sm">
                        R$ {parseFloat(billing.total_amount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(billing.status || 'UNKNOWN')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button 
                          onClick={() => {
                            setSelectedBilling(billing);
                            setShowDetailsModal(true);
                          }}
                          className="p-1.5 hover:bg-stone-100 rounded-lg transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye size={14} className="text-stone-600" />
                        </button>
                        {billing.status === 'PENDING' && (
                          <button 
                            onClick={() => handleMarkAsPaid(billing.id)}
                            className="p-1.5 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Marcar como paga"
                          >
                            <CheckCircle2 size={14} className="text-emerald-600" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(billing.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir fatura"
                        >
                          <Trash2 size={14} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Paginação */}
        {filteredBillings.length > 0 && (
          <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-stone-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-stone-500">
                  Mostrando {startIndex + 1} a {Math.min(endIndex, filteredBillings.length)} de {filteredBillings.length} resultados
                </span>
                
                <select
                  className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm"
                  value={itemsPerPage}
                  onChange={e => setItemsPerPage(parseInt(e.target.value))}
                >
                  <option value={8}>8 por página</option>
                  <option value={10}>10 por página</option>
                  <option value={25}>25 por página</option>
                  <option value={50}>50 por página</option>
                  <option value={100}>100 por página</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 bg-stone-100 border border-stone-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Anterior
                </button>
                
                <span className="text-sm text-stone-500">
                  Página {currentPage} de {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 bg-stone-100 border border-stone-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próximo →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Nova Fatura */}
      {showModal && !showOnlyBilled && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-stone-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-stone-900">Nova Fatura</h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-stone-200 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-stone-700">Ordem de Serviço</label>
                <select 
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-blue-500"
                  value={formData.os_id}
                  onChange={e => setFormData({...formData, os_id: e.target.value})}
                  required
                >
                  <option value="">Selecione uma O.S.</option>
                  {availableOrders.map((order) => (
                    <option key={order.id} value={order.id}>
                      O.S. {order.os_number} - {order.client_name} - {order.product_name} ({order.quantity} {order.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-stone-700">Valor por Unidade</label>
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
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-stone-700">Data do Pagamento</label>
                <input 
                  type="date"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-blue-500"
                  value={formData.payment_date}
                  onChange={e => setFormData({...formData, payment_date: e.target.value})}
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/10"
              >
                <CreditCard size={20} />
                Gerar Fatura
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
