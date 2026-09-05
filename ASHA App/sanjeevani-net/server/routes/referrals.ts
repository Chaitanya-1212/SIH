/**
 * Closed-Loop Emergency Referrals & 108 Ambulance Dispatch Routes
 * /api/v1/referrals/...
 */

import { Router, Request, Response } from 'express';
import { emrDb, EmrReferral } from '../db';

export const referralsRouter = Router();

/**
 * GET /api/v1/referrals/
 */
referralsRouter.get('/', (_req: Request, res: Response) => {
  const list = emrDb.getAllReferrals();
  return res.status(200).json({
    status: 200,
    count: list.length,
    data: list,
    serverDbTimestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/v1/referrals/:id
 */
referralsRouter.get('/:id', (req: Request, res: Response) => {
  const ref = emrDb.getReferralById(req.params.id);
  if (!ref) {
    return res.status(404).json({ status: 404, message: 'Referral case not found' });
  }
  return res.status(200).json({
    status: 200,
    data: ref,
    serverDbTimestamp: new Date().toISOString(),
  });
});

/**
 * POST /api/v1/referrals/
 * Generates an emergency referral, reserves bed, and dispatches 108 ambulance
 */
referralsRouter.post('/', (req: Request, res: Response) => {
  const body = req.body;
  const newRef = emrDb.createReferral(body);

  return res.status(201).json({
    status: 201,
    message: 'Emergency 108 Referral generated & hospital alerted',
    data: newRef,
    serverDbTimestamp: new Date().toISOString(),
  });
});

/**
 * PATCH /api/v1/referrals/:id/status/
 * Updates referral stage (ACCEPTED -> IN_TRANSIT -> ADMITTED -> DISCHARGED)
 */
referralsRouter.patch('/:id/status/', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ status: 400, message: 'Status field is required' });
  }

  const updated = emrDb.updateReferralStatus(id, status as EmrReferral['status']);
  if (!updated) {
    return res.status(404).json({ status: 404, message: 'Referral case not found' });
  }

  return res.status(200).json({
    status: 200,
    message: `Referral status updated to ${status}`,
    data: updated,
    serverDbTimestamp: new Date().toISOString(),
  });
});
