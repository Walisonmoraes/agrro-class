import React, { useState, useEffect } from 'react'
import { Search, Filter, Plus, FileText } from 'lucide-react'
import LaudoCard from '../components/LaudoCard'
import PDFButton from '../components/PDFButton'
import { LaudoData } from '../services/pdfService'

// Dados de exemplo
const laudosExample: LaudoData[] = [
  {
    laudo_number: 'LAUDO/2024/001',
    classification_date: '2024-03-15',
    client_name: 'Fazenda Boa Vista',
    product_name: 'Soja',
    origin_name: 'Fazenda Boa Vista - Ribeirão Preto/SP',
    destination_name: 'Porto de Santos',
    embarkation_point_name: 'Terminal 1 - Santos',
    sample_number: 1,
    bag_number: 150,
    weight: 60.5,
    classification_result: {
      umidade: '12.5%',
      impurezas: '1.2%',
      ardidos: '0.8%',
      classificacao: 'Tipo 1'
    },
    observations: 'Amostra coletada conforme padrão ABNT',
    classifier_name: 'João Silva',
    status: 'APPROVED'
  },
  {
    laudo_number: 'LAUDO/2024/002',
    classification_date: '2024-03-14',
    client_name: 'Agro Norte S/A',
    product_name: 'Milho',
    origin_name: 'Agro Norte - Goiânia/GO',
    destination_name: 'Porto de Paranaguá',
    embarkation_point_name: 'Terminal 2 - Paranaguá',
    sample_number: 2,
    bag_number: 200,
    weight: 58.0,
    classification_result: {
      umidade: '13.2%',
      impurezas: '2.1%',
      ardidos: '1.5%',
      classificacao: 'Tipo 2'
    },
    observations: 'Apresentou alta umidade, recomendado secagem',
    classifier_name: 'Maria Santos',
    status: 'PENDING'
  }
]

export const LaudosPage: React.FC = () => {
  const [laudos, setLaudos] = useState<LaudoData[]>(laudosExample)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(false)

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Laudos de Classificação</h1>
              <p className="text-sm text-gray-600 mt-1">Gerencie e visualize todos os laudos emitidos</p>
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus size={20} />
              <span>Novo Laudo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por número, cliente ou produto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Filtro de Status */}
            <div className="w-full sm:w-48">
              <div className="relative">
                <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  <option value="all">Todos Status</option>
                  <option value="DRAFT">Rascunho</option>
                  <option value="PENDING">Pendente</option>
                  <option value="APPROVED">Aprovado</option>
                  <option value="REJECTED">Rejeitado</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Laudos */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredLaudos.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum laudo encontrado</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tente ajustar os filtros para encontrar o que procura.'
                : 'Comece emitindo seu primeiro laudo de classificação.'
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredLaudos.map((laudo) => (
              <LaudoCard
                key={laudo.laudo_number}
                laudo={laudo}
              />
            ))}
          </div>
        )}
      </div>

      {/* Botão Flutuante para PDF Rápido */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => {
            if (filteredLaudos.length > 0) {
              handleGeneratePDF(filteredLaudos[0])
            }
          }}
          className="inline-flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-105"
          title="Gerar PDF do primeiro laudo"
        >
          <FileText size={20} />
          <span>PDF</span>
        </button>
      </div>
    </div>
  )
}

export default LaudosPage
