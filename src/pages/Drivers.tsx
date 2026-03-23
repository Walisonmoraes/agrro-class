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
  User,
  Phone,
  Mail,
  Car,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Download,
  Award,
  Shield,
  Star
} from 'lucide-react';

interface Driver {
  id: string;
  name: string;
  cpf: string;
  cnh: string;
  cnhCategory: string;
  cnhExpiry: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  status: 'active' | 'inactive' | 'suspended' | 'vacation';
  hireDate: string;
  vehicles: string[];
  lastChecklist: string;
  checklistsCount: number;
  averageScore: number;
  incidents: number;
  certifications: Certification[];
  observations: string;
}

interface Certification {
  id: string;
  name: string;
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expired' | 'expiring';
  document: string | null;
}

export const Drivers: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [vehicleFilter, setVehicleFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [showNewDriverModal, setShowNewDriverModal] = useState(false);

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      const mockDrivers: Driver[] = [
        {
          id: '1',
          name: 'João Silva Santos',
          cpf: '123.456.789-00',
          cnh: '12345678901',
          cnhCategory: 'C',
          cnhExpiry: '2025-12-15',
          phone: '(11) 98765-4321',
          email: 'joao.silva@empresa.com',
          address: 'Rua das Flores, 123',
          city: 'São Paulo',
          state: 'SP',
          status: 'active',
          hireDate: '2022-03-15',
          vehicles: ['ABC-1234', 'DEF-5678'],
          lastChecklist: '2024-03-20',
          checklistsCount: 45,
          averageScore: 92.5,
          incidents: 0,
          certifications: [
            { id: '1', name: 'Curso de Direção Defensiva', issueDate: '2023-01-15', expiryDate: '2025-01-15', status: 'valid', document: '/docs/defensive-driving.pdf' },
            { id: '2', name: 'Transporte de Cargas Perigosas', issueDate: '2023-06-20', expiryDate: '2024-06-20', status: 'expiring', document: '/docs/dangerous-goods.pdf' }
          ],
          observations: 'Motorista experiente, excelente pontualidade e responsabilidade.'
        },
        {
          id: '2',
          name: 'Carlos Alberto Ferreira',
          cpf: '987.654.321-00',
          cnh: '98765432100',
          cnhCategory: 'D',
          cnhExpiry: '2024-08-20',
          phone: '(11) 91234-5678',
          email: 'carlos.ferreira@empresa.com',
          address: 'Avenida Principal, 456',
          city: 'São Paulo',
          state: 'SP',
          status: 'active',
          hireDate: '2021-07-10',
          vehicles: ['GHI-9012'],
          lastChecklist: '2024-03-19',
          checklistsCount: 62,
          averageScore: 88.0,
          incidents: 1,
          certifications: [
            { id: '3', name: 'Operação de Caminhão', issueDate: '2022-08-15', expiryDate: '2024-08-15', status: 'expiring', document: '/docs/truck-operation.pdf' }
          ],
          observations: 'Especialista em caminhões pesados, boa performance geral.'
        },
        {
          id: '3',
          name: 'Maria Oliveira Costa',
          cpf: '456.789.123-00',
          cnh: '45678912300',
          cnhCategory: 'B',
          cnhExpiry: '2026-03-10',
          phone: '(11) 97654-3210',
          email: 'maria.costa@empresa.com',
          address: 'Rua dos Girassóis, 789',
          city: 'São Paulo',
          state: 'SP',
          status: 'vacation',
          hireDate: '2023-02-01',
          vehicles: ['JKL-3456'],
          lastChecklist: '2024-03-15',
          checklistsCount: 28,
          averageScore: 95.0,
          incidents: 0,
          certifications: [
            { id: '4', name: 'Primeiros Socorros', issueDate: '2023-05-10', expiryDate: '2025-05-10', status: 'valid', document: '/docs/first-aid.pdf' }
          ],
          observations: 'Motorista cuidadosa, ótima com veículos leves.'
        },
        {
          id: '4',
          name: 'Pedro Henrique Santos',
          cpf: '789.123.456-00',
          cnh: '78912345600',
          cnhCategory: 'A',
          cnhExpiry: '2024-12-05',
          phone: '(11) 92345-6789',
          email: 'pedro.santos@empresa.com',
          address: 'Rua das Árvores, 101',
          city: 'São Paulo',
          state: 'SP',
          status: 'suspended',
          hireDate: '2022-11-20',
          vehicles: ['MNO-7890'],
          lastChecklist: '2024-03-10',
          checklistsCount: 38,
          averageScore: 75.0,
          incidents: 3,
          certifications: [],
          observations: 'Em suspensão devido a múltiplos incidentes.'
        }
      ];

      setDrivers(mockDrivers);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = 
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.cpf.includes(searchTerm) ||
      driver.cnh.includes(searchTerm) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
    const matchesVehicle = vehicleFilter === 'all' || driver.vehicles.includes(vehicleFilter);

    return matchesSearch && matchesStatus && matchesVehicle;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'inactive': return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200';
      case 'vacation': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'suspended': return 'Suspenso';
      case 'vacation': return 'Férias';
      default: return status;
    }
  };

  const getCertificationColor = (status: string) => {
    switch (status) {
      case 'valid': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      case 'expiring': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCertificationLabel = (status: string) => {
    switch (status) {
      case 'valid': return 'Válida';
      case 'expired': return 'Vencida';
      case 'expiring': return 'Vencendo';
      default: return status;
    }
  };

  const getDriverStats = () => {
    const total = drivers.length;
    const active = drivers.filter(d => d.status === 'active').length;
    const suspended = drivers.filter(d => d.status === 'suspended').length;
    const vacation = drivers.filter(d => d.status === 'vacation').length;
    const averageScore = drivers.reduce((acc, d) => acc + d.averageScore, 0) / drivers.length;

    return { total, active, suspended, vacation, averageScore };
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <Star className="text-emerald-600" size={16} />;
    if (score >= 80) return <CheckCircle className="text-blue-600" size={16} />;
    if (score >= 70) return <AlertTriangle className="text-amber-600" size={16} />;
    return <XCircle className="text-red-600" size={16} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <User className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Frota - Condutores
                  </h1>
                  <p className="text-slate-500 font-medium">Gestão completa de motoristas</p>
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
                  placeholder="Buscar condutores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-all shadow-sm w-64"
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
                <p className="text-sm text-slate-600 font-medium">Total de Condutores</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{getDriverStats().total}</p>
                <p className="text-xs text-emerald-600 mt-2">Cadastrados</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <User className="text-emerald-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Condutores Ativos</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{getDriverStats().active}</p>
                <p className="text-xs text-emerald-600 mt-2">Disponíveis</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="text-emerald-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Média de Score</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{getDriverStats().averageScore.toFixed(1)}</p>
                <p className="text-xs text-amber-600 mt-2">Global</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Star className="text-amber-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Suspensões</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{getDriverStats().suspended}</p>
                <p className="text-xs text-red-600 mt-2">Inativos</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <XCircle className="text-red-600" size={24} />
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
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="all">Todos os status</option>
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                  <option value="suspended">Suspenso</option>
                  <option value="vacation">Férias</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Veículo</label>
                <select
                  value={vehicleFilter}
                  onChange={(e) => setVehicleFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="all">Todos os veículos</option>
                  <option value="ABC-1234">ABC-1234</option>
                  <option value="DEF-5678">DEF-5678</option>
                  <option value="GHI-9012">GHI-9012</option>
                  <option value="JKL-3456">JKL-3456</option>
                  <option value="MNO-7890">MNO-7890</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setVehicleFilter('all');
                  }}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Drivers Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Condutores Cadastrados</h2>
              <button 
                onClick={() => setShowNewDriverModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
              >
                <Plus size={16} />
                <span>Novo Condutor</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-sm uppercase tracking-widest font-bold border-b border-slate-100">
                  <th className="px-4 py-4">Condutor</th>
                  <th className="px-4 py-4">CNH</th>
                  <th className="px-4 py-4">Contato</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Score</th>
                  <th className="px-4 py-4">Veículos</th>
                  <th className="px-4 py-4">Incidentes</th>
                  <th className="px-4 py-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-slate-400 italic">Carregando condutores...</td>
                  </tr>
                ) : filteredDrivers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-slate-400 italic">Nenhum condutor encontrado.</td>
                  </tr>
                ) : (
                  filteredDrivers.map((driver) => (
                    <tr key={driver.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <User className="text-emerald-600" size={20} />
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{driver.name}</div>
                            <div className="text-sm text-slate-600">CPF: {driver.cpf}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-slate-700">{driver.cnh}</div>
                        <div className="text-sm text-slate-600">Cat. {driver.cnhCategory}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-slate-700">
                            <Phone size={14} className="text-slate-400" />
                            <span className="text-sm">{driver.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-700">
                            <Mail size={14} className="text-slate-400" />
                            <span className="text-sm">{driver.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border whitespace-nowrap ${getStatusColor(driver.status)}`}>
                          {getStatusLabel(driver.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {getScoreIcon(driver.averageScore)}
                          <span className={`font-medium ${getScoreColor(driver.averageScore)}`}>
                            {driver.averageScore.toFixed(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {driver.vehicles.map(vehicle => (
                            <span key={vehicle} className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">
                              {vehicle}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <AlertTriangle size={16} className={driver.incidents > 0 ? 'text-red-600' : 'text-slate-400'} />
                          <span className={`font-medium ${driver.incidents > 0 ? 'text-red-600' : 'text-slate-700'}`}>
                            {driver.incidents}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => setSelectedDriver(driver)}
                            className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" 
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

        {/* Driver Details Modal */}
        {selectedDriver && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white z-10 p-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-slate-900">Detalhes do Condutor</h3>
                  <button
                    onClick={() => setSelectedDriver(null)}
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                      <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg">
                        {selectedDriver.name}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">CPF</label>
                      <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg">
                        {selectedDriver.cpf}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">CNH</label>
                      <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg">
                        {selectedDriver.cnh} - Categoria {selectedDriver.cnhCategory}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Validade CNH</label>
                      <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg">
                        {new Date(selectedDriver.cnhExpiry).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
                      <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg">
                        {selectedDriver.phone}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                      <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg">
                        {selectedDriver.email}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Endereço</label>
                      <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg">
                        {selectedDriver.address}, {selectedDriver.city}/{selectedDriver.state}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Data de Admissão</label>
                      <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg">
                        {new Date(selectedDriver.hireDate).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border whitespace-nowrap ${getStatusColor(selectedDriver.status)}`}>
                      {getStatusLabel(selectedDriver.status)}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Score Médio</label>
                    <div className="flex items-center gap-2">
                      {getScoreIcon(selectedDriver.averageScore)}
                      <span className={`font-medium ${getScoreColor(selectedDriver.averageScore)}`}>
                        {selectedDriver.averageScore.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Checklists</label>
                    <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg">
                      {selectedDriver.checklistsCount}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Incidentes</label>
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={16} className={selectedDriver.incidents > 0 ? 'text-red-600' : 'text-slate-400'} />
                      <span className={`font-medium ${selectedDriver.incidents > 0 ? 'text-red-600' : 'text-slate-700'}`}>
                        {selectedDriver.incidents}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Vehicles */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Veículos Associados</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedDriver.vehicles.map(vehicle => (
                      <span key={vehicle} className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-medium">
                        {vehicle}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Certificações</label>
                  <div className="space-y-2">
                    {selectedDriver.certifications.map(cert => (
                      <div key={cert.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Award className="text-slate-600" size={20} />
                          <div>
                            <div className="font-medium text-slate-900">{cert.name}</div>
                            <div className="text-sm text-slate-600">
                              Emissão: {new Date(cert.issueDate).toLocaleDateString('pt-BR')} - 
                              Validade: {new Date(cert.expiryDate).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border whitespace-nowrap ${getCertificationColor(cert.status)}`}>
                          {getCertificationLabel(cert.status)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Observations */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
                  <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg min-h-[80px]">
                    {selectedDriver.observations}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                  <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors">
                    <Edit size={16} />
                    <span>Editar Condutor</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors">
                    <FileText size={16} />
                    <span>Gerar Relatório</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
                    <Award size={16} />
                    <span>Adicionar Certificação</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* New Driver Modal */}
        {showNewDriverModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white z-10 p-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-slate-900">Novo Condutor</h3>
                  <button
                    onClick={() => setShowNewDriverModal(false)}
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo *</label>
                    <input type="text" placeholder="Nome completo do condutor..." className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"/>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">CPF *</label>
                    <input type="text" placeholder="000.000.000-00" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"/>
                  </div>
                </div>

                {/* CNH Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">CNH *</label>
                    <input type="text" placeholder="Número da CNH..." className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"/>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Categoria *</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                      <option value="">Selecione...</option>
                      <option value="A">A - Motocicleta</option>
                      <option value="B">B - Automóvel</option>
                      <option value="C">C - Caminhão</option>
                      <option value="D">D - Ônibus</option>
                      <option value="E">E - Veículos com reboque</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Validade CNH *</label>
                    <input type="date" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"/>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Telefone *</label>
                    <input type="tel" placeholder="(00) 00000-0000" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"/>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                    <input type="email" placeholder="email@exemplo.com" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"/>
                  </div>
                </div>

                {/* Address */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Endereço *</label>
                    <input type="text" placeholder="Rua, número..." className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"/>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Cidade *</label>
                    <input type="text" placeholder="Cidade..." className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"/>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Estado *</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                      <option value="">Selecione...</option>
                      <option value="SP">São Paulo</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="MG">Minas Gerais</option>
                      <option value="BA">Bahia</option>
                      <option value="RS">Rio Grande do Sul</option>
                    </select>
                  </div>
                </div>

                {/* Hire Date and Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Data de Admissão *</label>
                    <input type="date" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"/>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status *</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                      <option value="">Selecione...</option>
                      <option value="active">Ativo</option>
                      <option value="inactive">Inativo</option>
                      <option value="suspended">Suspenso</option>
                      <option value="vacation">Férias</option>
                    </select>
                  </div>
                </div>

                {/* Vehicles */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Veículos Associados</label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <select className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                        <option value="">Selecione um veículo...</option>
                        <option value="ABC-1234">ABC-1234 - Mercedes-Benz Actros 1846</option>
                        <option value="DEF-5678">DEF-5678 - Mercedes-Benz Sprinter</option>
                        <option value="GHI-9012">GHI-9012 - Volvo FH 540</option>
                        <option value="JKL-3456">JKL-3456 - Fiat Ducato</option>
                        <option value="MNO-7890">MNO-7890 - Honda Titan</option>
                      </select>
                      <button type="button" className="px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg transition-colors">
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Observations */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
                  <textarea 
                    placeholder="Informações adicionais sobre o condutor..."
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  ></textarea>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => setShowNewDriverModal(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
                    <Plus size={16} />
                    <span>Cadastrar Condutor</span>
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
