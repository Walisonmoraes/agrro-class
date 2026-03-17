import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuração do Supabase
const supabaseUrl = 'https://sojtqrjnffrdfsyeutro.supabase.co'
const supabaseKey = 'sb_publishable_pqbvysG-vZ4pCCp6pOJG_Q_KfOBTKMo'

async function executeSQLDirectly() {
  try {
    console.log('🚀 Executando SQL diretamente no Supabase...')

    // Ler o arquivo SQL
    const sqlPath = path.join(__dirname, '../supabase/migrations/20240317000000_initial_schema.sql')
    const sqlSchema = fs.readFileSync(sqlPath, 'utf8')

    // Dividir o SQL em statements individuais
    const statements = sqlSchema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

    console.log(`📝 Executando ${statements.length} comandos SQL...`)

    // Executar cada statement via REST API
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';'
      
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          },
          body: JSON.stringify({ sql: statement })
        })

        if (!response.ok) {
          const error = await response.text()
          console.log(`⚠️  Erro no comando ${i + 1}:`, error)
        } else {
          console.log(`✅ Comando ${i + 1}/${statements.length} executado`)
        }
      } catch (err) {
        console.log(`❌ Erro ao executar comando ${i + 1}:`, err.message)
      }

      // Pequeno delay para não sobrecarregar
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    console.log('\n🎉 SQL executado com sucesso!')

    // Agora inserir os dados iniciais
    console.log('\n📊 Inserindo dados iniciais...')
    await insertInitialData()

  } catch (error) {
    console.error('❌ Erro fatal:', error.message)
  }
}

async function insertInitialData() {
  try {
    // Inserir usuário admin
    console.log('👤 Criando usuário administrador...')
    
    const adminResponse = await fetch(`${supabaseUrl}/rest/v1/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        name: 'Administrador',
        email: 'admin@agroclass.com',
        password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role: 'ADMIN'
      })
    })

    if (adminResponse.ok) {
      console.log('✅ Usuário administrador criado!')
    } else {
      console.log('⚠️  Usuário admin pode já existir')
    }

    // Inserir produtos
    console.log('📦 Inserindo produtos...')
    const products = [
      { name: 'Soja', code: 'SOJ001', type: 'Grão' },
      { name: 'Milho', code: 'MIL001', type: 'Grão' },
      { name: 'Trigo', code: 'TRI001', type: 'Grão' },
      { name: 'Feijão', code: 'FEJ001', type: 'Grão' },
      { name: 'Arroz', code: 'ARR001', type: 'Grão' },
      { name: 'Algodão', code: 'ALG001', type: 'Fibra' }
    ]

    for (const product of products) {
      const productResponse = await fetch(`${supabaseUrl}/rest/v1/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(product)
      })
    }
    console.log('✅ Produtos inseridos!')

    // Inserir destinos
    console.log('📍 Inserindo destinos...')
    const destinations = [
      { name: 'Porto de Santos', address: 'Av. Rodrigues Alves, s/n', city: 'Santos', state: 'SP' },
      { name: 'Porto de Paranaguá', address: 'Av. Lauro Müller, s/n', city: 'Paranaguá', state: 'PR' },
      { name: 'Porto de Rio Grande', address: 'Av. Presidente Vargas, nº 400', city: 'Rio Grande', state: 'RS' },
      { name: 'Armazém Central São Paulo', address: 'Rua das Indústrias, 123', city: 'São Paulo', state: 'SP' },
      { name: 'Terminal de Cargas Curitiba', address: 'Av. Mal. Floriano, 1000', city: 'Curitiba', state: 'PR' }
    ]

    for (const destination of destinations) {
      const destResponse = await fetch(`${supabaseUrl}/rest/v1/destinations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(destination)
      })
    }
    console.log('✅ Destinos inseridos!')

    // Inserir pontos de embarque
    console.log('🚢 Inserindo pontos de embarque...')
    const embarkPoints = [
      { name: 'Terminal 1 - Santos', address: 'Rua A, 100', city: 'Santos', state: 'SP' },
      { name: 'Terminal 2 - Paranaguá', address: 'Rua B, 200', city: 'Paranaguá', state: 'PR' },
      { name: 'Terminal 3 - Rio Grande', address: 'Rua C, 300', city: 'Rio Grande', state: 'RS' },
      { name: 'Plataforma A - São Paulo', address: 'Rodovia Anhanguera, km 20', city: 'São Paulo', state: 'SP' }
    ]

    for (const point of embarkPoints) {
      const embarkResponse = await fetch(`${supabaseUrl}/rest/v1/embarkation_points`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(point)
      })
    }
    console.log('✅ Pontos de embarque inseridos!')

    // Inserir cliente de exemplo
    console.log('🏭 Inserindo cliente de exemplo...')
    const clientResponse = await fetch(`${supabaseUrl}/rest/v1/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        name: 'Fazenda Boa Vista',
        document: '12.345.678/0001-90',
        trading_name: 'Fazenda Boa Vista Ltda',
        cep: '12345-678',
        street: 'Rua Principal',
        number: '100',
        neighborhood: 'Centro',
        city: 'Ribeirão Preto',
        state: 'SP',
        phone: '(16) 1234-5678',
        email: 'contato@boavista.com.br',
        tariff: 150.00,
        cadence: 2.5,
        daily_rate: 500.00,
        contact_person: 'João da Silva'
      })
    })

    if (clientResponse.ok) {
      console.log('✅ Cliente inserido!')
    }

    console.log('\n🎉 Setup completo!')
    console.log('🔑 Credenciais de acesso:')
    console.log('   Email: admin@agroclass.com')
    console.log('   Senha: password')
    console.log('\n📱 URL do projeto: https://sojtqrjnffrdfsyeutro.supabase.co')
    console.log('\n✅ Agora você pode iniciar o servidor: npm run dev')

  } catch (error) {
    console.error('❌ Erro ao inserir dados:', error.message)
  }
}

executeSQLDirectly()
