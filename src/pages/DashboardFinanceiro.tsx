import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  AlertCircle, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  Wallet,
  BarChart3,
  Target,
  Zap,
  TrendingUpIcon
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend
} from 'recharts';

export const DashboardFinanceiro = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [isLoading, setIsLoading] = useState(true);

  // Dados mockados - substituir com API real
  const [financialData, setFinancialData] = useState({
    overview: {
      totalReceitas: 1250000,
      totalSaidas: 890000,
      saldoAtual: 360000,
      contasPagar: 145000,
      contasReceber: 280000,
      lucroLiquido: 360000
    },
    trends: [
      { month: 'Jan', receitas: 180000, saidas: 120000, lucro: 60000 },
      { month: 'Fev', receitas: 220000, saidas: 140000, lucro: 80000 },
      { month: 'Mar', receitas: 195000, saidas: 135000, lucro: 60000 },
      { month: 'Abr', receitas: 240000, saidas: 160000, lucro: 80000 },
      { month: 'Mai', receitas: 280000, saidas: 180000, lucro: 100000 },
      { month: 'Jun', receitas: 135000, saidas: 155000, lucro: -20000 }
    ],
    comparativoMensal: [
      { mes: 'Jan', receitas: 180000, saidas: 120000, meta: 200000 },
      { mes: 'Fev', receitas: 220000, saidas: 140000, meta: 230000 },
      { mes: 'Mar', receitas: 195000, saidas: 135000, meta: 210000 },
      { mes: 'Abr', receitas: 240000, saidas: 160000, meta: 250000 },
      { mes: 'Mai', receitas: 280000, saidas: 180000, meta: 290000 },
      { mes: 'Jun', receitas: 135000, saidas: 155000, meta: 190000 }
    ],
    eficienciaOperacional: [
      { mes: 'Jan', eficiencia: 92, tempoMedio: 2.8, custoOperacional: 45000 },
      { mes: 'Fev', eficiencia: 94, tempoMedio: 2.5, custoOperacional: 42000 },
      { mes: 'Mar', eficiencia: 89, tempoMedio: 3.2, custoOperacional: 48000 },
      { mes: 'Abr', eficiencia: 96, tempoMedio: 2.3, custoOperacional: 39000 },
      { mes: 'Mai', eficiencia: 95, tempoMedio: 2.4, custoOperacional: 41000 },
      { mes: 'Jun', eficiencia: 91, tempoMedio: 2.9, custoOperacional: 46000 }
    ],
    categoriasReceitas: [
      { name: 'Serviços de Classificação', value: 450000, percentage: 36 },
      { name: 'Venda de Produtos', value: 325000, percentage: 26 },
      { name: 'Taxas de Processamento', value: 275000, percentage: 22 },
      { name: 'Outras Receitas', value: 200000, percentage: 16 }
    ],
    contasPagar: [
      { id: 1, fornecedor: 'AgriSupply S.A.', valor: 45000, vencimento: '2024-07-15', categoria: 'Insumos', status: 'avencer' },
      { id: 2, fornecedor: 'Transportes Rápidos', valor: 28000, vencimento: '2024-07-20', categoria: 'Logística', status: 'normal' },
      { id: 3, fornecedor: 'Energia Elétrica', valor: 15000, vencimento: '2024-07-25', categoria: 'Utilidades', status: 'normal' },
      { id: 4, fornecedor: 'Seguradora Rural', valor: 57000, vencimento: '2024-07-10', categoria: 'Seguros', status: 'vencendo' }
    ],
    transacoesRecentes: [
      { id: 1, descricao: 'Pagamento Serviço Classificação', valor: 85000, tipo: 'receita', cliente: 'Fazenda Santa Luzia', data: '2024-07-08' },
      { id: 2, descricao: 'Compra de Equipamentos', valor: 32000, tipo: 'saida', fornecedor: 'AgroTech', data: '2024-07-07' },
      { id: 3, descricao: 'Taxa de Processamento', valor: 15000, tipo: 'receita', cliente: 'Cooperativa Centro', data: '2024-07-06' },
      { id: 4, descricao: 'Manutenção de Máquinas', valor: 18000, tipo: 'saida', fornecedor: 'Mecânica Rural', data: '2024-07-05' },
      { id: 5, descricao: 'Venda de Insumos', valor: 45000, tipo: 'receita', cliente: 'Fazenda Boa Vista', data: '2024-07-04' }
    ],
    metricasAdicionais: {
      ticketMedio: 12500,
      taxaConversao: 68.5,
      satisfacaoCliente: 94.2,
      crescimentoMensal: 12.3
    }
  });

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const COLORS_RECEITAS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'vencendo': return 'bg-red-100 text-red-700 border-red-200';
      case 'avencer': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando dados financeiros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Header Moderno */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <Wallet className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Dashboard Financeiro
                  </h1>
                  <p className="text-slate-500 font-medium">Visão completa das finanças da empresa</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200/60">
                <Calendar className="text-slate-600" size={16} />
                <span className="text-sm font-medium text-slate-700">
                  {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </span>
              </div>
              
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200/60 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm"
              >
                <option value="week">Esta Semana</option>
                <option value="month">Este Mês</option>
                <option value="quarter">Este Trimestre</option>
                <option value="year">Este Ano</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">
        {/* Cards Principais - Visão Geral */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <div className="group relative bg-gradient-to-br from-white/90 via-emerald-50/40 to-emerald-100/30 backdrop-blur-sm rounded-2xl border border-emerald-200/50 p-6 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/12 via-emerald-400/6 to-emerald-600/8 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-300 via-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-xl shadow-emerald-400/30 ring-2 ring-emerald-500/20 backdrop-blur-sm">
                  <TrendingUp className="text-white drop-shadow-sm" size={18} />
                </div>
                <div className="px-2 py-1 bg-gradient-to-r from-emerald-100/90 via-emerald-200/70 to-emerald-50/80 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1 border border-emerald-300/60 shadow-md backdrop-blur-sm">
                  <ArrowUpRight size={12} />
                  +12%
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold bg-gradient-to-br from-slate-900 via-emerald-800 to-slate-800 bg-clip-text text-transparent break-words overflow-wrap-anywhere drop-shadow-sm">{formatCurrency(financialData.overview.totalReceitas)}</p>
                <p className="text-sm text-slate-700 font-medium">Total Receitas</p>
                <p className="text-xs text-slate-500">Este período</p>
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-white/90 via-red-50/40 to-red-100/30 backdrop-blur-sm rounded-2xl border border-red-200/50 p-6 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/12 via-red-400/6 to-red-600/8 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-red-300 via-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-xl shadow-red-400/30 ring-2 ring-red-500/20 backdrop-blur-sm">
                  <TrendingDown className="text-white drop-shadow-sm" size={18} />
                </div>
                <div className="px-2 py-1 bg-gradient-to-r from-red-100/90 via-red-200/70 to-red-50/80 text-red-700 rounded-full text-xs font-bold flex items-center gap-1 border border-red-300/60 shadow-md backdrop-blur-sm">
                  <ArrowDownRight size={12} />
                  +8%
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold bg-gradient-to-br from-slate-900 via-red-800 to-slate-800 bg-clip-text text-transparent break-words overflow-wrap-anywhere drop-shadow-sm">{formatCurrency(financialData.overview.totalSaidas)}</p>
                <p className="text-sm text-slate-700 font-medium">Total Saídas</p>
                <p className="text-xs text-slate-500">Este período</p>
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-white/90 via-blue-50/40 to-blue-100/30 backdrop-blur-sm rounded-2xl border border-blue-200/50 p-6 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/12 via-blue-400/6 to-blue-600/8 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-300 via-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-xl shadow-blue-400/30 ring-2 ring-blue-500/20 backdrop-blur-sm">
                  <DollarSign className="text-white drop-shadow-sm" size={18} />
                </div>
                <div className="px-2 py-1 bg-gradient-to-r from-blue-100/90 via-blue-200/70 to-blue-50/80 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1 border border-blue-300/60 shadow-md backdrop-blur-sm">
                  <ArrowUpRight size={12} />
                  +15%
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold bg-gradient-to-br from-slate-900 via-blue-800 to-slate-800 bg-clip-text text-transparent break-words overflow-wrap-anywhere drop-shadow-sm">{formatCurrency(financialData.overview.saldoAtual)}</p>
                <p className="text-sm text-slate-700 font-medium">Saldo Atual</p>
                <p className="text-xs text-slate-500">Disponível</p>
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-white/90 via-orange-50/40 to-orange-100/30 backdrop-blur-sm rounded-2xl border border-orange-200/50 p-6 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/12 via-orange-400/6 to-orange-600/8 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-300 via-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-xl shadow-orange-400/30 ring-2 ring-orange-500/20 backdrop-blur-sm">
                  <AlertCircle className="text-white drop-shadow-sm" size={18} />
                </div>
                <div className="px-2 py-1 bg-gradient-to-r from-orange-100/90 via-orange-200/70 to-orange-50/80 text-orange-700 rounded-full text-xs font-bold border border-orange-300/60 shadow-md backdrop-blur-sm">
                  4 contas
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold bg-gradient-to-br from-slate-900 via-orange-800 to-slate-800 bg-clip-text text-transparent break-words overflow-wrap-anywhere drop-shadow-sm">{formatCurrency(financialData.overview.contasPagar)}</p>
                <p className="text-sm text-slate-700 font-medium">Contas a Pagar</p>
                <p className="text-xs text-slate-500">Próximos 30 dias</p>
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-white/90 via-purple-50/40 to-purple-100/30 backdrop-blur-sm rounded-2xl border border-purple-200/50 p-6 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/12 via-purple-400/6 to-purple-600/8 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-300 via-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-xl shadow-purple-400/30 ring-2 ring-purple-500/20 backdrop-blur-sm">
                  <CreditCard className="text-white drop-shadow-sm" size={18} />
                </div>
                <div className="px-2 py-1 bg-gradient-to-r from-purple-100/90 via-purple-200/70 to-purple-50/80 text-purple-700 rounded-full text-xs font-bold border border-purple-300/60 shadow-md backdrop-blur-sm">
                  8 contas
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold bg-gradient-to-br from-slate-900 via-purple-800 to-slate-800 bg-clip-text text-transparent break-words overflow-wrap-anywhere drop-shadow-sm">{formatCurrency(financialData.overview.contasReceber)}</p>
                <p className="text-sm text-slate-700 font-medium">Contas a Receber</p>
                <p className="text-xs text-slate-500">Próximos 30 dias</p>
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-white/90 via-emerald-50/40 to-emerald-100/30 backdrop-blur-sm rounded-2xl border border-emerald-200/50 p-6 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/12 via-emerald-400/6 to-emerald-600/8 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-300 via-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-xl shadow-emerald-400/30 ring-2 ring-emerald-500/20 backdrop-blur-sm">
                  <PiggyBank className="text-white drop-shadow-sm" size={18} />
                </div>
                <div className="px-2 py-1 bg-gradient-to-r from-emerald-100/90 via-emerald-200/70 to-emerald-50/80 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1 border border-emerald-300/60 shadow-md backdrop-blur-sm">
                  <ArrowUpRight size={12} />
                  +28%
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold bg-gradient-to-br from-slate-900 via-emerald-800 to-slate-800 bg-clip-text text-transparent break-words overflow-wrap-anywhere drop-shadow-sm">{formatCurrency(financialData.overview.lucroLiquido)}</p>
                <p className="text-sm text-slate-700 font-medium">Lucro Líquido</p>
                <p className="text-xs text-slate-500">Este período</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gráfico de Evolução Financeira */}
          <div className="group relative bg-gradient-to-br from-white via-slate-50/30 to-slate-100/20 rounded-3xl border border-slate-200/40 shadow-lg shadow-slate-200/15 p-8 hover:shadow-xl hover:shadow-slate-300/20 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-500/6 via-slate-400/3 to-slate-600/4 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent">Evolução Financeira</h3>
                  <p className="text-sm text-slate-500 mt-1">Receitas vs Saídas</p>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={financialData.trends}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }} 
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: '1px solid #e2e8f0', 
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)',
                        background: 'rgba(255, 255, 255, 0.95)'
                      }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="receitas" 
                      stroke="url(#emeraldGradient)" 
                      fill="url(#emeraldGradient)" 
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="saidas" 
                      stroke="url(#redGradient)" 
                      fill="url(#redGradient)" 
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <defs>
                      <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Gráfico de Distribuição de Receitas */}
          <div className="group relative bg-gradient-to-br from-white via-slate-50/30 to-emerald-50/20 rounded-3xl border border-slate-200/40 shadow-lg shadow-slate-200/15 p-8 hover:shadow-xl hover:shadow-emerald-300/20 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/6 via-emerald-400/3 to-emerald-600/4 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent">Receitas por Categoria</h3>
                  <p className="text-sm text-slate-500 mt-1">Distribuição das fontes de receita</p>
                </div>
              </div>
              <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      <linearGradient id="gradientServicos" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.9}/>
                        <stop offset="50%" stopColor="#34d399" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#6ee7b7" stopOpacity={0.7}/>
                      </linearGradient>
                      <linearGradient id="gradientProdutos" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9}/>
                        <stop offset="50%" stopColor="#60a5fa" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#93c5fd" stopOpacity={0.7}/>
                      </linearGradient>
                      <linearGradient id="gradientTaxas" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.9}/>
                        <stop offset="50%" stopColor="#fbbf24" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#fde047" stopOpacity={0.7}/>
                      </linearGradient>
                      <linearGradient id="gradientOutras" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9}/>
                        <stop offset="50%" stopColor="#a78bfa" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#c4b5fd" stopOpacity={0.7}/>
                      </linearGradient>
                    </defs>
                    <Pie
                      data={financialData.categoriasReceitas}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                      strokeWidth={5}
                      stroke="#fff"
                    >
                      <Cell fill="url(#gradientServicos)" />
                      <Cell fill="url(#gradientProdutos)" />
                      <Cell fill="url(#gradientTaxas)" />
                      <Cell fill="url(#gradientOutras)" />
                    </Pie>
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: '1px solid #e2e8f0', 
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)',
                        background: 'rgba(255, 255, 255, 0.95)'
                      }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-200/40">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div key="servicos" className="group relative flex items-center gap-2 p-2 bg-gradient-to-r from-slate-50/80 to-slate-100/40 rounded-lg border border-slate-200/40 hover:bg-gradient-to-r hover:from-slate-100/60 hover:to-slate-200/30 transition-all duration-200">
                    <div className="w-3 h-3 rounded-md shadow-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg, #10b981 0%, #34d399 50%, #6ee7b7 100%)' }}></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-800 truncate">Serviços</p>
                      <p className="text-xs text-slate-500">36%</p>
                    </div>
                  </div>
                  <div key="produtos" className="group relative flex items-center gap-2 p-2 bg-gradient-to-r from-slate-50/80 to-slate-100/40 rounded-lg border border-slate-200/40 hover:bg-gradient-to-r hover:from-slate-100/60 hover:to-slate-200/30 transition-all duration-200">
                    <div className="w-3 h-3 rounded-md shadow-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #93c5fd 100%)' }}></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-800 truncate">Produtos</p>
                      <p className="text-xs text-slate-500">26%</p>
                    </div>
                  </div>
                  <div key="taxas" className="group relative flex items-center gap-2 p-2 bg-gradient-to-r from-slate-50/80 to-slate-100/40 rounded-lg border border-slate-200/40 hover:bg-gradient-to-r hover:from-slate-100/60 hover:to-slate-200/30 transition-all duration-200">
                    <div className="w-3 h-3 rounded-md shadow-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #fde047 100%)' }}></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-800 truncate">Taxas</p>
                      <p className="text-xs text-slate-500">22%</p>
                    </div>
                  </div>
                  <div key="outras" className="group relative flex items-center gap-2 p-2 bg-gradient-to-r from-slate-50/80 to-slate-100/40 rounded-lg border border-slate-200/40 hover:bg-gradient-to-r hover:from-slate-100/60 hover:to-slate-200/30 transition-all duration-200">
                    <div className="w-3 h-3 rounded-md shadow-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 50%, #c4b5fd 100%)' }}></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-800 truncate">Outras</p>
                      <p className="text-xs text-slate-500">16%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Novos Gráficos com Métricas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gráfico de Comparativo Mensal */}
          <div className="group relative bg-gradient-to-br from-white/90 via-blue-50/40 to-blue-100/30 backdrop-blur-sm rounded-3xl border border-blue-200/50 shadow-xl shadow-blue-300/20 p-8 hover:shadow-2xl hover:shadow-blue-400/25 transition-all duration-500 hover:-translate-y-1 hover:scale-[1.01]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-blue-600/8 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-br from-slate-900 via-blue-700 to-slate-800 bg-clip-text text-transparent drop-shadow-sm">Comparativo Mensal</h3>
                  <p className="text-sm text-slate-600 mt-1">Receitas vs Metas</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-300 via-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-xl shadow-blue-400/30 ring-2 ring-blue-500/20 backdrop-blur-sm">
                  <Target className="text-white drop-shadow-sm" size={18} />
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={financialData.comparativoMensal}>
                    <defs>
                      <linearGradient id="gradientReceitas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.3}/>
                      </linearGradient>
                      <linearGradient id="gradientMetas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                    <XAxis 
                      dataKey="mes" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }} 
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: '1px solid #e2e8f0', 
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)',
                        background: 'rgba(255, 255, 255, 0.95)'
                      }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Legend />
                    <Bar dataKey="receitas" fill="url(#gradientReceitas)" radius={[8, 8, 0, 0]} name="Receitas" />
                    <Bar dataKey="meta" fill="url(#gradientMetas)" radius={[8, 8, 0, 0]} name="Metas" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Gráfico de Eficiência Operacional */}
          <div className="group relative bg-gradient-to-br from-white/90 via-purple-50/40 to-purple-100/30 backdrop-blur-sm rounded-3xl border border-purple-200/50 shadow-xl shadow-purple-300/20 p-8 hover:shadow-2xl hover:shadow-purple-400/25 transition-all duration-500 hover:-translate-y-1 hover:scale-[1.01]">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-purple-400/5 to-purple-600/8 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-br from-slate-900 via-purple-700 to-slate-800 bg-clip-text text-transparent drop-shadow-sm">Eficiência Operacional</h3>
                  <p className="text-sm text-slate-600 mt-1">Performance e Custos</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-purple-300 via-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-xl shadow-purple-400/30 ring-2 ring-purple-500/20 backdrop-blur-sm">
                  <Zap className="text-white drop-shadow-sm" size={18} />
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={financialData.eficienciaOperacional}>
                    <defs>
                      <linearGradient id="gradientEficiencia" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="gradientCusto" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                    <XAxis 
                      dataKey="mes" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }} 
                    />
                    <YAxis 
                      yAxisId="left"
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }} 
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }} 
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: '1px solid #e2e8f0', 
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)',
                        background: 'rgba(255, 255, 255, 0.95)'
                      }}
                    />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="eficiencia" 
                      stroke="url(#gradientEficiencia)" 
                      strokeWidth={3}
                      dot={{ fill: '#10b981', r: 4 }}
                      name="Eficiência (%)"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="custoOperacional" 
                      stroke="url(#gradientCusto)" 
                      strokeWidth={3}
                      dot={{ fill: '#ef4444', r: 4 }}
                      name="Custo Operacional"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Métricas Adicionais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group relative bg-gradient-to-br from-white/90 via-emerald-50/40 to-emerald-100/30 backdrop-blur-sm rounded-2xl border border-emerald-200/50 shadow-xl shadow-emerald-300/20 p-6 hover:shadow-2xl hover:shadow-emerald-400/25 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-emerald-600/8 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-300 via-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-xl shadow-emerald-400/30 ring-2 ring-emerald-500/20 backdrop-blur-sm">
                  <DollarSign className="text-white drop-shadow-sm" size={18} />
                </div>
                <div className="px-2 py-1 bg-gradient-to-r from-emerald-100/90 via-emerald-200/70 to-emerald-50/80 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1 border border-emerald-300/60 shadow-md backdrop-blur-sm">
                  <ArrowUpRight size={12} />
                  +8.2%
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold bg-gradient-to-br from-slate-900 via-emerald-800 to-slate-800 bg-clip-text text-transparent break-words overflow-wrap-anywhere drop-shadow-sm">{formatCurrency(financialData.metricasAdicionais.ticketMedio)}</p>
                <p className="text-sm text-slate-700 font-medium">Ticket Médio</p>
                <p className="text-xs text-slate-500">Por transação</p>
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-white/90 via-blue-50/40 to-blue-100/30 backdrop-blur-sm rounded-2xl border border-blue-200/50 shadow-xl shadow-blue-300/20 p-6 hover:shadow-2xl hover:shadow-blue-400/25 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-blue-600/8 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-300 via-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-xl shadow-blue-400/30 ring-2 ring-blue-500/20 backdrop-blur-sm">
                  <Target className="text-white drop-shadow-sm" size={18} />
                </div>
                <div className="px-2 py-1 bg-gradient-to-r from-blue-100/90 via-blue-200/70 to-blue-50/80 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1 border border-blue-300/60 shadow-md backdrop-blur-sm">
                  <ArrowUpRight size={12} />
                  +3.1%
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold bg-gradient-to-br from-slate-900 via-blue-800 to-slate-800 bg-clip-text text-transparent break-words overflow-wrap-anywhere drop-shadow-sm">{financialData.metricasAdicionais.taxaConversao}%</p>
                <p className="text-sm text-slate-700 font-medium">Taxa de Conversão</p>
                <p className="text-xs text-slate-500">Leads → Clientes</p>
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-white/90 via-purple-50/40 to-purple-100/30 backdrop-blur-sm rounded-2xl border border-purple-200/50 shadow-xl shadow-purple-300/20 p-6 hover:shadow-2xl hover:shadow-purple-400/25 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-purple-400/5 to-purple-600/8 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-300 via-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-xl shadow-purple-400/30 ring-2 ring-purple-500/20 backdrop-blur-sm">
                  <TrendingUpIcon className="text-white drop-shadow-sm" size={18} />
                </div>
                <div className="px-2 py-1 bg-gradient-to-r from-purple-100/90 via-purple-200/70 to-purple-50/80 text-purple-700 rounded-full text-xs font-bold flex items-center gap-1 border border-purple-300/60 shadow-md backdrop-blur-sm">
                  <ArrowUpRight size={12} />
                  +1.8%
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold bg-gradient-to-br from-slate-900 via-purple-800 to-slate-800 bg-clip-text text-transparent break-words overflow-wrap-anywhere drop-shadow-sm">{financialData.metricasAdicionais.satisfacaoCliente}%</p>
                <p className="text-sm text-slate-700 font-medium">Satisfação</p>
                <p className="text-xs text-slate-500">NPS Score</p>
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-white/90 via-orange-50/40 to-orange-100/30 backdrop-blur-sm rounded-2xl border border-orange-200/50 shadow-xl shadow-orange-300/20 p-6 hover:shadow-2xl hover:shadow-orange-400/25 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-orange-400/5 to-orange-600/8 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-300 via-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-xl shadow-orange-400/30 ring-2 ring-orange-500/20 backdrop-blur-sm">
                  <BarChart3 className="text-white drop-shadow-sm" size={18} />
                </div>
                <div className="px-2 py-1 bg-gradient-to-r from-orange-100/90 via-orange-200/70 to-orange-50/80 text-orange-700 rounded-full text-xs font-bold flex items-center gap-1 border border-orange-300/60 shadow-md backdrop-blur-sm">
                  <ArrowUpRight size={12} />
                  +{financialData.metricasAdicionais.crescimentoMensal}%
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold bg-gradient-to-br from-slate-900 via-orange-800 to-slate-800 bg-clip-text text-transparent break-words overflow-wrap-anywhere drop-shadow-sm">{financialData.metricasAdicionais.crescimentoMensal}%</p>
                <p className="text-sm text-slate-700 font-medium">Crescimento</p>
                <p className="text-xs text-slate-500">Mensal</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contas a Pagar */}
          <div className="group relative bg-gradient-to-br from-white via-slate-50/30 to-orange-50/20 rounded-3xl border border-slate-200/40 shadow-lg shadow-slate-200/15 p-8 hover:shadow-xl hover:shadow-orange-300/20 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/6 via-orange-400/3 to-orange-600/4 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent">Contas a Pagar</h3>
                  <p className="text-sm text-slate-500 mt-1">Próximos vencimentos</p>
                </div>
                <div className="px-3 py-1 bg-gradient-to-r from-orange-50/80 to-orange-100/60 text-orange-700 rounded-full text-xs font-semibold border border-orange-200/50 shadow-sm">
                  {financialData.contasPagar.length} contas
                </div>
              </div>
              <div className="space-y-3">
                {financialData.contasPagar.map((conta) => (
                  <div key={conta.id} className="group relative flex items-center justify-between p-4 bg-gradient-to-r from-slate-50/60 to-slate-100/30 rounded-xl border border-slate-200/40 hover:bg-gradient-to-r hover:from-slate-100/50 hover:to-slate-200/20 transition-all duration-200">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-slate-800">{conta.fornecedor}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(conta.status)}`}>
                          {conta.status === 'vencendo' ? 'Vencendo' : conta.status === 'avencer' ? 'A vencer' : 'Normal'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span>{conta.categoria}</span>
                        <span>Venc: {new Date(conta.vencimento).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    <div className="text-right min-w-0">
                      <p className="font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent break-words overflow-wrap-anywhere">{formatCurrency(conta.valor)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Transações Recentes */}
          <div className="group relative bg-gradient-to-br from-white via-slate-50/30 to-slate-100/20 rounded-3xl border border-slate-200/40 shadow-lg shadow-slate-200/15 p-8 hover:shadow-xl hover:shadow-slate-300/20 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-500/6 via-slate-400/3 to-slate-600/4 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent">Transações Recentes</h3>
                  <p className="text-sm text-slate-500 mt-1">Últimas movimentações</p>
                </div>
              </div>
              <div className="space-y-3">
                {financialData.transacoesRecentes.map((transacao) => (
                  <div key={transacao.id} className="group relative flex items-center justify-between p-4 bg-gradient-to-r from-slate-50/60 to-slate-100/30 rounded-xl border border-slate-200/40 hover:bg-gradient-to-r hover:from-slate-100/50 hover:to-slate-200/20 transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        transacao.tipo === 'receita' 
                          ? 'bg-gradient-to-br from-emerald-100/80 to-emerald-50/60 text-emerald-600 border border-emerald-200/50' 
                          : 'bg-gradient-to-br from-red-100/80 to-red-50/60 text-red-600 border border-red-200/50'
                      }`}>
                        {transacao.tipo === 'receita' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800">{transacao.descricao}</p>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <span>{transacao.cliente || transacao.fornecedor}</span>
                          <span>•</span>
                          <span>{new Date(transacao.data).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right min-w-0">
                      <p className={`font-bold break-words overflow-wrap-anywhere ${
                        transacao.tipo === 'receita' ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {transacao.tipo === 'receita' ? '+' : '-'}{formatCurrency(transacao.valor)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
