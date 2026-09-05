import React, { useState } from 'react';
import { Beneficiary } from '../types';
import { useAppStore } from '../store/useAppStore';

interface TeleconsultModalProps {
  beneficiary?: Beneficiary;
  onClose?: () => void;
}

export const TeleconsultModal: React.FC<TeleconsultModalProps> = ({
  beneficiary: propBeneficiary,
  onClose: propOnClose,
}) => {
  const {
    beneficiary: storeBeneficiary,
    setShowTeleconsultModal,
    webrtcStats,
    toggleLowBandwidthWebRtc,
    netInfo,
  } = useAppStore();

  const beneficiary = propBeneficiary || storeBeneficiary;
  const onClose = propOnClose || (() => setShowTeleconsultModal(false));

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [prescribedAdvice, setPrescribedAdvice] = useState('');
  const [callDuration] = useState('02:45');
  const [showStats, setShowStats] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#002f35] text-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-teal-800 flex flex-col max-h-[92vh]">
        {/* Call Header */}
        <div className="p-3 bg-[#002227] flex items-center justify-between border-b border-teal-900">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <div className="flex flex-col">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                WebRTC Teleconsultation
              </span>
              <span className="text-[9px] text-teal-400 font-mono">
                Peer: MO-Belora • ICE: {webrtcStats.iceConnectionState}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setShowStats(!showStats)}
              className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[10px] font-mono text-teal-200"
              title="Toggle WebRTC Telemetry"
            >
              {webrtcStats.bitrateKbps}k
            </button>
            <span className="text-xs font-mono font-bold bg-white/10 px-2 py-0.5 rounded text-white">
              {callDuration}
            </span>
          </div>
        </div>

        {/* WebRTC Live Telemetry Bar */}
        {showStats && (
          <div className="bg-[#00171a] p-2 text-[10px] font-mono text-teal-300 border-b border-teal-900 flex justify-between">
            <span>Bitrate: {webrtcStats.bitrateKbps} kbps</span>
            <span>Loss: {webrtcStats.packetLossPercent}%</span>
            <span>Latency: {webrtcStats.latencyMs}ms</span>
            <span>{webrtcStats.resolution}</span>
          </div>
        )}

        {/* Low-Bandwidth Mode Banner */}
        <div className="bg-[#00383f] px-3 py-1.5 flex items-center justify-between text-[11px] border-b border-teal-800">
          <span className="flex items-center space-x-1 text-teal-200">
            <span className="material-symbols-outlined text-[14px]">signal_cellular_alt</span>
            <span>Net: {netInfo.tier} ({netInfo.downloadKbps} kbps)</span>
          </span>
          <button
            onClick={toggleLowBandwidthWebRtc}
            className={`px-2 py-0.5 rounded-md font-bold text-[10px] transition-colors ${
              webrtcStats.isAudioOnlyFallback
                ? 'bg-amber-500 text-black font-black'
                : 'bg-teal-700/60 text-white hover:bg-teal-600'
            }`}
          >
            {webrtcStats.isAudioOnlyFallback ? '✓ 2G Audio Fallback' : 'Low-Bandwidth Mode'}
          </button>
        </div>

        {/* Video Stage / Fallback Audio Stage */}
        <div className="relative h-56 bg-slate-900 overflow-hidden flex items-center justify-center">
          {webrtcStats.isAudioOnlyFallback || isVideoOff ? (
            /* Audio-only Low-Bandwidth View */
            <div className="flex flex-col items-center justify-center p-4 text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-600/30 border-2 border-emerald-400 flex items-center justify-center animate-pulse">
                <span className="material-symbols-outlined text-[32px] text-emerald-300">
                  graphic_eq
                </span>
              </div>
              <p className="text-xs font-bold text-white">Low-Bandwidth OPUS Audio Connected</p>
              <p className="text-[10px] text-teal-300">
                Reduced to 48 kbps to prevent call drop in remote rural field
              </p>
            </div>
          ) : (
            /* Video Feed */
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=80"
              alt="Dr. Anita Sharma"
              className="w-full h-full object-cover opacity-90"
            />
          )}

          {/* Doctor Overlay Info */}
          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-lg text-left">
            <p className="text-xs font-bold text-white leading-tight">Dr. Anita Sharma (MBBS, MO)</p>
            <p className="text-[10px] text-teal-300">PHC Belora Emergency Triage</p>
          </div>

          {/* Picture-in-picture: Field ASHA worker */}
          <div className="absolute bottom-2 right-2 w-20 h-24 rounded-xl overflow-hidden border-2 border-white/60 shadow-lg bg-black">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwT-IKN0ovIEoN2cTA6tDjaKvvRKIWdkkv0TZdHXYOijTL5jdVZ9wLR5JrCQJ-2qirbQi3PzDNNeTkQ6GEW_vB9Pa0MlYpbso6WxgXGxSBZHo3poh039gsoJgnJF27-XIRibA9q1X5e9BOzDoupe7KBhuQSVnrH3bMQzsKsrnBxEt9BfEU8xI55fGw7wf-eQ9akhm6JX_t_AiIvot540njhjNMAkWFbFPKNxah09rgK2bUabTLIX9X"
              alt="ASHA Worker"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] text-center text-white py-0.5">
              You (ASHA)
            </span>
          </div>

          {/* Live Vitals Telemetry Chip */}
          <div className="absolute top-2 right-2 bg-red-900/80 backdrop-blur-xs border border-red-500/50 px-2 py-1 rounded-lg text-right">
            <p className="text-[9px] text-red-200 font-bold uppercase">Live Telemetry</p>
            <p className="text-xs font-black text-white font-mono">
              BP: {beneficiary.vitals.systolic}/{beneficiary.vitals.diastolic}
            </p>
          </div>
        </div>

        {/* Doctor Advice / Prescription Panel */}
        <div className="p-3.5 bg-white text-slate-900 space-y-2 overflow-y-auto flex-1">
          <div className="flex items-center space-x-1 text-xs font-bold text-[#00434c]">
            <span className="material-symbols-outlined text-[16px]">clinical_notes</span>
            <span>Dr. Anita's Immediate Clinical Orders:</span>
          </div>

          <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1">
            <p className="font-bold text-red-700">1. Keep beneficiary lying in left lateral position.</p>
            <p>2. Keep oxygen mask ready if SpO2 drops below 95%.</p>
            <p>3. Trauma/eclampsia bed #3 reserved at PHC Belora with IV MgSO4 loaded.</p>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 block">
              Additional Tele-Advice from MO:
            </label>
            <input
              type="text"
              value={prescribedAdvice}
              onChange={(e) => setPrescribedAdvice(e.target.value)}
              placeholder="e.g. Dispatched 108 with paramedic assistance..."
              className="w-full px-3 py-1.5 text-xs bg-slate-100 rounded-lg border border-slate-300 outline-none focus:ring-1 focus:ring-teal-700"
            />
          </div>
        </div>

        {/* In-Call Controls */}
        <div className="p-3.5 bg-[#002227] flex items-center justify-around">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
              isMuted ? 'bg-red-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isMuted ? 'mic_off' : 'mic'}
            </span>
          </button>

          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
              isVideoOff ? 'bg-red-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            title={isVideoOff ? 'Turn on video' : 'Turn off video'}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isVideoOff ? 'videocam_off' : 'videocam'}
            </span>
          </button>

          <button
            onClick={onClose}
            className="w-13 h-11 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full flex items-center justify-center space-x-1 shadow-lg transition-transform active:scale-95"
            title="End Teleconsultation"
          >
            <span className="material-symbols-outlined text-[20px]">call_end</span>
            <span className="text-xs">End</span>
          </button>
        </div>
      </div>
    </div>
  );
};
