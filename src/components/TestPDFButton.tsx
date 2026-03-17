import React from 'react'
import { FileText } from 'lucide-react'

const TestPDFButton: React.FC = () => {
  const handleClick = () => {
    console.log('Botão clicado!')
    alert('Botão foi clicado!')
    
    // Teste básico do jsPDF
    try {
      import('jspdf').then((jsPDF) => {
        console.log('jsPDF importado com sucesso')
        
        const pdf = new jsPDF.default()
        pdf.text('Hello World!', 10, 10)
        pdf.save('test.pdf')
        
        console.log('PDF gerado com sucesso!')
      }).catch((error) => {
        console.error('Erro ao importar jsPDF:', error)
        alert('Erro ao importar jsPDF: ' + error.message)
      })
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      alert('Erro ao gerar PDF: ' + error.message)
    }
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      <FileText size={16} />
      <span>Testar PDF</span>
    </button>
  )
}

export default TestPDFButton
