import { useEffect, useRef, useState } from "react";

const MEME_VIDEO = `${import.meta.env.BASE_URL}cat-laughing.mp4`;
const MEME_POSTER = `${import.meta.env.BASE_URL}cat-laughing.gif`;

export default function MemePopup({ onClose }) {
  const videoRef = useRef(null);
  const [replayKey, setReplayKey] = useState(0);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Auto-play the downloaded file with sound as soon as the popup opens
  // (no link, offline). If the browser blocks autoplay with sound, fall
  // back to muted playback — the 🔊 button in the header unmutes.
  // Nothing ever overlays the video itself.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = muted;
    v.play().catch(() => {
      v.muted = true;
      setMuted(true);
      v.play().catch(() => {});
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replayKey]);

  const toggleMute = () => {
    const v = videoRef.current;
    const next = !muted;
    setMuted(next);
    if (v) {
      v.muted = next;
      v.play().catch(() => {});
    }
  };

  const replay = () => {
    setReplayKey((k) => k + 1);
  };

  return (
    <div
      className="animate-fade-in fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="meme-title"
      onClick={onClose}
    >
      <div
        className="animate-pop-in animate-shake glass relative w-full max-w-sm rounded-3xl p-5 sm:p-6 text-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div aria-hidden="true" className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-32 w-64 rounded-full bg-rose-400/30 blur-3xl" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close meme popup"
          className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-lg leading-none transition active:scale-95 z-10"
        >
          ×
        </button>

        <div className="text-5xl" aria-hidden="true">🙀😂</div>
        <h2 id="meme-title" className="mt-2 text-xl sm:text-2xl font-extrabold">
          Wrong answer!
        </h2>
        <p className="mt-1 text-sm text-slate-200/80">
          The calculator is laughing at you… right where the numbers compute.
        </p>

        {/* Local downloaded meme file — auto-plays with sound, no link, no green screen */}
        <div className="glass-deep mt-4 rounded-2xl overflow-hidden border border-white/15">
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/10">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="ml-2 truncate text-[11px] font-mono text-slate-300/80">cat-laughing.mp4 · offline · 🔊</span>
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? "Unmute meme sound" : "Mute meme sound"}
              title={muted ? "Unmute" : "Mute"}
              className="ml-auto shrink-0 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 px-2 py-1 text-sm leading-none transition active:scale-95"
            >
              {muted ? "🔇" : "🔊"}
            </button>
          </div>
          <div className="relative aspect-square bg-black">
            <video
              key={replayKey}
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              src={MEME_VIDEO}
              poster={MEME_POSTER}
              autoPlay
              loop
              playsInline
              preload="auto"
            >
              <img src={MEME_POSTER} alt="Laughing cat meme" className="h-full w-full object-cover" />
            </video>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={replay}
            className="rounded-xl px-3 py-2.5 text-sm font-bold bg-gradient-to-r from-cyan-300 to-fuchsia-300 text-slate-950 hover:brightness-110 transition active:scale-95"
          >
            ↻ Replay meme
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-3 py-2.5 text-sm font-bold bg-white/10 hover:bg-white/20 border border-white/20 text-white transition active:scale-95"
          >
            Try again
          </button>
        </div>
        <p className="mt-2 text-[11px] text-slate-400">Tip: don’t divide by zero 😹</p>
      </div>
    </div>
  );
}
