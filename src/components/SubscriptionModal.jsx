import { useEffect } from "react";

// Each plan grants this many correct answers before the modal pops again.
export const TIERS = [
  {
    id: "weekly",
    name: "Weekly",
    price: "₱49",
    per: "/week",
    desc: "5 correct answers included",
    was: null,
    discount: null,
    badge: null,
    cta: "Choose Weekly",
    featured: false,
    credits: 5,
  },
  {
    id: "monthly",
    name: "Monthly",
    price: "₱149",
    per: "/month",
    desc: "10 correct answers included",
    was: "₱196",
    discount: "SAVE 24%",
    badge: null,
    cta: "Choose Monthly",
    featured: true,
    credits: 10,
  },
  {
    id: "yearly",
    name: "Yearly",
    price: "₱899",
    per: "/year",
    desc: "15 correct answers included",
    was: "₱1,788",
    discount: "SAVE 50%",
    badge: "BEST VALUE",
    cta: "Choose Yearly",
    featured: false,
    credits: 15,
  },
];

export default function SubscriptionModal({ result, onClose, onSubscribe }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sub-title"
      onClick={onClose}
    >
      <div
        className="animate-pop-in glass relative w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl p-5 sm:p-7 max-h-[92dvh] overflow-y-auto nice-scroll"
        onClick={(e) => e.stopPropagation()}
      >
        {/* glow */}
        <div aria-hidden="true" className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-40 w-72 rounded-full bg-cyan-400/30 blur-3xl" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close subscription popup"
          className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-lg leading-none transition active:scale-95"
        >
          ×
        </button>

        <div className="text-center">
          <div className="mx-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 border border-emerald-300/30 px-3 py-1 text-xs font-semibold text-emerald-200">
            <span aria-hidden="true">🎉</span> Correct answer!
          </div>
          <h2 id="sub-title" className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight">
            You unlocked <span className="bg-gradient-to-r from-cyan-200 to-fuchsia-300 bg-clip-text text-transparent">Premium</span>
          </h2>
          <p className="mt-1 text-sm text-slate-200/80">
            Answer was <span className="font-mono font-bold text-white">{result}</span> — subscribe for uninterrupted answers.
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {TIERS.map((p) => (
            <div
              key={p.id}
              className={`relative rounded-2xl p-4 border transition transform hover:-translate-y-0.5 ${
                p.featured
                  ? "bg-gradient-to-b from-cyan-400/25 to-fuchsia-500/20 border-cyan-200/50 shadow-[0_0_30px_rgba(34,211,238,0.25)]"
                  : "bg-white/[0.07] border-white/15"
              }`}
            >
              {p.badge && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-amber-300 to-orange-400 px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider text-slate-950 shadow">
                  {p.badge}
                </span>
              )}
              {p.discount && (
                <span
                  className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    p.featured ? "bg-emerald-400 text-slate-950" : "bg-white/15 text-emerald-200 border border-white/15"
                  }`}
                >
                  {p.discount}
                </span>
              )}
              <h3 className="font-bold text-white">{p.name}</h3>
              <p className="text-[11px] text-slate-300/80">{p.desc}</p>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-white">{p.price}</span>
                <span className="text-xs text-slate-300/80">{p.per}</span>
              </div>
              {p.was && (
                <p className="text-[11px] text-slate-400">
                  <s>{p.was}</s> <span className="text-emerald-300 font-semibold">discount applied</span>
                </p>
              )}
              <button
                type="button"
                onClick={() => onSubscribe?.(p)}
                className={`mt-3 w-full rounded-xl px-3 py-2.5 text-sm font-bold transition active:scale-95 ${
                  p.featured
                    ? "bg-gradient-to-r from-cyan-300 to-fuchsia-300 text-slate-950 hover:brightness-110 shadow-lg"
                    : "bg-white/10 hover:bg-white/20 border border-white/20 text-white"
                }`}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="mt-4 text-center text-[11px] text-slate-300/70">
          Weekly covers 5 correct · Monthly 10 · Yearly 15 · then the modal returns · Demo checkout only.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-2 w-full rounded-xl py-2 text-sm text-slate-300/80 hover:text-white hover:bg-white/10 transition"
        >
          No thanks, back to calculating
        </button>
      </div>
    </div>
  );
}
