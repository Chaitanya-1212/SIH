/**
 * Sanjeevani-Net Backend Server
 * Express TypeScript implementation adhering to Django REST Framework (DRF) API specs
 * and PostgreSQL EMR relational database architecture.
 */

import express, { Request, Response, NextFunction } from 'express';
import { authRouter } from './routes/auth';
import { syncRouter } from './routes/sync';
import { beneficiariesRouter } from './routes/beneficiaries';
import { referralsRouter } from './routes/referrals';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple CORS header setup
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Client-Platform, X-Client-Db');
  if (_req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Request logger
app.use((req: Request, _res: Response, next: NextFunction) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] [DRF-API] ${req.method} ${req.url}`);
  next();
});

// Root / Health check
app.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 200,
    service: 'Sanjeevani-Net Central EMR Backend (Django REST Framework / PostgreSQL Spec)',
    version: '1.0.0',
    documentation: '/api/v1/',
    serverTime: new Date().toISOString(),
    endpoints: {
      auth: '/api/v1/auth/jwt/create/',
      sync: '/api/v1/sync/store-and-forward/',
      beneficiaries: '/api/v1/beneficiaries/',
      referrals: '/api/v1/referrals/',
    },
  });
});

// Mount DRF API v1 routers
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/sync', syncRouter);
app.use('/api/v1/beneficiaries', beneficiariesRouter);
app.use('/api/v1/referrals', referralsRouter);

// Serve static production build if available
import path from 'path';
import fs from 'fs';

const distPath = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// 404 handler for unmatched API routes
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    status: 404,
    detail: 'Endpoint not found.',
  });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[DRF-API Error]:', err);
  res.status(500).json({
    status: 500,
    detail: 'Internal server error occurred in Django REST service.',
    error: err.message,
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`  Sanjeevani-Net EMR Backend Server Ready`);
  console.log(`  Local URL:   http://localhost:${PORT}`);
  console.log(`  API Base:    http://localhost:${PORT}/api/v1`);
  console.log(`  Database:    PostgreSQL 16 EMR Simulation Active`);
  console.log(`====================================================`);
});

export default app;
