const styles = {
  number: "bg-white/10 hover:bg-white/20 text-white",
  operator:
    "bg-gradient-to-br from-amber-300/80 to-orange-500/80 hover:from-amber-200/90 hover:to-orange-400/90 text-slate-950",
  clear:
    "bg-gradient-to-br from-rose-400/80 to-pink-600/80 hover:from-rose-300/90 hover:to-pink-500/90 text-white",
  equals:
    "bg-gradient-to-br from-emerald-300/90 to-cyan-400/90 hover:from-emerald-200 hover:to-cyan-300 text-slate-950",
  util: "bg-white/[0.07] hover:bg-white/[0.16] text-cyan-100",
};

// Fall back to the neutral number style so an unexpected `type` can never
// render a button with no classes at all.
const base =
  "glass-btn h-[clamp(2.4rem,6dvh,4rem)] rounded-2xl text-xl sm:text-2xl font-bold touch-manipulation select-none";

const compactBase =
  "glass-btn h-[clamp(1.9rem,4.4dvh,3rem)] rounded-xl text-[13px] sm:text-base font-bold touch-manipulation select-none";

export default function Button({
  label,
  onClick,
  type = "number",
  span = "",
  ariaLabel,
  title,
  disabled = false,
  compact = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel || label}
      className={`${styles[type] || styles.number} ${compact ? compactBase : base} ${span} transition duration-100
        active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300
        disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100`}
    >
      <span className="relative z-10 drop-shadow-sm">{label}</span>
    </button>
  );
}
