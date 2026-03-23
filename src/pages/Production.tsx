import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  Calendar,
  Package,
  FileText,
  MapPin,
  Users,
  TrendingUp,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Printer,
  Share2
} from 'lucide-react';

interface ProductionData {
  id: string;
  date: string;
  product: string;
  productCategory: string;
  serviceOrder: string;
  coordination: string;
  supervision: string;
  location: string;
  embarkedVolume: number;
  unit: string;
  status: 'completed' | 'in_progress' | 'pending';
  operator: string;
  shift: string;
}

interface ProductionStats {
  totalVolume: number;
  totalOrders: number;
  averagePerOrder: number;
  completionRate: number;
}

export const ProductionPage: React.FC = () => {
  const [productionData, setProductionData] = useState<ProductionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ProductionStats>({
    totalVolume: 0,
    totalOrders: 0,
    averagePerOrder: 0,
    completionRate: 0
  });

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [productFilter, setProductFilter] = useState<string>('all');
  const [serviceOrderFilter, setServiceOrderFilter] = useState<string>('all');
  const [coordinationFilter, setCoordinationFilter] = useState<string>('all');
  const [supervisionFilter, setSupervisionFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  
  // Filtros de período
  const [periodFilter, setPeriodFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      const mockData: ProductionData[] = [
        {
          id: '1',
          date: '2024-03-20',
          product: 'Soja',
          productCategory: 'Grãos',
          serviceOrder: 'OS-2024-001',
          coordination: 'Logística',
          supervision: 'João Silva',
          location: 'Armazém 1',
          embarkedVolume: 1250.50,
          unit: 'ton',
          status: 'completed',
          operator: 'Maria Santos',
          shift: 'Manhã'
        },
        {
          id: '2',
          date: '2024-03-20',
          product: 'Milho',
          productCategory: 'Grãos',
          serviceOrder: 'OS-2024-002',
          coordination: 'Logística',
          supervision: 'Pedro Oliveira',
          location: 'Armazém 2',
          embarkedVolume: 890.75,
          unit: 'ton',
          status: 'completed',
          operator: 'Carlos Ferreira',
          shift: 'Tarde'
        },
        {
          id: '3',
          date: '2024-03-19',
          product: 'Trigo',
          productCategory: 'Grãos',
          serviceOrder: 'OS-2024-003',
          coordination: 'Produção',
          supervision: 'Ana Costa',
          location: 'Armazém 3',
          embarkedVolume: 567.25,
          unit: 'ton',
          status: 'in_progress',
          operator: 'Roberto Almeida',
          shift: 'Noite'
        },
        {
          id: '4',
          date: '2024-03-19',
          product: 'Arroz',
          productCategory: 'Grãos',
          serviceOrder: 'OS-2024-004',
          coordination: 'Produção',
          supervision: 'Carlos Mendes',
          location: 'Armazém 1',
          embarkedVolume: 445.80,
          unit: 'ton',
          status: 'pending',
          operator: 'Fernanda Lima',
          shift: 'Manhã'
        },
        {
          id: '5',
          date: '2024-03-18',
          product: 'Feijão',
          productCategory: 'Grãos',
          serviceOrder: 'OS-2024-005',
          coordination: 'Logística',
          supervision: 'Marcos Pereira',
          location: 'Armazém 2',
          embarkedVolume: 234.60,
          unit: 'ton',
          status: 'completed',
          operator: 'Lucas Souza',
          shift: 'Tarde'
        },
        {
          id: '6',
          date: '2024-03-18',
          product: 'Café',
          productCategory: 'Bebidas',
          serviceOrder: 'OS-2024-006',
          coordination: 'Qualidade',
          supervision: 'Juliana Ramos',
          location: 'Armazém 4',
          embarkedVolume: 189.30,
          unit: 'sacas',
          status: 'completed',
          operator: 'Diego Costa',
          shift: 'Manhã'
        }
      ];

      setProductionData(mockData);

      // Calcular estatísticas
      const totalVolume = mockData.reduce((sum, item) => sum + item.embarkedVolume, 0);
      const totalOrders = mockData.length;
      const averagePerOrder = totalVolume / totalOrders;
      const completedOrders = mockData.filter(item => item.status === 'completed').length;
      const completionRate = (completedOrders / totalOrders) * 100;

      setStats({
        totalVolume,
        totalOrders,
        averagePerOrder,
        completionRate
      });

      setLoading(false);
    }, 1000);
  }, []);

  const filteredData = productionData.filter(item => {
    const matchesSearch = 
      item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serviceOrder.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.operator.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate = dateFilter === 'all' || item.date === dateFilter;
    const matchesProduct = productFilter === 'all' || item.product === productFilter;
    const matchesServiceOrder = serviceOrderFilter === 'all' || item.serviceOrder === serviceOrderFilter;
    const matchesCoordination = coordinationFilter === 'all' || item.coordination === coordinationFilter;
    const matchesSupervision = supervisionFilter === 'all' || item.supervision === supervisionFilter;
    const matchesLocation = locationFilter === 'all' || item.location === locationFilter;

    // Filtro de período
    let matchesPeriod = true;
    if (periodFilter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      matchesPeriod = item.date === today;
    } else if (periodFilter === 'week') {
      const itemDate = new Date(item.date);
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchesPeriod = itemDate >= weekAgo && itemDate <= today;
    } else if (periodFilter === 'month') {
      const itemDate = new Date(item.date);
      const today = new Date();
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      matchesPeriod = itemDate >= monthAgo && itemDate <= today;
    } else if (periodFilter === 'custom' && startDate && endDate) {
      matchesPeriod = item.date >= startDate && item.date <= endDate;
    }

    return matchesSearch && matchesDate && matchesProduct && matchesServiceOrder && 
           matchesCoordination && matchesSupervision && matchesLocation && matchesPeriod;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'in_progress': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'pending': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'in_progress': return 'Em Andamento';
      case 'pending': return 'Pendente';
      default: return status;
    }
  };

  const getUniqueValues = (field: keyof ProductionData) => {
    return [...new Set(productionData.map(item => item[field]))];
  };

  const generateReport = () => {
    // Filtrar dados com base nos filtros atuais
    const reportData = filteredData;
    
    // Gerar conteúdo do relatório
    const reportContent = {
      title: 'Relatório de Produção',
      period: periodFilter === 'custom' && startDate && endDate 
        ? `${startDate} a ${endDate}` 
        : periodFilter === 'today' 
        ? 'Hoje'
        : periodFilter === 'week'
        ? 'Últimos 7 dias'
        : periodFilter === 'month'
        ? 'Últimos 30 dias'
        : 'Todo o período',
      generatedAt: new Date().toLocaleString('pt-BR'),
      stats: {
        totalVolume: reportData.reduce((sum, item) => sum + item.embarkedVolume, 0),
        totalOrders: reportData.length,
        averagePerOrder: reportData.length > 0 ? reportData.reduce((sum, item) => sum + item.embarkedVolume, 0) / reportData.length : 0,
        completionRate: reportData.length > 0 ? (reportData.filter(item => item.status === 'completed').length / reportData.length) * 100 : 0
      },
      data: reportData
    };

    // Criar conteúdo HTML para impressão
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Relatório de Produção</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #4f46e5; }
              .header { border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 20px; }
              .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
              .stat-card { border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; }
              .stat-value { font-size: 24px; font-weight: bold; color: #1f2937; }
              .stat-label { color: #6b7280; font-size: 14px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
              th { background-color: #f9fafb; font-weight: bold; }
              .status-completed { background-color: #dcfce7; color: #166534; }
              .status-in_progress { background-color: #fef3c7; color: #92400e; }
              .status-pending { background-color: #f3f4f6; color: #374151; }
              @media print { body { margin: 10px; } }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${reportContent.title}</h1>
              <p><strong>Período:</strong> ${reportContent.period}</p>
              <p><strong>Gerado em:</strong> ${reportContent.generatedAt}</p>
            </div>
            
            <div class="stats">
              <div class="stat-card">
                <div class="stat-value">${reportContent.stats.totalVolume.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div class="stat-label">Volume Total</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${reportContent.stats.totalOrders}</div>
                <div class="stat-label">Total de OS</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${reportContent.stats.averagePerOrder.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div class="stat-label">Média por OS</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${reportContent.stats.completionRate.toFixed(1)}%</div>
                <div class="stat-label">Taxa de Conclusão</div>
              </div>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Produto</th>
                  <th>Ordem de Serviço</th>
                  <th>Coordenação</th>
                  <th>Supervisão</th>
                  <th>Local</th>
                  <th>Volume Embarcado</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${reportContent.data.map(item => `
                  <tr>
                    <td>${item.date}</td>
                    <td>${item.product}</td>
                    <td>${item.serviceOrder}</td>
                    <td>${item.coordination}</td>
                    <td>${item.supervision}</td>
                    <td>${item.location}</td>
                    <td>${item.embarkedVolume.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${item.unit}</td>
                    <td class="status-${item.status}">${getStatusLabel(item.status)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  const exportData = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Filtrar dados com base nos filtros atuais
    const exportData = filteredData;
    
    // Criar conteúdo CSV
    const headers = ['Data', 'Produto', 'Categoria', 'Ordem de Serviço', 'Coordenação', 'Supervisão', 'Local', 'Volume Embarcado', 'Unidade', 'Status', 'Operador', 'Turno'];
    const csvContent = [
      headers.join(','),
      ...exportData.map(item => [
        item.date,
        item.product,
        item.productCategory,
        item.serviceOrder,
        item.coordination,
        item.supervision,
        item.location,
        item.embarkedVolume,
        item.unit,
        getStatusLabel(item.status),
        item.operator,
        item.shift
      ].join(','))
    ].join('\n');

    // Criar blob e download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    // Definir nome do arquivo com data atual
    const fileName = `producao_${new Date().toISOString().split('T')[0]}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Feedback visual
    const button = event.currentTarget;
    const originalText = button.textContent;
    button.textContent = 'Exportado!';
    button.classList.add('bg-emerald-600');
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('bg-emerald-600');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Header Moderno */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                  <Package className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Produção
                  </h1>
                  <p className="text-slate-500 font-medium">Controle de volume embarcado e relatórios de produção</p>
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
                  placeholder="Buscar produção..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all shadow-sm w-64"
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
                <p className="text-sm text-slate-600 font-medium">Volume Total</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {stats.totalVolume.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                  <ArrowUpRight size={12} />
                  +12.5% este mês
                </p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Package className="text-indigo-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total de OS</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalOrders}</p>
                <p className="text-xs text-slate-500 mt-2">Ordens de serviço</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FileText className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Média por OS</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {stats.averagePerOrder.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                  <ArrowDownRight size={12} />
                  -3.2% vs mês anterior
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="text-amber-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Taxa de Conclusão</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats.completionRate.toFixed(1)}%</p>
                <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                  <ArrowUpRight size={12} />
                  +5.8% eficiência
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-emerald-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Filtros Avançados</h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={generateReport}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  <BarChart3 size={16} />
                  Gerar Relatório
                </button>
                <button 
                  onClick={exportData}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2"
                >
                  <Download size={16} />
                  Exportar
                </button>
                <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors" title="Atualizar">
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
              {/* Período Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Período</label>
                <select
                  value={periodFilter}
                  onChange={(e) => setPeriodFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="custom">Personalizado</option>
                  <option value="all">Todo o período</option>
                  <option value="today">Hoje</option>
                  <option value="week">Últimos 7 dias</option>
                  <option value="month">Últimos 30 dias</option>
                </select>
              </div>

              {/* Data Início (aparece quando período é custom) */}
              {periodFilter === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Data Início</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Data Fim (aparece quando período é custom) */}
              {periodFilter === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Data Fim</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Data Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Data</label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">Todas as datas</option>
                  {getUniqueValues('date').map(date => (
                    <option key={date} value={date}>{date}</option>
                  ))}
                </select>
              </div>

              {/* Produto Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Produto</label>
                <select
                  value={productFilter}
                  onChange={(e) => setProductFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">Todos os produtos</option>
                  {getUniqueValues('product').map(product => (
                    <option key={product} value={product}>{product}</option>
                  ))}
                </select>
              </div>

              {/* Ordem de Serviço Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Ordem de Serviço</label>
                <select
                  value={serviceOrderFilter}
                  onChange={(e) => setServiceOrderFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">Todas as OS</option>
                  {getUniqueValues('serviceOrder').map(os => (
                    <option key={os} value={os}>{os}</option>
                  ))}
                </select>
              </div>

              {/* Coordenação Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Coordenação</label>
                <select
                  value={coordinationFilter}
                  onChange={(e) => setCoordinationFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">Todas as coordenações</option>
                  {getUniqueValues('coordination').map(coord => (
                    <option key={coord} value={coord}>{coord}</option>
                  ))}
                </select>
              </div>

              {/* Supervisão Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Supervisão</label>
                <select
                  value={supervisionFilter}
                  onChange={(e) => setSupervisionFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">Todos os supervisores</option>
                  {getUniqueValues('supervision').map(sup => (
                    <option key={sup} value={sup}>{sup}</option>
                  ))}
                </select>
              </div>

              {/* Local Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Local</label>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">Todos os locais</option>
                  {getUniqueValues('location').map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Production Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Dados de Produção</h2>
              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors" title="Imprimir">
                  <Printer size={18} />
                </button>
                <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors" title="Compartilhar">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-xs uppercase tracking-widest font-bold border-b border-slate-100">
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4">Produto</th>
                  <th className="px-6 py-4">Ordem de Serviço</th>
                  <th className="px-6 py-4">Coordenação</th>
                  <th className="px-6 py-4">Supervisão</th>
                  <th className="px-6 py-4">Local</th>
                  <th className="px-6 py-4 text-right">Volume Embarcado</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-slate-400 italic">Carregando dados de produção...</td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-slate-400 italic">Nenhum dado de produção encontrado.</td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-slate-400" />
                          <span className="text-slate-700">{item.date}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-slate-900">{item.product}</div>
                          <div className="text-sm text-slate-500">{item.productCategory}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-slate-400" />
                          <span className="text-slate-700">{item.serviceOrder}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-slate-400" />
                          <span className="text-slate-700">{item.coordination}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-700">{item.supervision}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-slate-400" />
                          <span className="text-slate-700">{item.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="font-semibold text-slate-900">
                          {item.embarkedVolume.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-sm text-slate-500">{item.unit}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                          {getStatusLabel(item.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Visualizar">
                            <Eye size={16} />
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
    </div>
  );
};
