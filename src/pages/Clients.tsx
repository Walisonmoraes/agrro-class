import React, { useState, useEffect } from 'react';
import { Plus, Search, MapPin, Phone, Mail, X, Save, Users, Calendar } from 'lucide-react';
import { apiFetch } from '../services/api';

export const Clients = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  
  // Form states
  const [clientForm, setClientForm] = useState({
    name: '', 
    document: '', 
    trading_name: '',
    cep: '',
    street: '',
    complement: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    phone: '', 
    email: '', 
    tariff: '',
    cadence: '',
    daily_rate: '',
    contact_person: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const c = await apiFetch('/api/clients');
    setClients(c);
  };

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/api/clients', {
        method: 'POST',
        body: JSON.stringify(clientForm)
      });
      setShowModal(false);
      setClientForm({ 
        name: '', document: '', trading_name: '', cep: '', street: '', 
        complement: '', number: '', neighborhood: '', city: '', state: '', 
        phone: '', email: '', tariff: '', cadence: '', daily_rate: '', contact_person: '' 
      });
      loadData();
    } catch (err) {
      alert('Erro ao salvar cliente');
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
                    Clientes
                  </h1>
                  <p className="text-slate-500 font-medium">Gerencie o cadastro de clientes e fornecedores</p>
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
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 flex items-center gap-2 font-medium"
              >
                <Plus size={18} />
                Novo Cliente
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">

      {/* Tabela Moderna */}
      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-lg shadow-slate-200/25 overflow-hidden">
        <div className="p-8 border-b border-slate-200/60">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Users className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Lista de Clientes</h2>
              <p className="text-slate-500 mt-1">Todos os clientes cadastrados no sistema</p>
            </div>
          </div>
        </div>
        
        <div className="p-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por nome, CNPJ/CPF..." 
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-900 placeholder-slate-400"
            />
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead className="bg-stone-50 text-stone-500 text-xs uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4">Nome / Razão Social</th>
              <th className="px-6 py-4">CPF/CNPJ</th>
              <th className="px-6 py-4">Contato</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {clients.map(client => (
              <tr key={client.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-semibold text-stone-800">{client.name}</p>
                  <p className="text-xs text-stone-500">{client.contact_person}</p>
                </td>
                <td className="px-6 py-4 text-sm text-stone-600 font-mono">{client.document}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <Phone size={12} /> {client.phone}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <Mail size={12} /> {client.email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden border border-stone-200">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <h3 className="text-lg font-bold text-stone-800">Cadastrar Cliente</h3>
              <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveClient} className="p-8 space-y-6 max-h-[85vh] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-stone-700">Razão Social:</label>
                      <input 
                        type="text" required
                        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                        value={clientForm.name}
                        onChange={e => setClientForm({...clientForm, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-stone-700">Telefone:</label>
                      <input 
                        type="text"
                        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                        value={clientForm.phone}
                        onChange={e => setClientForm({...clientForm, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-stone-700">CNPJ:</label>
                      <input 
                        type="text" required
                        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                        value={clientForm.document}
                        onChange={e => setClientForm({...clientForm, document: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-stone-700">E-mail:</label>
                      <input 
                        type="email"
                        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                        value={clientForm.email}
                        onChange={e => setClientForm({...clientForm, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-stone-700">Nome Fantasia:</label>
                      <input 
                        type="text"
                        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                        value={clientForm.trading_name}
                        onChange={e => setClientForm({...clientForm, trading_name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-stone-700">Tarifa R$ (por Tonelada):</label>
                      <input 
                        type="number" step="0.01"
                        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                        value={clientForm.tariff}
                        onChange={e => setClientForm({...clientForm, tariff: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-stone-700">CEP:</label>
                        <input 
                          type="text"
                          className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                          value={clientForm.cep}
                          onChange={e => setClientForm({...clientForm, cep: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-stone-700">Logradouro:</label>
                        <input 
                          type="text"
                          className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                          value={clientForm.street}
                          onChange={e => setClientForm({...clientForm, street: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-stone-700">Cadência (kg):</label>
                      <input 
                        type="number"
                        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                        value={clientForm.cadence}
                        onChange={e => setClientForm({...clientForm, cadence: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-stone-700">Complemento:</label>
                        <input 
                          type="text"
                          className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                          value={clientForm.complement}
                          onChange={e => setClientForm({...clientForm, complement: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-stone-700">Número:</label>
                        <input 
                          type="text"
                          className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                          value={clientForm.number}
                          onChange={e => setClientForm({...clientForm, number: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-stone-700">Diária R$:</label>
                      <input 
                        type="number" step="0.01"
                        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                        value={clientForm.daily_rate}
                        onChange={e => setClientForm({...clientForm, daily_rate: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-stone-700">Bairro:</label>
                    <input 
                      type="text"
                      className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                      value={clientForm.neighborhood}
                      onChange={e => setClientForm({...clientForm, neighborhood: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-stone-700">Município:</label>
                      <input 
                        type="text"
                        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                        value={clientForm.city}
                        onChange={e => setClientForm({...clientForm, city: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-stone-700">Estado (UF):</label>
                      <select 
                        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                        value={clientForm.state}
                        onChange={e => setClientForm({...clientForm, state: e.target.value})}
                      >
                        <option value="">Selecionar</option>
                        <option value="AC">Acre</option>
                        <option value="AL">Alagoas</option>
                        <option value="AP">Amapá</option>
                        <option value="AM">Amazonas</option>
                        <option value="BA">Bahia</option>
                        <option value="CE">Ceará</option>
                        <option value="DF">Distrito Federal</option>
                        <option value="ES">Espírito Santo</option>
                        <option value="GO">Goiás</option>
                        <option value="MA">Maranhão</option>
                        <option value="MT">Mato Grosso</option>
                        <option value="MS">Mato Grosso do Sul</option>
                        <option value="MG">Minas Gerais</option>
                        <option value="PA">Pará</option>
                        <option value="PB">Paraíba</option>
                        <option value="PR">Paraná</option>
                        <option value="PE">Pernambuco</option>
                        <option value="PI">Piauí</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="RN">Rio Grande do Norte</option>
                        <option value="RS">Rio Grande do Sul</option>
                        <option value="RO">Rondônia</option>
                        <option value="RR">Roraima</option>
                        <option value="SC">Santa Catarina</option>
                        <option value="SP">São Paulo</option>
                        <option value="SE">Sergipe</option>
                        <option value="TO">Tocantins</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-amber-50/50 border border-amber-200 p-6 rounded-2xl">
                    <div className="flex items-center gap-2 text-amber-600 mb-4">
                      <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-xs">!</div>
                      <h3 className="font-bold">Dados Financeiros</h3>
                    </div>
                    <div className="space-y-4 text-sm text-stone-600 leading-relaxed">
                      <p><strong>Tarifa:</strong> é o valor em reais cobrado por tonelada embarcada. Utilizada para gerar a fatura automaticamente. Portanto mantenha preenchido com valor atualizado.</p>
                      <p><strong>Cadência:</strong> é a quantidade mínima exigida por embarque. Quando esse mínimo não é atingido é cobrado um adicional no faturamento.</p>
                      <p><strong>Diária:</strong> taxa aplicada quando não ocorre o embarque por responsabilidade do cliente (como atrasos, falta de caminhões, problemas operacionais).</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
                >
                  <Save size={20} />
                  Salvar Registro
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

