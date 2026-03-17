import { createClient } from '@supabase/supabase-js'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuração do Supabase
const supabaseUrl = 'https://sojtqrjnffrdfsyeutro.supabase.co'
const supabaseKey = 'sb_publishable_pqbvysG-vZ4pCCp6pOJG_Q_KfOBTKMo'

const supabase = createClient(supabaseUrl, supabaseKey)

async function insertData() {
  try {
    console.log('🚀 Inserindo dados no Supabase...')

    // 1. Criar usuário administrador
    console.log('👤 Criando usuário administrador...')
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@agroclass.com')
      .single()

    if (checkError && checkError.code === 'PGRST116') {
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          name: 'Administrador',
          email: 'admin@agroclass.com',
          password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
          role: 'ADMIN'
        })

      if (insertError) {
        console.log('❌ Erro ao criar usuário admin:', insertError.message)
      } else {
        console.log('✅ Usuário administrador criado!')
      }
    } else {
      console.log('✅ Usuário administrador já existe')
    }

    // 2. Inserir produtos
    console.log('📦 Inserindo produtos...')
    const { error: productsError } = await supabase
      .from('products')
      .upsert([
        { name: 'Soja', code: 'SOJ001', type: 'Grão' },
        { name: 'Milho', code: 'MIL001', type: 'Grão' },
        { name: 'Trigo', code: 'TRI001', type: 'Grão' },
        { name: 'Feijão', code: 'FEJ001', type: 'Grão' },
        { name: 'Arroz', code: 'ARR001', type: 'Grão' },
        { name: 'Algodão', code: 'ALG001', type: 'Fibra' }
      ], { onConflict: 'code' })

    if (productsError) {
      console.log('❌ Erro ao inserir produtos:', productsError.message)
    } else {
      console.log('✅ Produtos inseridos!')
    }

    // 3. Inserir destinos
    console.log('📍 Inserindo destinos...')
    const { error: destError } = await supabase
      .from('destinations')
      .upsert([
        { name: 'Porto de Santos', address: 'Av. Rodrigues Alves, s/n', city: 'Santos', state: 'SP' },
        { name: 'Porto de Paranaguá', address: 'Av. Lauro Müller, s/n', city: 'Paranaguá', state: 'PR' },
        { name: 'Porto de Rio Grande', address: 'Av. Presidente Vargas, nº 400', city: 'Rio Grande', state: 'RS' },
        { name: 'Armazém Central São Paulo', address: 'Rua das Indústrias, 123', city: 'São Paulo', state: 'SP' },
        { name: 'Terminal de Cargas Curitiba', address: 'Av. Mal. Floriano, 1000', city: 'Curitiba', state: 'PR' }
      ], { onConflict: 'name' })

    if (destError) {
      console.log('❌ Erro ao inserir destinos:', destError.message)
    } else {
      console.log('✅ Destinos inseridos!')
    }

    // 4. Inserir pontos de embarque
    console.log('🚢 Inserindo pontos de embarque...')
    const { error: embarkError } = await supabase
      .from('embarkation_points')
      .upsert([
        { name: 'Terminal 1 - Santos', address: 'Rua A, 100', city: 'Santos', state: 'SP' },
        { name: 'Terminal 2 - Paranaguá', address: 'Rua B, 200', city: 'Paranaguá', state: 'PR' },
        { name: 'Terminal 3 - Rio Grande', address: 'Rua C, 300', city: 'Rio Grande', state: 'RS' },
        { name: 'Plataforma A - São Paulo', address: 'Rodovia Anhanguera, km 20', city: 'São Paulo', state: 'SP' }
      ], { onConflict: 'name' })

    if (embarkError) {
      console.log('❌ Erro ao inserir pontos de embarque:', embarkError.message)
    } else {
      console.log('✅ Pontos de embarque inseridos!')
    }

    // 5. Inserir cliente de exemplo
    console.log('🏭 Inserindo cliente de exemplo...')
    const { error: clientError } = await supabase
      .from('clients')
      .upsert({
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
      }, { onConflict: 'document' })

    if (clientError) {
      console.log('❌ Erro ao inserir cliente:', clientError.message)
    } else {
      console.log('✅ Cliente inserido!')
    }

    console.log('\n🎉 Setup completo!')
    console.log('🔑 Credenciais de acesso:')
    console.log('   Email: admin@agroclass.com')
    console.log('   Senha: password')
    console.log('\n📱 URL do projeto: https://sojtqrjnffrdfsyeutro.supabase.co')
    console.log('\n✅ Agora você pode iniciar o servidor: npm run dev')

  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

insertData()
