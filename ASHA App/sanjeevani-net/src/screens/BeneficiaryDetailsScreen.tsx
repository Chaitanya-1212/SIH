import React, { useState } from 'react';
import { Beneficiary, AppScreen } from '../types';

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
  const [showProtocolModal, setShowProtocolModal] = useState(false);
  const [callingPhone, setCallingPhone] = useState<string | null>(null);

  const handleCall = (phone: string, name: string) => {
    setCallingPhone(`${name} (${phone})`);
    setTimeout(() => {
      setCallingPhone(null);
    }, 3000);
  };

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
              <h2 className="text-lg font-bold text-[#141c2b] tracking-tight">{beneficiary.name}</h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e0f2f1] text-[#00462f] border border-[#80cbc4]/40">
                <span className="material-symbols-outlined text-[12px] mr-0.5 text-emerald-700">verified</span>
                ABHA Verified
              </span>
            </div>
            <p className="text-xs text-[#3f484a] font-medium mt-0.5">
              {beneficiary.age} yrs • {beneficiary.gender} • {beneficiary.village}
            </p>
            <p className="text-xs text-[#00434c] font-semibold mt-1 flex items-center space-x-1">
              <span className="material-symbols-outlined text-[14px]">badge</span>
              <span>ABHA ID: <strong className="font-mono">{beneficiary.abhaId}</strong></span>
            </p>
          </div>
        </div>

        {/* Husband Contact Bar */}
        <div className="w-full bg-[#f1f3ff] rounded-xl p-2.5 flex items-center justify-between border border-[#e0e8fd]">
          <div className="flex items-center space-x-2 text-xs font-medium text-[#141c2b] truncate pr-1">
            <span className="material-symbols-outlined text-[18px] text-red-500">contact_phone</span>
            <span className="truncate">{beneficiary.husbandName} (Husband)</span>
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
            <span className="text-xs font-semibold">कॉल की जा रही है: {callingPhone}</span>
          </div>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">SIM 1</span>
        </div>
      )}

      {/* High-Risk Warning Alert Banner */}
      <section className="w-full bg-[#ffdad6] border border-[#ba1a1a]/30 rounded-xl p-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-2.5 min-w-0 pr-2">
          <div className="w-8 h-8 rounded-full bg-[#ba1a1a] text-white flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">warning</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              <span className="text-xs font-black text-[#93000a] tracking-tight uppercase">
                HIGH RISK (उच्च जोखिम)
              </span>
            </div>
            <p className="text-xs font-bold text-[#93000a] truncate">
              Gestational Hypertens...
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowProtocolModal(true)}
          className="shrink-0 px-3 py-1.5 bg-[#ba1a1a] hover:bg-[#93000a] text-white text-xs font-bold rounded-lg shadow-sm transition-all whitespace-nowrap"
        >
          View Protocol
        </button>
      </section>

      {/* 3 Primary Action Buttons */}
      <section className="grid grid-cols-3 gap-2.5">
        {/* Refer Case */}
        <button
          onClick={() => onNavigate('referral')}
          className="bg-[#ba1a1a] hover:bg-[#93000a] text-white py-3 px-2 rounded-xl flex flex-col items-center justify-center shadow-sm transition-transform active:scale-95"
        >
          <span className="material-symbols-outlined text-[24px]">crisis_alert</span>
          <span className="text-xs font-bold mt-1">Refer Case</span>
          <span className="text-[10px] opacity-80">रेफरल भेजें</span>
        </button>

        {/* Teleconsult */}
        <button
          onClick={onOpenTeleconsult}
          className="bg-[#00434c] hover:bg-[#0a5c67] text-white py-3 px-2 rounded-xl flex flex-col items-center justify-center shadow-sm transition-transform active:scale-95"
        >
          <span className="material-symbols-outlined text-[24px]">headset_mic</span>
          <span className="text-xs font-bold mt-1">Teleconsult</span>
          <span className="text-[10px] opacity-80">टेली-परामर्श</span>
        </button>

        {/* Follow-up / Record Vitals */}
        <button
          onClick={() => onNavigate('vitals')}
          className="bg-[#3a6472] hover:bg-[#204c5a] text-white py-3 px-2 rounded-xl flex flex-col items-center justify-center shadow-sm transition-transform active:scale-95"
        >
          <span className="material-symbols-outlined text-[24px]">assignment</span>
          <span className="text-xs font-bold mt-1">Follow-up</span>
          <span className="text-[10px] opacity-80">फॉलो-अप</span>
        </button>
      </section>

      {/* Latest Vitals Section */}
      <section className="w-full bg-white rounded-2xl p-4 shadow-sm border border-[#e0e8fd] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[#00434c] text-[20px]">monitor_heart</span>
            <h3 className="text-sm font-bold text-[#141c2b]">Latest Vitals</h3>
          </div>
          <span className="text-xs text-[#3a6472] bg-[#f1f3ff] px-2 py-0.5 rounded-full font-medium flex items-center space-x-1">
            <span className="material-symbols-outlined text-[13px]">schedule</span>
            <span>2 hrs ago</span>
          </span>
        </div>

        {/* Vitals Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Blood Pressure */}
          <div className="bg-[#fff0ef] border border-red-200 rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-red-700 tracking-wider">BLOOD PRESSURE</span>
              <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                HIGH
              </span>
            </div>
            <div className="my-1">
              <span className="text-2xl font-black text-red-600 font-mono tracking-tight">155/100</span>
              <span className="text-xs font-bold text-red-700 ml-1">mmHg</span>
            </div>
            <p className="text-[10px] text-red-700 font-semibold leading-tight">
              Critical elevation (Diastolic ≥ 100)
            </p>
          </div>

          {/* SpO2 */}
          <div className="bg-[#f1f3ff] border border-[#e0e8fd] rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#00434c] tracking-wider">SPO₂ LEVEL</span>
              <span className="material-symbols-outlined text-[#00434c] text-[16px]">air</span>
            </div>
            <div className="my-1">
              <span className="text-2xl font-black text-[#00434c] font-mono tracking-tight">97</span>
              <span className="text-xs font-bold text-slate-600 ml-1">%</span>
            </div>
            <p className="text-[10px] text-emerald-700 font-semibold leading-tight">
              Stable Room Air
            </p>
          </div>

          {/* Pulse Rate */}
          <div className="bg-[#f1f3ff] border border-[#e0e8fd] rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#00434c] tracking-wider">PULSE RATE</span>
              <span className="material-symbols-outlined text-[#00434c] text-[16px]">favorite</span>
            </div>
            <div className="my-1">
              <span className="text-2xl font-black text-[#00434c] font-mono tracking-tight">88</span>
              <span className="text-xs font-bold text-slate-600 ml-1">BPM</span>
            </div>
            <p className="text-[10px] text-slate-600 font-semibold leading-tight">
              Rhythmic &amp; Normal
            </p>
          </div>

          {/* Temperature */}
          <div className="bg-[#f1f3ff] border border-[#e0e8fd] rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#00434c] tracking-wider">TEMPERATURE</span>
              <span className="material-symbols-outlined text-[#00434c] text-[16px]">device_thermostat</span>
            </div>
            <div className="my-1">
              <span className="text-2xl font-black text-[#00434c] font-mono tracking-tight">99.2</span>
              <span className="text-xs font-bold text-slate-600 ml-1">°F</span>
            </div>
            <p className="text-[10px] text-amber-700 font-semibold leading-tight">
              Low-grade warmth
            </p>
          </div>
        </div>

        {/* Body Weight Full Width */}
        <div className="bg-[#e8eeff] border border-[#d2daef] rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[#00434c] text-[20px]">scale</span>
            <div>
              <span className="text-xs font-bold text-[#00434c]">Current Body Weight</span>
              <p className="text-[10px] text-slate-600">+1.8kg this month</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xl font-black text-[#00434c] font-mono">58.5</span>
            <span className="text-xs font-bold text-slate-600 ml-1">kg</span>
          </div>
        </div>
      </section>

      {/* Care Plan & Rx */}
      <section className="w-full bg-white rounded-2xl p-4 shadow-sm border border-[#e0e8fd] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[#00434c] text-[20px]">medication</span>
            <h3 className="text-sm font-bold text-[#141c2b]">Care Plan &amp; Rx</h3>
          </div>
          <span className="text-[11px] font-bold bg-[#85f8c4] text-[#002114] px-2 py-0.5 rounded-md flex items-center space-x-1">
            <span className="material-symbols-outlined text-[13px]">calendar_today</span>
            <span>08 Sep Next</span>
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
            Oral anti-hypertensive • Morning &amp; Night post-meals
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
            1 tablet daily post afternoon lunch with lemon water
          </p>
        </div>

        {/* Care Directives Notice Box */}
        <div className="bg-[#fff3e0] border border-amber-200 rounded-xl p-3 flex items-start space-x-2.5">
          <span className="material-symbols-outlined text-amber-700 text-[18px] shrink-0 mt-0.5">
            chat
          </span>
          <div className="text-[11px] text-amber-950 space-y-0.5">
            <strong className="font-bold block text-amber-900">Care Directives</strong>
            <p>
              Strict dietary salt restriction. Family instructed on 108 ambulance speed-dial in case of dizziness or visual blurred spots.
            </p>
          </div>
        </div>
      </section>

      {/* Care History Timeline */}
      <section className="w-full bg-white rounded-2xl p-4 shadow-sm border border-[#e0e8fd] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[#00434c] text-[20px]">history_edu</span>
            <h3 className="text-sm font-bold text-[#141c2b]">Care History Timeline</h3>
          </div>
          <span className="text-xs font-bold text-slate-500">4 Events</span>
        </div>

        <div className="relative pl-5 border-l-2 border-slate-200 space-y-4 pt-1">
          {/* Event 1 */}
          <div className="relative">
            <span className="absolute -left-[27px] top-0.5 w-4 h-4 rounded-full bg-red-600 border-2 border-white shadow-xs" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-600">Today, 10:15 AM</span>
              <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.2 rounded-full">
                Urgent
              </span>
            </div>
            <h5 className="text-xs font-bold text-[#141c2b] mt-0.5">High-Risk Triage Flagged</h5>
            <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
              ASHA Sunita Deshmukh flagged elevated systolic BP (155 mmHg) during home visit.
            </p>
          </div>

          {/* Event 2 */}
          <div className="relative">
            <span className="absolute -left-[27px] top-0.5 w-4 h-4 rounded-full bg-[#0a5c67] border-2 border-white shadow-xs" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#00434c]">05 Sep 2026</span>
              <span className="bg-cyan-100 text-[#00434c] text-[10px] font-bold px-2 py-0.2 rounded-full">
                Checkup 2
              </span>
            </div>
            <h5 className="text-xs font-bold text-[#141c2b] mt-0.5">Antenatal Care Visit 2</h5>
            <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
              BP recorded at 142/92 mmHg. PHC Medical Officer initiated Tab Labetalol 100mg.
            </p>
          </div>

          {/* Event 3 */}
          <div className="relative">
            <span className="absolute -left-[27px] top-0.5 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white shadow-xs" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800">20 Aug 2026</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.2 rounded-full">
                Routine
              </span>
            </div>
            <h5 className="text-xs font-bold text-[#141c2b] mt-0.5">ANC 1 &amp; TT-1 Immunization</h5>
            <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
              First Tetanus Toxoid dosage administered. Blood tests standard, vitals within limits.
            </p>
          </div>

          {/* Event 4 */}
          <div className="relative">
            <span className="absolute -left-[27px] top-0.5 w-4 h-4 rounded-full bg-slate-400 border-2 border-white shadow-xs" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">12 Jul 2026</span>
              <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.2 rounded-full">
                RCH Registry
              </span>
            </div>
            <h5 className="text-xs font-bold text-[#141c2b] mt-0.5">Beneficiary Registered</h5>
            <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
              RCH Portal enrollment linked with ABHA ID. LMP recorded as 02 March 2026.
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
                <h3 className="font-bold text-base text-red-700">ICMR Pre-Eclampsia Protocol</h3>
              </div>
              <button
                onClick={() => setShowProtocolModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>
            <div className="text-xs text-slate-700 space-y-2 leading-relaxed bg-red-50 p-3 rounded-xl border border-red-200">
              <p><strong>1. त्वरित रेफरल:</strong> BP &gt; 140/90 और सिरदर्द होने पर तुरंत नजदीकी PHC/DH रेफर करें।</p>
              <p><strong>2. मैग्नीशियम सल्फेट:</strong> केवल डॉक्टर/MO की निगरानी में IV लोडिंग डोज दें।</p>
              <p><strong>3. 108 एम्बुलेंस:</strong> एम्बुलेंस को कॉल कर मरीज को बायीं करवट लिटाकर ले जाएं।</p>
            </div>
            <button
              onClick={() => {
                setShowProtocolModal(false);
                onNavigate('referral');
              }}
              className="w-full py-2.5 bg-[#ba1a1a] text-white font-bold rounded-xl text-sm shadow-md"
            >
              आगे रेफरल ट्रैक करें (Go to Referral)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
