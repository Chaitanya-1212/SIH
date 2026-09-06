import React, { useState } from 'react';
import { Beneficiary } from '../types';
import { useAppStore } from '../store/useAppStore';
import { getTranslation } from '../i18n/translations';
import { NewBeneficiaryModal } from '../components/NewBeneficiaryModal';

interface HomeScreenProps {
  onNavigate: (screen: 'beneficiary' | 'vitals' | 'assessment' | 'referral' | 'patients') => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const {
    language,
    allBeneficiaries,
    setBeneficiary,
    setShowTeleconsultModal,
    jwtSession,
    netInfo,
  } = useAppStore();

  const t = getTranslation(language);
  const [showRegModal, setShowRegModal] = useState(false);
  const [scheduleTasks, setScheduleTasks] = useState([
    {
      id: 'task-1',
      time: '09:30 AM',
      title: language === 'mr' ? 'गृहभेट: सुनिता पाटील (रक्तदाब व सूज तपासणी)' : 'Home Visit: Sunita Patil (BP & Edema check)',
      category: language === 'mr' ? 'नियमित ANC भेट' : 'ANC Home Visit',
      completed: false,
      beneficiaryId: 'BEN-2026-0941',
    },
    {
      id: 'task-2',
      time: '11:00 AM',
      title: language === 'mr' ? 'IFA गोळ्या व कॅल्शियम वाटप (अंगणवाडी क्र. ३)' : 'IFA & Calcium Tablet Distribution (Anganwadi #3)',
      category: language === 'mr' ? 'पोषण मोहीम' : 'Nutrition Drive',
      completed: true,
    },
    {
      id: 'task-3',
      time: '02:00 PM',
      title: language === 'mr' ? 'उपकेंद्र २री तिमाही ANC क्लिनिक (डॉ. अनिता शर्मा)' : 'Sub-Center 2nd Trimester ANC Clinic (Dr. Anita Sharma)',
      category: language === 'mr' ? 'उपकेंद्र तपासणी' : 'ANC Clinic',
      completed: false,
    },
    {
      id: 'task-4',
      time: '04:30 PM',
      title: language === 'mr' ? 'प्रसूतीनंतरची गृहभेट (PNC Day 7 - रुक्मिणी बाई)' : 'Postnatal Home Visit (PNC Day 7 - Rukmini Bai)',
      category: language === 'mr' ? 'पीएनसी भेट' : 'PNC Visit',
      completed: false,
    },
  ]);

