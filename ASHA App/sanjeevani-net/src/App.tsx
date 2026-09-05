/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAppStore } from './store/useAppStore';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { ScreenSwitcher } from './components/ScreenSwitcher';
import { NetInfoStatusBar } from './components/NetInfoStatusBar';
import { SyncDrawer } from './components/SyncDrawer';
import { TechStackModal } from './components/TechStackModal';
import { TeleconsultModal } from './components/TeleconsultModal';
import { WhatsAppSlipModal } from './components/WhatsAppSlipModal';
import { LoginScreen } from './screens/LoginScreen';
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
      case 'vitals':
        setScreen('beneficiary');
        break;
      case 'assessment':
        setScreen('vitals');
        break;
      case 'referral':
        setScreen('assessment');
        break;
      case 'patients':
        setScreen('beneficiary');
        break;
      case 'beneficiary':
        setScreen('login');
        break;
      default:
        setScreen('beneficiary');
    }
  };

  // Screen Title for Navbar
  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'vitals':
        return language === 'mr' ? 'वाइटल्स नोंदवा' : 'Record Vitals';
      case 'assessment':
        return language === 'mr' ? 'धोका मूल्यांकन (CDSS)' : 'CDSS Risk Assessment';
      case 'beneficiary':
        return language === 'mr' ? 'मातेची माहिती (ABHA)' : 'Beneficiary Details';
      case 'patients':
        return language === 'mr' ? 'सर्व माता यादी' : 'All Beneficiaries';
      case 'referral':
        return undefined; // Uses default brand
      default:
        return undefined;
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] text-[#141c2b] flex flex-col font-sans selection:bg-[#0a5c67] selection:text-white">
      {/* Top Network & Sync Diagnostic Bar (NetInfo + Store-and-Forward + Tech Stack) */}
      <NetInfoStatusBar />

      {/* Screen Switcher Toolbar for reviewing any screen instantly */}
      <ScreenSwitcher
        currentScreen={currentScreen}
        onSelectScreen={(screen) => setScreen(screen)}
      />

      {/* Mobile Android Container Wrapper */}
      <div className="flex-1 w-full max-w-md mx-auto bg-[#f9f9ff] flex flex-col shadow-xl min-h-screen relative">
        {/* Top Navbar */}
        {currentScreen !== 'login' && (
          <Navbar
            currentScreen={currentScreen}
            onNavigate={(screen) => setScreen(screen)}
            title={getScreenTitle()}
            showBack={currentScreen !== 'referral'}
            onBack={handleBack}
          />
        )}

        {/* Offline Alert Banner if offline mode is active */}
        {!netInfo.isConnected && (
          <div className="bg-rose-600 text-white text-xs font-bold text-center py-1.5 px-4 flex items-center justify-center space-x-1.5 shadow-sm">
            <span className="material-symbols-outlined text-[16px]">cloud_off</span>
            <span>
              {language === 'mr'
                ? 'ऑफलाइन मोड: सर्व नोंदी WatermelonDB SQLite मध्ये सुरक्षित आहेत. नेटवर्क आल्यावर आपोआप सिंक होतील.'
                : 'ऑफ़लाइन मोड सक्रिय: सभी रिकॉर्ड WatermelonDB SQLite में सुरक्षित हैं। नेटवर्क आने पर सिंक होंगे।'}
            </span>
          </div>
        )}

        {/* Low-Bandwidth 2G Banner if in 2G EDGE mode */}
        {netInfo.isConnected && netInfo.tier === '2G_EDGE' && (
          <div className="bg-amber-600 text-white text-[11px] font-bold text-center py-1 px-3 flex items-center justify-center space-x-1 shadow-sm">
            <span className="material-symbols-outlined text-[14px]">signal_cellular_alt_1_bar</span>
            <span>ग्रामीण 2G EDGE नेटवर्क (64 kbps): WebRTC कमी-बँडविड्थ मोड सक्रिय.</span>
          </div>
        )}

        {/* Main Screen Router */}
        <main className="flex-1 w-full flex flex-col">
          {currentScreen === 'login' && (
            <LoginScreen onLoginSuccess={() => setScreen('beneficiary')} />
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

      {/* Full Architecture & Tech Stack Modal */}
      <TechStackModal />

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
