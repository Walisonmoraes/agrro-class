import React, { useState, useEffect } from 'react';
import { Plus, Search, MapPin, X, Save, Edit2, Trash2 } from 'lucide-react';
import { apiFetch } from '../services/api';

export const EmbarkationPoints = () => {
  const [origins, setOrigins] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [form, setForm] = useState({
    farm_name: '', 
    producer_name: '', 
    city: '', 
    state: '', 
    client_id: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [o, c] = await Promise.all([
        apiFetch('/api/origins'),
        apiFetch('/api/clients')
      ]);
      setOrigins(o);
      setClients(c);
    } catch (err) {
      console.error('Erro ao carregar dados', err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiFetch(`/api/origins/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(form)
        });
      } else {
        await apiFetch('/api/origins', {
          method: 'POST',
          body: JSON.stringify(form)
        });
      }
      setShowModal(false);
      setEditingId(null);
      setForm({ farm_name: '', producer_name: '', city: '', state: '', client_id: '' });
      loadData();
    } catch (err) {
      alert('Erro ao salvar origem');
    }
  };

  const handleEdit = (origin: any) => {
    setEditingId(origin.id);
    setForm({
      farm_name: origin.farm_name,
      producer_name: origin.producer_name,
      city: origin.city,
      state: origin.state,
      client_id: origin.client_id.toString()
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta origem?')) return;
    try {
      await apiFetch(`/api/origins/${id}`, { method: 'DELETE' });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir origem');
    }
  };

  const filteredOrigins = origins.filter(o => 
    o.farm_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.producer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-stone-800">Origens / Fazendas</h2>
        <button 
          onClick={() => {
            setEditingId(null);
            setForm({ farm_name: '', producer_name: '', city: '', state: '', client_id: '' });
            setShowModal(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-all shadow-lg shadow-emerald-600/20"
        >
          <Plus size={20} />
          Nova Origem
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar fazendas ou produtores..." 
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-emerald-500 transition-all text-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-stone-50 text-stone-500 text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">Fazenda</th>
                <th className="px-6 py-4">Produtor</th>
                <th className="px-6 py-4">Localização</th>
                <th className="px-6 py-4">Cliente Vinculado</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrigins.length > 0 ? (
                filteredOrigins.map(origin => (
                  <tr key={origin.id} className="hover:bg-stone-50 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-stone-800">{origin.farm_name}</td>
                    <td className="px-6 py-4 text-sm text-stone-600">{origin.producer_name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-stone-500">
                        <MapPin size={12} /> {origin.city} - {origin.state}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-600">{origin.client_name}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(origin)}
                          className="p-2 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(origin.id)}
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
                  <td colSpan={5} className="px-6 py-12 text-center text-stone-400 italic">
                    Nenhuma origem encontrada.
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
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-stone-200">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <h3 className="text-lg font-bold text-stone-800">
                {editingId ? 'Editar Origem' : 'Nova Origem / Fazenda'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-6 max-h-[85vh] overflow-y-auto">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Nome da Fazenda</label>
                <input 
                  type="text" required
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                  value={form.farm_name}
                  onChange={e => setForm({...form, farm_name: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Nome do Produtor</label>
                <input 
                  type="text" required
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                  value={form.producer_name}
                  onChange={e => setForm({...form, producer_name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Município</label>
                  <input 
                    type="text" required
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                    value={form.city}
                    onChange={e => setForm({...form, city: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Estado (UF)</label>
                  <input 
                    type="text" required maxLength={2}
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                    value={form.state}
                    onChange={e => setForm({...form, state: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Vincular ao Cliente</label>
                <select 
                  required
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                  value={form.client_id}
                  onChange={e => setForm({...form, client_id: e.target.value})}
                >
                  <option value="">Selecione um cliente</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
                >
                  <Save size={20} />
                  {editingId ? 'Atualizar Registro' : 'Salvar Registro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
