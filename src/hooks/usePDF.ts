import { useState } from 'react'
import { LaudoData } from '../services/pdfService'
import { generateLaudoPDF, generateLaudoPDFFromHTML, printLaudo } from '../services/pdfService'

export const usePDF = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generatePDF = async (laudoData: LaudoData, elementId?: string) => {
    setIsGenerating(true)
    setError(null)
    
    try {
      if (elementId) {
        await generateLaudoPDFFromHTML(elementId, laudoData.laudo_number)
      } else {
        await generateLaudoPDF(laudoData)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao gerar PDF'
      setError(errorMessage)
      throw err
    } finally {
      setIsGenerating(false)
    }
  }

  const printDocument = (elementId: string) => {
    try {
      printLaudo(elementId)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao imprimir'
      setError(errorMessage)
      throw err
    }
  }

  const generateAndPrint = async (laudoData: LaudoData) => {
    setIsGenerating(true)
    setError(null)
    
    try {
      // Gera o PDF em uma nova janela para impressão
      await generateLaudoPDF(laudoData)
      
      // Abre diálogo de impressão
      setTimeout(() => {
        window.print()
      }, 1000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao gerar e imprimir PDF'
      setError(errorMessage)
      throw err
    } finally {
      setIsGenerating(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  return {
    generatePDF,
    printDocument,
    generateAndPrint,
    isGenerating,
    error,
    clearError
  }
}
