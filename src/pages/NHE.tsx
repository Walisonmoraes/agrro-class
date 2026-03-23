import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar, DollarSign, FileText, User, MapPin, Clock, AlertTriangle, Edit2, Trash2, Eye, Download } from 'lucide-react';

interface NHERecord {
  id: string;
  date: string;
  value: number;
  reason: string;
  orderId: string;
  orderCode: string;
  classifierId: string;
  classifierName: string;
  embarkationPointId: string;
  embarkationPointName: string;
  embarkationPointAddress: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  observations?: string;
}

export const NHE = () => {
  const [nheRecords, setNheRecords] = useState<NHERecord[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  
  const [form, setForm] = useState({
    date: '',
    value: '',
    reason: '',
    orderId: '',
    classifierId: '',
    embarkationPointId: '',
    observations: ''
  });

  // Mock data para simular NHEs
  const mockNHEs: NHERecord[] = [
    {
      id: '1',
      date: '2024-01-15',
      value: 500.00,
      reason: 'Não embarque disponível no ponto - chuva intensa',
      orderId: 'ORD-001',
      orderCode: 'ORD-2024-001',
      classifierId: 'CLASS-001',
      classifierName: 'João Silva',
      embarkationPointId: 'POINT-001',
      embarkationPointName: 'Fazenda São José',
      embarkationPointAddress: 'Rodovia BR-050, Km 123 - Uberlândia/MG',
      status: 'approved',
      createdAt: '2024-01-15T10:30:00',
      approvedAt: '2024-01-15T14:20:00',
      approvedBy: 'Maria Santos',
      observations: 'Classificador aguardou 4 horas no local, mas não houve condições de operação'
    },
    {
      id: '2',
      date: '2024-01-14',
      value: 350.00,
      reason: 'Equipamento de classificação com defeito',
      orderId: 'ORD-002',
      orderCode: 'ORD-2024-002',
      classifierId: 'CLASS-002',
      classifierName: 'Pedro Costa',
      embarkationPointId: 'POINT-002',
      embarkationPointName: 'Armazém Centro-Oeste',
      embarkationPointAddress: 'Av. Brasil, 1500 - Goiânia/GO',
      status: 'pending',
      createdAt: '2024-01-14T09:15:00',
      observations: 'Falha técnica no equipamento impossibilitou a classificação'
    },
    {
      id: '3',
      date: '2024-01-13',
      value: 500.00,
      reason: 'Falta de energia no ponto de embarque',
      orderId: 'ORD-003',
      orderCode: 'ORD-2024-003',
      classifierId: 'CLASS-003',
      classifierName: 'Carlos Oliveira',
      embarkationPointId: 'POINT-003',
      embarkationPointName: 'Terminal Rio Verde',
      embarkationPointAddress: 'Rodovia BR-364, Km 200 - Rio Verde/GO',
      status: 'paid',
      createdAt: '2024-01-13T08:45:00',
      approvedAt: '2024-01-13T16:30:00',
      approvedBy: 'Ana Paula',
      observations: 'Ponto sem energia elétrica durante todo o período da manhã'
    },
    {
      id: '4',
      date: '2024-01-12',
      value: 350.00,
      reason: 'Produto não disponível para classificação',
      orderId: 'ORD-004',
      orderCode: 'ORD-2024-004',
      classifierId: 'CLASS-001',
      classifierName: 'João Silva',
      embarkationPointId: 'POINT-004',
      embarkationPointName: 'Porto Seco Anápolis',
      embarkationPointAddress: 'Distrito Agroindustrial - Anápolis/GO',
      status: 'rejected',
      createdAt: '2024-01-12T11:20:00',
      observations: 'Classificador não compareceu ao ponto - justificativa não aceita'
    }
  ];

  // Mock data para selects
  const mockOrders = [
    { id: 'ORD-001', code: 'ORD-2024-001', pointId: 'POINT-001', pointName: 'Fazenda São José' },
    { id: 'ORD-002', code: 'ORD-2024-002', pointId: 'POINT-002', pointName: 'Armazém Centro-Oeste' },
    { id: 'ORD-003', code: 'ORD-2024-003', pointId: 'POINT-003', pointName: 'Terminal Rio Verde' },
    { id: 'ORD-004', code: 'ORD-2024-004', pointId: 'POINT-004', pointName: 'Porto Seco Anápolis' }
  ];

  const mockClassifiers = [
    { id: 'CLASS-001', name: 'João Silva' },
    { id: 'CLASS-002', name: 'Pedro Costa' },
    { id: 'CLASS-003', name: 'Carlos Oliveira' },
    { id: 'CLASS-004', name: 'Roberto Mendes' }
  ];

  const mockEmbarkationPoints = [
    { id: 'POINT-001', name: 'Fazenda São José', address: 'Rodovia BR-050, Km 123 - Uberlândia/MG' },
    { id: 'POINT-002', name: 'Armazém Centro-Oeste', address: 'Av. Brasil, 1500 - Goiânia/GO' },
    { id: 'POINT-003', name: 'Terminal Rio Verde', address: 'Rodovia BR-364, Km 200 - Rio Verde/GO' },
    { id: 'POINT-004', name: 'Porto Seco Anápolis', address: 'Distrito Agroindustrial - Anápolis/GO' }
  ];

  useEffect(() => {
    loadNHEs();
  }, []);

  const loadNHEs = async () => {
    try {
      setIsLoading(true);
      // Simulando carregamento
      setTimeout(() => {
        setNheRecords(mockNHEs);
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Erro ao carregar NHEs', err);
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedOrder = mockOrders.find(o => o.id === form.orderId);
      const selectedClassifier = mockClassifiers.find(c => c.id === form.classifierId);
      const selectedPoint = mockEmbarkationPoints.find(p => p.id === form.embarkationPointId);

      const newNHE: NHERecord = {
        id: editingId || Date.now().toString(),
        date: form.date,
        value: parseFloat(form.value),
        reason: form.reason,
        orderId: form.orderId,
        orderCode: selectedOrder?.code || '',
        classifierId: form.classifierId,
        classifierName: selectedClassifier?.name || '',
        embarkationPointId: form.embarkationPointId,
        embarkationPointName: selectedPoint?.name || '',
        embarkationPointAddress: selectedPoint?.address || '',
        status: 'pending',
        createdAt: new Date().toISOString(),
        observations: form.observations
      };

      if (editingId) {
        setNheRecords(nheRecords.map(nhe => nhe.id === editingId ? newNHE : nhe));
      } else {
        setNheRecords([newNHE, ...nheRecords]);
      }
      
      setShowModal(false);
      setEditingId(null);
      setForm({
        date: '',
        value: '',
        reason: '',
        orderId: '',
        classifierId: '',
        embarkationPointId: '',
        observations: ''
      });
    } catch (err) {
      console.error('Erro ao salvar NHE', err);
    }
  };

  const handleEdit = (nhe: NHERecord) => {
    setEditingId(nhe.id);
    setForm({
      date: nhe.date,
      value: nhe.value.toString(),
      reason: nhe.reason,
      orderId: nhe.orderId,
      classifierId: nhe.classifierId,
      embarkationPointId: nhe.embarkationPointId,
      observations: nhe.observations || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este NHE?')) {
      setNheRecords(nheRecords.filter(nhe => nhe.id !== id));
    }
  };

  const handleStatusChange = async (id: string, newStatus: NHERecord['status']) => {
    setNheRecords(nheRecords.map(nhe => 
      nhe.id === id 
        ? { 
            ...nhe, 
            status: newStatus,
            approvedAt: newStatus === 'approved' || newStatus === 'paid' ? new Date().toISOString() : undefined,
            approvedBy: newStatus === 'approved' || newStatus === 'paid' ? 'Usuário Atual' : undefined
          }
        : nhe
    ));
  };

  const getStatusColor = (status: NHERecord['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: NHERecord['status']) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'approved': return 'Aprovado';
      case 'rejected': return 'Rejeitado';
      case 'paid': return 'Pago';
      default: return status;
    }
  };

  const filteredRecords = nheRecords.filter(nhe => {
    const matchesSearch = 
      nhe.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nhe.classifierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nhe.embarkationPointName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nhe.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || nhe.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalValue = filteredRecords.reduce((sum, nhe) => sum + nhe.value, 0);
  const pendingCount = filteredRecords.filter(nhe => nhe.status === 'pending').length;
  const approvedCount = filteredRecords.filter(nhe => nhe.status === 'approved').length;
  const paidCount = filteredRecords.filter(nhe => nhe.status === 'paid').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 flex flex-col">
      {/* Header Moderno */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-sm flex-shrink-0">
        <div className="px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                  <DollarSign className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    NHE - Não Houve Embarque
                  </h1>
                  <p className="text-slate-500 font-medium">Gestão de diárias e cadências mínimas</p>
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
              
              <button 
                onClick={() => {
                  setEditingId(null);
                  setForm({
                    date: new Date().toISOString().split('T')[0],
                    value: '',
                    reason: '',
                    orderId: '',
                    classifierId: '',
                    embarkationPointId: '',
                    observations: ''
                  });
                  setShowModal(true);
                }}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-200 flex items-center gap-2 font-medium"
              >
                <Plus size={18} />
                Novo NHE
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8 flex-1 pb-16 min-h-0">
        {/* Cards Estatísticos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-lg shadow-slate-200/25">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <DollarSign className="text-amber-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-slate-900">
                R$ {totalValue.toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-slate-600 font-medium">Valor Total</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-lg shadow-slate-200/25">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="text-yellow-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-slate-900">{pendingCount}</span>
            </div>
            <p className="text-sm text-slate-600 font-medium">Pendentes</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-lg shadow-slate-200/25">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="text-blue-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-slate-900">{approvedCount}</span>
            </div>
            <p className="text-sm text-slate-600 font-medium">Aprovados</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-lg shadow-slate-200/25">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="text-green-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-slate-900">{paidCount}</span>
            </div>
            <p className="text-sm text-slate-600 font-medium">Pagos</p>
          </div>
        </div>

        {/* Container Moderno */}
        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-lg shadow-slate-200/25 overflow-hidden flex-1 flex flex-col min-h-0">
          <div className="p-8 border-b border-slate-200/60">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                  <DollarSign className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Registros de NHE</h2>
                  <p className="text-slate-500 mt-1">Diárias e cadências mínimas registradas</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Pesquisar NHEs..." 
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500 transition-all text-sm"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <select 
                  className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500 transition-all text-sm"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option value="all">Todos Status</option>
                  <option value="pending">Pendentes</option>
                  <option value="approved">Aprovados</option>
                  <option value="rejected">Rejeitados</option>
                  <option value="paid">Pagos</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-8 flex-1 flex flex-col min-h-0">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
                <p className="text-slate-500 mt-4">Carregando NHEs...</p>
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="mx-auto text-slate-300 size-12 mb-4" />
                <p className="text-slate-500">Nenhum NHE encontrado</p>
              </div>
            ) : (
              <div className="overflow-x-auto flex-1 min-h-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Data</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Ordem</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Classificador</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Ponto de Embarque</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Motivo</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Valor</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((nhe) => (
                      <tr key={nhe.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-slate-400" />
                            <span className="text-sm font-medium text-slate-900">
                              {new Date(nhe.date).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="font-medium text-slate-900">{nhe.orderCode}</div>
                            <div className="text-xs text-slate-500">ID: {nhe.orderId}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <User size={16} className="text-slate-400" />
                            <span className="text-sm text-slate-900">{nhe.classifierName}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <MapPin size={14} className="text-slate-400" />
                              <span className="text-sm font-medium text-slate-900">{nhe.embarkationPointName}</span>
                            </div>
                            <div className="text-xs text-slate-500">{nhe.embarkationPointAddress}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="max-w-xs">
                            <p className="text-sm text-slate-900 line-clamp-2">{nhe.reason}</p>
                            {nhe.observations && (
                              <p className="text-xs text-slate-500 mt-1 line-clamp-1">{nhe.observations}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <DollarSign size={16} className="text-green-600" />
                            <span className="font-semibold text-slate-900">
                              R$ {nhe.value.toFixed(2)}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(nhe.status)}`}>
                            {getStatusLabel(nhe.status)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleEdit(nhe)}
                              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit2 size={14} />
                            </button>
                            
                            {nhe.status === 'pending' && (
                              <>
                                <button 
                                  onClick={() => handleStatusChange(nhe.id, 'approved')}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Aprovar"
                                >
                                  <FileText size={14} />
                                </button>
                                <button 
                                  onClick={() => handleStatusChange(nhe.id, 'rejected')}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Rejeitar"
                                >
                                  <AlertTriangle size={14} />
                                </button>
                              </>
                            )}
                            
                            {nhe.status === 'approved' && (
                              <button 
                                onClick={() => handleStatusChange(nhe.id, 'paid')}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Marcar como Pago"
                              >
                                <DollarSign size={14} />
                              </button>
                            )}
                            
                            <button 
                              onClick={() => handleDelete(nhe.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Excluir"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8 border-b border-slate-200/60">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">
                  {editingId ? 'Editar NHE' : 'Novo NHE - Não Houve Embarque'}
                </h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <Trash2 size={20} className="text-slate-400" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Data *</label>
                  <input 
                    type="date"
                    required
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500 transition-all"
                    value={form.date}
                    onChange={e => setForm({...form, date: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Valor (R$) *</label>
                  <input 
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="350.00 ou 500.00"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500 transition-all"
                    value={form.value}
                    onChange={e => setForm({...form, value: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Ordem de Serviço *</label>
                  <select 
                    required
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500 transition-all"
                    value={form.orderId}
                    onChange={e => setForm({...form, orderId: e.target.value, embarkationPointId: mockOrders.find(o => o.id === e.target.value)?.pointId || ''})}
                  >
                    <option value="">Selecione uma ordem</option>
                    {mockOrders.map(order => (
                      <option key={order.id} value={order.id}>
                        {order.code} - {order.pointName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Classificador *</label>
                  <select 
                    required
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500 transition-all"
                    value={form.classifierId}
                    onChange={e => setForm({...form, classifierId: e.target.value})}
                  >
                    <option value="">Selecione um classificador</option>
                    {mockClassifiers.map(classifier => (
                      <option key={classifier.id} value={classifier.id}>
                        {classifier.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Ponto de Embarque *</label>
                  <select 
                    required
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500 transition-all"
                    value={form.embarkationPointId}
                    onChange={e => setForm({...form, embarkationPointId: e.target.value})}
                  >
                    <option value="">Selecione um ponto</option>
                    {mockEmbarkationPoints.map(point => (
                      <option key={point.id} value={point.id}>
                        {point.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Motivo do NHE *</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="Descreva o motivo pelo qual não houve embarque (ex: chuva intensa, equipamento com defeito, falta de energia, etc.)"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500 transition-all resize-none"
                  value={form.reason}
                  onChange={e => setForm({...form, reason: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Observações Adicionais</label>
                <textarea 
                  rows={2}
                  placeholder="Informações complementares sobre o ocorrido"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500 transition-all resize-none"
                  value={form.observations}
                  onChange={e => setForm({...form, observations: e.target.value})}
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/25 hover:shadow-xl hover:from-amber-600 hover:to-amber-700"
                >
                  <Plus size={20} />
                  {editingId ? 'Atualizar NHE' : 'Registrar NHE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
