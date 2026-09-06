/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAppStore } from './store/useAppStore';
import { getTranslation } from './i18n/translations';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { SyncDrawer } from './components/SyncDrawer';
import { TeleconsultModal } from './components/TeleconsultModal';
import { WhatsAppSlipModal } from './components/WhatsAppSlipModal';
import { LoginScreen } from './screens/LoginScreen';
import { HomeScreen } from './screens/HomeScreen';
import { BeneficiaryDetailsScreen } from './screens/BeneficiaryDetailsScreen';
import { RecordVitalsScreen } from './screens/RecordVitalsScreen';
import { RiskAssessmentScreen } from './screens/RiskAssessmentScreen';
import { ReferralTrackingScreen } from './screens/ReferralTrackingScreen';
import { PatientsListScreen } from './screens/PatientsListScreen';

export default function App() {
  const {
    currentScreen,
    setScreen,
    beneficiary,
    setBeneficiary,
    netInfo,
    showTeleconsultModal,
    setShowTeleconsultModal,
    showWhatsAppModal,
    setShowWhatsAppModal,
    language,
  } = useAppStore();

  // Back navigation logic
  const handleBack = () => {
    switch (currentScreen) {
      case 'beneficiary':
        setScreen('home');
        break;
      case 'vitals':
        setScreen('home');
        break;
      case 'assessment':
        setScreen('vitals');
        break;
      case 'referral':
        setScreen('assessment');
        break;
      case 'patients':
        setScreen('home');
        break;
      case 'home':
        setScreen('login');
        break;
      default:
        setScreen('home');
    }
  };

  const t = getTranslation(language);

  // Screen Title for Navbar
  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'home':
        return t.titleHome;
      case 'vitals':
        return t.titleVitals;
      case 'assessment':
        return t.titleAssessment;
      case 'beneficiary':
        return t.titleBeneficiary;
      case 'patients':
        return t.titlePatients;
      case 'referral':
        return t.titleReferral;
      default:
        return undefined;
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] text-[#141c2b] flex flex-col font-sans selection:bg-[#0a5c67] selection:text-white">
      {/* Mobile Android Container Wrapper */}
      <div className="flex-1 w-full max-w-md sm:max-w-lg mx-auto bg-[#f9f9ff] flex flex-col shadow-xl min-h-screen relative">
        {/* Top Navbar */}
        {currentScreen !== 'login' && (
          <Navbar
            currentScreen={currentScreen}
            onNavigate={(screen) => setScreen(screen)}
            title={getScreenTitle()}
            showBack={currentScreen !== 'home' && currentScreen !== 'referral'}
            onBack={handleBack}
          />
        )}

        {/* Offline Alert Banner if offline mode is active */}
        {!netInfo.isConnected && (
          <div className="bg-rose-600 text-white text-xs font-bold text-center py-1.5 px-4 flex items-center justify-center space-x-1.5 shadow-sm">
            <span className="material-symbols-outlined text-[16px]">cloud_off</span>
            <span>{t.offlineBanner}</span>
          </div>
        )}

        {/* Low-Bandwidth 2G Banner if in 2G EDGE mode */}
        {netInfo.isConnected && netInfo.tier === '2G_EDGE' && (
          <div className="bg-amber-600 text-white text-[11px] font-bold text-center py-1 px-3 flex items-center justify-center space-x-1 shadow-sm">
            <span className="material-symbols-outlined text-[14px]">signal_cellular_alt_1_bar</span>
            <span>{t.lowBandwidthBanner}</span>
          </div>
        )}

        {/* Main Screen Router */}
        <main className="flex-1 w-full flex flex-col">
          {currentScreen === 'login' && (
            <LoginScreen onLoginSuccess={() => setScreen('home')} />
          )}

          {currentScreen === 'home' && (
            <HomeScreen onNavigate={setScreen} />
          )}

          {currentScreen === 'beneficiary' && (
            <BeneficiaryDetailsScreen
              beneficiary={beneficiary}
              onNavigate={setScreen}
              onOpenTeleconsult={() => setShowTeleconsultModal(true)}
            />
          )}

          {currentScreen === 'vitals' && (
            <RecordVitalsScreen onNavigate={setScreen} />
          )}

          {currentScreen === 'assessment' && (
            <RiskAssessmentScreen
              beneficiary={beneficiary}
              onNavigate={setScreen}
              onOpenTeleconsult={() => setShowTeleconsultModal(true)}
            />
          )}

          {currentScreen === 'referral' && (
            <ReferralTrackingScreen
              beneficiary={beneficiary}
              onNavigate={setScreen}
              onOpenTeleconsult={() => setShowTeleconsultModal(true)}
              onOpenWhatsAppSlip={() => setShowWhatsAppModal(true)}
            />
          )}

          {currentScreen === 'patients' && (
            <PatientsListScreen
              onSelectBeneficiary={(p) => setBeneficiary(p)}
              onNavigate={setScreen}
            />
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav
          currentScreen={currentScreen}
          onNavigate={setScreen}
          pendingFollowUps={4}
        />
      </div>

      {/* Store-and-Forward Sync Engine Drawer */}
      <SyncDrawer />

      {/* WebRTC Low-Bandwidth Teleconsultation Video Modal */}
      {showTeleconsultModal && (
        <TeleconsultModal
          beneficiary={beneficiary}
          onClose={() => setShowTeleconsultModal(false)}
        />
      )}

      {/* WhatsApp Referral Slip Modal */}
      {showWhatsAppModal && (
        <WhatsAppSlipModal
          beneficiary={beneficiary}
          onClose={() => setShowWhatsAppModal(false)}
        />
      )}
    </div>
  );
}
