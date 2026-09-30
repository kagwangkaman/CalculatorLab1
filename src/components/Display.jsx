export default function Display({ expression, value, isError }) {
  return (
    <div
      className="bg-slate-950 rounded-xl p-4 mb-4 text-right min-h-[92px] flex flex-col justify-end overflow-hidden"
      aria-live="polite"
    >
      <div className="text-slate-400 text-sm h-5 truncate">{expression}</div>
      <div
        className={`font-mono font-semibold truncate ${
          value.length > 12 ? "text-2xl" : "text-4xl"
        } ${isError ? "text-red-400" : "text-white"}`}
      >
        {value}
      </div>
    </div>
  );
}
