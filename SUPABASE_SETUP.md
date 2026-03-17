# Configuração do Supabase para AgroClass

## Passos para configurar o banco de dados Supabase

### 1. Criar projeto Supabase
1. Acesse https://supabase.com
2. Crie uma conta ou faça login
3. Clique em "New Project"
4. Escolha uma organização
5. Nomeie o projeto como "agroclass"
6. Defina uma senha forte para o banco de dados
7. Aguarde a criação do projeto

### 2. Obter credenciais
1. No dashboard do Supabase, vá para Settings > API
2. Copie a **Project URL** 
3. Copie a **anon public key**
4. Copie a **service_role key** (se necessário)

### 3. Configurar variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto com:

```env
VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
JWT_SECRET=agro-secret-key-2024
```

### 4. Executar script SQL
1. No dashboard Supabase, vá para SQL Editor
2. Cole o conteúdo do arquivo `supabase-schema.sql`
3. Execute o script para criar as tabelas

### 5. Criar usuário administrador
Execute o seguinte SQL no SQL Editor:

```sql
INSERT INTO users (name, email, password, role) 
VALUES (
  'Administrador', 
  'admin@agroclass.com', 
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
  'ADMIN'
);
```

*Senha: `password`*

### 6. Configurar Row Level Security (RLS)
As políticas RLS já estão incluídas no schema, mas você pode ajustá-las conforme necessário.

### 7. Testar a conexão
1. Inicie o projeto: `npm run dev`
2. Acesse http://localhost:3000
3. Faça login com:
   - Email: admin@agroclass.com
   - Senha: password

## Estrutura das Tabelas

### Principais tabelas:
- **users**: Usuários do sistema
- **clients**: Clientes/Fazendas
- **origins**: Origens (fazendas específicas)
- **products**: Produtos para classificação
- **destinations**: Destinos dos grãos
- **embarkation_points**: Pontos de embarque
- **service_orders**: Ordens de serviço
- **classification_results**: Resultados das classificações
- **bills**: Faturas/Cobranças

## Migração do SQLite para Supabase

Se você tem dados no arquivo `agroclass.db` (SQLite), pode migrar usando:

1. Exportar dados do SQLite
2. Importar para Supabase usando o SQL Editor ou ferramentas como o DBeaver

## Backup e Manutenção

- O Supabase faz backup automático
- Configure backups adicionais se necessário
- Monitore o uso do banco no dashboard

## Suporte

- Documentação Supabase: https://supabase.com/docs
- Issues do projeto: GitHub repository
