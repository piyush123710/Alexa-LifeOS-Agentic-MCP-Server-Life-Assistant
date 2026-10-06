import React from 'react';
import { Mic, MicOff, Volume2, VolumeX, Sparkles, ShieldAlert } from 'lucide-react';

export type EchoState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'confirmation';

interface EchoDeviceProps {
  state: EchoState;
  isListening: boolean;
  isMuted: boolean;
  onToggleListen: () => void;
  onToggleMute: () => void;
  activeQuery?: string;
}

export const EchoDevice: React.FC<EchoDeviceProps> = ({
  state,
  isListening,
  isMuted,
  onToggleListen,
  onToggleMute,
  activeQuery
}) => {
  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-md overflow-hidden">
      {/* Background ambient light reflection */}
      <div
        className={`absolute -top-16 w-72 h-72 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
          state === 'listening'
            ? 'bg-cyan-500/25 scale-125'
            : state === 'thinking'
            ? 'bg-blue-600/30 scale-125 animate-pulse'
            : state === 'speaking'
            ? 'bg-teal-400/25 scale-110'
            : state === 'confirmation'
            ? 'bg-amber-500/30 scale-125 animate-ping'
            : 'bg-cyan-900/10 scale-90'
        }`}
      />

      {/* Device Speaker Enclosure */}
      <div className="relative flex flex-col items-center">
        {/* The LED Light Ring (Top of Echo device) */}
        <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full flex items-center justify-center p-1.5 transition-all duration-500">
          {/* Animated Glow Halo */}
          <div
            className={`absolute inset-0 rounded-full transition-all duration-500 ${
              state === 'listening'
                ? 'bg-gradient-to-tr from-cyan-400 via-blue-500 to-cyan-300 animate-spin blur-[2px] shadow-[0_0_35px_rgba(6,182,212,0.8)]'
                : state === 'thinking'
                ? 'bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600 animate-spin blur-[3px] shadow-[0_0_40px_rgba(59,130,246,0.9)]'
                : state === 'speaking'
                ? 'bg-gradient-to-r from-teal-400 via-cyan-300 to-blue-500 animate-pulse blur-[2px] shadow-[0_0_30px_rgba(20,184,166,0.8)]'
                : state === 'confirmation'
                ? 'bg-gradient-to-tr from-amber-500 via-orange-400 to-yellow-400 animate-pulse blur-[3px] shadow-[0_0_45px_rgba(245,158,11,0.9)]'
                : 'bg-slate-800 shadow-[0_0_10px_rgba(15,23,42,0.5)] border border-cyan-900/40'
            }`}
            style={{ animationDuration: state === 'thinking' ? '1.2s' : '3s' }}
          />

          {/* Device Core / Speaker Top Surface */}
          <div className="relative w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center border border-slate-700/60 z-10 shadow-inner group cursor-pointer"
               onClick={onToggleListen}
               title="Click to talk with Alexa+">
            
            {/* Center Status Icon */}
            <div className="flex flex-col items-center gap-1">
              {state === 'confirmation' ? (
                <ShieldAlert className="w-9 h-9 text-amber-400 animate-bounce" />
              ) : state === 'thinking' ? (
                <Sparkles className="w-9 h-9 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
              ) : (
                <Mic className={`w-9 h-9 transition-colors ${
                  isListening ? 'text-cyan-400 scale-110' : 'text-slate-400 group-hover:text-cyan-300'
                }`} />
              )}

              {/* Status Pill */}
              <span className={`text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full transition-colors ${
                state === 'listening'
                  ? 'text-cyan-300 bg-cyan-950/80 border border-cyan-500/50'
                  : state === 'thinking'
                  ? 'text-blue-300 bg-blue-950/80 border border-blue-500/50'
                  : state === 'speaking'
                  ? 'text-teal-300 bg-teal-950/80 border border-teal-500/50'
                  : state === 'confirmation'
                  ? 'text-amber-300 bg-amber-950/80 border border-amber-500/50'
                  : 'text-slate-400 bg-slate-900 border border-slate-800'
              }`}>
                {state === 'idle' && 'Tap to Speak'}
                {state === 'listening' && 'Listening...'}
                {state === 'thinking' && 'MCP Agent...'}
                {state === 'speaking' && 'Speaking'}
                {state === 'confirmation' && 'Confirm?'}
              </span>
            </div>

            {/* Simulated Live Audio Equalizer Waves */}
            {(state === 'speaking' || state === 'listening') && (
              <div className="absolute bottom-4 flex items-center gap-1 h-3">
                <span className="w-1 bg-cyan-400 rounded-full animate-pulse h-2" style={{ animationDuration: '0.4s' }}></span>
                <span className="w-1 bg-cyan-300 rounded-full animate-pulse h-3.5" style={{ animationDuration: '0.6s' }}></span>
                <span className="w-1 bg-cyan-400 rounded-full animate-pulse h-2" style={{ animationDuration: '0.3s' }}></span>
                <span className="w-1 bg-teal-300 rounded-full animate-pulse h-4" style={{ animationDuration: '0.5s' }}></span>
                <span className="w-1 bg-cyan-400 rounded-full animate-pulse h-2.5" style={{ animationDuration: '0.7s' }}></span>
              </div>
            )}
          </div>
        </div>

        {/* Device Model Label */}
        <div className="mt-3 flex items-center gap-2 text-center">
          <span className="text-xs font-medium text-slate-300 tracking-wide">
            Amazon Echo Visualizer
          </span>
          <span className="px-1.5 py-0.5 text-[10px] bg-cyan-500/10 text-cyan-400 rounded border border-cyan-500/30 font-mono">
            MCP 2025-11-25
          </span>
        </div>

        {/* Interactive Bar */}
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={onToggleListen}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm ${
              isListening
                ? 'bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30'
                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-3.5 h-3.5" /> Stop Listening
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5" /> "Alexa, Plan My Day"
              </>
            )}
          </button>

          <button
            onClick={onToggleMute}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              isMuted
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title={isMuted ? 'Voice speech muted' : 'Voice speech enabled'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {activeQuery && (
          <div className="mt-2 text-center text-xs text-slate-400 max-w-xs truncate italic">
            "{activeQuery}"
          </div>
        )}
      </div>
    </div>
  );
};
