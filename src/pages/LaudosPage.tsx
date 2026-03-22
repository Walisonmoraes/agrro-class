import React, { useState, useEffect } from 'react'
import { Search, Filter, Plus, FileText, Calendar, ClipboardCheck } from 'lucide-react'
import LaudoCard from '../components/LaudoCard'
import PDFButton from '../components/PDFButton'
import { LaudoData } from '../services/pdfService'
import { apiFetch } from '../services/api'

export const LaudosPage: React.FC = () => {
  const [laudos, setLaudos] = useState<LaudoData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadLaudos()
  }, [])

  const loadLaudos = async () => {
    try {
      setIsLoading(true)
      const reports = await apiFetch('/api/classification')
      
      // Transformar dados do banco para o formato esperado pelo componente
      const formattedLaudos: LaudoData[] = reports.map((report: any) => ({
        laudo_number: `LAUDO/2024/${report.id.toString().padStart(3, '0')}`,
        classification_date: report.date || new Date().toISOString().split('T')[0],
        client_name: report.client_name || 'Cliente não informado',
        product_name: report.product_name || 'Produto não informado',
        origin_name: 'Origem não informada',
        destination_name: 'Destino não informado',
        embarkation_point_name: 'Embarque não informado',
        sample_number: report.sample_number || 1,
        bag_number: report.bag_number || 100,
        weight: report.weight_kg || 60.0,
        classification_result: {
          umidade: report.humidity ? `${report.humidity}%` : '12.5%',
          impurezas: report.impurities ? `${report.impurities}%` : '1.2%',
          ardidos: report.damaged_total ? `${report.damaged_total}%` : '0.8%',
          classificacao: report.final_classification || 'Tipo 1'
        },
        observations: report.observations || 'Laudo emitido conforme análise técnica',
        classifier_name: report.classifier_name || 'Classificador não informado',
        status: 'APPROVED' // Todos os laudos no banco estão aprovados
      }))
      
      setLaudos(formattedLaudos)
    } catch (error) {
      console.error('Erro ao carregar laudos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredLaudos = laudos.filter(laudo => {
    const matchesSearch = laudo.laudo_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        laudo.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        laudo.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || laudo.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleGeneratePDF = async (laudo: LaudoData) => {
    try {
      const { generateLaudoPDF } = await import('../services/pdfService')
      await generateLaudoPDF(laudo)
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Header Moderno */}
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
                  <p className="text-slate-500 font-medium">Gerencie e visualize todos os laudos emitidos</p>
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
              
              <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 flex items-center gap-2 font-medium">
                <Plus size={18} />
                Novo Laudo
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">
        {/* Filtros Modernos */}
      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-lg shadow-slate-200/25 p-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por número, cliente ou produto..."
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-slate-900 placeholder-slate-400"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <select
            className="px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-slate-900 font-medium"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos Status</option>
            <option value="aprovado">Aprovados</option>
            <option value="pendente">Pendentes</option>
            <option value="reprovado">Reprovados</option>
          </select>
        </div>
      </div>

      {/* Container de Laudos */}
      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-lg shadow-slate-200/25 overflow-hidden">
        <div className="p-8 border-b border-slate-200/60">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <ClipboardCheck className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Lista de Laudos</h2>
              <p className="text-slate-500 mt-1">Todos os laudos emitidos pelo sistema</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : filteredLaudos.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardCheck className="mx-auto text-slate-300 size-12 mb-4" />
              <p className="text-slate-500">Nenhum laudo encontrado</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLaudos.map((laudo) => (
                <LaudoCard
                  key={laudo.laudo_number}
                  laudo={laudo}
                  onGeneratePDF={handleGeneratePDF}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default LaudosPage
