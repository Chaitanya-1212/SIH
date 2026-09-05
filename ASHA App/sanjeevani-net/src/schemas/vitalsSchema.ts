import { z } from 'zod';

export const vitalsFormSchema = z.object({
  systolic: z
    .number({ message: 'सिस्टोलिक रक्तचाप आवश्यक आहे / आवश्यक है' })
    .min(60, { message: 'Systolic must be at least 60 mmHg' })
    .max(260, { message: 'Systolic cannot exceed 260 mmHg' }),
  diastolic: z
    .number({ message: 'डायस्टोलिक रक्तचाप आवश्यक आहे / आवश्यक है' })
    .min(40, { message: 'Diastolic must be at least 40 mmHg' })
    .max(160, { message: 'Diastolic cannot exceed 160 mmHg' }),
  temperature: z
    .number({ message: 'तापमान संख्या असणे आवश्यक आहे' })
    .min(92.0, { message: 'Temperature too low (< 92°F)' })
    .max(108.0, { message: 'Temperature too high (> 108°F)' }),
  tempUnit: z.enum(['F', 'C']),
  pulseRate: z
    .number({ message: 'नाड़ी दर आवश्यक आहे' })
    .min(40, { message: 'Pulse must be at least 40 BPM' })
    .max(200, { message: 'Pulse cannot exceed 200 BPM' }),
  spo2: z
    .number({ message: 'SpO2 संख्या आवश्यक आहे' })
    .min(50, { message: 'SpO2 must be at least 50%' })
    .max(100, { message: 'SpO2 cannot exceed 100%' }),
  bodyWeight: z
    .number({ message: 'वजन आवश्यक आहे' })
    .min(30.0, { message: 'Weight must be at least 30 kg' })
    .max(180.0, { message: 'Weight cannot exceed 180 kg' }),
  randomBloodSugar: z
    .number()
    .min(30, { message: 'RBS must be at least 30 mg/dL' })
    .max(600, { message: 'RBS cannot exceed 600 mg/dL' })
    .optional(),
  clinicalNotes: z.string().max(300, { message: 'Notes maximum 300 characters' }).optional(),
});

export type VitalsFormValues = z.infer<typeof vitalsFormSchema>;
