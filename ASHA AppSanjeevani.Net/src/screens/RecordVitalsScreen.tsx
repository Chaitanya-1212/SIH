import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { vitalsFormSchema, VitalsFormValues } from '../schemas/vitalsSchema';
import { useAppStore } from '../store/useAppStore';
import { VitalsData, AppScreen } from '../types';
import { getTranslation } from '../i18n/translations';

interface RecordVitalsScreenProps {
  onNavigate?: (screen: AppScreen) => void;
}

export const RecordVitalsScreen: React.FC<RecordVitalsScreenProps> = ({ onNavigate }) => {
  const {
    beneficiary,
    allBeneficiaries,
    setBeneficiary,
    updateBeneficiaryVitals,
    setScreen,
    language,
    startBhashiniVoiceInput,
    bhashiniVoice,
    speakVernacular,
  } = useAppStore();

  const t = getTranslation(language);
  const navigate = onNavigate || setScreen;
  const [toast, setToast] = useState<string | null>(null);
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<string>('general');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VitalsFormValues>({
    resolver: zodResolver(vitalsFormSchema),
    defaultValues: {
      systolic: 120,
      diastolic: 80,
      temperature: 98.4,
      tempUnit: 'F',
      pulseRate: 72,
      spo2: 99,
      bodyWeight: 55.0,
      randomBloodSugar: 100,
      clinicalNotes: '',
    },
  });

  const watchedSystolic = watch('systolic');
  const watchedDiastolic = watch('diastolic');
  const watchedTemp = watch('temperature');
  const watchedTempUnit = watch('tempUnit');

  // If a specific beneficiary is selected, sync their vitals
  useEffect(() => {
    if (selectedBeneficiaryId !== 'general') {
      setValue('systolic', beneficiary.vitals.systolic);
      setValue('diastolic', beneficiary.vitals.diastolic);
      setValue('temperature', beneficiary.vitals.temperature);
      setValue('pulseRate', beneficiary.vitals.pulseRate);
      setValue('spo2', beneficiary.vitals.spo2);
      setValue('bodyWeight', beneficiary.vitals.bodyWeight);
      if (beneficiary.vitals.randomBloodSugar) {
        setValue('randomBloodSugar', beneficiary.vitals.randomBloodSugar);
      }
    }
  }, [beneficiary.vitals, selectedBeneficiaryId, setValue]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleBeneficiaryChange = (id: string) => {
    setSelectedBeneficiaryId(id);
    if (id === 'general') {
      setValue('systolic', 120, { shouldValidate: true });
      setValue('diastolic', 80, { shouldValidate: true });
      setValue('temperature', 98.4, { shouldValidate: true });
      setValue('tempUnit', 'F');
      setValue('pulseRate', 72, { shouldValidate: true });
      setValue('spo2', 99, { shouldValidate: true });
      setValue('bodyWeight', 55.0, { shouldValidate: true });
      setValue('randomBloodSugar', 100, { shouldValidate: true });
      setValue('clinicalNotes', '');
      showToast(
        language === 'mr'
          ? 'सामान्य तपासणी सक्रिय केली (मानक वाइटल्स)'
          : language === 'hi'
          ? 'सामान्य जांच सक्रिय की गई (मानक वाइटल्स)'
          : 'General checkup mode active'
      );
    } else {
      const selected = allBeneficiaries.find((b) => b.id === id);
      if (selected) {
        setBeneficiary(selected);
        setValue('systolic', selected.vitals.systolic, { shouldValidate: true });
        setValue('diastolic', selected.vitals.diastolic, { shouldValidate: true });
        setValue('temperature', selected.vitals.temperature, { shouldValidate: true });
        setValue('tempUnit', selected.vitals.tempUnit || 'F');
        setValue('pulseRate', selected.vitals.pulseRate, { shouldValidate: true });
        setValue('spo2', selected.vitals.spo2, { shouldValidate: true });
        setValue('bodyWeight', selected.vitals.bodyWeight, { shouldValidate: true });
        setValue('randomBloodSugar', selected.vitals.randomBloodSugar || 110, { shouldValidate: true });
        setValue('clinicalNotes', '');
        const sName = language === 'mr' ? (selected.nameMarathi || selected.name) : selected.name;
        showToast(
          language === 'mr'
            ? `${sName} यांची नोंद लोड झाली`
            : language === 'hi'
            ? `${sName} का रिकॉर्ड लोड हुआ`
            : `Loaded records for ${sName}`
        );
      }
    }
  };

  const handleUseBaseline = () => {
    setValue('systolic', 120, { shouldValidate: true, shouldDirty: true });
    setValue('diastolic', 80, { shouldValidate: true, shouldDirty: true });
    setValue('temperature', 98.4, { shouldValidate: true });
    setValue('tempUnit', 'F');
    setValue('pulseRate', 72, { shouldValidate: true });
    setValue('spo2', 99, { shouldValidate: true });
    setValue('bodyWeight', 55.0, { shouldValidate: true });
    setValue('randomBloodSugar', 100, { shouldValidate: true });
    showToast(t.autoFillToast);
  };

  const onSubmit = (data: VitalsFormValues) => {
    const updated: VitalsData = {
      systolic: data.systolic,
      diastolic: data.diastolic,
      temperature: data.temperature,
      tempUnit: data.tempUnit,
      pulseRate: data.pulseRate,
      spo2: data.spo2,
      bodyWeight: data.bodyWeight,
      randomBloodSugar: data.randomBloodSugar,
      recordedAt: language === 'mr' ? 'आताच' : language === 'hi' ? 'अभी' : 'Just now',
    };

    updateBeneficiaryVitals(updated, data.clinicalNotes);
    showToast(
      selectedBeneficiaryId === 'general'
        ? (language === 'mr' ? 'सामान्य तपासणी वाइटल्स सुरक्षित जतन झाले!' : language === 'hi' ? 'सामान्य वाइटल्स सुरक्षित सहेजे गए!' : 'General vitals recorded successfully!')
        : t.vitalsSavedToast
    );
    navigate('assessment');
  };

  const isHighBp = (watchedSystolic || 0) >= 140 || (watchedDiastolic || 0) >= 90;
  const hasFever =
    watchedTempUnit === 'F' ? (watchedTemp || 0) >= 99.0 : (watchedTemp || 0) >= 37.2;

  const currentSelectedMother = selectedBeneficiaryId !== 'general'
    ? allBeneficiaries.find((b) => b.id === selectedBeneficiaryId)
    : null;

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-3.5 pb-24">
      {/* General Vitals Screening Header & Beneficiary Selector */}
      <section className="w-full bg-[#e8eeff] rounded-2xl p-4 border border-[#d2daef] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-[#00434c] text-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[24px]">vital_signs</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-[#00434c] leading-tight">
                {language === 'mr' ? 'मातृ आरोग्य सामान्य वाइटल्स तपासणी' : language === 'hi' ? 'मातृ स्वास्थ्य सामान्य वाइटल्स जांच' : 'General Maternal Vitals Checkup'}
              </h2>
              <p className="text-xs text-[#3a6472] mt-0.5">
                {language === 'mr' ? 'गावातील मातांची नियमित वाइटल्स नोंदणी' : language === 'hi' ? 'माताओं की सामान्य वाइटल्स स्क्रीनिंग' : 'General vital signs screening for maternal health'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('patients')}
            className="px-2.5 py-1.5 rounded-xl bg-white/80 hover:bg-white text-[#00434c] text-xs font-bold border border-[#d2daef] flex items-center space-x-1 transition-colors shrink-0"
            title="View All Registered Mothers"
          >
            <span className="material-symbols-outlined text-[16px]">group</span>
            <span className="hidden sm:inline">{language === 'mr' ? 'माता यादी' : language === 'hi' ? 'मरीज सूची' : 'Patients'}</span>
          </button>
        </div>

        {/* Beneficiary Selector Dropdown */}
        <div className="bg-white rounded-xl p-2.5 border border-[#d2daef] space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
            <label htmlFor="beneficiary-select" className="flex items-center space-x-1 text-[#00434c] font-bold">
              <span className="material-symbols-outlined text-[14px]">person_search</span>
              <span>{language === 'mr' ? 'तपासणीसाठी लाभार्थी (ऐच्छिक)' : language === 'hi' ? 'जांच हेतु लाभार्थी (वैकल्पिक)' : 'Select Beneficiary (Optional)'}</span>
            </label>
            <span className="text-[10px] text-slate-500 font-medium">
              {selectedBeneficiaryId === 'general'
                ? (language === 'mr' ? 'सामान्य तपासणी' : language === 'hi' ? 'सामान्य जांच' : 'General Checkup')
                : (language === 'mr' ? 'नोंदणीकृत लाभार्थी' : language === 'hi' ? 'पंजीकृत मरीज' : 'Registered Beneficiary')}
            </span>
          </div>

          <select
            id="beneficiary-select"
            value={selectedBeneficiaryId}
            onChange={(e) => handleBeneficiaryChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:bg-white"
          >
            <option value="general">
              📋 {language === 'mr' ? 'सामान्य तपासणी (कोणतीही लाभार्थी)' : language === 'hi' ? 'सामान्य जांच (कोई भी लाभार्थी)' : 'General Checkup / Any Beneficiary'}
            </option>
            {allBeneficiaries.map((b) => {
              const bName = language === 'mr' ? (b.nameMarathi || b.name) : language === 'hi' ? (b.nameHindi || b.name) : b.name;
              return (
                <option key={b.id} value={b.id}>
                  {bName} — {b.village} ({b.age} {language === 'mr' ? 'वर्षे' : language === 'hi' ? 'वर्ष' : 'y'}) [ID: {b.id}]
                </option>
              );
            })}
          </select>

          {currentSelectedMother && (
            <div className="pt-1 flex items-center justify-between text-[11px] text-slate-600 border-t border-slate-100">
              <span className="font-medium flex items-center space-x-1">
                <span className="material-symbols-outlined text-[13px] text-red-500">location_on</span>
                <span>{currentSelectedMother.village} • {currentSelectedMother.subCenter}</span>
              </span>
              <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                ID: {currentSelectedMother.id}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Stepper Bar */}
      <section className="w-full bg-white rounded-xl p-2.5 shadow-xs border border-[#e0e8fd]">
        <div className="flex items-center justify-between text-xs font-semibold">
          {/* Step 1 */}
          <button
            type="button"
            onClick={() => navigate('patients')}
            className="flex items-center space-x-1 text-emerald-700"
          >
            <span className="material-symbols-outlined text-[15px]">check_circle</span>
            <span className="text-[11px]">{language === 'mr' ? '१ यादी' : language === 'hi' ? '1 सूची' : '1 Directory'}</span>
          </button>
          <span className="text-slate-300">—</span>

          {/* Step 2 */}
          <div className="flex items-center space-x-1 bg-[#00434c] text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs">
            <span className="w-4 h-4 rounded-full bg-[#12b388] text-white flex items-center justify-center text-[10px] font-black">
              2
            </span>
            <span>{t.navVitals}</span>
          </div>
          <span className="text-slate-300">—</span>

          {/* Step 3 */}
          <button
            type="button"
            onClick={() => navigate('assessment')}
            className="flex items-center space-x-1 text-slate-400 hover:text-slate-600"
          >
            <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-600">
              3
            </span>
            <span className="text-[11px]">{language === 'mr' ? 'मूल्यांकन' : language === 'hi' ? 'जांच' : 'Assess'}</span>
          </button>
          <span className="text-slate-300">—</span>

          {/* Step 4 */}
          <button
            type="button"
            onClick={() => navigate('referral')}
            className="flex items-center space-x-1 text-slate-400 hover:text-slate-600"
          >
            <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-600">
              4
            </span>
            <span className="text-[11px]">{language === 'mr' ? 'रेफरल' : language === 'hi' ? 'रेफरल' : 'Referral'}</span>
          </button>
        </div>
      </section>

      {/* Clinical Form Header & Voice Assistant */}
      <div className="bg-white rounded-xl p-2.5 border border-teal-100 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
          <span className="text-xs font-bold text-[#00434c]">
            {t.vitalsScreenTitle}
          </span>
        </div>

        {/* Voice Assistant Input Button */}
        <button
          type="button"
          onClick={startBhashiniVoiceInput}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all shadow-xs ${
            bhashiniVoice.isListening
              ? 'bg-rose-500 text-white animate-pulse'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
          }`}
          title="Voice Input"
        >
          <span className="material-symbols-outlined text-[16px]">
            {bhashiniVoice.isListening ? 'graphic_eq' : 'mic'}
          </span>
          <span>{bhashiniVoice.isListening ? t.bhashiniListening : t.bhashiniVoiceInput}</span>
        </button>
      </div>

      {bhashiniVoice.transcript && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs space-y-1">
          <div className="flex items-center justify-between font-bold text-[10px] text-emerald-800">
            <span>{language === 'mr' ? 'व्हॉईस इनपुट' : language === 'hi' ? 'वॉयस इनपुट' : 'VOICE TRANSCRIPT'}</span>
            <button
              type="button"
              onClick={() => speakVernacular(bhashiniVoice.transcript)}
              className="text-emerald-700 hover:underline flex items-center space-x-0.5"
            >
              <span className="material-symbols-outlined text-[13px]">volume_up</span>
              <span>{language === 'mr' ? 'ऐका' : language === 'hi' ? 'सुनें' : 'Listen'}</span>
            </button>
          </div>
          <p className="font-medium text-[11px] italic">"{bhashiniVoice.transcript}"</p>
        </div>
      )}

      {/* Quick Action Button: Standard Baseline */}
      <div>
        <button
          type="button"
          onClick={handleUseBaseline}
          className="w-full bg-[#e8eeff] hover:bg-[#dbeeff] text-[#00434c] rounded-xl p-2.5 flex items-center justify-center space-x-2 border border-[#d2daef] transition-colors shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px] text-[#0a5c67]">playlist_add_check</span>
          <span className="text-xs font-bold truncate">
            {t.autoFillPrevious}
          </span>
        </button>
      </div>

      {/* Form Submission wrapper */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* 1. Blood Pressure Card */}
        <section className="bg-white rounded-2xl p-4 shadow-xs border border-[#e0e8fd] space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                <span className="material-symbols-outlined text-[22px]">favorite</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#141c2b]">{t.bloodPressure}</h3>
                <p className="text-[11px] text-[#3f484a]">mmHg (Systolic / Diastolic)</p>
              </div>
            </div>

            {isHighBp && (
              <span className="bg-[#ffdad6] text-[#93000a] text-[10px] font-bold px-2 py-1 rounded-lg flex items-center space-x-1 border border-red-200">
                <span className="material-symbols-outlined text-[13px]">warning</span>
                <span>{t.highBpAlert}</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Systolic */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#3f484a]">{t.systolicLabel}</span>
              <div className="relative flex items-center">
                <input
                  type="number"
                  {...register('systolic', { valueAsNumber: true })}
                  className={`w-full h-12 px-3 bg-[#f1f3ff] text-xl font-bold font-mono text-[#00434c] rounded-xl outline-none focus:ring-2 focus:ring-[#00434c] border ${
                    errors.systolic ? 'border-red-500 bg-red-50' : 'border-[#e0e8fd]'
                  }`}
                />
                <span className="absolute right-3 text-xs font-bold text-slate-500 pointer-events-none">
                  mmHg
                </span>
              </div>
              {errors.systolic && (
                <p className="text-[10px] text-red-600 font-bold">{errors.systolic.message}</p>
              )}
            </div>

            {/* Diastolic */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#3f484a]">{t.diastolicLabel}</span>
              <div className="relative flex items-center">
                <input
                  type="number"
                  {...register('diastolic', { valueAsNumber: true })}
                  className={`w-full h-12 px-3 bg-[#f1f3ff] text-xl font-bold font-mono text-[#00434c] rounded-xl outline-none focus:ring-2 focus:ring-[#00434c] border ${
                    errors.diastolic ? 'border-red-500 bg-red-50' : 'border-[#e0e8fd]'
                  }`}
                />
                <span className="absolute right-3 text-xs font-bold text-slate-500 pointer-events-none">
                  mmHg
                </span>
              </div>
              {errors.diastolic && (
                <p className="text-[10px] text-red-600 font-bold">{errors.diastolic.message}</p>
              )}
            </div>
          </div>
        </section>

        {/* 2. Body Temperature */}
        <section className="bg-white rounded-2xl p-4 shadow-xs border border-[#e0e8fd] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0 border border-cyan-100">
                <span className="material-symbols-outlined text-[22px]">device_thermostat</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#141c2b]">{t.temperature}</h3>
                <p className="text-[11px] text-[#3f484a]">°{watchedTempUnit}</p>
              </div>
            </div>

            {/* °F / °C Toggle */}
            <div className="flex items-center bg-[#f1f3ff] p-0.5 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setValue('tempUnit', 'F')}
                className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${
                  watchedTempUnit === 'F' ? 'bg-[#00434c] text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                °F
              </button>
              <button
                type="button"
                onClick={() => setValue('tempUnit', 'C')}
                className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${
                  watchedTempUnit === 'C' ? 'bg-[#00434c] text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                °C
              </button>
            </div>
          </div>

          <div className="relative flex items-center">
            <input
              type="number"
              step="0.1"
              {...register('temperature', { valueAsNumber: true })}
              className={`w-full h-12 px-3 bg-[#f1f3ff] text-xl font-bold font-mono text-[#00434c] rounded-xl outline-none focus:ring-2 focus:ring-[#00434c] border ${
                errors.temperature ? 'border-red-500 bg-red-50' : 'border-[#e0e8fd]'
              }`}
            />
            <span className="absolute right-3 text-xs font-bold text-amber-700 pointer-events-none">
              °{watchedTempUnit} {hasFever ? `(${t.feverAlert})` : `(${language === 'mr' ? 'सामान्य' : language === 'hi' ? 'सामान्य' : 'Normal'})`}
            </span>
          </div>
          {errors.temperature && (
            <p className="text-[10px] text-red-600 font-bold">{errors.temperature.message}</p>
          )}
        </section>

        {/* 3. Pulse Rate */}
        <section className="bg-white rounded-2xl p-4 shadow-xs border border-[#e0e8fd] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 border border-purple-100">
                <span className="material-symbols-outlined text-[22px]">vital_signs</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#141c2b]">{t.pulseRate}</h3>
                <p className="text-[11px] text-[#3f484a]">BPM</p>
              </div>
            </div>

            <span className="bg-[#e0f2f1] text-[#00462f] text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#80cbc4]/40">
              {language === 'mr' ? 'नियमित' : language === 'hi' ? 'सामान्य' : 'Normal'}
            </span>
          </div>

          <div className="relative flex items-center">
            <input
              type="number"
              {...register('pulseRate', { valueAsNumber: true })}
              className={`w-full h-12 px-3 bg-[#f1f3ff] text-xl font-bold font-mono text-[#00434c] rounded-xl outline-none focus:ring-2 focus:ring-[#00434c] border ${
                errors.pulseRate ? 'border-red-500 bg-red-50' : 'border-[#e0e8fd]'
              }`}
            />
            <span className="absolute right-3 text-xs font-bold text-slate-500 pointer-events-none">
              BPM
            </span>
          </div>
          {errors.pulseRate && (
            <p className="text-[10px] text-red-600 font-bold">{errors.pulseRate.message}</p>
          )}
        </section>

        {/* 4. Blood Oxygen (SpO2) */}
        <section className="bg-white rounded-2xl p-4 shadow-xs border border-[#e0e8fd] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-100">
                <span className="material-symbols-outlined text-[22px]">air</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#141c2b]">{t.oxygenSpO2}</h3>
                <p className="text-[11px] text-[#3f484a]">% SpO₂</p>
              </div>
            </div>

            <span className="bg-[#85f8c4] text-[#002114] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              {language === 'mr' ? 'संतृप्त' : language === 'hi' ? 'सामान्य' : 'Optimal'}
            </span>
          </div>

          <div className="relative flex items-center">
            <input
              type="number"
              {...register('spo2', { valueAsNumber: true })}
              className={`w-full h-12 px-3 bg-[#f1f3ff] text-xl font-bold font-mono text-[#00434c] rounded-xl outline-none focus:ring-2 focus:ring-[#00434c] border ${
                errors.spo2 ? 'border-red-500 bg-red-50' : 'border-[#e0e8fd]'
              }`}
            />
            <span className="absolute right-3 text-xs font-bold text-slate-500 pointer-events-none">
              %
            </span>
          </div>
          {errors.spo2 && (
            <p className="text-[10px] text-red-600 font-bold">{errors.spo2.message}</p>
          )}
        </section>

        {/* 5. Body Weight */}
        <section className="bg-white rounded-2xl p-4 shadow-xs border border-[#e0e8fd] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-100">
                <span className="material-symbols-outlined text-[22px]">scale</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#141c2b]">{t.bodyWeight}</h3>
                <p className="text-[11px] text-[#3f484a]">kg</p>
              </div>
            </div>

            <span className="text-[10px] font-bold text-slate-500">
              {language === 'mr' ? 'मागील तपासणीपासून +१.५ किग्रॅ' : language === 'hi' ? 'पिछली जांच से +1.5 किग्रा' : '+1.5 kg from last ANC'}
            </span>
          </div>

          <div className="relative flex items-center">
            <input
              type="number"
              step="0.1"
              {...register('bodyWeight', { valueAsNumber: true })}
              className={`w-full h-12 px-3 bg-[#f1f3ff] text-xl font-bold font-mono text-[#00434c] rounded-xl outline-none focus:ring-2 focus:ring-[#00434c] border ${
                errors.bodyWeight ? 'border-red-500 bg-red-50' : 'border-[#e0e8fd]'
              }`}
            />
            <span className="absolute right-3 text-xs font-bold text-slate-500 pointer-events-none">
              kg
            </span>
          </div>
          {errors.bodyWeight && (
            <p className="text-[10px] text-red-600 font-bold">{errors.bodyWeight.message}</p>
          )}
        </section>

        {/* 6. Random Blood Sugar */}
        <section className="bg-white rounded-2xl p-4 shadow-xs border border-[#e0e8fd] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                <span className="material-symbols-outlined text-[22px]">water_drop</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#141c2b]">{t.bloodSugar}</h3>
                <p className="text-[11px] text-[#3f484a]">mg/dL</p>
              </div>
            </div>

            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
              {language === 'mr' ? 'ऐच्छिक' : language === 'hi' ? 'वैकल्पिक' : 'Optional'}
            </span>
          </div>

          <div className="relative flex items-center">
            <input
              type="number"
              {...register('randomBloodSugar', { valueAsNumber: true })}
              className="w-full h-12 px-3 bg-[#f1f3ff] text-xl font-bold font-mono text-[#00434c] rounded-xl outline-none focus:ring-2 focus:ring-[#00434c] border border-[#e0e8fd]"
            />
            <span className="absolute right-3 text-xs font-bold text-slate-500 pointer-events-none">
              mg/dL
            </span>
          </div>
        </section>

        {/* Clinical Notes */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-[#3f484a]">
            {t.clinicalNotesLabel}
          </span>
          <textarea
            rows={2}
            {...register('clinicalNotes')}
            placeholder={t.clinicalNotesPlaceholder}
            className="w-full p-2.5 bg-white border border-[#e0e8fd] rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#00434c]"
          />
        </div>

        {/* Toast */}
        {toast && (
          <div className="bg-[#293040] text-white text-xs font-medium p-3 rounded-xl shadow-lg animate-in fade-in flex items-center space-x-2">
            <span className="material-symbols-outlined text-emerald-400 text-[18px]">info</span>
            <span>{toast}</span>
          </div>
        )}

        {/* Bottom CTA & Navigation */}
        <div className="space-y-2 pt-2">
          <button
            type="submit"
            className="w-full h-13 bg-[#0a5c67] hover:bg-[#00434c] text-white text-base font-bold rounded-xl flex items-center justify-center space-x-2 shadow-md active:translate-y-0.5 transition-all"
          >
            <span>{t.saveAndAssessBtn}</span>
            <span className="material-symbols-outlined text-[22px]">arrow_forward</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('home')}
            className="w-full py-2 text-xs font-bold text-[#00434c] hover:underline flex items-center justify-center space-x-1"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>{t.back}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
