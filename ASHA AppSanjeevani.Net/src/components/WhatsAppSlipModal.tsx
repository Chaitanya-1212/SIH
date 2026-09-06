import React, { useState } from 'react';
import { Beneficiary } from '../types';
import { useAppStore } from '../store/useAppStore';

interface WhatsAppSlipModalProps {
  beneficiary: Beneficiary;
  onClose: () => void;
}

export const WhatsAppSlipModal: React.FC<WhatsAppSlipModalProps> = ({
  beneficiary,
  onClose,
}) => {
  const { language } = useAppStore();
  const [copied, setCopied] = useState(false);

  const displayName = language === 'mr' 
    ? (beneficiary.nameMarathi || beneficiary.name) 
    : language === 'hi' 
    ? (beneficiary.nameHindi || beneficiary.name) 
    : beneficiary.name;

  const referralText = language === 'mr'
    ? `*संजीवन-नेट तात्काळ रेफरल स्लिप (Sanjeevani-Net)*
#REF-2026-MH-8821 | MoHFW / NRHM

*रुग्णाचे नाव:* ${displayName} (${beneficiary.age} वर्षे / F)
*ABHA ID:* ${beneficiary.abhaId}
*RCH ID:* ${beneficiary.rchId}
*गर्भावस्था:* ${beneficiary.gestationalAge} (Gravida ${beneficiary.gravida})
*रक्तदाब:* ${beneficiary.vitals.systolic}/${beneficiary.vitals.diastolic} mmHg
*प्राथमिकता:* पातळी १ (तातडीचे)
*रेफरल केंद्र:* PHC Belora (Dr. Anita Sharma, MBBS)
*१०८ रुग्णवाहिका:* MH-31-AZ-4412
*नातेवाईक संपर्क:* ${beneficiary.husbandName} (${beneficiary.husbandPhone})

सुरक्षित डिजिटल रेफरल टोकन: https://sanjeevani.nhm.gov.in/ref/MH-8821`
    : language === 'hi'
    ? `*संजीवन-नेट आपातकालीन रेफरल पर्ची (Sanjeevani-Net)*
#REF-2026-MH-8821 | MoHFW / NRHM

*मरीज का नाम:* ${displayName} (${beneficiary.age} वर्ष / F)
*ABHA ID:* ${beneficiary.abhaId}
*RCH ID:* ${beneficiary.rchId}
*गर्भावस्था:* ${beneficiary.gestationalAge} (Gravida ${beneficiary.gravida})
*रक्तचाप:* ${beneficiary.vitals.systolic}/${beneficiary.vitals.diastolic} mmHg
*प्राथमिकता:* स्तर १ (तत्काल)
*रेफरल केंद्र:* PHC Belora (Dr. Anita Sharma, MBBS)
*108 एम्बुलेंस:* MH-31-AZ-4412
*परिजन संपर्क:* ${beneficiary.husbandName} (${beneficiary.husbandPhone})

सुरक्षित डिजिटल रेफरल टोकन: https://sanjeevani.nhm.gov.in/ref/MH-8821`
    : `*Sanjeevani-Net Emergency Referral Slip*
#REF-2026-MH-8821 | MoHFW / NRHM

*Patient Name:* ${displayName} (${beneficiary.age}y / F)
*ABHA ID:* ${beneficiary.abhaId}
*RCH ID:* ${beneficiary.rchId}
*Gestational Age:* ${beneficiary.gestationalAge} (Gravida ${beneficiary.gravida})
*Blood Pressure:* ${beneficiary.vitals.systolic}/${beneficiary.vitals.diastolic} mmHg
*Priority:* Level 1 (Emergency)
*Destination Facility:* PHC Belora (Dr. Anita Sharma, MBBS)
*108 Ambulance:* MH-31-AZ-4412
*Next of Kin:* ${beneficiary.husbandName} (${beneficiary.husbandPhone})

Secure Digital Referral Token: https://sanjeevani.nhm.gov.in/ref/MH-8821`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(referralText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#075e54] text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[24px] text-emerald-300">chat</span>
            <div>
              <h3 className="text-sm font-bold">
                {language === 'mr' ? 'व्हॉट्सअॅप डिजिटल रेफरल स्लिप' : language === 'hi' ? 'व्हाट्सएप डिजिटल रेफरल पर्ची' : 'WhatsApp Digital Referral Slip'}
              </h3>
              <p className="text-[10px] text-emerald-200">{language === 'mr' ? 'आरोग्य रेफरल स्लिप' : language === 'hi' ? 'स्वास्थ्य रेफरल पर्ची' : 'Health Referral Slip'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center text-xs"
          >
            ✕
          </button>
        </div>

        {/* WhatsApp Preview Card */}
        <div className="p-4 bg-[#efeae2] flex-1 overflow-y-auto space-y-3">
          <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-[#d1d7db] text-xs space-y-2 text-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-[#00434c]">Sanjeevani-Net E-Slip</span>
              <span className="bg-red-100 text-red-700 font-bold px-1.5 py-0.2 rounded text-[10px]">
                EMERGENCY
              </span>
            </div>

            <div className="space-y-1 font-mono text-[11px] leading-relaxed">
              <p><strong>{language === 'mr' ? 'रुग्ण:' : language === 'hi' ? 'मरीज:' : 'Patient:'}</strong> {displayName} ({beneficiary.age}{language === 'mr' ? ' वर्षे' : language === 'hi' ? ' वर्ष' : 'y'} / F)</p>
              <p><strong>ABHA:</strong> {beneficiary.abhaId}</p>
              <p><strong>BP:</strong> 168/104 mmHg</p>
              <p><strong>{language === 'mr' ? 'केंद्र:' : language === 'hi' ? 'गंतव्य:' : 'Facility:'}</strong> PHC Belora (Dr. Anita Sharma)</p>
              <p><strong>{language === 'mr' ? 'रुग्णवाहिका:' : language === 'hi' ? 'एम्बुलेंस:' : 'Ambulance:'}</strong> 108 (MH-31-AZ-4412)</p>
            </div>

            {/* QR Code Graphic placeholder */}
            <div className="pt-2 flex items-center space-x-3 bg-slate-50 p-2 rounded-xl">
              <div className="w-14 h-14 bg-white border border-slate-300 rounded-lg p-1 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[40px] text-slate-800">qr_code_2</span>
              </div>
              <div className="text-[10px] text-slate-500">
                <p className="font-bold text-slate-700">{language === 'mr' ? 'इमर्जन्सी डेस्कवर क्यूआर स्कॅन' : language === 'hi' ? 'इमरजेंसी डेस्क पर क्यूआर स्कैन' : 'QR Scan at Triage Desk'}</p>
                <p>{language === 'mr' ? 'त्वरित बायोमेट्रिक व वाइटल्स पडताळणी.' : language === 'hi' ? 'त्वरित बायोमेट्रिक व वाइटल्स जांच।' : 'Instant biometric & vitals check-in.'}</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <span className="text-[10px] text-slate-500">
              {language === 'mr' ? `संदेश पाठवला जाईल: ${beneficiary.husbandName} (${beneficiary.husbandPhone})` : language === 'hi' ? `संदेश भेजा जाएगा: ${beneficiary.husbandName} (${beneficiary.husbandPhone})` : `Message will be sent to ${beneficiary.husbandName} (${beneficiary.husbandPhone})`}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="p-3.5 bg-white border-t border-slate-100 space-y-2">
          <button
            onClick={handleCopy}
            className="w-full py-2.5 bg-[#25d366] hover:bg-[#20bd5a] text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-md transition-transform active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            <span>{copied ? (language === 'mr' ? 'क्लिपबोर्डवर कॉपी केले! ✓' : language === 'hi' ? 'कॉपी हो गया! ✓' : 'Copied to Clipboard! ✓') : (language === 'mr' ? 'व्हॉट्सअॅपद्वारे पाठवा' : language === 'hi' ? 'व्हाट्सएप से भेजें' : 'Send via WhatsApp')}</span>
          </button>
          <button
            onClick={onClose}
            className="w-full py-1.5 text-slate-500 text-xs font-semibold hover:underline"
          >
            {language === 'mr' ? 'बंद करा' : language === 'hi' ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
