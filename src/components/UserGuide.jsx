const steps = [
  "Press the number buttons (0–9) to enter a number.",
  "Press an operator button (+, −, ×, ÷) to choose an operation.",
  "Enter the second number.",
  "Press = to see the result.",
  "Press AC to clear everything and start over.",
];

const operations = [
  { symbol: "+", name: "Addition" },
  { symbol: "−", name: "Subtraction" },
  { symbol: "×", name: "Multiplication" },
  { symbol: "÷", name: "Division (dividing by zero shows an error)" },
];

export default function UserGuide() {
  return (
    <section className="bg-slate-800 rounded-2xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-4">User Guide</h2>

      <h3 className="text-lg font-semibold text-amber-400 mb-2">How to use the calculator</h3>
      <ol className="list-decimal list-inside space-y-1 text-slate-300 mb-6">
        {steps.map((s) => <li key={s}>{s}</li>)}
      </ol>

      <h3 className="text-lg font-semibold text-amber-400 mb-2">Supported operations</h3>
      <ul className="space-y-1 text-slate-300 mb-6">
        {operations.map((o) => (
          <li key={o.symbol}>
            <span className="inline-block w-6 font-mono font-bold text-white">{o.symbol}</span>
            {o.name}
          </li>
        ))}
      </ul>

      <h3 className="text-lg font-semibold text-amber-400 mb-2">Keyboard shortcuts</h3>
      <ul className="text-slate-300 text-sm grid grid-cols-1 sm:grid-cols-2 gap-1">
        <li><kbd className="font-mono text-white">0–9 .</kbd> Enter numbers</li>
        <li><kbd className="font-mono text-white">+ - * /</kbd> Operators</li>
        <li><kbd className="font-mono text-white">Enter</kbd> Equals</li>
        <li><kbd className="font-mono text-white">Backspace</kbd> Delete digit</li>
        <li><kbd className="font-mono text-white">Esc / C</kbd> Clear</li>
      </ul>
    </section>
  );
}
