/**
 * Bhashini Digital India Language Services
 * Provides vernacular ASR (Speech-to-Text), NMT (Translation),
 * and TTS (Voice synthesis) for Marathi, Hindi, and Indian vernacular languages.
 */

import { Language } from '../types';

export interface BhashiniVoicePrompt {
  lang: Language;
  text: string;
}

export const BHASHINI_DICTIONARY: Record<Language, Record<string, string>> = {
  mr: {
    appName: 'संजीवन-नेट',
    subtitle: 'आशा आणि एएनएम माता आरोग्य प्रणाली (NRHM)',
    recordVitals: 'शारीरिक वाइटल्स नोंदवा',
    vitalsSubtitle: 'रक्तदाब, तापमान व ऑक्सिजन मोजा',
    riskAssessment: 'आरोग्य मूल्यांकन',
    referralTracking: 'रेफरल व्यवस्थापन व रुग्णवाहिका ट्रॅकिंग',
    voiceAssistant: 'व्हॉईस सहाय्यक (बोला)',
    syncStatus: 'ऑफलाइन डेटा सिंक',
    highRiskAlert: 'आरोग्य तपासणी: प्राथमिक आरोग्य केंद्र बेलोरा येथे सल्ला घेण्याची शिफारस.',
    speechDetected: 'आवाज ओळखला: रक्तदाब नोंदवला.',
  },
  hi: {
    appName: 'संजीवन-नेट',
    subtitle: 'आशा व एएनएम मातृत्व सुरक्षा पोर्टल (NRHM)',
    recordVitals: 'शारीरिक वाइटल्स जांचें और दर्ज करें',
    vitalsSubtitle: 'रक्तचाप, तापमान और ऑक्सीजन मापें',
    riskAssessment: 'स्वास्थ्य मूल्यांकन',
    referralTracking: 'रेफरल प्रबंधन एवं एम्बुलेंस ट्रैकिंग',
    voiceAssistant: 'वॉयस सहायक (बोलें)',
    syncStatus: 'ऑफ़लाइन डेटा सिंक',
    highRiskAlert: 'स्वास्थ्य जांच: प्राथमिक स्वास्थ्य केंद्र (PHC) परामर्श की सिफारिश।',
    speechDetected: 'आवाज़ पहचानी: रक्तचाप दर्ज किया गया।',
  },
  en: {
    appName: 'Sanjeevani-Net',
    subtitle: 'ASHA & ANM Maternal Health Network (NRHM)',
    recordVitals: 'Record Vital Signs',
    vitalsSubtitle: 'Capture BP, SpO2, Temp, and Weight',
    riskAssessment: 'Health Assessment',
    referralTracking: 'Referral & Transit Tracking',
    voiceAssistant: 'Voice Assistant (Speak)',
    syncStatus: 'Offline Data Sync',
    highRiskAlert: 'Maternal Assessment: PHC Consultation and clinical checkup recommended.',
    speechDetected: 'Voice recognized: Blood Pressure recorded.',
  },
};

export const bhashiniService = {
  /**
   * Synthesize audio via Bhashini TTS (or browser SpeechSynthesis fallback)
   */
  speakText(text: string, lang: Language): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        if (lang === 'mr') {
          utterance.lang = 'mr-IN';
        } else if (lang === 'hi') {
          utterance.lang = 'hi-IN';
        } else {
          utterance.lang = 'en-IN';
        }
        utterance.rate = 0.92;
        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();
        window.speechSynthesis.speak(utterance);
      } else {
        resolve();
      }
    });
  },

  /**
   * Stop speaking
   */
  stopSpeaking(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  },

  /**
   * Simulates Bhashini ASR (Automated Speech Recognition)
   */
  async simulateAsrListening(lang: Language): Promise<{
    transcript: string;
    extractedValues?: { systolic?: number; diastolic?: number; symptoms?: string };
  }> {
    // Wait for voice input duration
    await new Promise((res) => setTimeout(res, 1800));

    if (lang === 'mr') {
      return {
        transcript: 'सिस्टोलिक रक्तदाब १४० आणि डायस्टोलिक ९०, डोकेदुखी सुरू आहे.',
        extractedValues: {
          systolic: 140,
          diastolic: 90,
          symptoms: 'तीव्र डोकेदुखी (Severe headache in Marathi)',
        },
      };
    } else if (lang === 'hi') {
      return {
        transcript: 'रक्तचाप १४० ऊपर का और ९० नीचे का, हल्का बुखार लग रहा है।',
        extractedValues: {
          systolic: 140,
          diastolic: 90,
          symptoms: 'हल्का बुखार और सिरदर्द',
        },
      };
    } else {
      return {
        transcript: 'Blood pressure 140 over 90 with persistent headache and nausea.',
        extractedValues: {
          systolic: 140,
          diastolic: 90,
          symptoms: 'Persistent headache and nausea',
        },
      };
    }
  },
};
