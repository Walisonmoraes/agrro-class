const express = require('express');
const path = require('path');
const { createServer: createViteServer } = require('vite');

async function startDevServer() {
  const app = express();
  
  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  
  // Use vite's connect instance as middleware
  app.use(vite.middlewares);
  
  app.listen(5173, '0.0.0.0', () => {
    console.log('Frontend dev server running on http://0.0.0.0:5173');
  });
}

startDevServer().catch(console.error);
