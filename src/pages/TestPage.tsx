import React from 'react'
import TestPDFButton from '../components/TestPDFButton'
import PDFButton from '../components/PDFButton'
import { LaudoData } from '../services/pdfService'

const TestPage: React.FC = () => {
  // Dados de teste
  const testData: LaudoData = {
    laudo_number: 'LAUDO/2024/TEST',
    classification_date: '2024-03-17',
    client_name: 'Cliente Teste',
    product_name: 'Soja',
    origin_name: 'Origem Teste',
    destination_name: 'Destino Teste',
    embarkation_point_name: 'Terminal Teste',
    sample_number: 1,
    bag_number: 100,
    weight: 60.5,
    classification_result: {
      umidade: '12.5%',
      impurezas: '1.2%',
      classificacao: 'Tipo 1'
    },
    observations: 'Teste de observações',
    classifier_name: 'Test User',
    status: 'APPROVED'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Teste de Funcionalidades PDF</h1>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Teste Básico</h2>
            <TestPDFButton />
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Teste Componente PDFButton</h2>
            <div className="space-y-4">
              <PDFButton laudoData={testData} variant="download" />
              <PDFButton laudoData={testData} variant="print" />
              <PDFButton laudoData={testData} variant="both" />
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Debug Info</h2>
            <div className="bg-gray-50 rounded p-4">
              <p className="text-sm text-gray-600">
                1. Abra o console do navegador (F12)<br />
                2. Clique nos botões acima<br />
                3. Verifique as mensagens no console<br />
                4. Verifique se o PDF é baixado
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestPage
