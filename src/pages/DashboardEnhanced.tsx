import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, LineChart, Line, AreaChart, Area, Legend
} from 'recharts';
import { 
  FileText, TrendingUp, Package, Users, Calendar, Clock, AlertCircle, 
  CheckCircle, Truck, Scale, DollarSign, Activity, Filter, Download,
  RefreshCw, ChevronDown, ChevronUp, ArrowUpRight, BarChart3, MapPin
} from 'lucide-react';
import { apiFetch } from '../services/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { VolumeAreaChart } from '../components/VolumeAreaChart';
import { VolumeBarChart } from '../components/VolumeBarChart';
import { DistributionPieChart } from '../components/DistributionPieChart';
import { TrendAreaChart } from '../components/TrendAreaChart';

export const DashboardEnhanced = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>('stats');
  
  // Estados para filtros dos novos gráficos - devem vir depois dos hooks principais
  const [clienteFilter, setClienteFilter] = useState('all');
  const [coordenacaoFilter, setCoordenacaoFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
  const [monthFilter, setMonthFilter] = useState(new Date().getMonth() + 1);

  // Dados mockados para os novos gráficos
  const [volumePorCliente, setVolumePorCliente] = useState([
    { cliente: 'Faz. Luzia', volume: 4500, coordenacao: 'SP', mes: 6, ano: 2024 },
    { cliente: 'Coop. Centro', volume: 6200, coordenacao: 'MG', mes: 6, ano: 2024 },
    { cliente: 'Faz. Vista', volume: 3800, coordenacao: 'PR', mes: 6, ano: 2024 },
    { cliente: 'Faz. Esperança', volume: 5100, coordenacao: 'RS', mes: 6, ano: 2024 },
    { cliente: 'AgroTech', volume: 8900, coordenacao: 'SP', mes: 5, ano: 2024 },
    { cliente: 'Grãos Sul', volume: 3200, coordenacao: 'RS', mes: 5, ano: 2024 },
    { cliente: 'Cerealista', volume: 4500, coordenacao: 'SC', mes: 4, ano: 2024 },
    { cliente: 'Sementes BR', volume: 2800, coordenacao: 'MT', mes: 4, ano: 2024 }
  ]);

  const [volumePorCoordenacao, setVolumePorCoordenacao] = useState([
    { coordenacao: 'SP', volume: 13400, clientes: 2 },
    { coordenacao: 'MG', volume: 6200, clientes: 1 },
    { coordenacao: 'PR', volume: 3800, clientes: 1 },
    { coordenacao: 'RS', volume: 8300, clientes: 2 },
    { coordenacao: 'SC', volume: 4500, clientes: 1 },
    { coordenacao: 'MT', volume: 2800, clientes: 1 }
  ]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const statsData = await apiFetch('/api/dashboard/stats');
      setStats(statsData);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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

  // Funções de formatação
  const formatVolume = (value: number) => {
    return `${value.toLocaleString('pt-BR')} TON`;
  };

  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  // Funções de filtro
  const filteredVolumePorCliente = volumePorCliente.filter(item => {
    if (clienteFilter !== 'all' && item.cliente !== clienteFilter) return false;
    // Removendo filtro de período para mostrar todos os dados inicialmente
    return true;
  });

  const filteredVolumePorCoordenacao = volumePorCoordenacao.filter(item => {
    if (coordenacaoFilter !== 'all' && item.coordenacao !== coordenacaoFilter) return false;
    return true;
  });

  // Gerar lista de anos e meses
  const anos = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  const meses = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' }
  ];

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Header Moderno */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-lg shadow-slate-200/25">
        <div className="px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-400/30 ring-2 ring-emerald-500/20 backdrop-blur-sm">
                  <Activity className="text-white drop-shadow-sm" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-br from-slate-900 via-emerald-700 to-slate-800 bg-clip-text text-transparent drop-shadow-sm">
                    Dashboard Operacional
                  </h1>
                  <p className="text-slate-600 font-medium">Visão geral inteligente das operações</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-50/80 to-slate-100/60 rounded-xl border border-slate-200/50 shadow-md backdrop-blur-sm">
                <Calendar className="text-slate-600" size={16} />
                <span className="text-sm font-medium text-slate-700">
                  {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </span>
              </div>
              
              <button 
                onClick={loadDashboardData}
                className="p-3 bg-white/90 border-slate-200/50 rounded-xl shadow-lg shadow-slate-200/15 hover:shadow-xl hover:shadow-emerald-300/20 hover:bg-emerald-50/50 hover:text-emerald-600 hover:border-emerald-200/50 transition-all duration-300 backdrop-blur-sm"
                title="Atualizar dados"
              >
                <RefreshCw size={20} />
              </button>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 text-white rounded-xl shadow-xl shadow-emerald-400/30 hover:shadow-2xl hover:shadow-emerald-500/25 hover:from-emerald-500 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2 font-medium backdrop-blur-sm">
              <Download size={18} />
              Exportar Relatório
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">

      {/* KPI Cards Modernos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group relative bg-gradient-to-br from-white/90 via-emerald-50/40 to-emerald-100/30 backdrop-blur-sm rounded-2xl border border-emerald-200/50 p-6 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/12 via-emerald-400/6 to-emerald-600/8 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-300 via-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-400/30 ring-2 ring-emerald-500/20 backdrop-blur-sm">
                <FileText className="text-white drop-shadow-sm" size={20} />
              </div>
              <div className="px-3 py-1 bg-gradient-to-r from-emerald-100/90 via-emerald-200/70 to-emerald-50/80 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1 border border-emerald-300/60 shadow-md backdrop-blur-sm">
                <ArrowUpRight size={12} />
                +{stats?.osGrowth || 12}%
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold bg-gradient-to-br from-slate-900 via-emerald-800 to-slate-800 bg-clip-text text-transparent break-words overflow-wrap-anywhere drop-shadow-sm">{stats?.osCount || 156}</p>
              <p className="text-sm text-slate-700 font-medium">O.S. em Aberto</p>
              <p className="text-xs text-slate-500">8 aguardando análise</p>
            </div>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-white/90 via-blue-50/40 to-blue-100/30 backdrop-blur-sm rounded-2xl border border-blue-200/50 p-6 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/12 via-blue-400/6 to-blue-600/8 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-300 via-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-400/30 ring-2 ring-blue-500/20 backdrop-blur-sm">
                <DollarSign className="text-white drop-shadow-sm" size={20} />
              </div>
              <div className="px-3 py-1 bg-gradient-to-r from-blue-100/90 via-blue-200/70 to-blue-50/80 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1 border border-blue-300/60 shadow-md backdrop-blur-sm">
                <ArrowUpRight size={12} />
                +{stats?.revenueGrowth || 8}%
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold bg-gradient-to-br from-slate-900 via-blue-800 to-slate-800 bg-clip-text text-transparent break-words overflow-wrap-anywhere drop-shadow-sm">R$ {(stats?.revenue || 2450000).toLocaleString('pt-BR')}</p>
              <p className="text-sm text-slate-700 font-medium">Faturamento</p>
              <p className="text-xs text-slate-500">Mês corrente</p>
            </div>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-white/90 via-orange-50/40 to-orange-100/30 backdrop-blur-sm rounded-2xl border border-orange-200/50 p-6 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/12 via-orange-400/6 to-orange-600/8 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-300 via-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-400/30 ring-2 ring-orange-500/20 backdrop-blur-sm">
                <Scale className="text-white drop-shadow-sm" size={20} />
              </div>
              <div className="px-3 py-1 bg-gradient-to-r from-orange-100/90 via-orange-200/70 to-orange-50/80 text-orange-700 rounded-full text-xs font-bold flex items-center gap-1 border border-orange-300/60 shadow-md backdrop-blur-sm">
                <ArrowUpRight size={12} />
                +{stats?.volumeGrowth || 15}%
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold bg-gradient-to-br from-slate-900 via-orange-800 to-slate-800 bg-clip-text text-transparent break-words overflow-wrap-anywhere drop-shadow-sm">{(stats?.volume || 12500).toLocaleString('pt-BR')} TON</p>
              <p className="text-sm text-slate-700 font-medium">Volume Classificado</p>
              <p className="text-xs text-slate-500">Este mês</p>
            </div>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-white/90 via-purple-50/40 to-purple-100/30 backdrop-blur-sm rounded-2xl border border-purple-200/50 p-6 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/12 via-purple-400/6 to-purple-600/8 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-300 via-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-400/30 ring-2 ring-purple-500/20 backdrop-blur-sm">
                <TrendingUp className="text-white drop-shadow-sm" size={20} />
              </div>
              <div className="px-3 py-1 bg-gradient-to-r from-purple-100/90 via-purple-200/70 to-purple-50/80 text-purple-700 rounded-full text-xs font-bold flex items-center gap-1 border border-purple-300/60 shadow-md backdrop-blur-sm">
                <ArrowUpRight size={12} />
                +{stats?.efficiencyGrowth || 5}%
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold bg-gradient-to-br from-slate-900 via-purple-800 to-slate-800 bg-clip-text text-transparent break-words overflow-wrap-anywhere drop-shadow-sm">{stats?.efficiency || 94.2}%</p>
              <p className="text-sm text-slate-700 font-medium">Eficiência Operacional</p>
              <p className="text-xs text-slate-500">Tempo médio: {stats?.avgProcessingTime || '2.5'}h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de Área - Volume Mensal */}
      <div className="group relative bg-gradient-to-br from-white/90 via-emerald-50/40 to-emerald-100/30 backdrop-blur-sm rounded-3xl border border-emerald-200/50 shadow-xl shadow-emerald-300/20 p-8 hover:shadow-2xl hover:shadow-emerald-400/25 transition-all duration-500 hover:-translate-y-1 hover:scale-[1.01]">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-emerald-600/8 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
        <div className="relative">
          <VolumeAreaChart />
        </div>
      </div>

      {/* Alertas e Status */}
      {(stats?.pendingAlerts > 0 || stats?.criticalIssues > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {stats?.pendingAlerts > 0 && (
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-3xl border border-amber-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                  <AlertCircle className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-900">Atenção: {stats.pendingAlerts} alertas pendentes</p>
                  <p className="text-xs text-amber-700 mt-1">Revisar classificações críticas</p>
                </div>
              </div>
            </div>
          )}
          
          {stats?.criticalIssues > 0 && (
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-3xl border border-red-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/25">
                  <AlertCircle className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-900">Crítico: {stats.criticalIssues} problemas identificados</p>
                  <p className="text-xs text-red-700 mt-1">Ação imediata necessária</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gráfico de Barras - Volume por Produto */}
        <div className="lg:col-span-2">
          <div className="group relative bg-gradient-to-br from-white/90 via-blue-50/40 to-blue-100/30 backdrop-blur-sm rounded-3xl border border-blue-200/50 shadow-xl shadow-blue-300/20 p-8 hover:shadow-2xl hover:shadow-blue-400/25 transition-all duration-500 hover:-translate-y-1 hover:scale-[1.01]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-blue-600/8 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
            <div className="relative">
              <VolumeBarChart />
            </div>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-white/90 via-purple-50/40 to-purple-100/30 backdrop-blur-sm rounded-3xl border border-purple-200/50 shadow-xl shadow-purple-300/20 p-8 hover:shadow-2xl hover:shadow-purple-400/25 transition-all duration-500 hover:-translate-y-1 hover:scale-[1.01]">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-purple-400/5 to-purple-600/8 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
          <div className="relative">
            <DistributionPieChart />
          </div>
        </div>
      </div>

      {/* Gráfico de Tendência */}
      <div className="group relative bg-gradient-to-br from-white/90 via-orange-50/40 to-orange-100/30 backdrop-blur-sm rounded-3xl border border-orange-200/50 shadow-xl shadow-orange-300/20 p-8 hover:shadow-2xl hover:shadow-orange-400/25 transition-all duration-500 hover:-translate-y-1 hover:scale-[1.01]">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-orange-400/5 to-orange-600/8 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
        <div className="relative">
          <TrendAreaChart />
        </div>
      </div>

      {/* Métricas Adicionais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group relative bg-gradient-to-br from-white/90 via-emerald-50/40 to-emerald-100/30 backdrop-blur-sm rounded-2xl border border-emerald-200/50 shadow-xl shadow-emerald-300/20 p-6 hover:shadow-2xl hover:shadow-emerald-400/25 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-emerald-600/8 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-300 via-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-xl shadow-emerald-400/30 ring-2 ring-emerald-500/20 backdrop-blur-sm">
                <CheckCircle className="text-white drop-shadow-sm" size={18} />
              </div>
              <span className="text-sm font-semibold text-emerald-900">Taxa de Aprovação</span>
            </div>
            <div className="text-2xl font-bold text-emerald-900">{stats?.approvalRate || 96.5}%</div>
            <p className="text-xs text-emerald-700 mt-1">Acima da meta</p>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-white/90 via-blue-50/40 to-blue-100/30 backdrop-blur-sm rounded-2xl border border-blue-200/50 shadow-xl shadow-blue-300/20 p-6 hover:shadow-2xl hover:shadow-blue-400/25 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-blue-600/8 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-300 via-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-xl shadow-blue-400/30 ring-2 ring-blue-500/20 backdrop-blur-sm">
                <Truck className="text-white drop-shadow-sm" size={18} />
              </div>
              <span className="text-sm font-semibold text-blue-900">Transportes Hoje</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">{stats?.todayTransports || 24}</div>
            <p className="text-xs text-blue-700 mt-1">18 concluídos</p>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-white/90 via-purple-50/40 to-purple-100/30 backdrop-blur-sm rounded-2xl border border-purple-200/50 shadow-xl shadow-purple-300/20 p-6 hover:shadow-2xl hover:shadow-purple-400/25 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-purple-400/5 to-purple-600/8 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-300 via-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-xl shadow-purple-400/30 ring-2 ring-purple-500/20 backdrop-blur-sm">
                <Scale className="text-white drop-shadow-sm" size={18} />
              </div>
              <span className="text-sm font-semibold text-purple-900">Qualidade Média</span>
            </div>
            <div className="text-2xl font-bold text-purple-900">{stats?.avgQuality || 8.7}/10</div>
            <p className="text-xs text-purple-700 mt-1">Excelente</p>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-white/90 via-orange-50/40 to-orange-100/30 backdrop-blur-sm rounded-2xl border border-orange-200/50 shadow-xl shadow-orange-300/20 p-6 hover:shadow-2xl hover:shadow-orange-400/25 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-orange-400/5 to-orange-600/8 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-300 via-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-xl shadow-orange-400/30 ring-2 ring-orange-500/20 backdrop-blur-sm">
                <Clock className="text-white drop-shadow-sm" size={18} />
              </div>
              <span className="text-sm font-semibold text-orange-900">Tempo Médio</span>
            </div>
            <div className="text-2xl font-bold text-orange-900">{stats?.avgProcessingTime || '2.5'}h</div>
            <p className="text-xs text-orange-700 mt-1">Por laudo</p>
          </div>
        </div>
      </div>
      </div>

      {/* Novos Gráficos com Filtros */}
      <div className="px-6 py-8 space-y-8">
        {/* Gráfico de Volume por Cliente */}
        <Card className="group relative bg-gradient-to-br from-white/90 via-blue-50/40 to-blue-100/30 backdrop-blur-sm rounded-3xl border border-blue-200/50 shadow-xl shadow-blue-300/20 p-8 hover:shadow-2xl hover:shadow-blue-400/25 transition-all duration-500 hover:-translate-y-1 hover:scale-[1.01]">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-blue-600/8 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
          <div className="relative">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold bg-gradient-to-br from-slate-900 via-blue-700 to-slate-800 bg-clip-text text-transparent drop-shadow-sm">Volume por Cliente</CardTitle>
                  <CardDescription className="text-sm text-slate-600 mt-1">Análise de volume por cliente</CardDescription>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-300 via-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-xl shadow-blue-400/30 ring-2 ring-blue-500/20 backdrop-blur-sm">
                  <Users className="text-white drop-shadow-sm" size={18} />
                </div>
              </div>
              
              {/* Filtros */}
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-slate-700">Período:</label>
                  <Select value={periodFilter} onValueChange={setPeriodFilter}>
                    <SelectTrigger className="w-[120px] bg-white/80 border-slate-200/50 rounded-xl shadow-lg shadow-slate-200/15">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200/50 shadow-xl">
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="day">Dia</SelectItem>
                      <SelectItem value="month">Mês</SelectItem>
                      <SelectItem value="year">Ano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {periodFilter === 'day' && (
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-slate-700">Dia:</label>
                    <Select value={String(monthFilter)} onValueChange={(value) => setMonthFilter(Number(value))}>
                      <SelectTrigger className="w-[80px] bg-white/80 border-slate-200/50 rounded-xl shadow-lg shadow-slate-200/15">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-200/50 shadow-xl">
                        {Array.from({ length: 31 }, (_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {periodFilter === 'month' && (
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-slate-700">Mês:</label>
                    <Select value={String(monthFilter)} onValueChange={(value) => setMonthFilter(Number(value))}>
                      <SelectTrigger className="w-[100px] bg-white/80 border-slate-200/50 rounded-xl shadow-lg shadow-slate-200/15">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-200/50 shadow-xl">
                        {meses.map(mes => (
                          <SelectItem key={mes.value} value={String(mes.value)}>{mes.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-slate-700">Ano:</label>
                  <Select value={String(yearFilter)} onValueChange={(value) => setYearFilter(Number(value))}>
                    <SelectTrigger className="w-[100px] bg-white/80 border-slate-200/50 rounded-xl shadow-lg shadow-slate-200/15">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200/50 shadow-xl">
                      {anos.map(ano => (
                        <SelectItem key={ano} value={String(ano)}>{ano}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredVolumePorCliente} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                    <defs>
                      <linearGradient id="gradientVolumeCliente" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                    <XAxis 
                      dataKey="cliente" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }} 
                      textAnchor="middle"
                      height={80}
                      interval={0}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 11 }} 
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: '1px solid #e2e8f0', 
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)',
                        background: 'rgba(255, 255, 255, 0.95)'
                      }}
                      formatter={(value: number) => formatVolume(value)}
                    />
                    <Bar dataKey="volume" fill="url(#gradientVolumeCliente)" radius={[8, 8, 8, 8]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            
            <CardFooter className="flex-col items-start gap-2 text-sm pt-4 border-t border-blue-200/30">
              <div className="flex gap-2 leading-none font-medium text-slate-600">
                Crescimento de 12.5% este mês <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
              <div className="leading-none text-slate-500">
                Total de {filteredVolumePorCliente.length} clientes analisados
              </div>
            </CardFooter>
          </div>
        </Card>

        {/* Gráfico de Volume por Coordenação */}
        <div className="group relative bg-gradient-to-br from-white/90 via-green-50/40 to-green-100/30 backdrop-blur-sm rounded-3xl border border-green-200/50 shadow-xl shadow-green-300/20 p-8 hover:shadow-2xl hover:shadow-green-400/25 transition-all duration-500 hover:-translate-y-1 hover:scale-[1.01]">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-green-400/5 to-green-600/8 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-br from-slate-900 via-green-700 to-slate-800 bg-clip-text text-transparent drop-shadow-sm">Volume por Coordenação</h3>
                <p className="text-sm text-slate-600 mt-1">Distribuição geográfica do volume</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-green-300 via-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-xl shadow-green-400/30 ring-2 ring-green-500/20 backdrop-blur-sm">
                <MapPin className="text-white drop-shadow-sm" size={18} />
              </div>
            </div>
            
            {/* Filtros */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-slate-700">Período:</label>
                <Select value={periodFilter} onValueChange={setPeriodFilter}>
                  <SelectTrigger className="w-[120px] bg-white/80 border-slate-200/50 rounded-xl shadow-lg shadow-slate-200/15">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200/50 shadow-xl">
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="day">Dia</SelectItem>
                    <SelectItem value="month">Mês</SelectItem>
                    <SelectItem value="year">Ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {periodFilter === 'day' && (
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-slate-700">Dia:</label>
                  <Select value={String(monthFilter)} onValueChange={(value) => setMonthFilter(Number(value))}>
                    <SelectTrigger className="w-[80px] bg-white/80 border-slate-200/50 rounded-xl shadow-lg shadow-slate-200/15">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200/50 shadow-xl">
                      {Array.from({ length: 31 }, (_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {periodFilter === 'month' && (
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-slate-700">Mês:</label>
                  <Select value={String(monthFilter)} onValueChange={(value) => setMonthFilter(Number(value))}>
                    <SelectTrigger className="w-[120px] bg-white/80 border-slate-200/50 rounded-xl shadow-lg shadow-slate-200/15">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200/50 shadow-xl">
                      {meses.map(mes => (
                        <SelectItem key={mes.value} value={String(mes.value)}>{mes.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-slate-700">Ano:</label>
                <Select value={String(yearFilter)} onValueChange={(value) => setYearFilter(Number(value))}>
                  <SelectTrigger className="w-[100px] bg-white/80 border-slate-200/50 rounded-xl shadow-lg shadow-slate-200/15">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200/50 shadow-xl">
                    {anos.map(ano => (
                      <SelectItem key={ano} value={String(ano)}>{ano}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredVolumePorCoordenacao} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <defs>
                    <linearGradient id="gradientVolumeCoordenacao" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                  <XAxis 
                    dataKey="coordenacao" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} 
                    textAnchor="middle"
                    height={40}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 11 }} 
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: '1px solid #e2e8f0', 
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)',
                      background: 'rgba(255, 255, 255, 0.95)'
                    }}
                    formatter={(value: number) => formatVolume(value)}
                  />
                  <Bar dataKey="volume" fill="url(#gradientVolumeCoordenacao)" radius={[8, 8, 8, 8]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
