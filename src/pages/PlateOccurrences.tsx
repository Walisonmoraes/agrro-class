import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  AlertTriangle,
  Calendar,
  Truck,
  MapPin,
  Clock,
  FileText,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface PlateOccurrence {
  id: string;
  plate: string;
  occurrenceType: 'violation' | 'warning' | 'info' | 'blocked';
  description: string;
  location: string;
  date: string;
  time: string;
  status: 'pending' | 'resolved' | 'investigating';
  reportedBy: string;
  vehicle: string;
  driver: string;
}

export const PlateOccurrencesPage: React.FC = () => {
  const [occurrences, setOccurrences] = useState<PlateOccurrence[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setOccurrences([
        {
          id: '1',
          plate: 'ABC-1234',
          occurrenceType: 'violation',
          description: 'Excesso de velocidade detectado',
          location: 'Rodovia BR-116, km 245',
          date: '2024-03-20',
          time: '14:30',
          status: 'pending',
          reportedBy: 'Sistema Radar',
          vehicle: 'Caminhão Scania',
          driver: 'João Silva'
        },
        {
          id: '2',
          plate: 'DEF-5678',
          occurrenceType: 'warning',
          description: 'Veículo em área não autorizada',
          location: 'Armazém 2 - Setor B',
          date: '2024-03-20',
          time: '10:15',
          status: 'resolved',
          reportedBy: 'Segurança Patrimonial',
          vehicle: 'Van Mercedes',
          driver: 'Maria Santos'
        },
        {
          id: '3',
          plate: 'GHI-9012',
          occurrenceType: 'blocked',
          description: 'Placa bloqueada por pendências',
          location: 'Portaria Principal',
          date: '2024-03-19',
          time: '08:45',
          status: 'investigating',
          reportedBy: 'Portaria',
          vehicle: 'Caminhão Volvo',
          driver: 'Pedro Oliveira'
        },
        {
          id: '4',
          plate: 'JKL-3456',
          occurrenceType: 'info',
          description: 'Manutenção programada registrada',
          location: 'Oficina Mecânica',
          date: '2024-03-19',
          time: '16:20',
          status: 'resolved',
          reportedBy: 'Equipe Manutenção',
          vehicle: 'Caminhão Iveco',
          driver: 'Carlos Ferreira'
        },
        {
          id: '5',
          plate: 'MNO-7890',
          occurrenceType: 'violation',
          description: 'Tempo de parada irregular',
          location: 'Pátio de Carga 3',
          date: '2024-03-18',
          time: '22:10',
          status: 'pending',
          reportedBy: 'Sistema Monitoramento',
          vehicle: 'Caminhão Ford',
          driver: 'Ana Costa'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredOccurrences = occurrences.filter(occurrence => {
    const matchesSearch = occurrence.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         occurrence.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         occurrence.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || occurrence.occurrenceType === filterType;
    const matchesStatus = filterStatus === 'all' || occurrence.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getOccurrenceTypeColor = (type: string) => {
    switch (type) {
      case 'violation': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'blocked': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getOccurrenceTypeLabel = (type: string) => {
    switch (type) {
      case 'violation': return 'Infração';
      case 'warning': return 'Aviso';
      case 'info': return 'Informação';
      case 'blocked': return 'Bloqueado';
      default: return type;
    }
  };

  const getOccurrenceTypeIcon = (type: string) => {
    switch (type) {
      case 'violation': return XCircle;
      case 'warning': return AlertTriangle;
      case 'info': return AlertCircle;
      case 'blocked': return AlertCircle;
      default: return AlertCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-800 border-red-200';
      case 'resolved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'investigating': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'resolved': return 'Resolvido';
      case 'investigating': return 'Em Investigação';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'resolved': return CheckCircle;
      case 'investigating': return Eye;
      default: return Clock;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Header Moderno */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                  <AlertTriangle className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Ocorrência de Placa
                  </h1>
                  <p className="text-slate-500 font-medium">Monitoramento e gestão de ocorrências de veículos</p>
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
                  placeholder="Buscar por placa ou motorista..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-orange-500 transition-all shadow-sm w-64"
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
                <p className="text-sm text-slate-600 font-medium">Total de Ocorrências</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{occurrences.length}</p>
                <p className="text-xs text-orange-600 mt-2">Últimas 24h</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="text-orange-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Pendentes</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {occurrences.filter(o => o.status === 'pending').length}
                </p>
                <p className="text-xs text-red-600 mt-2">Requerem atenção</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Clock className="text-red-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Resolvidas</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {occurrences.filter(o => o.status === 'resolved').length}
                </p>
                <p className="text-xs text-emerald-600 mt-2">Concluídas</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="text-emerald-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Infrações</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {occurrences.filter(o => o.occurrenceType === 'violation').length}
                </p>
                <p className="text-xs text-red-600 mt-2">Gravidade alta</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <XCircle className="text-red-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="relative max-w-md flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text"
                  placeholder="Buscar ocorrências..."
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:border-orange-500 transition-all shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-3">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:border-orange-500 transition-all shadow-sm"
                >
                  <option value="all">Todos os tipos</option>
                  <option value="violation">Infração</option>
                  <option value="warning">Aviso</option>
                  <option value="info">Informação</option>
                  <option value="blocked">Bloqueado</option>
                </select>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:border-orange-500 transition-all shadow-sm"
                >
                  <option value="all">Todos os status</option>
                  <option value="pending">Pendente</option>
                  <option value="resolved">Resolvido</option>
                  <option value="investigating">Em Investigação</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-xs uppercase tracking-widest font-bold border-b border-slate-100">
                  <th className="px-8 py-5">Placa</th>
                  <th className="px-8 py-5">Tipo</th>
                  <th className="px-8 py-5">Descrição</th>
                  <th className="px-8 py-5">Local</th>
                  <th className="px-8 py-5">Data/Hora</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-8 py-12 text-center text-slate-400 italic">Carregando ocorrências...</td>
                  </tr>
                ) : filteredOccurrences.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-8 py-12 text-center text-slate-400 italic">Nenhuma ocorrência encontrada.</td>
                  </tr>
                ) : (
                  filteredOccurrences.map((occurrence) => {
                    const TypeIcon = getOccurrenceTypeIcon(occurrence.occurrenceType);
                    const StatusIcon = getStatusIcon(occurrence.status);
                    
                    return (
                      <tr key={occurrence.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
                              <Truck size={20} />
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900">{occurrence.plate}</div>
                              <div className="text-sm text-slate-600">{occurrence.driver}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getOccurrenceTypeColor(occurrence.occurrenceType)}`}>
                            {getOccurrenceTypeLabel(occurrence.occurrenceType)}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                            <TypeIcon size={16} className="text-slate-400" />
                            <span className="text-slate-700">{occurrence.description}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2 text-slate-600">
                            <MapPin size={14} className="text-slate-400" />
                            {occurrence.location}
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="text-slate-700">
                            <div className="text-sm">{occurrence.date}</div>
                            <div className="text-xs text-slate-500">{occurrence.time}</div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(occurrence.status)}`}>
                            {getStatusLabel(occurrence.status)}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors" title="Visualizar">
                              <Eye size={16} />
                            </button>
                            <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors" title="Detalhes">
                              <FileText size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
