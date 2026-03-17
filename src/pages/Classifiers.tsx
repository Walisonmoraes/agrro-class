import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Tractor, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  X, 
  Save,
  Mail,
  Shield,
  FileBadge
} from 'lucide-react';
import { apiFetch } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

interface Classifier {
  id: number;
  name: string;
  email: string;
  role: string;
  professional_reg: string | null;
  cpf: string | null;
  signature_url: string | null;
}

export const Classifiers: React.FC = () => {
  const [classifiers, setClassifiers] = useState<Classifier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClassifier, setEditingClassifier] = useState<Classifier | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    professional_reg: '',
    cpf: ''
  });

  useEffect(() => {
    loadClassifiers();
  }, []);

  const loadClassifiers = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/classifiers');
      setClassifiers(data);
    } catch (error) {
      console.error('Error loading classifiers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingClassifier) {
        await apiFetch(`/api/classifiers/${editingClassifier.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await apiFetch('/api/classifiers', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      setShowModal(false);
      setEditingClassifier(null);
      setFormData({ name: '', email: '', password: '', professional_reg: '', cpf: '' });
      loadClassifiers();
    } catch (error: any) {
      alert(error.message || 'Erro ao salvar classificador');
    }
  };

  const handleEdit = (classifier: Classifier) => {
    setEditingClassifier(classifier);
    setFormData({
      name: classifier.name,
      email: classifier.email,
      password: '', // Don't show password
      professional_reg: classifier.professional_reg || '',
      cpf: classifier.cpf || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este classificador?')) {
      try {
        await apiFetch(`/api/classifiers/${id}`, { method: 'DELETE' });
        loadClassifiers();
      } catch (error: any) {
        alert(error.message || 'Erro ao excluir classificador');
      }
    }
  };

  const filteredClassifiers = classifiers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.professional_reg && c.professional_reg.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c.cpf && c.cpf.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-800">Classificadores</h2>
          <p className="text-stone-500">Gerencie a equipe técnica e registros profissionais</p>
        </div>
        <button 
          onClick={() => {
            setEditingClassifier(null);
            setFormData({ name: '', email: '', password: '', professional_reg: '', cpf: '' });
            setShowModal(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-emerald-600/20"
        >
          <Plus size={20} />
          Novo Classificador
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="p-6 border-b border-stone-100 bg-stone-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
            <input 
              type="text"
              placeholder="Buscar por nome, email ou registro..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-2xl outline-none focus:border-emerald-500 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-stone-400 text-xs uppercase tracking-widest font-bold border-b border-stone-100">
                <th className="px-8 py-5">Classificador</th>
                <th className="px-8 py-5">CPF</th>
                <th className="px-8 py-5">Contato</th>
                <th className="px-8 py-5">Registro Profissional</th>
                <th className="px-8 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center text-stone-400 italic">Carregando classificadores...</td>
                </tr>
              ) : filteredClassifiers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center text-stone-400 italic">Nenhum classificador encontrado.</td>
                </tr>
              ) : (
                filteredClassifiers.map((classifier) => (
                  <tr key={classifier.id} className="group hover:bg-stone-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center text-stone-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                          <Tractor size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-stone-800">{classifier.name}</p>
                          <div className="flex items-center gap-1.5 text-xs text-stone-400 mt-0.5">
                            <Shield size={12} />
                            <span>{classifier.role}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-mono text-stone-600">
                        {classifier.cpf || <span className="text-stone-300 italic">Não informado</span>}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-stone-600">
                        <Mail size={16} className="text-stone-400" />
                        <span className="text-sm font-medium">{classifier.email}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      {classifier.professional_reg ? (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-100 text-stone-600 rounded-lg w-fit">
                          <FileBadge size={16} className="text-stone-400" />
                          <span className="text-xs font-bold font-mono">{classifier.professional_reg}</span>
                        </div>
                      ) : (
                        <span className="text-stone-300 text-xs italic">Não informado</span>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(classifier)}
                          className="p-2 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(classifier.id)}
                          className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
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

      {/* Modal Form */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-xl overflow-hidden border border-stone-200"
            >
              <div className="p-8 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
                <div>
                  <h3 className="text-xl font-bold text-stone-800">
                    {editingClassifier ? 'Editar Classificador' : 'Novo Classificador'}
                  </h3>
                  <p className="text-sm text-stone-500">Preencha os dados técnicos do profissional</p>
                </div>
                <button 
                  onClick={() => setShowModal(false)} 
                  className="w-10 h-10 flex items-center justify-center rounded-full text-stone-400 hover:bg-stone-200 hover:text-stone-600 transition-all"
                >
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Nome Completo</label>
                    <input 
                      type="text"
                      className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all font-medium"
                      placeholder="Ex: João Silva"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Email</label>
                      <input 
                        type="email"
                        className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all font-medium"
                        placeholder="joao@agroclass.com"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">CPF</label>
                      <input 
                        type="text"
                        className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all font-medium font-mono"
                        placeholder="000.000.000-00"
                        value={formData.cpf}
                        onChange={e => setFormData({...formData, cpf: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Registro Profissional</label>
                      <input 
                        type="text"
                        className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all font-medium font-mono"
                        placeholder="Ex: CREA-12345"
                        value={formData.professional_reg}
                        onChange={e => setFormData({...formData, professional_reg: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">
                        {editingClassifier ? 'Nova Senha (opcional)' : 'Senha de Acesso'}
                      </label>
                      <input 
                        type="password"
                        className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all font-medium"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        required={!editingClassifier}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-4 border border-stone-200 text-stone-600 font-bold rounded-2xl hover:bg-stone-50 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
                  >
                    <Save size={20} />
                    {editingClassifier ? 'Salvar Alterações' : 'Cadastrar Profissional'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
