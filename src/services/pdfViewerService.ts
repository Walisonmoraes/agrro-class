import jsPDF from 'jspdf'
import { LaudoData } from './laudoPDFSimple'

export const generatePDFBase64 = async (laudo: LaudoData): Promise<string> => {
  const pdf = new jsPDF()
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  
  let yPosition = 20
  
  // CABEÇALHO COM FUNDO COLORIDO
  pdf.setFillColor(0, 51, 102)
  pdf.rect(0, 0, pageWidth, 50, 'F')
  
  // Logo e título
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(28)
  pdf.setFont('helvetica', 'bold')
  pdf.text('AGROCLASS', 20, 35)
  
  pdf.setFontSize(16)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Sistema de Classificação', pageWidth - 20, 35, { align: 'right' })
  
  // TÍTULO DO LAUDO
  yPosition = 70
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(22)
  pdf.setFont('helvetica', 'bold')
  pdf.text('LAUDO DE CLASSIFICAÇÃO', pageWidth / 2, yPosition, { align: 'center' })
  
  // Número e data
  yPosition += 15
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`Laudo Nº: ${String(laudo.id || '0001/2024')}`, pageWidth / 2, yPosition, { align: 'center' })
  
  yPosition += 10
  pdf.text(`Data: ${String(new Date(laudo.created_at).toLocaleDateString('pt-BR'))}`, pageWidth / 2, yPosition, { align: 'center' })
  
  // LINHA SEPARADORA
  yPosition += 20
  pdf.setDrawColor(0, 51, 102)
  pdf.setLineWidth(2)
  pdf.line(20, yPosition, pageWidth - 20, yPosition)
  
  // SEÇÃO: DADOS DA OS
  yPosition += 15
  pdf.setFillColor(240, 240, 240)
  pdf.rect(20, yPosition - 5, pageWidth - 40, 8, 'F')
  
  pdf.setTextColor(0, 51, 102)
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('DADOS DA ORDEM DE SERVIÇO', 25, yPosition)
  
  yPosition += 15
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'normal')
  
  // Grid 2x2 para dados principais
  const mainData = [
    { label: 'Nº OS:', value: String(laudo.os_id || 'N/A') },
    { label: 'Cliente:', value: String(laudo.client_name || 'N/A') },
    { label: 'Produto:', value: String(laudo.product_name || 'N/A') },
    { label: 'Classificador:', value: String(laudo.classifier_name || 'N/A') }
  ]
  
  for (let i = 0; i < mainData.length; i++) {
    const x = 25 + (i % 2) * 85
    const y = yPosition + Math.floor(i / 2) * 15
    
    pdf.setFont('helvetica', 'bold')
    pdf.text(mainData[i].label, x, y)
    
    pdf.setFont('helvetica', 'normal')
    pdf.text(mainData[i].value, x + 35, y)
  }
  
  yPosition += 35
  
  // SEÇÃO: DADOS DO TRANSPORTE
  pdf.setFillColor(240, 240, 240)
  pdf.rect(20, yPosition - 5, pageWidth - 40, 8, 'F')
  
  pdf.setTextColor(0, 51, 102)
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('DADOS DO TRANSPORTE', 25, yPosition)
  
  yPosition += 15
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'normal')
  
  const transportData = [
    { label: 'Placa:', value: String(laudo.license_plate || 'N/A') },
    { label: 'Transportadora:', value: String(laudo.carrier || 'N/A') },
    { label: 'Peso:', value: String(laudo.weight_kg || 'N/A') + ' kg' },
    { label: 'Teste:', value: String(laudo.test_type || 'N/A') }
  ]
  
  for (let i = 0; i < transportData.length; i++) {
    const x = 25 + (i % 2) * 85
    const y = yPosition + Math.floor(i / 2) * 12
    
    pdf.setFont('helvetica', 'bold')
    pdf.text(transportData[i].label, x, y)
    
    pdf.setFont('helvetica', 'normal')
    pdf.text(transportData[i].value, x + 30, y)
  }
  
  yPosition += 30
  
  // SEÇÃO: TABELA DE RESULTADOS
  pdf.setFillColor(240, 240, 240)
  pdf.rect(20, yPosition - 5, pageWidth - 40, 8, 'F')
  
  pdf.setTextColor(0, 51, 102)
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('RESULTADOS DA CLASSIFICAÇÃO', 25, yPosition)
  
  yPosition += 15
  
  // Cabeçalho da tabela
  pdf.setFillColor(0, 51, 102)
  pdf.rect(25, yPosition, 160, 10, 'F')
  
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.text('PARÂMETRO', 30, yPosition + 7)
  pdf.text('RESULTADO', 100, yPosition + 7)
  pdf.text('UNIDADE', 150, yPosition + 7)
  
  yPosition += 10
  
  // Dados da tabela
  const results = [
    { param: 'Umidade', value: String(laudo.moisture || 'N/A'), unit: '%' },
    { param: 'Impurezas', value: String(laudo.impurities || 'N/A'), unit: '%' },
    { param: 'Grãos Ardidos', value: String(laudo.burnt || 'N/A'), unit: '%' },
    { param: 'Carvões', value: String(laudo.charcoal || 'N/A'), unit: '%' },
    { param: 'Fermentados', value: String(laudo.fermented || 'N/A'), unit: '%' },
    { param: 'Mofados', value: String(laudo.moldy || 'N/A'), unit: '%' },
    { param: 'Germinados', value: String(laudo.germinated || 'N/A'), unit: '%' }
  ]
  
  results.forEach((result, index) => {
    // Linha alternada
    if (index % 2 === 0) {
      pdf.setFillColor(250, 250, 250)
      pdf.rect(25, yPosition, 160, 8, 'F')
    }
    
    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'normal')
    pdf.text(result.param, 30, yPosition + 6)
    pdf.text(result.value, 100, yPosition + 6)
    pdf.text(result.unit, 150, yPosition + 6)
    
    yPosition += 8
  })
  
  yPosition += 15
  
  // SEÇÃO: CLASSIFICAÇÃO FINAL DESTACADA
  pdf.setFillColor(0, 51, 102)
  pdf.rect(20, yPosition - 5, pageWidth - 40, 8, 'F')
  
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('CLASSIFICAÇÃO FINAL', 25, yPosition)
  
  yPosition += 20
  
  // Box destacado
  const boxWidth = 100
  const boxHeight = 30
  const boxX = (pageWidth - boxWidth) / 2
  
  pdf.setFillColor(255, 255, 255)
  pdf.setDrawColor(0, 51, 102)
  pdf.setLineWidth(2)
  pdf.rect(boxX, yPosition, boxWidth, boxHeight)
  
  // Texto da classificação
  pdf.setTextColor(0, 51, 102)
  pdf.setFontSize(18)
  pdf.setFont('helvetica', 'bold')
  pdf.text(String(laudo.final_classification || 'NÃO CLASSIFICADO'), pageWidth / 2, yPosition + 20, { align: 'center' })
  
  yPosition += 45
  
  // SEÇÃO: ASSINATURAS
  pdf.setFillColor(240, 240, 240)
  pdf.rect(20, yPosition - 5, pageWidth - 40, 8, 'F')
  
  pdf.setTextColor(0, 51, 102)
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('ASSINATURAS', 25, yPosition)
  
  yPosition += 20
  
  // Linhas de assinatura
  pdf.setDrawColor(0, 0, 0)
  pdf.setLineWidth(1)
  
  // Classificador
  pdf.line(25, yPosition + 20, 85, yPosition + 20)
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Classificador', 55, yPosition + 25, { align: 'center' })
  pdf.text(String(laudo.classifier_name || 'N/A'), 55, yPosition + 15, { align: 'center' })
  
  // Responsável
  pdf.line(105, yPosition + 20, 165, yPosition + 20)
  pdf.text('Responsável Técnico', 135, yPosition + 25, { align: 'center' })
  pdf.text('___________________', 135, yPosition + 15, { align: 'center' })
  
  // RODAPÉ
  pdf.setFillColor(0, 51, 102)
  pdf.rect(0, pageHeight - 15, pageWidth, 15, 'F')
  
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'italic')
  pdf.text('Gerado em: ' + String(new Date().toLocaleString('pt-BR')), pageWidth / 2, pageHeight - 8, { align: 'center' })
  
  // Retornar PDF como base64
  return pdf.output('datauristring')
}
