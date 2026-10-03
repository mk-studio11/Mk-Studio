import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  const dataDir = path.resolve(__dirname, 'data');
  const dataFilePath = path.join(dataDir, 'site-data.json');
  const srcDataFilePath = path.resolve(__dirname, 'src/data/siteData.json');

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Helper to read data
  const readSiteData = () => {
    if (fs.existsSync(dataFilePath)) {
      try {
        const raw = fs.readFileSync(dataFilePath, 'utf-8');
        return JSON.parse(raw);
      } catch (e) {
        console.error('Error reading data/site-data.json:', e);
      }
    }
    if (fs.existsSync(srcDataFilePath)) {
      try {
        const raw = fs.readFileSync(srcDataFilePath, 'utf-8');
        return JSON.parse(raw);
      } catch (e) {
        console.error('Error reading src/data/siteData.json:', e);
      }
    }
    return null;
  };

  // Helper to save data
  const saveSiteData = (data: any) => {
    const jsonStr = JSON.stringify(data, null, 2);
    fs.writeFileSync(dataFilePath, jsonStr, 'utf-8');
    try {
      fs.writeFileSync(srcDataFilePath, jsonStr, 'utf-8');
    } catch (e) {
      console.warn('Could not mirror to src/data/siteData.json:', e);
    }
  };

  // API Endpoints
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  app.get('/api/data', (_req, res) => {
    const data = readSiteData();
    if (data) {
      res.json({ success: true, data });
    } else {
      res.json({ success: false, data: null });
    }
  });

  app.post('/api/data', (req, res) => {
    try {
      const incoming = req.body;
      if (!incoming || typeof incoming !== 'object') {
        return res.status(400).json({ success: false, error: 'Invalid payload' });
      }
      saveSiteData(incoming);
      res.json({ success: true, message: 'Data saved successfully' });
    } catch (err: any) {
      console.error('Error saving site data:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Client Routing
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT} (${isProduction ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
