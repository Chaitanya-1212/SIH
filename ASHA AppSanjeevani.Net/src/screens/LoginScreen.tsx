import React, { useState, useRef } from 'react';
import { Language } from '../types';
import { useAppStore } from '../store/useAppStore';
import { getTranslation } from '../i18n/translations';

interface LoginScreenProps {
  onLoginSuccess?: () => void;
  language?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  language: propLanguage,
  onLanguageChange,
}) => {
  const {
    language: storeLanguage,
    setLanguage: storeSetLanguage,
    loginWithJwt,
    setScreen,
  } = useAppStore();

  const language = propLanguage || storeLanguage;
  const onLangChange = (lang: Language) => {
    if (onLanguageChange) onLanguageChange(lang);
    storeSetLanguage(lang);
  };
  const handleSuccess = onLoginSuccess || (() => setScreen('beneficiary'));

  const t = getTranslation(language);

  const [workerId, setWorkerId] = useState('MH-ASHA-042');
  const [pin, setPin] = useState(['2', '0', '2', '6']);
  const [isPinVisible, setIsPinVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pinRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-advance
    if (value && index < 3) {
      pinRefs[index + 1].current?.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      pinRefs[index - 1].current?.focus();
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerId.trim()) {
      showToast(language === 'mr' ? 'कृपया मोबाईल नंबर किंवा आशा आयडी टाका' : language === 'hi' ? 'कृपया मोबाइल नंबर या आशा आईडी दर्ज करें' : 'Please enter Mobile Number or ASHA ID');
      return;
    }
    const fullPin = pin.join('');
    if (fullPin.length < 4) {
      showToast(language === 'mr' ? 'कृपया ४ अंकांचा सुरक्षा पिन पूर्ण भरा' : language === 'hi' ? 'कृपया 4 अंकों का सुरक्षा पिन पूरा भरें' : 'Please enter full 4-digit security PIN');
      return;
    }

    setIsSubmitting(true);
    showToast(t.loggingIn);

    const success = await loginWithJwt(workerId, fullPin);
    setIsSubmitting(false);

    if (success) {
      showToast(t.loginSuccess);
      setTimeout(() => {
        handleSuccess();
      }, 500);
    } else {
      showToast(t.loginFailed);
    }
  };

  const handleVoiceAssist = () => {
    setIsVoiceListening(true);
    showToast(language === 'mr' ? 'आवाज ओळख सुरू: "संगीता ताई" बोला किंवा पिन सांगा...' : language === 'hi' ? 'आवाज पहचान सक्रिय: "संगीता ताई" बोलें या अपना पिन बोलें...' : 'Voice Assistant listening: Say your name or PIN...');
    setTimeout(() => {
      setIsVoiceListening(false);
      setWorkerId('9876543210');
      setPin(['1', '2', '3', '4']);
      showToast(language === 'mr' ? 'आवाज ओळख यशस्वी: संगीता कदम (ASHA Khairi)' : language === 'hi' ? 'पहचान सफल: संगीता कदम (ASHA Khairi)' : 'Voice Recognized: Sangeeta Kadam (ASHA Khairi)');
    }, 1800);
  };

  const handleOtpLogin = () => {
    setIsOtpModalOpen(true);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-3.5 pb-20">
      {/* Language Selector Bar */}
      <section aria-label="Language selection" className="w-full bg-[#f1f3ff] rounded-xl p-1.5 shadow-xs border border-[#e0e8fd]">
        <div aria-label="भाषा निवडा / Select Language" className="grid grid-cols-3 gap-1 text-center" role="radiogroup">
          <button
            type="button"
            role="radio"
            aria-checked={language === 'mr'}
            onClick={() => {
              onLangChange('mr');
              showToast('भाषा: मराठी निवडली आहे');
            }}
            className={`flex items-center justify-center space-x-1 py-1.5 px-1 rounded-lg transition-all text-xs font-bold ${
              language === 'mr' ? 'bg-[#00434c] text-white shadow-xs' : 'text-[#141c2b] hover:bg-[#e8eeff]'
            }`}
          >
            <span>मराठी</span>
            {language === 'mr' && <span className="material-symbols-outlined text-[15px]">check_circle</span>}
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={language === 'hi'}
            onClick={() => {
              onLangChange('hi');
              showToast('भाषा: हिन्दी सेट की गई');
            }}
            className={`flex items-center justify-center space-x-1 py-1.5 px-1 rounded-lg transition-all text-xs font-bold ${
              language === 'hi' ? 'bg-[#00434c] text-white shadow-xs' : 'text-[#141c2b] hover:bg-[#e8eeff]'
            }`}
          >
            <span>हिन्दी</span>
            {language === 'hi' && <span className="material-symbols-outlined text-[15px]">check_circle</span>}
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={language === 'en'}
            onClick={() => {
              onLangChange('en');
              showToast('Language: English selected');
            }}
            className={`flex items-center justify-center space-x-1 py-1.5 px-1 rounded-lg transition-all text-xs font-bold ${
              language === 'en' ? 'bg-[#00434c] text-white shadow-xs' : 'text-[#141c2b] hover:bg-[#e8eeff]'
            }`}
          >
            <span>English</span>
            {language === 'en' && <span className="material-symbols-outlined text-[15px]">check_circle</span>}
          </button>
        </div>
      </section>

      {/* Hero Reassurance Card with Emblem Visual */}
      <section className="w-full bg-[#e8eeff] rounded-xl p-3.5 shadow-xs border border-[#d2daef] space-y-2">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-[#0a5c67] flex items-center justify-center shrink-0 shadow-xs text-[#abedfa]">
            <span className="material-symbols-outlined text-[28px]">health_and_safety</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-bold text-[#00434c] uppercase tracking-wider">
              {t.ministry}
            </span>
            <h2 className="text-[20px] font-bold text-[#141c2b] leading-tight truncate">
              {t.loginTitle}
            </h2>
            <span className="text-xs text-[#3f484a]">
              {t.healthMissionSubtitle}
            </span>
          </div>
        </div>
      </section>

      {/* Visual Field Worker Illustration / Warm Photo Framing */}
      <section className="w-full bg-white rounded-xl overflow-hidden shadow-xs border border-[#e0e8fd] flex items-center p-2.5 space-x-3">
        <img
          className="w-20 h-20 rounded-lg object-cover shrink-0"
          alt="Indian female ASHA frontline health worker in clean uniform"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwT-IKN0ovIEoN2cTA6tDjaKvvRKIWdkkv0TZdHXYOijTL5jdVZ9wLR5JrCQJ-2qirbQi3PzDNNeTkQ6GEW_vB9Pa0MlYpbso6WxgXGxSBZHo3poh039gsoJgnJF27-XIRibA9q1X5e9BOzDoupe7KBhuQSVnrH3bMQzsKsrnBxEt9BfEU8xI55fGw7wf-eQ9akhm6JX_t_AiIvot540njhjNMAkWFbFPKNxah09rgK2bUabTLIX9X"
        />
        <div className="flex flex-col justify-center min-w-0 pr-1">
          <p className="text-xs text-[#00434c] font-bold">
            {t.loginWelcome}
          </p>
          <p className="text-xs text-[#3f484a] line-clamp-2 mt-0.5">
            {t.loginInstruction}
          </p>
        </div>
      </section>

      {/* Interactive Form Section */}
      <form onSubmit={handleLogin} className="w-full bg-white rounded-xl p-4 shadow-xs border border-[#e0e8fd] space-y-3.5">
        {/* Input 1: Worker ID / Mobile */}
        <div className="flex flex-col space-y-1">
          <label className="text-xs font-bold text-[#141c2b] flex items-center justify-between" htmlFor="workerIdInput">
            <span>{t.workerIdLabel}</span>
            <span className="text-[11px] font-medium text-[#3a6472]">Mobile / ASHA ID</span>
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3 flex items-center pointer-events-none text-[#3a6472]">
              <span className="material-symbols-outlined text-[20px]">badge</span>
            </div>
            <input
              id="workerIdInput"
              type="text"
              value={workerId}
              onChange={(e) => setWorkerId(e.target.value)}
              placeholder={t.workerIdPlaceholder}
              className="w-full h-11 pl-10 pr-3 bg-[#f1f3ff] text-[#141c2b] text-sm font-medium rounded-lg outline-none focus:ring-2 focus:ring-[#00434c] transition-all"
              required
            />
          </div>
        </div>

        {/* Input 2: 4-Digit Security PIN */}
        <div className="flex flex-col space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#141c2b] flex items-center space-x-1">
              <span>{t.pinLabel}</span>
            </label>
            <button
              type="button"
              onClick={() => showToast(language === 'mr' ? 'मदत संदेश नोंदणीकृत मोबाईलवर पाठवला आहे...' : language === 'hi' ? 'सहायता संदेश पंजीकृत मोबाइल पर भेजा गया...' : 'Help SMS sent to registered mobile...')}
              className="text-xs font-semibold text-[#00434c] underline underline-offset-2 hover:opacity-80"
            >
              {t.forgotPin}
            </button>
          </div>

          {/* PIN Digits Container */}
          <div className="grid grid-cols-4 gap-2.5 pt-1">
            {pin.map((digit, idx) => (
              <input
                key={idx}
                ref={pinRefs[idx]}
                id={`pin-${idx + 1}`}
                type={isPinVisible ? 'text' : 'password'}
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handlePinChange(idx, e.target.value)}
                onKeyDown={(e) => handlePinKeyDown(idx, e)}
                className="w-full h-13 text-center text-xl font-bold bg-[#f1f3ff] text-[#00434c] rounded-xl outline-none focus:ring-2 focus:ring-[#00434c] transition-all border border-[#bfc8ca]/40"
              />
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-[#3f484a] flex items-center space-x-1">
              <span className="material-symbols-outlined text-[15px] text-[#00434c]">lock</span>
              <span>{t.localDataEncrypted}</span>
            </span>
            <button
              type="button"
              onClick={() => setIsPinVisible(!isPinVisible)}
              className="text-xs font-semibold text-[#3a6472] flex items-center space-x-1 hover:text-[#00434c]"
            >
              <span className="material-symbols-outlined text-[16px]">
                {isPinVisible ? 'visibility_off' : 'visibility'}
              </span>
              <span>{isPinVisible ? (language === 'mr' ? 'लपवा' : language === 'hi' ? 'छिपाएं' : 'Hide') : (language === 'mr' ? 'पिन पहा' : language === 'hi' ? 'पिन देखें' : 'Show')}</span>
            </button>
          </div>
        </div>

        {/* Primary Login Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-[#0a5c67] hover:bg-[#00434c] text-white text-base font-bold rounded-xl flex items-center justify-center space-x-2 shadow-md active:translate-y-0.5 transition-transform"
        >
          <span>
            {isSubmitting ? t.loggingIn : t.loginButton}
          </span>
          <span className="material-symbols-outlined text-[20px]">
            {isSubmitting ? 'sync' : 'login'}
          </span>
        </button>
      </form>

      {/* Alternative Frictionless Access & Voice Login */}
      <section className="grid grid-cols-2 gap-2.5">
        {/* OTP Login Tile */}
        <button
          type="button"
          onClick={handleOtpLogin}
          className="w-full bg-white p-3 rounded-xl flex flex-col items-center text-center space-y-1.5 shadow-xs border border-[#e0e8fd] hover:bg-[#f1f3ff] transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-[#bbe7f7] text-[#00434c] flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">sms</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#141c2b]">
              {t.otpLogin}
            </span>
            <span className="text-[10px] text-[#3f484a]">SMS OTP</span>
          </div>
        </button>

        {/* Voice Assist Login Tile */}
        <button
          type="button"
          onClick={handleVoiceAssist}
          className={`w-full bg-white p-3 rounded-xl flex flex-col items-center text-center space-y-1.5 shadow-xs border transition-colors ${
            isVoiceListening ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-400' : 'border-[#e0e8fd] hover:bg-[#f1f3ff]'
          }`}
        >
          <div className={`w-10 h-10 rounded-full text-white flex items-center justify-center ${isVoiceListening ? 'bg-red-600 animate-pulse' : 'bg-[#006042]'}`}>
            <span className="material-symbols-outlined text-[20px]">mic</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#141c2b]">
              {isVoiceListening
                ? t.bhashiniListening
                : language === 'mr'
                ? 'बोलून लॉगिन'
                : language === 'hi'
                ? 'बोलकर लॉगिन करें'
                : 'Voice Login'}
            </span>
            <span className="text-[10px] text-[#3f484a]">{language === 'mr' ? 'आवाज सहाय्यक' : language === 'hi' ? 'आवाज सहायक' : 'Voice Assist'}</span>
          </div>
        </button>
      </section>

      {/* Quick Feedback Toast Banner */}
      {toastMessage && (
        <div className="w-full bg-[#293040] text-white rounded-xl p-3 flex items-center space-x-2.5 shadow-lg animate-in fade-in slide-in-from-bottom-2">
          <span className="material-symbols-outlined text-[#85f8c4] text-[22px]">info</span>
          <p className="text-xs font-medium min-w-0 truncate">{toastMessage}</p>
        </div>
      )}

      {/* National Healthcare Mission Official Footer */}
      <footer className="w-full pt-1 space-y-1.5 text-center">
        <div className="flex items-center justify-center space-x-1.5 text-[#3f484a] text-xs">
          <span className="material-symbols-outlined text-[16px] text-[#00434c]">support_agent</span>
          <span>
            {language === 'mr' ? 'आशा हेल्पलाईन टोल-फ्री:' : language === 'hi' ? 'आशा हेल्पलाइन टोल-फ्री:' : 'ASHA Helpline Toll-Free:'} <strong className="text-[#00434c] font-bold">104</strong> / <strong className="text-[#00434c] font-bold">1075</strong>
          </span>
        </div>
        <p className="text-[11px] text-[#3f484a]">
          {t.loginGovtFooter}
        </p>
      </footer>

      {/* OTP Login Modal */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-4 border border-slate-100 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#00434c]">
                {language === 'mr' ? 'ओटीपीने प्रवेश' : language === 'hi' ? 'ओटीपी द्वारा प्रवेश' : 'OTP Verification'}
              </h3>
              <button
                onClick={() => setIsOtpModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-600">
              {language === 'mr'
                ? 'तुमच्या नोंदणीकृत मोबाईल +91 ••••• ••412 वर ६ अंकी ओटीपी पाठवला आहे.'
                : language === 'hi'
                ? 'आपके पंजीकृत मोबाइल +91 ••••• ••412 पर 6-अंकीय ओटीपी भेजा गया है।'
                : 'A 6-digit OTP has been sent to your registered mobile +91 ••••• ••412.'}
            </p>
            <div className="flex justify-center space-x-2">
              {['5', '8', '2', '9', '1', '4'].map((d, i) => (
                <div key={i} className="w-10 h-12 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-lg text-[#00434c]">
                  {d}
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                setIsOtpModalOpen(false);
                showToast(t.loginSuccess);
                setTimeout(() => handleSuccess(), 600);
              }}
              className="w-full py-2.5 bg-[#0a5c67] text-white font-bold rounded-xl text-sm shadow-md"
            >
              {language === 'mr' ? 'ओटीपी सत्यापित करा (Verify & Continue)' : language === 'hi' ? 'ओटीपी सत्यापित करें (Verify & Continue)' : 'Verify & Continue'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
