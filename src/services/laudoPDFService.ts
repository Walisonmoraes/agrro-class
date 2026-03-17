import jsPDF from 'jspdf'

export interface LaudoData {
  id: string
  created_at: string
  os_id: string
  classifier_name: string
  final_classification: string
  moisture?: string
  impurities?: string
  burnt?: string
  charcoal?: string
  fermented?: string
  moldy?: string
  germinated?: string
  license_plate?: string
  carrier?: string
  weight_kg?: string
  test_type?: string
  client_name?: string
  product_name?: string
  origin?: string
  destination?: string
}

export const generateLaudoPDFProfissional = async (laudo: LaudoData) => {
  const pdf = new jsPDF()
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  
  // Cores
  const primaryColor = [0, 51, 102] as [number, number, number] // Azul escuro
  const secondaryColor = [200, 200, 200] as [number, number, number] // Cinza claro
  
  let yPosition = 20
  
  // CABEÇALHO
  // Retângulo colorido no topo
  pdf.setFillColor(...primaryColor)
  pdf.rect(0, 0, pageWidth, 40, 'F')
  
  // Logo e título no cabeçalho
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('AGROCLASS', 20, 28)
  
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Sistema de Classificação de Grãos', pageWidth - 20, 28, { align: 'right' })
  
  // Linha decorativa
  pdf.setDrawColor(...(primaryColor as [number, number, number]))
  pdf.setLineWidth(2)
  pdf.line(20, 45, pageWidth - 20, 45)
  
  // TÍTULO DO LAUDO
  yPosition = 55
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(20)
  pdf.setFont('helvetica', 'bold')
  pdf.text('LAUDO DE CLASSIFICAÇÃO', pageWidth / 2, yPosition, { align: 'center' })
  
  // Número do laudo
  yPosition += 10
  pdf.setFontSize(16)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`Laudo Nº: ${laudo.id || '0001/2024'}`, pageWidth / 2, yPosition, { align: 'center' })
  
  // Data
  yPosition += 8
  pdf.setFontSize(12)
  pdf.text(`Data: ${new Date(laudo.created_at).toLocaleDateString('pt-BR')}`, pageWidth / 2, yPosition, { align: 'center' })
  
  // LINHA SEPARADORA
  yPosition += 15
  pdf.setDrawColor(...(secondaryColor as [number, number, number]))
  pdf.setLineWidth(1)
  pdf.line(20, yPosition, pageWidth - 20, yPosition)

  // SEÇÃO 1: DADOS GERAIS
  yPosition += 10
  pdf.setFillColor(...(secondaryColor as [number, number, number]))
  pdf.rect(20, yPosition, pageWidth - 40, 8, 'F')
  
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('DADOS GERAIS', 25, yPosition + 6)
  
  yPosition += 15
  pdf.setTextColor(0, 0, 0)
  pdf.setFont('helvetica', 'normal')
  
  // Grid de dados gerais
  const generalData = [
    { label: 'Nº OS:', value: laudo.os_id || 'N/A' },
    { label: 'Cliente:', value: laudo.client_name || 'N/A' },
    { label: 'Produto:', value: laudo.product_name || 'N/A' },
    { label: 'Classificador:', value: laudo.classifier_name || 'N/A' },
    { label: 'Origem:', value: laudo.origin || 'N/A' },
    { label: 'Destino:', value: laudo.destination || 'N/A' }
  ]
  
  // Criar grid 2x3
  for (let i = 0; i < generalData.length; i++) {
    const row = Math.floor(i / 3)
    const col = i % 3
    const x = 25 + (col * 60)
    const y = yPosition + (row * 15)
    
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    pdf.text(generalData[i].label, x, y)
    
    pdf.setFont('helvetica', 'normal')
    pdf.text(generalData[i].value, x + 25, y)
  }
  
  yPosition += 35
  
  // SEÇÃO 2: DADOS DO TRANSPORTE
  pdf.setFillColor(...secondaryColor)
  pdf.rect(20, yPosition, pageWidth - 40, 8, 'F')
  
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('DADOS DO TRANSPORTE', 25, yPosition + 6)
  
  yPosition += 15
  pdf.setTextColor(0, 0, 0)
  pdf.setFont('helvetica', 'normal')
  
  const transportData = [
    { label: 'Placa do Veículo:', value: laudo.license_plate || 'N/A' },
    { label: 'Transportadora:', value: laudo.carrier || 'N/A' },
    { label: 'Peso (kg):', value: laudo.weight_kg || 'N/A' },
    { label: 'Tipo de Teste:', value: laudo.test_type || 'N/A' }
  ]
  
  for (let i = 0; i < transportData.length; i++) {
    const x = 25 + (i % 2) * 90
    const y = yPosition + Math.floor(i / 2) * 12
    
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    pdf.text(transportData[i].label, x, y)
    
    pdf.setFont('helvetica', 'normal')
    pdf.text(transportData[i].value, x + 45, y)
  }
  
  yPosition += 30
  
  // SEÇÃO 3: RESULTADOS DA CLASSIFICAÇÃO
  pdf.setFillColor(...secondaryColor)
  pdf.rect(20, yPosition, pageWidth - 40, 8, 'F')
  
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('RESULTADOS DA CLASSIFICAÇÃO', 25, yPosition + 6)
  
  yPosition += 15
  
  // Tabela de resultados
  const results = [
    { parameter: 'Umidade', value: laudo.moisture || 'N/A', unit: '%' },
    { parameter: 'Impurezas', value: laudo.impurities || 'N/A', unit: '%' },
    { parameter: 'Grãos Ardidos', value: laudo.burnt || 'N/A', unit: '%' },
    { parameter: 'Carvões', value: laudo.charcoal || 'N/A', unit: '%' },
    { parameter: 'Fermentados', value: laudo.fermented || 'N/A', unit: '%' },
    { parameter: 'Mofados', value: laudo.moldy || 'N/A', unit: '%' },
    { parameter: 'Germinados', value: laudo.germinated || 'N/A', unit: '%' }
  ]
  
  // Cabeçalho da tabela
  pdf.setFillColor(240, 240, 240)
  pdf.rect(25, yPosition, 160, 10, 'F')
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.text('PARÂMETRO', 30, yPosition + 7)
  pdf.text('RESULTADO', 100, yPosition + 7)
  pdf.text('UNIDADE', 150, yPosition + 7)
  
  yPosition += 10
  
  // Linhas da tabela
  results.forEach((result, index) => {
    if (yPosition > pageHeight - 50) {
      pdf.addPage()
      yPosition = 20
    }
    
    // Linha alternada
    if (index % 2 === 0) {
      pdf.setFillColor(250, 250, 250)
      pdf.rect(25, yPosition, 160, 8, 'F')
    }
    
    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'normal')
    pdf.text(result.parameter, 30, yPosition + 6)
    pdf.text(result.value, 100, yPosition + 6)
    pdf.text(result.unit, 150, yPosition + 6)
    
    yPosition += 8
  })
  
  yPosition += 10
  
  // SEÇÃO 4: CLASSIFICAÇÃO FINAL
  pdf.setFillColor(...primaryColor)
  pdf.rect(20, yPosition, pageWidth - 40, 8, 'F')
  
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('CLASSIFICAÇÃO FINAL', 25, yPosition + 6)
  
  yPosition += 15
  
  // Box destacado para a classificação
  const classificationWidth = 80
  const classificationHeight = 25
  const classificationX = (pageWidth - classificationWidth) / 2
  
  pdf.setFillColor(255, 255, 255)
  pdf.setDrawColor(...primaryColor)
  pdf.setLineWidth(2)
  pdf.rect(classificationX, yPosition, classificationWidth, classificationHeight)
  
  // Texto da classificação
  pdf.setTextColor(...primaryColor)
  pdf.setFontSize(16)
  pdf.setFont('helvetica', 'bold')
  pdf.text(laudo.final_classification || 'NÃO CLASSIFICADO', pageWidth / 2, yPosition + 17, { align: 'center' })
  
  yPosition += 35
  
  // SEÇÃO 5: ASSINATURAS
  if (yPosition > pageHeight - 60) {
    pdf.addPage()
    yPosition = 20
  }
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.text('ASSINATURAS', 25, yPosition)
  
  yPosition += 15
  
  // Linhas de assinatura
  pdf.setDrawColor(0, 0, 0)
  pdf.setLineWidth(1)
  
  // Classificador
  pdf.line(25, yPosition + 20, 85, yPosition + 20)
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Classificador', 55, yPosition + 25, { align: 'center' })
  pdf.text(laudo.classifier_name || 'N/A', 55, yPosition + 15, { align: 'center' })
  
  // Responsável
  pdf.line(105, yPosition + 20, 165, yPosition + 20)
  pdf.text('Responsável Técnico', 135, yPosition + 25, { align: 'center' })
  pdf.text('___________________', 135, yPosition + 15, { align: 'center' })
  
  // RODAPÉ
  pdf.setFillColor(...secondaryColor)
  pdf.rect(0, pageHeight - 20, pageWidth, 20, 'F')
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'italic')
  pdf.text('Laudo gerado pelo sistema AgroClass em ' + new Date().toLocaleString('pt-BR'), pageWidth / 2, pageHeight - 10, { align: 'center' })
  
  // Salvar o PDF
  const fileName = `LAUDO_${laudo.id.replace(/\//g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
  pdf.save(fileName)
  
  return fileName
}
