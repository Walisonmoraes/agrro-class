import React from 'react'
import { X } from 'lucide-react'

interface PDFViewerModalProps {
  isOpen: boolean
  onClose: () => void
  pdfData: string | null
  fileName: string
}

export const PDFViewerModal: React.FC<PDFViewerModalProps> = ({
  isOpen,
  onClose,
  pdfData,
  fileName
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Visualização de Laudo</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {/* PDF Viewer */}
        <div className="h-[calc(90vh-80px)] bg-gray-100">
          {pdfData ? (
            <iframe
              src={pdfData}
              className="w-full h-full border-0"
              title="Visualização do PDF"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando PDF...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PDFViewerModal
