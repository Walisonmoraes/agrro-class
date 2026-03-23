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
  TrendingUp,
  TrendingDown,
  DollarSign,
  Car,
  AlertTriangle,
  FileText,
  Download,
  BarChart3
} from 'lucide-react';

interface FuelRecord {
  id: string;
  vehiclePlate: string;
  vehicleModel: string;
  vehicleBrand: string;
  vehicleType: 'truck' | 'van' | 'car' | 'motorcycle';
  date: string;
  type: 'gasoline' | 'diesel' | 'ethanol' | 'electric';
  amount: number;
  unitPrice: number;
  totalPrice: number;
  odometer: number;
  station: string;
  driver: string;
  notes: string;
  averageConsumption?: number;
}

export const FuelPage: React.FC = () => {
  const [fuelRecords, setFuelRecords] = useState<FuelRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<FuelRecord | null>(null);
  const [showNewFuelModal, setShowNewFuelModal] = useState(false);

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      const mockFuelRecords: FuelRecord[] = [
        {
          id: '1',
          vehiclePlate: 'ABC-1234',
          vehicleModel: 'Actros 1846',
          vehicleBrand: 'Mercedes-Benz',
          vehicleType: 'truck',
          date: '2024-03-20',
          type: 'diesel',
          amount: 200,
          unitPrice: 5.89,
          totalPrice: 1178.00,
          odometer: 45230,
          station: 'Posto Shell Express',
          driver: 'João Silva',
          notes: 'Abastecimento completo',
          averageConsumption: 8.5
        },
        {
          id: '2',
          vehiclePlate: 'DEF-5678',
          vehicleModel: 'Sprinter',
          vehicleBrand: 'Mercedes-Benz',
          vehicleType: 'van',
          date: '2024-03-19',
          type: 'diesel',
          amount: 80,
          unitPrice: 5.87,
          totalPrice: 469.60,
          odometer: 28450,
          station: 'Posto Ipiranga',
          driver: 'Carlos Santos',
          notes: 'Abastecimento parcial',
          averageConsumption: 10.2
        },
        {
          id: '3',
          vehiclePlate: 'GHI-9012',
          vehicleModel: 'FH 540',
          vehicleBrand: 'Volvo',
          vehicleType: 'truck',
          date: '2024-03-18',
          type: 'diesel',
          amount: 250,
          unitPrice: 5.91,
          totalPrice: 1477.50,
          odometer: 67890,
          station: 'Posto Petrobras',
          driver: 'Maria Oliveira',
          notes: 'Viagem longa',
          averageConsumption: 7.8
        },
        {
          id: '4',
          vehiclePlate: 'JKL-3456',
          vehicleModel: 'Ducato',
          vehicleBrand: 'Fiat',
          vehicleType: 'van',
          date: '2024-03-17',
          type: 'diesel',
          amount: 60,
          unitPrice: 5.85,
          totalPrice: 351.00,
          odometer: 15670,
          station: 'Posto Shell',
          driver: 'Pedro Costa',
          notes: 'Abastecimento urbano',
          averageConsumption: 9.5
        },
        {
          id: '5',
          vehiclePlate: 'MNO-7890',
          vehicleModel: 'Titan',
          vehicleBrand: 'Honda',
          vehicleType: 'motorcycle',
          date: '2024-03-16',
          type: 'gasoline',
          amount: 15,
          unitPrice: 6.45,
          totalPrice: 96.75,
          odometer: 8900,
          station: 'Posto Texaco',
          driver: 'Lucas Ferreira',
          notes: 'Uso diário',
          averageConsumption: 18.5
        }
      ];

      setFuelRecords(mockFuelRecords);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredRecords = fuelRecords.filter(record => {
    const matchesSearch = 
      record.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.vehicleBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.station.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVehicle = vehicleFilter === 'all' || record.vehiclePlate === vehicleFilter;
    const matchesType = typeFilter === 'all' || record.type === typeFilter;

    return matchesSearch && matchesVehicle && matchesType;
  });

  const getFuelTypeLabel = (type: string) => {
    switch (type) {
      case 'gasoline': return 'Gasolina';
      case 'diesel': return 'Diesel';
      case 'ethanol': return 'Etanol';
      case 'electric': return 'Elétrico';
      default: return type;
    }
  };

  const getFuelTypeColor = (type: string) => {
    switch (type) {
      case 'gasoline': return 'bg-red-100 text-red-800 border-red-200';
      case 'diesel': return 'bg-green-100 text-green-800 border-green-200';
      case 'ethanol': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'electric': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getVehicleIcon = (type: string) => {
    return <Car size={20} />;
  };

  const calculateTotalSpent = () => {
    return fuelRecords.reduce((total, record) => total + record.totalPrice, 0);
  };

  const calculateTotalLiters = () => {
    return fuelRecords.reduce((total, record) => total + record.amount, 0);
  };

  const calculateAveragePrice = () => {
    if (fuelRecords.length === 0) return 0;
    return calculateTotalSpent() / calculateTotalLiters();
  };

  const getFuelStats = () => {
    const totalRecords = fuelRecords.length;
    const thisMonth = fuelRecords.filter(r => {
      const recordDate = new Date(r.date);
      const currentDate = new Date();
      return recordDate.getMonth() === currentDate.getMonth() && 
             recordDate.getFullYear() === currentDate.getFullYear();
    }).length;

    const dieselCount = fuelRecords.filter(r => r.type === 'diesel').length;
    const gasolineCount = fuelRecords.filter(r => r.type === 'gasoline').length;

    return { totalRecords, thisMonth, dieselCount, gasolineCount };
  };

  const generateReport = () => {
    const reportContent = `
      <html>
        <head>
          <title>Relatório de Abastecimento</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .stats { display: flex; justify-content: space-around; margin-bottom: 30px; }
            .stat { text-align: center; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Relatório de Abastecimento</h1>
            <p>Data: ${new Date().toLocaleDateString('pt-BR')}</p>
          </div>
          
          <div class="stats">
            <div class="stat">
              <h3>Total Gasto</h3>
              <p>R$ ${calculateTotalSpent().toFixed(2)}</p>
            </div>
            <div class="stat">
              <h3>Total Litros</h3>
              <p>${calculateTotalLiters().toFixed(2)} L</p>
            </div>
            <div class="stat">
              <h3>Preço Médio</h3>
              <p>R$ ${calculateAveragePrice().toFixed(2)}/L</p>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Veículo</th>
                <th>Tipo</th>
                <th>Litros</th>
                <th>Preço Unitário</th>
                <th>Total</th>
                <th>Posto</th>
                <th>Motorista</th>
              </tr>
            </thead>
            <tbody>
              ${filteredRecords.map(record => `
                <tr>
                  <td>${new Date(record.date).toLocaleDateString('pt-BR')}</td>
                  <td>${record.vehiclePlate} - ${record.vehicleBrand} ${record.vehicleModel}</td>
                  <td>${getFuelTypeLabel(record.type)}</td>
                  <td>${record.amount.toFixed(2)} L</td>
                  <td>R$ ${record.unitPrice.toFixed(2)}</td>
                  <td>R$ ${record.totalPrice.toFixed(2)}</td>
                  <td>${record.station}</td>
                  <td>${record.driver}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(reportContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const exportToCSV = () => {
    const headers = ['Data', 'Placa', 'Veículo', 'Tipo', 'Litros', 'Preço Unitário', 'Total', 'Posto', 'Motorista', 'Odômetro'];
    const csvContent = [
      headers.join(','),
      ...filteredRecords.map(record => [
        new Date(record.date).toLocaleDateString('pt-BR'),
        record.vehiclePlate,
        `${record.vehicleBrand} ${record.vehicleModel}`,
        getFuelTypeLabel(record.type),
        record.amount.toFixed(2),
        record.unitPrice.toFixed(2),
        record.totalPrice.toFixed(2),
        record.station,
        record.driver,
        record.odometer
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `abastecimento_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
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
                  <Fuel className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Frota - Combustível
                  </h1>
                  <p className="text-slate-500 font-medium">Gestão completa de abastecimentos</p>
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
                  placeholder="Buscar abastecimentos..."
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
                <p className="text-sm text-slate-600 font-medium">Total Abastecido</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{calculateTotalLiters().toFixed(0)} L</p>
                <p className="text-xs text-blue-600 mt-2">Litros</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Fuel className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total Gasto</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">R$ {calculateTotalSpent().toFixed(0)}</p>
                <p className="text-xs text-red-600 mt-2">Investimento</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <DollarSign className="text-red-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Preço Médio</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">R$ {calculateAveragePrice().toFixed(2)}</p>
                <p className="text-xs text-green-600 mt-2">Por litro</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Este Mês</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{getFuelStats().thisMonth}</p>
                <p className="text-xs text-amber-600 mt-2">Abastecimentos</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Calendar className="text-amber-600" size={24} />
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
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todos os veículos</option>
                  <option value="ABC-1234">ABC-1234</option>
                  <option value="DEF-5678">DEF-5678</option>
                  <option value="GHI-9012">GHI-9012</option>
                  <option value="JKL-3456">JKL-3456</option>
                  <option value="MNO-7890">MNO-7890</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Combustível</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todos os tipos</option>
                  <option value="gasoline">Gasolina</option>
                  <option value="diesel">Diesel</option>
                  <option value="ethanol">Etanol</option>
                  <option value="electric">Elétrico</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setVehicleFilter('all');
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

        {/* Fuel Records Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Histórico de Abastecimentos</h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={generateReport}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  title="Gerar Relatório"
                >
                  <FileText size={16} />
                  <span className="hidden sm:inline">Relatório</span>
                </button>
                <button 
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  title="Exportar CSV"
                >
                  <Download size={16} />
                  <span className="hidden sm:inline">Exportar</span>
                </button>
                <button 
                  onClick={() => setShowNewFuelModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Plus size={16} />
                  <span>Novo Abastecimento</span>
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-sm uppercase tracking-widest font-bold border-b border-slate-100">
                  <th className="px-4 py-4">Data</th>
                  <th className="px-4 py-4">Veículo</th>
                  <th className="px-4 py-4">Tipo</th>
                  <th className="px-4 py-4">Litros</th>
                  <th className="px-4 py-4">Preço Unit.</th>
                  <th className="px-4 py-4">Total</th>
                  <th className="px-4 py-4">Odômetro</th>
                  <th className="px-4 py-4">Posto</th>
                  <th className="px-4 py-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-12 text-center text-slate-400 italic">Carregando abastecimentos...</td>
                  </tr>
                ) : filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-12 text-center text-slate-400 italic">Nenhum abastecimento encontrado.</td>
                  </tr>
                ) : (
                  filteredRecords.map((record) => (
                    <tr key={record.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="text-slate-700">{new Date(record.date).toLocaleDateString('pt-BR')}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            {getVehicleIcon(record.vehicleType)}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{record.vehiclePlate}</div>
                            <div className="text-sm text-slate-600">{record.vehicleBrand} {record.vehicleModel}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border whitespace-nowrap ${getFuelTypeColor(record.type)}`}>
                          {getFuelTypeLabel(record.type)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-slate-700 font-medium">{record.amount.toFixed(2)} L</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-slate-700">R$ {record.unitPrice.toFixed(2)}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <DollarSign size={16} className="text-slate-400" />
                          <span className="text-slate-700 font-medium">R$ {record.totalPrice.toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-slate-700">{record.odometer.toLocaleString('pt-BR')} km</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-slate-700">{record.station}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => setSelectedRecord(record)}
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

        {/* New Fuel Modal */}
        {showNewFuelModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white z-10 p-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-slate-900">Novo Abastecimento</h3>
                  <button
                    onClick={() => setShowNewFuelModal(false)}
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
                    <label className="block text-sm font-medium text-slate-700 mb-1">Veículo *</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Selecione...</option>
                      <option value="ABC-1234">ABC-1234 - Mercedes-Benz Actros 1846</option>
                      <option value="DEF-5678">DEF-5678 - Mercedes-Benz Sprinter</option>
                      <option value="GHI-9012">GHI-9012 - Volvo FH 540</option>
                      <option value="JKL-3456">JKL-3456 - Fiat Ducato</option>
                      <option value="MNO-7890">MNO-7890 - Honda Titan</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Combustível *</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Selecione...</option>
                      <option value="gasoline">Gasolina</option>
                      <option value="diesel">Diesel</option>
                      <option value="ethanol">Etanol</option>
                      <option value="electric">Elétrico</option>
                    </select>
                  </div>
                </div>

                {/* Date and Station */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Data *</label>
                    <input type="date" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Posto *</label>
                    <input type="text" placeholder="Nome do posto..." className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
                  </div>
                </div>

                {/* Amount and Price */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Quantidade (Litros) *</label>
                    <input type="number" placeholder="100.00" min="0" step="0.01" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Preço Unitário (R$) *</label>
                    <input type="number" placeholder="5.89" min="0" step="0.01" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Total (R$)</label>
                    <input type="number" placeholder="589.00" min="0" step="0.01" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" disabled/>
                  </div>
                </div>

                {/* Odometer and Driver */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Odômetro (km) *</label>
                    <input type="number" placeholder="45000" min="0" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
                  </div>
                  
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
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
                  <textarea 
                    placeholder="Informações adicionais sobre o abastecimento..."
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  ></textarea>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => setShowNewFuelModal(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    <Plus size={16} />
                    <span>Cadastrar Abastecimento</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fuel Details Modal */}
        {selectedRecord && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white z-10 p-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-slate-900">Detalhes do Abastecimento</h3>
                  <button
                    onClick={() => setSelectedRecord(null)}
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
                        {selectedRecord.vehiclePlate} - {selectedRecord.vehicleBrand} {selectedRecord.vehicleModel}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Combustível</label>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border whitespace-nowrap ${getFuelTypeColor(selectedRecord.type)}`}>
                        {getFuelTypeLabel(selectedRecord.type)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Data</label>
                      <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg">
                        {new Date(selectedRecord.date).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Posto</label>
                      <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg">
                        {selectedRecord.station}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amount and Price */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Quantidade</label>
                    <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg">
                      {selectedRecord.amount.toFixed(2)} L
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Preço Unitário</label>
                    <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg">
                      R$ {selectedRecord.unitPrice.toFixed(2)}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Total</label>
                    <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg">
                      R$ {selectedRecord.totalPrice.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Odometer and Driver */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Odômetro</label>
                    <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg">
                      {selectedRecord.odometer.toLocaleString('pt-BR')} km
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Motorista</label>
                    <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg">
                      {selectedRecord.driver}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
                  <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg min-h-[80px]">
                    {selectedRecord.notes}
                  </div>
                </div>

                {/* Consumption Info */}
                {selectedRecord.averageConsumption && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Consumo Médio</label>
                    <div className="text-slate-900 bg-slate-100 px-3 py-2 rounded-lg">
                      {selectedRecord.averageConsumption.toFixed(2)} km/L
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
                  <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                    <Trash2 size={16} />
                    <span>Excluir</span>
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
