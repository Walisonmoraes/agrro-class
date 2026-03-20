import React from 'react';
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
  Package
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface LayoutProps {
  children: React.ReactNode;
  current: string;
  onNavigate: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, current, onNavigate }) => {
  const { user, logout } = useAuthStore();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'CLASSIFIER', 'FINANCE'] },
    { id: 'orders', label: 'Ordens de Serviço', icon: FileText, roles: ['ADMIN', 'CLASSIFIER', 'FINANCE'] },
    { id: 'laudos', label: 'Laudos', icon: ClipboardCheck, roles: ['ADMIN', 'CLASSIFIER'] },
    { id: 'rne', label: 'RNE', icon: FileSpreadsheet, roles: ['ADMIN', 'CLASSIFIER'] },
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
      <aside className="w-64 bg-stone-900 text-stone-300 flex flex-col border-r border-stone-800">
        <div className="p-6 flex items-center gap-3 border-b border-stone-800">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">A</div>
          <span className="text-xl font-semibold tracking-tight text-white">AgroClass</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.filter(item => item.roles.includes(user?.role || '')).map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                current === item.id 
                  ? 'bg-emerald-500/10 text-emerald-400 font-medium' 
                  : 'hover:bg-stone-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-stone-800">
          <button 
            onClick={() => onNavigate('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 mb-2 ${
              current === 'profile' 
                ? 'bg-emerald-500/10 text-emerald-400 font-medium' 
                : 'text-stone-400 hover:bg-stone-800 hover:text-white'
            }`}
          >
            <UserCircle size={20} />
            Minha Conta
          </button>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-stone-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-lg font-semibold text-stone-800 capitalize">
            {menuItems.find(i => i.id === current)?.label || current}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-stone-500">{new Date().toLocaleDateString('pt-BR')}</span>
          </div>
        </header>
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
