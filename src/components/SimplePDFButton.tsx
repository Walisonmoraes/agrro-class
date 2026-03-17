import React from 'react'
import { FileText } from 'lucide-react'

const SimplePDFButton: React.FC = () => {
  const handleClick = async () => {
    console.log('=== INÍCIO DO DEBUG ===')
    
    // 1. Teste básico
    console.log('1. Testando clique do botão...')
    alert('Botão clicado! Verifique o console.')
    
    // 2. Teste de importação
    console.log('2. Testando importação do jsPDF...')
    try {
      const jsPDF = await import('jspdf')
      console.log('✅ jsPDF importado:', typeof jsPDF)
      console.log('✅ jsPDF.default:', typeof jsPDF.default)
      
      // 3. Teste de criação
      console.log('3. Testando criação do PDF...')
      const pdf = new jsPDF.default()
      console.log('✅ PDF criado:', pdf)
      
      // 4. Teste de adição de conteúdo
      console.log('4. Adicionando conteúdo...')
      pdf.text('Hello World!', 10, 10)
      pdf.text('Laudo Teste', 10, 20)
      pdf.text('Data: ' + new Date().toLocaleDateString(), 10, 30)
      console.log('✅ Conteúdo adicionado')
      
      // 5. Teste de salvamento
      console.log('5. Salvando PDF...')
      pdf.save('teste.pdf')
      console.log('✅ PDF salvo!')
      
      alert('PDF gerado com sucesso! Verifique o download.')
      
    } catch (error) {
      console.error('❌ Erro detalhado:', error)
      alert('Erro: ' + error.message)
    }
    
    console.log('=== FIM DO DEBUG ===')
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-lg"
    >
      <FileText size={20} />
      <span>DEBUG PDF</span>
    </button>
  )
}

export default SimplePDFButton
