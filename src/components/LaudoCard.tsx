import React from 'react'
import { Calendar, User, Package, MapPin, FileText } from 'lucide-react'
import PDFButton from './PDFButton'
import { LaudoData } from '../services/pdfService'

interface LaudoCardProps {
  laudo: LaudoData
  className?: string
}

export const LaudoCard: React.FC<LaudoCardProps> = ({ laudo, className = '' }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'APPROVED': return 'bg-green-100 text-green-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'Rascunho'
      case 'PENDING': return 'Pendente'
      case 'APPROVED': return 'Aprovado'
      case 'REJECTED': return 'Rejeitado'
      default: return status
    }
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      {/* Cabeçalho */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{laudo.laudo_number}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Calendar size={14} className="text-gray-500" />
            <span className="text-sm text-gray-600">
              {new Date(laudo.classification_date).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(laudo.status)}`}>
            {getStatusText(laudo.status)}
          </span>
          <PDFButton 
            laudoData={laudo}
            variant="download"
            className="shrink-0"
          />
        </div>
      </div>

      {/* Informações Principais */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <User size={16} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Cliente:</span>
          <span className="text-sm text-gray-900">{laudo.client_name}</span>
        </div>

        <div className="flex items-center gap-2">
          <Package size={16} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Produto:</span>
          <span className="text-sm text-gray-900">{laudo.product_name}</span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Rota:</span>
          <span className="text-sm text-gray-900">
            {laudo.origin_name} → {laudo.destination_name}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
          <div>
            <span className="text-xs text-gray-500">Amostra</span>
            <p className="text-sm font-medium text-gray-900">#{laudo.sample_number}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Peso</span>
            <p className="text-sm font-medium text-gray-900">{laudo.weight} kg</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Saco</span>
            <p className="text-sm font-medium text-gray-900">#{laudo.bag_number}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Classificador</span>
            <p className="text-sm font-medium text-gray-900">{laudo.classifier_name}</p>
          </div>
        </div>

        {/* Resultados da Classificação */}
        {laudo.classification_result && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Resultado da Classificação</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(laudo.classification_result).slice(0, 4).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-xs text-gray-600">{key.replace(/_/g, ' ')}:</span>
                  <span className="text-xs font-medium text-gray-900">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Observações */}
        {laudo.observations && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Observações</h4>
            <p className="text-sm text-gray-600 line-clamp-2">{laudo.observations}</p>
          </div>
        )}
      </div>

      {/* Ações */}
      <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
        <PDFButton 
          laudoData={laudo}
          variant="both"
        />
      </div>
    </div>
  )
}

export default LaudoCard
