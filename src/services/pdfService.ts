import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export interface LaudoData {
  laudo_number: string
  classification_date: string
  client_name: string
  product_name: string
  origin_name: string
  destination_name: string
  embarkation_point_name: string
  sample_number: number
  bag_number: number
  weight: number
  classification_result: any
  observations?: string
  classifier_name: string
  status: string
}

export const generateLaudoPDF = async (laudoData: LaudoData): Promise<void> => {
  const pdf = new jsPDF()
  
  // Configurações iniciais
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  let yPosition = 20
  
  // Cabeçalho
  pdf.setFontSize(20)
  pdf.setFont('helvetica', 'bold')
  pdf.text('LAUDO DE CLASSIFICAÇÃO', pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 15
  
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`Número: ${laudoData.laudo_number}`, pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 10
  pdf.text(`Data: ${new Date(laudoData.classification_date).toLocaleDateString('pt-BR')}`, pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 15
  
  // Linha separadora
  pdf.setDrawColor(0, 0, 0)
  pdf.line(20, yPosition, pageWidth - 20, yPosition)
  yPosition += 10
  
  // Informações do Cliente
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('DADOS DO CLIENTE', 20, yPosition)
  yPosition += 8
  
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`Cliente: ${laudoData.client_name}`, 20, yPosition)
  yPosition += 6
  pdf.text(`Origem: ${laudoData.origin_name}`, 20, yPosition)
  yPosition += 6
  pdf.text(`Destino: ${laudoData.destination_name}`, 20, yPosition)
  yPosition += 6
  pdf.text(`Ponto de Embarque: ${laudoData.embarkation_point_name}`, 20, yPosition)
  yPosition += 10
  
  // Informações do Produto
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('DADOS DO PRODUTO', 20, yPosition)
  yPosition += 8
  
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`Produto: ${laudoData.product_name}`, 20, yPosition)
  yPosition += 6
  pdf.text(`Amostra: ${laudoData.sample_number}`, 20, yPosition)
  yPosition += 6
  pdf.text(`Saco: ${laudoData.bag_number}`, 20, yPosition)
  yPosition += 6
  pdf.text(`Peso: ${laudoData.weight} kg`, 20, yPosition)
  yPosition += 10
  
  // Resultados da Classificação
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('RESULTADO DA CLASSIFICAÇÃO', 20, yPosition)
  yPosition += 8
  
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  
  // Processar resultados do JSON
  if (laudoData.classification_result) {
    const results = laudoData.classification_result
    
    // Adicionar cada resultado
    Object.entries(results).forEach(([key, value]) => {
      if (yPosition > pageHeight - 30) {
        pdf.addPage()
        yPosition = 20
      }
      
      const label = key.replace(/_/g, ' ').toUpperCase()
      pdf.text(`${label}: ${value}`, 20, yPosition)
      yPosition += 6
    })
  }
  
  yPosition += 10
  
  // Observações
  if (laudoData.observations) {
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text('OBSERVAÇÕES', 20, yPosition)
    yPosition += 8
    
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    
    // Quebrar texto longo
    const lines = pdf.splitTextToSize(laudoData.observations, pageWidth - 40)
    lines.forEach((line: string) => {
      if (yPosition > pageHeight - 30) {
        pdf.addPage()
        yPosition = 20
      }
      pdf.text(line, 20, yPosition)
      yPosition += 6
    })
  }
  
  yPosition += 10
  
  // Status e Classificador
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.text(`Status: ${getStatusText(laudoData.status)}`, 20, yPosition)
  yPosition += 6
  pdf.text(`Classificador: ${laudoData.classifier_name}`, 20, yPosition)
  yPosition += 10
  
  // Rodapé
  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'italic')
  pdf.text('Laudo gerado pelo sistema AgroClass', pageWidth / 2, pageHeight - 10, { align: 'center' })
  
  // Salvar o PDF
  pdf.save(`laudo_${laudoData.laudo_number.replace(/\//g, '_')}.pdf`)
}

const getStatusText = (status: string): string => {
  switch (status) {
    case 'DRAFT': return 'Rascunho'
    case 'PENDING': return 'Pendente'
    case 'APPROVED': return 'Aprovado'
    case 'REJECTED': return 'Rejeitado'
    default: return status
  }
}

export const generateLaudoPDFFromHTML = async (elementId: string, laudoNumber: string): Promise<void> => {
  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error('Elemento não encontrado para gerar PDF')
  }
  
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    })
    
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    const imgWidth = 210
    const pageHeight = 297
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = 0
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }
    
    pdf.save(`laudo_${laudoNumber.replace(/\//g, '_')}.pdf`)
  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
    throw error
  }
}

export const printLaudo = (elementId: string): void => {
  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error('Elemento não encontrado para impressão')
  }
  
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    throw new Error('Não foi possível abrir janela de impressão')
  }
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Laudo de Classificação</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; }
          .section { margin: 20px 0; }
          .section-title { font-weight: bold; font-size: 14px; margin-bottom: 5px; }
          .field { margin: 3px 0; font-size: 12px; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        ${element.innerHTML}
      </body>
    </html>
  `)
  
  printWindow.document.close()
  printWindow.focus()
  
  setTimeout(() => {
    printWindow.print()
    printWindow.close()
  }, 500)
}
