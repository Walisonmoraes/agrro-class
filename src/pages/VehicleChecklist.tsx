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
  Car,
  Camera,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  Download,
  Upload,
  User,
  CheckSquare,
  Square
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  title: string;
  category: 'safety' | 'mechanical' | 'documentation' | 'cleanliness';
  required: boolean;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

interface VehicleChecklist {
  id: string;
  vehiclePlate: string;
  vehicleModel: string;
  vehicleBrand: string;
  vehicleType: 'truck' | 'van' | 'car' | 'motorcycle';
  driver: string;
  weekNumber: number;
  year: number;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  completionDate?: string;
  photos: {
    front: string | null;
    back: string | null;
    left: string | null;
    right: string | null;
    dashboard: string | null;
    odometer: string | null;
    documents: string | null;
  };
  checklist: ChecklistItem[];
  totalScore: number;
  maxScore: number;
  observations: string;
}

export const VehicleChecklist: React.FC = () => {
  const [checklists, setChecklists] = useState<VehicleChecklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [vehicleFilter, setVehicleFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedChecklist, setSelectedChecklist] = useState<VehicleChecklist | null>(null);
  const [showNewChecklistModal, setShowNewChecklistModal] = useState(false);

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      const mockChecklists: VehicleChecklist[] = [
        {
          id: '1',
          vehiclePlate: 'ABC-1234',
          vehicleModel: 'Actros 1846',
          vehicleBrand: 'Mercedes-Benz',
          vehicleType: 'truck',
          driver: 'João Silva',
          weekNumber: 12,
          year: 2024,
          dueDate: '2024-03-24',
          status: 'completed',
          completionDate: '2024-03-22',
          photos: {
            front: '/photos/abc1234-front.jpg',
            back: '/photos/abc1234-back.jpg',
            left: '/photos/abc1234-left.jpg',
            right: '/photos/abc1234-right.jpg',
            dashboard: '/photos/abc1234-dashboard.jpg',
            odometer: '/photos/abc1234-odometer.jpg',
            documents: '/photos/abc1234-docs.jpg'
          },
          checklist: [
            { id: '1', title: 'Pneus - Calibragem correta', category: 'safety', required: true, status: 'approved' },
            { id: '2', title: 'Pneus - Estado de conservação', category: 'safety', required: true, status: 'approved' },
            { id: '3', title: 'Óleo do motor - Nível adequado', category: 'mechanical', required: true, status: 'approved' },
            { id: '4', title: 'Freios - Funcionamento', category: 'safety', required: true, status: 'approved' },
            { id: '5', title: 'Luzes - Todas funcionando', category: 'safety', required: true, status: 'approved', notes: 'Farol direito com pequena oscilação' },
            { id: '6', title: 'Limpeza interna e externa', category: 'cleanliness', required: true, status: 'approved' },
            { id: '7', title: 'Documentos - CNH válida', category: 'documentation', required: true, status: 'approved' },
            { id: '8', title: 'Documentos - CRLV válido', category: 'documentation', required: true, status: 'approved' }
          ],
          totalScore: 85,
          maxScore: 100,
          observations: 'Veículo em bom estado geral. Farol direito precisa de manutenção.'
        },
        {
          id: '2',
          vehiclePlate: 'DEF-5678',
          vehicleModel: 'Sprinter',
          vehicleBrand: 'Mercedes-Benz',
          vehicleType: 'van',
          driver: 'Carlos Santos',
          weekNumber: 12,
          year: 2024,
          dueDate: '2024-03-24',
          status: 'in_progress',
          photos: {
            front: '/photos/def5678-front.jpg',
            back: null,
            left: '/photos/def5678-left.jpg',
            right: null,
            dashboard: null,
            odometer: null,
            documents: null
          },
          checklist: [
            { id: '1', title: 'Pneus - Calibragem correta', category: 'safety', required: true, status: 'approved' },
            { id: '2', title: 'Pneus - Estado de conservação', category: 'safety', required: true, status: 'pending' },
            { id: '3', title: 'Óleo do motor - Nível adequado', category: 'mechanical', required: true, status: 'approved' },
            { id: '4', title: 'Freios - Funcionamento', category: 'safety', required: true, status: 'pending' },
            { id: '5', title: 'Luzes - Todas funcionando', category: 'safety', required: true, status: 'rejected', notes: 'Luz de ré queimada' },
            { id: '6', title: 'Limpeza interna e externa', category: 'cleanliness', required: true, status: 'pending' },
            { id: '7', title: 'Documentos - CNH válida', category: 'documentation', required: true, status: 'approved' },
            { id: '8', title: 'Documentos - CRLV válido', category: 'documentation', required: true, status: 'approved' }
          ],
          totalScore: 60,
          maxScore: 100,
          observations: 'Em andamento. Faltam fotos traseira, direita, painel, odômetro e documentos.'
        },
        {
          id: '3',
          vehiclePlate: 'GHI-9012',
          vehicleModel: 'FH 540',
          vehicleBrand: 'Volvo',
          vehicleType: 'truck',
          driver: 'Maria Oliveira',
          weekNumber: 12,
          year: 2024,
          dueDate: '2024-03-24',
          status: 'overdue',
          photos: {
            front: null,
            back: null,
            left: null,
            right: null,
            dashboard: null,
            odometer: null,
            documents: null
          },
          checklist: [
            { id: '1', title: 'Pneus - Calibragem correta', category: 'safety', required: true, status: 'pending' },
            { id: '2', title: 'Pneus - Estado de conservação', category: 'safety', required: true, status: 'pending' },
            { id: '3', title: 'Óleo do motor - Nível adequado', category: 'mechanical', required: true, status: 'pending' },
            { id: '4', title: 'Freios - Funcionamento', category: 'safety', required: true, status: 'pending' },
            { id: '5', title: 'Luzes - Todas funcionando', category: 'safety', required: true, status: 'pending' },
            { id: '6', title: 'Limpeza interna e externa', category: 'cleanliness', required: true, status: 'pending' },
            { id: '7', title: 'Documentos - CNH válida', category: 'documentation', required: true, status: 'pending' },
            { id: '8', title: 'Documentos - CRLV válido', category: 'documentation', required: true, status: 'pending' }
          ],
          totalScore: 0,
          maxScore: 100,
          observations: 'Checklist não iniciado. Veículo com atraso na inspeção semanal.'
        }
      ];

      setChecklists(mockChecklists);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredChecklists = checklists.filter(checklist => {
    const matchesSearch = 
      checklist.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checklist.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checklist.vehicleBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checklist.driver.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || checklist.status === statusFilter;
    const matchesVehicle = vehicleFilter === 'all' || checklist.vehiclePlate === vehicleFilter;

    return matchesSearch && matchesStatus && matchesVehicle;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'in_progress': return 'Em Andamento';
      case 'completed': return 'Concluído';
      case 'overdue': return 'Atrasado';
      default: return status;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'safety': return 'Segurança';
      case 'mechanical': return 'Mecânica';
      case 'documentation': return 'Documentação';
      case 'cleanliness': return 'Limpeza';
      case 'electrical': return 'Elétrica';
      case 'accessories': return 'Acessórios';
      case 'emergency': return 'Emergência';
      default: return category;
    }
  };

  const getVehicleIcon = (type: string) => {
    return <Car size={20} />;
  };

  const getChecklistStats = () => {
    const total = checklists.length;
    const completed = checklists.filter(c => c.status === 'completed').length;
    const inProgress = checklists.filter(c => c.status === 'in_progress').length;
    const overdue = checklists.filter(c => c.status === 'overdue').length;

    return { total, completed, inProgress, overdue };
  };

  const getPhotoStatus = (photo: string | null) => {
    if (photo) {
      return <CheckCircle className="text-emerald-600" size={20} />;
    } else {
      return <XCircle className="text-red-600" size={20} />;
    }
  };

  const getChecklistItemIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="text-emerald-600" size={16} />;
      case 'rejected': return <XCircle className="text-red-600" size={16} />;
      case 'pending': return <Clock className="text-amber-600" size={16} />;
      default: return <Clock className="text-slate-600" size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <CheckSquare className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Checklist Veicular
                  </h1>
                  <p className="text-slate-500 font-medium">Inspeções semanais da frota</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl">
                <Calendar className="text-slate-600" size={16} />
                <span className="text-sm font-medium text-slate-700">
                  Semana {Math.ceil((new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))} - {new Date().getFullYear()}
                </span>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar checklists..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-purple-500 transition-all shadow-sm w-64"
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
                <p className="text-sm text-slate-600 font-medium">Total de Checklists</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{getChecklistStats().total}</p>
                <p className="text-xs text-purple-600 mt-2">Esta semana</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <CheckSquare className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Concluídos</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{getChecklistStats().completed}</p>
                <p className="text-xs text-emerald-600 mt-2">Aprovados</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="text-emerald-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Em Andamento</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{getChecklistStats().inProgress}</p>
                <p className="text-xs text-blue-600 mt-2">Executando</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Clock className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Atrasados</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{getChecklistStats().overdue}</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Veículo</label>
                <select
                  value={vehicleFilter}
                  onChange={(e) => setVehicleFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">Todos os veículos</option>
                  <option value="ABC-1234">ABC-1234</option>
                  <option value="DEF-5678">DEF-5678</option>
                  <option value="GHI-9012">GHI-9012</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">Todos os status</option>
                  <option value="pending">Pendente</option>
                  <option value="in_progress">Em Andamento</option>
                  <option value="completed">Concluído</option>
                  <option value="overdue">Atrasado</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setVehicleFilter('all');
                    setStatusFilter('all');
                  }}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Checklists Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Checklists da Semana</h2>
              <button 
                onClick={() => setShowNewChecklistModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Plus size={16} />
                <span>Nova Checklist</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-sm uppercase tracking-widest font-bold border-b border-slate-100">
                  <th className="px-4 py-4">Veículo</th>
                  <th className="px-4 py-4">Motorista</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Pontuação</th>
                  <th className="px-4 py-4">Fotos</th>
                  <th className="px-4 py-4">Vencimento</th>
                  <th className="px-4 py-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-400 italic">Carregando checklists...</td>
                  </tr>
                ) : filteredChecklists.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-400 italic">Nenhuma checklist encontrada.</td>
                  </tr>
                ) : (
                  filteredChecklists.map((checklist) => (
                    <tr key={checklist.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            {getVehicleIcon(checklist.vehicleType)}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{checklist.vehiclePlate}</div>
                            <div className="text-sm text-slate-600">{checklist.vehicleBrand} {checklist.vehicleModel}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-slate-400" />
                          <span className="text-slate-700">{checklist.driver}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border whitespace-nowrap ${getStatusColor(checklist.status)}`}>
                          {getStatusLabel(checklist.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-slate-700 font-medium">{checklist.totalScore}/{checklist.maxScore}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {getPhotoStatus(checklist.photos.front)}
                          {getPhotoStatus(checklist.photos.back)}
                          {getPhotoStatus(checklist.photos.left)}
                          {getPhotoStatus(checklist.photos.right)}
                          <span className="text-xs text-slate-600 ml-1">({Object.values(checklist.photos).filter(p => p !== null).length}/7)</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-slate-700">{new Date(checklist.dueDate).toLocaleDateString('pt-BR')}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => setSelectedChecklist(checklist)}
                            className="p-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" 
                            title="Visualizar"
                          >
                            <Eye size={16} />
                          </button>
                          <button className="p-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Editar">
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

        {/* Checklist Details Modal */}
        {selectedChecklist && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white z-10 p-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-slate-900">Detalhes do Checklist</h3>
                  <button
                    onClick={() => setSelectedChecklist(null)}
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Vehicle Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Veículo</label>
                      <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg">
                        {selectedChecklist.vehiclePlate} - {selectedChecklist.vehicleBrand} {selectedChecklist.vehicleModel}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Motorista</label>
                      <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg">
                        {selectedChecklist.driver}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border whitespace-nowrap ${getStatusColor(selectedChecklist.status)}`}>
                        {getStatusLabel(selectedChecklist.status)}
                      </span>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Pontuação</label>
                      <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg">
                        {selectedChecklist.totalScore}/{selectedChecklist.maxScore} ({Math.round((selectedChecklist.totalScore / selectedChecklist.maxScore) * 100)}%)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Photos Grid */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Fotos Obrigatórias</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="w-full h-32 bg-slate-100 rounded-lg flex items-center justify-center mb-2">
                        {selectedChecklist.photos.front ? (
                          <img src={selectedChecklist.photos.front} alt="Frente" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Camera className="text-slate-400" size={32} />
                        )}
                      </div>
                      <p className="text-sm text-slate-600">Frente</p>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-32 bg-slate-100 rounded-lg flex items-center justify-center mb-2">
                        {selectedChecklist.photos.back ? (
                          <img src={selectedChecklist.photos.back} alt="Trás" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Camera className="text-slate-400" size={32} />
                        )}
                      </div>
                      <p className="text-sm text-slate-600">Trás</p>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-32 bg-slate-100 rounded-lg flex items-center justify-center mb-2">
                        {selectedChecklist.photos.left ? (
                          <img src={selectedChecklist.photos.left} alt="Lado Esquerdo" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Camera className="text-slate-400" size={32} />
                        )}
                      </div>
                      <p className="text-sm text-slate-600">Lado Esquerdo</p>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-32 bg-slate-100 rounded-lg flex items-center justify-center mb-2">
                        {selectedChecklist.photos.right ? (
                          <img src={selectedChecklist.photos.right} alt="Lado Direito" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Camera className="text-slate-400" size={32} />
                        )}
                      </div>
                      <p className="text-sm text-slate-600">Lado Direito</p>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-32 bg-slate-100 rounded-lg flex items-center justify-center mb-2">
                        {selectedChecklist.photos.dashboard ? (
                          <img src={selectedChecklist.photos.dashboard} alt="Painel" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Camera className="text-slate-400" size={32} />
                        )}
                      </div>
                      <p className="text-sm text-slate-600">Painel</p>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-32 bg-slate-100 rounded-lg flex items-center justify-center mb-2">
                        {selectedChecklist.photos.odometer ? (
                          <img src={selectedChecklist.photos.odometer} alt="Odômetro" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Camera className="text-slate-400" size={32} />
                        )}
                      </div>
                      <p className="text-sm text-slate-600">Odômetro</p>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-32 bg-slate-100 rounded-lg flex items-center justify-center mb-2">
                        {selectedChecklist.photos.documents ? (
                          <img src={selectedChecklist.photos.documents} alt="Documentos" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Camera className="text-slate-400" size={32} />
                        )}
                      </div>
                      <p className="text-sm text-slate-600">Documentos</p>
                    </div>
                  </div>
                </div>

                {/* Checklist Items */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Itens de Verificação</label>
                  <div className="space-y-3">
                    {['safety', 'mechanical', 'documentation', 'cleanliness'].map(category => (
                      <div key={category} className="space-y-2">
                        <h4 className="text-sm font-semibold text-slate-800 bg-slate-100 px-3 py-2 rounded-lg">
                          {getCategoryLabel(category)}
                        </h4>
                        {selectedChecklist.checklist
                          .filter(item => item.category === category)
                          .map(item => (
                            <div key={item.id} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg">
                              {getChecklistItemIcon(item.status)}
                              <div className="flex-1">
                                <div className="font-medium text-slate-900">{item.title}</div>
                                {item.notes && (
                                  <div className="text-sm text-slate-600 mt-1">{item.notes}</div>
                                )}
                              </div>
                              <div className="text-xs text-slate-500">
                                {item.required ? 'Obrigatório' : 'Opcional'}
                              </div>
                            </div>
                          ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Observations */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Observações Gerais</label>
                  <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg min-h-[80px]">
                    {selectedChecklist.observations}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                  <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors">
                    <Edit size={16} />
                    <span>Editar Checklist</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors">
                    <FileText size={16} />
                    <span>Gerar Relatório</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
                    <CheckCircle size={16} />
                    <span>Aprovar Checklist</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* New Checklist Modal */}
        {showNewChecklistModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white z-10 p-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-slate-900">Nova Checklist Semanal</h3>
                  <button
                    onClick={() => setShowNewChecklistModal(false)}
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Vehicle and Driver Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Veículo *</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                      <option value="">Selecione...</option>
                      <option value="ABC-1234">ABC-1234 - Mercedes-Benz Actros 1846</option>
                      <option value="DEF-5678">DEF-5678 - Mercedes-Benz Sprinter</option>
                      <option value="GHI-9012">GHI-9012 - Volvo FH 540</option>
                      <option value="JKL-3456">JKL-3456 - Fiat Ducato</option>
                      <option value="MNO-7890">MNO-7890 - Honda Titan</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Motorista Responsável *</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
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
                </div>

                {/* Week and Due Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Semana *</label>
                    <input 
                      type="number" 
                      placeholder="12" 
                      min="1" 
                      max="53" 
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Data de Vencimento *</label>
                    <input 
                      type="date" 
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Checklist Items */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Itens de Verificação (Expandido)</label>
                  <div className="space-y-3">
                    {['safety', 'mechanical', 'documentation', 'cleanliness', 'electrical', 'accessories', 'emergency'].map(category => (
                      <div key={category} className="space-y-2">
                        <h4 className="text-sm font-semibold text-slate-800 bg-slate-100 px-3 py-2 rounded-lg">
                          {getCategoryLabel(category)}
                        </h4>
                        <div className="space-y-2">
                          {category === 'safety' && (
                            <>
                              <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg">
                                <CheckSquare className="text-slate-400" size={16} />
                                <input 
                                  type="text" 
                                  placeholder="Pneus - Calibragem e pressão"
                                  className="flex-1 px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                />
                                <button type="button" className="p-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded transition-colors">
                                  <Plus size={14} />
                                </button>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg">
                                <CheckSquare className="text-slate-400" size={16} />
                                <input 
                                  type="text" 
                                  placeholder="Pneus - Estado e desgaste"
                                  className="flex-1 px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                />
                                <button type="button" className="p-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded transition-colors">
                                  <Plus size={14} />
                                </button>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg">
                                <CheckSquare className="text-slate-400" size={16} />
                                <input 
                                  type="text" 
                                  placeholder="Freios - Funcionamento e folga"
                                  className="flex-1 px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                />
                                <button type="button" className="p-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded transition-colors">
                                  <Plus size={14} />
                                </button>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg">
                                <CheckSquare className="text-slate-400" size={16} />
                                <input 
                                  type="text" 
                                  placeholder="Luzes - Todas funcionando"
                                  className="flex-1 px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                />
                                <button type="button" className="p-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded transition-colors">
                                  <Plus size={14} />
                                </button>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg">
                                <CheckSquare className="text-slate-400" size={16} />
                                <input 
                                  type="text" 
                                  placeholder="Seta de emergência e triângulo"
                                  className="flex-1 px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                />
                                <button type="button" className="p-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded transition-colors">
                                  <Plus size={14} />
                                </button>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg">
                                <CheckSquare className="text-slate-400" size={16} />
                                <input 
                                  type="text" 
                                  placeholder="Cintos de segurança"
                                  className="flex-1 px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                />
                                <button type="button" className="p-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded transition-colors">
                                  <Plus size={14} />
                                </button>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg">
                                <CheckSquare className="text-slate-400" size={16} />
                                <input 
                                  type="text" 
                                  placeholder="Extintor de incêndio"
                                  className="flex-1 px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                />
                                <button type="button" className="p-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded transition-colors">
                                  <Plus size={14} />
                                </button>
                              </div>
                            </>
                          )}
                          {category === 'mechanical' && (
                            <>
                              <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg">
                                <CheckSquare className="text-slate-400" size={16} />
                                <input 
                                  type="text" 
                                  placeholder="Óleo do motor - Nível e qualidade"
                                  className="flex-1 px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                />
                                <button type="button" className="p-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded transition-colors">
                                  <Plus size={14} />
                                </button>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg">
                                <CheckSquare className="text-slate-400" size={16} />
                                <input 
                                  type="text" 
                                  placeholder="Água do radiador - Nível e vazamentos"
                                  className="flex-1 px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                />
                                <button type="button" className="p-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded transition-colors">
                                  <Plus size={14} />
                                </button>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg">
                                <CheckSquare className="text-slate-400" size={16} />
                                <input 
                                  type="text" 
                                  placeholder="Correia - Estado e tensão"
                                  className="flex-1 px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                />
                                <button type="button" className="p-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded transition-colors">
                                  <Plus size={14} />
                                </button>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg">
                                <CheckSquare className="text-slate-400" size={16} />
                                <input 
                                  type="text" 
                                  placeholder="Filtro de ar - Estado e limpeza"
                                  className="flex-1 px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                />
                                <button type="button" className="p-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded transition-colors">
                                  <Plus size={14} />
                                </button>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg">
                                <CheckSquare className="text-slate-400" size={16} />
                                <input 
                                  type="text" 
                                  placeholder="Bateria - Estado e carga"
                                  className="flex-1 px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                />
                                <button type="button" className="p-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded transition-colors">
                                  <Plus size={14} />
                                </button>
                              </div>
                            </>
                          )}
                          {category === 'electrical' && (
                            <>
                              <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg">
                                <CheckSquare className="text-slate-400" size={16} />
                                <input 
                                  type="text" 
                                  placeholder="Sistema elétrico - Funcionamento"
                                  className="flex-1 px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                />
                                <button type="button" className="p-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded transition-colors">
                                  <Plus size={14} />
                                </button>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg">
                                <CheckSquare className="text-slate-400" size={16} />
                                <input 
                                  type="text" 
                                  placeholder="Alternador e bateria"
                                  className="flex-1 px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                />
                                <button type="button" className="p-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded transition-colors">
                                  <Plus size={14} />
                                </button>
                              </div>
                            </>
                          )}
                          {category === 'accessories' && (
                            <>
                              <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg">
                                <CheckSquare className="text-slate-400" size={16} />
                                <input 
                                  type="text" 
                                  placeholder="Rádio e som - Funcionamento"
                                  className="flex-1 px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                />
                                <button type="button" className="p-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded transition-colors">
                                  <Plus size={14} />
                                </button>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg">
                                <CheckSquare className="text-slate-400" size={16} />
                                <input 
                                  type="text" 
                                  placeholder="Ar condicionado - Funcionamento"
                                  className="flex-1 px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                />
                                <button type="button" className="p-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded transition-colors">
                                  <Plus size={14} />
                                </button>
                              </div>
                            </>
                          )}
                          {category === 'emergency' && (
                            <>
                              <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg">
                                <CheckSquare className="text-slate-400" size={16} />
                                <input 
                                  type="text" 
                                  placeholder="Macaco - Presente e funcionando"
                                  className="flex-1 px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                />
                                <button type="button" className="p-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded transition-colors">
                                  <Plus size={14} />
                                </button>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg">
                                <CheckSquare className="text-slate-400" size={16} />
                                <input 
                                  type="text" 
                                  placeholder="Triângulo de segurança - Presente e fixado"
                                  className="flex-1 px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                />
                                <button type="button" className="p-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded transition-colors">
                                  <Plus size={14} />
                                </button>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg">
                                <CheckSquare className="text-slate-400" size={16} />
                                <input 
                                  type="text" 
                                  placeholder="Kit de primeiros socorros - Completo"
                                  className="flex-1 px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                />
                                <button type="button" className="p-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded transition-colors">
                                  <Plus size={14} />
                                </button>
                              </div>
                            </>
                          )}
                          {(category === 'documentation' || category === 'cleanliness') && (
                            <>
                              <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg">
                                <CheckSquare className="text-slate-400" size={16} />
                                <input 
                                  type="text" 
                                  placeholder={category === 'documentation' ? "CNH - Validade e categoria" : "Limpeza interna - Assoalhos e painéis"}
                                  className="flex-1 px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                />
                                <button type="button" className="p-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded transition-colors">
                                  <Plus size={14} />
                                </button>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg">
                                <CheckSquare className="text-slate-400" size={16} />
                                <input 
                                  type="text" 
                                  placeholder={category === 'documentation' ? "CRLV - Validade e licenciamento" : "Limpeza externa - Carroceria e vidros"}
                                  className="flex-1 px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                />
                                <button type="button" className="p-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded transition-colors">
                                  <Plus size={14} />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Photo Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Fotos Obrigatórias (12 imagens)</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="w-full h-32 bg-slate-100 rounded-lg flex items-center justify-center mb-2 border-2 border-dashed border-slate-300">
                        <Camera className="text-slate-400" size={32} />
                      </div>
                      <p className="text-sm text-slate-600">Frente</p>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-32 bg-slate-100 rounded-lg flex items-center justify-center mb-2 border-2 border-dashed border-slate-300">
                        <Camera className="text-slate-400" size={32} />
                      </div>
                      <p className="text-sm text-slate-600">Trás</p>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-32 bg-slate-100 rounded-lg flex items-center justify-center mb-2 border-2 border-dashed border-slate-300">
                        <Camera className="text-slate-400" size={32} />
                      </div>
                      <p className="text-sm text-slate-600">Lado Esquerdo</p>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-32 bg-slate-100 rounded-lg flex items-center justify-center mb-2 border-2 border-dashed border-slate-300">
                        <Camera className="text-slate-400" size={32} />
                      </div>
                      <p className="text-sm text-slate-600">Lado Direito</p>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-32 bg-slate-100 rounded-lg flex items-center justify-center mb-2 border-2 border-dashed border-slate-300">
                        <Camera className="text-slate-400" size={32} />
                      </div>
                      <p className="text-sm text-slate-600">Painel</p>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-32 bg-slate-100 rounded-lg flex items-center justify-center mb-2 border-2 border-dashed border-slate-300">
                        <Camera className="text-slate-400" size={32} />
                      </div>
                      <p className="text-sm text-slate-600">Odômetro</p>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-32 bg-slate-100 rounded-lg flex items-center justify-center mb-2 border-2 border-dashed border-slate-300">
                        <Camera className="text-slate-400" size={32} />
                      </div>
                      <p className="text-sm text-slate-600">Documentos</p>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-32 bg-slate-100 rounded-lg flex items-center justify-center mb-2 border-2 border-dashed border-slate-300">
                        <Camera className="text-slate-400" size={32} />
                      </div>
                      <p className="text-sm text-slate-600">Pneus Dianteiros</p>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-32 bg-slate-100 rounded-lg flex items-center justify-center mb-2 border-2 border-dashed border-slate-300">
                        <Camera className="text-slate-400" size={32} />
                      </div>
                      <p className="text-sm text-slate-600">Pneus Traseiros</p>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-32 bg-slate-100 rounded-lg flex items-center justify-center mb-2 border-2 border-dashed border-slate-300">
                        <Camera className="text-slate-400" size={32} />
                      </div>
                      <p className="text-sm text-slate-600">Estepe</p>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-32 bg-slate-100 rounded-lg flex items-center justify-center mb-2 border-2 border-dashed border-slate-300">
                        <Camera className="text-slate-400" size={32} />
                      </div>
                      <p className="text-sm text-slate-600">Motor (Compartimento)</p>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-32 bg-slate-100 rounded-lg flex items-center justify-center mb-2 border-2 border-dashed border-slate-300">
                        <Camera className="text-slate-400" size={32} />
                      </div>
                      <p className="text-sm text-slate-600">Banco</p>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-32 bg-slate-100 rounded-lg flex items-center justify-center mb-2 border-2 border-dashed border-slate-300">
                        <Camera className="text-slate-400" size={32} />
                      </div>
                      <p className="text-sm text-slate-600">Porta-Malas</p>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-32 bg-slate-100 rounded-lg flex items-center justify-center mb-2 border-2 border-dashed border-slate-300">
                        <Camera className="text-slate-400" size={32} />
                      </div>
                      <p className="text-sm text-slate-600">Câmera Interna</p>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-32 bg-slate-100 rounded-lg flex items-center justify-center mb-2 border-2 border-dashed border-slate-300">
                        <Camera className="text-slate-400" size={32} />
                      </div>
                      <p className="text-sm text-slate-600">Câmera Externa</p>
                    </div>
                  </div>
                </div>

                {/* Observations */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Observações Gerais</label>
                  <textarea 
                    placeholder="Informações adicionais sobre a checklist..."
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  ></textarea>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => setShowNewChecklistModal(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                    <Plus size={16} />
                    <span>Criar Checklist</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
