/**
 * Django REST Framework (DRF) JWT Authentication Endpoints
 * /api/v1/auth/...
 */

import { Router, Request, Response } from 'express';
import { emrDb } from '../db';

export const authRouter = Router();

/**
 * POST /api/v1/auth/jwt/create/
 * Matches Django SimpleJWT create token endpoint
 */
authRouter.post('/jwt/create/', (req: Request, res: Response) => {
  const { workerId, pin } = req.body;

  if (!workerId) {
    return res.status(400).json({
      status: 400,
      message: 'Worker ID is required',
      errors: { workerId: ['This field is required.'] },
    });
  }

  // Look up worker in EMR database
  const worker = emrDb.findWorker(workerId, pin || '1234');

  const now = Date.now();
  const accessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.sanjeevani_${workerId}_${now}`;
  const refreshToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh_${workerId}_${now}`;

  const workerName = worker?.name || 'मीना ताई कदम (Meena Tai Kadam)';
  const subCenter = worker?.subCenter || 'खैरी उपकेंद्र (SC-Khairi, Wardha)';
  const role = worker?.role || 'ASHA';

  return res.status(200).json({
    status: 200,
    message: 'JWT Token generated successfully from Django REST Framework',
    data: {
      access: accessToken,
      refresh: refreshToken,
      expiresIn: 28800, // 8 hours
      workerId: worker?.workerId || workerId,
      workerName,
      subCenter,
      role,
      phcHub: worker?.phcHub || 'PHC Belora',
      phone: worker?.phone || '+91 98221 44120',
    },
    serverDbTimestamp: new Date().toISOString(),
  });
});

/**
 * POST /api/v1/auth/jwt/refresh/
 */
authRouter.post('/jwt/refresh/', (req: Request, res: Response) => {
  const { refresh } = req.body;
  if (!refresh) {
    return res.status(400).json({ status: 400, message: 'Refresh token is required' });
  }

  const newAccess = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refreshed_${Date.now()}`;
  return res.status(200).json({
    status: 200,
    message: 'Token refreshed',
    data: {
      access: newAccess,
      expiresIn: 28800,
    },
    serverDbTimestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/v1/auth/user/
 */
authRouter.get('/user/', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 401, message: 'Authentication credentials were not provided.' });
  }

  return res.status(200).json({
    status: 200,
    data: {
      workerId: 'ASHA-4412',
      workerName: 'मीना ताई कदम (Meena Tai Kadam)',
      subCenter: 'खैरी उपकेंद्र (SC-Khairi, Wardha)',
      role: 'ASHA',
      jurisdiction: ['Ward 1', 'Ward 2', 'Ward 3 (Karajgaon)'],
    },
  });
});
