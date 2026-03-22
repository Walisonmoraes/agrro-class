import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  LogOut, 
  Tractor, 
  Settings, 
  BarChart3, 
  Receipt, 
  ClipboardCheck, 
  MapPin, 
  Navigation, 
  CreditCard, 
  UserCircle,
  FileSpreadsheet,
  Package,
  ChevronLeft,
  ChevronRight,
  Wallet,
  ChevronDown,
  TrendingUp
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface LayoutProps {
  children: React.ReactNode;
  current: string;
  onNavigate: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, current, onNavigate }) => {
  const { user, logout } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [dashboardsExpanded, setDashboardsExpanded] = useState(false);

  const menuItems = [
    { 
      id: 'dashboards', 
      label: 'Dashboards', 
      icon: BarChart3, 
      roles: ['ADMIN', 'CLASSIFIER', 'FINANCE'],
      hasSubmenu: true,
      submenu: [
        { id: 'dashboard', label: 'Operacional', icon: TrendingUp, roles: ['ADMIN', 'CLASSIFIER', 'FINANCE'] },
        { id: 'dashboard-financeiro', label: 'Financeiro', icon: Wallet, roles: ['ADMIN', 'FINANCE'] }
      ]
    },
    { id: 'orders', label: 'Ordens de Serviço', icon: FileText, roles: ['ADMIN', 'CLASSIFIER', 'FINANCE'] },
    { id: 'laudos', label: 'Laudos', icon: ClipboardCheck, roles: ['ADMIN', 'CLASSIFIER'] },
    { id: 'rne', label: 'NHE', icon: FileSpreadsheet, roles: ['ADMIN', 'CLASSIFIER'] },
    { id: 'classifiers', label: 'Classificadores', icon: Tractor, roles: ['ADMIN'] },
    { id: 'clients', label: 'Clientes', icon: Users, roles: ['ADMIN', 'FINANCE'] },
    { id: 'embarkation', label: 'Origens / Fazendas', icon: MapPin, roles: ['ADMIN'] },
    { id: 'destinations', label: 'Destinos', icon: Navigation, roles: ['ADMIN'] },
    { id: 'products', label: 'Produtos', icon: Package, roles: ['ADMIN'] },
    { id: 'billing', label: 'Faturamento', icon: Receipt, roles: ['ADMIN', 'FINANCE'] },
  ];

  return (
    <div className="flex h-screen bg-stone-100 font-sans">
      {/* Sidebar */}
      <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-stone-900 text-stone-300 flex flex-col border-r border-stone-800 transition-all duration-300 ease-in-out`}>
        {/* Header da Sidebar */}
        <div className={`${isCollapsed ? 'p-4' : 'p-6'} flex items-center justify-between border-b border-stone-800`}>
          <div className={`flex items-center gap-3 ${isCollapsed ? 'hidden' : ''}`}>
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">A</div>
            <span className="text-xl font-semibold tracking-tight text-white">AgroClass</span>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-stone-800 hover:text-white transition-all duration-200 flex-shrink-0"
            title={isCollapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
        
        <nav className={`flex-1 ${isCollapsed ? 'p-2' : 'p-4'} space-y-1`}>
          {menuItems.filter(item => item.roles.includes(user?.role || '')).map((item) => (
            <div key={item.id}>
              {item.hasSubmenu ? (
                <div>
                  <button
                    onClick={() => setDashboardsExpanded(!dashboardsExpanded)}
                    className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      current.startsWith('dashboard') 
                        ? 'bg-emerald-500/10 text-emerald-400 font-medium' 
                        : 'hover:bg-stone-800 hover:text-white'
                    }`}
                    title={isCollapsed ? item.label : ''}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={20} className="flex-shrink-0" />
                      {!isCollapsed && <span>{item.label}</span>}
                    </div>
                    {!isCollapsed && (
                      <ChevronDown 
                        size={16} 
                        className={`transition-transform duration-200 ${dashboardsExpanded ? 'rotate-180' : ''}`}
                      />
                    )}
                  </button>
                  
                  {/* Submenu */}
                  {!isCollapsed && dashboardsExpanded && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.submenu?.filter(subitem => subitem.roles.includes(user?.role || '')).map((subitem) => (
                        <button
                          key={subitem.id}
                          onClick={() => onNavigate(subitem.id)}
                          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                            current === subitem.id 
                              ? 'bg-emerald-500/20 text-emerald-400 font-medium' 
                              : 'hover:bg-stone-800 hover:text-white text-stone-400'
                          }`}
                        >
                          <subitem.icon size={16} className="flex-shrink-0" />
                          <span className="text-sm">{subitem.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    current === item.id 
                      ? 'bg-emerald-500/10 text-emerald-400 font-medium' 
                      : 'hover:bg-stone-800 hover:text-white'
                  }`}
                  title={isCollapsed ? item.label : ''}
                >
                  <item.icon size={20} className="flex-shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              )}
            </div>
          ))}
        </nav>

        <div className={`${isCollapsed ? 'p-2' : 'p-4'} border-t border-stone-800`}>
          <button 
            onClick={() => onNavigate('profile')}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} gap-3 px-4 py-3 rounded-xl transition-all duration-200 mb-2 ${
              current === 'profile' 
                ? 'bg-emerald-500/10 text-emerald-400 font-medium' 
                : 'text-stone-400 hover:bg-stone-800 hover:text-white'
            }`}
            title={isCollapsed ? 'Minha Conta' : ''}
          >
            <UserCircle size={20} className="flex-shrink-0" />
            {!isCollapsed && <span>Minha Conta</span>}
          </button>
          <button 
            onClick={logout}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} gap-3 px-4 py-3 rounded-xl text-stone-400 hover:bg-red-500/10 hover:text-red-400 transition-all`}
            title={isCollapsed ? 'Sair' : ''}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {!isCollapsed && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="w-full">
          {children}
        </div>
      </main>
    </div>
  );
};
