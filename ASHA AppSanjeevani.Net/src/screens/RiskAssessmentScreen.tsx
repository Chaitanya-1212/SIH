import React, { useState } from 'react';
import { Beneficiary, AppScreen } from '../types';
import { useAppStore } from '../store/useAppStore';
import { watermelonDb } from '../services/watermelonDb';
import { getTranslation } from '../i18n/translations';

interface RiskAssessmentScreenProps {
  beneficiary: Beneficiary;
  onNavigate: (screen: AppScreen) => void;
  onOpenTeleconsult: () => void;
}

export const RiskAssessmentScreen: React.FC<RiskAssessmentScreenProps> = ({
  beneficiary,
  onNavigate,
  onOpenTeleconsult,
}) => {
  const { language, speakVernacular, bhashiniVoice, stopSpeaking } = useAppStore();
  const t = getTranslation(language);

  // 5 Red Flag state variables
  const [breathingDifficulty, setBreathingDifficulty] = useState(false);
  const [severeHeadache, setSevereHeadache] = useState(true);
  const [unconsciousConfusion, setUnconsciousConfusion] = useState(false);
  const [severeAbdominalPain, setSevereAbdominalPain] = useState(true);

  // Auto-calculated from vitals:
  const isHighBp =
    beneficiary.vitals.systolic >= 140 || beneficiary.vitals.diastolic >= 90;

  const [ambulanceDispatched, setAmbulanceDispatched] = useState(false);

  const displayName = language === 'mr' 
    ? (beneficiary.nameMarathi || beneficiary.name)
    : language === 'hi' 
    ? (beneficiary.nameHindi || beneficiary.name) 
    : beneficiary.name;

  const handleDispatch108 = () => {
    setAmbulanceDispatched(true);
    // Queue emergency referral in offline database
    watermelonDb.queueReferralCreation({
      beneficiaryId: beneficiary.id,
      abhaId: beneficiary.abhaId,
      facilityTarget: 'PHC Belora (Emergency Bed #3)',
      priority: 'CRITICAL_LEVEL_1',
      ambulanceType: '108_GPS_TRACKED',
      createdAt: new Date().toISOString(),
    });

    setTimeout(() => {
      onNavigate('referral');
    }, 1200);
  };

  const handleHearVernacularAdvice = () => {
    if (bhashiniVoice.isSpeaking) {
      stopSpeaking();
    } else {
      const text =
        language === 'mr'
          ? `मूल्यांकन: ${displayName} यांचे सिस्टोलिक रक्तदाब ${beneficiary.vitals.systolic} आहे. प्राथमिक आरोग्य केंद्र बेलोरा येथे तपासणी व सल्ला घेण्याची शिफारस.`
          : language === 'hi'
          ? `मूल्यांकन: ${displayName} का रक्तचाप ${beneficiary.vitals.systolic}/${beneficiary.vitals.diastolic} है। प्राथमिक स्वास्थ्य केंद्र में डॉक्टर परामर्श की सिफारिश की गई है।`
          : `Assessment: ${displayName}'s blood pressure is ${beneficiary.vitals.systolic}/${beneficiary.vitals.diastolic} mmHg. Clinical evaluation and PHC consultation recommended.`;
      speakVernacular(text);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-3.5 pb-24">
      {/* Stepper Bar */}
      <section className="w-full bg-white rounded-xl p-2.5 shadow-xs border border-[#e0e8fd]">
        <div className="flex items-center justify-between text-xs font-semibold">
          <button onClick={() => onNavigate('beneficiary')} className="flex items-center space-x-1 text-emerald-700">
            <span className="material-symbols-outlined text-[15px]">check_circle</span>
            <span className="text-[11px]">{language === 'mr' ? '१ माहिती' : language === 'hi' ? '1 मूल विवरण' : '1 Info'}</span>
          </button>
          <span className="text-slate-300">—</span>

          <button onClick={() => onNavigate('vitals')} className="flex items-center space-x-1 text-emerald-700">
            <span className="material-symbols-outlined text-[15px]">check_circle</span>
            <span className="text-[11px]">{language === 'mr' ? '२ वाइटल्स' : language === 'hi' ? '2 वाइटल्स' : '2 Vitals'}</span>
          </button>
          <span className="text-slate-300">—</span>

          <div className="flex items-center space-x-1 bg-[#00434c] text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs">
            <span className="w-4 h-4 rounded-full bg-[#12b388] text-white flex items-center justify-center text-[10px] font-black">
              3
            </span>
            <span>{language === 'mr' ? '३ मूल्यांकन' : language === 'hi' ? '3 मूल्यांकन' : '3 Assess'}</span>
          </div>
        </div>
      </section>

      {/* Patient Banner */}
      <section className="w-full bg-[#f1f3ff] rounded-2xl p-3.5 flex items-center justify-between border border-[#e0e8fd] shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-[#141c2b]">
              {displayName}
            </h2>
            <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200">
              28w ANC
            </span>
          </div>
          <p className="text-xs text-[#3f484a] font-medium mt-0.5">
            {beneficiary.age}{language === 'mr' ? 'वर्षे' : language === 'hi' ? 'वर्ष' : 'y'} / F • RCH: #{beneficiary.rchId.slice(-8)} • {language === 'mr' ? 'आशा' : language === 'hi' ? 'आशा' : 'ASHA'}: {beneficiary.ashaWorker}
          </p>
        </div>

        <div className="w-9 h-9 rounded-xl bg-[#bbe7f7] text-[#00434c] flex items-center justify-center">
          <span className="material-symbols-outlined text-[22px]">pregnant_woman</span>
        </div>
      </section>

      {/* Section Title & CDSS version */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black text-[#00434c] tracking-tight">
              {t.cdssHeader}
            </h1>
            <p className="text-xs text-[#3f484a] font-medium">
              {language === 'mr' ? 'क्लिनिकल निर्णय साहाय्य' : language === 'hi' ? 'क्लिनिकल निर्णय सहायता' : 'Clinical Decision Support'}
            </p>
          </div>
          <span className="bg-[#e0f2f1] text-[#00462f] text-xs font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1 border border-[#80cbc4]/40">
            <span className="material-symbols-outlined text-[15px] text-emerald-700">verified_user</span>
            <span>{language === 'mr' ? 'आरोग्य मार्गदर्शक' : language === 'hi' ? 'स्वास्थ्य दिशानिर्देश' : 'Clinical Protocol'}</span>
          </span>
        </div>

        {/* Disclaimer */}
        <div className="bg-[#e8eeff] p-2.5 rounded-xl border border-[#d2daef] flex items-start space-x-2 text-[11px] text-[#00434c]">
          <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">info</span>
          <p className="leading-snug">
            {language === 'mr' 
              ? 'आरोग्य विभाग महाराष्ट्र व राष्ट्रीय आरोग्य अभियान मार्गदर्शक तत्त्वांनुसार क्लिनिकल प्रोटोकॉल.'
              : language === 'hi'
              ? 'राष्ट्रीय स्वास्थ्य मिशन (NHM) एवं MoHFW प्रोटोकॉल अनुसार क्लिनिकल निर्णय प्रणाली।'
              : 'Frontline Clinical Decision Support • Guidelines as per NHM & MoHFW Protocols.'}
          </p>
        </div>
      </div>

      {/* Checklist Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-[#00434c]">
          <span className="material-symbols-outlined text-[17px]">checklist</span>
          <span>
            {language === 'mr' ? 'मातृ आरोग्य लक्षणे तपासणी' : language === 'hi' ? 'मातृ स्वास्थ्य लक्षण जांच' : 'Maternal Health Assessment Checklist'}
          </span>
        </div>
        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
          {language === 'mr' ? '५/५ पूर्ण' : language === 'hi' ? '5/5 पूर्ण' : '5/5 Complete'}
        </span>
      </div>

      {/* Checklist Questions */}
      <div className="space-y-2.5">
        {/* Question 1 */}
        <div className="bg-white rounded-xl p-3 shadow-xs border border-[#e0e8fd] space-y-2">
          <div className="flex items-start space-x-2 text-xs">
            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
              1
            </span>
            <div className="font-semibold text-[#141c2b]">
              <p>{t.flagBreathing}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setBreathingDifficulty(true)}
              className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                breathingDifficulty
                  ? 'bg-[#00434c] text-white shadow-xs'
                  : 'bg-[#f1f3ff] text-slate-700 hover:bg-[#e0e8fd]'
              }`}
            >
              <span>{language === 'mr' ? 'होय (YES)' : language === 'hi' ? 'हाँ (YES)' : 'YES'}</span>
            </button>
            <button
              type="button"
              onClick={() => setBreathingDifficulty(false)}
              className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                !breathingDifficulty
                  ? 'bg-[#bbe7f7] text-[#00434c] shadow-xs'
                  : 'bg-[#f1f3ff] text-slate-700 hover:bg-[#e0e8fd]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">check</span>
              <span>{language === 'mr' ? 'नाही (NO)' : language === 'hi' ? 'नहीं (NO)' : 'NO'}</span>
            </button>
          </div>
        </div>

        {/* Question 2 */}
        <div className="bg-white rounded-xl p-3 shadow-xs border border-[#e0e8fd] space-y-2">
          <div className="flex items-start space-x-2 text-xs">
            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
              2
            </span>
            <div className="font-semibold text-[#141c2b]">
              <p>{t.flagHeadache}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setSevereHeadache(true)}
              className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                severeHeadache
                  ? 'bg-[#00434c] text-white shadow-xs'
                  : 'bg-[#f1f3ff] text-slate-700 hover:bg-[#e0e8fd]'
              }`}
            >
              <span>{language === 'mr' ? 'होय (YES)' : language === 'hi' ? 'हाँ (YES)' : 'YES'}</span>
            </button>
            <button
              type="button"
              onClick={() => setSevereHeadache(false)}
              className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                !severeHeadache
                  ? 'bg-[#bbe7f7] text-[#00434c] shadow-xs'
                  : 'bg-[#f1f3ff] text-slate-700 hover:bg-[#e0e8fd]'
              }`}
            >
              <span>{language === 'mr' ? 'नाही (NO)' : language === 'hi' ? 'नहीं (NO)' : 'NO'}</span>
            </button>
          </div>
        </div>

        {/* Question 3 */}
        <div className="bg-white rounded-xl p-3 shadow-xs border border-[#e0e8fd] space-y-2">
          <div className="flex items-start space-x-2 text-xs">
            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
              3
            </span>
            <div className="font-semibold text-[#141c2b]">
              <p>{t.flagConfusion}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setUnconsciousConfusion(true)}
              className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                unconsciousConfusion
                  ? 'bg-[#00434c] text-white shadow-xs'
                  : 'bg-[#f1f3ff] text-slate-700 hover:bg-[#e0e8fd]'
              }`}
            >
              <span>{language === 'mr' ? 'होय (YES)' : language === 'hi' ? 'हाँ (YES)' : 'YES'}</span>
            </button>
            <button
              type="button"
              onClick={() => setUnconsciousConfusion(false)}
              className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                !unconsciousConfusion
                  ? 'bg-[#bbe7f7] text-[#00434c] shadow-xs'
                  : 'bg-[#f1f3ff] text-slate-700 hover:bg-[#e0e8fd]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">check</span>
              <span>{language === 'mr' ? 'नाही (NO)' : language === 'hi' ? 'नहीं (NO)' : 'NO'}</span>
            </button>
          </div>
        </div>

        {/* Question 4 */}
        <div className="bg-white rounded-xl p-3 shadow-xs border border-[#e0e8fd] space-y-2">
          <div className="flex items-start space-x-2 text-xs">
            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
              4
            </span>
            <div className="font-semibold text-[#141c2b]">
              <p>{t.flagBleeding}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setSevereAbdominalPain(true)}
              className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                severeAbdominalPain
                  ? 'bg-[#00434c] text-white shadow-xs'
                  : 'bg-[#f1f3ff] text-slate-700 hover:bg-[#e0e8fd]'
              }`}
            >
              <span>{language === 'mr' ? 'होय (YES)' : language === 'hi' ? 'हाँ (YES)' : 'YES'}</span>
            </button>
            <button
              type="button"
              onClick={() => setSevereAbdominalPain(false)}
              className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                !severeAbdominalPain
                  ? 'bg-[#bbe7f7] text-[#00434c] shadow-xs'
                  : 'bg-[#f1f3ff] text-slate-700 hover:bg-[#e0e8fd]'
              }`}
            >
              <span>{language === 'mr' ? 'नाही (NO)' : language === 'hi' ? 'नहीं (NO)' : 'NO'}</span>
            </button>
          </div>
        </div>

        {/* Question 5: Auto-populated BP */}
        <div className="bg-white rounded-xl p-3 shadow-xs border border-[#e0e8fd] space-y-2">
          <div className="flex items-start justify-between text-xs">
            <div className="flex items-start space-x-2">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                5
              </span>
              <div>
                <p className="font-bold text-[#141c2b]">
                  {t.flagHighBp}
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  {t.emrVerifiedRecord}
                </p>
              </div>
            </div>
            <span className="bg-[#bbe7f7] text-[#00434c] text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
              {t.verified}
            </span>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <div className="flex-1 bg-[#f1f3ff] border border-[#e0e8fd] rounded-xl px-3 py-2 flex items-center space-x-2">
              <span className="material-symbols-outlined text-[#00434c] text-[20px]">monitor_heart</span>
              <span className="font-mono text-base font-black text-[#00434c]">
                {beneficiary.vitals.systolic} / {beneficiary.vitals.diastolic}
              </span>
              <span className="text-xs text-slate-600 font-bold">mmHg</span>
            </div>

            <div className="bg-[#00434c] text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1 shadow-xs">
              <span className="material-symbols-outlined text-[16px]">check</span>
              <span>{language === 'mr' ? 'नोंदवले (AUTO)' : language === 'hi' ? 'दर्ज (AUTO)' : 'RECORDED'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Result Card: Clinical Recommendation */}
      <section className="bg-slate-50 border border-[#e0e8fd] rounded-2xl p-4 space-y-3.5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
            <span className="text-xs font-bold text-[#00434c] tracking-tight uppercase">
              {language === 'mr' ? 'क्लिनिकल मूल्यांकन निष्कर्ष' : language === 'hi' ? 'क्लिनिकल मूल्यांकन निष्कर्ष' : 'Clinical Assessment Summary'}
            </span>
          </div>
          <span className="bg-[#00434c] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
            {language === 'mr' ? 'वैद्यकीय सल्ला आवश्यक' : language === 'hi' ? 'डॉक्टर परामर्श अनुशंसित' : 'Doctor Consultation Recommended'}
          </span>
        </div>

        {/* Clinical Recommendation Box */}
        <div className="bg-white rounded-xl p-3.5 border border-[#e0e8fd] space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#00434c] tracking-wider uppercase block">
              {language === 'mr' ? 'क्लिनिकल शिफारस' : language === 'hi' ? 'क्लिनिकल सिफारिश' : 'CLINICAL RECOMMENDATION'}
            </span>

            {/* Bhashini TTS Button */}
            <button
              type="button"
              onClick={handleHearVernacularAdvice}
              className="flex items-center space-x-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md text-[10px] font-bold"
              title="Voice Guidance"
            >
              <span className="material-symbols-outlined text-[14px]">
                {bhashiniVoice.isSpeaking ? 'stop' : 'volume_up'}
              </span>
              <span>{bhashiniVoice.isSpeaking ? (language === 'mr' ? 'थांबवा' : language === 'hi' ? 'रोकें' : 'Stop') : t.voiceGuidanceBtn}</span>
            </button>
          </div>

          <h3 className="text-sm font-bold text-[#141c2b] leading-tight">
            {language === 'mr' ? 'तपासणी व प्राथमिक आरोग्य केंद्र (PHC) सल्लामसलत' : language === 'hi' ? 'प्राथमिक स्वास्थ्य केंद्र (PHC) परामर्श एवं जांच' : 'Medical Evaluation & PHC Consultation'}
          </h3>
          <p className="text-xs text-slate-600">
            {language === 'mr' ? 'मातेच्या आरोग्यासाठी व रक्तदाब व्यवस्थापनासाठी प्राथमिक आरोग्य केंद्र (PHC) येथे भेट देण्याची शिफारस केली जाते.' : language === 'hi' ? 'गर्भवती के स्वास्थ्य एवं रक्तचाप नियंत्रण के लिए प्राथमिक स्वास्थ्य केंद्र पर विशेषज्ञ परामर्श की सिफारिश।' : 'Recommended to visit Primary Health Centre (PHC) for clinical assessment and blood pressure management.'}
          </p>
        </div>

        {/* Decision Rationale */}
        <div className="space-y-1.5 text-xs text-[#00434c]">
          <div className="flex items-center space-x-1 font-bold">
            <span className="material-symbols-outlined text-[16px]">psychology</span>
            <span>{language === 'mr' ? 'मूल्यांकन नोंदी' : language === 'hi' ? 'मूल्यांकन विवरण' : 'Assessment Factors'}</span>
          </div>

          <ul className="space-y-1 pl-1 text-[11px] text-slate-700 font-medium leading-tight">
            <li className="flex items-start space-x-1.5">
              <span className="text-teal-600 font-bold">•</span>
              <span>
                <strong>{t.bloodPressure}:</strong> Systolic BP {beneficiary.vitals.systolic} mmHg &amp; Diastolic BP {beneficiary.vitals.diastolic} mmHg.
              </span>
            </li>
            <li className="flex items-start space-x-1.5">
              <span className="text-teal-600 font-bold">•</span>
              <span>
                <strong>{language === 'mr' ? 'लक्षणे' : language === 'hi' ? 'लक्षण' : 'Reported Symptoms'}:</strong> {language === 'mr' ? 'डोकेदुखी व अस्वस्थता.' : language === 'hi' ? 'सिरदर्द एवं बेचैनी।' : 'Headache and discomfort.'}
              </span>
            </li>
            <li className="flex items-start space-x-1.5">
              <span className="text-teal-600 font-bold">•</span>
              <span>
                <strong>{language === 'mr' ? 'प्रोटोकॉल कृती' : language === 'hi' ? 'प्रोटोकॉल' : 'Action Protocol'}:</strong> {language === 'mr' ? 'वैद्यकीय अधिकाऱ्यांशी सल्लामसलत किंवा रेफरल' : language === 'hi' ? 'चिकित्सा अधिकारी परामर्श अथवा रेफरल' : 'Medical Officer consultation or specialist review'}.
              </span>
            </li>
          </ul>
        </div>

        {/* Recommended Facility Action */}
        <div className="bg-[#00434c] text-white rounded-xl p-3 flex items-start space-x-3 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[22px]">local_hospital</span>
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-teal-200 block">
              {language === 'mr' ? 'शिफारस केलेली कृती' : language === 'hi' ? 'अनुशंसित कदम' : 'RECOMMENDED STEP'}
            </span>
            <p className="text-xs font-bold leading-tight mt-0.5">
              {language === 'mr'
                ? 'मातेस PHC बेलोरा येथे पुढील तपासणीसाठी रेफर करा किंवा टेलिकन्सल्टेशन सुरू करा.'
                : language === 'hi'
                ? 'मातृ स्वास्थ्य हेतु PHC बेलोरा पर रेफर करें या टेलीकंसल्टेशन शुरू करें।'
                : 'Refer patient to PHC Belora for assessment or initiate teleconsultation.'}
            </p>
          </div>
        </div>
      </section>

      {/* 108 Ambulance Dispatch Bar */}
      <section className="bg-[#e8eeff] border border-[#d2daef] rounded-xl p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <span className="material-symbols-outlined text-[#00434c] text-[22px]">call_split</span>
          <div>
            <h4 className="text-xs font-bold text-[#00434c]">
              {language === 'mr' ? '१०८ रुग्णवाहिका लिंक' : language === 'hi' ? '108 एम्बुलेंस लिंक' : '108 Ambulance Transport Link'}
            </h4>
            <p className="text-[10px] text-slate-600">{language === 'mr' ? 'GPS लोकेशन व रुग्ण नोंदणी पाठवली जाईल' : language === 'hi' ? 'GPS लोकेशन एवं मरीज विवरण भेजा जाएगा' : 'GPS location & patient summary dispatched'}</p>
          </div>
        </div>
        <button
          onClick={handleDispatch108}
          className="px-3 py-1.5 bg-[#bbe7f7] hover:bg-[#a2cddd] text-[#00434c] text-xs font-bold rounded-lg transition-colors flex items-center space-x-1"
        >
          {ambulanceDispatched ? (
            <>
              <span className="material-symbols-outlined text-[14px] text-emerald-700 animate-spin">sync</span>
              <span>{language === 'mr' ? 'पाठवत आहे...' : language === 'hi' ? 'भेजा जा रहा है...' : 'Dispatching...'}</span>
            </>
          ) : (
            <span>{t.callAmbulanceBtn}</span>
          )}
        </button>
      </section>

      {/* Bottom CTA Buttons */}
      <div className="space-y-2 pt-1">
        {/* Referral Now Button */}
        <button
          type="button"
          onClick={() => {
            watermelonDb.queueReferralCreation({
              beneficiaryId: beneficiary.id,
              priority: 'ROUTINE_REFERRAL',
              createdAt: new Date().toISOString(),
            });
            onNavigate('referral');
          }}
          className="w-full h-13 bg-[#00434c] hover:bg-[#00343b] text-white text-base font-bold rounded-xl flex items-center justify-center space-x-2 shadow-md active:scale-98 transition-all"
        >
          <span className="material-symbols-outlined text-[24px]">send_to_mobile</span>
          <span>{t.dispatchReferralBtn}</span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>

        {/* Teleconsult MO Button */}
        <button
          type="button"
          onClick={onOpenTeleconsult}
          className="w-full h-12 bg-white hover:bg-slate-50 text-[#00434c] border-2 border-[#00434c] text-sm font-bold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-xs"
        >
          <span className="material-symbols-outlined text-[20px]">video_camera_front</span>
          <span>{t.teleconsultDoctorBtn}</span>
          <span className="material-symbols-outlined text-[16px]">call</span>
        </button>
      </div>
    </div>
  );
};
