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
  Navigation,
  Map,
  Truck,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Download,
  ZoomIn,
  ZoomOut,
  Layers,
  Maximize2,
  Settings,
  Activity,
  Moon,
  Sun,
  Satellite,
  Globe
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

interface EmbarkationPoint {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  status: 'checkin' | 'embarcando' | 'nhe' | 'sem-checkin';
  capacity: number;
  currentLoad: number;
  lastActivity: string;
  responsible: string;
  phone: string;
  email: string;
  operatingHours: {
    open: string;
    close: string;
  };
  restrictions: string[];
  products: string[];
  averageWaitTime: number;
  monthlyVolume: number;
  equipment: Equipment[];
  observations: string;
  serviceOrders: {
    aguardandoPatio: number;
    carregando: number;
    liberados: number;
    recusados: number;
  };
}

interface Equipment {
  id: string;
  name: string;
  type: 'scale' | 'conveyor' | 'crane' | 'forklift' | 'pump';
  status: 'operational' | 'maintenance' | 'offline';
  lastMaintenance: string;
}

export const EmbarkationMap: React.FC = () => {
  const [embarkationPoints, setEmbarkationPoints] = useState<EmbarkationPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<EmbarkationPoint | null>(null);
  const [showNewPointModal, setShowNewPointModal] = useState(false);
  const [mapZoom, setMapZoom] = useState(6);
  const [mapCenter, setMapCenter] = useState({ lat: -15.8267, lng: -47.9218 }); // Centro do Brasil
  const [showSidebar, setShowSidebar] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [satelliteView, setSatelliteView] = useState(false);
  const [hybridView, setHybridView] = useState(false);

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      const mockPoints: EmbarkationPoint[] = [
        {
          id: '1',
          name: 'Fazenda São José',
          code: 'FSJ-001',
          address: 'Rodovia BR-050, Km 123',
          city: 'Uberlândia',
          state: 'MG',
          coordinates: { lat: -18.9111, lng: -48.2752 },
          status: 'checkin',
          capacity: 500,
          currentLoad: 320,
          lastActivity: '2024-03-22T10:30:00',
          responsible: 'Carlos Alberto Silva',
          phone: '(34) 98765-4321',
          email: 'fsj001@empresa.com',
          operatingHours: { open: '06:00', close: '18:00' },
          restrictions: ['Cargas acima de 40 toneladas'],
          products: ['Soja', 'Milho', 'Trigo'],
          averageWaitTime: 25,
          monthlyVolume: 12500,
          equipment: [
            { id: '1', name: 'Balança Eletrônica 01', type: 'scale', status: 'operational', lastMaintenance: '2024-03-15' },
            { id: '2', name: 'Esteira Transportadora', type: 'conveyor', status: 'operational', lastMaintenance: '2024-03-10' }
          ],
          observations: 'Ponto operacional com excelente estrutura. Acesso facilitado para caminhões.',
          serviceOrders: {
            aguardandoPatio: 8,
            carregando: 3,
            liberados: 12,
            recusados: 2
          }
        },
        {
          id: '2',
          name: 'Armazém Centro-Oeste',
          code: 'ACO-002',
          address: 'Avenida Contorno, 500',
          city: 'Goiânia',
          state: 'GO',
          coordinates: { lat: -16.6864, lng: -49.2643 },
          status: 'embarcando',
          capacity: 750,
          currentLoad: 450,
          lastActivity: '2024-03-22T09:45:00',
          responsible: 'Maria Oliveira Costa',
          phone: '(62) 91234-5678',
          email: 'aco002@empresa.com',
          operatingHours: { open: '05:30', close: '22:00' },
          restrictions: [],
          products: ['Soja', 'Milho', 'Café', 'Algodão'],
          averageWaitTime: 15,
          monthlyVolume: 18750,
          equipment: [
            { id: '3', name: 'Balança Eletrônica 02', type: 'scale', status: 'operational', lastMaintenance: '2024-03-18' },
            { id: '4', name: 'Empilhadeira CAT', type: 'forklift', status: 'maintenance', lastMaintenance: '2024-03-20' }
          ],
          observations: 'Maior capacidade de armazenamento. Operação 24h durante safra.',
          serviceOrders: {
            aguardandoPatio: 5,
            carregando: 4,
            liberados: 8,
            recusados: 1
          }
        },
        {
          id: '3',
          name: 'Terminal Rio Verde',
          code: 'TRV-003',
          address: 'Rodovia BR-364, Km 456',
          city: 'Rio Verde',
          state: 'GO',
          coordinates: { lat: -17.7921, lng: -50.9095 },
          status: 'nhe',
          capacity: 300,
          currentLoad: 0,
          lastActivity: '2024-03-20T16:00:00',
          responsible: 'Pedro Henrique Santos',
          phone: '(64) 97654-3210',
          email: 'trv003@empresa.com',
          operatingHours: { open: '07:00', close: '17:00' },
          restrictions: ['Operação suspensa temporariamente'],
          products: ['Soja', 'Milho'],
          averageWaitTime: 0,
          monthlyVolume: 0,
          equipment: [
            { id: '5', name: 'Balança Mecânica', type: 'scale', status: 'offline', lastMaintenance: '2024-03-01' }
          ],
          observations: 'Em manutenção programada. Previsão de retorno: 25/03/2024.',
          serviceOrders: {
            aguardandoPatio: 0,
            carregando: 0,
            liberados: 0,
            recusados: 0
          }
        },
        {
          id: '4',
          name: 'Porto Seco Anápolis',
          code: 'PSA-004',
          address: 'Estrada Municipal, Km 78',
          city: 'Anápolis',
          state: 'GO',
          coordinates: { lat: -16.3270, lng: -48.9526 },
          status: 'checkin',
          capacity: 400,
          currentLoad: 280,
          lastActivity: '2024-03-22T11:15:00',
          responsible: 'Ana Paula Ferreira',
          phone: '(62) 92345-6789',
          email: 'psa004@empresa.com',
          operatingHours: { open: '06:30', close: '19:30' },
          restrictions: ['Apenas veículos leves'],
          products: ['Café', 'Frutas', 'Legumes'],
          averageWaitTime: 20,
          monthlyVolume: 8400,
          equipment: [
            { id: '6', name: 'Balança Eletrônica 03', type: 'scale', status: 'operational', lastMaintenance: '2024-03-12' },
            { id: '7', name: 'Talha Industrial', type: 'crane', status: 'operational', lastMaintenance: '2024-03-08' }
          ],
          observations: 'Especializado em produtos perecíveis. Estrutura de refrigeração disponível.',
          serviceOrders: {
            aguardandoPatio: 6,
            carregando: 2,
            liberados: 15,
            recusados: 3
          }
        },
        {
          id: '5',
          name: 'Centro de Distribuição Sudeste',
          code: 'CDS-005',
          address: 'Rodovia Presidente Dutra, Km 234',
          city: 'São José dos Campos',
          state: 'SP',
          coordinates: { lat: -23.2237, lng: -45.9009 },
          status: 'sem-checkin',
          capacity: 600,
          currentLoad: 380,
          lastActivity: '2024-03-22T12:00:00',
          responsible: 'Roberto Carlos Almeida',
          phone: '(12) 98765-1234',
          email: 'cds005@empresa.com',
          operatingHours: { open: '05:00', close: '23:00' },
          restrictions: [],
          products: ['Soja', 'Milho', 'Trigo', 'Arroz'],
          averageWaitTime: 30,
          monthlyVolume: 15000,
          equipment: [
            { id: '8', name: 'Balança Eletrônica 04', type: 'scale', status: 'operational', lastMaintenance: '2024-03-16' },
            { id: '9', name: 'Bomba Hidráulica', type: 'pump', status: 'operational', lastMaintenance: '2024-03-14' }
          ],
          observations: 'Estratégico para distribuição na região Sudeste. Conexão com rodovias principais.',
          serviceOrders: {
            aguardandoPatio: 10,
            carregando: 5,
            liberados: 20,
            recusados: 4
          }
        }
      ];

      setEmbarkationPoints(mockPoints);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredPoints = embarkationPoints.filter(point => {
    const matchesSearch = 
      point.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      point.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      point.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      point.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      point.responsible.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || point.status === statusFilter;
    const matchesCity = cityFilter === 'all' || point.city === cityFilter;

    return matchesSearch && matchesStatus && matchesCity;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'checkin': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'embarcando': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'nhe': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'sem-checkin': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'checkin': return 'Checkin';
      case 'embarcando': return 'Embarcando';
      case 'nhe': return 'NHE';
      case 'sem-checkin': return 'Sem Checkin';
      default: return status;
    }
  };

  const getEquipmentIcon = (type: string) => {
    switch (type) {
      case 'scale': return <Package size={16} />;
      case 'conveyor': return <Activity size={16} />;
      case 'crane': return <Truck size={16} />;
      case 'forklift': return <Truck size={16} />;
      case 'pump': return <Settings size={16} />;
      default: return <Package size={16} />;
    }
  };

  const getMapStats = () => {
    const total = embarkationPoints.length;
    const checkin = embarkationPoints.filter(p => p.status === 'checkin').length;
    const embarcando = embarkationPoints.filter(p => p.status === 'embarcando').length;
    const nhe = embarkationPoints.filter(p => p.status === 'nhe').length;
    const totalCapacity = embarkationPoints.reduce((acc, p) => acc + p.capacity, 0);
    const currentLoad = embarkationPoints.reduce((acc, p) => acc + p.currentLoad, 0);
    const utilizationRate = totalCapacity > 0 ? (currentLoad / totalCapacity) * 100 : 0;

    return { total, checkin, embarcando, nhe, totalCapacity, currentLoad, utilizationRate };
  };

  // Criar ícones personalizados para os marcadores
  const createCustomIcon = (status: string) => {
    const color = status === 'checkin' ? '#10b981' :
                  status === 'embarcando' ? '#3b82f6' :
                  status === 'nhe' ? '#f59e0b' :
                  '#ef4444';
    
    return L.divIcon({
      html: `
        <div style="position: relative; width: 30px; height: 30px;">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="${color}" stroke="white" stroke-width="2"/>
            <circle cx="12" cy="10" r="3" fill="white"/>
          </svg>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30],
      className: 'custom-marker'
    });
  };

  // Componente para controlar o mapa
  const MapController = () => {
    const map = useMap();
    
    useEffect(() => {
      if (selectedPoint) {
        map.setView([selectedPoint.coordinates.lat, selectedPoint.coordinates.lng], 12);
      }
    }, [selectedPoint, map]);
    
    return null;
  };

  const handleMapClick = (point: EmbarkationPoint) => {
    setSelectedPoint(point);
    setMapCenter(point.coordinates);
    setMapZoom(12);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Map className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Mapa de Embarque
                  </h1>
                  <p className="text-slate-500 font-medium">Visualização geográfica dos pontos de embarque</p>
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
                  placeholder="Buscar pontos de embarque..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all shadow-sm w-64"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-88px)]">
        {/* Sidebar */}
        <div className={`${showSidebar ? 'w-96' : 'w-0'} bg-white border-r border-slate-200 transition-all duration-300 overflow-hidden flex flex-col`}>
          {/* Stats Cards */}
          <div className="p-6 space-y-4 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900">Estatísticas</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-emerald-600 font-medium">Checkin</p>
                    <p className="text-xl font-bold text-emerald-900">{getMapStats().checkin}</p>
                  </div>
                  <CheckCircle className="text-emerald-600" size={20} />
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-blue-600 font-medium">Embarcando</p>
                    <p className="text-xl font-bold text-blue-900">{getMapStats().embarcando}</p>
                  </div>
                  <Truck className="text-blue-600" size={20} />
                </div>
              </div>
              <div className="bg-amber-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-amber-600 font-medium">NHE</p>
                    <p className="text-xl font-bold text-amber-900">{getMapStats().nhe}</p>
                  </div>
                  <AlertTriangle className="text-amber-600" size={20} />
                </div>
              </div>
              <div className="bg-red-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-red-600 font-medium">Sem Checkin</p>
                    <p className="text-xl font-bold text-red-900">{embarkationPoints.filter(p => p.status === 'sem-checkin').length}</p>
                  </div>
                  <XCircle className="text-red-600" size={20} />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">Filtros</h3>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-sm"
              >
                <Filter size={14} />
                <span>Opções</span>
              </button>
            </div>
            
            {showFilters && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Todos</option>
                    <option value="checkin">Checkin</option>
                    <option value="embarcando">Embarcando</option>
                    <option value="nhe">NHE</option>
                    <option value="sem-checkin">Sem Checkin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Cidade</label>
                  <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Todas</option>
                    <option value="Uberlândia">Uberlândia</option>
                    <option value="Goiânia">Goiânia</option>
                    <option value="Rio Verde">Rio Verde</option>
                    <option value="Anápolis">Anápolis</option>
                    <option value="São José dos Campos">São José dos Campos</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setCityFilter('all');
                  }}
                  className="w-full px-2 py-1 text-sm bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            )}
          </div>

          {/* Points List */}
          <div className="flex-1 overflow-y-auto p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Pontos de Embarque</h3>
            <div className="space-y-3">
              {loading ? (
                <div className="text-center text-slate-400 italic">Carregando pontos...</div>
              ) : filteredPoints.length === 0 ? (
                <div className="text-center text-slate-400 italic">Nenhum ponto encontrado.</div>
              ) : (
                filteredPoints.map((point) => (
                  <div
                    key={point.id}
                    onClick={() => handleMapClick(point)}
                    className={`p-3 bg-white border rounded-lg cursor-pointer transition-all hover:shadow-md hover:border-blue-300 ${
                      selectedPoint?.id === point.id ? 'border-blue-500 shadow-md' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium text-slate-900">{point.name}</div>
                        <div className="text-xs text-slate-600">{point.code}</div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getStatusColor(point.status)}`}>
                        {getStatusLabel(point.status)}
                      </span>
                    </div>
                    <div className="space-y-1 text-xs text-slate-600">
                      <div className="flex items-center gap-1">
                        <MapPin size={12} />
                        <span>{point.city}/{point.state}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Package size={12} />
                        <span>{point.currentLoad}/{point.capacity} ton</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>Espera: {point.averageWaitTime}min</span>
                      </div>
                    </div>
                    
                    {/* Ordens de Serviço */}
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <div className="text-xs font-medium text-slate-700 mb-2">O.S. por Status</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-slate-600">Pátio: <strong>{point.serviceOrders.aguardandoPatio}</strong></span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-slate-600">Carregando: <strong>{point.serviceOrders.carregando}</strong></span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span className="text-slate-600">Liberados: <strong>{point.serviceOrders.liberados}</strong></span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-slate-600">Recusados: <strong>{point.serviceOrders.recusados}</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div className={`flex-1 relative ${darkMode ? 'bg-slate-900' : 'bg-slate-100'}`}>
          {/* Map Controls */}
          <div className="absolute top-8 right-4 z-10 space-y-2">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className={`${darkMode ? 'bg-slate-800 border-slate-600 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-slate-50'} rounded-lg shadow-lg border p-2 transition-colors`}
              title={showSidebar ? 'Ocultar barra lateral' : 'Mostrar barra lateral'}
            >
              <Layers size={16} className={darkMode ? 'text-slate-200' : 'text-slate-700'} />
            </button>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`${darkMode ? 'bg-slate-800 border-slate-600 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-slate-50'} rounded-lg shadow-lg border p-2 transition-colors`}
              title={darkMode ? 'Tema Claro' : 'Tema Escuro'}
            >
              {darkMode ? <Sun size={16} className="text-slate-200" /> : <Moon size={16} className="text-slate-700" />}
            </button>
            
            <button
              onClick={() => {
                setSatelliteView(!satelliteView);
                setHybridView(false);
              }}
              className={`${darkMode ? 'bg-slate-800 border-slate-600 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-slate-50'} rounded-lg shadow-lg border p-2 transition-colors`}
              title={satelliteView ? 'Mapa Padrão' : 'Visualização de Satélite'}
            >
              <Satellite size={16} className={darkMode ? 'text-slate-200' : 'text-slate-700'} />
            </button>
            
            <button
              onClick={() => {
                setHybridView(!hybridView);
                setSatelliteView(false);
              }}
              className={`${darkMode ? 'bg-slate-800 border-slate-600 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-slate-50'} rounded-lg shadow-lg border p-2 transition-colors`}
              title={hybridView ? 'Mapa Padrão' : 'Satélite com Labels'}
            >
              <Globe size={16} className={darkMode ? 'text-slate-200' : 'text-slate-700'} />
            </button>
            
            {/* Legenda */}
            <div className={`${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-200'} rounded-lg shadow-lg border p-3`}>
              <h4 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Status</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                  <span className={`text-xs ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Checkin</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                  <span className={`text-xs ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Embarcando</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full border-2 border-white"></div>
                  <span className={`text-xs ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>NHE</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                  <span className={`text-xs ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Sem Checkin</span>
                </div>
              </div>
              
              <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-slate-600' : 'border-slate-100'}`}>
                <div className="flex items-center gap-2">
                  {hybridView ? (
                    <Globe size={12} className={darkMode ? 'text-slate-400' : 'text-slate-500'} />
                  ) : satelliteView ? (
                    <Satellite size={12} className={darkMode ? 'text-slate-400' : 'text-slate-500'} />
                  ) : (
                    <Map size={12} className={darkMode ? 'text-slate-400' : 'text-slate-500'} />
                  )}
                  <span className={`text-xs font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {hybridView ? 'Satélite com Labels' : satelliteView ? 'Satélite' : darkMode ? 'Mapa Escuro' : 'Mapa Padrão'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Mapa Real com Leaflet */}
          <div className="w-full h-full relative">
            <style>{`
              .leaflet-control-zoom {
                top: 2rem !important;
                left: 1rem !important;
              }
              .leaflet-control-zoom-in,
              .leaflet-control-zoom-out {
                background-color: white !important;
                border: 2px solid rgba(0,0,0,0.2) !important;
                border-radius: 8px !important;
                width: 32px !important;
                height: 32px !important;
                line-height: 28px !important;
                font-size: 16px !important;
                font-weight: bold !important;
                margin-bottom: 4px !important;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
              }
              .leaflet-control-zoom-in:hover,
              .leaflet-control-zoom-out:hover {
                background-color: #f8f9fa !important;
                border-color: rgba(0,0,0,0.3) !important;
              }
              ${darkMode ? `
                .leaflet-control-zoom-in,
                .leaflet-control-zoom-out {
                  background-color: #1e293b !important;
                  border-color: #475569 !important;
                  color: #e2e8f0 !important;
                }
                .leaflet-control-zoom-in:hover,
                .leaflet-control-zoom-out:hover {
                  background-color: #334155 !important;
                  border-color: #64748b !important;
                }
              ` : ''}
            `}</style>
            
            <MapContainer
              center={[mapCenter.lat, mapCenter.lng]}
              zoom={mapZoom}
              maxZoom={18}
              minZoom={3}
              style={{ height: '100%', width: '100%' }}
              className="z-0"
            >
              <TileLayer
                attribution={hybridView
                  ? '&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                  : satelliteView 
                    ? '&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                    : darkMode 
                      ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://stadia.com/">Stadia Maps</a>'
                      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }
                url={hybridView
                  ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  : satelliteView 
                    ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    : darkMode 
                      ? "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                }
                errorTileUrl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
                maxZoom={18}
                maxNativeZoom={18}
              />
              
              {/* Labels para visualização híbrida */}
              {hybridView && (
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  opacity={0.7}
                  errorTileUrl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
                  maxZoom={18}
                  maxNativeZoom={18}
                />
              )}
              
              {/* Marcadores dos pontos de embarque */}
              {filteredPoints.map((point) => (
                <Marker
                  key={point.id}
                  position={[point.coordinates.lat, point.coordinates.lng]}
                  icon={createCustomIcon(point.status)}
                  eventHandlers={{
                    click: () => handleMapClick(point),
                  }}
                >
                  <Popup>
                    <div className="p-3 min-w-[200px]">
                      <h3 className="font-semibold text-slate-900 mb-2">{point.name}</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Código:</span>
                          <span>{point.code}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getStatusColor(point.status)}`}>
                            {getStatusLabel(point.status)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Capacidade:</span>
                          <span>{point.currentLoad}/{point.capacity} ton</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Espera:</span>
                          <span>{point.averageWaitTime}min</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Volume:</span>
                          <span>{point.monthlyVolume.toLocaleString()}/mês</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-slate-400" />
                          <span>{point.address}, {point.city}/{point.state}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedPoint(point)}
                        className="mt-3 w-full px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                      >
                        Ver Detalhes
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
              
              <MapController />
            </MapContainer>
          </div>

          {/* Point Details Panel */}
          {selectedPoint && (
            <div className={`absolute bottom-4 left-4 right-4 ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-200'} rounded-lg shadow-lg border p-4 max-w-md`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className={`font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{selectedPoint.name}</h3>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{selectedPoint.code}</p>
                </div>
                <button
                  onClick={() => setSelectedPoint(null)}
                  className={`p-1 ${darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  ×
                </button>
              </div>
              
              <div className={`grid grid-cols-2 gap-3 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                <div>
                  <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getStatusColor(selectedPoint.status)}`}>
                    {getStatusLabel(selectedPoint.status)}
                  </span>
                </div>
                <div>
                  <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Capacidade:</span>
                  <span className="ml-2 font-medium">{selectedPoint.currentLoad}/{selectedPoint.capacity} ton</span>
                </div>
                <div>
                  <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Espera:</span>
                  <span className="ml-2 font-medium">{selectedPoint.averageWaitTime}min</span>
                </div>
                <div>
                  <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Volume:</span>
                  <span className="ml-2 font-medium">{selectedPoint.monthlyVolume.toLocaleString()}/mês</span>
                </div>
              </div>
              
              <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-slate-600' : 'border-slate-100'}`}>
                <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  <MapPin size={14} className={darkMode ? 'text-slate-400' : 'text-slate-400'} />
                  <span>{selectedPoint.address}, {selectedPoint.city}/{selectedPoint.state}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
