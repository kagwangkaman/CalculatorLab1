const styles = {
  number: "bg-slate-700 hover:bg-slate-600 text-white",
  operator: "bg-amber-500 hover:bg-amber-400 text-slate-900",
  clear: "bg-rose-500 hover:bg-rose-400 text-white",
  equals: "bg-emerald-500 hover:bg-emerald-400 text-slate-900",
  util: "bg-slate-500 hover:bg-slate-400 text-white",
};

// Fall back to the neutral number style so an unexpected `type` can never
// render a button with no classes at all.
const base = "h-14 sm:h-16 rounded-xl text-xl font-semibold shadow";

export default function Button({
  label,
  onClick,
  type = "number",
  span = "",
  ariaLabel,
  title,
  disabled = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel || label}
      className={`${styles[type] || styles.number} ${base} ${span} transition duration-100
        active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white
        disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100`}
    >
      {label}
    </button>
  );
}
