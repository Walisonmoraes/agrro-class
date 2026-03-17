import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuração do Supabase
const supabaseUrl = 'https://sbp_28170ac4b222e024164d2e5e8a99b01c6457471f.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNicF8yODE3MGFjNGIyMjJlMDI0MTY0ZDJlNWU4YTk5YjAxYzY0NTc0NzFmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzU4MzM3MCwiZXhwIjoyMDYzMTU5MzcwfQ.placeholder'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createTables() {
  try {
    console.log('🚀 Criando tabelas no Supabase...')

    // Tentar criar usuário admin
    console.log('👤 Verificando/criando usuário administrador...')
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@agroclass.com')
      .single()

    if (checkError && checkError.code === 'PGRST116') {
      console.log('⚠️  Tabela users não existe ou usuário não encontrado')
      console.log('📝 Por favor, execute o SQL manualmente no painel Supabase:')
      console.log('   1. Vá para: https://sbp_28170ac4b222e024164d2e5e8a99b01c6457471f.supabase.co')
      console.log('   2. Acesse SQL Editor')
      console.log('   3. Cole o conteúdo do arquivo supabase-schema.sql')
      console.log('   4. Execute o script')
    } else {
      console.log('✅ Usuário administrador já existe')
    }

    // Criar produtos de exemplo
    console.log('📊 Criando produtos de exemplo...')
    try {
      const { error: insertProductsError } = await supabase
        .from('products')
        .upsert([
          { name: 'Soja', code: 'SOJ001', type: 'Grão' },
          { name: 'Milho', code: 'MIL001', type: 'Grão' },
          { name: 'Trigo', code: 'TRI001', type: 'Grão' },
          { name: 'Feijão', code: 'FEJ001', type: 'Grão' }
        ], { onConflict: 'code' })

      if (insertProductsError) {
        console.log('⚠️  Erro ao criar produtos:', insertProductsError.message)
      } else {
        console.log('✅ Produtos criados!')
      }
    } catch (err) {
      console.log('⚠️  Tabela products não existe ainda')
    }

    console.log('\n🎯 Setup parcial completo!')
    console.log('   Email: admin@agroclass.com')
    console.log('   Senha: password')
    console.log('\n📱 URL do projeto: https://sbp_28170ac4b222e024164d2e5e8a99b01c6457471f.supabase.co')
    console.log('\n📝 Próximo passo: Execute o SQL manualmente no painel Supabase')

  } catch (error) {
    console.error('❌ Erro no setup:', error.message)
  }
}

createTables()
