import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { vitalsFormSchema, VitalsFormValues } from '../schemas/vitalsSchema';
import { useAppStore } from '../store/useAppStore';
import { VitalsData, AppScreen } from '../types';

interface RecordVitalsScreenProps {
  onNavigate?: (screen: AppScreen) => void;
}

export const RecordVitalsScreen: React.FC<RecordVitalsScreenProps> = ({ onNavigate }) => {
  const {
    beneficiary,
    updateBeneficiaryVitals,
    setScreen,
    language,
    startBhashiniVoiceInput,
    bhashiniVoice,
    speakVernacular,
    netInfo,
    syncQueue,
  } = useAppStore();

  const navigate = onNavigate || setScreen;
  const [toast, setToast] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<VitalsFormValues>({
    resolver: zodResolver(vitalsFormSchema),
    defaultValues: {
      systolic: beneficiary.vitals.systolic,
      diastolic: beneficiary.vitals.diastolic,
      temperature: beneficiary.vitals.temperature,
      tempUnit: beneficiary.vitals.tempUnit || 'F',
      pulseRate: beneficiary.vitals.pulseRate,
      spo2: beneficiary.vitals.spo2,
      bodyWeight: beneficiary.vitals.bodyWeight,
      randomBloodSugar: beneficiary.vitals.randomBloodSugar || 110,
      clinicalNotes: '',
    },
  });

  const watchedSystolic = watch('systolic');
  const watchedDiastolic = watch('diastolic');
  const watchedTemp = watch('temperature');
  const watchedTempUnit = watch('tempUnit');

  // Sync external Bhashini voice or beneficiary changes to form
  useEffect(() => {
    setValue('systolic', beneficiary.vitals.systolic);
    setValue('diastolic', beneficiary.vitals.diastolic);
    setValue('temperature', beneficiary.vitals.temperature);
    setValue('pulseRate', beneficiary.vitals.pulseRate);
    setValue('spo2', beneficiary.vitals.spo2);
    setValue('bodyWeight', beneficiary.vitals.bodyWeight);
  }, [beneficiary.vitals, setValue]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleUsePrevious = () => {
    setValue('systolic', 140, { shouldValidate: true, shouldDirty: true });
    setValue('diastolic', 90, { shouldValidate: true, shouldDirty: true });
    setValue('temperature', 98.4, { shouldValidate: true });
    setValue('tempUnit', 'F');
    setValue('pulseRate', 82, { shouldValidate: true });
    setValue('spo2', 98, { shouldValidate: true });
    setValue('bodyWeight', 57.0, { shouldValidate: true });
    showToast('05 Sep की पिछली वाइटल्स रीडिंग भरी गई!');
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
      recordedAt: 'Just now (WatermelonDB)',
    };

    updateBeneficiaryVitals(updated, data.clinicalNotes);
    showToast('वाइटल्स WatermelonDB SQLite मध्ये सुरक्षित जतन झाले!');
    navigate('assessment');
  };

  const isHighBp = (watchedSystolic || 0) >= 140 || (watchedDiastolic || 0) >= 90;
  const hasFever =
    watchedTempUnit === 'F' ? (watchedTemp || 0) >= 99.0 : (watchedTemp || 0) >= 37.2;

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-3.5 pb-24">
      {/* Patient Header Card */}
      <section className="w-full bg-[#e8eeff] rounded-2xl p-3.5 flex items-center justify-between border border-[#d2daef] shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-xl bg-[#00434c] text-white flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">female</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-[#00434c] leading-tight">
                {language === 'mr' || language === 'hi' ? beneficiary.nameHindi : beneficiary.name}
              </h2>
              <span className="text-xs bg-white/70 text-slate-700 font-semibold px-2 py-0.2 rounded-md">
                {beneficiary.age}y/{beneficiary.gender.charAt(0)}
              </span>
            </div>
            <p className="text-xs text-[#3a6472] flex items-center space-x-1 mt-0.5">
              <span className="material-symbols-outlined text-[13px] text-red-500">location_on</span>
              <span>
                {beneficiary.village} • {beneficiary.subCenter}
              </span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('beneficiary')}
          className="w-9 h-9 rounded-xl bg-white/80 hover:bg-white text-[#00434c] flex items-center justify-center border border-[#d2daef] transition-colors"
          title="View ABHA Health Card"
        >
          <span className="material-symbols-outlined text-[20px]">badge</span>
        </button>
      </section>

      {/* Stepper Bar */}
      <section className="w-full bg-white rounded-xl p-2.5 shadow-xs border border-[#e0e8fd]">
        <div className="flex items-center justify-between text-xs font-semibold">
          {/* Step 1 */}
          <button
            type="button"
            onClick={() => navigate('beneficiary')}
            className="flex items-center space-x-1 text-emerald-700"
          >
            <span className="material-symbols-outlined text-[15px]">check_circle</span>
            <span className="text-[11px]">1 Basic Info</span>
          </button>
          <span className="text-slate-300">—</span>

          {/* Step 2 */}
          <div className="flex items-center space-x-1 bg-[#00434c] text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs">
            <span className="w-4 h-4 rounded-full bg-[#12b388] text-white flex items-center justify-center text-[10px] font-black">
              2
            </span>
            <span>Vitals</span>
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
            <span className="text-[11px]">Assess</span>
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
            <span className="text-[11px]">Result</span>
          </button>
        </div>
      </section>

      {/* Tech Stack Banner: React Hook Form + Zod & Bhashini */}
      <div className="bg-white rounded-xl p-2.5 border border-teal-100 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono font-bold bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">
            React Hook Form + Zod
          </span>
          <span className="text-[10px] text-slate-500 font-medium">Validated Form</span>
        </div>

        {/* Bhashini Voice Assistant Input Button */}
        <button
          type="button"
          onClick={startBhashiniVoiceInput}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all shadow-xs ${
            bhashiniVoice.isListening
              ? 'bg-rose-500 text-white animate-pulse'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
          }`}
          title="Bhashini Voice Input (Speak in Marathi/Hindi to record vitals)"
        >
          <span className="material-symbols-outlined text-[16px]">
            {bhashiniVoice.isListening ? 'graphic_eq' : 'mic'}
          </span>
          <span>{bhashiniVoice.isListening ? 'ऐकतोय...' : 'भाषिणी बोला'}</span>
        </button>
      </div>

      {bhashiniVoice.transcript && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs space-y-1">
          <div className="flex items-center justify-between font-bold text-[10px] text-emerald-800">
            <span>BHASHINI SPEECH-TO-TEXT TRANSCRIPT</span>
            <button
              type="button"
              onClick={() => speakVernacular(bhashiniVoice.transcript)}
              className="text-emerald-700 hover:underline flex items-center space-x-0.5"
            >
              <span className="material-symbols-outlined text-[13px]">volume_up</span>
              <span>Listen</span>
            </button>
          </div>
          <p className="font-medium text-[11px] italic">"{bhashiniVoice.transcript}"</p>
        </div>
      )}

      {/* Title & Vernacular Subtitle */}
      <div>
        <h1 className="text-xl font-black text-[#00434c] tracking-tight">Record Vital Signs</h1>
        <p className="text-xs text-[#3f484a] font-medium">
          {language === 'mr'
            ? 'शारीरिक वाइटल्स नोंदवा (रक्तदाब, तापमान व ऑक्सिजन)'
            : 'शारीरिक माप / वाइटल्स जांचें और दर्ज करें'}
        </p>
      </div>

      {/* Quick Action: Use Previous Reading */}
      <button
        type="button"
        onClick={handleUsePrevious}
        className="w-full bg-[#e8eeff] hover:bg-[#dbeeff] text-[#00434c] rounded-xl p-3 flex items-center justify-center space-x-2 border border-[#d2daef] transition-colors shadow-xs"
      >
        <span className="material-symbols-outlined text-[20px] text-[#0a5c67]">history</span>
        <span className="text-xs font-bold truncate">
          Use Previous Reading (05 Sep: 140/90, 98.4°F)
        </span>
      </button>

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
                <h3 className="text-sm font-bold text-[#141c2b]">Blood Pressure</h3>
                <p className="text-[11px] text-[#3f484a]">रक्तचाप (सिस्टोलिक / डायस्टोलिक)</p>
              </div>
            </div>

            {isHighBp && (
              <span className="bg-[#ffdad6] text-[#93000a] text-[10px] font-bold px-2 py-1 rounded-lg flex items-center space-x-1 border border-red-200">
                <span className="material-symbols-outlined text-[13px]">warning</span>
                <span>High BP (उच्च)</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Systolic */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#3f484a]">Systolic (ऊपर का)</span>
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
              <span className="text-[11px] font-bold text-[#3f484a]">Diastolic (नीचे का)</span>
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
                <h3 className="text-sm font-bold text-[#141c2b]">Body Temperature</h3>
                <p className="text-[11px] text-[#3f484a]">शरीर का तापमान</p>
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
              °{watchedTempUnit} {hasFever ? '(हल्का बुखार)' : '(सामान्य)'}
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
                <h3 className="text-sm font-bold text-[#141c2b]">Pulse Rate</h3>
                <p className="text-[11px] text-[#3f484a]">नाड़ी की गति / हृदय दर</p>
              </div>
            </div>

            <span className="bg-[#e0f2f1] text-[#00462f] text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#80cbc4]/40">
              Normal / सामान्य
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
                <h3 className="text-sm font-bold text-[#141c2b]">Blood Oxygen (SpO₂)</h3>
                <p className="text-[11px] text-[#3f484a]">रक्त में ऑक्सीजन स्तर</p>
              </div>
            </div>

            <span className="bg-[#85f8c4] text-[#002114] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              Optimal / सामान्य
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
                <h3 className="text-sm font-bold text-[#141c2b]">Body Weight</h3>
                <p className="text-[11px] text-[#3f484a]">वजन (गर्भावस्था रिकॉर्ड)</p>
              </div>
            </div>

            <span className="text-[10px] font-bold text-slate-500">
              +1.5 kg from last ANC
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
                <h3 className="text-sm font-bold text-[#141c2b]">Random Blood Sugar</h3>
                <p className="text-[11px] text-[#3f484a]">ब्लड शुगर जांच (RBS)</p>
              </div>
            </div>

            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
              Optional
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
            Clinical Notes / ASHA शेरे (Bhashini Voice Transcribed)
          </span>
          <textarea
            rows={2}
            {...register('clinicalNotes')}
            placeholder="उदा. डोकेदुखी आहे, पायावर सूज आहे..."
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
            <span>Next: Risk Assessment (आगे बढ़ें)</span>
            <span className="material-symbols-outlined text-[22px]">arrow_forward</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('beneficiary')}
            className="w-full py-2 text-xs font-bold text-[#00434c] hover:underline flex items-center justify-center space-x-1"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back to Basic Info (पिछला चरण)</span>
          </button>
        </div>
      </form>
    </div>
  );
};
