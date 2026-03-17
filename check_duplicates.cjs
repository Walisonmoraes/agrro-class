
const Database = require('better-sqlite3');
const db = new Database('agroclass.db');

const orders = db.prepare("SELECT * FROM service_orders").all();
console.log("service_orders:", JSON.stringify(orders, null, 2));

process.exit(0);
