import React from 'react'
import { FileText, Printer, Download } from 'lucide-react'
import { generateLaudoPDF, generateLaudoPDFFromHTML, printLaudo, LaudoData } from '../services/pdfService'

interface PDFButtonProps {
  laudoData: LaudoData
  elementId?: string
  variant?: 'download' | 'print' | 'both'
  className?: string
}

export const PDFButton: React.FC<PDFButtonProps> = ({
  laudoData,
  elementId,
  variant = 'download',
  className = ''
}) => {
  const handleDownloadPDF = async () => {
    try {
      if (elementId) {
        // Gera PDF a partir de elemento HTML
        await generateLaudoPDFFromHTML(elementId, laudoData.laudo_number)
      } else {
        // Gera PDF programaticamente
        await generateLaudoPDF(laudoData)
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      alert('Erro ao gerar PDF. Tente novamente.')
    }
  }

  const handlePrint = () => {
    try {
      if (elementId) {
        printLaudo(elementId)
      } else {
        // Cria um elemento temporário para impressão
        const tempId = `temp-laudo-${Date.now()}`
        const tempDiv = document.createElement('div')
        tempDiv.id = tempId
        tempDiv.style.display = 'none'
        document.body.appendChild(tempDiv)
        
        // Preenche com dados do laudo
        tempDiv.innerHTML = generateLaudoHTML(laudoData)
        
        printLaudo(tempId)
        
        // Remove elemento temporário
        setTimeout(() => {
          document.body.removeChild(tempDiv)
        }, 1000)
      }
    } catch (error) {
      console.error('Erro ao imprimir:', error)
      alert('Erro ao imprimir. Tente novamente.')
    }
  }

  const generateLaudoHTML = (data: LaudoData): string => {
    return `
      <div class="header">
        <h1>LAUDO DE CLASSIFICAÇÃO</h1>
        <p><strong>Número:</strong> ${data.laudo_number}</p>
        <p><strong>Data:</strong> ${new Date(data.classification_date).toLocaleDateString('pt-BR')}</p>
      </div>
      
      <div class="section">
        <div class="section-title">DADOS DO CLIENTE</div>
        <div class="field"><strong>Cliente:</strong> ${data.client_name}</div>
        <div class="field"><strong>Origem:</strong> ${data.origin_name}</div>
        <div class="field"><strong>Destino:</strong> ${data.destination_name}</div>
        <div class="field"><strong>Ponto de Embarque:</strong> ${data.embarkation_point_name}</div>
      </div>
      
      <div class="section">
        <div class="section-title">DADOS DO PRODUTO</div>
        <div class="field"><strong>Produto:</strong> ${data.product_name}</div>
        <div class="field"><strong>Amostra:</strong> ${data.sample_number}</div>
        <div class="field"><strong>Saco:</strong> ${data.bag_number}</div>
        <div class="field"><strong>Peso:</strong> ${data.weight} kg</div>
      </div>
      
      <div class="section">
        <div class="section-title">RESULTADO DA CLASSIFICAÇÃO</div>
        ${Object.entries(data.classification_result || {}).map(([key, value]) => 
          `<div class="field"><strong>${key.replace(/_/g, ' ').toUpperCase()}:</strong> ${value}</div>`
        ).join('')}
      </div>
      
      ${data.observations ? `
        <div class="section">
          <div class="section-title">OBSERVAÇÕES</div>
          <div class="field">${data.observations}</div>
        </div>
      ` : ''}
      
      <div class="section">
        <div class="field"><strong>Status:</strong> ${data.status}</div>
        <div class="field"><strong>Classificador:</strong> ${data.classifier_name}</div>
      </div>
    `
  }

  if (variant === 'download') {
    return (
      <button
        onClick={handleDownloadPDF}
        className={`group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 hover:-translate-y-0.5 ${className}`}
        title="Baixar PDF"
      >
        <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center">
          <FileText size={14} className="text-white" />
        </div>
        <span className="font-medium">PDF</span>
      </button>
    )
  }

  if (variant === 'print') {
    return (
      <button
        onClick={handlePrint}
        className={`group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 hover:-translate-y-0.5 ${className}`}
        title="Imprimir"
      >
        <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center">
          <Printer size={14} className="text-white" />
        </div>
        <span className="font-medium">Imprimir</span>
      </button>
    )
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      <button
        onClick={handleDownloadPDF}
        className="group inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 hover:-translate-y-0.5"
        title="Baixar PDF"
      >
        <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center">
          <Download size={14} className="text-white" />
        </div>
        <span className="font-medium">PDF</span>
      </button>
      <button
        onClick={handlePrint}
        className="group inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 hover:-translate-y-0.5"
        title="Imprimir"
      >
        <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center">
          <Printer size={14} className="text-white" />
        </div>
        <span className="font-medium">Imprimir</span>
      </button>
    </div>
  )
}

export default PDFButton
