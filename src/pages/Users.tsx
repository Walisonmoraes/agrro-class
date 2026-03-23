import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  Shield, 
  MoreHorizontal,
  UserPlus,
  Filter,
  Download,
  RefreshCw,
  Calendar
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { UserModal } from '../components/UserModal';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CLASSIFIER' | 'FINANCE';
  status: 'active' | 'inactive' | 'suspended';
  phone?: string;
  createdAt: string;
  lastLogin?: string;
}

export const UsersPage = () => {
  const { user } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setUsers([
        {
          id: '1',
          name: 'João Silva',
          email: 'joao.silva@agroclass.com',
          role: 'ADMIN',
          status: 'active',
          phone: '(11) 98765-4321',
          createdAt: '2024-01-15',
          lastLogin: '2024-03-20 14:30'
        },
        {
          id: '2',
          name: 'Maria Santos',
          email: 'maria.santos@agroclass.com',
          role: 'CLASSIFIER',
          status: 'active',
          phone: '(11) 91234-5678',
          createdAt: '2024-02-20',
          lastLogin: '2024-03-20 09:15'
        },
        {
          id: '3',
          name: 'Pedro Oliveira',
          email: 'pedro.oliveira@agroclass.com',
          role: 'FINANCE',
          status: 'active',
          phone: '(11) 87654-3210',
          createdAt: '2024-01-10',
          lastLogin: '2024-03-19 16:45'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleOpenModal = (user?: User) => {
    setEditingUser(user || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSaveUser = (userData: any) => {
    if (editingUser) {
      // Editar usuário existente
      setUsers(prev => prev.map(u => 
        u.id === editingUser.id 
          ? { ...u, ...userData }
          : u
      ));
    } else {
      // Criar novo usuário
      const newUser: User = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: undefined
      };
      setUsers(prev => [...prev, newUser]);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800 border-red-200';
      case 'CLASSIFIER': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'FINANCE': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'suspended': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Administrador';
      case 'CLASSIFIER': return 'Classificador';
      case 'FINANCE': return 'Financeiro';
      default: return role;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'suspended': return 'Suspenso';
      default: return status;
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
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <Users className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Usuários
                  </h1>
                  <p className="text-slate-500 font-medium">Gerencie os usuários e permissões do sistema</p>
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
              
              <button 
                onClick={() => handleOpenModal()}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 flex items-center gap-2 font-medium"
              >
                <Plus size={18} />
                Novo Usuário
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">
        <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="p-6 border-b border-stone-100 bg-stone-50/50">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="relative max-w-md flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                <input 
                  type="text"
                  placeholder="Buscar por nome ou email..."
                  className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-2xl outline-none focus:border-emerald-500 transition-all shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-3">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-4 py-3 bg-white border border-stone-200 rounded-2xl outline-none focus:border-emerald-500 transition-all shadow-sm"
                >
                  <option value="all">Todos os papéis</option>
                  <option value="ADMIN">Administrador</option>
                  <option value="CLASSIFIER">Classificador</option>
                  <option value="FINANCE">Financeiro</option>
                </select>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 bg-white border border-stone-200 rounded-2xl outline-none focus:border-emerald-500 transition-all shadow-sm"
                >
                  <option value="all">Todos os status</option>
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                  <option value="suspended">Suspenso</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-stone-400 text-xs uppercase tracking-widest font-bold border-b border-stone-100">
                  <th className="px-8 py-5">Usuário</th>
                  <th className="px-8 py-5">Papel</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Telefone</th>
                  <th className="px-8 py-5">Último Acesso</th>
                  <th className="px-8 py-5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-12 text-center text-stone-400 italic">Carregando usuários...</td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-12 text-center text-stone-400 italic">Nenhum usuário encontrado.</td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="group hover:bg-stone-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center text-stone-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                            <Users size={24} />
                          </div>
                          <div>
                            <div className="font-semibold text-stone-900">{user.name}</div>
                            <div className="text-sm text-stone-600 flex items-center gap-1">
                              <Mail size={14} className="text-stone-400" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                          {getStatusLabel(user.status)}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-stone-600">
                        {user.phone && (
                          <div className="flex items-center gap-1">
                            <Phone size={14} className="text-stone-400" />
                            {user.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-5 text-sm text-stone-600">
                        {user.lastLogin}
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleOpenModal(user)}
                            className="p-2 text-stone-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors" 
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button className="p-2 text-stone-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="Excluir">
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
      </div>

      {/* Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveUser}
        user={editingUser}
      />
    </div>
  );
};
