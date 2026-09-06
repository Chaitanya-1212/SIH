import React, { useState } from 'react';
import { Beneficiary, AppScreen } from '../types';
import { useAppStore } from '../store/useAppStore';
import { getTranslation } from '../i18n/translations';

interface PatientsListScreenProps {
  onSelectBeneficiary: (beneficiary: Beneficiary) => void;
  onNavigate: (screen: AppScreen) => void;
}

export const PatientsListScreen: React.FC<PatientsListScreenProps> = ({
  onSelectBeneficiary,
  onNavigate,
}) => {
  const { language, allBeneficiaries } = useAppStore();
  const t = getTranslation(language);

  const [filter, setFilter] = useState<'all' | 'karajgaon' | 'other'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatients = allBeneficiaries.filter((p) => {
    const pName = language === 'mr' ? (p.nameMarathi || p.name) : language === 'hi' ? (p.nameHindi || p.name) : p.name;
    const matchesSearch =
      pName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.abhaId.includes(searchQuery);

    if (!matchesSearch) return false;
    if (filter === 'karajgaon') return p.village.toLowerCase().includes('karajgaon');
    if (filter === 'other') return !p.village.toLowerCase().includes('karajgaon');
    return true;
  });

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-3.5 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-[#00434c] tracking-tight">{t.directoryTitle}</h1>
          <p className="text-xs text-[#3f484a] font-medium">{t.directorySubtitle}</p>
        </div>
        <span className="bg-[#00434c] text-white text-xs font-bold px-2.5 py-1 rounded-lg">
          {allBeneficiaries.length} {t.totalBeneficiaries}
        </span>
      </div>

      {/* Search Input */}
      <div className="relative flex items-center">
        <span className="absolute left-3 material-symbols-outlined text-[20px] text-slate-400">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full h-11 pl-10 pr-4 bg-white border border-[#e0e8fd] rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-[#00434c] shadow-xs"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            filter === 'all'
              ? 'bg-[#00434c] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          {t.filterAll} ({allBeneficiaries.length})
        </button>

        <button
          onClick={() => setFilter('karajgaon')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            filter === 'karajgaon'
              ? 'bg-[#00434c] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span>{language === 'mr' ? 'करजगाव' : language === 'hi' ? 'करजगांव' : 'Karajgaon'} ({allBeneficiaries.filter(p => p.village.toLowerCase().includes('karajgaon')).length})</span>
        </button>

        <button
          onClick={() => setFilter('other')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            filter === 'other'
              ? 'bg-[#00434c] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span>{language === 'mr' ? 'खैरी / बेलोरा' : language === 'hi' ? 'खैरी / बेलोरा' : 'Khairi / Belora'} ({allBeneficiaries.filter(p => !p.village.toLowerCase().includes('karajgaon')).length})</span>
        </button>
      </div>

      {/* Patients List */}
      <div className="space-y-3 pt-1">
        {filteredPatients.map((patient) => {
          const pName = language === 'mr' 
            ? (patient.nameMarathi || patient.name) 
            : language === 'hi' 
            ? (patient.nameHindi || patient.name) 
            : patient.name;

          return (
            <div
              key={patient.id}
              onClick={() => {
                onSelectBeneficiary(patient);
                onNavigate('beneficiary');
              }}
              className="w-full bg-white rounded-2xl p-3.5 shadow-sm border border-[#e0e8fd] hover:border-[#00434c] cursor-pointer transition-all space-y-2.5"
            >
              <div className="flex items-start space-x-3">
                <img
                  src={patient.photoUrl}
                  alt={pName}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#141c2b] truncate">{pName}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {patient.gestationalAge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-0.5">
                    {patient.age}{language === 'mr' ? ' वर्षे' : language === 'hi' ? ' वर्ष' : 'y'} • {patient.village} • {t.gravida} {patient.gravida}
                  </p>
                </div>
              </div>

              {/* Vitals summary bar */}
              <div className="bg-[#f1f3ff] rounded-xl p-2 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">{t.gestationalAge}</span>
                  <span className="font-bold text-[#00434c]">{patient.gestationalAge}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">{t.bloodPressure}</span>
                  <span className="font-mono font-bold text-slate-800">
                    {patient.vitals.systolic}/{patient.vitals.diastolic} mmHg
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-[#00434c] font-bold text-xs">
                  <span>{t.viewPatientDetails}</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
