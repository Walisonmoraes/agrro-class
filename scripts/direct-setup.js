import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuração do Supabase
const supabaseUrl = 'https://sojtqrjnffrdfsyeutro.supabase.co'
const supabaseKey = 'sb_publishable_pqbvysG-vZ4pCCp6pOJG_Q_KfOBTKMo'

async function setupWithDirectAPI() {
  try {
    console.log('🚀 Configurando Supabase via API REST...')

    // Ler o arquivo SQL
    const sqlPath = path.join(__dirname, '../supabase/migrations/20240317000000_initial_schema.sql')
    const sqlSchema = fs.readFileSync(sqlPath, 'utf8')

    console.log('\n📋 Para completar o setup, siga estes passos:')
    console.log('1️⃣ Acesse: https://sojtqrjnffrdfsyeutro.supabase.co')
    console.log('2️⃣ Vá para SQL Editor (ícone de folha com >)')
    console.log('3️⃣ Copie o SQL abaixo:')
    console.log('\n' + '='.repeat(60))
    console.log(sqlSchema)
    console.log('='.repeat(60))
    console.log('\n4️⃣ Clique em "Run" para executar')
    console.log('\n5️⃣ Depois de executar, rode: node scripts/insert-data.js')

    console.log('\n🔑 Credenciais de acesso:')
    console.log('   Email: admin@agroclass.com')
    console.log('   Senha: password')

    console.log('\n⚡ Alternativa rápida:')
    console.log('   Se você já executou o SQL, apenas rode:')
    console.log('   npm run dev')

  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

setupWithDirectAPI()
