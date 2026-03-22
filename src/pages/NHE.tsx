import React, { useState, useEffect } from 'react';
import { Plus, Search, FileSpreadsheet, Calendar, Download, Trash2, Edit2, Eye, Upload } from 'lucide-react';
import { apiFetch } from '../services/api';

export const NHE = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    file_url: '',
    category: '',
    upload_date: ''
  });

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      // Simulando dados - substituir com API real
      const mockData = [
        {
          id: 1,
          title: 'Relatório Mensal de Classificação',
          description: 'Planilha com todos os laudos emitidos no mês',
          file_url: '/documents/relatorio-mensal.xlsx',
          category: 'Relatórios',
          upload_date: '2024-01-15',
          size: '2.4 MB'
        },
        {
          id: 2,
          title: 'Controle de Estoque',
          description: 'Planilha de controle de entrada e saída de grãos',
          file_url: '/documents/estoque.xlsx',
          category: 'Estoque',
          upload_date: '2024-01-10',
          size: '1.8 MB'
        },
        {
          id: 3,
          title: 'Análise de Qualidade',
          description: 'Dados históricos de análises de qualidade',
          file_url: '/documents/qualidade.xlsx',
          category: 'Análises',
          upload_date: '2024-01-08',
          size: '3.2 MB'
        }
      ];
      setDocuments(mockData);
    } catch (err) {
      console.error('Erro ao carregar documentos', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        // await apiFetch(`/api/nhe/${editingId}`, {
        //   method: 'PUT',
        //   body: JSON.stringify(form)
        // });
      } else {
        // await apiFetch('/api/nhe', {
        //   method: 'POST',
        //   body: JSON.stringify(form)
        // });
      }
      
      setShowModal(false);
      setEditingId(null);
      setForm({ title: '', description: '', file_url: '', category: '', upload_date: '' });
      loadDocuments();
    } catch (err) {
      console.error('Erro ao salvar documento', err);
    }
  };

  const handleEdit = (doc: any) => {
    setEditingId(doc.id);
    setForm({
      title: doc.title,
      description: doc.description,
      file_url: doc.file_url,
      category: doc.category,
      upload_date: doc.upload_date
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este documento?')) {
      try {
        // await apiFetch(`/api/nhe/${id}`, { method: 'DELETE' });
        setDocuments(documents.filter(doc => doc.id !== id));
      } catch (err) {
        console.error('Erro ao excluir documento', err);
      }
    }
  };

  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchTerm.toLowerCase())
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
                  <FileSpreadsheet className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    NHE
                  </h1>
                  <p className="text-slate-500 font-medium">Gestão de planilhas e documentos</p>
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
                onClick={() => {
                  setEditingId(null);
                  setForm({ title: '', description: '', file_url: '', category: '', upload_date: '' });
                  setShowModal(true);
                }}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 flex items-center gap-2 font-medium"
              >
                <Plus size={18} />
                Novo Documento
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
                <FileSpreadsheet className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Documentos e Planilhas</h2>
                <p className="text-slate-500 mt-1">Todos os documentos gerenciados pelo sistema</p>
              </div>
            </div>
          </div>
          
          <div className="p-8 border-b border-slate-200/60">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Pesquisar documentos..." 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 transition-all text-sm"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="p-8">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
                <p className="text-slate-500 mt-4">Carregando documentos...</p>
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="text-center py-12">
                <FileSpreadsheet className="mx-auto text-slate-300 size-12 mb-4" />
                <p className="text-slate-500">Nenhum documento encontrado</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments.map((doc) => (
                  <div key={doc.id} className="bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-lg hover:shadow-slate-200/25 transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                        <FileSpreadsheet className="text-white" size={20} />
                      </div>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                        {doc.category}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-slate-900 mb-2">{doc.title}</h3>
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">{doc.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                      <span>{doc.size}</span>
                      <span>{new Date(doc.upload_date).toLocaleDateString('pt-BR')}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="flex-1 px-3 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1 text-sm">
                        <Download size={14} />
                        Baixar
                      </button>
                      <button 
                        onClick={() => handleEdit(doc)}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(doc.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8 border-b border-slate-200/60">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">
                  {editingId ? 'Editar Documento' : 'Novo Documento'}
                </h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <Trash2 size={20} className="text-slate-400" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Título</label>
                <input 
                  type="text"
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                  value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Descrição</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-all resize-none"
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Categoria</label>
                <select 
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                  value={form.category}
                  onChange={e => setForm({...form, category: e.target.value})}
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="Relatórios">Relatórios</option>
                  <option value="Estoque">Estoque</option>
                  <option value="Análises">Análises</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Arquivo</label>
                <div className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-all flex items-center gap-2">
                  <Upload size={16} className="text-slate-400" />
                  <input 
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    className="flex-1 outline-none bg-transparent"
                    onChange={e => setForm({...form, file_url: e.target.files?.[0]?.name || ''})}
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:from-emerald-600 hover:to-emerald-700"
                >
                  <Plus size={20} />
                  {editingId ? 'Atualizar Documento' : 'Salvar Documento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
