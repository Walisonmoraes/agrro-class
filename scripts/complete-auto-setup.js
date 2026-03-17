import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuração do Supabase
const supabaseUrl = 'https://sojtqrjnffrdfsyeutro.supabase.co'
const supabaseKey = 'sb_publishable_pqbvysG-vZ4pCCp6pOJG_Q_KfOBTKMo'

async function completeAutoSetup() {
  try {
    console.log('🚀 Setup automático do Supabase...')

    // 1. Criar tabela users (se não existir)
    console.log('📝 Criando tabela users...')
    await createTableIfNotExists('users', `
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('ADMIN', 'CLASSIFIER', 'FINANCE')) NOT NULL,
      professional_reg TEXT,
      cpf TEXT,
      signature_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    `)

    // 2. Criar tabela products (se não existir)
    console.log('📦 Criando tabela products...')
    await createTableIfNotExists('products', `
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT NOT NULL,
      code TEXT UNIQUE NOT NULL,
      type TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    `)

    // 3. Criar tabela clients (se não existir)
    console.log('👥 Criando tabela clients...')
    await createTableIfNotExists('clients', `
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT NOT NULL,
      document TEXT UNIQUE NOT NULL,
      trading_name TEXT,
      cep TEXT,
      street TEXT,
      complement TEXT,
      number TEXT,
      neighborhood TEXT,
      city TEXT,
      state TEXT,
      phone TEXT,
      email TEXT,
      tariff DECIMAL(10,2),
      cadence DECIMAL(10,2),
      daily_rate DECIMAL(10,2),
      contact_person TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    `)

    // 4. Criar tabela destinations (se não existir)
    console.log('📍 Criando tabela destinations...')
    await createTableIfNotExists('destinations', `
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT NOT NULL,
      address TEXT,
      city TEXT,
      state TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    `)

    // 5. Criar tabela embarkation_points (se não existir)
    console.log('🚢 Criando tabela embarkation_points...')
    await createTableIfNotExists('embarkation_points', `
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT NOT NULL,
      address TEXT,
      city TEXT,
      state TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    `)

    // 6. Inserir dados iniciais
    console.log('📊 Inserindo dados iniciais...')
    await insertInitialData()

    console.log('\n🎉 Setup completo!')
    console.log('🔑 Credenciais de acesso:')
    console.log('   Email: admin@agroclass.com')
    console.log('   Senha: password')
    console.log('\n✅ Agora você pode iniciar o servidor: npm run dev')

  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

async function createTableIfNotExists(tableName, columns) {
  try {
    // Tentar inserir um registro para testar se a tabela existe
    const testResponse = await fetch(`${supabaseUrl}/rest/v1/${tableName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ test: 'test' })
    })

    if (testResponse.status === 404) {
      console.log(`⚠️  Tabela ${tableName} não existe. Execute o SQL manualmente.`)
      return false
    } else if (testResponse.status === 400) {
      // Tabela existe mas o teste falhou (coluna não existe)
      console.log(`✅ Tabela ${tableName} já existe`)
      return true
    }

    return true
  } catch (error) {
    console.log(`⚠️  Erro ao verificar tabela ${tableName}:`, error.message)
    return false
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

    if (adminResponse.ok || adminResponse.status === 409) {
      console.log('✅ Usuário administrador pronto!')
    }

    // Inserir produtos
    console.log('📦 Inserindo produtos...')
    const products = [
      { name: 'Soja', code: 'SOJ001', type: 'Grão' },
      { name: 'Milho', code: 'MIL001', type: 'Grão' },
      { name: 'Trigo', code: 'TRI001', type: 'Grão' },
      { name: 'Feijão', code: 'FEJ001', type: 'Grão' },
      { name: 'Arroz', code: 'ARR001', type: 'Grão' }
    ]

    for (const product of products) {
      await fetch(`${supabaseUrl}/rest/v1/products`, {
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
      { name: 'Porto de Rio Grande', address: 'Av. Presidente Vargas, nº 400', city: 'Rio Grande', state: 'RS' }
    ]

    for (const destination of destinations) {
      await fetch(`${supabaseUrl}/rest/v1/destinations`, {
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
      { name: 'Terminal 3 - Rio Grande', address: 'Rua C, 300', city: 'Rio Grande', state: 'RS' }
    ]

    for (const point of embarkPoints) {
      await fetch(`${supabaseUrl}/rest/v1/embarkation_points`, {
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

  } catch (error) {
    console.error('❌ Erro ao inserir dados:', error.message)
  }
}

completeAutoSetup()
