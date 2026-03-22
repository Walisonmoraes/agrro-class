import React, { useState, useEffect } from 'react';
import { Plus, Search, MapPin, X, Save, Trash2, Edit2, Calendar, Navigation } from 'lucide-react';
import { apiFetch } from '../services/api';

export const Destinations = () => {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', city: '', state: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    try {
      const data = await apiFetch('/api/destinations');
      setDestinations(data);
    } catch (err) {
      console.error('Erro ao carregar destinos', err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiFetch(`/api/destinations/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(form)
        });
      } else {
        await apiFetch('/api/destinations', {
          method: 'POST',
          body: JSON.stringify(form)
        });
      }
      setShowModal(false);
      setEditingId(null);
      setForm({ name: '', city: '', state: '' });
      loadDestinations();
    } catch (err) {
      alert('Erro ao salvar destino');
    }
  };

  const handleEdit = (dest: any) => {
    setEditingId(dest.id);
    setForm({ 
      name: dest.name,
      city: dest.city || '',
      state: dest.state || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este destino?')) return;
    try {
      await apiFetch(`/api/destinations/${id}`, { method: 'DELETE' });
      loadDestinations();
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir destino');
    }
  };

  const filteredDestinations = destinations.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.city && d.city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Header Moderno */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <Navigation className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Destinos / Fazendas
                  </h1>
                  <p className="text-slate-500 font-medium">Gerencie os locais de destino e fazendas</p>
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
                onClick={() => { setEditingId(null); setForm({ name: '', city: '', state: '' }); setShowModal(true); }}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 flex items-center gap-2 font-medium"
              >
                <Plus size={18} />
                Novo Destino
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">

      {/* Container Moderno */}
      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-lg shadow-slate-200/25 overflow-hidden">
        <div className="p-8 border-b border-slate-200/60">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Navigation className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Lista de Destinos</h2>
              <p className="text-slate-500 mt-1">Todos os destinos e fazendas cadastrados</p>
            </div>
          </div>
        </div>
        
        <div className="p-8 border-b border-slate-200/60">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Pesquisar destinos..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-amber-500 transition-all text-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-stone-50 text-stone-500 text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Nome do Destino</th>
                <th className="px-6 py-4">Localização</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredDestinations.length > 0 ? (
                filteredDestinations.map(dest => (
                  <tr key={dest.id} className="hover:bg-stone-50 transition-colors group">
                    <td className="px-6 py-4 text-sm text-stone-500 font-mono">#{dest.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center text-stone-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                          <MapPin size={20} />
                        </div>
                        <span className="font-semibold text-stone-800">{dest.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-600 italic">
                      {dest.city && dest.state ? `${dest.city} - ${dest.state}` : dest.city || dest.state || 'Não informado'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(dest)}
                          className="p-2 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(dest.id)}
                          className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-stone-400 italic">
                    Nenhum destino encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-stone-200">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <h3 className="text-lg font-bold text-stone-800">
                {editingId ? 'Editar Destino' : 'Novo Destino'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Nome do Destino</label>
                <input 
                  type="text" required autoFocus
                  placeholder="Ex: Porto de Santos, Terminal Ferroviário..."
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Município</label>
                  <input 
                    type="text"
                    placeholder="Ex: Santos"
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Estado (UF)</label>
                  <input 
                    type="text"
                    placeholder="Ex: SP"
                    maxLength={2}
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all uppercase"
                    value={form.state}
                    onChange={e => setForm({ ...form, state: e.target.value.toUpperCase() })}
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
                >
                  <Save size={20} />
                  {editingId ? 'Atualizar Destino' : 'Salvar Destino'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
