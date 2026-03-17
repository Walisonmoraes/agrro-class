import jsPDF from 'jspdf'

export interface SimpleLaudoData {
  laudo_number: string
  classification_date: string
  client_name: string
  product_name: string
}

export const generateSimplePDF = (data: SimpleLaudoData): void => {
  try {
    console.log('Iniciando geração do PDF...')
    
    const pdf = new jsPDF()
    
    // Adiciona texto
    pdf.setFontSize(20)
    pdf.text('LAUDO DE CLASSIFICACAO', 20, 20)
    
    pdf.setFontSize(12)
    pdf.text(`Numero: ${data.laudo_number}`, 20, 40)
    pdf.text(`Data: ${data.classification_date}`, 20, 50)
    pdf.text(`Cliente: ${data.client_name}`, 20, 60)
    pdf.text(`Produto: ${data.product_name}`, 20, 70)
    
    // Salva o PDF
    pdf.save(`laudo_${data.laudo_number}.pdf`)
    
    console.log('PDF gerado com sucesso!')
  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
    throw error
  }
}

// Teste de importação
export const testPDFImport = (): boolean => {
  try {
    const pdf = new jsPDF()
    pdf.text('Test', 10, 10)
    return true
  } catch (error) {
    console.error('Erro na importação do jsPDF:', error)
    return false
  }
}
