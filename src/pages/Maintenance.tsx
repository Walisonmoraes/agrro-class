import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  MapPin,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
  Car,
  Settings,
  FileText,
  DollarSign,
  AlertCircle
} from 'lucide-react';

interface Maintenance {
  id: string;
  vehiclePlate: string;
  vehicleModel: string;
  vehicleBrand: string;
  vehicleType: 'truck' | 'van' | 'car' | 'motorcycle';
  type: 'preventive' | 'corrective' | 'predictive' | 'emergency';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  scheduledDate: string;
  estimatedDuration: number;
  actualDuration?: number;
  completedDate?: string;
  mechanic: string;
  cost: number;
  parts: string[];
  observations: string;
  nextMaintenance?: string;
}

export const Maintenance: React.FC = () => {
  const [maintenanceRecords, setMaintenanceRecords] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<Maintenance | null>(null);
  const [showNewMaintenanceModal, setShowNewMaintenanceModal] = useState(false);

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      const mockMaintenance: Maintenance[] = [
        {
          id: '1',
          vehiclePlate: 'ABC-1234',
          vehicleModel: 'Actros 1846',
          vehicleBrand: 'Mercedes-Benz',
          vehicleType: 'truck',
          type: 'preventive',
          status: 'completed',
          priority: 'medium',
          description: 'Revisão geral do motor e sistema de freios',
          scheduledDate: '2024-03-15',
          estimatedDuration: 4,
          actualDuration: 3.5,
          completedDate: '2024-03-15',
          mechanic: 'João Silva',
          cost: 2500.00,
          parts: ['Óleo de motor 5W-30', 'Filtro de óleo', 'Pastilhas de freio'],
          observations: 'Veículo em bom estado, próxima revisão em 6 meses',
          nextMaintenance: '2024-09-15'
        },
        {
          id: '2',
          vehiclePlate: 'DEF-5678',
          vehicleModel: 'Sprinter',
          vehicleBrand: 'Mercedes-Benz',
          vehicleType: 'van',
          type: 'corrective',
          status: 'in_progress',
          priority: 'high',
          description: 'Troca de embreagem e reparo do sistema de arrefecimento',
          scheduledDate: '2024-03-20',
          estimatedDuration: 6,
          mechanic: 'Carlos Santos',
          cost: 1800.00,
          parts: ['Kit de embreagem', 'Radiador', 'Fluido de arrefecimento'],
          observations: 'Veículo em manutenção, previsão de conclusão amanhã'
        },
        {
          id: '3',
          vehiclePlate: 'GHI-9012',
          vehicleModel: 'FH 540',
          vehicleBrand: 'Volvo',
          vehicleType: 'truck',
          type: 'preventive',
          status: 'scheduled',
          priority: 'low',
          description: 'Revisão preventiva programada',
          scheduledDate: '2024-03-25',
          estimatedDuration: 8,
          mechanic: 'Maria Oliveira',
          cost: 3200.00,
          parts: ['Filtros diversos', 'Lubrificantes', 'Juntas'],
          observations: 'Manutenção preventiva completa programada'
        },
        {
          id: '4',
          vehiclePlate: 'JKL-3456',
          vehicleModel: 'Ducato',
          vehicleBrand: 'Fiat',
          vehicleType: 'van',
          type: 'emergency',
          status: 'completed',
          priority: 'critical',
          description: 'Falha no sistema de injeção eletrônica',
          scheduledDate: '2024-03-18',
          estimatedDuration: 3,
          actualDuration: 5,
          completedDate: '2024-03-18',
          mechanic: 'Pedro Costa',
          cost: 950.00,
          parts: ['Bico injetor', 'Módulo de injeção'],
          observations: 'Problema resolvido, veículo testado e liberado'
        },
        {
          id: '5',
          vehiclePlate: 'MNO-7890',
          vehicleModel: 'Titan',
          vehicleBrand: 'Honda',
          vehicleType: 'motorcycle',
          type: 'predictive',
          status: 'scheduled',
          priority: 'medium',
          description: 'Análise preditiva do motor',
          scheduledDate: '2024-03-28',
          estimatedDuration: 2,
          mechanic: 'Lucas Ferreira',
          cost: 450.00,
          parts: ['Sensores de análise'],
          observations: 'Manutenção preditiva para detectar possíveis falhas futuras'
        }
      ];

      setMaintenanceRecords(mockMaintenance);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredMaintenance = maintenanceRecords.filter(record => {
    const matchesSearch = 
      record.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.vehicleBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.mechanic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    const matchesType = typeFilter === 'all' || record.type === typeFilter;
    const matchesPriority = priorityFilter === 'all' || record.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Agendada';
      case 'in_progress': return 'Em Andamento';
      case 'completed': return 'Concluída';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'preventive': return 'Preventiva';
      case 'corrective': return 'Corretiva';
      case 'predictive': return 'Preditiva';
      case 'emergency': return 'Emergencial';
      default: return type;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'low': return 'Baixa';
      case 'medium': return 'Média';
      case 'high': return 'Alta';
      case 'critical': return 'Crítica';
      default: return priority;
    }
  };

  const getVehicleIcon = (type: string) => {
    return <Car size={20} />;
  };

  const calculateTotalCost = () => {
    return maintenanceRecords.reduce((total, record) => total + record.cost, 0);
  };

  const getMaintenanceStats = () => {
    const scheduled = maintenanceRecords.filter(r => r.status === 'scheduled').length;
    const inProgress = maintenanceRecords.filter(r => r.status === 'in_progress').length;
    const completed = maintenanceRecords.filter(r => r.status === 'completed').length;
    const critical = maintenanceRecords.filter(r => r.priority === 'critical').length;

    return { scheduled, inProgress, completed, critical };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                  <Wrench className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Frota - Manutenção
                  </h1>
                  <p className="text-slate-500 font-medium">Gestão completa de manutenções da frota</p>
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
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar manutenções..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-500 transition-all shadow-sm w-64"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total de Manutenções</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{maintenanceRecords.length}</p>
                <p className="text-xs text-amber-600 mt-2">Registradas</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Wrench className="text-amber-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Agendadas</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {getMaintenanceStats().scheduled}
                </p>
                <p className="text-xs text-blue-600 mt-2">Pendentes</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Em Andamento</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">
                  {getMaintenanceStats().inProgress}
                </p>
                <p className="text-xs text-amber-600 mt-2">Executando</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Clock className="text-amber-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Críticas</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {getMaintenanceStats().critical}
                </p>
                <p className="text-xs text-red-600 mt-2">Urgentes</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Filtros</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Filter size={16} />
              <span>Opções</span>
            </button>
          </div>
          
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="all">Todos os status</option>
                  <option value="scheduled">Agendada</option>
                  <option value="in_progress">Em Andamento</option>
                  <option value="completed">Concluída</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tipo</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="all">Todos os tipos</option>
                  <option value="preventive">Preventiva</option>
                  <option value="corrective">Corretiva</option>
                  <option value="predictive">Preditiva</option>
                  <option value="emergency">Emergencial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Prioridade</label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="all">Todas as prioridades</option>
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                  <option value="critical">Crítica</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setTypeFilter('all');
                    setPriorityFilter('all');
                  }}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Maintenance Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Histórico de Manutenções</h2>
              <button 
                onClick={() => setShowNewMaintenanceModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
              >
                <Plus size={16} />
                <span>Nova Manutenção</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-sm uppercase tracking-widest font-bold border-b border-slate-100">
                  <th className="px-4 py-4">Veículo</th>
                  <th className="px-4 py-4">Tipo</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Prioridade</th>
                  <th className="px-4 py-4">Data Agendada</th>
                  <th className="px-4 py-4">Mecânico</th>
                  <th className="px-4 py-4">Custo</th>
                  <th className="px-4 py-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-slate-400 italic">Carregando manutenções...</td>
                  </tr>
                ) : filteredMaintenance.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-slate-400 italic">Nenhuma manutenção encontrada.</td>
                  </tr>
                ) : (
                  filteredMaintenance.map((record) => (
                    <tr key={record.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                            {getVehicleIcon(record.vehicleType)}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{record.vehiclePlate}</div>
                            <div className="text-sm text-slate-600">{record.vehicleBrand} {record.vehicleModel}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-3 py-1 rounded-full text-sm font-medium border whitespace-nowrap bg-blue-100 text-blue-800 border-blue-200">
                          {getTypeLabel(record.type)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border whitespace-nowrap ${getStatusColor(record.status)}`}>
                          {getStatusLabel(record.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border whitespace-nowrap ${getPriorityColor(record.priority)}`}>
                          {getPriorityLabel(record.priority)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-slate-700">{new Date(record.scheduledDate).toLocaleDateString('pt-BR')}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-slate-700">{record.mechanic}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <DollarSign size={16} className="text-slate-400" />
                          <span className="text-slate-700 font-medium">R$ {record.cost.toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => setSelectedMaintenance(record)}
                            className="p-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" 
                            title="Visualizar"
                          >
                            <Eye size={16} />
                          </button>
                          <button className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                            <Edit size={16} />
                          </button>
                          <button className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cost Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Resumo de Custos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-slate-600 font-medium">Total Investido</p>
              <p className="text-2xl font-bold text-slate-900">R$ {calculateTotalCost().toFixed(2)}</p>
              <p className="text-xs text-slate-500 mt-2">Todas as manutenções</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-600 font-medium">Custo Médio</p>
              <p className="text-2xl font-bold text-amber-600">R$ {(calculateTotalCost() / maintenanceRecords.length).toFixed(2)}</p>
              <p className="text-xs text-amber-600 mt-2">Por manutenção</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-600 font-medium">Manutenções Concluídas</p>
              <p className="text-2xl font-bold text-emerald-600">{getMaintenanceStats().completed}</p>
              <p className="text-xs text-emerald-600 mt-2">Concluídas com sucesso</p>
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance Details Modal */}
      {selectedMaintenance && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">Detalhes da Manutenção</h3>
                <button
                  onClick={() => setSelectedMaintenance(null)}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Vehicle and Type Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Veículo</label>
                    <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg">
                      {selectedMaintenance.vehiclePlate} - {selectedMaintenance.vehicleBrand} {selectedMaintenance.vehicleModel}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
                    <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg">
                      {getTypeLabel(selectedMaintenance.type)}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border whitespace-nowrap ${getStatusColor(selectedMaintenance.status)}`}>
                      {getStatusLabel(selectedMaintenance.status)}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Prioridade</label>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border whitespace-nowrap ${getPriorityColor(selectedMaintenance.priority)}`}>
                      {getPriorityLabel(selectedMaintenance.priority)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Date and Mechanic */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Data Agendada</label>
                  <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg">
                    {new Date(selectedMaintenance.scheduledDate).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mecânico</label>
                  <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg">
                    {selectedMaintenance.mechanic}
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Duração Estimada</label>
                  <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg">
                    {selectedMaintenance.estimatedDuration} horas
                  </div>
                </div>
                
                {selectedMaintenance.actualDuration && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Duração Real</label>
                    <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg">
                      {selectedMaintenance.actualDuration} horas
                    </div>
                  </div>
                )}
              </div>

              {/* Cost */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Custo</label>
                <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg">
                  R$ {selectedMaintenance.cost.toFixed(2)}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg min-h-[80px]">
                  {selectedMaintenance.description}
                </div>
              </div>

              {/* Parts */}
              {selectedMaintenance.parts.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Peças Utilizadas</label>
                  <div className="space-y-2">
                    {selectedMaintenance.parts.map((part, index) => (
                      <div key={index} className="flex items-center gap-2 text-slate-700 bg-slate-100 px-3 py-2 rounded-lg">
                        <FileText size={16} className="text-slate-400" />
                        {part}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Observations */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
                <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg min-h-[80px]">
                  {selectedMaintenance.observations}
                </div>
              </div>

              {/* Next Maintenance */}
              {selectedMaintenance.nextMaintenance && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Próxima Manutenção</label>
                  <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg">
                    {new Date(selectedMaintenance.nextMaintenance).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors">
                  <Edit size={16} />
                  <span>Editar</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors">
                  <FileText size={16} />
                  <span>Gerar Relatório</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                  <CheckCircle size={16} />
                  <span>Concluir Manutenção</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Maintenance Modal */}
      {showNewMaintenanceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">Nova Manutenção</h3>
                <button
                  onClick={() => setShowNewMaintenanceModal(false)}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Vehicle Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Placa do Veículo *</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                    <option value="">Selecione...</option>
                    <option value="ABC-1234">ABC-1234 - Mercedes-Benz Actros 1846</option>
                    <option value="DEF-5678">DEF-5678 - Mercedes-Benz Sprinter</option>
                    <option value="GHI-9012">GHI-9012 - Volvo FH 540</option>
                    <option value="JKL-3456">JKL-3456 - Fiat Ducato</option>
                    <option value="MNO-7890">MNO-7890 - Honda Titan</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Manutenção *</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                    <option value="">Selecione...</option>
                    <option value="preventive">Preventiva</option>
                    <option value="corrective">Corretiva</option>
                    <option value="predictive">Preditiva</option>
                    <option value="emergency">Emergencial</option>
                  </select>
                </div>
              </div>

              {/* Priority and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Prioridade *</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                    <option value="">Selecione...</option>
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                    <option value="critical">Crítica</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status *</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                    <option value="">Selecione...</option>
                    <option value="scheduled">Agendada</option>
                    <option value="in_progress">Em Andamento</option>
                    <option value="completed">Concluída</option>
                    <option value="cancelled">Cancelada</option>
                  </select>
                </div>
              </div>

              {/* Date and Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Data Agendada *</label>
                  <input type="date" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"/>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Duração Estimada (horas) *</label>
                  <input type="number" placeholder="4" min="1" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"/>
                </div>
              </div>

              {/* Mechanic and Cost */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mecânico Responsável *</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                    <option value="">Selecione...</option>
                    <option value="João Silva">João Silva</option>
                    <option value="Carlos Santos">Carlos Santos</option>
                    <option value="Maria Oliveira">Maria Oliveira</option>
                    <option value="Pedro Costa">Pedro Costa</option>
                    <option value="Lucas Ferreira">Lucas Ferreira</option>
                    <option value="Ana Rodrigues">Ana Rodrigues</option>
                    <option value="Roberto Almeida">Roberto Almeida</option>
                    <option value="Fernanda Lima">Fernanda Lima</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Custo Estimado (R$) *</label>
                  <input type="number" placeholder="1500.00" min="0" step="0.01" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"/>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descrição *</label>
                <textarea 
                  placeholder="Descreva detalhadamente o serviço a ser realizado..."
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                ></textarea>
              </div>

              {/* Parts */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Peças Necessárias</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="text" placeholder="Nome da peça..." className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"/>
                    <button type="button" className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Observations */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
                <textarea 
                  placeholder="Informações adicionais sobre a manutenção..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                ></textarea>
              </div>

              {/* Next Maintenance */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Próxima Manutenção</label>
                <input type="date" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"/>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                <button 
                  onClick={() => setShowNewMaintenanceModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors">
                  <Plus size={16} />
                  <span>Cadastrar Manutenção</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
