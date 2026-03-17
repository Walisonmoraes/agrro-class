import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Database from "better-sqlite3";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const db = new Database("agroclass.db");
const JWT_SECRET = process.env.JWT_SECRET || "agro-secret-key-2024";

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('ADMIN', 'CLASSIFIER', 'FINANCE')) NOT NULL,
    professional_reg TEXT,
    cpf TEXT,
    signature_url TEXT
  );

  CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
    tariff REAL,
    cadence REAL,
    daily_rate REAL,
    contact_person TEXT
  );

  CREATE TABLE IF NOT EXISTS origins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    farm_name TEXT NOT NULL,
    producer_name TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    client_id INTEGER,
    FOREIGN KEY(client_id) REFERENCES clients(id)
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS embarkation_points (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS destinations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    city TEXT,
    state TEXT
  );

  CREATE TABLE IF NOT EXISTS service_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    os_number TEXT UNIQUE NOT NULL,
    client_id INTEGER NOT NULL,
    origin_id INTEGER,
    embarkation_id INTEGER,
    destination_id INTEGER,
    product_id INTEGER NOT NULL,
    contract_number TEXT,
    lot_weight REAL,
    producer_name TEXT,
    quantity REAL NOT NULL,
    unit TEXT CHECK(unit IN ('TON', 'SACA', 'KG')) NOT NULL,
    date TEXT NOT NULL,
    classifier_id INTEGER NOT NULL,
    status TEXT CHECK(status IN ('OPEN', 'ANALYZING', 'FINISHED', 'BILLED')) DEFAULT 'OPEN',
    FOREIGN KEY(client_id) REFERENCES clients(id),
    FOREIGN KEY(origin_id) REFERENCES origins(id),
    FOREIGN KEY(embarkation_id) REFERENCES embarkation_points(id),
    FOREIGN KEY(destination_id) REFERENCES destinations(id),
    FOREIGN KEY(product_id) REFERENCES products(id),
    FOREIGN KEY(classifier_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS classification_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    os_id INTEGER UNIQUE NOT NULL,
    classifier_id INTEGER,
    date TEXT,
    license_plate TEXT,
    weight_kg REAL,
    carrier TEXT,
    invoice_url TEXT,
    test_type TEXT,
    live_insects TEXT,
    dead_insects TEXT,
    odor TEXT,
    toxicity TEXT,
    burnt_and_scorched REAL,
    scorched REAL,
    moldy REAL,
    fermented REAL,
    germinated REAL,
    shriveled REAL,
    damaged_total REAL,
    immature REAL,
    humidity REAL,
    impurities REAL,
    greenish REAL,
    broken_crushed REAL,
    observations TEXT,
    final_classification TEXT,
    discounts_json TEXT,
    signature_date TEXT,
    FOREIGN KEY(os_id) REFERENCES service_orders(id),
    FOREIGN KEY(classifier_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS billing (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    os_id INTEGER UNIQUE NOT NULL,
    price_per_unit REAL NOT NULL,
    total_amount REAL NOT NULL,
    status TEXT CHECK(status IN ('PENDING', 'PAID')) DEFAULT 'PENDING',
    payment_date TEXT,
    FOREIGN KEY(os_id) REFERENCES service_orders(id)
  );
`);

// Migration: Add cpf column to users if it doesn't exist
try {
  db.prepare("ALTER TABLE users ADD COLUMN cpf TEXT").run();
} catch (e) {
  // Column might already exist
}

// Migration: Add city and state to destinations if they don't exist
try {
  db.prepare("ALTER TABLE destinations ADD COLUMN city TEXT").run();
} catch (e) {}
try {
  db.prepare("ALTER TABLE destinations ADD COLUMN state TEXT").run();
} catch (e) {}

// Migration: Add date column to classification_reports if it doesn't exist
try {
  db.prepare("ALTER TABLE classification_reports ADD COLUMN date TEXT").run();
} catch (e) {}

try {
  db.prepare("ALTER TABLE classification_reports ADD COLUMN final_classification TEXT").run();
} catch (e) {}

try {
  db.prepare("ALTER TABLE classification_reports ADD COLUMN humidity REAL").run();
} catch (e) {}

try {
  db.prepare("ALTER TABLE classification_reports ADD COLUMN impurities REAL").run();
} catch (e) {}

try {
  db.prepare("ALTER TABLE classification_reports ADD COLUMN classifier_id INTEGER").run();
} catch (e) {}

try {
  db.prepare("ALTER TABLE classification_reports ADD COLUMN signature_date TEXT").run();
} catch (e) {}

try {
  db.prepare("ALTER TABLE classification_reports ADD COLUMN discounts_json TEXT").run();
} catch (e) {}

try {
  db.prepare("ALTER TABLE classification_reports ADD COLUMN license_plate TEXT").run();
} catch (e) {}

try {
  db.prepare("ALTER TABLE classification_reports ADD COLUMN weight_kg REAL").run();
} catch (e) {}

try {
  db.prepare("ALTER TABLE classification_reports ADD COLUMN carrier TEXT").run();
} catch (e) {}

try {
  db.prepare("ALTER TABLE classification_reports ADD COLUMN invoice_url TEXT").run();
} catch (e) {}

try {
  db.prepare("ALTER TABLE classification_reports ADD COLUMN test_type TEXT").run();
} catch (e) {}

try {
  db.prepare("ALTER TABLE classification_reports ADD COLUMN live_insects TEXT").run();
} catch (e) {}

try {
  db.prepare("ALTER TABLE classification_reports ADD COLUMN dead_insects TEXT").run();
} catch (e) {}

try {
  db.prepare("ALTER TABLE classification_reports ADD COLUMN odor TEXT").run();
} catch (e) {}

try {
  db.prepare("ALTER TABLE classification_reports ADD COLUMN toxicity TEXT").run();
} catch (e) {}

try {
  db.prepare("ALTER TABLE classification_reports ADD COLUMN burnt_and_scorched REAL").run();
} catch (e) {}

try {
  db.prepare("ALTER TABLE classification_reports ADD COLUMN scorched REAL").run();
} catch (e) {}

try {
  db.prepare("ALTER TABLE classification_reports ADD COLUMN moldy REAL").run();
} catch (e) {}

try {
  db.prepare("ALTER TABLE classification_reports ADD COLUMN fermented REAL").run();
} catch (e) {}

try {
  db.prepare("ALTER TABLE classification_reports ADD COLUMN germinated REAL").run();
} catch (e) {}

try {
  db.prepare("ALTER TABLE classification_reports ADD COLUMN shriveled REAL").run();
} catch (e) {}

try {
  db.prepare("ALTER TABLE classification_reports ADD COLUMN damaged_total REAL").run();
} catch (e) {}

try {
  db.prepare("ALTER TABLE classification_reports ADD COLUMN immature REAL").run();
} catch (e) {}

try {
  db.prepare("ALTER TABLE classification_reports ADD COLUMN greenish REAL").run();
} catch (e) {}

try {
  db.prepare("ALTER TABLE classification_reports ADD COLUMN broken_crushed REAL").run();
} catch (e) {}

try {
  db.prepare("ALTER TABLE classification_reports ADD COLUMN observations TEXT").run();
} catch (e) {}

// Migration: Ensure service_orders has all columns and correct constraints
try {
  const tableSqlRow = db.prepare("SELECT sql FROM sqlite_master WHERE name='service_orders'").get() as any;
  if (tableSqlRow) {
    const tableSql = tableSqlRow.sql;
    const tableInfo = db.prepare("PRAGMA table_info(service_orders)").all() as any[];
    const columns = tableInfo.map(c => c.name);
    
    const hasOrigin = columns.includes('origin_id');
    const hasUnit = columns.includes('unit');
    const hasQuantity = columns.includes('quantity');
    const hasClassifier = columns.includes('classifier_id');
    
    // Check if the old constraint exists or if 'KG' is missing from the constraint
    const hasOldConstraint = tableSql.includes("unit IN ('TON', 'SACA')") || 
                            tableSql.includes("unit IN ('TON','SACA')") ||
                            !tableSql.includes("'KG'");
                            
    const originIsNotNull = tableInfo.find(c => c.name === 'origin_id')?.notnull === 1;

    if (!hasOrigin || !hasUnit || !hasQuantity || !hasClassifier || hasOldConstraint || originIsNotNull) {
      console.log("Migração: Atualizando tabela service_orders (Old constraint detected: " + hasOldConstraint + ")...");
      
      db.exec("PRAGMA foreign_keys=off");
      try {
        db.transaction(() => {
          // Create new table with correct schema
          db.exec(`
            CREATE TABLE service_orders_new (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              os_number TEXT UNIQUE NOT NULL,
              client_id INTEGER NOT NULL,
              origin_id INTEGER,
              embarkation_id INTEGER,
              destination_id INTEGER,
              product_id INTEGER NOT NULL,
              contract_number TEXT,
              lot_weight REAL,
              producer_name TEXT,
              quantity REAL NOT NULL DEFAULT 0,
              unit TEXT CHECK(unit IN ('TON', 'SACA', 'KG')) NOT NULL DEFAULT 'KG',
              date TEXT NOT NULL,
              classifier_id INTEGER NOT NULL,
              status TEXT CHECK(status IN ('OPEN', 'ANALYZING', 'FINISHED', 'BILLED')) DEFAULT 'OPEN',
              FOREIGN KEY(client_id) REFERENCES clients(id),
              FOREIGN KEY(origin_id) REFERENCES origins(id),
              FOREIGN KEY(embarkation_id) REFERENCES embarkation_points(id),
              FOREIGN KEY(destination_id) REFERENCES destinations(id),
              FOREIGN KEY(product_id) REFERENCES products(id),
              FOREIGN KEY(classifier_id) REFERENCES users(id)
            );
          `);

          // Determine columns to copy
          const commonColumns = [
            'id', 'os_number', 'client_id', 'embarkation_id', 'destination_id', 
            'product_id', 'contract_number', 'lot_weight', 'producer_name', 
            'date', 'status'
          ].filter(c => columns.includes(c));
          
          if (hasOrigin) commonColumns.push('origin_id');
          if (hasUnit) commonColumns.push('unit');
          if (hasQuantity) commonColumns.push('quantity');
          if (hasClassifier) commonColumns.push('classifier_id');

          const colsStr = commonColumns.join(', ');
          let selectColsStr = commonColumns.join(', ');
          
          // If classifier_id is missing, add it to the insert with a default value of 1
          let insertColsStr = colsStr;
          if (!hasClassifier) {
            insertColsStr += ', classifier_id';
            selectColsStr += ', 1'; // Default to the first user (admin)
          }

          db.exec(`INSERT INTO service_orders_new (${insertColsStr}) SELECT ${selectColsStr} FROM service_orders`);
          
          db.exec("DROP TABLE service_orders");
          db.exec("ALTER TABLE service_orders_new RENAME TO service_orders");
        })();
      } finally {
        db.exec("PRAGMA foreign_keys=on");
      }
      console.log("Migração: service_orders atualizada com sucesso");
    }
  }
} catch (e) {
  console.error("Erro na migração de service_orders:", e);
}

// Seed initial data if empty
const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
if (userCount.count === 0) {
  const hashedPassword = bcrypt.hashSync("admin123", 10);
  db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run(
    "Administrador", "admin@agroclass.com", hashedPassword, "ADMIN"
  );
  
  db.prepare("INSERT INTO products (name) VALUES (?)").run("Soja");
  db.prepare("INSERT INTO products (name) VALUES (?)").run("Milho");

  db.prepare("INSERT INTO embarkation_points (name) VALUES (?)").run("Armazém Central");
  db.prepare("INSERT INTO embarkation_points (name) VALUES (?)").run("Fazenda Boa Vista");
  
  db.prepare("INSERT INTO destinations (name) VALUES (?)").run("Porto de Santos");
  db.prepare("INSERT INTO destinations (name) VALUES (?)").run("Terminal Ferroviário");
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // CORS middleware
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // Auth Routes
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }
    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  });

  // Dashboard Stats
  app.get("/api/dashboard/stats", authenticateToken, (req, res) => {
    const openOS = db.prepare("SELECT COUNT(*) as count FROM service_orders WHERE status != 'BILLED'").get() as any;
    const monthlyBilling = db.prepare("SELECT SUM(total_amount) as total FROM billing WHERE strftime('%m', payment_date) = strftime('%m', 'now')").get() as any;
    const volumeByProduct = db.prepare(`
      SELECT p.name, SUM(so.quantity) as volume 
      FROM service_orders so 
      JOIN products p ON so.product_id = p.id 
      GROUP BY p.name
    `).all();
    
    res.json({
      openOS: openOS.count,
      monthlyBilling: monthlyBilling.total || 0,
      volumeByProduct
    });
  });

  // Users / Classifiers
  app.get("/api/users", authenticateToken, (req, res) => {
    const users = db.prepare("SELECT id, name, email, role, professional_reg FROM users WHERE role = 'CLASSIFIER' OR role = 'ADMIN'").all();
    res.json(users);
  });

  app.get("/api/classifiers", authenticateToken, (req, res) => {
    const users = db.prepare("SELECT id, name, email, role, professional_reg, cpf, signature_url FROM users WHERE role = 'CLASSIFIER'").all();
    res.json(users);
  });

  app.post("/api/classifiers", authenticateToken, (req, res) => {
    const { name, email, password, professional_reg, cpf } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "Campos obrigatórios ausentes" });
    
    const hashedPassword = bcrypt.hashSync(password, 10);
    try {
      const result = db.prepare("INSERT INTO users (name, email, password, role, professional_reg, cpf) VALUES (?, ?, ?, 'CLASSIFIER', ?, ?)").run(
        name, email, hashedPassword, professional_reg || null, cpf || null
      );
      res.json({ id: result.lastInsertRowid, name, email, role: 'CLASSIFIER' });
    } catch (error: any) {
      res.status(400).json({ error: "Email já cadastrado" });
    }
  });

  app.put("/api/classifiers/:id", authenticateToken, (req, res) => {
    const { id } = req.params;
    const { name, email, professional_reg, cpf, password } = req.body;
    
    try {
      if (password) {
        const hashedPassword = bcrypt.hashSync(password, 10);
        db.prepare("UPDATE users SET name = ?, email = ?, professional_reg = ?, cpf = ?, password = ? WHERE id = ? AND role = 'CLASSIFIER'").run(
          name, email, professional_reg || null, cpf || null, hashedPassword, id
        );
      } else {
        db.prepare("UPDATE users SET name = ?, email = ?, professional_reg = ?, cpf = ? WHERE id = ? AND role = 'CLASSIFIER'").run(
          name, email, professional_reg || null, cpf || null, id
        );
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: "Erro ao atualizar classificador" });
    }
  });

  app.delete("/api/classifiers/:id", authenticateToken, (req, res) => {
    const { id } = req.params;
    try {
      // Check if classifier has reports
      const reports = db.prepare("SELECT COUNT(*) as count FROM classification_reports WHERE classifier_id = ?").get(id) as any;
      if (reports.count > 0) {
        return res.status(400).json({ error: "Não é possível excluir um classificador que já emitiu laudos." });
      }
      db.prepare("DELETE FROM users WHERE id = ? AND role = 'CLASSIFIER'").run(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: "Erro ao excluir classificador" });
    }
  });

  // Clients
  app.get("/api/clients", authenticateToken, (req, res) => {
    const clients = db.prepare("SELECT * FROM clients").all();
    res.json(clients);
  });

  app.post("/api/clients", authenticateToken, (req, res) => {
    const { 
      name, document, trading_name, cep, street, complement, 
      number, neighborhood, city, state, phone, email, 
      tariff, cadence, daily_rate, contact_person 
    } = req.body;
    
    const result = db.prepare(`
      INSERT INTO clients (
        name, document, trading_name, cep, street, complement, 
        number, neighborhood, city, state, phone, email, 
        tariff, cadence, daily_rate, contact_person
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name, document, trading_name || null, cep || null, street || null, complement || null,
      number || null, neighborhood || null, city || null, state || null, phone || null, email || null,
      tariff || null, cadence || null, daily_rate || null, contact_person || null
    );
    res.json({ id: result.lastInsertRowid });
  });

  // Origins
  app.get("/api/origins", authenticateToken, (req, res) => {
    const origins = db.prepare("SELECT o.*, c.name as client_name FROM origins o JOIN clients c ON o.client_id = c.id").all();
    res.json(origins);
  });

  app.post("/api/origins", authenticateToken, (req, res) => {
    const { farm_name, producer_name, city, state, client_id } = req.body;
    const result = db.prepare("INSERT INTO origins (farm_name, producer_name, city, state, client_id) VALUES (?, ?, ?, ?, ?)").run(
      farm_name, producer_name, city, state, client_id
    );
    res.json({ id: result.lastInsertRowid });
  });

  app.put("/api/origins/:id", authenticateToken, (req, res) => {
    const { id } = req.params;
    const { farm_name, producer_name, city, state, client_id } = req.body;
    db.prepare("UPDATE origins SET farm_name = ?, producer_name = ?, city = ?, state = ?, client_id = ? WHERE id = ?").run(
      farm_name, producer_name, city, state, client_id, id
    );
    res.json({ success: true });
  });

  app.delete("/api/origins/:id", authenticateToken, (req, res) => {
    const { id } = req.params;
    try {
      db.prepare("DELETE FROM origins WHERE id = ?").run(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: "Não é possível excluir uma origem que possui ordens de serviço." });
    }
  });

  // Embarkation Points
  app.get("/api/embarkation-points", authenticateToken, (req, res) => {
    const points = db.prepare("SELECT * FROM embarkation_points").all();
    res.json(points);
  });

  app.post("/api/embarkation-points", authenticateToken, (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Nome é obrigatório" });
    const result = db.prepare("INSERT INTO embarkation_points (name) VALUES (?)").run(name);
    res.json({ id: result.lastInsertRowid, name });
  });

  app.put("/api/embarkation-points/:id", authenticateToken, (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Nome é obrigatório" });
    db.prepare("UPDATE embarkation_points SET name = ? WHERE id = ?").run(name, id);
    res.json({ success: true });
  });

  app.delete("/api/embarkation-points/:id", authenticateToken, (req, res) => {
    const { id } = req.params;
    try {
      db.prepare("DELETE FROM embarkation_points WHERE id = ?").run(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: "Não é possível excluir um ponto de embarque que possui ordens de serviço." });
    }
  });

  // Destinations
  app.get("/api/destinations", authenticateToken, (req, res) => {
    const dests = db.prepare("SELECT * FROM destinations").all();
    res.json(dests);
  });

  app.post("/api/destinations", authenticateToken, (req, res) => {
    const { name, city, state } = req.body;
    if (!name) return res.status(400).json({ error: "Nome é obrigatório" });
    const result = db.prepare("INSERT INTO destinations (name, city, state) VALUES (?, ?, ?)").run(name, city || null, state || null);
    res.json({ id: result.lastInsertRowid, name, city, state });
  });

  app.put("/api/destinations/:id", authenticateToken, (req, res) => {
    const { id } = req.params;
    const { name, city, state } = req.body;
    if (!name) return res.status(400).json({ error: "Nome é obrigatório" });
    db.prepare("UPDATE destinations SET name = ?, city = ?, state = ? WHERE id = ?").run(name, city || null, state || null, id);
    res.json({ success: true });
  });

  app.delete("/api/destinations/:id", authenticateToken, (req, res) => {
    const { id } = req.params;
    try {
      db.prepare("DELETE FROM destinations WHERE id = ?").run(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: "Não é possível excluir um destino que possui ordens de serviço." });
    }
  });

  // Products
  app.get("/api/products", authenticateToken, (req, res) => {
    const products = db.prepare("SELECT * FROM products").all();
    res.json(products);
  });

  app.post("/api/products", authenticateToken, (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Nome é obrigatório" });
    try {
      const result = db.prepare("INSERT INTO products (name) VALUES (?)").run(name);
      res.json({ id: result.lastInsertRowid, name });
    } catch (e) {
      res.status(400).json({ error: "Produto já cadastrado ou erro no banco" });
    }
  });

  app.delete("/api/products/:id", authenticateToken, (req, res) => {
    const { id } = req.params;
    try {
      db.prepare("DELETE FROM products WHERE id = ?").run(id);
      res.json({ success: true });
    } catch (e) {
      res.status(400).json({ error: "Não é possível excluir um produto que possui ordens de serviço." });
    }
  });

  // Service Orders
  app.get("/api/service-orders", authenticateToken, (req, res) => {
    const orders = db.prepare(`
      SELECT so.*, c.name as client_name, p.name as product_name, u.name as classifier_name,
             ep.name as embarkation_name, d.name as destination_name, o.farm_name as origin_name
      FROM service_orders so
      JOIN clients c ON so.client_id = c.id
      JOIN products p ON so.product_id = p.id
      JOIN users u ON so.classifier_id = u.id
      LEFT JOIN embarkation_points ep ON so.embarkation_id = ep.id
      LEFT JOIN destinations d ON so.destination_id = d.id
      LEFT JOIN origins o ON so.origin_id = o.id
      ORDER BY so.date DESC
    `).all();
    res.json(orders);
  });

  app.get("/api/service-orders/:id", authenticateToken, (req, res) => {
    const order = db.prepare(`
      SELECT so.*, c.name as client_name, p.name as product_name, u.name as classifier_name,
             ep.name as embarkation_name, d.name as destination_name, o.farm_name as origin_name,
             cr.final_classification, cr.date as classification_date, cr.humidity, cr.impurities,
             b.total_amount as billed_amount
      FROM service_orders so
      JOIN clients c ON so.client_id = c.id
      JOIN products p ON so.product_id = p.id
      JOIN users u ON so.classifier_id = u.id
      LEFT JOIN embarkation_points ep ON so.embarkation_id = ep.id
      LEFT JOIN destinations d ON so.destination_id = d.id
      LEFT JOIN origins o ON so.origin_id = o.id
      LEFT JOIN classification_reports cr ON cr.os_id = so.id
      LEFT JOIN billing b ON b.os_id = so.id
      WHERE so.id = ?
    `).get(req.params.id);
    
    if (!order) return res.status(404).json({ error: "Ordem de serviço não encontrada" });
    res.json(order);
  });

  app.post("/api/service-orders", authenticateToken, (req, res) => {
    try {
      const { 
        client_id, origin_id, embarkation_id, destination_id, product_id, 
        contract_number, lot_weight, producer_name, quantity, unit, classifier_id 
      } = req.body;
      
      if (!client_id || !product_id || !classifier_id) {
        return res.status(400).json({ error: "Cliente, Produto e Classificador são obrigatórios." });
      }

      const os_number = `OS-${Date.now()}`;
      const date = new Date().toISOString();
      
      const result = db.prepare(`
        INSERT INTO service_orders (
          os_number, client_id, origin_id, embarkation_id, destination_id, product_id, 
          contract_number, lot_weight, producer_name, quantity, unit, date, classifier_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        os_number, 
        client_id, 
        origin_id || null,
        embarkation_id || null, 
        destination_id || null, 
        product_id,
        contract_number || null, 
        lot_weight || null, 
        producer_name || null, 
        quantity || lot_weight || 0, 
        unit || 'KG', 
        date, 
        classifier_id
      );
      res.json({ id: result.lastInsertRowid, os_number });
    } catch (error: any) {
      console.error('Erro ao criar OS:', error);
      res.status(500).json({ error: "Erro interno ao gerar Ordem de Serviço: " + error.message });
    }
  });

  // Classification Reports
  app.get("/api/classification", authenticateToken, (req, res) => {
    const reports = db.prepare(`
      SELECT cr.*, so.os_number, c.name as client_name, p.name as product_name, u.name as classifier_name
      FROM classification_reports cr
      JOIN service_orders so ON cr.os_id = so.id
      JOIN clients c ON so.client_id = c.id
      JOIN products p ON so.product_id = p.id
      LEFT JOIN users u ON cr.classifier_id = u.id
      ORDER BY cr.id DESC
    `).all();
    res.json(reports);
  });

  app.post("/api/classification", authenticateToken, (req, res) => {
    const { 
      os_id, classifier_id, date, license_plate, weight_kg, carrier, invoice_url,
      test_type, live_insects, dead_insects, odor, toxicity,
      burnt_and_scorched, scorched, moldy, fermented, germinated, shriveled,
      damaged_total, immature, humidity, impurities, greenish, broken_crushed,
      observations
    } = req.body;
    
    // Simple business logic for classification
    let final_classification = "Tipo 1";
    if (humidity > 14 || impurities > 1) final_classification = "Tipo 2";
    if (humidity > 16 || impurities > 2) final_classification = "Fora de Padrão";

    const discounts = {
      humidity: humidity > 14 ? (humidity - 14) * 1.5 : 0,
      impurities: impurities > 1 ? (impurities - 1) : 0
    };

    try {
      db.prepare(`
        INSERT INTO classification_reports (
          os_id, classifier_id, date, license_plate, weight_kg, carrier, invoice_url,
          test_type, live_insects, dead_insects, odor, toxicity,
          burnt_and_scorched, scorched, moldy, fermented, germinated, shriveled,
          damaged_total, immature, humidity, impurities, greenish, broken_crushed,
          observations, final_classification, discounts_json, signature_date
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        os_id, classifier_id, date, license_plate, weight_kg, carrier, invoice_url,
        test_type, live_insects, dead_insects, odor, toxicity,
        burnt_and_scorched, scorched, moldy, fermented, germinated, shriveled,
        damaged_total, immature, humidity, impurities, greenish, broken_crushed,
        observations, final_classification, JSON.stringify(discounts), new Date().toISOString()
      );

      db.prepare("UPDATE service_orders SET status = 'FINISHED' WHERE id = ?").run(os_id);
      
      res.json({ success: true, final_classification });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Billing
  app.post("/api/billing", authenticateToken, (req, res) => {
    const { os_id, price_per_unit } = req.body;
    const os = db.prepare("SELECT quantity FROM service_orders WHERE id = ?").get(os_id) as any;
    const total_amount = os.quantity * price_per_unit;

    db.prepare("INSERT INTO billing (os_id, price_per_unit, total_amount) VALUES (?, ?, ?)").run(os_id, price_per_unit, total_amount);
    db.prepare("UPDATE service_orders SET status = 'BILLED' WHERE id = ?").run(os_id);

    res.json({ success: true, total_amount });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(3000, "0.0.0.0", () => {
    console.log("Server running on http://0.0.0.0:3000");
  });
}

startServer();
