-- Criar tabela de laudos
CREATE TABLE laudos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_order_id UUID REFERENCES service_orders(id) ON DELETE CASCADE,
  classifier_id UUID REFERENCES users(id) ON DELETE CASCADE,
  laudo_number TEXT UNIQUE NOT NULL,
  classification_date DATE NOT NULL,
  client_name TEXT NOT NULL,
  product_name TEXT NOT NULL,
  origin_name TEXT NOT NULL,
  destination_name TEXT NOT NULL,
  embarkation_point_name TEXT NOT NULL,
  sample_number INTEGER NOT NULL,
  bag_number INTEGER NOT NULL,
  weight DECIMAL(10,2) NOT NULL,
  classification_result JSONB NOT NULL,
  observations TEXT,
  status TEXT DEFAULT 'DRAFT' CHECK(status IN ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX idx_laudos_service_order_id ON laudos(service_order_id);
CREATE INDEX idx_laudos_classifier_id ON laudos(classifier_id);
CREATE INDEX idx_laudos_status ON laudos(status);
CREATE INDEX idx_laudos_classification_date ON laudos(classification_date);
CREATE INDEX idx_laudos_laudo_number ON laudos(laudo_number);

-- Habilitar Row Level Security
ALTER TABLE laudos ENABLE ROW LEVEL SECURITY;

-- Criar políticas de segurança
CREATE POLICY "Users can view own laudos" ON laudos FOR SELECT USING (classifier_id = auth.uid()::text);
CREATE POLICY "Admins can view all laudos" ON laudos FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'ADMIN')
);
CREATE POLICY "Users can create laudos" ON laudos FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own laudos" ON laudos FOR UPDATE USING (classifier_id = auth.uid()::text);
CREATE POLICY "Admins can update all laudos" ON laudos FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'ADMIN')
);
