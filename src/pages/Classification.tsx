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
  ClipboardCheck,
  Edit,
  Download,
  Trash2
} from 'lucide-react';
import { apiFetch } from '../services/api';
import { motion, AnimatePresence } from 'motion/react';
import PDFViewerModal from '../components/PDFViewerModal';
import ViewPDFButton from '../components/ViewPDFButton';

// Função para gerar PDF
const generatePDFFromReport = async (report: any) => {
  console.log('=== INÍCIO DA GERAÇÃO DO PDF CORPORATIVO V3 ===')
  console.log('Dados do relatório:', report)
  
  try {
    // Importar o serviço de PDF corporativo V3
    const { generateCorporatePDFV3 } = await import('../services/corporatePDFServiceV3')
    console.log('✅ Serviço PDF corporativo V3 importado com sucesso')
    
    // Preparar dados no formato esperado
    const laudoData = {
      id: String(report.id || 'LAUDO-' + Date.now()),
      created_at: String(report.created_at || new Date().toISOString()),
      os_id: String(report.os_id || 'N/A'),
      classifier_name: String(report.classifier_name || 'N/A'),
      final_classification: String(report.final_classification || 'NÃO CLASSIFICADO'),
      moisture: String(report.moisture || 'N/A'),
      impurities: String(report.impurities || 'N/A'),
      burnt: String(report.burnt || 'N/A'),
      charcoal: String(report.charcoal || 'N/A'),
      fermented: String(report.fermented || 'N/A'),
      moldy: String(report.moldy || 'N/A'),
      germinated: String(report.germinated || 'N/A'),
      license_plate: String(report.license_plate || 'N/A'),
      carrier: String(report.carrier || 'N/A'),
      weight_kg: String(report.weight_kg || 'N/A'),
      test_type: String(report.test_type || 'N/A'),
      client_name: String(report.client_name || 'Cliente não informado'),
      product_name: String(report.product_name || 'Produto não informado'),
      origin: String(report.origin || 'Origem não informada'),
      destination: String(report.destination || 'Destino não informado'),
      damaged: String(report.damaged || 'N/A'),
      immature: String(report.immature || 'N/A'),
      fragments: String(report.fragments || 'N/A'),
      insect_damage: String(report.insect_damage || 'N/A')
    }
    
    console.log('✅ Dados preparados:', laudoData)
    
    // Gerar o PDF corporativo V3
    const pdfData = await generateCorporatePDFV3(laudoData)
    
    // Converter data URL para blob e baixar
    const link = document.createElement('a')
    link.href = pdfData
    link.download = `LAUDO_CORPORATIVO_V3_${laudoData.id.replace(/\//g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    console.log('✅ PDF corporativo V3 gerado e baixado')
    
  } catch (error) {
    console.error('❌ Erro ao gerar PDF corporativo V3:', error)
    alert('Erro ao gerar PDF: ' + error.message)
  }
  
  console.log('=== FIM DA GERAÇÃO DO PDF ===')
}

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
  const [editingReportId, setEditingReportId] = useState<string | null>(null);
  
  // Estados para o modal de visualização de PDF
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
  const [pdfData, setPdfData] = useState<string | null>(null);
  const [pdfFileName, setPdfFileName] = useState('');
  
  // Função para editar laudo
  const editReport = (report: any) => {
    console.log('=== INÍCIO DA EDIÇÃO DO LAUDO ===')
    console.log('Dados do relatório:', report)
    
    try {
      // Preencher o formulário com os dados do relatório usando os nomes corretos dos campos
      setFormData({
        os_id: report.os_id,
        classifier_id: report.classifier_id,
        date: report.date || '',
        license_plate: report.license_plate || '',
        weight_kg: report.weight_kg || '',
        carrier: report.carrier || '',
        invoice_url: report.invoice_url || '',
        test_type: report.test_type || '',
        live_insects: report.live_insects || '',
        dead_insects: report.dead_insects || '',
        odor: report.odor || '',
        toxicity: report.toxicity || '',
        burnt_and_scorched: report.burnt_and_scorched || '',
        scorched: report.scorched || '',
        moldy: report.moldy || '',
        fermented: report.fermented || '',
        germinated: report.germinated || '',
        shriveled: report.shriveled || '',
        damaged_total: report.damaged_total || '',
        immature: report.immature || '',
        humidity: report.humidity || '',
        impurities: report.impurities || '',
        greenish: report.greenish || '',
        broken_crushed: report.broken_crushed || '',
        observations: report.observations || '',
        final_classification: report.final_classification || ''
      });
      
      // Abrir o modal para edição
      setIsModalOpen(true)
      setStep(1)
      
      // Armazenar o ID do relatório sendo editado
      setEditingReportId(report.id.toString())
      
      console.log('✅ Formulário preenchido para edição')
      
    } catch (error) {
      console.error('❌ Erro ao preparar edição:', error)
      alert('Erro ao preparar edição: ' + error.message)
    }
    
    console.log('=== FIM DA EDIÇÃO ===')
  }

  // Função para deletar laudo
  const deleteReport = async (reportId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este laudo? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      await apiFetch(`/api/reports/${reportId}`, {
        method: 'DELETE'
      });
      
      // Recarregar a lista de laudos
      fetchReports();
      
      alert('Laudo excluído com sucesso!');
    } catch (error: any) {
      console.error('Erro ao excluir laudo:', error);
      alert('Erro ao excluir laudo: ' + (error.message || 'Erro desconhecido'));
    }
  };
  
  // Função para abrir modal de visualização de PDF
  const openPDFModal = (data: string, fileName: string) => {
    setPdfData(data)
    setPdfFileName(fileName)
    setIsPDFModalOpen(true)
  }
  
  // Função para fechar modal de PDF
  const closePDFModal = () => {
    setIsPDFModalOpen(false)
    setPdfData(null)
    setPdfFileName('')
  }
  
  const [formData, setFormData] = useState({
    os_id: initialOsId || '',
    classifier_id: '',
    date: '', // Campo vazio para forçar o usuário a selecionar a data
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
    observations: '',
    final_classification: '', // Campo adicionado
    discounts_json: '' // Campo adicionado
  });

  useEffect(() => {
    fetchReports();
    fetchInitialData();
  }, []);

  const fetchReports = async () => {
    const data = await apiFetch('/api/classification');
    setReports(data);
  };

  // Check if there's an existing classification for the initialOsId
  useEffect(() => {
    // Only check for existing reports if we're in edit mode (modal auto-opened with initialOsId)
    if (initialOsId && reports.length > 0 && isModalOpen) {
      const existingReport = reports.find(report => report.os_id === initialOsId);
      if (existingReport) {
        // If there's an existing report, open it in edit mode
        editReport(existingReport);
        setEditingReportId(existingReport.id.toString());
      }
    }
  }, [initialOsId, reports, isModalOpen]);

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
      // Calcular classificação final com base na umidade e impurezas
      let finalClassification = "Tipo 1";
      const humidity = parseFloat(formData.humidity) || 0;
      const impurities = parseFloat(formData.impurities) || 0;
      
      if (humidity > 14 || impurities > 1) finalClassification = "Tipo 2";
      if (humidity > 16 || impurities > 2) finalClassification = "Fora de Padrão";

      // Calcular descontos
      const discounts = {
        humidity: humidity > 14 ? (humidity - 14) * 1.5 : 0,
        impurities: impurities > 1 ? (impurities - 1) : 0
      };

      // Preparar dados completos para envio - permitir valores vazios
      const completeFormData = {
        os_id: formData.os_id ? parseInt(formData.os_id) : null,
        classifier_id: formData.classifier_id ? parseInt(formData.classifier_id) : null,
        date: formData.date || new Date().toISOString().split('T')[0], // Data atual se for undefined
        license_plate: formData.license_plate || '',
        weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
        carrier: formData.carrier || '',
        invoice_url: formData.invoice_url || '',
        test_type: formData.test_type || '',
        live_insects: formData.live_insects || '',
        dead_insects: formData.dead_insects || '',
        odor: formData.odor || '',
        toxicity: formData.toxicity || '',
        burnt_and_scorched: formData.burnt_and_scorched ? parseFloat(formData.burnt_and_scorched) : null,
        scorched: formData.scorched ? parseFloat(formData.scorched) : null,
        moldy: formData.moldy ? parseFloat(formData.moldy) : null,
        fermented: formData.fermented ? parseFloat(formData.fermented) : null,
        germinated: formData.germinated ? parseFloat(formData.germinated) : null,
        shriveled: formData.shriveled ? parseFloat(formData.shriveled) : null,
        damaged_total: formData.damaged_total ? parseFloat(formData.damaged_total) : null,
        immature: formData.immature ? parseFloat(formData.immature) : null,
        humidity: formData.humidity ? parseFloat(formData.humidity) : null,
        impurities: formData.impurities ? parseFloat(formData.impurities) : null,
        greenish: formData.greenish ? parseFloat(formData.greenish) : null,
        broken_crushed: formData.broken_crushed ? parseFloat(formData.broken_crushed) : null,
        observations: formData.observations || '',
        final_classification: finalClassification || '',
        discounts_json: discounts ? JSON.stringify(discounts) : '{}',
        signature_date: new Date().toISOString()
      };

      console.log('📝 Frontend - Campos enviados:', Object.keys(completeFormData));
      console.log('📝 Frontend - Total de campos:', Object.keys(completeFormData).length);
      console.log('📝 Frontend - Dados completos:', completeFormData);
      console.log('📝 Frontend - Editando report ID:', editingReportId);

      // Use POST for both create and update - backend handles the logic
      await apiFetch('/api/classification', {
        method: 'POST',
        body: JSON.stringify(completeFormData)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Header Moderno - Estilo Billing */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <ClipboardCheck className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Laudos de Classificação
                  </h1>
                  <p className="text-slate-500 font-medium">Gerencie e registre as análises técnicas dos grãos</p>
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
                  // Reset form to initial empty state when creating new classification
                  setFormData({
                    os_id: initialOsId || '',
                    classifier_id: '',
                    date: '',
                    license_plate: '',
                    weight_kg: '',
                    carrier: '',
                    invoice_url: '',
                    test_type: '',
                    live_insects: '',
                    dead_insects: '',
                    odor: '',
                    toxicity: '',
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
                    observations: '',
                    final_classification: '',
                    discounts_json: ''
                  });
                  setEditingReportId(null);
                  setIsModalOpen(true);
                  setStep(1);
                }}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 flex items-center gap-2 font-medium"
              >
                <Plus size={18} />
                Novo Laudo
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">

      {/* Lista de Laudos - Estilo Billing */}
      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-lg shadow-slate-200/25 overflow-hidden">
        <div className="p-8 border-b border-slate-200/60">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <ClipboardCheck className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Histórico de Laudos</h2>
              <p className="text-slate-500 mt-1">Todos os laudos emitidos pelo sistema</p>
            </div>
          </div>
        </div>
        
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
                    <div className="flex items-center gap-2 justify-end">
                      <ViewPDFButton 
                        laudo={report}
                        onOpenModal={openPDFModal}
                      />
                      <button 
                        onClick={() => editReport(report)}
                        className="p-2 text-stone-400 hover:text-blue-600 transition-colors"
                        title="Editar Laudo"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => generatePDFFromReport(report)}
                        className="p-2 text-stone-400 hover:text-emerald-600 transition-colors"
                        title="Baixar PDF do Laudo"
                      >
                        <Download size={18} />
                      </button>
                      <button 
                        onClick={() => deleteReport(report.id)}
                        className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                        title="Excluir Laudo"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-stone-400 italic">
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
    </div>
  );
};
