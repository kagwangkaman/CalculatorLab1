const styles = {
  number: "bg-slate-700 hover:bg-slate-600 text-white",
  operator: "bg-amber-500 hover:bg-amber-400 text-slate-900",
  clear: "bg-rose-500 hover:bg-rose-400 text-white",
  equals: "bg-emerald-500 hover:bg-emerald-400 text-slate-900",
  util: "bg-slate-500 hover:bg-slate-400 text-white",
};

export default function Button({ label, onClick, type = "number", span = "", ariaLabel }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel || label}
      className={`${styles[type]} ${span} h-14 sm:h-16 rounded-xl text-xl font-semibold shadow
        transition duration-100 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white`}
    >
      {label}
    </button>
  );
}
