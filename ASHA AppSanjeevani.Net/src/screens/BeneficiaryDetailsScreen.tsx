import React, { useState } from 'react';
import { Beneficiary, AppScreen } from '../types';
import { useAppStore } from '../store/useAppStore';
import { getTranslation } from '../i18n/translations';

interface BeneficiaryDetailsScreenProps {
  beneficiary: Beneficiary;
  onNavigate: (screen: AppScreen) => void;
  onOpenTeleconsult: () => void;
}

export const BeneficiaryDetailsScreen: React.FC<BeneficiaryDetailsScreenProps> = ({
  beneficiary,
  onNavigate,
  onOpenTeleconsult,
}) => {
  const { language } = useAppStore();
  const t = getTranslation(language);

  const [showProtocolModal, setShowProtocolModal] = useState(false);
  const [callingPhone, setCallingPhone] = useState<string | null>(null);

  const handleCall = (phone: string, name: string) => {
    setCallingPhone(`${name} (${phone})`);
    setTimeout(() => {
      setCallingPhone(null);
    }, 3000);
  };

  const displayName = language === 'mr' 
    ? (beneficiary.nameMarathi || beneficiary.name)
    : language === 'hi' 
    ? (beneficiary.nameHindi || beneficiary.name) 
    : beneficiary.name;

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4 pb-24">
      {/* Beneficiary Profile Card */}
      <section className="w-full bg-white rounded-2xl p-4 shadow-sm border border-[#e0e8fd] space-y-3">
        <div className="flex items-start space-x-3.5">
          <div className="relative shrink-0">
            <img
              src={beneficiary.photoUrl}
              alt={beneficiary.name}
              className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-sm"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[13px] shadow">
              <span className="material-symbols-outlined text-[13px]">check</span>
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 flex-wrap">
              <h2 className="text-lg font-bold text-[#141c2b] tracking-tight">{displayName}</h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e0f2f1] text-[#00462f] border border-[#80cbc4]/40">
                <span className="material-symbols-outlined text-[12px] mr-0.5 text-emerald-700">verified</span>
                {t.abhaVerified}
              </span>
            </div>
            <p className="text-xs text-[#3f484a] font-medium mt-0.5">
              {beneficiary.age} {language === 'mr' ? 'वर्षे' : language === 'hi' ? 'वर्ष' : 'yrs'} • {language === 'mr' ? 'स्त्री' : language === 'hi' ? 'महिला' : 'Female'} • {beneficiary.village}
            </p>
            <p className="text-xs text-[#00434c] font-semibold mt-1 flex items-center space-x-1">
              <span className="material-symbols-outlined text-[14px]">badge</span>
              <span>{t.abhaIdLabel}: <strong className="font-mono">{beneficiary.abhaId}</strong></span>
            </p>
          </div>
        </div>

        {/* Husband Contact Bar */}
        <div className="w-full bg-[#f1f3ff] rounded-xl p-2.5 flex items-center justify-between border border-[#e0e8fd]">
          <div className="flex items-center space-x-2 text-xs font-medium text-[#141c2b] truncate pr-1">
            <span className="material-symbols-outlined text-[18px] text-red-500">contact_phone</span>
            <span className="truncate">{beneficiary.husbandName} ({t.husbandLabel})</span>
          </div>
          <button
            onClick={() => handleCall(beneficiary.husbandPhone, beneficiary.husbandName)}
            className="shrink-0 flex items-center space-x-1 px-3 py-1 bg-[#e0e8fd] hover:bg-[#d2daef] text-[#00434c] rounded-lg text-xs font-bold transition-colors"
          >
            <span className="material-symbols-outlined text-[14px] text-emerald-700">call</span>
            <span>{beneficiary.husbandPhone}</span>
          </button>
        </div>
      </section>

      {/* Calling notification toast */}
      {callingPhone && (
        <div className="bg-emerald-800 text-white rounded-xl p-3 flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined animate-bounce text-emerald-300">ring_volume</span>
            <span className="text-xs font-semibold">{t.callingToast}: {callingPhone}</span>
          </div>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">SIM 1</span>
        </div>
      )}

      {/* 3 Primary Action Buttons */}
      <section className="grid grid-cols-3 gap-2.5">
        {/* Refer Case */}
        <button
          onClick={() => onNavigate('referral')}
          className="bg-[#00434c] hover:bg-[#0a5c67] text-white py-3 px-2 rounded-xl flex flex-col items-center justify-center shadow-sm transition-transform active:scale-95 text-center"
        >
          <span className="material-symbols-outlined text-[24px]">local_hospital</span>
          <span className="text-xs font-bold mt-1 leading-tight">{language === 'mr' ? 'रेफरल पाठवा' : language === 'hi' ? 'रेफरल भेजें' : 'Refer Patient'}</span>
          <span className="text-[10px] opacity-80 mt-0.5">108 Ambulance</span>
        </button>

        {/* Teleconsult */}
        <button
          onClick={onOpenTeleconsult}
          className="bg-[#00434c] hover:bg-[#0a5c67] text-white py-3 px-2 rounded-xl flex flex-col items-center justify-center shadow-sm transition-transform active:scale-95 text-center"
        >
          <span className="material-symbols-outlined text-[24px]">headset_mic</span>
          <span className="text-xs font-bold mt-1 leading-tight">{language === 'mr' ? 'व्हिडिओ कॉल' : language === 'hi' ? 'टेली-परामर्श' : 'Teleconsult'}</span>
          <span className="text-[10px] opacity-80 mt-0.5">{language === 'mr' ? 'डॉक्टर' : language === 'hi' ? 'डॉक्टर' : 'Doctor'}</span>
        </button>

        {/* Follow-up / Record Vitals */}
        <button
          onClick={() => onNavigate('vitals')}
          className="bg-[#3a6472] hover:bg-[#204c5a] text-white py-3 px-2 rounded-xl flex flex-col items-center justify-center shadow-sm transition-transform active:scale-95 text-center"
        >
          <span className="material-symbols-outlined text-[24px]">assignment</span>
          <span className="text-xs font-bold mt-1 leading-tight">{t.navVitals}</span>
          <span className="text-[10px] opacity-80 mt-0.5">{language === 'mr' ? 'नोंदणी' : language === 'hi' ? 'जांच' : 'Record'}</span>
        </button>
      </section>

      {/* Latest Vitals Section */}
      <section className="w-full bg-white rounded-2xl p-4 shadow-sm border border-[#e0e8fd] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[#00434c] text-[20px]">monitor_heart</span>
            <h3 className="text-sm font-bold text-[#141c2b]">{t.vitalsSummary}</h3>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-xs text-[#3a6472] bg-[#f1f3ff] px-2 py-0.5 rounded-full font-medium flex items-center space-x-1">
              <span className="material-symbols-outlined text-[13px]">schedule</span>
              <span>{beneficiary.vitals.recordedAt || 'Recent'}</span>
            </span>
          </div>
        </div>

        {/* Vitals Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Blood Pressure */}
          <div className="bg-[#f1f3ff] border border-[#e0e8fd] rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#00434c] tracking-wider uppercase">{t.bloodPressure}</span>
              <span className="material-symbols-outlined text-[#00434c] text-[16px]">favorite</span>
            </div>
            <div className="my-1">
              <span className="text-2xl font-black text-[#00434c] font-mono tracking-tight">{beneficiary.vitals.systolic}/{beneficiary.vitals.diastolic}</span>
              <span className="text-xs font-bold text-slate-600 ml-1">mmHg</span>
            </div>
            <p className="text-[10px] text-slate-600 font-medium leading-tight">
              {language === 'mr' ? 'नोंदणीकृत रक्तदाब' : language === 'hi' ? 'दर्ज रक्तचाप' : 'Recorded Blood Pressure'}
            </p>
          </div>

          {/* SpO2 */}
          <div className="bg-[#f1f3ff] border border-[#e0e8fd] rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#00434c] tracking-wider uppercase">{t.oxygenSpO2}</span>
              <span className="material-symbols-outlined text-[#00434c] text-[16px]">air</span>
            </div>
            <div className="my-1">
              <span className="text-2xl font-black text-[#00434c] font-mono tracking-tight">{beneficiary.vitals.spo2}</span>
              <span className="text-xs font-bold text-slate-600 ml-1">%</span>
            </div>
            <p className="text-[10px] text-emerald-700 font-semibold leading-tight">
              {language === 'mr' ? 'सामान्य ऑक्सिजन स्तर' : language === 'hi' ? 'सामान्य स्तर' : 'Normal Room Air'}
            </p>
          </div>

          {/* Pulse Rate */}
          <div className="bg-[#f1f3ff] border border-[#e0e8fd] rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#00434c] tracking-wider uppercase">{t.pulseRate}</span>
              <span className="material-symbols-outlined text-[#00434c] text-[16px]">favorite</span>
            </div>
            <div className="my-1">
              <span className="text-2xl font-black text-[#00434c] font-mono tracking-tight">{beneficiary.vitals.pulse}</span>
              <span className="text-xs font-bold text-slate-600 ml-1">BPM</span>
            </div>
            <p className="text-[10px] text-slate-600 font-semibold leading-tight">
              {language === 'mr' ? 'नियमित ठोके' : language === 'hi' ? 'नियमित गति' : 'Rhythmic & Normal'}
            </p>
          </div>

          {/* Temperature */}
          <div className="bg-[#f1f3ff] border border-[#e0e8fd] rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#00434c] tracking-wider uppercase">{t.temperature}</span>
              <span className="material-symbols-outlined text-[#00434c] text-[16px]">device_thermostat</span>
            </div>
            <div className="my-1">
              <span className="text-2xl font-black text-[#00434c] font-mono tracking-tight">{beneficiary.vitals.temperature}</span>
              <span className="text-xs font-bold text-slate-600 ml-1">°F</span>
            </div>
            <p className="text-[10px] text-amber-700 font-semibold leading-tight">
              {beneficiary.vitals.temperature >= 99 ? (language === 'mr' ? 'किरकोळ उष्णता' : language === 'hi' ? 'हल्का बुखार' : 'Low-grade warmth') : 'Normal'}
            </p>
          </div>
        </div>

        {/* Body Weight Full Width */}
        <div className="bg-[#e8eeff] border border-[#d2daef] rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[#00434c] text-[20px]">scale</span>
            <div>
              <span className="text-xs font-bold text-[#00434c]">{t.bodyWeight}</span>
              <p className="text-[10px] text-slate-600">{language === 'mr' ? 'या महिन्यात +१.८ किग्रॅ' : language === 'hi' ? 'इस माह +1.8 किग्रा' : '+1.8kg this month'}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xl font-black text-[#00434c] font-mono">{beneficiary.vitals.weight}</span>
            <span className="text-xs font-bold text-slate-600 ml-1">kg</span>
          </div>
        </div>
      </section>

      {/* Care Plan & Rx */}
      <section className="w-full bg-white rounded-2xl p-4 shadow-sm border border-[#e0e8fd] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[#00434c] text-[20px]">medication</span>
            <h3 className="text-sm font-bold text-[#141c2b]">
              {language === 'mr' ? 'उपचार योजना व औषधे (Care Plan)' : language === 'hi' ? 'उपचार योजना एवं दवाइयां' : 'Care Plan & Prescriptions'}
            </h3>
          </div>
          <span className="text-[11px] font-bold bg-[#85f8c4] text-[#002114] px-2 py-0.5 rounded-md flex items-center space-x-1">
            <span className="material-symbols-outlined text-[13px]">calendar_today</span>
            <span>08 Sep</span>
          </span>
        </div>

        {/* Medication 1 */}
        <div className="bg-[#f1f3ff] rounded-xl p-3 border border-[#e0e8fd] space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#141c2b]">Tab Labetalol 100mg</h4>
            <span className="px-2 py-0.5 bg-[#00434c] text-white text-[11px] font-bold rounded-md font-mono">
              1 - 0 - 1
            </span>
          </div>
          <p className="text-[11px] text-[#3f484a]">
            {language === 'mr' ? 'उच्च रक्तदाब गोळी • सकाळी व रात्री जेवणानंतर' : language === 'hi' ? 'रक्तचाप नियंत्रक गोली • सुबह और रात भोजन पश्चात' : 'Oral anti-hypertensive • Morning & Night post-meals'}
          </p>
        </div>

        {/* Medication 2 */}
        <div className="bg-[#f1f3ff] rounded-xl p-3 border border-[#e0e8fd] space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#141c2b]">IFA Tablets (Iron Folic Acid)</h4>
            <span className="px-2 py-0.5 bg-[#00434c] text-white text-[11px] font-bold rounded-md font-mono">
              0 - 1 - 0
            </span>
          </div>
          <p className="text-[11px] text-[#3f484a]">
            {language === 'mr' ? 'दररोज दुपारी जेवणानंतर १ गोळी लिंबू पाण्यासोबत' : language === 'hi' ? 'प्रतिदिन दोपहर के भोजन के बाद 1 गोली नींबू पानी के साथ' : '1 tablet daily post afternoon lunch with lemon water'}
          </p>
        </div>

        {/* Care Directives Notice Box */}
        <div className="bg-[#fff3e0] border border-amber-200 rounded-xl p-3 flex items-start space-x-2.5">
          <span className="material-symbols-outlined text-amber-700 text-[18px] shrink-0 mt-0.5">
            chat
          </span>
          <div className="text-[11px] text-amber-950 space-y-0.5">
            <strong className="font-bold block text-amber-900">
              {language === 'mr' ? 'काळजी सूचना (Care Directives)' : language === 'hi' ? 'महत्वपूर्ण देखभाल निर्देश' : 'Care Directives'}
            </strong>
            <p>
              {language === 'mr'
                ? 'आहारात मिठाचे प्रमाण कमी ठेवा. डोकेदुखी किंवा डोळ्यांसमोर अंधारी आल्यास त्वरित १०८ ला कॉल करा.'
                : language === 'hi'
                ? 'आहार में नमक की मात्रा सीमित रखें। सिरदर्द या चक्कर आने पर तत्काल 108 एम्बुलेंस से संपर्क करें।'
                : 'Strict dietary salt restriction. Call 108 emergency ambulance immediately if dizziness or vision blurring occurs.'}
            </p>
          </div>
        </div>
      </section>

      {/* View Protocol Modal */}
      {showProtocolModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-4 border border-slate-100 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-red-600">warning</span>
                <h3 className="font-bold text-base text-red-700">{t.clinicalProtocolModalTitle}</h3>
              </div>
              <button
                onClick={() => setShowProtocolModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>
            <div className="text-xs text-slate-700 space-y-2 leading-relaxed bg-red-50 p-3 rounded-xl border border-red-200">
              {language === 'mr' ? (
                <>
                  <p><strong>१. तातडीने रेफरल:</strong> BP &gt; १४०/९० व डोकेदुखी असल्यास जवळच्या PHC ला त्वरित पाठवा.</p>
                  <p><strong>२. मॅग्नेशियम सल्फेट:</strong> केवळ डॉक्टरांच्या देखरेखीखाली IV लोडिंग डोस द्या.</p>
                  <p><strong>३. १०८ रुग्णवाहिका:</strong> मातेला डाव्या कुशीवर झोपवून रुग्णवाहिकेतून नेणे आवश्यक आहे.</p>
                </>
              ) : language === 'hi' ? (
                <>
                  <p><strong>1. त्वरित रेफरल:</strong> BP &gt; 140/90 और सिरदर्द होने पर तुरंत नजदीकी PHC/DH रेफर करें।</p>
                  <p><strong>2. मैग्नीशियम सल्फेट:</strong> केवल डॉक्टर/MO की निगरानी में IV लोडिंग डोज दें।</p>
                  <p><strong>3. 108 एम्बुलेंस:</strong> एम्बुलेंस को कॉल कर मरीज को बायीं करवट लिटाकर ले जाएं।</p>
                </>
              ) : (
                <>
                  <p><strong>1. Immediate Referral:</strong> If BP &gt; 140/90 with headache, transfer immediately to PHC/FRU.</p>
                  <p><strong>2. Magnesium Sulfate:</strong> Administer loading dose under Medical Officer guidance only.</p>
                  <p><strong>3. 108 Ambulance:</strong> Keep patient in left-lateral position during transit.</p>
                </>
              )}
            </div>
            <button
              onClick={() => {
                setShowProtocolModal(false);
                onNavigate('referral');
              }}
              className="w-full py-2.5 bg-[#ba1a1a] text-white font-bold rounded-xl text-sm shadow-md"
            >
              {language === 'mr' ? 'रेफरल ट्रॅकिंगकडे जा (Go to Referral)' : language === 'hi' ? 'आगे रेफरल ट्रैक करें (Go to Referral)' : 'Track Facility Referral'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
