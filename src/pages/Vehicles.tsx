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
  Fuel,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
  Truck,
  Settings,
  Car
} from 'lucide-react';

interface Vehicle {
  id: string;
  plate: string;
  model: string;
  brand: string;
  year: number;
  type: 'truck' | 'van' | 'car' | 'motorcycle';
  status: 'active' | 'maintenance' | 'inactive' | 'in_use';
  driver: string;
  lastMaintenance: string;
  nextMaintenance: string;
  fuelType: 'diesel' | 'gasoline' | 'ethanol' | 'electric';
  capacity: number;
  currentMileage: number;
  location: string;
  insurance: string;
  documents: {
    crv: string;
    crlv: string;
    insurance: string;
  };
  observations: string;
}

export const Vehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showNewVehicleModal, setShowNewVehicleModal] = useState(false);

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      const mockVehicles: Vehicle[] = [
        {
          id: '1',
          plate: 'ABC-1234',
          model: 'Actros 1846',
          brand: 'Mercedes-Benz',
          year: 2022,
          type: 'truck',
          status: 'active',
          driver: 'João Silva',
          lastMaintenance: '2024-02-15',
          nextMaintenance: '2024-05-15',
          fuelType: 'diesel',
          capacity: 32000,
          currentMileage: 85000,
          location: 'São Paulo - SP',
          insurance: 'Porto Seguro',
          documents: {
            crv: '2025-12-31',
            crlv: '2025-06-30',
            insurance: '2024-12-31'
          },
          observations: 'Veículo em excelente estado, revisões em dia.'
        },
        {
          id: '2',
          plate: 'DEF-5678',
          model: 'Sprinter',
          brand: 'Mercedes-Benz',
          year: 2021,
          type: 'van',
          status: 'in_use',
          driver: 'Carlos Santos',
          lastMaintenance: '2024-01-20',
          nextMaintenance: '2024-04-20',
          fuelType: 'diesel',
          capacity: 3500,
          currentMileage: 62000,
          location: 'Campinas - SP',
          insurance: 'SulAmérica',
          documents: {
            crv: '2025-08-31',
            crlv: '2025-02-28',
            insurance: '2024-10-31'
          },
          observations: 'Van utilizada para entregas urbanas.'
        },
        {
          id: '3',
          plate: 'GHI-9012',
          model: 'FH 540',
          brand: 'Volvo',
          year: 2023,
          type: 'truck',
          status: 'maintenance',
          driver: 'Maria Oliveira',
          lastMaintenance: '2024-03-10',
          nextMaintenance: '2024-06-10',
          fuelType: 'diesel',
          capacity: 40000,
          currentMileage: 45000,
          location: 'Oficina - São Paulo',
          insurance: 'Tokio Marine',
          documents: {
            crv: '2026-03-31',
            crlv: '2025-09-30',
            insurance: '2025-03-31'
          },
          observations: 'Em manutenção preventiva, previsão de retorno 2 dias.'
        },
        {
          id: '4',
          plate: 'JKL-3456',
          model: 'Ducato',
          brand: 'Fiat',
          year: 2020,
          type: 'van',
          status: 'active',
          driver: 'Pedro Costa',
          lastMaintenance: '2024-02-28',
          nextMaintenance: '2024-05-28',
          fuelType: 'diesel',
          capacity: 1500,
          currentMileage: 78000,
          location: 'Ribeirão Preto - SP',
          insurance: 'Bradesco',
          documents: {
            crv: '2025-04-30',
            crlv: '2024-10-31',
            insurance: '2024-08-31'
          },
          observations: 'Veículo leve para entregas rápidas.'
        },
        {
          id: '5',
          plate: 'MNO-7890',
          model: 'Titan',
          brand: 'Honda',
          year: 2022,
          type: 'motorcycle',
          status: 'active',
          driver: 'Lucas Ferreira',
          lastMaintenance: '2024-03-01',
          nextMaintenance: '2024-06-01',
          fuelType: 'gasoline',
          capacity: 0,
          currentMileage: 25000,
          location: 'São Paulo - SP',
          insurance: 'HDI',
          documents: {
            crv: '2025-11-30',
            crlv: '2025-05-31',
            insurance: '2024-09-30'
          },
          observations: 'Moto para serviços rápidos e entregas.'
        }
      ];

      setVehicles(mockVehicles);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    const matchesType = typeFilter === 'all' || vehicle.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'in_use': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'maintenance': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'inactive': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'in_use': return 'Em Uso';
      case 'maintenance': return 'Manutenção';
      case 'inactive': return 'Inativo';
      default: return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'truck': return 'Caminhão';
      case 'van': return 'Van';
      case 'car': return 'Carro';
      case 'motorcycle': return 'Moto';
      default: return type;
    }
  };

  const getFuelTypeLabel = (type: string) => {
    switch (type) {
      case 'diesel': return 'Diesel';
      case 'gasoline': return 'Gasolina';
      case 'ethanol': return 'Etanol';
      case 'electric': return 'Elétrico';
      default: return type;
    }
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'truck': return <Car size={20} />;
      case 'van': return <Car size={20} />;
      case 'car': return <Car size={20} />;
      case 'motorcycle': return <Car size={20} />;
      default: return <Car size={20} />;
    }
  };

  const isDocumentExpiring = (date: string) => {
    const expiryDate = new Date(date);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25">
                  <Car className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Frota - Veículos
                  </h1>
                  <p className="text-slate-500 font-medium">Gestão completa da frota de veículos</p>
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
                  placeholder="Buscar veículos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all shadow-sm w-64"
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
                <p className="text-sm text-slate-600 font-medium">Total de Veículos</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{vehicles.length}</p>
                <p className="text-xs text-green-600 mt-2">Cadastrados</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Car className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Ativos</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  {vehicles.filter(v => v.status === 'active').length}
                </p>
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
                <p className="text-sm text-slate-600 font-medium">Em Uso</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {vehicles.filter(v => v.status === 'in_use').length}
                </p>
                <p className="text-xs text-blue-600 mt-2">Operacionais</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Clock className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Manutenção</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">
                  {vehicles.filter(v => v.status === 'maintenance').length}
                </p>
                <p className="text-xs text-amber-600 mt-2">Indisponíveis</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Wrench className="text-amber-600" size={24} />
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
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todos os status</option>
                  <option value="active">Ativo</option>
                  <option value="in_use">Em Uso</option>
                  <option value="maintenance">Manutenção</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tipo</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todos os tipos</option>
                  <option value="truck">Caminhão</option>
                  <option value="van">Van</option>
                  <option value="car">Carro</option>
                  <option value="motorcycle">Moto</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setTypeFilter('all');
                  }}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Vehicles Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Veículos Cadastrados</h2>
              <button 
                onClick={() => setShowNewVehicleModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Plus size={16} />
                <span>Novo Veículo</span>
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
                  <th className="px-4 py-4">Localização</th>
                  <th className="px-4 py-4">Próxima Manutenção</th>
                  <th className="px-4 py-4">Documentos</th>
                  <th className="px-4 py-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400 italic">Carregando veículos...</td>
                  </tr>
                ) : filteredVehicles.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400 italic">Nenhum veículo encontrado.</td>
                  </tr>
                ) : (
                  filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            {getVehicleIcon(vehicle.type)}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{vehicle.plate}</div>
                            <div className="text-sm text-slate-600">{vehicle.brand} {vehicle.model}</div>
                            <div className="text-xs text-slate-500">{vehicle.year} • {getTypeLabel(vehicle.type)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-slate-700">{vehicle.driver}</div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border whitespace-nowrap ${getStatusColor(vehicle.status)}`}>
                          {getStatusLabel(vehicle.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-slate-400" />
                          <span className="text-slate-700">{vehicle.location}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-slate-700">{new Date(vehicle.nextMaintenance).toLocaleDateString('pt-BR')}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-600">CRV:</span>
                            <span className={`text-xs px-1 py-0.5 rounded ${isDocumentExpiring(vehicle.documents.crv) ? 'bg-red-100 text-red-700' : 'text-slate-700'}`}>
                              {new Date(vehicle.documents.crv).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-600">CRLV:</span>
                            <span className={`text-xs px-1 py-0.5 rounded ${isDocumentExpiring(vehicle.documents.crlv) ? 'bg-red-100 text-red-700' : 'text-slate-700'}`}>
                              {new Date(vehicle.documents.crlv).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => setSelectedVehicle(vehicle)}
                            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
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
      </div>

      {/* Vehicle Details Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">Detalhes do Veículo</h3>
                <button
                  onClick={() => setSelectedVehicle(null)}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Vehicle Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Placa</label>
                    <div className="text-slate-900 font-mono bg-slate-100 px-3 py-2 rounded-lg">
                      {selectedVehicle.plate}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Modelo</label>
                    <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg">
                      {selectedVehicle.brand} {selectedVehicle.model}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Ano</label>
                    <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg">
                      {selectedVehicle.year}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
                    <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg">
                      {getTypeLabel(selectedVehicle.type)}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Combustível</label>
                    <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg">
                      {getFuelTypeLabel(selectedVehicle.fuelType)}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Capacidade</label>
                    <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg">
                      {selectedVehicle.capacity > 0 ? `${selectedVehicle.capacity.toLocaleString('pt-BR')} kg` : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status and Location */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border whitespace-nowrap ${getStatusColor(selectedVehicle.status)}`}>
                    {getStatusLabel(selectedVehicle.status)}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Motorista</label>
                  <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg">
                    {selectedVehicle.driver}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Localização</label>
                  <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg">
                    {selectedVehicle.location}
                  </div>
                </div>
              </div>

              {/* Maintenance Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Última Manutenção</label>
                  <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg">
                    {new Date(selectedVehicle.lastMaintenance).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Próxima Manutenção</label>
                  <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg">
                    {new Date(selectedVehicle.nextMaintenance).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Documentos</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">CRV</span>
                      {isDocumentExpiring(selectedVehicle.documents.crv) && (
                        <AlertTriangle size={14} className="text-amber-600" />
                      )}
                    </div>
                    <div className={`text-slate-900 bg-slate-100 px-3 py-2 rounded-lg ${isDocumentExpiring(selectedVehicle.documents.crv) ? 'border border-amber-300' : ''}`}>
                      {new Date(selectedVehicle.documents.crv).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">CRLV</span>
                      {isDocumentExpiring(selectedVehicle.documents.crlv) && (
                        <AlertTriangle size={14} className="text-amber-600" />
                      )}
                    </div>
                    <div className={`text-slate-900 bg-slate-100 px-3 py-2 rounded-lg ${isDocumentExpiring(selectedVehicle.documents.crlv) ? 'border border-amber-300' : ''}`}>
                      {new Date(selectedVehicle.documents.crlv).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">Seguro</span>
                      {isDocumentExpiring(selectedVehicle.documents.insurance) && (
                        <AlertTriangle size={14} className="text-amber-600" />
                      )}
                    </div>
                    <div className={`text-slate-900 bg-slate-100 px-3 py-2 rounded-lg ${isDocumentExpiring(selectedVehicle.documents.insurance) ? 'border border-amber-300' : ''}`}>
                      {new Date(selectedVehicle.documents.insurance).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Observations */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
                <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg min-h-[80px]">
                  {selectedVehicle.observations}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  <Edit size={16} />
                  <span>Editar</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors">
                  <Wrench size={16} />
                  <span>Agendar Manutenção</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors">
                  <Settings size={16} />
                  <span>Configurações</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Vehicle Modal */}
      {showNewVehicleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">Novo Veículo</h3>
                <button
                  onClick={() => setShowNewVehicleModal(false)}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Vehicle Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Placa *</label>
                    <input
                      type="text"
                      placeholder="ABC-1234"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Marca *</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Selecione...</option>
                      <option value="mercedes">Mercedes-Benz</option>
                      <option value="volvo">Volvo</option>
                      <option value="fiat">Fiat</option>
                      <option value="honda">Honda</option>
                      <option value="vw">Volkswagen</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Modelo *</label>
                    <input
                      type="text"
                      placeholder="Actros 1846"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Ano *</label>
                    <input
                      type="number"
                      placeholder="2024"
                      min="1900"
                      max="2025"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tipo *</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Selecione...</option>
                      <option value="truck">Caminhão</option>
                      <option value="van">Van</option>
                      <option value="car">Carro</option>
                      <option value="motorcycle">Moto</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Combustível *</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Selecione...</option>
                      <option value="diesel">Diesel</option>
                      <option value="gasoline">Gasolina</option>
                      <option value="ethanol">Etanol</option>
                      <option value="electric">Elétrico</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* KM */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Quilometragem Atual (km)</label>
                  <input
                    type="number"
                    placeholder="85000"
                    min="0"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Driver, Status and Location */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Motorista *</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status *</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Selecione...</option>
                    <option value="active">Ativo</option>
                    <option value="in_use">Em Uso</option>
                    <option value="maintenance">Manutenção</option>
                    <option value="inactive">Inativo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Localização</label>
                  <input
                    type="text"
                    placeholder="São Paulo - SP"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Documents */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Documentos</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">CRV</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">CRLV</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Seguro</label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Nome da seguradora"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Observations */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
                <textarea
                  placeholder="Informações adicionais sobre o veículo..."
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setShowNewVehicleModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                  <Plus size={16} />
                  <span>Cadastrar Veículo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
