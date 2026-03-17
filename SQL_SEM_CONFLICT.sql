-- Criar tabela de usuários
CREATE TABLE users (
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
);

-- Criar tabela de produtos
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de clientes
CREATE TABLE clients (
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
);

-- Criar tabela de destinos
CREATE TABLE destinations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de pontos de embarque
CREATE TABLE embarkation_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de origens (fazendas)
CREATE TABLE origins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  farm_name TEXT NOT NULL,
  producer_name TEXT NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  city TEXT,
  state TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de ordens de serviço
CREATE TABLE service_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  origin_id UUID REFERENCES origins(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
  embarkation_point_id UUID REFERENCES embarkation_points(id) ON DELETE CASCADE,
  classification_date DATE,
  classification_start_time TIME,
  classification_end_time TIME,
  status TEXT DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
  total_bags INTEGER,
  total_weight DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de resultados de classificação
CREATE TABLE classification_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_order_id UUID REFERENCES service_orders(id) ON DELETE CASCADE,
  classifier_id UUID REFERENCES users(id) ON DELETE CASCADE,
  sample_number INTEGER,
  bag_number INTEGER,
  weight DECIMAL(10,2),
  classification_result JSONB,
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de faturas
CREATE TABLE bills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_order_id UUID REFERENCES service_orders(id) ON DELETE CASCADE,
  bill_number TEXT UNIQUE NOT NULL,
  issue_date DATE,
  due_date DATE,
  total_amount DECIMAL(10,2),
  status TEXT DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'PAID', 'OVERDUE', 'CANCELLED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir usuário administrador
INSERT INTO users (name, email, password, role)
VALUES ('Administrador', 'admin@agroclass.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN');

-- Inserir produtos
INSERT INTO products (name, code, type) VALUES
  ('Soja', 'SOJ001', 'Grão'),
  ('Milho', 'MIL001', 'Grão'),
  ('Trigo', 'TRI001', 'Grão'),
  ('Feijão', 'FEJ001', 'Grão'),
  ('Arroz', 'ARR001', 'Grão'),
  ('Algodão', 'ALG001', 'Fibra');

-- Inserir destinos
INSERT INTO destinations (name, address, city, state) VALUES
  ('Porto de Santos', 'Av. Rodrigues Alves, s/n', 'Santos', 'SP'),
  ('Porto de Paranaguá', 'Av. Lauro Müller, s/n', 'Paranaguá', 'PR'),
  ('Porto de Rio Grande', 'Av. Presidente Vargas, nº 400', 'Rio Grande', 'RS'),
  ('Armazém Central São Paulo', 'Rua das Indústrias, 123', 'São Paulo', 'SP');

-- Inserir pontos de embarque
INSERT INTO embarkation_points (name, address, city, state) VALUES
  ('Terminal 1 - Santos', 'Rua A, 100', 'Santos', 'SP'),
  ('Terminal 2 - Paranaguá', 'Rua B, 200', 'Paranaguá', 'PR'),
  ('Terminal 3 - Rio Grande', 'Rua C, 300', 'Rio Grande', 'RS'),
  ('Plataforma A - São Paulo', 'Rodovia Anhanguera, km 20', 'São Paulo', 'SP');

-- Inserir cliente de exemplo
INSERT INTO clients (name, document, trading_name, cep, street, number, neighborhood, city, state, phone, email, tariff, cadence, daily_rate, contact_person)
VALUES (
  'Fazenda Boa Vista', 
  '12.345.678/0001-90', 
  'Fazenda Boa Vista Ltda', 
  '12345-678', 
  'Rua Principal', 
  '100', 
  'Centro', 
  'Ribeirão Preto', 
  'SP', 
  '(16) 1234-5678', 
  'contato@boavista.com.br', 
  150.00, 
  2.5, 
  500.00, 
  'João da Silva'
);
