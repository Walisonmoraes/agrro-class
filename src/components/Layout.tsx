import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  User,
  FileText, 
  LogOut, 
  Tractor, 
  Settings, 
  BarChart3, 
  Receipt, 
  ClipboardCheck, 
  MapPin, 
  Map,
  Navigation, 
  CreditCard, 
  UserCircle,
  Package,
  ChevronLeft,
  ChevronRight,
  Wallet,
  TrendingUp,
  Briefcase,
  FileBarChart,
  CheckSquare,
  AlertTriangle,
  FileCheck,
  FileSpreadsheet,
  ChevronDown,
  Truck,
  Wrench,
  Fuel,
  Car
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
  const [rhExpanded, setRhExpanded] = useState(false);
  const [reportsExpanded, setReportsExpanded] = useState(false);
  const [classificationExpanded, setClassificationExpanded] = useState(false);
  const [fleetExpanded, setFleetExpanded] = useState(false);

  const menuItems = [
    { 
      id: 'dashboards', 
      label: 'Dashboards', 
      icon: LayoutDashboard, 
      roles: ['ADMIN', 'CLASSIFIER', 'FINANCE'],
      hasSubmenu: true,
      submenu: [
        { id: 'dashboard', label: 'Dashboard Principal', icon: BarChart3, roles: ['ADMIN', 'CLASSIFIER', 'FINANCE'] },
        { id: 'dashboard-financeiro', label: 'Dashboard Financeiro', icon: Wallet, roles: ['ADMIN', 'FINANCE'] }
      ]
    },
    { 
      id: 'embarkation-map', 
      label: 'Mapa de Embarque', 
      icon: Map, 
      roles: ['ADMIN', 'CLASSIFIER']
    },
    { 
      id: 'classification',
      label: 'Classificação',
      icon: Tractor,
      roles: ['ADMIN', 'CLASSIFIER'],
      hasSubmenu: true,
      submenu: [
        { id: 'orders', label: 'Ordens de Serviço', icon: FileText, roles: ['ADMIN', 'CLASSIFIER'] },
        { id: 'laudos', label: 'Laudos', icon: ClipboardCheck, roles: ['ADMIN', 'CLASSIFIER'] },
        { id: 'rne', label: 'NHE', icon: FileSpreadsheet, roles: ['ADMIN', 'CLASSIFIER'] },
        { id: 'destinations', label: 'Destinos', icon: Navigation, roles: ['ADMIN'] },
        { id: 'clients', label: 'Clientes', icon: Users, roles: ['ADMIN', 'FINANCE'] },
        { id: 'embarkation', label: 'Origens / Fazendas', icon: MapPin, roles: ['ADMIN'] },
        { id: 'products', label: 'Produtos', icon: Package, roles: ['ADMIN'] }
      ]
    },
    { 
      id: 'rh', 
      label: 'RH', 
      icon: Briefcase, 
      roles: ['ADMIN'],
      hasSubmenu: true,
      submenu: [
        { id: 'users', label: 'Usuários', icon: Users, roles: ['ADMIN'] },
        { id: 'classifiers', label: 'Classificadores', icon: Tractor, roles: ['ADMIN'] },
        { id: 'rh', label: 'Recursos Humanos', icon: Briefcase, roles: ['ADMIN'] }
      ]
    },
    { 
      id: 'fleet', 
      label: 'Frota', 
      icon: Car, 
      roles: ['ADMIN', 'CLASSIFIER', 'FINANCE'],
      hasSubmenu: true,
      submenu: [
        { id: 'vehicles', label: 'Veículos', icon: Truck, roles: ['ADMIN', 'CLASSIFIER', 'FINANCE'] },
        { id: 'maintenance', label: 'Manutenção', icon: Wrench, roles: ['ADMIN', 'CLASSIFIER'] },
        { id: 'fuel', label: 'Combustível', icon: Fuel, roles: ['ADMIN', 'FINANCE'] },
        { id: 'checklist', label: 'Checklist', icon: CheckSquare, roles: ['ADMIN', 'CLASSIFIER'] },
        { id: 'drivers', label: 'Condutores', icon: User, roles: ['ADMIN', 'CLASSIFIER', 'FINANCE'] }
      ]
    },
    { id: 'billing', label: 'Faturamento', icon: Receipt, roles: ['ADMIN', 'FINANCE'] },
    { 
      id: 'reports', 
      label: 'Relatórios', 
      icon: FileBarChart, 
      roles: ['ADMIN', 'CLASSIFIER', 'FINANCE'],
      hasSubmenu: true,
      submenu: [
        { id: 'plate-occurrences', label: 'Ocorrência de Placa', icon: AlertTriangle, roles: ['ADMIN', 'CLASSIFIER', 'FINANCE'] },
        { id: 'production', label: 'Produção', icon: Package, roles: ['ADMIN', 'CLASSIFIER', 'FINANCE'] },
        { id: 'audits', label: 'Auditorias', icon: FileCheck, roles: ['ADMIN', 'CLASSIFIER', 'FINANCE'] }
      ]
    },
  ];

  return (
    <div className="flex h-screen bg-stone-100 font-sans overflow-hidden">
      {/* Estilos customizados para scrollbar */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: transparent;
        }
        .custom-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
      
      {/* Sidebar */}
      <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-stone-900 text-stone-300 flex flex-col border-r border-stone-800 transition-all duration-300 ease-in-out overflow-hidden`}>
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
        
        <nav className={`flex-1 ${isCollapsed ? 'p-2' : 'p-4'} space-y-1 overflow-y-auto overflow-x-hidden custom-scrollbar`}>
          {menuItems.filter(item => item.roles.includes(user?.role || '')).map((item) => (
            <div key={item.id}>
              {item.hasSubmenu ? (
                <div>
                  <button
                    onClick={() => {
                      if (item.id === 'dashboards') {
                        setDashboardsExpanded(!dashboardsExpanded);
                      } else if (item.id === 'rh') {
                        setRhExpanded(!rhExpanded);
                      } else if (item.id === 'reports') {
                        setReportsExpanded(!reportsExpanded);
                      } else if (item.id === 'classification') {
                        setClassificationExpanded(!classificationExpanded);
                      } else if (item.id === 'fleet') {
                        setFleetExpanded(!fleetExpanded);
                      }
                    }}
                    className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      (current.startsWith('dashboard') && item.id === 'dashboards') || 
                      ((current === 'users' || current === 'classifiers' || current === 'rh') && item.id === 'rh') ||
                      ((current === 'plate-occurrences' || current === 'production' || current === 'audits') && item.id === 'reports') ||
                      ((current === 'orders' || current === 'laudos' || current === 'rne' || current === 'destinations' || current === 'clients' || current === 'embarkation' || current === 'products') && item.id === 'classification') ||
                      ((current === 'vehicles' || current === 'maintenance' || current === 'fuel') && item.id === 'fleet')
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
                        className={`transition-transform duration-200 ${
                          (item.id === 'dashboards' && dashboardsExpanded) || 
                          (item.id === 'rh' && rhExpanded) ||
                          (item.id === 'reports' && reportsExpanded) ||
                          (item.id === 'classification' && classificationExpanded) ||
                          (item.id === 'fleet' && fleetExpanded)
                            ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>
                  
                  {/* Submenu */}
                  {!isCollapsed && (
                    ((item.id === 'dashboards' && dashboardsExpanded) || 
                     (item.id === 'rh' && rhExpanded) ||
                     (item.id === 'reports' && reportsExpanded) ||
                     (item.id === 'classification' && classificationExpanded) ||
                     (item.id === 'fleet' && fleetExpanded)) && (
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
                    )
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
      <main className="flex-1 overflow-hidden">
        <div className="w-full h-full overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
