const LONG_VALUE = 12;
const XLONG_VALUE = 18;
const LONG_CLASS = "text-2xl sm:text-3xl";
const SHORT_CLASS = "text-4xl sm:text-5xl";
const XLONG_CLASS = "text-xl sm:text-2xl";

export default function Display({ expression, value, isError }) {
  const sizeClass =
    value.length > XLONG_VALUE ? XLONG_CLASS : value.length > LONG_VALUE ? LONG_CLASS : SHORT_CLASS;
  return (
    <div
      className="glass-deep relative rounded-2xl p-3 sm:p-4 mb-2 text-right min-h-[clamp(4rem,9dvh,7rem)] flex flex-col justify-end overflow-hidden"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* top gloss line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"
      />
      <div className="text-cyan-100/90 text-xs sm:text-sm min-h-5 break-all line-clamp-2 font-mono leading-snug" aria-hidden="true">
        {expression || " "}
      </div>
      <div
        className={`font-mono font-bold break-all leading-tight line-clamp-3 tracking-tight ${sizeClass} ${isError ? "text-rose-300" : "text-white drop-shadow-[0_2px_12px_rgba(34,211,238,0.35)]"}`}
      >
        {value}
      </div>
    </div>
  );
}
