import React, { useState } from 'react';
import { Beneficiary } from '../types';
import { useAppStore } from '../store/useAppStore';
import { getTranslation } from '../i18n/translations';

interface NewBeneficiaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessNavigate?: (beneficiary: Beneficiary, targetScreen: 'beneficiary' | 'vitals') => void;
}

export const NewBeneficiaryModal: React.FC<NewBeneficiaryModalProps> = ({
  isOpen,
  onClose,
  onSuccessNavigate,
}) => {
  const { language, addBeneficiary } = useAppStore();
  const t = getTranslation(language);

  // Form State
  const [name, setName] = useState('');
  const [nameMarathi, setNameMarathi] = useState('');
  const [age, setAge] = useState<number | ''>(24);
  const [phone, setPhone] = useState('98234');
  const [husbandName, setHusbandName] = useState('');
  const [village, setVillage] = useState('करजगाव (वॉर्ड २)');
  const [subCenter, setSubCenter] = useState('करजगाव उपकेंद्र ०४');

  // Identifiers
  const [abhaId, setAbhaId] = useState('');
  const [isAbhaVerified, setIsAbhaVerified] = useState(false);
  const [isGeneratingAbha, setIsGeneratingAbha] = useState(false);
  const [rchId, setRchId] = useState('');

  // Obstetric
  const [lmpDate, setLmpDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 110);
    return d.toISOString().split('T')[0];
  });
  const [gravida, setGravida] = useState<number>(2);
  const [parity, setParity] = useState<number>(1);

  // Maternal History Factors
  const [riskFactors, setRiskFactors] = useState<{ [key: string]: boolean }>({
    highBp: false,
    anemia: false,
    prevCesarean: false,
    extremAge: false,
    diabetes: false,
    twins: false,
  });

  // Baseline Vitals
  const [systolic, setSystolic] = useState<number>(118);
  const [diastolic, setDiastolic] = useState<number>(76);
  const [pulse, setPulse] = useState<number>(78);
  const [weight, setWeight] = useState<number>(54);
  const [hemoglobin, setHemoglobin] = useState<number>(11.2);

  // Registration success UI state
  const [registeredMother, setRegisteredMother] = useState<Beneficiary | null>(null);

  if (!isOpen) return null;

  // Auto-calculate Gestational Age & EDD from LMP
  const calculateGestationalInfo = () => {
    if (!lmpDate) return { weeks: 14, days: 0, eddStr: 'N/A' };
    const lmp = new Date(lmpDate);
    const today = new Date();
    const diffMs = today.getTime() - lmp.getTime();
    const totalDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    const weeks = Math.floor(totalDays / 7);
    const days = totalDays % 7;

    const edd = new Date(lmp);
    edd.setDate(edd.getDate() + 280);
    const eddStr = edd.toLocaleDateString(language === 'mr' ? 'mr-IN' : 'en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    return { weeks, days, eddStr };
  };

  const { weeks: gestWeeks, days: gestDays, eddStr } = calculateGestationalInfo();

  const handleSimulateAbhaCreation = () => {
    setIsGeneratingAbha(true);
    setTimeout(() => {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      setAbhaId(`91-8422-9012-${randomSuffix}`);
      setRchId(`2714008${randomSuffix}`);
      setIsAbhaVerified(true);
      setIsGeneratingAbha(false);
    }, 1000);
  };

  const handleFillDemo = () => {
    setName('Pooja Ganesh Gaikwad');
    setNameMarathi('पूजा गणेश गायकवाड');
    setAge(22);
    setPhone('98604 12345');
    setHusbandName('गणेश भाऊराव गायकवाड (Ganesh Gaikwad)');
    setVillage('करजगाव (वॉर्ड २)');
    setSubCenter('करजगाव उपकेंद्र ०४');
    setAbhaId('91-4521-8890-3412');
    setRchId('271400234901');
    setIsAbhaVerified(true);
    setGravida(1);
    setParity(0);
    setSystolic(116);
    setDiastolic(74);
    setPulse(80);
    setWeight(52);
    setHemoglobin(11.4);
    setRiskFactors({
      highBp: false,
      anemia: false,
      prevCesarean: false,
      extremAge: false,
      diabetes: false,
      twins: false,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newId = `ben_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newBeneficiary: Beneficiary = {
      id: newId,
      name: name.trim(),
      nameHindi: name.trim(),
      nameMarathi: nameMarathi.trim() || undefined,
      age: Number(age) || 24,
      gender: 'Female',
      husbandName: husbandName.trim() || 'पतीचे नाव',
      husbandPhone: phone.trim() || '98234 56789',
      village: village.trim(),
      subCenter: subCenter.trim(),
      ashaWorker: 'ASHA Savita Bai (Emp #4412)',
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      abhaId: abhaId.trim() || `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      rchId: rchId.trim() || `2714${Date.now().toString().slice(-8)}`,
      gestationalAge: `${gestWeeks} आठवडे ${gestDays} दिवस (${gestWeeks} Wks ${gestDays} D)`,
      gravida: Number(gravida) || 1,
      lmpDate: lmpDate,
      eddDate: eddStr,
      riskStatus: 'NORMAL',
      riskTitle: 'Antenatal Health Assessment',
      riskTitleHindi: 'गर्भावस्था स्वास्थ्य मूल्यांकन',
      riskTitleMarathi: 'प्रसूतीपूर्व आरोग्य तपासणी (ANC)',
      proteinuria: 'Nil',
      vitals: {
        systolic,
        diastolic,
        pulseRate: pulse,
        bodyWeight: weight,
        spo2: 98,
        temperature: 98.4,
        tempUnit: 'F',
        recordedAt: 'आताच नोंदवले (Just now)',
      },
    };

    addBeneficiary(newBeneficiary);
    setRegisteredMother(newBeneficiary);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00434c] to-[#005f6b] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white backdrop-blur-sm">
              <span className="material-symbols-outlined text-[24px]">person_add</span>
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight leading-tight">
                {t.registerMotherTitle}
              </h2>
              <p className="text-xs text-teal-100/90 leading-tight mt-0.5">
                {t.registerMotherSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Success Screen after registration */}
        {registeredMother ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
              <span className="material-symbols-outlined text-[36px]">verified</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              {language === 'mr' ? 'नोंदणी यशस्वी झाली!' : language === 'hi' ? 'पंजीकरण सफल हुआ!' : 'Registration Successful!'}
            </h3>
            <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
              {t.registrationSuccessToast}
            </p>

            {/* Beneficiary Badge */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 my-4 text-left max-w-md mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-800 text-base">
                  {language === 'mr' ? (registeredMother.nameMarathi || registeredMother.name) : registeredMother.name}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {language === 'mr' ? 'नोंदणीकृत' : 'Registered'}
                </span>
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <div><strong>ABHA ID:</strong> {registeredMother.abhaId}</div>
                <div><strong>RCH ID:</strong> {registeredMother.rchId}</div>
                <div><strong>{language === 'mr' ? 'वय व प्रसूती' : 'Age & Obstetric'}:</strong> {registeredMother.age} वर्षे • {registeredMother.gravida}</div>
                <div><strong>{language === 'mr' ? 'गर्भधारणा' : 'Gestation'}:</strong> {registeredMother.gestationalAge}</div>
                <div><strong>{language === 'mr' ? 'आरंभीक रक्तदाब' : 'Baseline BP'}:</strong> {registeredMother.vitals.bp}</div>
              </div>
            </div>

            {/* Post-Registration Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md mx-auto pt-2">
              <button
                onClick={() => {
                  onClose();
                  if (onSuccessNavigate) {
                    onSuccessNavigate(registeredMother, 'beneficiary');
                  }
                }}
                className="w-full bg-[#00434c] hover:bg-[#00343b] text-white py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-1.5 shadow-sm transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">account_circle</span>
                <span>{language === 'mr' ? 'मातेची प्रोफाइल पहा' : language === 'hi' ? 'प्रोफ़ाइल देखें' : 'View Profile'}</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  if (onSuccessNavigate) {
                    onSuccessNavigate(registeredMother, 'vitals');
                  }
                }}
                className="w-full bg-teal-700 hover:bg-teal-800 text-white py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-1.5 shadow-sm transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">monitor_heart</span>
                <span>{language === 'mr' ? 'वाइटल्स नोंदवा' : language === 'hi' ? 'वाइटल्स दर्ज करें' : 'Record Vitals'}</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="mt-3 text-xs text-slate-500 hover:text-slate-800 font-semibold underline"
            >
              {language === 'mr' ? 'डॅशबोर्डवरच राहा (Stay on Dashboard)' : 'Stay on Dashboard'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 max-h-[78vh] overflow-y-auto space-y-5 text-slate-800">
            {/* Demo Fill Bar */}
            <div className="bg-teal-50/70 border border-teal-200/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2 text-xs text-teal-900 font-semibold">
                <span className="material-symbols-outlined text-teal-700 text-[18px]">bolt</span>
                <span>{language === 'mr' ? 'डेमो माहितीने फॉर्म भरा:' : 'Quick Demo Autofill:'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="text-xs bg-white border border-teal-300 text-teal-800 hover:bg-teal-100/60 font-semibold px-2.5 py-1 rounded-lg transition-colors"
                >
                  {language === 'mr' ? 'डेमो माहिती भरा (Autofill)' : 'Autofill Demo'}
                </button>
              </div>
            </div>

            {/* Section 1: Demographics */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-1.5">
                <span className="material-symbols-outlined text-[#00434c] text-[20px]">badge</span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {t.personalDetails}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.motherNameLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Pooja Ganesh Gaikwad"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {language === 'mr' ? 'मातेचे नाव (मराठीत)' : 'Name (Regional)'}
                  </label>
                  <input
                    type="text"
                    value={nameMarathi}
                    onChange={(e) => setNameMarathi(e.target.value)}
                    placeholder="उदा. पूजा गणेश गायकवाड"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.motherAgeLabel} *
                    </label>
                    <input
                      type="number"
                      required
                      min={15}
                      max={48}
                      value={age}
                      onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.motherPhoneLabel} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="98234 56789"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.husbandNameLabel}
                  </label>
                  <input
                    type="text"
                    value={husbandName}
                    onChange={(e) => setHusbandName(e.target.value)}
                    placeholder="उदा. गणेश भाऊराव गायकवाड"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.villageLabel}
                  </label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.subCenterLabel}
                  </label>
                  <input
                    type="text"
                    value={subCenter}
                    onChange={(e) => setSubCenter(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: ABHA & RCH */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <div className="flex items-center space-x-2">
                  <span className="material-symbols-outlined text-[#00434c] text-[20px]">fingerprint</span>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    {t.nationalHealthIds}
                  </h3>
                </div>
                {isAbhaVerified && (
                  <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    <span>{language === 'mr' ? 'पडताळणी पूर्ण' : language === 'hi' ? 'सत्यापित' : 'Verified'}</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ABHA ID (14 Digits)
                  </label>
                  <div className="flex space-x-1.5">
                    <input
                      type="text"
                      value={abhaId}
                      onChange={(e) => setAbhaId(e.target.value)}
                      placeholder="91-XXXX-XXXX-XXXX"
                      className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleSimulateAbhaCreation}
                      disabled={isGeneratingAbha}
                      className="text-[11px] font-bold bg-slate-100 hover:bg-slate-200 border border-slate-300 px-2 py-1 rounded-lg text-slate-700 transition-colors whitespace-nowrap"
                    >
                      {isGeneratingAbha ? '...' : (language === 'mr' ? 'तयार करा' : 'Verify')}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    RCH ID (MCTS)
                  </label>
                  <input
                    type="text"
                    value={rchId}
                    onChange={(e) => setRchId(e.target.value)}
                    placeholder="271400XXXXXX"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Obstetric History & Auto-Calculated Gestation */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-1.5">
                <span className="material-symbols-outlined text-[#00434c] text-[20px]">calendar_month</span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {t.obstetricHistory}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.lmpLabel} *
                  </label>
                  <input
                    type="date"
                    required
                    value={lmpDate}
                    onChange={(e) => setLmpDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.gravidaLabel}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={gravida}
                    onChange={(e) => setGravida(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.parityLabel}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={9}
                    value={parity}
                    onChange={(e) => setParity(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Computed EDD Card */}
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-teal-700 font-semibold block">{t.gestationalAgeLabel}:</span>
                  <span className="text-slate-800 font-bold text-sm">
                    {gestWeeks} आठवडे {gestDays} दिवस ({gestWeeks} Wks {gestDays} D)
                  </span>
                </div>
                <div>
                  <span className="text-teal-700 font-semibold block">{t.eddLabel}:</span>
                  <span className="text-slate-800 font-bold text-sm">{eddStr}</span>
                </div>
              </div>
            </div>

            {/* Section 4: Maternal Baseline Medical History */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-1.5">
                <span className="material-symbols-outlined text-teal-700 text-[20px]">medical_information</span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {language === 'mr' ? 'आरोग्य पूर्वइतिहास व तपासणी' : language === 'hi' ? 'स्वास्थ्य इतिहास एवं पृष्ठभूमि' : 'Maternal Medical History & Baseline'}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                <label className="flex items-center space-x-2 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100/70">
                  <input
                    type="checkbox"
                    checked={riskFactors.highBp}
                    onChange={(e) => setRiskFactors({ ...riskFactors, highBp: e.target.checked })}
                    className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                  />
                  <span>{language === 'mr' ? 'उच्च रक्तदाब (BP ≥ 140/90)' : 'High Blood Pressure (BP ≥ 140/90)'}</span>
                </label>

                <label className="flex items-center space-x-2 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100/70">
                  <input
                    type="checkbox"
                    checked={riskFactors.anemia}
                    onChange={(e) => setRiskFactors({ ...riskFactors, anemia: e.target.checked })}
                    className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                  />
                  <span>{language === 'mr' ? 'गंभीर / मध्यम रक्तक्षय (Hb < 9 g/dL)' : 'Moderate/Severe Anemia (Hb < 9)'}</span>
                </label>

                <label className="flex items-center space-x-2 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100/70">
                  <input
                    type="checkbox"
                    checked={riskFactors.prevCesarean}
                    onChange={(e) => setRiskFactors({ ...riskFactors, prevCesarean: e.target.checked })}
                    className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                  />
                  <span>{language === 'mr' ? 'मागील सिझेरियन (Previous LSCS)' : 'Previous C-Section / Obstructed'}</span>
                </label>

                <label className="flex items-center space-x-2 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100/70">
                  <input
                    type="checkbox"
                    checked={riskFactors.diabetes}
                    onChange={(e) => setRiskFactors({ ...riskFactors, diabetes: e.target.checked })}
                    className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                  />
                  <span>{language === 'mr' ? 'गर्भावस्थेतील मधुमेह (GDM)' : 'Gestational Diabetes (GDM)'}</span>
                </label>
              </div>
            </div>

            {/* Section 5: Baseline Vitals */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-1.5">
                <span className="material-symbols-outlined text-[#00434c] text-[20px]">ecg_heart</span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {t.initialVitalsTitle}
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    {language === 'mr' ? 'सिस्टोलिक (Systolic)' : 'Systolic (mmHg)'}
                  </label>
                  <input
                    type="number"
                    value={systolic}
                    onChange={(e) => setSystolic(Number(e.target.value))}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    {language === 'mr' ? 'डायस्टोलिक (Diastolic)' : 'Diastolic (mmHg)'}
                  </label>
                  <input
                    type="number"
                    value={diastolic}
                    onChange={(e) => setDiastolic(Number(e.target.value))}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    {language === 'mr' ? 'नाडी दर (Pulse bpm)' : 'Pulse (bpm)'}
                  </label>
                  <input
                    type="number"
                    value={pulse}
                    onChange={(e) => setPulse(Number(e.target.value))}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    {language === 'mr' ? 'हिमोग्लोबिन (Hb g/dL)' : 'Hemoglobin (Hb)'}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={hemoglobin}
                    onChange={(e) => setHemoglobin(Number(e.target.value))}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="bg-[#00434c] hover:bg-[#00343b] text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                <span>{t.completeRegistrationBtn}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
