import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { watermelonDb } from '../services/watermelonDb';

export const SyncDrawer: React.FC = () => {
  const {
    showSyncDrawer,
    setShowSyncDrawer,
    syncQueue,
    isSyncing,
    syncSuccessMessage,
    triggerStoreAndForwardSync,
    netInfo,
    language,
  } = useAppStore();

  if (!showSyncDrawer) return null;

  const auditLogs = watermelonDb.getAuditLogs();

  const labels = {
    mr: {
      title: 'आरोग्य डेटा सिंक',
      subtitle: 'स्थानिक मोबाइल ↔ केंद्रीय आरोग्य प्रणाली',
      channel: 'डेटा कनेक्टिव्हिटी',
      online: 'ऑनलाइन (सक्रिय)',
      offline: 'ऑफलाइन मोड',
      device: 'स्थानिक डिव्हाइस',
      deviceSub: 'आशा मोबाईल (सुरक्षित)',
      gateway: 'डेटा गेटवे',
      gatewaySub: 'सुरक्षित ट्रान्सफर',
      server: 'केंद्रीय सर्व्हर',
      serverSub: 'आरोग्य मिशन',
      pendingTitle: 'सिंक बाकी असलेल्या नोंदी',
      pendingQueue: 'प्रलंबित रांग',
      allSynced: 'सर्व नोंदी सिंक झाल्या आहेत!',
      allSyncedSub: 'स्थानिक डेटा केंद्रीय आरोग्य प्रणालीशी अद्ययावत आहे.',
      history: 'सिंक इतिहास व नोंदी',
      syncing: 'केंद्रीय सर्व्हरवर सिंक होत आहे...',
      syncedAll: 'सर्व डेटा सिंक आहे (कोणतीही नोंद प्रलंबित नाही)',
      syncBtn: 'प्रलंबित नोंदी सिंक करा',
      successTag: 'यशस्वी',
      localTag: 'स्थानिक',
      records: 'नोंदी',
      time: 'वेळ',
    },
    hi: {
      title: 'स्वास्थ्य डेटा सिंक',
      subtitle: 'स्थानीय मोबाइल ↔ केंद्रीय स्वास्थ्य प्रणाली',
      channel: 'डेटा कनेक्टिविटी',
      online: 'ऑनलाइन (सक्रिय)',
      offline: 'ऑफलाइन मोड',
      device: 'स्थानीय डिवाइस',
      deviceSub: 'आशा मोबाइल (सुरक्षित)',
      gateway: 'डेटा गेटवे',
      gatewaySub: 'सुरक्षित ट्रांसफर',
      server: 'केंद्रीय सर्वर',
      serverSub: 'स्वास्थ्य मिशन',
      pendingTitle: 'सिंक बाकी रिकॉर्ड्स',
      pendingQueue: 'लंबित कतार',
      allSynced: 'सभी रिकॉर्ड सिंक हो चुके हैं!',
      allSyncedSub: 'स्थानीय डेटा केंद्रीय स्वास्थ्य सर्वर के साथ अपडेट है।',
      history: 'सिंक इतिहास व लॉग्स',
      syncing: 'केंद्रीय सर्वर पर सिंक हो रहा है...',
      syncedAll: 'सभी डेटा सिंक है (कोई लंबित रिकॉर्ड नहीं)',
      syncBtn: 'लंबित रिकॉर्ड्स सिंक करें',
      successTag: 'सफल',
      localTag: 'स्थानीय',
      records: 'रिकॉर्ड्स',
      time: 'समय',
    },
    en: {
      title: 'Health Data Sync',
      subtitle: 'Local Device ↔ Central Health System',
      channel: 'Data Connectivity',
      online: 'Online (Active)',
      offline: 'Offline Mode',
      device: 'Local Device',
      deviceSub: 'ASHA Mobile (Secure)',
      gateway: 'Data Transfer',
      gatewaySub: 'Encrypted Transmission',
      server: 'Central Server',
      serverSub: 'Health Registry',
      pendingTitle: 'Pending Sync Records',
      pendingQueue: 'Queue',
      allSynced: 'All Records Synced!',
      allSyncedSub: 'Local data is fully up to date with central health registry.',
      history: 'Sync History',
      syncing: 'Syncing with central server...',
      syncedAll: 'All data synced (No pending records)',
      syncBtn: 'Sync Pending Records',
      successTag: 'Success',
      localTag: 'Local',
      records: 'records',
      time: 'time',
    },
  }[language] || {
    title: 'Health Data Sync',
    subtitle: 'Local Device ↔ Central Health System',
    channel: 'Data Connectivity',
    online: 'Online (Active)',
    offline: 'Offline Mode',
    device: 'Local Device',
    deviceSub: 'ASHA Mobile (Secure)',
    gateway: 'Data Transfer',
    gatewaySub: 'Encrypted Transmission',
    server: 'Central Server',
    serverSub: 'Health Registry',
    pendingTitle: 'Pending Sync Records',
    pendingQueue: 'Queue',
    allSynced: 'All Records Synced!',
    allSyncedSub: 'Local data is fully up to date with central health registry.',
    history: 'Sync History',
    syncing: 'Syncing with central server...',
    syncedAll: 'All data synced (No pending records)',
    syncBtn: 'Sync Pending Records',
    successTag: 'Success',
    localTag: 'Local',
    records: 'records',
    time: 'time',
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-[#00434c] text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#12b388] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">sync</span>
            </div>
            <div>
              <h3 className="text-sm font-bold leading-tight">{labels.title}</h3>
              <p className="text-[10px] text-teal-200">{labels.subtitle}</p>
            </div>
          </div>
          <button
            onClick={() => setShowSyncDrawer(false)}
            className="w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center text-xs hover:bg-white/30"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 text-slate-800 text-xs flex-1">
          {/* Architecture Pill */}
          <div className="bg-[#f1f3ff] rounded-2xl p-3 border border-[#e0e8fd] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#00434c] uppercase text-[10px] tracking-wider">
                {labels.channel}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                netInfo.isConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}>
                {netInfo.isConnected ? labels.online : labels.offline}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] pt-1">
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-500 block">{labels.device}</span>
                <span className="font-bold text-[#00434c] truncate block">{labels.deviceSub.split(' ')[0]}</span>
                <span className="text-[9px] text-emerald-600 font-semibold block">{language === 'mr' ? 'सुरक्षित' : language === 'hi' ? 'सुरक्षित' : 'Secure'}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-500 block">{labels.gateway}</span>
                <span className="font-bold text-teal-700 truncate block">{labels.gatewaySub.split(' ')[0]}</span>
                <span className="text-[9px] text-teal-600 font-semibold block">{language === 'mr' ? 'कनेक्टेड' : language === 'hi' ? 'कनेक्टेड' : 'Connected'}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-500 block">{labels.server}</span>
                <span className="font-bold text-blue-700 truncate block">{labels.serverSub.split(' ')[0]}</span>
                <span className="text-[9px] text-blue-600 font-semibold block">{language === 'mr' ? 'आरोग्य पोर्टल' : language === 'hi' ? 'स्वास्थ्य पोर्टल' : 'Portal'}</span>
              </div>
            </div>
          </div>

          {/* Pending Sync Queue */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-[#141c2b] flex items-center space-x-1.5">
                <span className="material-symbols-outlined text-[16px] text-amber-600">queue</span>
                <span>{labels.pendingTitle} ({syncQueue.length})</span>
              </h4>
              <span className="text-[10px] text-slate-500">{labels.pendingQueue}</span>
            </div>

            {syncQueue.length === 0 ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center text-emerald-800">
                <span className="material-symbols-outlined text-[24px] text-emerald-600 block mb-1">check_circle</span>
                <p className="font-bold text-xs">{labels.allSynced}</p>
                <p className="text-[10px] text-emerald-700 mt-0.5">{labels.allSyncedSub}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {syncQueue.map((item) => (
                  <div key={item.id} className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded">
                        {item.table === 'vitals' ? 'Vitals' : item.table === 'referrals' ? 'Referral' : item.table === 'beneficiaries' ? 'Beneficiary' : 'Assessment'}
                      </span>
                      <span className="text-slate-500">{new Date(item.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200 text-[11px] text-slate-700">
                      <p className="font-semibold text-slate-800">
                        {item.table === 'vitals' ? (language === 'mr' ? 'वाइटल्स तपासणी नोंद' : language === 'hi' ? 'वाइटल्स जांच रिकॉर्ड' : 'Vitals Check Record') : item.table === 'referrals' ? (language === 'mr' ? 'रेफरल नोंदणी' : language === 'hi' ? 'रेफरल पंजीकरण' : 'Referral Entry') : (language === 'mr' ? 'रुग्ण नोंदणी' : language === 'hi' ? 'मरीज पंजीकरण' : 'Beneficiary Registration')}
                      </p>
                      <p className="text-[10px] text-slate-500">ID: {(item.payload as Record<string, unknown>)?.beneficiaryId as string || item.id}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sync Success Notification */}
          {syncSuccessMessage && (
            <div className="p-2.5 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center space-x-1.5">
              <span className="material-symbols-outlined text-[16px] text-emerald-700">task_alt</span>
              <span>{syncSuccessMessage}</span>
            </div>
          )}

          {/* Sync Audit History */}
          <div className="space-y-2 pt-1">
            <h4 className="font-bold text-[#141c2b] flex items-center space-x-1.5">
              <span className="material-symbols-outlined text-[16px] text-blue-600">history_edu</span>
              <span>{labels.history}</span>
            </h4>

            <div className="space-y-1.5">
              {auditLogs.map((log) => (
                <div key={log.id} className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-[11px] flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800 leading-tight">
                      {log.status === 'SUCCESS' ? 'EMR Registry Update' : 'Offline Persist'}
                    </p>
                    <p className="text-[9px] text-slate-500 mt-0.5">
                      {log.batchSize} {labels.records} • {labels.time}: {log.durationMs}ms
                    </p>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                    log.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {log.status === 'SUCCESS' ? labels.successTag : labels.localTag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 space-y-2">
          <button
            type="button"
            disabled={isSyncing || syncQueue.length === 0}
            onClick={triggerStoreAndForwardSync}
            className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-md transition-all ${
              syncQueue.length === 0
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-[#00434c] hover:bg-[#0a5c67] text-white active:scale-98'
            }`}
          >
            <span className={`material-symbols-outlined text-[18px] ${isSyncing ? 'animate-spin' : ''}`}>
              sync
            </span>
            <span>
              {isSyncing
                ? labels.syncing
                : syncQueue.length === 0
                ? labels.syncedAll
                : `${labels.syncBtn} (${syncQueue.length})`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
