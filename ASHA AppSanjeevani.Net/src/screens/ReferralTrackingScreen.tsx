import React, { useState, useEffect } from 'react';
import { Beneficiary, Facility, AppScreen } from '../types';
import { FACILITIES } from '../data/mockData';
import { useAppStore } from '../store/useAppStore';
import { getTranslation } from '../i18n/translations';

interface ReferralTrackingScreenProps {
  beneficiary: Beneficiary;
  onNavigate: (screen: AppScreen) => void;
  onOpenTeleconsult: () => void;
  onOpenWhatsAppSlip: () => void;
}

export const ReferralTrackingScreen: React.FC<ReferralTrackingScreenProps> = ({
  beneficiary,
  onNavigate,
  onOpenTeleconsult,
  onOpenWhatsAppSlip,
}) => {
  const { language } = useAppStore();
  const t = getTranslation(language);

  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('phc-belora');
  const [ambulanceSpeed, setAmbulanceSpeed] = useState(42);
  const [etaMins, setEtaMins] = useState(8);
  const [lastRefreshed, setLastRefreshed] = useState(20);
  const [activeCallModal, setActiveCallModal] = useState<string | null>(null);
  const [handoverDone, setHandoverDone] = useState(false);
  const [smsSent, setSmsSent] = useState(false);

  const displayName = language === 'mr' 
    ? (beneficiary.nameMarathi || beneficiary.name)
    : language === 'hi' 
    ? (beneficiary.nameHindi || beneficiary.name) 
    : beneficiary.name;

  // Live timer simulation for refresh and ETA
  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefreshed((prev) => (prev >= 60 ? 5 : prev + 5));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleConfirmArrival = () => {
    setHandoverDone(true);
    setEtaMins(0);
  };

  const handleSendSms = () => {
    setSmsSent(true);
    setTimeout(() => setSmsSent(false), 3500);
  };

  const steps = [
    {
      stepNumber: 1,
      title: t.step1Title,
      description: t.step1Desc,
      status: 'completed',
      time: '10:14 AM'
    },
    {
      stepNumber: 2,
      title: t.step2Title,
      description: t.step2Desc,
      status: 'completed',
      time: '10:18 AM'
    },
    {
      stepNumber: 3,
      title: t.step3Title,
      description: handoverDone ? t.arrivedAtGate : t.step3Desc,
      status: handoverDone ? 'completed' : 'active',
      time: handoverDone ? (language === 'mr' ? 'आत्ताच पोहोचले' : language === 'hi' ? 'अभी पहुंचे' : 'Just Arrived') : (language === 'mr' ? 'मार्गस्थ' : language === 'hi' ? 'रास्ते में' : 'En Route'),
      badge: handoverDone ? undefined : 'LIVE',
      hasAction: !handoverDone
    },
    {
      stepNumber: 4,
      title: t.step4Title,
      description: t.step4Desc,
      status: handoverDone ? 'active' : 'pending',
      badge: handoverDone ? 'ACTIVE' : undefined,
      time: handoverDone ? (language === 'mr' ? 'सुरू आहे' : language === 'hi' ? 'सक्रिय' : 'Ongoing') : undefined
    }
  ];

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4 pb-28">
      {/* Active Referral Transit Status Banner */}
      <section className="w-full bg-[#f1f3ff] border border-[#d2daef] rounded-2xl p-3.5 shadow-xs space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[#00434c] text-[20px]">
              local_shipping
            </span>
            <span className="text-xs font-bold text-[#00434c] tracking-wider uppercase">
              {language === 'mr' ? 'सक्रिय रुग्ण रेफरल' : language === 'hi' ? 'सक्रिय मरीज रेफरल' : 'Active Patient Referral'}
            </span>
            <span className="text-xs font-mono font-bold text-slate-600">#REF-2026-MH-8821</span>
          </div>
          <span className="bg-[#00434c] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
            LIVE
          </span>
        </div>
        <p className="text-xs text-[#00434c] font-medium">
          {t.ambulanceEnRoute} • {etaMins > 0 ? `${t.etaMinutes} ${etaMins} mins` : t.arrivedAtGate}
        </p>
      </section>

      {/* Title & Verified Badge */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-[#00434c] tracking-tight">{t.referralManagementTitle}</h1>
          <p className="text-xs text-[#3f484a] font-medium">{t.referralClosedLoopSubtitle}</p>
        </div>
        <span className="bg-[#e8eeff] text-[#00434c] text-xs font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1 border border-[#d2daef]">
          <span className="material-symbols-outlined text-[15px] text-emerald-700">verified</span>
          <span>MoHFW {t.verified}</span>
        </span>
      </div>

      {/* Patient Summary Card with Left Red Accent */}
      <section className="relative w-full bg-white rounded-2xl p-3.5 shadow-sm border border-[#e0e8fd] overflow-hidden">
        <div className="flex items-start space-x-3">
          <img
            src={beneficiary.photoUrl}
            alt={displayName}
            className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-[#141c2b] truncate">{displayName}</h2>
              <span className="text-xs text-slate-500 font-medium">({beneficiary.age}{language === 'mr' ? ' वर्षे' : language === 'hi' ? ' वर्ष' : 'y'} / F)</span>
              <span className="bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-bold px-2 py-0.2 rounded-full uppercase shrink-0">
                {language === 'mr' ? 'रेफरल केस' : language === 'hi' ? 'रेफरल केस' : 'Referral Case'}
              </span>
            </div>
            <p className="text-xs text-[#3f484a] mt-0.5">
              RCH ID: {beneficiary.rchId} • {t.gravida} {beneficiary.gravida}
            </p>
          </div>
        </div>

        {/* 3 Metric Columns */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-center">
          <div className="bg-[#f1f3ff] p-2 rounded-xl border border-[#e0e8fd]">
            <span className="text-[10px] font-bold text-slate-600 block uppercase">{t.bloodPressure}</span>
            <span className="text-sm font-black text-[#00434c] font-mono">168/104</span>
            <span className="text-[10px] text-slate-500 font-semibold block">mmHg</span>
          </div>

          <div className="bg-[#f1f3ff] p-2 rounded-xl border border-[#e0e8fd]">
            <span className="text-[10px] font-bold text-slate-600 block uppercase">{t.gestationalAge}</span>
            <span className="text-sm font-bold text-[#00434c]">34 Wks 3 D</span>
            <span className="text-[10px] text-slate-500 block">3rd Trimester</span>
          </div>

          <div className="bg-[#f1f3ff] p-2 rounded-xl border border-[#e0e8fd]">
            <span className="text-[10px] font-bold text-slate-600 block uppercase">PROTEINURIA</span>
            <span className="text-sm font-black text-[#00434c] font-mono">++ (Dipstick)</span>
            <span className="text-[10px] text-slate-500 font-semibold block">Albumin +</span>
          </div>
        </div>

        {/* Reason for Referral Box */}
        <div className="mt-3 bg-[#f1f3ff] rounded-xl p-2.5 border border-[#e0e8fd] flex items-start space-x-2">
          <span className="material-symbols-outlined text-[#00434c] text-[18px] shrink-0 mt-0.5">
            description
          </span>
          <div className="text-xs">
            <span className="font-bold text-[#00434c] block uppercase text-[10px]">
              {language === 'mr' ? 'रेफरलचे कारण' : language === 'hi' ? 'रेफरल का कारण' : 'REASON FOR REFERRAL'}
            </span>
            <p className="text-slate-700 font-medium leading-relaxed mt-0.5">
              {language === 'mr' 
                ? 'गर्भावस्थेतील तीव्र उच्च रक्तदाब व तीव्र डोकेदुखीसह आसन्न प्री-एक्लॅम्पसियाची शंका.'
                : language === 'hi'
                ? 'गर्भावस्था में उच्च रक्तचाप एवं गंभीर सिरदर्द के साथ संदिग्ध प्री-एक्लेम्पसिया।'
                : 'Hypertension in Pregnancy & suspected pre-eclampsia with severe headache.'}
            </p>
          </div>
        </div>
      </section>

      {/* Destination Facility Section */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-[#141c2b] uppercase tracking-wider">
            {t.targetFacilityLabel}
          </h3>
          <span className="text-xs font-semibold text-[#00434c] bg-[#e8eeff] px-2 py-0.5 rounded-full">
            {language === 'mr' ? '२ आरोग्य केंद्रे उपलब्ध' : language === 'hi' ? '2 स्वास्थ्य केंद्र उपलब्ध' : '2 Facilities in Reach'}
          </span>
        </div>

        {/* Facility 1: PHC Belora (Selected) */}
        <div
          onClick={() => setSelectedFacilityId('phc-belora')}
          className={`cursor-pointer rounded-2xl p-3.5 shadow-sm border transition-all ${
            selectedFacilityId === 'phc-belora'
              ? 'bg-white border-[#00434c] ring-2 ring-[#00434c]/20'
              : 'bg-white border-[#e0e8fd] opacity-80'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-[#00434c] text-[22px]">local_hospital</span>
              <div>
                <h4 className="text-sm font-bold text-[#141c2b]">PHC Belora ({language === 'mr' ? 'प्राथमिक आरोग्य केंद्र बेलोरा' : language === 'hi' ? 'प्राथमिक स्वास्थ्य केंद्र बेलोरा' : 'Primary Health Centre'})</h4>
                <p className="text-xs text-slate-500">4.2 km away • Approx 12 mins via 108</p>
              </div>
            </div>
            {selectedFacilityId === 'phc-belora' && (
              <span className="bg-[#00434c] text-white text-[9px] font-black px-2 py-0.5 rounded-full flex items-center space-x-0.5 uppercase tracking-wider">
                <span className="material-symbols-outlined text-[11px]">check</span>
                <span>{language === 'mr' ? 'निवडले' : language === 'hi' ? 'चयनित' : 'SELECTED'}</span>
              </span>
            )}
          </div>

          {/* Doctor on duty */}
          <div className="mt-2.5 bg-[#f1f3ff] rounded-xl p-2.5 flex items-center justify-between border border-[#e0e8fd]">
            <div className="flex items-center space-x-2.5">
              <img
                src={FACILITIES[0].doctorPhoto}
                alt={FACILITIES[0].doctorName}
                className="w-9 h-9 rounded-full object-cover border border-white"
              />
              <div>
                <div className="flex items-center space-x-1.5">
                  <h5 className="text-xs font-bold text-[#141c2b]">{FACILITIES[0].doctorName}</h5>
                  <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                    • ON DUTY
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">{FACILITIES[0].doctorRole}</p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenTeleconsult();
              }}
              className="p-1.5 bg-white text-[#00434c] rounded-lg hover:bg-slate-100 border border-slate-200"
              title="Call Doctor"
            >
              <span className="material-symbols-outlined text-[16px]">call</span>
            </button>
          </div>

          {/* Service Chips */}
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pt-2.5">
            <span className="text-[10px] font-semibold bg-[#e8eeff] text-[#00434c] px-2 py-1 rounded-md whitespace-nowrap">
              ❄ Emergency Stabilization
            </span>
            <span className="text-[10px] font-semibold bg-[#e8eeff] text-[#00434c] px-2 py-1 rounded-md whitespace-nowrap">
              🛏 Maternity Ward (12 Beds)
            </span>
            <span className="text-[10px] font-semibold bg-[#e8eeff] text-[#00434c] px-2 py-1 rounded-md whitespace-nowrap">
              🔬 24x7 Lab
            </span>
          </div>
        </div>

        {/* Facility 2: District Civil Hospital Wardha */}
        <div
          onClick={() => setSelectedFacilityId('dh-wardha')}
          className={`cursor-pointer rounded-2xl p-3.5 shadow-sm border transition-all ${
            selectedFacilityId === 'dh-wardha'
              ? 'bg-white border-[#00434c] ring-2 ring-[#00434c]/20'
              : 'bg-white border-[#e0e8fd]'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-slate-600 text-[22px]">domain</span>
              <div>
                <h4 className="text-sm font-bold text-[#141c2b]">{language === 'mr' ? 'जिल्हा सामान्य रुग्णालय, वर्धा' : language === 'hi' ? 'जिला सामान्य अस्पताल, वर्धा' : 'District Civil Hospital, Wardha'}</h4>
                <p className="text-xs text-slate-500">28 km away • Approx 48 mins (Secondary Hub)</p>
              </div>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              selectedFacilityId === 'dh-wardha' ? 'border-[#00434c] bg-[#00434c]' : 'border-slate-300'
            }`}>
              {selectedFacilityId === 'dh-wardha' && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2 text-[11px] text-slate-600">
            <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md font-semibold">
              🩸 24x7 Blood Bank
            </span>
            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
              🏥 ICU &amp; C-Section OT
            </span>
          </div>
        </div>
      </section>

      {/* Closed-Loop Tracker */}
      <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#e0e8fd] space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[#00434c] text-[20px]">sync_alt</span>
            <div>
              <h3 className="text-sm font-bold text-[#141c2b]">Closed-Loop Tracker</h3>
              <p className="text-[10px] text-slate-500">{t.referralClosedLoopSubtitle}</p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            • {handoverDone ? (language === 'mr' ? 'आगमन पूर्ण' : language === 'hi' ? 'हैंडओवर पूर्ण' : 'Handed Over') : (language === 'mr' ? 'मार्गस्थ' : language === 'hi' ? 'मार्गस्थ' : 'In Transit')}
          </span>
        </div>

        {/* Vertical Pipeline Steps */}
        <div className="relative pl-6 border-l-2 border-slate-200 space-y-4 pt-1">
          {steps.map((step) => {
            const isCompleted = step.status === 'completed';
            const isActive = step.status === 'active';

            return (
              <div key={step.stepNumber} className="relative">
                {/* Node icon */}
                <span
                  className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center shadow-xs border-2 border-white ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isActive
                      ? 'bg-[#00434c] text-white animate-pulse'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <span className="material-symbols-outlined text-[15px]">check</span>
                  ) : isActive ? (
                    <span className="material-symbols-outlined text-[15px]">local_shipping</span>
                  ) : (
                    <span className="text-[10px] font-bold">{step.stepNumber}</span>
                  )}
                </span>

                <div className="flex items-center justify-between">
                  <h4 className={`text-xs font-bold ${isActive ? 'text-[#00434c]' : 'text-[#141c2b]'}`}>
                    {step.title}
                  </h4>
                  <div className="flex items-center space-x-1">
                    {step.badge && (
                      <span className="bg-[#00434c] text-white text-[9px] font-black px-1.5 py-0.2 rounded">
                        {step.badge}
                      </span>
                    )}
                    {step.time && (
                      <span className="text-[11px] font-bold text-slate-500">{step.time}</span>
                    )}
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                  {step.description}
                </p>

                {/* Step Action Buttons */}
                {step.hasAction && (
                  <div className="flex items-center space-x-2 pt-2">
                    <button
                      onClick={handleConfirmArrival}
                      className="px-3 py-1.5 bg-[#00434c] hover:bg-[#0a5c67] text-white text-xs font-bold rounded-lg flex items-center space-x-1 shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[14px]">where_to_vote</span>
                      <span>{t.confirmArrivalBtn}</span>
                    </button>
                    <button
                      onClick={() => setActiveCallModal('Driver: Eknath Kale (+91 94218 76543)')}
                      className="px-3 py-1.5 bg-[#f1f3ff] hover:bg-[#e0e8fd] text-[#00434c] text-xs font-bold rounded-lg flex items-center space-x-1 border border-slate-200"
                    >
                      <span className="material-symbols-outlined text-[14px]">call</span>
                      <span>{language === 'mr' ? 'चालकाला कॉल करा' : language === 'hi' ? 'चालक को कॉल करें' : 'Call Driver'}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Live Transit Corridor Interactive Map Visual */}
      <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#e0e8fd] space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="material-symbols-outlined text-[#00434c] text-[18px]">near_me</span>
            <h3 className="text-xs font-bold text-[#141c2b]">{language === 'mr' ? 'रुग्णवाहिका थेट मार्ग' : language === 'hi' ? 'एम्बुलेंस लाइव रूट' : 'Live Ambulance Route'}</h3>
          </div>
          <span className="text-[10px] text-slate-400">Auto-refreshed {lastRefreshed}s ago</span>
        </div>

        {/* Stylized Simulated Route Graphic */}
        <div className="relative w-full h-44 rounded-xl overflow-hidden bg-[#e6f4ea] border border-emerald-200 shadow-inner">
          {/* Background Map Graphic Roads and Nodes */}
          <svg className="w-full h-full" viewBox="0 0 400 180">
            {/* Terrain blocks */}
            <rect width="400" height="180" fill="#eef7ee" />
            <path d="M0,0 Q120,40 180,0 L400,0 L400,60 Q320,80 240,40 Z" fill="#e1f0e1" />
            <path d="M0,130 Q100,100 200,150 L400,180 L0,180 Z" fill="#e8f4e8" />

            {/* Secondary roads */}
            <line x1="40" y1="20" x2="160" y2="90" stroke="#ffffff" strokeWidth="4" />
            <line x1="160" y1="90" x2="300" y2="40" stroke="#ffffff" strokeWidth="4" />
            <line x1="200" y1="170" x2="280" y2="100" stroke="#ffffff" strokeWidth="4" />
            <line x1="300" y1="40" x2="380" y2="90" stroke="#ffffff" strokeWidth="4" />

            {/* Main Highway NH-361 (Yellow with dark border) */}
            <path
              d="M 20 140 Q 120 120 190 90 T 360 40"
              stroke="#fbbf24"
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 20 140 Q 120 120 190 90 T 360 40"
              stroke="#d97706"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              fill="none"
            />

            {/* Village labels */}
            <text x="35" y="130" fontSize="10" fontWeight="bold" fill="#374151">Khairi (खैरी)</text>
            <circle cx="30" cy="138" r="4" fill="#00434c" />

            <text x="130" y="80" fontSize="9" fill="#4b5563">Karajgaon</text>
            <circle cx="140" cy="95" r="3" fill="#6b7280" />

            <text x="215" y="70" fontSize="10" fontWeight="bold" fill="#00434c">PHC Belora (बेलोरा)</text>
            <circle cx="250" cy="74" r="6" fill="#ba1a1a" />
            <circle cx="250" cy="74" r="2.5" fill="#ffffff" />

            <text x="310" y="30" fontSize="9" fill="#4b5563">Wardha (वर्धा)</text>

            {/* Highway marker badge */}
            <rect x="180" y="105" width="48" height="14" rx="3" fill="#047857" />
            <text x="185" y="115" fontSize="8" fontWeight="bold" fill="#ffffff">NH-361</text>

            {/* Moving Ambulance dot */}
            <g transform={handoverDone ? 'translate(250, 74)' : 'translate(195, 88)'}>
              <circle cx="0" cy="0" r="10" fill="#ba1a1a" className="animate-ping" opacity="0.4" />
              <circle cx="0" cy="0" r="8" fill="#ba1a1a" />
              <rect x="-4" y="-2" width="8" height="4" fill="#ffffff" rx="1" />
              <rect x="-2" y="-4" width="4" height="8" fill="#ffffff" rx="1" />
            </g>
          </svg>

          {/* Floating Speed & Gate Badge */}
          <div className="absolute bottom-2 left-2 right-2 bg-[#002f35]/90 backdrop-blur-xs text-white rounded-lg px-3 py-1.5 flex items-center justify-between text-xs font-bold shadow-md">
            <div className="flex items-center space-x-1.5">
              <span className="material-symbols-outlined text-amber-400 text-[18px]">ambulance</span>
              <span>108 Ambulance NH-361 • {handoverDone ? '0' : ambulanceSpeed} km/h</span>
            </div>
            <span className="bg-[#12b388] text-[#002114] px-2 py-0.5 rounded text-[11px] font-black">
              {handoverDone ? t.arrivedAtGate : `${etaMins} mins to gate`}
            </span>
          </div>
        </div>
      </section>

      {/* Action Buttons: Confirm Handover, Send SMS, WhatsApp */}
      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={handleConfirmArrival}
          className="w-full h-12 bg-[#00434c] hover:bg-[#0a5c67] text-white text-sm font-bold rounded-xl flex items-center justify-center space-x-2 shadow-md transition-all active:scale-98"
        >
          <span className="material-symbols-outlined text-[20px]">task_alt</span>
          <span>{handoverDone ? `${t.confirmArrivalBtn} ✓` : t.confirmArrivalBtn}</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          {/* Send Slip SMS */}
          <button
            type="button"
            onClick={handleSendSms}
            className="py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px] text-[#00434c]">sms</span>
            <span>{smsSent ? 'SMS Sent ✓' : (language === 'mr' ? 'एसएमएस स्लिप पाठवा' : language === 'hi' ? 'एसएमएस स्लिप भेजें' : 'Send Slip (SMS)')}</span>
          </button>

          {/* WhatsApp Slip */}
          <button
            type="button"
            onClick={onOpenWhatsAppSlip}
            className="py-2.5 px-3 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px] text-emerald-600">share</span>
            <span>{t.shareWhatsAppBtn}</span>
          </button>
        </div>
      </div>

      {/* Security Compliance Footnote */}
      <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-500 pt-1">
        <span className="material-symbols-outlined text-[14px]">lock</span>
        <span>{language === 'mr' ? 'आरोग्य विभाग मार्गदर्शक तत्त्वांनुसार सुरक्षित' : language === 'hi' ? 'स्वास्थ्य विभाग दिशानिर्देश अनुसार सुरक्षित' : 'Protected under Health Department guidelines'}</span>
      </div>

      {/* Driver Call Modal */}
      {activeCallModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#00434c]">{language === 'mr' ? '१०८ रुग्णवाहिका चालकाला कॉल करत आहे...' : language === 'hi' ? '108 चालक को कॉल किया जा रहा है...' : 'Calling 108 Driver...'}</h3>
              <button onClick={() => setActiveCallModal(null)} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs">✕</button>
            </div>
            <div className="text-center py-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2 animate-bounce">
                <span className="material-symbols-outlined text-[28px]">phone_in_talk</span>
              </div>
              <p className="font-bold text-sm text-slate-800">{activeCallModal}</p>
              <p className="text-xs text-slate-500 mt-1">Vehicle: MH-31-AZ-4412 (Wardha Fleet)</p>
            </div>
            <button
              onClick={() => setActiveCallModal(null)}
              className="w-full py-2 bg-red-600 text-white font-bold rounded-xl text-xs"
            >
              {language === 'mr' ? 'कॉल समाप्त करा' : language === 'hi' ? 'कॉल समाप्त करें' : 'End Call'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
