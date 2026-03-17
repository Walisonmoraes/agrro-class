-- Create tables for AgroClass system

-- Users table
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

-- Clients table
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

-- Origins table (Farms)
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

-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Destinations table
CREATE TABLE destinations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Embarkation points table
CREATE TABLE embarkation_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service orders table
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

-- Classification results table
CREATE TABLE classification_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_order_id UUID REFERENCES service_orders(id) ON DELETE CASCADE,
  classifier_id UUID REFERENCES users(id) ON DELETE CASCADE,
  sample_number INTEGER,
  bag_number INTEGER,
  weight DECIMAL(10,2),
  classification_result JSONB, -- Store classification details as JSON
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bills table
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

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_clients_document ON clients(document);
CREATE INDEX idx_service_orders_client_id ON service_orders(client_id);
CREATE INDEX idx_service_orders_status ON service_orders(status);
CREATE INDEX idx_classification_results_service_order_id ON classification_results(service_order_id);
CREATE INDEX idx_bills_service_order_id ON bills(service_order_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE origins ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE embarkation_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE classification_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (you can adjust these based on your security requirements)
-- Users can see their own data, admins can see all
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (role = 'ADMIN');

-- Service orders policies
CREATE POLICY "Users can view service orders" ON service_orders FOR SELECT USING (true);
CREATE POLICY "Users can create service orders" ON service_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update service orders" ON service_orders FOR UPDATE USING (true);

-- Similar policies for other tables...
CREATE POLICY "Users can view all data" ON clients FOR SELECT USING (true);
CREATE POLICY "Users can create clients" ON clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update clients" ON clients FOR UPDATE USING (true);

CREATE POLICY "Users can view origins" ON origins FOR SELECT USING (true);
CREATE POLICY "Users can create origins" ON origins FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update origins" ON origins FOR UPDATE USING (true);

-- Add more policies as needed for other tables
