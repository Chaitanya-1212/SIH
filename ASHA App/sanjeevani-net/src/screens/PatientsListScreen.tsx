import React, { useState } from 'react';
import { Beneficiary, AppScreen } from '../types';
import { OTHER_BENEFICIARIES } from '../data/mockData';

interface PatientsListScreenProps {
  onSelectBeneficiary: (beneficiary: Beneficiary) => void;
  onNavigate: (screen: AppScreen) => void;
}

export const PatientsListScreen: React.FC<PatientsListScreenProps> = ({
  onSelectBeneficiary,
  onNavigate,
}) => {
  const [filter, setFilter] = useState<'all' | 'high_risk' | 'anc'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatients = OTHER_BENEFICIARIES.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.abhaId.includes(searchQuery);

    if (!matchesSearch) return false;
    if (filter === 'high_risk') return p.riskStatus === 'HIGH';
    return true;
  });

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-3.5 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-[#00434c] tracking-tight">Beneficiaries Directory</h1>
          <p className="text-xs text-[#3f484a] font-medium">पंजीकृत गर्भवती महिलाएं (Sub-Center Khairi)</p>
        </div>
        <span className="bg-[#00434c] text-white text-xs font-bold px-2.5 py-1 rounded-lg">
          {OTHER_BENEFICIARIES.length} Total
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
          placeholder="Search by name, village, or ABHA..."
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
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          All ({OTHER_BENEFICIARIES.length})
        </button>

        <button
          onClick={() => setFilter('high_risk')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
            filter === 'high_risk'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-red-700 border border-red-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>High Risk (1)</span>
        </button>
      </div>

      {/* Patients List */}
      <div className="space-y-3 pt-1">
        {filteredPatients.map((patient) => {
          const isHighRisk = patient.riskStatus === 'HIGH';

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
                  alt={patient.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#141c2b] truncate">{patient.name}</h3>
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                        isHighRisk ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {patient.riskStatus}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-0.5">
                    {patient.age}y • {patient.village} • Gravida {patient.gravida}
                  </p>
                </div>
              </div>

              {/* Vitals summary bar */}
              <div className="bg-[#f1f3ff] rounded-xl p-2 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">Gestational Age</span>
                  <span className="font-bold text-[#00434c]">{patient.gestationalAge}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Last Recorded BP</span>
                  <span className={`font-mono font-bold ${isHighRisk ? 'text-red-600' : 'text-slate-800'}`}>
                    {patient.vitals.systolic}/{patient.vitals.diastolic} mmHg
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-[#00434c] font-bold text-xs">
                  <span>View Details</span>
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
