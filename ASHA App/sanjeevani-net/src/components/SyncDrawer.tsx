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
  } = useAppStore();

  if (!showSyncDrawer) return null;

  const auditLogs = watermelonDb.getAuditLogs();

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
              <h3 className="text-sm font-bold leading-tight">Store-and-Forward Sync Engine</h3>
              <p className="text-[10px] text-teal-200">WatermelonDB (SQLite) ↔ Django REST ↔ PostgreSQL</p>
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
                Active Architecture Pipeline
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                netInfo.isConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}>
                NetInfo: {netInfo.tier} ({netInfo.isConnected ? 'Connected' : 'Disconnected'})
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] pt-1">
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-500 block">LOCAL DB</span>
                <span className="font-mono font-black text-[#00434c]">WatermelonDB</span>
                <span className="text-[9px] text-slate-400 block">SQLite / IndexedDB</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-500 block">BACKEND API</span>
                <span className="font-mono font-black text-amber-700">Django REST</span>
                <span className="text-[9px] text-slate-400 block">JWT Bearer Auth</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-500 block">SERVER DB</span>
                <span className="font-mono font-black text-blue-700">PostgreSQL</span>
                <span className="text-[9px] text-slate-400 block">Central EMR Cloud</span>
              </div>
            </div>
          </div>

          {/* Pending Sync Queue */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-[#141c2b] flex items-center space-x-1.5">
                <span className="material-symbols-outlined text-[16px] text-amber-600">queue</span>
                <span>Pending Offline Queue ({syncQueue.length})</span>
              </h4>
              <span className="text-[10px] text-slate-500 font-mono">Table: sync_queue</span>
            </div>

            {syncQueue.length === 0 ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center text-emerald-800">
                <span className="material-symbols-outlined text-[24px] text-emerald-600 block mb-1">check_circle</span>
                <p className="font-bold text-xs">All records are synchronized!</p>
                <p className="text-[10px] text-emerald-700 mt-0.5">WatermelonDB SQLite database is up-to-date with PostgreSQL.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {syncQueue.map((item) => (
                  <div key={item.id} className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 space-y-1">
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded">
                        {item.action} • {item.table}
                      </span>
                      <span className="text-slate-500">{new Date(item.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <pre className="bg-white p-2 rounded border border-slate-200 text-[10px] overflow-x-auto text-slate-700 font-mono">
                      {JSON.stringify(item.payload, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sync Success / Error Notification */}
          {syncSuccessMessage && (
            <div className="p-2.5 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center space-x-1.5">
              <span className="material-symbols-outlined text-[16px] text-emerald-700">task_alt</span>
              <span>{syncSuccessMessage}</span>
            </div>
          )}

          {/* Sync Audit History (PostgreSQL Commit Logs) */}
          <div className="space-y-2 pt-1">
            <h4 className="font-bold text-[#141c2b] flex items-center space-x-1.5">
              <span className="material-symbols-outlined text-[16px] text-blue-600">history_edu</span>
              <span>PostgreSQL EMR Commit Audit Logs</span>
            </h4>

            <div className="space-y-1.5">
              {auditLogs.map((log) => (
                <div key={log.id} className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-[11px] flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800 leading-tight">
                      {log.endpoint}
                    </p>
                    <p className="text-[9px] text-slate-500 font-mono mt-0.5">
                      {log.serverDatabase} • {log.batchSize} records • {log.durationMs}ms
                    </p>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                    log.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {log.status}
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
                ? 'Uploading to Django REST Framework...'
                : syncQueue.length === 0
                ? 'Database Synchronized (No Pending Items)'
                : `Upload ${syncQueue.length} Pending Records to PostgreSQL`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
