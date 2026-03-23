import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Users, 
  Calendar, 
  FileText, 
  TrendingUp,
  Award,
  Clock,
  Target,
  Search,
  Plus,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

export const HRPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalEmployees: 156,
    activeEmployees: 142,
    newHires: 8,
    openPositions: 12
  });

  const [recentActivities] = useState([
    {
      id: 1,
      type: 'hire',
      title: 'Novo contratado',
      description: 'Carlos Silva - Analista Financeiro',
      time: '2 horas atrás',
      icon: Users,
      color: 'emerald'
    },
    {
      id: 2,
      type: 'leave',
      title: 'Solicitação de férias',
      description: 'Maria Santos - 15 dias a partir de 01/04',
      time: '4 horas atrás',
      icon: Calendar,
      color: 'blue'
    },
    {
      id: 3,
      type: 'performance',
      title: 'Avaliação de desempenho',
      description: 'João Oliveira - Trimestre Q1',
      time: '1 dia atrás',
      icon: Award,
      color: 'amber'
    },
    {
      id: 4,
      type: 'training',
      title: 'Treinamento concluído',
      description: 'Pedro Costa - Segurança do Trabalho',
      time: '2 dias atrás',
      icon: Target,
      color: 'purple'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Header Moderno */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Briefcase className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Recursos Humanos
                  </h1>
                  <p className="text-slate-500 font-medium">Gerencie equipe, contratações e desenvolvimento</p>
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
                  placeholder="Buscar funcionários..."
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
                <p className="text-sm text-slate-600 font-medium">Total de Funcionários</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalEmployees}</p>
                <p className="text-xs text-emerald-600 mt-2">+5% este mês</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Users className="text-emerald-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Funcionários Ativos</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats.activeEmployees}</p>
                <p className="text-xs text-slate-500 mt-2">91% do total</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Novas Contratações</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats.newHires}</p>
                <p className="text-xs text-emerald-600 mt-2">Este mês</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Plus className="text-amber-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Vagas Abertas</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats.openPositions}</p>
                <p className="text-xs text-slate-500 mt-2">3 urgentes</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Target className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Atividades Recentes</h2>
              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors" title="Atualizar">
                  <RefreshCw size={18} />
                </button>
                <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors" title="Filtrar">
                  <Filter size={18} />
                </button>
                <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors" title="Exportar">
                  <Download size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 bg-${activity.color}-100 rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <activity.icon className={`text-${activity.color}-600`} size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-slate-900">{activity.title}</h3>
                      <span className="text-sm text-slate-500">{activity.time}</span>
                    </div>
                    <p className="text-slate-600 mt-1">{activity.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all hover:border-blue-200 group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Plus className="text-blue-600" size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-slate-900">Nova Contratação</h3>
                <p className="text-sm text-slate-600">Adicionar novo funcionário</p>
              </div>
            </div>
          </button>

          <button className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all hover:border-emerald-200 group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                <Calendar className="text-emerald-600" size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-slate-900">Gerenciar Férias</h3>
                <p className="text-sm text-slate-600">Aprovar solicitações</p>
              </div>
            </div>
          </button>

          <button className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all hover:border-purple-200 group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <Award className="text-purple-600" size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-slate-900">Avaliações</h3>
                <p className="text-sm text-slate-600">Desempenho da equipe</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
