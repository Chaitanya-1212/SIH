import React, { useState } from 'react';
import { Beneficiary, AppScreen } from '../types';
import { useAppStore } from '../store/useAppStore';
import { watermelonDb } from '../services/watermelonDb';

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

  // 5 Red Flag state variables
  const [breathingDifficulty, setBreathingDifficulty] = useState(false);
  const [severeHeadache, setSevereHeadache] = useState(true);
  const [unconsciousConfusion, setUnconsciousConfusion] = useState(false);
  const [severeAbdominalPain, setSevereAbdominalPain] = useState(true);

  // Auto-calculated from vitals:
  const isHighBp =
    beneficiary.vitals.systolic >= 140 || beneficiary.vitals.diastolic >= 90;

  const [ambulanceDispatched, setAmbulanceDispatched] = useState(false);

  const handleDispatch108 = () => {
    setAmbulanceDispatched(true);
    // Queue emergency referral in WatermelonDB SQLite
    watermelonDb.queueReferralCreation({
      beneficiaryId: beneficiary.id,
      abhaId: beneficiary.abhaId,
      facilityTarget: 'PHC Belora (Emergency Trauma Bed #3)',
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
          ? `चेतावणी: ${beneficiary.nameHindi} यांचे सिस्टोलिक रक्तदाब ${beneficiary.vitals.systolic} आहे. आसन्न प्री-एक्लेम्पसियाचा धोका असल्याने तातडीने प्राथमिक आरोग्य केंद्र बेलोरा येथे रेफर करा.`
          : `चेतावनी: ${beneficiary.nameHindi} का रक्तचाप ${beneficiary.vitals.systolic}/${beneficiary.vitals.diastolic} अत्यधिक है। तत्काल प्राथमिक स्वास्थ्य केंद्र रेफर करें।`;
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
            <span className="text-[11px]">{language === 'mr' ? '१ माहिती' : '1 मूल विवरण'}</span>
          </button>
          <span className="text-slate-300">—</span>

          <button onClick={() => onNavigate('vitals')} className="flex items-center space-x-1 text-emerald-700">
            <span className="material-symbols-outlined text-[15px]">check_circle</span>
            <span className="text-[11px]">{language === 'mr' ? '२ वाइटल्स' : '2 वाइटल्स'}</span>
          </button>
          <span className="text-slate-300">—</span>

          <div className="flex items-center space-x-1 bg-[#00434c] text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs">
            <span className="w-4 h-4 rounded-full bg-[#12b388] text-white flex items-center justify-center text-[10px] font-black">
              3
            </span>
            <span>{language === 'mr' ? '३ मूल्यांकन' : '3 मूल्यांकन'}</span>
          </div>
        </div>
      </section>

      {/* Patient Banner */}
      <section className="w-full bg-[#f1f3ff] rounded-2xl p-3.5 flex items-center justify-between border border-[#e0e8fd] shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-[#141c2b]">
              {language === 'mr' ? beneficiary.nameHindi : beneficiary.name}
            </h2>
            <span className="bg-[#ffdad6] text-[#93000a] text-[10px] font-bold px-2 py-0.5 rounded-full">
              28w ANC
            </span>
          </div>
          <p className="text-xs text-[#3f484a] font-medium mt-0.5">
            {beneficiary.age}y / F • RCH: #{beneficiary.rchId.slice(-8)} • आशा: {beneficiary.ashaWorker}
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
              {language === 'mr' ? 'धोका पातळी मूल्यांकन' : 'मरीज जोखिम मूल्यांकन'}
            </h1>
            <p className="text-xs text-[#3f484a] font-medium">
              Clinical Decision Support System (CDSS)
            </p>
          </div>
          <span className="bg-[#e0f2f1] text-[#00462f] text-xs font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1 border border-[#80cbc4]/40">
            <span className="material-symbols-outlined text-[15px] text-emerald-700">verified_user</span>
            <span>CDSS v2.4</span>
          </span>
        </div>

        {/* Disclaimer */}
        <div className="bg-[#e8eeff] p-2.5 rounded-xl border border-[#d2daef] flex items-start space-x-2 text-[11px] text-[#00434c]">
          <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">info</span>
          <p className="leading-snug">
            Frontline Decision Support • Guidelines as per NHM Maharashtra &amp; MoHFW Protocols.
          </p>
        </div>
      </div>

      {/* Checklist Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-[#ba1a1a]">
          <span className="material-symbols-outlined text-[17px]">warning</span>
          <span>
            {language === 'mr' ? 'धोकादायक लक्षणे (Red Flags)' : 'रेड-फ्लैग लक्षण चेकलिस्ट'}
          </span>
        </div>
        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
          5/5 पूर्ण
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
              <p>{language === 'mr' ? 'श्वास घेण्यास त्रास किंवा छातीत धडधड?' : 'सांस लेने में अत्यधिक कठिनाई या सीने में भारीपन?'}</p>
              <p className="text-[11px] text-slate-500 font-normal">(Difficulty breathing / severe chest tightness?)</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setBreathingDifficulty(true)}
              className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                breathingDifficulty
                  ? 'bg-[#ba1a1a] text-white shadow-xs'
                  : 'bg-[#f1f3ff] text-slate-700 hover:bg-[#e0e8fd]'
              }`}
            >
              <span>+ हाँ (YES)</span>
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
              <span>नाही (NO)</span>
            </button>
          </div>
        </div>

        {/* Question 2 */}
        <div className="bg-[#fff5f5] rounded-xl p-3 shadow-xs border border-red-100 space-y-2">
          <div className="flex items-start space-x-2 text-xs">
            <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
              2
            </span>
            <div className="font-bold text-red-950">
              <p>{language === 'mr' ? 'तीव्र डोकेदुखी किंवा डोळ्यांसमोर अंधारी? (Severe headache / blurred vision)' : 'तेज़ सिरदर्द या आँखों से धुंधला दिखना?'}</p>
              <p className="text-[11px] text-red-600 flex items-center space-x-1 mt-0.5 font-semibold">
                <span className="material-symbols-outlined text-[13px]">warning</span>
                <span>प्री-एक्लेम्पसिया धोक्याची घंटा</span>
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setSevereHeadache(true)}
              className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                severeHeadache
                  ? 'bg-[#ba1a1a] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-red-50'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">priority_high</span>
              <span>होय (YES)</span>
            </button>
            <button
              type="button"
              onClick={() => setSevereHeadache(false)}
              className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                !severeHeadache
                  ? 'bg-[#bbe7f7] text-[#00434c] shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-red-50'
              }`}
            >
              <span>नाही (NO)</span>
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
              <p>{language === 'mr' ? 'भोवळ किंवा ग्लानी येणे?' : 'बेहोशी, चक्कर या मानसिक भ्रम की स्थिति?'}</p>
              <p className="text-[11px] text-slate-500 font-normal">(Unconscious, fainting, or confusion?)</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setUnconsciousConfusion(true)}
              className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                unconsciousConfusion
                  ? 'bg-[#ba1a1a] text-white shadow-xs'
                  : 'bg-[#f1f3ff] text-slate-700 hover:bg-[#e0e8fd]'
              }`}
            >
              <span>+ हाँ (YES)</span>
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
              <span>नाही (NO)</span>
            </button>
          </div>
        </div>

        {/* Question 4 */}
        <div className="bg-[#fff5f5] rounded-xl p-3 shadow-xs border border-red-100 space-y-2">
          <div className="flex items-start space-x-2 text-xs">
            <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
              4
            </span>
            <div className="font-bold text-red-950">
              <p>{language === 'mr' ? 'पोटात तीव्र कळा किंवा रक्तस्राव? (Severe pain or vaginal bleeding)' : 'पेट के निचले हिस्से में तीव्र दर्द या रक्तस्राव?'}</p>
              <p className="text-[11px] text-red-600 flex items-center space-x-1 mt-0.5 font-semibold">
                <span className="material-symbols-outlined text-[13px]">warning</span>
                <span>तातडीचे प्रसूती लक्षण</span>
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setSevereAbdominalPain(true)}
              className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                severeAbdominalPain
                  ? 'bg-[#ba1a1a] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-red-50'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">priority_high</span>
              <span>होय (YES)</span>
            </button>
            <button
              type="button"
              onClick={() => setSevereAbdominalPain(false)}
              className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                !severeAbdominalPain
                  ? 'bg-[#bbe7f7] text-[#00434c] shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-red-50'
              }`}
            >
              <span>नाही (NO)</span>
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
                  {language === 'mr' ? 'रक्तदाब (BP) > १४०/९० mmHg नोंदवला?' : 'रक्तचाप (BP) > 140/90 mmHg दर्ज?'}
                </p>
                <p className="text-[11px] text-slate-500 font-medium">WatermelonDB SQLite EMR Record</p>
              </div>
            </div>
            <span className="bg-[#bbe7f7] text-[#00434c] text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
              सिंक केला
            </span>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <div className="flex-1 bg-red-50 border border-red-200 rounded-xl px-3 py-2 flex items-center space-x-2">
              <span className="material-symbols-outlined text-red-600 text-[20px]">monitor_heart</span>
              <span className="font-mono text-base font-black text-red-700">
                {beneficiary.vitals.systolic} / {beneficiary.vitals.diastolic}
              </span>
              <span className="text-xs text-red-600 font-bold">mmHg</span>
            </div>

            <div className="bg-[#ba1a1a] text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1 shadow-xs">
              <span className="material-symbols-outlined text-[16px]">check</span>
              <span>होय (AUTO: YES)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Result Card (High Risk container in peach/red) */}
      <section className="bg-[#ffdad6] border border-[#ba1a1a]/30 rounded-2xl p-4 space-y-3.5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#ba1a1a] animate-pulse" />
            <span className="text-xs font-black text-[#93000a] tracking-tight uppercase">
              {language === 'mr' ? 'अति-धोका / HIGH RISK' : 'उच्च जोखिम / HIGH RISK'}
            </span>
          </div>
          <span className="bg-[#ba1a1a] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
            प्राथमिकता: स्तर 1 (Red)
          </span>
        </div>

        {/* Clinical Recommendation Box */}
        <div className="bg-white rounded-xl p-3.5 border border-red-200 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#ba1a1a] tracking-wider uppercase block">
              क्लिनिकल सिफारिश (RECOMMENDATION)
            </span>

            {/* Bhashini TTS Button */}
            <button
              type="button"
              onClick={handleHearVernacularAdvice}
              className="flex items-center space-x-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md text-[10px] font-bold"
              title="Listen to advice using Bhashini Voice Assistant"
            >
              <span className="material-symbols-outlined text-[14px]">
                {bhashiniVoice.isSpeaking ? 'stop' : 'volume_up'}
              </span>
              <span>{bhashiniVoice.isSpeaking ? 'थांबवा' : 'भाषिणी ऑडिओ ऐका'}</span>
            </button>
          </div>

          <h3 className="text-sm font-black text-[#141c2b] leading-tight">
            {language === 'mr'
              ? 'प्राथमिक आरोग्य केंद्र (PHC) बेलोरा येथे तातडीने रेफर करा!'
              : 'प्राथमिक स्वास्थ्य केंद्र (PHC) तत्काल रेफरल आवश्यक'}
          </h3>
          <p className="text-xs text-slate-600">
            Urgent Referral to Primary Health Centre (PHC) Required within 2 hours.
          </p>
        </div>

        {/* Decision Rationale */}
        <div className="space-y-1.5 text-xs text-[#93000a]">
          <div className="flex items-center space-x-1 font-bold">
            <span className="material-symbols-outlined text-[16px]">psychology</span>
            <span>{language === 'mr' ? 'मूल्यांकनाचा आधार' : 'निर्णय का आधार (DECISION RATIONALE)'}</span>
          </div>

          <ul className="space-y-1 pl-1 text-[11px] text-[#790000] font-medium leading-tight">
            <li className="flex items-start space-x-1.5">
              <span className="text-red-500 font-bold">•</span>
              <span>
                <strong>उच्च रक्तदाब:</strong> Systolic BP {beneficiary.vitals.systolic} mmHg &amp; Diastolic BP {beneficiary.vitals.diastolic} mmHg (&gt;140/90).
              </span>
            </li>
            <li className="flex items-start space-x-1.5">
              <span className="text-red-500 font-bold">•</span>
              <span>
                <strong>सक्रिय धोक्याचे संकेत:</strong> तीव्र डोकेदुखी व पोटदुखी.
              </span>
            </li>
            <li className="flex items-start space-x-1.5">
              <span className="text-red-500 font-bold">•</span>
              <span>
                <strong>जोखीम श्रेणी:</strong> आसन्न प्री-एक्लेम्पसिया (Imminent Pre-Eclampsia).
              </span>
            </li>
          </ul>
        </div>

        {/* Immediate Action Card in Deep Red */}
        <div className="bg-[#ba1a1a] text-white rounded-xl p-3 flex items-start space-x-3 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[22px]">emergency</span>
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-red-200 block">
              त्वरित कार्रवाई (IMMEDIATE ACTION)
            </span>
            <p className="text-xs font-bold leading-tight mt-0.5">
              {language === 'mr'
                ? 'मातेला लगेच PHC बेलोरा किंवा जिल्हा रुग्णालय रवाना करा.'
                : 'मरीज को तुरंत PHC बेलोरा या जिला अस्पताल (DH) रवाना करें।'}
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
              {language === 'mr' ? '१०८ रुग्णवाहिका तात्काळ कॉल' : '108 एम्बुलेंस आपातकालीन लिंक'}
            </h4>
            <p className="text-[10px] text-slate-600">GPS लोकेशन व रुग्ण नोंदणी आपोआप पाठवली जाईल</p>
          </div>
        </div>
        <button
          onClick={handleDispatch108}
          className="px-3 py-1.5 bg-[#bbe7f7] hover:bg-[#a2cddd] text-[#00434c] text-xs font-bold rounded-lg transition-colors flex items-center space-x-1"
        >
          {ambulanceDispatched ? (
            <>
              <span className="material-symbols-outlined text-[14px] text-emerald-700 animate-spin">sync</span>
              <span>पाठवली जात आहे...</span>
            </>
          ) : (
            <span>कॉल करा (Ready)</span>
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
              priority: 'CRITICAL_HIGH_RISK',
              createdAt: new Date().toISOString(),
            });
            onNavigate('referral');
          }}
          className="w-full h-13 bg-[#ba1a1a] hover:bg-[#93000a] text-white text-base font-black rounded-xl flex items-center justify-center space-x-2 shadow-md active:scale-98 transition-all"
        >
          <span className="material-symbols-outlined text-[24px]">crisis_alert</span>
          <span>{language === 'mr' ? 'तातडीने रेफरल पाठवा (Referral Now)' : 'तत्काल रेफरल भेजें (Referral Now)'}</span>
          <span className="material-symbols-outlined text-[20px]">e911_emergency</span>
        </button>

        {/* Teleconsult MO Button */}
        <button
          type="button"
          onClick={onOpenTeleconsult}
          className="w-full h-12 bg-white hover:bg-slate-50 text-[#00434c] border-2 border-[#00434c] text-sm font-bold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-xs"
        >
          <span className="material-symbols-outlined text-[20px]">video_camera_front</span>
          <span>{language === 'mr' ? 'डॉक्टरांशी WebRTC व्हिडिओ कॉल' : 'डॉक्टर से टेली-परामर्श करें (Teleconsult MO)'}</span>
          <span className="material-symbols-outlined text-[16px]">call</span>
        </button>
      </div>

      {/* Footnote */}
      <p className="text-center text-[10px] text-slate-400 font-medium pt-1">
        ICMR / MoHFW MCH Protocols v2024 • संजीवन-नेट सुरक्षित स्वास्थ्य नेटवर्क
      </p>
    </div>
  );
};