  const toggleTask = (id: string) => {
    setScheduleTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  // Compute key stats
  const totalCount = allBeneficiaries.length;
  const completedCheckupsCount = allBeneficiaries.filter((b) => b.vitals?.recordedAt).length;
  const recentList = allBeneficiaries.slice(0, 4);

  const workerDisplayName = jwtSession?.workerName || (language === 'mr' ? 'संगीता ताई (आशा कार्यकर्ती)' : 'Savita Bai (ASHA Worker)');
  const subCenterName = jwtSession?.subCenter || (language === 'mr' ? 'करजगाव उपकेंद्र ०४' : 'Karajgaon Sub-Center 04');

  const handleSelectPatientAndNavigate = (patient: Beneficiary, screen: 'beneficiary' | 'vitals' | 'assessment' | 'referral') => {
    setBeneficiary(patient);
    onNavigate(screen);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 text-slate-800">
      {/* Top Banner / Hero */}
      <div className="bg-gradient-to-br from-[#00434c] via-[#00525d] to-[#016573] text-white px-4 pt-4 pb-6 shadow-md rounded-b-3xl">
        <div className="max-w-xl mx-auto space-y-3">
          {/* Worker Info Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-white shadow-sm backdrop-blur-md">
                <span className="material-symbols-outlined text-[28px]">health_and_safety</span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-lg font-bold tracking-tight text-white leading-tight">
                    {t.homeGreeting}
                  </h1>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-300/20 text-teal-100 border border-teal-300/30">
                    ASHA
                  </span>
                </div>
                <p className="text-xs text-teal-100/90 leading-tight mt-0.5 font-medium">
                  {subCenterName} • {workerDisplayName}
                </p>
              </div>
            </div>

            {/* Offline/Online Status Pill */}
            <div className="flex items-center">
              <span className={`inline-flex items-center space-x-1 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm ${
                netInfo.isConnected
                  ? 'bg-emerald-500/25 text-emerald-100 border border-emerald-400/40'
                  : 'bg-amber-500/25 text-amber-100 border border-amber-400/40'
              }`}>
                <span className={`w-2 h-2 rounded-full ${netInfo.isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span>{netInfo.isConnected ? (language === 'mr' ? 'ऑनलाइन' : 'Online') : (language === 'mr' ? 'ऑफलाइन' : 'Offline')}</span>
              </span>
            </div>
          </div>

          {/* Quick Date and Motivation */}
          <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-sm border border-white/15 flex items-center justify-between text-xs text-teal-50">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-[18px] text-teal-200">calendar_today</span>
              <span>
                {new Date().toLocaleDateString(language === 'mr' ? 'mr-IN' : 'en-IN', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-teal-200">
              {language === 'mr' ? 'आरोग्य आपल्या दारी' : 'National Health Mission'}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 space-y-5 -mt-3">
        {/* Primary Action Card: NEW REGISTRATION (Prominent Call to Action) */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-4 text-white shadow-lg shadow-emerald-900/10 border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-white text-emerald-700 flex items-center justify-center shadow-md shrink-0">
              <span className="material-symbols-outlined text-[30px]">person_add</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold tracking-tight text-white leading-tight">
                  {t.newRegistrationBtn}
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-full">
                  ABHA + RCH
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 leading-tight mt-1">
                {t.newRegistrationDesc}
              </p>
            </div>
          </div>

          <button
            id="btn-new-registration"
            onClick={() => setShowRegModal(true)}
            className="w-full sm:w-auto bg-white hover:bg-emerald-50 text-emerald-800 font-bold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center justify-center space-x-1.5 transition-all transform active:scale-95 shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>{language === 'mr' ? 'नोंदणी सुरू करा' : 'Register Now'}</span>
          </button>
        </div>

        {/* 3 Secondary Quick Action Buttons */}
        <div className="grid grid-cols-3 gap-2.5">
          <button
            id="btn-quick-vitals"
            onClick={() => onNavigate('vitals')}
            className="bg-white hover:bg-teal-50/60 p-3 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center transition-all hover:border-teal-300 group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#00434c] group-hover:bg-[#00434c] group-hover:text-white flex items-center justify-center transition-colors mb-1.5">
              <span className="material-symbols-outlined text-[22px]">monitor_heart</span>
            </div>
            <span className="text-xs font-bold text-slate-800 leading-tight">
              {t.quickVitalsBtn}
            </span>
            <span className="text-[10px] text-slate-600 mt-0.5 leading-tight">
              {language === 'mr' ? 'तपासणी' : 'Checkup'}
            </span>
          </button>

          <button
            id="btn-quick-sos"
            onClick={() => onNavigate('referral')}
            className="bg-white hover:bg-red-50/60 p-3 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center transition-all hover:border-red-300 group"
          >
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 group-hover:bg-red-700 group-hover:text-white flex items-center justify-center transition-colors mb-1.5">
              <span className="material-symbols-outlined text-[22px]">emergency</span>
            </div>
            <span className="text-xs font-bold text-red-700 leading-tight">
              {t.sosAmbulanceBtn}
            </span>
            <span className="text-[10px] text-slate-600 mt-0.5 leading-tight">
              {language === 'mr' ? 'रुग्णवाहिका' : 'Ambulance'}
            </span>
          </button>

          <button
            id="btn-quick-teleconsult"
            onClick={() => setShowTeleconsultModal(true)}
            className="bg-white hover:bg-indigo-50/60 p-3 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center transition-all hover:border-indigo-300 group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 group-hover:bg-indigo-700 group-hover:text-white flex items-center justify-center transition-colors mb-1.5">
              <span className="material-symbols-outlined text-[22px]">video_call</span>
            </div>
            <span className="text-xs font-bold text-indigo-900 leading-tight">
              {t.teleconsultQuickBtn}
            </span>
            <span className="text-[10px] text-slate-600 mt-0.5 leading-tight">
              {language === 'mr' ? 'डॉक्टर कॉल' : 'Doctor Call'}
            </span>
          </button>
        </div>

        {/* Maternal Health Statistics Overview */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-[#00434c] text-[20px]">analytics</span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {t.maternalHealthStats}
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-slate-600">
              {language === 'mr' ? 'उपकेंद्र सांख्यिकी' : 'Ward Level'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Total Beneficiaries */}
            <div
              onClick={() => onNavigate('patients')}
              className="bg-slate-50 hover:bg-slate-100/80 cursor-pointer p-3 rounded-xl border border-slate-200/70 transition-colors"
            >
              <div className="text-[11px] font-semibold text-slate-600 leading-tight">
                {t.totalMothers}
              </div>
              <div className="text-xl font-black text-[#00434c] mt-1 font-mono">
                {totalCount}
              </div>
              <div className="text-[10px] text-teal-700 font-semibold mt-0.5">
                {language === 'mr' ? 'पंजीकृत माता' : 'Registered'}
              </div>
            </div>

            {/* Completed ANC Checkups */}
            <div
              onClick={() => onNavigate('vitals')}
              className="bg-emerald-50/70 hover:bg-emerald-100/70 cursor-pointer p-3 rounded-xl border border-emerald-200 transition-colors"
            >
              <div className="text-[11px] font-semibold text-emerald-800 leading-tight flex items-center justify-between">
                <span>{language === 'mr' ? 'पूर्ण तपासण्या' : language === 'hi' ? 'पूर्ण जांच' : 'Checkups Done'}</span>
                <span className="material-symbols-outlined text-[15px] text-emerald-700">check_circle</span>
              </div>
              <div className="text-xl font-black text-emerald-800 mt-1 font-mono">
                {completedCheckupsCount || 3}
              </div>
              <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                {language === 'mr' ? 'नियमित नोंदी' : 'Routine Records'}
              </div>
            </div>

            {/* Deliveries This Month */}
            <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/70">
              <div className="text-[11px] font-semibold text-amber-800 leading-tight">
                {t.deliveriesMonth}
              </div>
              <div className="text-xl font-black text-amber-900 mt-1 font-mono">
                3
              </div>
              <div className="text-[10px] text-amber-700 font-semibold mt-0.5">
                {language === 'mr' ? 'पुढील ३० दिवस' : 'Next 30 Days'}
              </div>
            </div>

            {/* Visits Due Today */}
            <div className="bg-teal-50/70 p-3 rounded-xl border border-teal-200/70">
              <div className="text-[11px] font-semibold text-teal-800 leading-tight">
                {t.visitsDueToday}
              </div>
              <div className="text-xl font-black text-teal-900 mt-1 font-mono">
                2
              </div>
              <div className="text-[10px] text-teal-700 font-semibold mt-0.5">
                {language === 'mr' ? 'गृहभेटी निश्चित' : 'Scheduled'}
              </div>
            </div>
          </div>
        </div>

        {/* Today's Field Schedule & Home Visits Checklist */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-[#00434c] text-[20px]">checklist</span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {t.todaysFieldTasks}
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              {scheduleTasks.filter((t) => t.completed).length} / {scheduleTasks.length} {language === 'mr' ? 'पूर्ण' : 'Done'}
            </span>
          </div>

          <div className="space-y-2">
            {scheduleTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`flex items-start space-x-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                  task.completed
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : 'bg-white border-slate-200/90 hover:border-teal-300 shadow-xs'
                }`}
              >
                <div className="pt-0.5">
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      task.completed ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                    style={{ fontVariationSettings: task.completed ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {task.completed ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-teal-800 font-mono">
                      {task.time}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {task.category}
                    </span>
                  </div>
                  <p className={`text-xs mt-0.5 leading-snug font-medium ${task.completed ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                    {task.title}
                  </p>
                  {task.beneficiaryId && !task.completed && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const targetMother = allBeneficiaries.find((b) => b.id === task.beneficiaryId) || allBeneficiaries[0];
                        if (targetMother) {
                          handleSelectPatientAndNavigate(targetMother, 'vitals');
                        }
                      }}
                      className="mt-1.5 inline-flex items-center space-x-1 text-[11px] font-bold text-[#00434c] bg-teal-50 hover:bg-teal-100 px-2.5 py-0.5 rounded-md border border-teal-200 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[13px]">monitor_heart</span>
                      <span>{language === 'mr' ? 'तपासणी सुरू करा' : 'Start Checkup'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Registered Beneficiaries */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-[#00434c] text-[20px]">groups</span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {t.recentBeneficiariesTitle}
              </h3>
            </div>
            <button
              onClick={() => onNavigate('patients')}
              className="text-xs font-bold text-teal-800 hover:text-teal-900 flex items-center space-x-1"
            >
              <span>{t.viewFullDirectory}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentList.map((mother) => {
              const displayName = language === 'mr'
                ? (mother.nameMarathi || mother.name)
                : mother.name;

              return (
                <div
                  key={mother.id}
                  onClick={() => handleSelectPatientAndNavigate(mother, 'beneficiary')}
                  className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
                      {displayName.substring(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-800">{displayName}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-slate-100 text-slate-700">
                          {mother.gestationalAge}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center space-x-1.5">
                        <span>{mother.village} • {mother.subCenter}</span>
                        <span className="font-mono text-[9px] bg-slate-100 text-slate-500 px-1 py-0.2 rounded">
                          {mother.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-slate-700 block">
                      {mother.vitals.systolic}/{mother.vitals.diastolic}
                    </span>
                    <span className="text-[10px] text-teal-700 font-semibold">
                      {language === 'mr' ? 'तपशील >' : 'View >'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => onNavigate('patients')}
            className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center space-x-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">view_list</span>
            <span>{t.viewFullDirectory} ({allBeneficiaries.length} {language === 'mr' ? 'माता' : 'Mothers'})</span>
          </button>
        </div>
      </div>

      {/* New Beneficiary Registration Modal */}
      <NewBeneficiaryModal
        isOpen={showRegModal}
        onClose={() => setShowRegModal(false)}
        onSuccessNavigate={(newMother, targetScreen) => {
          setBeneficiary(newMother);
          onNavigate(targetScreen);
        }}
      />
    </div>
  );
};
