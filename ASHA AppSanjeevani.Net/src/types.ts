export type AppScreen = 
  | 'home'
  | 'login'
  | 'beneficiary'
  | 'vitals'
  | 'assessment'
  | 'referral'
  | 'patients';

export type Language = 'en' | 'hi' | 'mr';

export interface VitalsData {
  systolic: number;
  diastolic: number;
  temperature: number;
  tempUnit: 'F' | 'C';
  pulseRate: number;
  spo2: number;
  bodyWeight: number;
  randomBloodSugar?: number;
  recordedAt: string;
}

export interface RedFlagAssessment {
  breathingDifficulty: boolean;
  severeHeadacheOrBlurredVision: boolean;
  unconsciousOrConfusion: boolean;
  severeAbdominalPainOrBleeding: boolean;
  highBloodPressure: boolean;
}

export interface Beneficiary {
  id: string;
  name: string;
  nameHindi: string;
  nameMarathi?: string;
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
  riskTitleMarathi?: string;
  husbandName: string;
  husbandPhone: string;
  ashaWorker: string;
  photoUrl: string;
  vitals: VitalsData;
  proteinuria: string;
}

export interface Facility {
  id: string;
  name: string;
  nameHindi: string;
  distanceKm: number;
  travelTimeMins: number;
  type: string;
  doctorName: string;
  doctorRole: string;
  doctorPhoto: string;
  isOnDuty: boolean;
  tags: string[];
}

export interface ReferralTimelineStep {
  stepNumber: number;
  title: string;
  time?: string;
  status: 'completed' | 'active' | 'pending';
  badge?: string;
  description: string;
  actions?: {
    label: string;
    action: string;
    variant: 'primary' | 'secondary';
  }[];
}
