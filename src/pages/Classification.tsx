import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  CheckCircle, 
  Plus, 
  Search, 
  FileText, 
  Calendar, 
  Truck, 
  Weight, 
  Info,
  ChevronRight,
  ChevronLeft,
  X,
  AlertCircle,
  ClipboardCheck
} from 'lucide-react';
import { apiFetch } from '../services/api';
import { motion, AnimatePresence } from 'motion/react';

interface ClassificationProps {
  osId: number | null;
  onBack: () => void;
}

export const Classification = ({ osId: initialOsId, onBack }: ClassificationProps) => {
  const [reports, setReports] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(!!initialOsId);
  const [step, setStep] = useState(1);
  const [serviceOrders, setServiceOrders] = useState<any[]>([]);
  const [classifiers, setClassifiers] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    os_id: initialOsId || '',
    classifier_id: '',
    date: new Date().toISOString().split('T')[0],
    license_plate: '',
    weight_kg: '',
    carrier: '',
    invoice_url: '',
    test_type: 'Convencional',
    live_insects: 'Não',
    dead_insects: 'Não',
    odor: 'Não',
    toxicity: 'Não',
    burnt_and_scorched: '',
    scorched: '',
    moldy: '',
    fermented: '',
    germinated: '',
    shriveled: '',
    damaged_total: '',
    immature: '',
    humidity: '',
    impurities: '',
    greenish: '',
    broken_crushed: '',
    observations: ''
  });

  useEffect(() => {
    fetchReports();
    fetchInitialData();
  }, []);

  const fetchReports = async () => {
    const data = await apiFetch('/api/classification');
    setReports(data);
  };

  const fetchInitialData = async () => {
    const [osData, userData] = await Promise.all([
      apiFetch('/api/service-orders'),
      apiFetch('/api/users') // Assuming this endpoint exists and returns classifiers
    ]);
    setServiceOrders(osData.filter((os: any) => os.status === 'OPEN' || os.status === 'ANALYZING'));
    setClassifiers(userData || []);
  };

  const handleSubmit = async () => {
    try {
      await apiFetch('/api/classification', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setIsModalOpen(false);
      fetchReports();
      if (initialOsId) onBack();
    } catch (error) {
      console.error('Error saving classification:', error);
    }
  };

  const nextStep = () => setStep(2);
  const prevStep = () => setStep(1);

  const testOptions = [
    'Convencional', 
    'Transgênica', 
    'Declarado Intacta', 
    'Intacta Positivo', 
    'Intacta Negativo', 
    'Armazém Participante', 
    'Não Testado'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">Laudos de Classificação</h2>
          <p className="text-stone-500">Gerencie e registre as análises técnicas dos grãos.</p>
        </div>
        <button 
          onClick={() => {
            setFormData({ ...formData, os_id: initialOsId || '' });
            setIsModalOpen(true);
            setStep(1);
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-emerald-600/20"
        >
          <Plus size={20} /> Novo Laudo
        </button>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200">
                <th className="p-4 text-xs font-bold text-stone-400 uppercase tracking-widest">O.S.</th>
                <th className="p-4 text-xs font-bold text-stone-400 uppercase tracking-widest">Cliente / Produto</th>
                <th className="p-4 text-xs font-bold text-stone-400 uppercase tracking-widest">Data / Placa</th>
                <th className="p-4 text-xs font-bold text-stone-400 uppercase tracking-widest">Classificação</th>
                <th className="p-4 text-xs font-bold text-stone-400 uppercase tracking-widest">Classificador</th>
                <th className="p-4 text-xs font-bold text-stone-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-stone-50 transition-colors group">
                  <td className="p-4">
                    <span className="font-mono font-bold text-emerald-600">#{report.os_number}</span>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-stone-800">{report.client_name}</div>
                    <div className="text-xs text-stone-500">{report.product_name}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-stone-700">{new Date(report.date).toLocaleDateString('pt-BR')}</div>
                    <div className="text-xs font-mono text-stone-400">{report.license_plate}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      report.final_classification === 'Tipo 1' ? 'bg-emerald-100 text-emerald-700' :
                      report.final_classification === 'Tipo 2' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {report.final_classification}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-stone-700">{report.classifier_name}</div>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 text-stone-400 hover:text-emerald-600 transition-colors">
                      <FileText size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-stone-400 italic">
                    Nenhum laudo registrado até o momento.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-6xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-stone-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <ClipboardCheck size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-stone-900">
                      {step === 1 ? 'Registrar Laudo' : 'Classificação e Teste'}
                    </h3>
                    <p className="text-stone-500 text-sm">Etapa {step} de 2</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setIsModalOpen(false); if (initialOsId) onBack(); }}
                  className="p-3 hover:bg-stone-100 rounded-2xl transition-colors text-stone-400"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  {/* Form Area */}
                  <div className="lg:col-span-2 space-y-8">
                    {step === 1 ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-700">Ordem de Serviço:</label>
                            <select 
                              className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:border-emerald-500 transition-all"
                              value={formData.os_id}
                              onChange={e => setFormData({...formData, os_id: e.target.value})}
                            >
                              <option value="">Selecione</option>
                              {serviceOrders.map(os => (
                                <option key={os.id} value={os.id}>O.S. #{os.os_number} - {os.client_name}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-700">Classificador(a) Relacionado(a):</label>
                            <select 
                              className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:border-emerald-500 transition-all"
                              value={formData.classifier_id}
                              onChange={e => setFormData({...formData, classifier_id: e.target.value})}
                            >
                              <option value="">Selecione</option>
                              {classifiers.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-700">Data:</label>
                            <input 
                              type="date"
                              className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:border-emerald-500 transition-all"
                              value={formData.date}
                              onChange={e => setFormData({...formData, date: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-700">Placa:</label>
                            <input 
                              type="text"
                              placeholder="Ex: ABC-1234"
                              className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:border-emerald-500 transition-all"
                              value={formData.license_plate}
                              onChange={e => setFormData({...formData, license_plate: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-700">Peso (kg):</label>
                            <input 
                              type="number"
                              placeholder="0.00"
                              className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:border-emerald-500 transition-all"
                              value={formData.weight_kg}
                              onChange={e => setFormData({...formData, weight_kg: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-700">Transportadora:</label>
                            <input 
                              type="text"
                              placeholder="Nome da empresa"
                              className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:border-emerald-500 transition-all"
                              value={formData.carrier}
                              onChange={e => setFormData({...formData, carrier: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-bold text-stone-700">Nota Fiscal:</label>
                          <div className="flex items-center gap-4 p-4 bg-stone-50 border-2 border-dashed border-stone-200 rounded-2xl hover:border-emerald-500 transition-all cursor-pointer group">
                            <div className="w-10 h-10 bg-white border border-stone-200 rounded-xl flex items-center justify-center text-stone-400 group-hover:text-emerald-500 transition-colors">
                              <Plus size={20} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-stone-700">Escolher arquivo</p>
                              <p className="text-xs text-stone-400">Nenhum arquivo escolhido</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {/* Technical Selects */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-700">Teste:</label>
                            <select 
                              className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:border-emerald-500 transition-all"
                              value={formData.test_type}
                              onChange={e => setFormData({...formData, test_type: e.target.value})}
                            >
                              {testOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-700">Insetos Vivos:</label>
                            <select 
                              className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:border-emerald-500 transition-all"
                              value={formData.live_insects}
                              onChange={e => setFormData({...formData, live_insects: e.target.value})}
                            >
                              <option value="Não">Não</option>
                              <option value="Sim">Sim</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-700">Insetos Mortos:</label>
                            <select 
                              className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:border-emerald-500 transition-all"
                              value={formData.dead_insects}
                              onChange={e => setFormData({...formData, dead_insects: e.target.value})}
                            >
                              <option value="Não">Não</option>
                              <option value="Sim">Sim</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-700">Odor:</label>
                            <select 
                              className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:border-emerald-500 transition-all"
                              value={formData.odor}
                              onChange={e => setFormData({...formData, odor: e.target.value})}
                            >
                              <option value="Não">Não</option>
                              <option value="Sim">Sim</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-700">Toxicidade:</label>
                            <select 
                              className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:border-emerald-500 transition-all"
                              value={formData.toxicity}
                              onChange={e => setFormData({...formData, toxicity: e.target.value})}
                            >
                              <option value="Não">Não</option>
                              <option value="Sim">Sim</option>
                            </select>
                          </div>
                        </div>

                        {/* Percentages Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-stone-700">Ardidos e Queimados: (%)</label>
                              <input 
                                type="number" step="0.01"
                                className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:border-emerald-500 transition-all"
                                value={formData.burnt_and_scorched}
                                onChange={e => setFormData({...formData, burnt_and_scorched: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-stone-700">Queimados: (%)</label>
                              <input 
                                type="number" step="0.01"
                                className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:border-emerald-500 transition-all"
                                value={formData.scorched}
                                onChange={e => setFormData({...formData, scorched: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-stone-700">Mofados: (%)</label>
                              <input 
                                type="number" step="0.01"
                                className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:border-emerald-500 transition-all"
                                value={formData.moldy}
                                onChange={e => setFormData({...formData, moldy: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-stone-700">Fermentados: (%)</label>
                              <input 
                                type="number" step="0.01"
                                className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:border-emerald-500 transition-all"
                                value={formData.fermented}
                                onChange={e => setFormData({...formData, fermented: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-stone-700">Germinados: (%)</label>
                              <input 
                                type="number" step="0.01"
                                className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:border-emerald-500 transition-all"
                                value={formData.germinated}
                                onChange={e => setFormData({...formData, germinated: e.target.value})}
                              />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-stone-700">Umidade: (%)</label>
                              <input 
                                type="number" step="0.01"
                                className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:border-emerald-500 transition-all"
                                value={formData.humidity}
                                onChange={e => setFormData({...formData, humidity: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-stone-700">Mat. Estranhas e Impurezas: (%)</label>
                              <input 
                                type="number" step="0.01"
                                className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:border-emerald-500 transition-all"
                                value={formData.impurities}
                                onChange={e => setFormData({...formData, impurities: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-stone-700">Esverdeados: (%)</label>
                              <input 
                                type="number" step="0.01"
                                className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:border-emerald-500 transition-all"
                                value={formData.greenish}
                                onChange={e => setFormData({...formData, greenish: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-stone-700">Partido/Quebrado/Amassado: (%)</label>
                              <input 
                                type="number" step="0.01"
                                className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:border-emerald-500 transition-all"
                                value={formData.broken_crushed}
                                onChange={e => setFormData({...formData, broken_crushed: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-stone-700">Chochos: (%)</label>
                              <input 
                                type="number" step="0.01"
                                className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:border-emerald-500 transition-all"
                                value={formData.shriveled}
                                onChange={e => setFormData({...formData, shriveled: e.target.value})}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-bold text-stone-700">Observações:</label>
                          <textarea 
                            rows={3}
                            className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:border-emerald-500 transition-all resize-none"
                            value={formData.observations}
                            onChange={e => setFormData({...formData, observations: e.target.value})}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Info Sidebar */}
                  <div className="space-y-6">
                    <div className="bg-amber-50 p-8 rounded-[2rem] border border-amber-100 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 text-amber-200 opacity-20">
                        <Info size={80} />
                      </div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-amber-200 text-amber-700 rounded-xl flex items-center justify-center">
                          <AlertCircle size={20} />
                        </div>
                        <h4 className="font-bold text-amber-900">
                          {step === 1 ? 'Informações Importantes' : 'Padronizado pela IN nº 60/2011'}
                        </h4>
                      </div>
                      
                      <div className="space-y-6 text-sm text-amber-900/80 leading-relaxed">
                        {step === 1 ? (
                          <>
                            <p><strong>Registro:</strong> os laudos são feitos habitualmente pelo aplicativo mobile. Mas por aqui também é possível gerar o Laudo quando for necessário.</p>
                            <p><strong>Etapas:</strong> os formulários estão organizados em 2 etapas. Primeiro preencha com esses parâmetros e em seguida preencha com os dados da Classificação e Teste.</p>
                            <p><strong>Requisitos:</strong> esteja munido de todos os dados da Classificação e Teste, dados do embarque e referências da ordem de serviço antes de iniciar o registro do laudo.</p>
                            <p><strong>Peso:</strong> está definido em quilos para maior controle. Atenção para o preenchimento correto.</p>
                            <p><strong>Campos obrigatórios:</strong> todos os campos são de preenchimento obrigatório, exceto os campos Transportadora e Nota Fiscal, estes podem ficar sem preenchimento e preenchê-los depois.</p>
                          </>
                        ) : (
                          <>
                            <p><strong>Umidade:</strong> os laudos são feitos habitualmente pelo aplicativo mobile. Mas por aqui também é possível gerar o Laudo quando for necessário.</p>
                            <p><strong>Matérias Estranhas e Impurezas:</strong> são resíduos e partes que não são grãos perfeitos, separados por peneiras e não podendo ultrapassar até 5% conforme o tipo do produto. Limite de 5.00%</p>
                            <p><strong>Ardidos:</strong> grãos ou pedaços escurecidos por calor, umidade ou fermentação avançada, e seu limite varia conforme o tipo, podendo chegar até 4.00%.</p>
                            <p><strong>Mofados:</strong> grãos que apresentam mofo visível ou coloração esverdeada/azulada causada por fungos, sendo somados aos avariados e limitados até 3.00%.</p>
                            <p><strong>Fermentados:</strong> grãos com escurecimento parcial do germe ou endosperma causado por processo fermentativo ou calor, sendo classificados como avariados e somados ao total de defeitos, com limite de até 3.00%.</p>
                            <button className="text-emerald-700 font-bold hover:underline flex items-center gap-1">
                              Ver mais <ChevronRight size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-8 border-t border-stone-100 bg-stone-50 flex items-center justify-between sticky bottom-0 z-10">
                <button 
                  onClick={() => { setIsModalOpen(false); if (initialOsId) onBack(); }}
                  className="px-8 py-4 text-stone-500 font-bold hover:text-stone-800 transition-colors"
                >
                  Cancelar
                </button>
                <div className="flex items-center gap-4">
                  {step === 2 && (
                    <button 
                      onClick={prevStep}
                      className="px-8 py-4 bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold rounded-2xl flex items-center gap-2 transition-all"
                    >
                      <ChevronLeft size={20} /> Voltar
                    </button>
                  )}
                  <button 
                    onClick={step === 1 ? nextStep : handleSubmit}
                    className="px-12 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
                  >
                    {step === 1 ? (
                      <>Próximo Passo <ChevronRight size={20} /></>
                    ) : (
                      <>Salvar Laudo <CheckCircle size={20} /></>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
