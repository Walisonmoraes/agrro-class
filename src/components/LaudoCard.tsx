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
    <div className={`group bg-white rounded-3xl border border-slate-200/60 shadow-lg shadow-slate-200/25 p-8 hover:shadow-xl hover:shadow-slate-200/30 transition-all duration-300 hover:-translate-y-1 ${className}`}>
      {/* Cabeçalho Moderno */}
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-2">
          <h3 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">{laudo.laudo_number}</h3>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Calendar className="text-white" size={14} />
            </div>
            <span className="text-sm font-medium text-slate-600">
              {new Date(laudo.classification_date).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-sm ${getStatusColor(laudo.status)}`}>
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
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <User className="text-white" size={14} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cliente</span>
            <p className="text-sm font-semibold text-slate-900">{laudo.client_name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
            <Package className="text-white" size={14} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Produto</span>
            <p className="text-sm font-semibold text-slate-900">{laudo.product_name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <MapPin className="text-white" size={14} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rota</span>
            <p className="text-sm font-semibold text-slate-900">
              {laudo.origin_name} → {laudo.destination_name}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-200/60">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Amostra</span>
            <p className="text-sm font-semibold text-slate-900">#{laudo.sample_number}</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Peso</span>
            <p className="text-sm font-semibold text-slate-900">{laudo.weight} kg</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Saco</span>
            <p className="text-sm font-semibold text-slate-900">#{laudo.bag_number}</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Classificador</span>
            <p className="text-sm font-semibold text-slate-900">{laudo.classifier_name}</p>
          </div>
        </div>

        {/* Resultados da Classificação */}
        {laudo.classification_result && (
          <div className="mt-6 pt-6 border-t border-slate-200/60">
            <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="text-white" size={12} />
              </div>
              Resultado da Classificação
            </h4>
            <div className="bg-slate-50 rounded-2xl p-4">
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(laudo.classification_result).slice(0, 4).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-2 bg-white rounded-xl border border-slate-200/60">
                    <span className="text-xs font-medium text-slate-600 capitalize">{key.replace('_', ' ')}:</span>
                    <span className="text-xs font-bold text-slate-900">{value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LaudoCard
