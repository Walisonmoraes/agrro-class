import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// String de conexão PostgreSQL
const connectionString = 'postgresql://postgres:[YOUR-PASSWORD]@db.sojtqrjnffrdfsyeutro.supabase.co:5432/postgres'

async function setupWithPostgres() {
  try {
    console.log('🚀 Tentando conectar diretamente ao PostgreSQL...')

    // Ler o arquivo SQL
    const sqlPath = path.join(__dirname, '../supabase/migrations/20240317000000_initial_schema.sql')
    const sqlSchema = fs.readFileSync(sqlPath, 'utf8')

    console.log('\n📋 Opções para configurar o banco:')
    console.log('\n1️⃣ Via painel Supabase (recomendado):')
    console.log('   - Acesse: https://sojtqrjnffrdfsyeutro.supabase.co')
    console.log('   - Vá para SQL Editor')
    console.log('   - Cole o SQL e execute')
    
    console.log('\n2️⃣ Via psql (se tiver PostgreSQL instalado):')
    console.log('   psql "postgresql://postgres:[SENHA]@db.sojtqrjnffrdfsyeutro.supabase.co:5432/postgres"')
    console.log('   Depois cole o SQL')
    
    console.log('\n3️⃣ Via ferramenta de BD (DBeaver, pgAdmin, etc):')
    console.log('   Host: db.sojtqrjnffrdfsyeutro.supabase.co')
    console.log('   Port: 5432')
    console.log('   Database: postgres')
    console.log('   User: postgres')
    console.log('   Password: [sua senha]')

    console.log('\n🔑 Após configurar, use:')
    console.log('   Email: admin@agroclass.com')
    console.log('   Senha: password')

  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

setupWithPostgres()
