import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, LineChart, Line, AreaChart, Area, Legend
} from 'recharts';
import { 
  FileText, TrendingUp, Package, Users, Calendar, Clock, AlertCircle, 
  CheckCircle, Truck, Scale, DollarSign, Activity, Filter, Download,
  RefreshCw, Eye, Edit, Trash2, Search, ChevronDown, ChevronUp
} from 'lucide-react';
import { apiFetch } from '../services/api';

export const DashboardEnhanced = () => {
  const [stats, setStats] = useState<any>(null);
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');
  const [expandedSection, setExpandedSection] = useState<string | null>('stats');

  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const statsData = await apiFetch(`/api/dashboard/stats?range=${dateRange}`);
      setStats(statsData);
      setRecentReports(statsData.recentReports || []);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <RefreshCw className="animate-spin text-stone-400" size={24} />
          <span className="text-stone-500">Carregando dashboard...</span>
        </div>
      </div>
    );
  }

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="space-y-6">
      {/* Header com Filtros e Ações */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Dashboard AgroClass</h1>
          <p className="text-sm text-stone-500 mt-1">Visão geral das operações</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
            <option value="1y">Último ano</option>
          </select>
          
          <button 
            onClick={loadDashboardData}
            className="p-2 text-stone-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            title="Atualizar dados"
          >
            <RefreshCw size={20} />
          </button>
          
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exportar Relatório
          </button>
        </div>
      </div>

      {/* KPI Cards - Grid Expandido */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <FileText size={20} />
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              +{stats?.osGrowth || 12}%
            </span>
          </div>
          <p className="text-sm text-stone-500 font-medium">O.S. em Aberto</p>
          <p className="text-2xl font-bold text-stone-900 mt-1">{stats?.openOS || 0}</p>
          <p className="text-xs text-stone-400 mt-2">{stats?.totalOS || 0} totais este mês</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <DollarSign size={20} />
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              Meta {stats?.billingPercentage || 85}%
            </span>
          </div>
          <p className="text-sm text-stone-500 font-medium">Faturamento</p>
          <p className="text-2xl font-bold text-stone-900 mt-1">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats?.monthlyBilling || 0)}
          </p>
          <p className="text-xs text-stone-400 mt-2">Este mês</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
              <Package size={20} />
            </div>
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
              +{stats?.volumeGrowth || 8}%
            </span>
          </div>
          <p className="text-sm text-stone-500 font-medium">Volume Classificado</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-2xl font-bold text-stone-900">
              {stats?.volumeByProduct?.reduce((acc: any, curr: any) => acc + curr.volume, 0).toFixed(1) || 0}
            </p>
            <span className="text-sm text-stone-500 font-medium">TON</span>
          </div>
          <p className="text-xs text-stone-400 mt-2">{stats?.totalClassifications || 0} laudos</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
              <Activity size={20} />
            </div>
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
              {stats?.efficiency || 92}%
            </span>
          </div>
          <p className="text-sm text-stone-500 font-medium">Eficiência Operacional</p>
          <p className="text-2xl font-bold text-stone-900 mt-1">{stats?.avgProcessingTime || '2.5'}h</p>
          <p className="text-xs text-stone-400 mt-2">Tempo médio por laudo</p>
        </div>
      </div>

      {/* Alertas e Status */}
      {(stats?.pendingAlerts > 0 || stats?.criticalIssues > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {stats?.pendingAlerts > 0 && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-amber-600" size={20} />
                <div>
                  <p className="text-sm font-medium text-amber-900">Atenção: {stats.pendingAlerts} alertas pendentes</p>
                  <p className="text-xs text-amber-700 mt-1">Revisar classificações críticas</p>
                </div>
              </div>
            </div>
          )}
          
          {stats?.criticalIssues > 0 && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-red-600" size={20} />
                <div>
                  <p className="text-sm font-medium text-red-900">Crítico: {stats.criticalIssues} problemas identificados</p>
                  <p className="text-xs text-red-700 mt-1">Ação imediata necessária</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Barras - Volume por Produto */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-stone-800">Volume por Produto</h3>
            <button 
              onClick={() => toggleSection('volume')}
              className="p-1 hover:bg-stone-100 rounded-lg transition-colors"
            >
              {expandedSection === 'volume' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.volumeByProduct || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="volume" radius={[6, 6, 0, 0]}>
                  {stats?.volumeByProduct?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico Pizza - Distribuição */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
          <h3 className="text-lg font-semibold text-stone-800 mb-6">Distribuição</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.volumeByProduct || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="volume"
                >
                  {stats?.volumeByProduct?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {stats?.volumeByProduct?.map((item: any, index: number) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-xs text-stone-600 font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gráfico de Linhas - Tendência */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-stone-800">Tendência de Classificações</h3>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-full">Diário</button>
            <button className="px-3 py-1 text-xs text-stone-600 hover:bg-stone-100 rounded-full">Semanal</button>
            <button className="px-3 py-1 text-xs text-stone-600 hover:bg-stone-100 rounded-full">Mensal</button>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats?.dailyTrend || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Line type="monotone" dataKey="classifications" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
              <Line type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabela de Laudos Recentes */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200">
        <div className="p-6 border-b border-stone-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-stone-800">Laudos Recentes</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" />
                <input 
                  type="text" 
                  placeholder="Buscar laudos..."
                  className="pl-10 pr-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button className="p-2 text-stone-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                <Filter size={16} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200">
                <th className="p-4 text-left text-xs font-bold text-stone-400 uppercase tracking-widest">ID</th>
                <th className="p-4 text-left text-xs font-bold text-stone-400 uppercase tracking-widest">Data</th>
                <th className="p-4 text-left text-xs font-bold text-stone-400 uppercase tracking-widest">Cliente</th>
                <th className="p-4 text-left text-xs font-bold text-stone-400 uppercase tracking-widest">Produto</th>
                <th className="p-4 text-left text-xs font-bold text-stone-400 uppercase tracking-widest">Classificação</th>
                <th className="p-4 text-left text-xs font-bold text-stone-400 uppercase tracking-widest">Status</th>
                <th className="p-4 text-right text-xs font-bold text-stone-400 uppercase tracking-widest">Ações</th>
              </tr>
            </thead>
            <tbody>
              {recentReports?.map((report: any) => (
                <tr key={report.id} className="border-b border-stone-100 hover:bg-stone-50">
                  <td className="p-4 text-sm font-medium text-stone-900">#{report.id}</td>
                  <td className="p-4 text-sm text-stone-600">{new Date(report.created_at).toLocaleDateString('pt-BR')}</td>
                  <td className="p-4 text-sm text-stone-600">{report.client_name || '—'}</td>
                  <td className="p-4 text-sm text-stone-600">{report.product_name || '—'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      report.final_classification === 'Tipo 1' ? 'bg-emerald-100 text-emerald-700' :
                      report.final_classification === 'Tipo 2' ? 'bg-blue-100 text-blue-700' :
                      report.final_classification === 'Tipo 3' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {report.final_classification || 'Não classificado'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                      report.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                      report.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {report.status === 'completed' ? <CheckCircle size={12} /> :
                       report.status === 'pending' ? <Clock size={12} /> :
                       <AlertCircle size={12} />}
                      {report.status === 'completed' ? 'Concluído' :
                       report.status === 'pending' ? 'Pendente' : 'Erro'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <button className="p-1 text-stone-400 hover:text-emerald-600 transition-colors" title="Visualizar">
                        <Eye size={16} />
                      </button>
                      <button className="p-1 text-stone-400 hover:text-blue-600 transition-colors" title="Editar">
                        <Edit size={16} />
                      </button>
                      <button className="p-1 text-stone-400 hover:text-red-600 transition-colors" title="Excluir">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Métricas Adicionais */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl border border-emerald-200">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="text-emerald-600" size={20} />
            <span className="text-sm font-medium text-emerald-900">Taxa de Aprovação</span>
          </div>
          <p className="text-2xl font-bold text-emerald-900">{stats?.approvalRate || 96.5}%</p>
          <p className="text-xs text-emerald-700 mt-1">Acima da meta</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <Users className="text-blue-600" size={20} />
            <span className="text-sm font-medium text-blue-900">Classificadores Ativos</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">{stats?.activeClassifiers || 8}</p>
          <p className="text-xs text-blue-700 mt-1">3 em plantão</p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-2xl border border-amber-200">
          <div className="flex items-center gap-3 mb-3">
            <Truck className="text-amber-600" size={20} />
            <span className="text-sm font-medium text-amber-900">Transportes Hoje</span>
          </div>
          <p className="text-2xl font-bold text-amber-900">{stats?.todayTransports || 24}</p>
          <p className="text-xs text-amber-700 mt-1">18 concluídos</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
          <div className="flex items-center gap-3 mb-3">
            <Scale className="text-purple-600" size={20} />
            <span className="text-sm font-medium text-purple-900">Qualidade Média</span>
          </div>
          <p className="text-2xl font-bold text-purple-900">{stats?.avgQuality || 8.7}/10</p>
          <p className="text-xs text-purple-700 mt-1">Excelente</p>
        </div>
      </div>
    </div>
  );
};
