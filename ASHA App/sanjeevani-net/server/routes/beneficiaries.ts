/**
 * Beneficiaries & Maternal EMR Routes
 * /api/v1/beneficiaries/...
 */

import { Router, Request, Response } from 'express';
import { emrDb } from '../db';

export const beneficiariesRouter = Router();

/**
 * GET /api/v1/beneficiaries/
 */
beneficiariesRouter.get('/', (req: Request, res: Response) => {
  const { search, riskStatus } = req.query;
  let list = emrDb.getAllPatients();

  if (riskStatus && typeof riskStatus === 'string') {
    list = list.filter((p) => p.riskStatus.toLowerCase() === riskStatus.toLowerCase());
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.nameHindi.toLowerCase().includes(q) ||
        p.abhaId.includes(q) ||
        p.village.toLowerCase().includes(q)
    );
  }

  return res.status(200).json({
    status: 200,
    count: list.length,
    data: list,
    serverDbTimestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/v1/beneficiaries/:id
 */
beneficiariesRouter.get('/:id', (req: Request, res: Response) => {
  const patient = emrDb.getPatientById(req.params.id);
  if (!patient) {
    return res.status(404).json({ status: 404, message: 'Beneficiary not found in PostgreSQL EMR' });
  }

  return res.status(200).json({
    status: 200,
    data: patient,
    serverDbTimestamp: new Date().toISOString(),
  });
});

/**
 * POST /api/v1/beneficiaries/
 */
beneficiariesRouter.post('/', (req: Request, res: Response) => {
  const body = req.body;
  if (!body.name || !body.abhaId) {
    return res.status(400).json({ status: 400, message: 'Name and ABHA ID are required fields.' });
  }

  const newPatient = {
    ...body,
    id: body.id || `BEN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const saved = emrDb.addPatient(newPatient);
  return res.status(201).json({
    status: 201,
    message: 'Beneficiary registered successfully',
    data: saved,
    serverDbTimestamp: new Date().toISOString(),
  });
});

/**
 * PUT /api/v1/beneficiaries/:id/vitals/
 */
beneficiariesRouter.put('/:id/vitals/', (req: Request, res: Response) => {
  const { id } = req.params;
  const { vitals, notes, workerId } = req.body;

  if (!vitals || typeof vitals.systolic !== 'number' || typeof vitals.diastolic !== 'number') {
    return res.status(400).json({ status: 400, message: 'Valid systolic and diastolic vitals are required.' });
  }

  try {
    const result = emrDb.updatePatientVitals(id, vitals, workerId || 'ASHA-4412', notes);
    return res.status(200).json({
      status: 200,
      message: 'Vitals recorded and CDSS triage evaluated',
      data: {
        beneficiary: result.patient,
        vitalsRecord: result.vitalsRecord,
        cdssTier: result.cdssTier,
      },
      serverDbTimestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error recording vitals';
    return res.status(404).json({ status: 404, message: msg });
  }
});
