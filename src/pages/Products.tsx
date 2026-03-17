import React, { useState, useEffect } from 'react';
import { Plus, Search, Package, X, Save, Trash2 } from 'lucide-react';
import { apiFetch } from '../services/api';

export const Products: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ name: '' });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    apiFetch('/api/products')
      .then(setProducts)
      .catch(console.error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/api/products', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setShowModal(false);
      setFormData({ name: '' });
      loadProducts();
    } catch (error: any) {
      alert(error.message || 'Erro ao salvar produto');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    try {
      await apiFetch(`/api/products/${id}`, { method: 'DELETE' });
      loadProducts();
    } catch (error: any) {
      alert(error.message || 'Erro ao excluir produto');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-800 tracking-tight">Produtos</h1>
          <p className="text-stone-500 text-sm font-medium">Cadastre os tipos de grãos para classificação</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-emerald-600/20"
        >
          <Plus size={20} />
          Novo Produto
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="p-6 border-b border-stone-100 bg-stone-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
            <input 
              type="text"
              placeholder="Pesquisar produtos..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-2xl outline-none focus:border-emerald-500 transition-all shadow-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-stone-50 text-stone-500 text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-8 py-5">Nome do Produto</th>
                <th className="px-8 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-stone-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <Package size={20} />
                      </div>
                      <span className="font-bold text-stone-800">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-8 py-12 text-center text-stone-400 italic">
                    Nenhum produto encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden border border-stone-200 animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
              <h3 className="text-xl font-bold text-stone-800">Novo Produto</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-stone-200 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-widest ml-1">Nome do Produto</label>
                <input 
                  type="text"
                  className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
                  placeholder="Ex: Soja, Milho, Trigo..."
                  value={formData.name}
                  onChange={e => setFormData({ name: e.target.value })}
                  required
                  autoFocus
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/30 active:scale-[0.98]"
                >
                  <Save size={20} />
                  Salvar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
