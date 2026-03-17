const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Configuração do Supabase
const supabaseUrl = 'https://sbp_28170ac4b222e024164d2e5e8a99b01c6457471f.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNicF8yODE3MGFjNGIyMjJlMDI0MTY0ZDJlNWU4YTk5YjAxYzY0NTc0NzFmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzU4MzM3MCwiZXhwIjoyMDYzMTU5MzcwfQ.placeholder'

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  try {
    console.log('🚀 Iniciando setup do banco de dados Supabase...')

    // Ler o arquivo SQL
    const sqlPath = path.join(__dirname, '../supabase/migrations/20240317000000_initial_schema.sql')
    const sqlSchema = fs.readFileSync(sqlPath, 'utf8')

    // Dividir o SQL em statements individuais
    const statements = sqlSchema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

    console.log(`📝 Executando ${statements.length} comandos SQL...`)

    // Executar cada statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';'
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement })
        
        if (error) {
          console.log(`⚠️  Erro no comando ${i + 1}:`, error.message)
          // Continuar mesmo com erro
        } else {
          console.log(`✅ Comando ${i + 1}/${statements.length} executado`)
        }
      } catch (err) {
        console.log(`❌ Erro ao executar comando ${i + 1}:`, err.message)
      }
    }

    console.log('🎉 Setup do banco de dados concluído!')

    // Criar usuário administrador
    console.log('👤 Criando usuário administrador...')
    const { error: userError } = await supabase
      .from('users')
      .insert({
        name: 'Administrador',
        email: 'admin@agroclass.com',
        password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        role: 'ADMIN'
      })

    if (userError) {
      console.log('⚠️  Erro ao criar usuário admin:', userError.message)
    } else {
      console.log('✅ Usuário administrador criado com sucesso!')
    }

    // Criar alguns dados de exemplo
    console.log('📊 Criando dados de exemplo...')
    
    // Produtos
    const { error: productError } = await supabase
      .from('products')
      .insert([
        { name: 'Soja', code: 'SOJ001', type: 'Grão' },
        { name: 'Milho', code: 'MIL001', type: 'Grão' },
        { name: 'Trigo', code: 'TRI001', type: 'Grão' },
        { name: 'Feijão', code: 'FEJ001', type: 'Grão' }
      ])

    if (productError) {
      console.log('⚠️  Erro ao criar produtos:', productError.message)
    } else {
      console.log('✅ Produtos criados com sucesso!')
    }

    // Destinos
    const { error: destError } = await supabase
      .from('destinations')
      .insert([
        { name: 'Porto de Santos', address: 'Av. Rodrigues Alves, s/n', city: 'Santos', state: 'SP' },
        { name: 'Porto de Paranaguá', address: 'Av. Lauro Müller, s/n', city: 'Paranaguá', state: 'PR' },
        { name: 'Armazém Central', address: 'Rua Principal, 123', city: 'São Paulo', state: 'SP' }
      ])

    if (destError) {
      console.log('⚠️  Erro ao criar destinos:', destError.message)
    } else {
      console.log('✅ Destinos criados com sucesso!')
    }

    console.log('\n🎯 Setup completo! Use as seguintes credenciais para acessar:')
    console.log('   Email: admin@agroclass.com')
    console.log('   Senha: password')
    console.log('\n📱 URL do projeto: https://sbp_28170ac4b222e024164d2e5e8a99b01c6457471f.supabase.co')

  } catch (error) {
    console.error('❌ Erro fatal no setup:', error)
  }
}

setupDatabase()
