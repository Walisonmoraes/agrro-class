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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Header Moderno */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <Receipt className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    {showOnlyBilled ? 'O.S. Faturadas' : 'Faturamento'}
                  </h1>
                  <p className="text-slate-500 font-medium">
                    {showOnlyBilled ? 'Lista de Ordens de Serviço faturadas' : 'Gestão de faturas e recebimentos'}
                  </p>
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
              
              {!showOnlyBilled && (
                <button 
                  onClick={() => setShowModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 flex items-center gap-2 font-medium"
                >
                  <Plus size={18} />
                  Nova Fatura
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">

      {/* Filtros Modernos */}
      {!showOnlyBilled && (
        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-lg shadow-slate-200/25 p-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por O.S. ou cliente..."
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-900 placeholder-slate-400"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <select
              className="px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-900 font-medium"
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

      {/* Cards de Estatísticas Modernos */}
      {!showOnlyBilled && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <div className="group relative bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-xl hover:shadow-slate-200/25 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-emerald-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <DollarSign className="text-white" size={18} />
                </div>
                <div className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                  +12%
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-slate-900">R$ {(stats.totalBilled || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <p className="text-sm text-slate-600 font-medium">Total Faturado</p>
                <p className="text-xs text-slate-500">Este mês</p>
              </div>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-xl hover:shadow-slate-200/25 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-amber-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                  <Clock className="text-white" size={18} />
                </div>
                <div className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                  8
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-amber-600">R$ {(stats.pendingAmount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <p className="text-sm text-slate-600 font-medium">A Receber</p>
                <p className="text-xs text-slate-500">Pendentes</p>
              </div>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-xl hover:shadow-slate-200/25 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-emerald-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <CheckCircle2 className="text-white" size={18} />
                </div>
                <div className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                  +15%
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-emerald-600">R$ {(stats.paidAmount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <p className="text-sm text-slate-600 font-medium">Recebido</p>
                <p className="text-xs text-slate-500">Pagas</p>
              </div>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-xl hover:shadow-slate-200/25 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                  {(stats.monthlyGrowth || 0) >= 0 ? <TrendingUp className="text-white" size={18} /> : <TrendingDown className="text-white" size={18} />}
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${(stats.monthlyGrowth || 0) >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {(stats.monthlyGrowth || 0) >= 0 ? '+' : ''}{(stats.monthlyGrowth || 0)}%
                </div>
              </div>
              <div className="space-y-1">
                <p className={`text-2xl font-bold ${(stats.monthlyGrowth || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {(stats.monthlyGrowth || 0) >= 0 ? '+' : ''}{(stats.monthlyGrowth || 0)}%
                </p>
                <p className="text-sm text-slate-600 font-medium">Crescimento</p>
                <p className="text-xs text-slate-500">Mês atual</p>
              </div>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-xl hover:shadow-slate-200/25 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 to-slate-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl flex items-center justify-center shadow-lg shadow-slate-500/25">
                  <FileText className="text-white" size={18} />
                </div>
                <div className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">
                  Total
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-slate-900">{stats.totalInvoices || 0}</p>
                <p className="text-sm text-slate-600 font-medium">Total Faturas</p>
                <p className="text-xs text-slate-500">Registradas</p>
              </div>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-xl hover:shadow-slate-200/25 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                  <AlertCircle className="text-white" size={18} />
                </div>
                <div className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                  {stats.pendingInvoices || 0}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-orange-600">{stats.pendingInvoices || 0}</p>
                <p className="text-sm text-slate-600 font-medium">Pendentes</p>
                <p className="text-xs text-slate-500">Aguardando</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabela Moderna */}
      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-lg shadow-slate-200/25 overflow-hidden">
        <div className="p-8 border-b border-slate-200/60">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Receipt className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Ordens de Serviço Faturadas</h2>
              <p className="text-slate-500 mt-1">Lista completa de todas as OS que já foram faturadas no sistema</p>
            </div>
          </div>
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
    </div>
  );
};
