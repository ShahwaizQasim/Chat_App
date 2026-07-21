import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, User } from 'lucide-react';

/**
 * VoiceCallModal
 * Matches the chat app theme: white surfaces, soft gray backdrop,
 * blue (#3b82f6 family) as the single accent color, rounded-2xl cards.
 *
 * Self-contained demo: cycles through "incoming" -> "connected" -> closed
 * so it can be dropped in and previewed with no props required.
 */

const CALLER = {
  name: 'Ahsan Ali',
  initials: 'AH',
  subtitle: 'Last seen recently',
};

function formatDuration(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

const VoiceCallModal = ({
  open = true,
  caller = CALLER,
  initialStatus = 'incoming', // 'incoming' | 'connected'
  onClose,
}) => {
  const [status, setStatus] = useState(initialStatus); // incoming | connected | ended
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (status === 'connected') {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [status]);

  if (!open) return null;

  const handleAccept = () => {
    setSeconds(0);
    setStatus('connected');
  };

  const handleEnd = () => {
    clearInterval(timerRef.current);
    setStatus('ended');
    setTimeout(() => {
      if (onClose) onClose();
    }, 600);
  };

  const statusLabel =
    status === 'incoming'
      ? 'Incoming voice call…'
      : status === 'connected'
      ? formatDuration(seconds)
      : 'Call ended';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden">
        {/* Top bar accent */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-blue-600" />

        <div className="flex flex-col items-center px-8 pt-10 pb-8">
          {/* Avatar */}
          <div className="relative">
            <div
              className={`h-24 w-24 rounded-full bg-blue-50 border-4 border-blue-100 flex items-center justify-center text-blue-600 text-2xl font-semibold ${
                status === 'incoming' ? 'animate-pulse' : ''
              }`}
            >
              {caller.initials || <User className="h-10 w-10" />}
            </div>
            {status === 'incoming' && (
              <>
                <span className="absolute inset-0 rounded-full border-2 border-blue-400/60 animate-ping" />
              </>
            )}
            {status === 'connected' && (
              <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-white" />
            )}
          </div>

          {/* Name & status */}
          <h2 className="mt-5 text-lg font-semibold text-slate-900">{caller.name}</h2>
          <p
            className={`mt-1 text-sm ${
              status === 'connected' ? 'text-slate-500 tabular-nums' : 'text-blue-600'
            }`}
          >
            {statusLabel}
          </p>

          {/* Controls */}
          <div className="mt-9 w-full">
            {status === 'incoming' && (
              <div className="flex items-center justify-center gap-10">
                <button
                  onClick={handleEnd}
                  aria-label="Decline call"
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg shadow-rose-500/30 transition hover:bg-rose-600 active:scale-95"
                >
                  <PhoneOff className="h-6 w-6" />
                </button>
                <button
                  onClick={handleAccept}
                  aria-label="Accept call"
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-600 active:scale-95"
                >
                  <Phone className="h-6 w-6" />
                </button>
              </div>
            )}

            {status === 'connected' && (
              <div className="flex flex-col items-center gap-8">
                <div className="flex items-center justify-center gap-6">
                  <button
                    onClick={() => setIsMuted((m) => !m)}
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                    className={`flex h-12 w-12 items-center justify-center rounded-full border transition active:scale-95 ${
                      isMuted
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </button>

                  <button
                    onClick={handleEnd}
                    aria-label="End call"
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg shadow-rose-500/30 transition hover:bg-rose-600 active:scale-95"
                  >
                    <PhoneOff className="h-6 w-6" />
                  </button>

                  <button
                    onClick={() => setIsSpeaker((s) => !s)}
                    aria-label={isSpeaker ? 'Speaker off' : 'Speaker on'}
                    className={`flex h-12 w-12 items-center justify-center rounded-full border transition active:scale-95 ${
                      isSpeaker
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {isSpeaker ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                  </button>
                </div>
                <div className="flex gap-4 text-xs text-slate-400">
                  <span>{isMuted ? 'Mic off' : 'Mic on'}</span>
                  <span>·</span>
                  <span>{isSpeaker ? 'Speaker on' : 'Earpiece'}</span>
                </div>
              </div>
            )}

            {status === 'ended' && (
              <div className="flex justify-center py-2">
                <span className="text-sm text-slate-400">Ending call…</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* Demo wrapper so this file previews nicely on its own.
   Remove and just use <VoiceCallModal open={...} caller={...} onClose={...} /> in your app. */
const Demo = () => {
  const [open, setOpen] = useState(true);

  return (
    <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center p-6">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-blue-700"
        >
          Simulate incoming call
        </button>
      )}
      <VoiceCallModal open={open} initialStatus="incoming" onClose={() => setOpen(false)} />
    </div>
  );
};

export default Demo;
export { VoiceCallModal };