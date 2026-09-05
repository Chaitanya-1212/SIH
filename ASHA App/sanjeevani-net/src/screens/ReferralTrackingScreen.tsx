import React, { useState, useEffect } from 'react';
import { Beneficiary, Facility, AppScreen } from '../types';
import { FACILITIES, INITIAL_TIMELINE_STEPS } from '../data/mockData';

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
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('phc-belora');
  const [timelineSteps, setTimelineSteps] = useState(INITIAL_TIMELINE_STEPS);
  const [ambulanceSpeed, setAmbulanceSpeed] = useState(42);
  const [etaMins, setEtaMins] = useState(8);
  const [lastRefreshed, setLastRefreshed] = useState(20);
  const [activeCallModal, setActiveCallModal] = useState<string | null>(null);
  const [handoverDone, setHandoverDone] = useState(false);
  const [smsSent, setSmsSent] = useState(false);

  // Live timer simulation for refresh and ETA
  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefreshed((prev) => (prev >= 60 ? 5 : prev + 5));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleConfirmArrival = () => {
    setTimelineSteps((prev) =>
      prev.map((step) => {
        if (step.stepNumber === 3) {
          return {
            ...step,
            status: 'completed',
            badge: undefined,
            actions: undefined,
            time: 'Just Arrived',
            description: 'Patient successfully arrived at PHC Belora Emergency Gate via 108 Ambulance.'
          };
        }
        if (step.stepNumber === 4) {
          return {
            ...step,
            status: 'active',
            badge: 'ACTIVE',
            time: 'Ongoing'
          };
        }
        return step;
      })
    );
    setHandoverDone(true);
    setEtaMins(0);
  };

  const handleSendSms = () => {
    setSmsSent(true);
    setTimeout(() => setSmsSent(false), 3500);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4 pb-28">
      {/* Critical Referral Alert Banner */}
      <section className="w-full bg-[#ffdad6] border border-[#ba1a1a]/30 rounded-2xl p-3.5 shadow-xs space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[#ba1a1a] text-[20px] animate-bounce">
              emergency_home
            </span>
            <span className="text-xs font-black text-[#ba1a1a] tracking-wider uppercase">
              CRITICAL REFERRAL
            </span>
            <span className="text-xs font-mono font-bold text-[#ba1a1a]">#REF-2026-MH-8821</span>
          </div>
          <span className="bg-[#ba1a1a] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">
            LIVE
          </span>
        </div>
        <p className="text-xs text-[#93000a] font-bold">
          108 Ambulance Dispatch Initiated • ETA {etaMins > 0 ? `${etaMins} mins` : 'Arrived at Gate'}
        </p>
      </section>

      {/* Title & Verified Badge */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-[#00434c] tracking-tight">Create &amp; Track Referral</h1>
          <p className="text-xs text-[#3f484a] font-medium">रेफरल प्रबंधन एवं स्थिति ट्रैकिंग (Closed Loop)</p>
        </div>
        <span className="bg-[#e8eeff] text-[#00434c] text-xs font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1 border border-[#d2daef]">
          <span className="material-symbols-outlined text-[15px] text-emerald-700">verified</span>
          <span>MoHFW Verified</span>
        </span>
      </div>

      {/* Patient Summary Card with Left Red Accent */}
      <section className="relative w-full bg-white rounded-2xl p-3.5 shadow-sm border border-[#e0e8fd] overflow-hidden pl-4">
        {/* Left red border bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#ba1a1a]" />

        <div className="flex items-start space-x-3">
          <img
            src={beneficiary.photoUrl}
            alt={beneficiary.name}
            className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-[#141c2b] truncate">{beneficiary.name}</h2>
              <span className="text-xs text-slate-500 font-medium">({beneficiary.age}y / F)</span>
              <span className="bg-[#ffdad6] text-[#93000a] text-[10px] font-black px-2 py-0.2 rounded-full uppercase shrink-0">
                HIGH RISK
              </span>
            </div>
            <p className="text-xs text-[#3f484a] mt-0.5">
              RCH ID: {beneficiary.rchId} • Gravida {beneficiary.gravida}
            </p>
          </div>
        </div>

        {/* 3 Metric Columns */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-center">
          <div className="bg-[#fff0ef] p-2 rounded-xl border border-red-100">
            <span className="text-[10px] font-bold text-red-700 block uppercase">BLOOD PRESSURE</span>
            <span className="text-sm font-black text-red-600 font-mono">168/104</span>
            <span className="text-[10px] text-red-600 font-semibold block">mmHg</span>
          </div>

          <div className="bg-[#f1f3ff] p-2 rounded-xl border border-[#e0e8fd]">
            <span className="text-[10px] font-bold text-slate-600 block uppercase">GEST. AGE</span>
            <span className="text-sm font-bold text-[#00434c]">34 Wks 3 D</span>
            <span className="text-[10px] text-slate-500 block">3rd Trimester</span>
          </div>

          <div className="bg-[#fff0ef] p-2 rounded-xl border border-red-100">
            <span className="text-[10px] font-bold text-red-700 block uppercase">PROTEINURIA</span>
            <span className="text-sm font-black text-red-600 font-mono">++ (Dipstick)</span>
            <span className="text-[10px] text-red-600 font-semibold block">Albumin Positive</span>
          </div>
        </div>

        {/* Reason for Referral Box */}
        <div className="mt-3 bg-[#f1f3ff] rounded-xl p-2.5 border border-[#e0e8fd] flex items-start space-x-2">
          <span className="material-symbols-outlined text-[#00434c] text-[18px] shrink-0 mt-0.5">
            description
          </span>
          <div className="text-xs">
            <span className="font-bold text-[#00434c] block uppercase text-[10px]">
              REASON FOR REFERRAL (रेफरल का कारण)
            </span>
            <p className="text-slate-700 font-medium leading-relaxed mt-0.5">
              Hypertension in Pregnancy &amp; suspected pre-eclampsia with severe headache.
            </p>
          </div>
        </div>
      </section>

      {/* Destination Facility Section */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-[#141c2b] uppercase tracking-wider">
            DESTINATION FACILITY (स्वास्थ्य केंद्र चयन)
          </h3>
          <span className="text-xs font-semibold text-[#00434c] bg-[#e8eeff] px-2 py-0.5 rounded-full">
            2 Facilities in Reach
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
                <h4 className="text-sm font-bold text-[#141c2b]">PHC Belora (प्राथमिक आरोग्य केंद्र)</h4>
                <p className="text-xs text-slate-500">4.2 km away • Approx 12 mins via 108 / Auto</p>
              </div>
            </div>
            {selectedFacilityId === 'phc-belora' && (
              <span className="bg-[#00434c] text-white text-[9px] font-black px-2 py-0.5 rounded-full flex items-center space-x-0.5 uppercase tracking-wider">
                <span className="material-symbols-outlined text-[11px]">check</span>
                <span>SELECTED</span>
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
              🔬 24x7 Lab Diagnostics
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
                <h4 className="text-sm font-bold text-[#141c2b]">District Civil Hospital, Wardha</h4>
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
              <p className="text-[10px] text-slate-500">द्वि-मार्गी रेफरल प्रगति पाइपलाइन</p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            • 3 / 5 Active • {handoverDone ? 'Handed Over' : 'In Transit'}
          </span>
        </div>

        {/* Vertical Pipeline Steps */}
        <div className="relative pl-6 border-l-2 border-slate-200 space-y-4 pt-1">
          {timelineSteps.map((step) => {
            const isCompleted = step.status === 'completed';
            const isActive = step.status === 'active';
            const isPending = step.status === 'pending';

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

                {/* Step 3 Action Buttons */}
                {step.actions && step.actions.length > 0 && (
                  <div className="flex items-center space-x-2 pt-2">
                    <button
                      onClick={handleConfirmArrival}
                      className="px-3 py-1.5 bg-[#00434c] hover:bg-[#0a5c67] text-white text-xs font-bold rounded-lg flex items-center space-x-1 shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[14px]">where_to_vote</span>
                      <span>Confirm Arrival at PHC</span>
                    </button>
                    <button
                      onClick={() => setActiveCallModal('Driver: Eknath Kale (+91 94218 76543)')}
                      className="px-3 py-1.5 bg-[#f1f3ff] hover:bg-[#e0e8fd] text-[#00434c] text-xs font-bold rounded-lg flex items-center space-x-1 border border-slate-200"
                    >
                      <span className="material-symbols-outlined text-[14px]">call</span>
                      <span>Call Driver</span>
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
            <h3 className="text-xs font-bold text-[#141c2b]">Live Transit Corridor (मार्ग स्थिति)</h3>
          </div>
          <span className="text-[10px] text-slate-400">Auto-refreshed {lastRefreshed}s ago</span>
        </div>

        {/* Stylized Simulated Route Graphic matching Image 11 */}
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
              <span>Ambulance on NH-361 • Speed {handoverDone ? '0' : ambulanceSpeed} km/h</span>
            </div>
            <span className="bg-[#12b388] text-[#002114] px-2 py-0.5 rounded text-[11px] font-black">
              {handoverDone ? 'At Gate' : `${etaMins} mins to gate`}
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
          <span>{handoverDone ? 'Handover Confirmed ✓' : 'Confirm Patient Handover / Update Status'}</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          {/* Send Slip SMS */}
          <button
            type="button"
            onClick={handleSendSms}
            className="py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px] text-[#00434c]">sms</span>
            <span>{smsSent ? 'SMS Sent ✓' : 'Send Slip (SMS)'}</span>
          </button>

          {/* WhatsApp Slip */}
          <button
            type="button"
            onClick={onOpenWhatsAppSlip}
            className="py-2.5 px-3 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px] text-emerald-600">share</span>
            <span>WhatsApp Slip</span>
          </button>
        </div>
      </div>

      {/* Security Compliance Footnote */}
      <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-500 pt-1">
        <span className="material-symbols-outlined text-[14px]">lock</span>
        <span>Protected under Ayushman Bharat Digital Mission (ABDM) guidelines</span>
      </div>

      {/* Driver Call Modal */}
      {activeCallModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#00434c]">Calling 108 Driver...</h3>
              <button onClick={() => setActiveCallModal(null)} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs">✕</button>
            </div>
            <div className="text-center py-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2 animate-bounce">
                <span className="material-symbols-outlined text-[28px]">phone_in_talk</span>
              </div>
              <p className="font-bold text-sm text-slate-800">{activeCallModal}</p>
              <p className="text-xs text-slate-500 mt-1">Vehicle: MH-31-AZ-4412 (Wardha District Fleet)</p>
            </div>
            <button
              onClick={() => setActiveCallModal(null)}
              className="w-full py-2 bg-red-600 text-white font-bold rounded-xl text-xs"
            >
              End Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
