/**
 * PostgreSQL EMR Schema Simulation & Relational Database Layer
 * Compatible with Django ORM / PostgreSQL 16 (AWS ap-south-1)
 */

export interface EmrWorker {
  id: string;
  workerId: string;
  pin: string;
  name: string;
  nameHindi: string;
  role: 'ASHA' | 'ANM' | 'MO' | 'ADMIN';
  subCenter: string;
  phcHub: string;
  phone: string;
}

export interface EmrPatient {
  id: string;
  name: string;
  nameHindi: string;
  age: number;
  gender: string;
  village: string;
  subCenter: string;
  abhaId: string;
  rchId: string;
  gestationalAge: string;
  gravida: number;
  lmpDate: string;
  eddDate: string;
  riskStatus: 'HIGH' | 'MODERATE' | 'NORMAL';
  riskTitle: string;
  riskTitleHindi: string;
  husbandName: string;
  husbandPhone: string;
  ashaWorker: string;
  photoUrl: string;
  proteinuria: string;
  vitals: {
    systolic: number;
    diastolic: number;
    temperature: number;
    tempUnit: 'F' | 'C';
    pulseRate: number;
    spo2: number;
    bodyWeight: number;
    randomBloodSugar?: number;
    recordedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface EmrVitalsRecord {
  id: string;
  patientId: string;
  systolic: number;
  diastolic: number;
  temperature: number;
  pulseRate: number;
  spo2: number;
  bodyWeight: number;
  randomBloodSugar?: number;
  proteinuria?: string;
  cdssRiskTier: 'HIGH' | 'MODERATE' | 'NORMAL';
  cdssAlerts: string[];
  recordedBy: string;
  recordedAt: string;
  syncedAt: string;
}

export interface EmrReferral {
  id: string;
  referralCode: string;
  patientId: string;
  patientName: string;
  riskCategory: string;
  sourceSubCenter: string;
  destinationFacility: string;
  status: 'PENDING' | 'ACCEPTED' | 'IN_TRANSIT' | 'ADMITTED' | 'DISCHARGED';
  ambulanceId?: string;
  driverPhone?: string;
  emergency108EtaMins?: number;
  assignedDoctor: string;
  triageNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmrSyncAuditLog {
  id: string;
  txId: string;
  clientWorkerId: string;
  batchSize: number;
  status: 'SUCCESS' | 'CONFLICT_RESOLVED' | 'FAILED';
  syncedTables: string[];
  durationMs: number;
  serverDbTimestamp: string;
}

class EmrPostgresDatabase {
  private workers: EmrWorker[] = [
    {
      id: 'w_01',
      workerId: 'ASHA-4412',
      pin: '1234',
      name: 'मीना ताई कदम (Meena Tai Kadam)',
      nameHindi: 'मीना ताई कदम',
      role: 'ASHA',
      subCenter: 'खैरी उपकेंद्र (SC-Khairi, Wardha)',
      phcHub: 'PHC Belora',
      phone: '+91 98221 44120',
    },
    {
      id: 'w_02',
      workerId: 'ANM-1029',
      pin: '1234',
      name: 'कविता देशमुख (Kavita Deshmukh)',
      nameHindi: 'कविता देशमुख',
      role: 'ANM',
      subCenter: 'बेलोरा सेक्टर (Belora Sector)',
      phcHub: 'PHC Belora',
      phone: '+91 98221 10290',
    },
    {
      id: 'w_03',
      workerId: 'DR-7781',
      pin: '1234',
      name: 'Dr. Anita Sharma (MBBS, MO)',
      nameHindi: 'डॉ. अनिता शर्मा',
      role: 'MO',
      subCenter: 'PHC Belora',
      phcHub: 'PHC Belora',
      phone: '+91 98221 77810',
    },
  ];

  private patients: EmrPatient[] = [
    {
      id: 'BEN-2026-0941',
      name: 'Sunita Patil',
      nameHindi: 'सुनीता पाटिल',
      age: 28,
      gender: 'Female',
      village: 'Karajgaon (Ward 3)',
      subCenter: 'Sub-Center 04',
      abhaId: '91-4029-8472-1029',
      rchId: '2714-9821-0045',
      gestationalAge: '34 Wks 3 D',
      gravida: 2,
      lmpDate: '02 March 2026',
      eddDate: '07 Dec 2026',
      riskStatus: 'HIGH',
      riskTitle: 'Gestational Hypertension / Imminent Pre-Eclampsia',
      riskTitleHindi: 'गर्भावस्था उच्च रक्तचाप (उच्च जोखिम)',
      husbandName: 'Ramesh Patil',
      husbandPhone: '+91 98234 56789',
      ashaWorker: 'Savita Bai (संगीता ताई)',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      proteinuria: '++ (Dipstick)',
      vitals: {
        systolic: 155,
        diastolic: 100,
        temperature: 99.2,
        tempUnit: 'F',
        pulseRate: 88,
        spo2: 97,
        bodyWeight: 58.5,
        randomBloodSugar: 110,
        recordedAt: 'Today, 10:15 AM',
      },
      createdAt: '2026-08-10T09:00:00.000Z',
      updatedAt: '2026-09-05T10:15:00.000Z',
    },
    {
      id: 'BEN-2026-0812',
      name: 'Pooja Sanjay Waghmare',
      nameHindi: 'पूजा संजय वाघमारे',
      age: 24,
      gender: 'Female',
      village: 'Khairi (Ward 1)',
      subCenter: 'Sub-Center 02',
      abhaId: '91-8201-3341-9921',
      rchId: '2714-8841-0023',
      gestationalAge: '24 Wks 1 D',
      gravida: 1,
      lmpDate: '15 April 2026',
      eddDate: '20 Jan 2027',
      riskStatus: 'NORMAL',
      riskTitle: 'Routine Antenatal Care',
      riskTitleHindi: 'नियमित गर्भावस्था देखभाल',
      husbandName: 'Sanjay Waghmare',
      husbandPhone: '+91 98451 22345',
      ashaWorker: 'Savita Bai',
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      proteinuria: 'Nil',
      vitals: {
        systolic: 118,
        diastolic: 76,
        temperature: 98.4,
        tempUnit: 'F',
        pulseRate: 74,
        spo2: 99,
        bodyWeight: 52.0,
        randomBloodSugar: 92,
        recordedAt: '03 Sep 2026',
      },
      createdAt: '2026-08-15T11:00:00.000Z',
      updatedAt: '2026-09-03T08:30:00.000Z',
    },
    {
      id: 'BEN-2026-0733',
      name: 'Kavita Rajesh Shinde',
      nameHindi: 'कविता राजेश शिंदे',
      age: 31,
      gender: 'Female',
      village: 'Belora (Ward 2)',
      subCenter: 'Sub-Center 04',
      abhaId: '91-1029-4482-6612',
      rchId: '2714-7712-0091',
      gestationalAge: '30 Wks 5 D',
      gravida: 3,
      lmpDate: '28 Feb 2026',
      eddDate: '05 Dec 2026',
      riskStatus: 'MODERATE',
      riskTitle: 'Moderate Anemia (Hb 8.2 g/dL)',
      riskTitleHindi: 'मध्यम एनीमिया (हीमोग्लोबिन कमी)',
      husbandName: 'Rajesh Shinde',
      husbandPhone: '+91 97632 11984',
      ashaWorker: 'Savita Bai',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      proteinuria: 'Trace',
      vitals: {
        systolic: 124,
        diastolic: 82,
        temperature: 98.6,
        tempUnit: 'F',
        pulseRate: 80,
        spo2: 98,
        bodyWeight: 49.2,
        randomBloodSugar: 104,
        recordedAt: '02 Sep 2026',
      },
      createdAt: '2026-07-20T08:00:00.000Z',
      updatedAt: '2026-09-02T14:10:00.000Z',
    },
  ];

  private vitalsHistory: EmrVitalsRecord[] = [];
  private referrals: EmrReferral[] = [
    {
      id: 'ref_101',
      referralCode: 'REF-2026-0941-EMR',
      patientId: 'BEN-2026-0941',
      patientName: 'Sunita Patil',
      riskCategory: 'High Risk (Gestational Hypertension)',
      sourceSubCenter: 'Sub-Center 04 (Khairi)',
      destinationFacility: 'PHC Belora (Primary Health Centre)',
      status: 'IN_TRANSIT',
      ambulanceId: 'MH-31-AZ-4412',
      driverPhone: '+91 98765 43210',
      emergency108EtaMins: 8,
      assignedDoctor: 'Dr. Anita Sharma (MBBS, MO)',
      triageNotes: 'BP 155/100, Proteinuria ++, headache noted. Anti-hypertensive standby.',
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  private syncAuditLogs: EmrSyncAuditLog[] = [
    {
      id: 'log_seed_01',
      txId: 'pg_tx_99A04B',
      clientWorkerId: 'ASHA-4412',
      batchSize: 3,
      status: 'SUCCESS',
      syncedTables: ['emr_vitals', 'emr_patients'],
      durationMs: 380,
      serverDbTimestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
  ];

  // Auth queries
  public findWorker(workerId: string, pin?: string): EmrWorker | undefined {
    return this.workers.find(
      (w) => w.workerId.toLowerCase() === workerId.toLowerCase() && (!pin || w.pin === pin)
    );
  }

  // Patient queries
  public getAllPatients(): EmrPatient[] {
    return this.patients;
  }

  public getPatientById(id: string): EmrPatient | undefined {
    return this.patients.find((p) => p.id === id);
  }

  public addPatient(patient: EmrPatient): EmrPatient {
    this.patients.unshift(patient);
    return patient;
  }

  public updatePatientVitals(
    patientId: string,
    vitals: EmrPatient['vitals'],
    recordedBy = 'ASHA Worker',
    notes = ''
  ): { patient: EmrPatient; vitalsRecord: EmrVitalsRecord; cdssTier: 'HIGH' | 'MODERATE' | 'NORMAL' } {
    const patient = this.getPatientById(patientId);
    if (!patient) {
      throw new Error(`Patient ${patientId} not found`);
    }

    patient.vitals = vitals;
    patient.updatedAt = new Date().toISOString();

    // Clinical Decision Support System (CDSS) Triage
    let cdssTier: 'HIGH' | 'MODERATE' | 'NORMAL' = 'NORMAL';
    const alerts: string[] = [];

    if (vitals.systolic >= 160 || vitals.diastolic >= 110) {
      cdssTier = 'HIGH';
      alerts.push('Severe Hypertension (Severe Pre-eclampsia Alert)');
      patient.riskStatus = 'HIGH';
      patient.riskTitle = 'Severe Pre-Eclampsia (Critical Red Flag)';
      patient.riskTitleHindi = 'गंभीर प्री-एक्लेम्पसिया (अति उच्च जोखिम)';
    } else if (vitals.systolic >= 140 || vitals.diastolic >= 90) {
      cdssTier = 'HIGH';
      alerts.push('Gestational Hypertension (Stage 1 / High Risk)');
      patient.riskStatus = 'HIGH';
      patient.riskTitle = 'Gestational Hypertension (उच्च रक्तचाप)';
      patient.riskTitleHindi = 'गर्भावस्था उच्च रक्तचाप (उच्च जोखिम)';
    } else if (vitals.spo2 && vitals.spo2 < 95) {
      cdssTier = 'HIGH';
      alerts.push('Hypoxia / Low Oxygen Saturation (<95%)');
      patient.riskStatus = 'HIGH';
    } else if (vitals.randomBloodSugar && vitals.randomBloodSugar > 140) {
      cdssTier = 'MODERATE';
      alerts.push('Elevated Random Blood Sugar (Gestational Diabetes Risk)');
      patient.riskStatus = 'MODERATE';
      patient.riskTitle = 'Gestational Diabetes Risk';
      patient.riskTitleHindi = 'गर्भावस्था मधुमेह जोखिम';
    }

    const vitalsRecord: EmrVitalsRecord = {
      id: `vr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      patientId,
      systolic: vitals.systolic,
      diastolic: vitals.diastolic,
      temperature: vitals.temperature,
      pulseRate: vitals.pulseRate,
      spo2: vitals.spo2,
      bodyWeight: vitals.bodyWeight,
      randomBloodSugar: vitals.randomBloodSugar,
      cdssRiskTier: cdssTier,
      cdssAlerts: alerts,
      recordedBy,
      recordedAt: vitals.recordedAt || new Date().toISOString(),
      syncedAt: new Date().toISOString(),
    };

    this.vitalsHistory.unshift(vitalsRecord);
    return { patient, vitalsRecord, cdssTier };
  }

  // Referral queries
  public getAllReferrals(): EmrReferral[] {
    return this.referrals;
  }

  public getReferralById(id: string): EmrReferral | undefined {
    return this.referrals.find((r) => r.id === id || r.referralCode === id);
  }

  public createReferral(data: Partial<EmrReferral>): EmrReferral {
    const newRef: EmrReferral = {
      id: `ref_${Date.now()}`,
      referralCode: `REF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: data.patientId || 'BEN-2026-0941',
      patientName: data.patientName || 'Sunita Patil',
      riskCategory: data.riskCategory || 'High Risk Pregnancy (CDSS Alert)',
      sourceSubCenter: data.sourceSubCenter || 'Sub-Center Khairi',
      destinationFacility: data.destinationFacility || 'PHC Belora',
      status: 'PENDING',
      ambulanceId: data.ambulanceId || 'MH-31-AZ-4412',
      driverPhone: data.driverPhone || '+91 98765 43210',
      emergency108EtaMins: 12,
      assignedDoctor: data.assignedDoctor || 'Dr. Anita Sharma (MBBS, MO)',
      triageNotes: data.triageNotes || 'Urgent maternal stabilization required.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.referrals.unshift(newRef);
    return newRef;
  }

  public updateReferralStatus(id: string, status: EmrReferral['status']): EmrReferral | undefined {
    const ref = this.referrals.find((r) => r.id === id || r.referralCode === id);
    if (ref) {
      ref.status = status;
      ref.updatedAt = new Date().toISOString();
    }
    return ref;
  }

  // Sync ingestion
  public ingestStoreAndForwardQueue(
    workerId: string,
    queue: Array<{ id: string; table: string; action: string; payload: Record<string, unknown> }>
  ): { txId: string; processedCount: number; auditLog: EmrSyncAuditLog } {
    const startTime = Date.now();
    const syncedTables = new Set<string>();

    for (const item of queue) {
      if (item.table === 'vitals' && item.payload.beneficiaryId) {
        syncedTables.add('emr_vitals');
        syncedTables.add('emr_patients');
        const pId = item.payload.beneficiaryId as string;
        const vitals = item.payload.vitals as EmrPatient['vitals'];
        const notes = (item.payload.notes as string) || '';
        try {
          this.updatePatientVitals(pId, vitals, workerId, notes);
        } catch {
          // ignore not found in batch
        }
      } else if (item.table === 'referrals') {
        syncedTables.add('emr_referrals');
        this.createReferral(item.payload as Partial<EmrReferral>);
      } else if (item.table === 'beneficiaries' && item.action === 'CREATE') {
        syncedTables.add('emr_patients');
        this.addPatient(item.payload as unknown as EmrPatient);
      }
    }

    const txId = `pg_tx_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const durationMs = Date.now() - startTime + 50; // realistic db execution time

    const auditLog: EmrSyncAuditLog = {
      id: `audit_${Date.now()}`,
      txId,
      clientWorkerId: workerId,
      batchSize: queue.length,
      status: 'SUCCESS',
      syncedTables: Array.from(syncedTables),
      durationMs,
      serverDbTimestamp: new Date().toISOString(),
    };

    this.syncAuditLogs.unshift(auditLog);
    return { txId, processedCount: queue.length, auditLog };
  }

  public getSyncAuditLogs(): EmrSyncAuditLog[] {
    return this.syncAuditLogs;
  }
}

export const emrDb = new EmrPostgresDatabase();
