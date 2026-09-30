const LONG_VALUE = 12;
const LONG_CLASS = "text-2xl";
const SHORT_CLASS = "text-4xl";

export default function Display({ expression, value, isError }) {
  return (
    <div
      className="bg-slate-950 rounded-xl p-4 mb-4 text-right min-h-[92px] flex flex-col justify-end overflow-hidden"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="text-slate-400 text-sm h-5 truncate" aria-hidden="true">
        {expression}
      </div>
      <div
        className={`font-mono font-semibold truncate break-all ${
          value.length > LONG_VALUE ? LONG_CLASS : SHORT_CLASS
        } ${isError ? "text-red-400" : "text-white"}`}
      >
        {value}
      </div>
    </div>
  );
}
