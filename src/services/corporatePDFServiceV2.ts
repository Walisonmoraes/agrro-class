import jsPDF from 'jspdf'
import { LaudoData } from './laudoPDFSimple'

export const generateCorporatePDFV2 = async (laudo: LaudoData): Promise<string> => {
  const pdf = new jsPDF()
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  
  // Cores corporativas
  const primaryColor = [0, 51, 102] as [number, number, number] // Azul escuro
  const lightGray = [245, 245, 245] as [number, number, number] // Cinza claro
  const mediumGray = [200, 200, 200] as [number, number, number] // Cinza médio
  
  // Espaçamentos padronizados
  const lineHeight = 8
  const sectionSpacing = 20
  const subsectionSpacing = 12
  
  let currentY = 10
  
  // 1. CABEÇALHO CORPORATIVO (3 colunas)
  // Linha superior decorativa
  pdf.setFillColor(...primaryColor)
  pdf.rect(0, 0, pageWidth, 3, 'F')
  
  currentY += 8
  
  // Esquerda: Logo
  pdf.setTextColor(...primaryColor)
  pdf.setFontSize(20)
  pdf.setFont('helvetica', 'bold')
  pdf.text('AGROCLASS', 20, currentY)
  
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Sistemas de Classificação', 20, currentY + 7)
  
  // Centro: Título do laudo
  pdf.setFontSize(16)
  pdf.setFont('helvetica', 'bold')
  pdf.text('LAUDO DE ACOMPANHAMENTO DE EMBARQUE', pageWidth / 2, currentY + 3, { align: 'center' })
  
  // Direita: Informações institucionais
  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'normal')
  pdf.text('CNPJ: 12.345.678/0001-90', pageWidth - 20, currentY, { align: 'right' })
  pdf.text('Endereço: Rua Principal, 123 - Centro', pageWidth - 20, currentY + 5, { align: 'right' })
  pdf.text('Telefone: (11) 3456-7890', pageWidth - 20, currentY + 10, { align: 'right' })
  pdf.text('WhatsApp: (11) 98765-4321', pageWidth - 20, currentY + 15, { align: 'right' })
  
  currentY += 25
  
  // Linha separadora do cabeçalho
  pdf.setDrawColor(...mediumGray)
  pdf.setLineWidth(0.5)
  pdf.line(20, currentY, pageWidth - 20, currentY)
  
  currentY += 10
  
  // 2. IDENTIFICAÇÃO DO LAUDO (linha única)
  pdf.setTextColor(...primaryColor)
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('LAUDO Nº: ' + String(laudo.id || 'LAUDO-2024-001'), 20, currentY)
  pdf.text(`DATA: ${new Date(laudo.created_at).toLocaleDateString('pt-BR')}`, pageWidth - 20, currentY, { align: 'right' })
  
  currentY += 15
  
  currentY += sectionSpacing
  
  // Linha separadora
  pdf.setDrawColor(...mediumGray)
  pdf.setLineWidth(0.5)
  pdf.line(20, currentY, pageWidth - 20, currentY)
  
  currentY += 10
  
  // 3. CONTEÚDO EM DUAS COLUNAS
  const colLeft = 20
  const colRight = pageWidth / 2 + 15
  const colWidth = (pageWidth - 40) / 2 - 15
  
  let leftY = currentY
  let rightY = currentY
  
  // COLUNA ESQUERDA - DADOS PRINCIPAIS
  
  // Seção CLIENTE
  pdf.setTextColor(...primaryColor)
  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'bold')
  pdf.text('CLIENTE', colLeft, leftY)
  
  leftY += subsectionSpacing
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  
  const clientData = [
    ['Empresa', String(laudo.client_name || '—')],
    ['CNPJ', '—'],
    ['Contrato', '—']
  ]
  
  clientData.forEach(([label, value]) => {
    pdf.setFont('helvetica', 'bold')
    pdf.text(label + ':', colLeft, leftY)
    pdf.setFont('helvetica', 'normal')
    pdf.text(value, colLeft + 35, leftY)
    leftY += lineHeight
  })
  
  leftY += 8
  
  // Seção CARGA
  pdf.setTextColor(...primaryColor)
  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'bold')
  pdf.text('CARGA', colLeft, leftY)
  
  leftY += subsectionSpacing
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  
  const cargoData = [
    ['OS', String(laudo.os_id || '—')],
    ['Placa', String(laudo.license_plate || '—')],
    ['Produto', String(laudo.product_name || '—')],
    ['Tipo do produto', '—'],
    ['Peso', (laudo.weight_kg || '—') + ' kg'],
    ['Nota fiscal', '—'],
    ['Ordem de carregamento', '—'],
    ['Produtor', '—'],
    ['Vistoriado', String(laudo.classifier_name || '—')]
  ]
  
  cargoData.forEach(([label, value]) => {
    pdf.setFont('helvetica', 'bold')
    pdf.text(label + ':', colLeft, leftY)
    pdf.setFont('helvetica', 'normal')
    pdf.text(value, colLeft + 35, leftY)
    leftY += lineHeight
  })
  
  leftY += 8
  
  // Seção TRANSPORTE
  pdf.setTextColor(...primaryColor)
  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'bold')
  pdf.text('TRANSPORTE', colLeft, leftY)
  
  leftY += subsectionSpacing
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  
  const transportData = [
    ['Transportadora', String(laudo.carrier || '—')],
    ['TAG pedágio', '—']
  ]
  
  transportData.forEach(([label, value]) => {
    pdf.setFont('helvetica', 'bold')
    pdf.text(label + ':', colLeft, leftY)
    pdf.setFont('helvetica', 'normal')
    pdf.text(value, colLeft + 35, leftY)
    leftY += lineHeight
  })
  
  // COLUNA DIREITA - CLASSIFICAÇÃO
  
  // Seção ITENS DE CLASSIFICAÇÃO
  pdf.setTextColor(...primaryColor)
  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'bold')
  pdf.text('ITENS DE CLASSIFICAÇÃO', colRight, rightY)
  
  rightY += subsectionSpacing
  
  // Linha separadora leve
  pdf.setDrawColor(...lightGray)
  pdf.setLineWidth(0.3)
  pdf.line(colRight, rightY - 5, colRight + colWidth, rightY - 5)
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  
  const classificationData = [
    ['Umidade', String(laudo.moisture || '—'), '%'],
    ['Matérias estranhas e impurezas', String(laudo.impurities || '—'), '%'],
    ['Quebrados', String(laudo.damaged || '—'), '%'],
    ['Ardidos', String(laudo.burnt || '—'), '%'],
    ['Carvões', String(laudo.charcoal || '—'), '%'],
    ['Fermentados', String(laudo.fermented || '—'), '%'],
    ['Mofados', String(laudo.moldy || '—'), '%'],
    ['Germinados', String(laudo.germinated || '—'), '%'],
    ['Imaturos', String(laudo.immature || '—'), '%'],
    ['Fragmentos', String(laudo.fragments || '—'), '%'],
    ['Danos por insetos', String(laudo.insect_damage || '—'), '%']
  ]
  
  classificationData.forEach(([item, value, unit]) => {
    // Nome à esquerda
    pdf.setFont('helvetica', 'bold')
    pdf.text(item + ':', colRight, rightY)
    
    // Valor alinhado à direita
    pdf.setFont('helvetica', 'normal')
    const valueWithUnit = value + ' ' + unit
    pdf.text(valueWithUnit, colRight + colWidth, rightY, { align: 'right' })
    
    rightY += lineHeight
  })
  
  // 4. SEÇÃO DE ASSINATURAS
  let signaturesY = rightY + sectionSpacing
  
  // Verificar se precisa de nova página
  if (signaturesY > pageHeight - 60) {
    pdf.addPage()
    signaturesY = 50
  }
  
  // Linha separadora antes das assinaturas
  pdf.setDrawColor(...mediumGray)
  pdf.setLineWidth(0.5)
  pdf.line(20, signaturesY - 10, pageWidth - 20, signaturesY - 10)
  
  pdf.setTextColor(...primaryColor)
  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'bold')
  pdf.text('ASSINATURAS', 20, signaturesY)
  
  signaturesY += subsectionSpacing
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  
  // Linhas de assinatura
  pdf.setDrawColor(0, 0, 0)
  pdf.setLineWidth(0.5)
  
  // Classificador
  pdf.line(20, signaturesY + 20, 80, signaturesY + 20)
  pdf.text('Classificador', 50, signaturesY + 25, { align: 'center' })
  pdf.text(String(laudo.classifier_name || '—'), 50, signaturesY + 15, { align: 'center' })
  
  // Responsável
  pdf.line(100, signaturesY + 20, 160, signaturesY + 20)
  pdf.text('Responsável Técnico', 130, signaturesY + 25, { align: 'center' })
  pdf.text('—', 130, signaturesY + 15, { align: 'center' })
  
  // 5. RODAPÉ FIXO
  const footerY = pageHeight - 20
  
  // Linha separadora do rodapé
  pdf.setDrawColor(...mediumGray)
  pdf.setLineWidth(0.5)
  pdf.line(20, footerY - 10, pageWidth - 20, footerY - 10)
  
  pdf.setTextColor(...primaryColor)
  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'italic')
  pdf.text('Laudo gerado pelo sistema AgroClass em ' + new Date().toLocaleString('pt-BR'), pageWidth / 2, footerY, { align: 'center' })
  
  // Retornar PDF como base64
  return pdf.output('datauristring')
}
