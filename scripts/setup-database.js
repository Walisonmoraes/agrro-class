import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuração do Supabase com a chave de serviço
const supabaseUrl = 'https://sojtqrjnffrdfsyeutro.supabase.co'
const supabaseKey = 'sb_publishable_pqbvysG-vZ4pCCp6pOJG_Q_KfOBTKMo'

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  try {
    console.log('🚀 Configurando banco de dados Supabase...')
    console.log('📱 URL:', supabaseUrl)

    // Ler o arquivo SQL
    const sqlPath = path.join(__dirname, '../supabase/migrations/20240317000000_initial_schema.sql')
    const sqlSchema = fs.readFileSync(sqlPath, 'utf8')

    console.log('📝 Executando schema SQL...')
    console.log('\n⚠️  ATENÇÃO: Por favor, execute manualmente os seguintes passos:')
    console.log('1. Acesse: https://sojtqrjnffrdfsyeutro.supabase.co')
    console.log('2. Vá para SQL Editor')
    console.log('3. Cole o conteúdo abaixo:')
    console.log('\n' + '='.repeat(50))
    console.log(sqlSchema)
    console.log('='.repeat(50))
    console.log('\n4. Clique em "Run" para executar')
    console.log('\nApós executar, o sistema estará pronto para usar!')
    console.log('\n🔑 Credenciais de acesso:')
    console.log('   Email: admin@agroclass.com')
    console.log('   Senha: password')

  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

setupDatabase()
