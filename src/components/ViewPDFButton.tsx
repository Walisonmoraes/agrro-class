import React from 'react'
import { Eye } from 'lucide-react'
import { LaudoData } from '../services/laudoPDFSimple'
import { generateCorporatePDFV3 } from '../services/corporatePDFServiceV3'

interface ViewPDFButtonProps {
  laudo: any
  onOpenModal: (pdfData: string, fileName: string) => void
  className?: string
}

export const ViewPDFButton: React.FC<ViewPDFButtonProps> = ({
  laudo,
  onOpenModal,
  className = ''
}) => {
  const handleViewPDF = async () => {
    try {
      console.log('=== INÍCIO DA VISUALIZAÇÃO DO PDF ===')
      console.log('Dados do relatório:', laudo)
      
      // Preparar dados no formato esperado
      const laudoData: LaudoData = {
        id: String(laudo.id || 'LAUDO-' + Date.now()),
        created_at: String(laudo.created_at || new Date().toISOString()),
        os_id: String(laudo.os_id || 'N/A'),
        classifier_name: String(laudo.classifier_name || 'N/A'),
        final_classification: String(laudo.final_classification || 'NÃO CLASSIFICADO'),
        moisture: String(laudo.moisture || 'N/A'),
        impurities: String(laudo.impurities || 'N/A'),
        burnt: String(laudo.burnt || 'N/A'),
        charcoal: String(laudo.charcoal || 'N/A'),
        fermented: String(laudo.fermented || 'N/A'),
        moldy: String(laudo.moldy || 'N/A'),
        germinated: String(laudo.germinated || 'N/A'),
        license_plate: String(laudo.license_plate || 'N/A'),
        carrier: String(laudo.carrier || 'N/A'),
        weight_kg: String(laudo.weight_kg || 'N/A'),
        test_type: String(laudo.test_type || 'N/A'),
        client_name: String(laudo.client_name || 'Cliente não informado'),
        product_name: String(laudo.product_name || 'Produto não informado'),
        origin: String(laudo.origin || 'Origem não informada'),
        destination: String(laudo.destination || 'Destino não informado')
      }
      
      console.log('✅ Dados preparados para visualização:', laudoData)
      
      // Gerar PDF em base64
      const pdfData = await generateCorporatePDFV3(laudoData)
      const fileName = `LAUDO_CORPORATIVO_V3_${laudoData.id.replace(/\//g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
      
      console.log('✅ PDF gerado para visualização')
      
      // Abrir modal com o PDF
      onOpenModal(pdfData, fileName)
      
    } catch (error) {
      console.error('❌ Erro ao visualizar PDF:', error)
      alert('Erro ao visualizar PDF: ' + error.message)
    }
    
    console.log('=== FIM DA VISUALIZAÇÃO DO PDF ===')
  }

  return (
    <button
      onClick={handleViewPDF}
      className={`p-2 text-stone-400 hover:text-purple-600 transition-colors ${className}`}
      title="Visualizar PDF"
    >
      <Eye size={18} />
    </button>
  )
}

export default ViewPDFButton
