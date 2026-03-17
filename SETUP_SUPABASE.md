# Setup do Supabase para AgroClass

## 🚀 Configuração Rápida

### 1. Executar SQL no Supabase
1. Acesse: https://sojtqrjnffrdfsyeutro.supabase.co
2. Vá para **SQL Editor** (menu lateral)
3. Copie e cole o conteúdo do arquivo: `supabase/migrations/20240317000000_initial_schema.sql`
4. Clique em **Run** para executar

### 2. Inserir Dados Iniciais
Após executar o SQL, rode:
```bash
node scripts/insert-data.js
```

### 3. Iniciar o Projeto
```bash
npm run dev
```

## 🔑 Credenciais de Acesso
- **Email:** admin@agroclass.com
- **Senha:** password

## 📱 URLs Importantes
- **Projeto Supabase:** https://sojtqrjnffrdfsyeutro.supabase.co
- **Aplicação Local:** http://localhost:3000
- **Banco de Dados:** postgresql://postgres:[SENHA]@db.sojtqrjnffrdfsyeutro.supabase.co:5432/postgres

## 🗂️ Estrutura do Banco

### Tabelas Principais:
- **users** - Usuários do sistema
- **clients** - Clientes/Fazendas
- **origins** - Origens (fazendas específicas)
- **products** - Produtos para classificação
- **destinations** - Destinos dos grãos
- **embarkation_points** - Pontos de embarque
- **service_orders** - Ordens de serviço
- **classification_results** - Resultados das classificações
- **bills** - Faturas/Cobranças

## 📊 Dados de Exemplo Incluídos:
- 1 Usuário Administrador
- 6 Produtos (Soja, Milho, Trigo, Feijão, Arroz, Algodão)
- 5 Destinos (Portos e Terminais)
- 4 Pontos de Embarque
- 1 Cliente de Exemplo

## 🔧 Configuração do Ambiente

O arquivo `.env` já está configurado com:
```
VITE_SUPABASE_URL=https://sojtqrjnffrdfsyeutro.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_pqbvysG-vZ4pCCp6pOJG_Q_KfOBTKMo
JWT_SECRET=agro-secret-key-2024
```

## 🚨 Troubleshooting

### Se as tabelas não existirem:
- Execute o script SQL manualmente no painel
- Verifique se não houve erros durante a execução

### Se não conseguir inserir dados:
- Verifique se as tabelas foram criadas
- Confirme se as políticas RLS estão ativas

### Se o login não funcionar:
- Verifique se o usuário admin foi criado
- Confirme a senha: `password`

## 📝 Próximos Passos

1. **Testar o sistema:** Faça login com as credenciais
2. **Criar mais usuários:** Use a tela de gerenciamento
3. **Cadastrar clientes:** Adicione fazendas reais
4. **Criar ordens de serviço:** Teste o fluxo completo
5. **Configurar backups:** No painel do Supabase

## 🆘 Suporte

- **Documentação Supabase:** https://supabase.com/docs
- **Repositório GitHub:** https://github.com/Walisonmoraes/agrro-class
- **Issues:** Reporte problemas no GitHub
