import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuração do Supabase
const supabaseUrl = 'https://sojtqrjnffrdfsyeutro.supabase.co'
const supabaseKey = 'sb_publishable_pqbvysG-vZ4pCCp6pOJG_Q_KfOBTKMo'

async function checkTables() {
  try {
    console.log('🔍 Verificando tabelas no Supabase...')

    // Lista de tabelas para verificar
    const tables = ['users', 'products', 'clients', 'destinations', 'embarkation_points', 'origins', 'service_orders', 'classification_results', 'bills']

    console.log('\n📋 Status das tabelas:')
    
    for (const tableName of tables) {
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/${tableName}?limit=1`, {
          method: 'GET',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          console.log(`✅ ${tableName}: EXISTE (${data.length} registros)`)
        } else if (response.status === 404) {
          console.log(`❌ ${tableName}: NÃO EXISTE`)
        } else {
          console.log(`⚠️  ${tableName}: ERRO (${response.status})`)
        }
      } catch (error) {
        console.log(`❌ ${tableName}: ERRO DE CONEXÃO`)
      }
    }

    console.log('\n🎯 Para ver as tabelas no painel Supabase:')
    console.log('1. No menu lateral, clique em "Table Editor" (ícone de tabela)')
    console.log('2. As tabelas aparecerão na lista esquerda')
    console.log('3. Clique em qualquer tabela para ver os dados')

    console.log('\n📝 Se as tabelas não existirem, execute:')
    console.log('node scripts/direct-setup.js')
    console.log('E copie o SQL para o SQL Editor')

  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

checkTables()
