import jsPDF from 'jspdf'
import { LaudoData } from './laudoPDFSimple'

export const generateCorporatePDF = async (laudo: LaudoData): Promise<string> => {
  const pdf = new jsPDF()
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  
  // Cores corporativas
  const primaryColor = [0, 51, 102] as [number, number, number] // Azul escuro
  const lightGray = [245, 245, 245] as [number, number, number] // Cinza claro
  const mediumGray = [200, 200, 200] as [number, number, number] // Cinza médio
  
  // 1. CABEÇALHO CORPORATIVO
  // Linha superior decorativa
  pdf.setFillColor(...(primaryColor as [number, number, number]))
  pdf.rect(0, 0, pageWidth, 3, 'F')
  
  // Área do cabeçalho
  pdf.setFillColor(255, 255, 255)
  pdf.rect(0, 3, pageWidth, 35, 'F')
  
  // Logo à esquerda (simulado com texto)
  pdf.setTextColor(...(primaryColor as [number, number, number]))
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('AGROCLASS', 20, 20)
  
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Sistemas de Classificação', 20, 28)
  
  // Centro - Nome do documento
  pdf.setFontSize(16)
  pdf.setFont('helvetica', 'bold')
  pdf.text('LAUDO DE ACOMPANHAMENTO DE EMBARQUE', pageWidth / 2, 20, { align: 'center' })
  
  // Direita - Informações institucionais
  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'normal')
  pdf.text('CNPJ: 12.345.678/0001-90', pageWidth - 20, 15, { align: 'right' })
  pdf.text('Endereço: Rua Principal, 123 - Centro', pageWidth - 20, 20, { align: 'right' })
  pdf.text('Telefone: (11) 3456-7890', pageWidth - 20, 25, { align: 'right' })
  pdf.text('WhatsApp: (11) 98765-4321', pageWidth - 20, 30, { align: 'right' })
  
  // Linha separadora do cabeçalho
  pdf.setDrawColor(...(mediumGray as [number, number, number]))
  pdf.setLineWidth(0.5)
  pdf.line(20, 42, pageWidth - 20, 42)
  
  // 2. IDENTIFICAÇÃO DO LAUDO
  let yPosition = 50
  
  pdf.setTextColor(...primaryColor)
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Laudo Nº:', 20, yPosition)
  pdf.text(`Data: ${new Date(laudo.created_at).toLocaleDateString('pt-BR')}`, pageWidth - 20, yPosition, { align: 'right' })
  
  yPosition += 10
  
  pdf.setFontSize(16)
  pdf.text(String(laudo.id || 'LAUDO-2024-001'), 20, yPosition)
  
  // Linha separadora
  yPosition += 15
  pdf.setDrawColor(...(mediumGray as [number, number, number]))
  pdf.setLineWidth(0.5)
  pdf.line(20, yPosition, pageWidth - 20, yPosition)
  
  // 3. LAYOUT EM DUAS COLUNAS
  yPosition += 10
  
  const colLeft = 20
  const colRight = pageWidth / 2 + 10
  const colWidth = (pageWidth - 40) / 2 - 10
  
  // COLUNA ESQUERDA
  let leftY = yPosition
  
  // Seção CLIENTE
  pdf.setTextColor(...primaryColor)
  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'bold')
  pdf.text('CLIENTE', colLeft, leftY)
  
  leftY += 8
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  
  const clientData = [
    ['Empresa:', String(laudo.client_name || 'N/A')],
    ['CNPJ:', 'Não informado'],
    ['Contrato:', 'Não informado']
  ]
  
  clientData.forEach(([label, value]) => {
    pdf.text(label, colLeft, leftY)
    pdf.text(value, colLeft + 40, leftY)
    leftY += 6
  })
  
  // Seção CARGA
  leftY += 5
  pdf.setTextColor(...primaryColor)
  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'bold')
  pdf.text('CARGA', colLeft, leftY)
  
  leftY += 8
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  
  const cargoData = [
    ['OS:', String(laudo.os_id || 'N/A')],
    ['Placa:', String(laudo.license_plate || 'N/A')],
    ['Produto:', String(laudo.product_name || 'N/A')],
    ['Tipo do produto:', 'Não informado'],
    ['Peso:', String(laudo.weight_kg || 'N/A') + ' kg'],
    ['Nota fiscal:', 'Não informado'],
    ['Ordem de carregamento:', 'Não informado'],
    ['Produtor:', 'Não informado'],
    ['Vistoriado:', String(laudo.classifier_name || 'N/A')]
  ]
  
  cargoData.forEach(([label, value]) => {
    pdf.text(label, colLeft, leftY)
    pdf.text(value, colLeft + 40, leftY)
    leftY += 6
  })
  
  // Observações
  leftY += 5
  pdf.setTextColor(...primaryColor)
  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'bold')
  pdf.text('OBSERVAÇÕES', colLeft, leftY)
  
  leftY += 8
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Não informado', colLeft, leftY)
  
  // Coordenadas
  leftY += 8
  pdf.setTextColor(...primaryColor)
  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'bold')
  pdf.text('LATITUDE / LONGITUDE', colLeft, leftY)
  
  leftY += 8
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Não informado / Não informado', colLeft, leftY)
  
  // DADOS DO MOTORISTA
  leftY += 12
  pdf.setTextColor(...primaryColor)
  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'bold')
  pdf.text('DADOS DO MOTORISTA', colLeft, leftY)
  
  leftY += 8
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  
  const driverData = [
    ['Nome:', 'Não informado'],
    ['CPF:', 'Não informado'],
    ['RG:', 'Não informado'],
    ['Telefone:', 'Não informado'],
    ['CNH:', 'Não informado'],
    ['ANTT:', 'Não informado']
  ]
  
  driverData.forEach(([label, value]) => {
    pdf.text(label, colLeft, leftY)
    pdf.text(value, colLeft + 40, leftY)
    leftY += 6
  })
  
  // TRANSPORTE
  leftY += 5
  pdf.setTextColor(...primaryColor)
  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'bold')
  pdf.text('TRANSPORTE', colLeft, leftY)
  
  leftY += 8
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  
  const transportData = [
    ['Transportadora:', String(laudo.carrier || 'N/A')],
    ['TAG pedágio:', 'Não informado']
  ]
  
  transportData.forEach(([label, value]) => {
    pdf.text(label, colLeft, leftY)
    pdf.text(value, colLeft + 40, leftY)
    leftY += 6
  })
  
  // COLUNA DIREITA
  let rightY = yPosition
  
  // Seção ITENS DE CLASSIFICAÇÃO
  pdf.setTextColor(...primaryColor)
  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'bold')
  pdf.text('ITENS DE CLASSIFICAÇÃO', colRight, rightY)
  
  rightY += 12
  
  // Linha separadora leve
  pdf.setDrawColor(...(lightGray as [number, number, number]))
  pdf.setLineWidth(0.3)
  pdf.line(colRight, rightY - 5, colRight + colWidth, rightY - 5)
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  
  const classificationData = [
    ['Umidade', String(laudo.moisture || 'N/A'), '%'],
    ['Matérias estranhas e impurezas', String(laudo.impurities || 'N/A'), '%'],
    ['Quebrados', String(laudo.damaged || 'N/A'), '%'],
    ['Ardidos', String(laudo.burnt || 'N/A'), '%'],
    ['Carvões', String(laudo.charcoal || 'N/A'), '%'],
    ['Fermentados', String(laudo.fermented || 'N/A'), '%'],
    ['Mofados', String(laudo.moldy || 'N/A'), '%'],
    ['Germinados', String(laudo.germinated || 'N/A'), '%'],
    ['Imaturos', String(laudo.immature || 'N/A'), '%'],
    ['Fragmentos', String(laudo.fragments || 'N/A'), '%'],
    ['Danos por insetos', String(laudo.insect_damage || 'N/A'), '%']
  ]
  
  classificationData.forEach(([item, value, unit]) => {
    // Label à esquerda
    pdf.text(item, colRight, rightY)
    
    // Valor alinhado à direita
    const valueWithUnit = value + ' ' + unit
    pdf.text(valueWithUnit, colRight + colWidth, rightY, { align: 'right' })
    
    rightY += 7
  })
  
  // Linha separadora antes da classificação final
  rightY += 8
  pdf.setDrawColor(...(mediumGray as [number, number, number]))
  pdf.setLineWidth(0.5)
  pdf.line(colRight, rightY, colRight + colWidth, rightY)
  
  // CLASSIFICAÇÃO FINAL
  rightY += 10
  pdf.setTextColor(...primaryColor)
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('CLASSIFICAÇÃO FINAL', colRight, rightY)
  
  rightY += 10
  
  // Box destacado para classificação
  pdf.setFillColor(...(lightGray as [number, number, number]))
  pdf.rect(colRight, rightY - 8, colWidth, 20, 'F')
  
  pdf.setDrawColor(...primaryColor)
  pdf.setLineWidth(1)
  pdf.rect(colRight, rightY - 8, colWidth, 20)
  
  pdf.setTextColor(...primaryColor)
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text(String(laudo.final_classification || 'NÃO CLASSIFICADO'), colRight + colWidth / 2, rightY + 2, { align: 'center' })
  
  // 4. RODAPÉ
  const footerY = pageHeight - 30
  
  // Linha separadora do rodapé
  pdf.setDrawColor(...(mediumGray as [number, number, number]))
  pdf.setLineWidth(0.5)
  pdf.line(20, footerY, pageWidth - 20, footerY)
  
  // Área de assinaturas
  pdf.setTextColor(...primaryColor)
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.text('ASSINATURAS', 20, footerY + 10)
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  
  // Linhas de assinatura
  pdf.setDrawColor(0, 0, 0)
  pdf.setLineWidth(0.5)
  
  // Classificador
  pdf.line(20, footerY + 25, 80, footerY + 25)
  pdf.text('Classificador', 50, footerY + 30, { align: 'center' })
  pdf.text(String(laudo.classifier_name || 'N/A'), 50, footerY + 20, { align: 'center' })
  
  // Responsável
  pdf.line(100, footerY + 25, 160, footerY + 25)
  pdf.text('Responsável Técnico', 130, footerY + 30, { align: 'center' })
  pdf.text('___________________', 130, footerY + 20, { align: 'center' })
  
  // Rodapé institucional
  const bottomY = pageHeight - 10
  pdf.setTextColor(...primaryColor)
  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'italic')
  pdf.text('Laudo gerado pelo sistema AgroClass em ' + new Date().toLocaleString('pt-BR'), pageWidth / 2, bottomY, { align: 'center' })
  
  // Retornar PDF como base64
  return pdf.output('datauristring')
}
