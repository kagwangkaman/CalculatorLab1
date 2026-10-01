import { useState, useEffect, useCallback } from "react";
import Display from "./Display.jsx";
import Button from "./Button.jsx";
import SubscriptionModal, { TIERS } from "./SubscriptionModal.jsx";
import MemePopup from "./MemePopup.jsx";

const MAX_DIGITS = 15;
const PRECISION = 12;

// Subscription access: each plan covers N correct answers before the
// modal pops again. Weekly 5 → Monthly 10 → Yearly 15.
function loadCount() {
  try {
    const v = parseInt(localStorage.getItem("glass-calc-correct-count") || "0", 10);
    return Number.isFinite(v) && v >= 0 ? v : 0;
  } catch {
    return 0;
  }
}

function loadPlanId() {
  try {
    const v = localStorage.getItem("glass-calc-plan");
    return TIERS.some((t) => t.id === v) ? v : null;
  } catch {
    return null;
  }
}

function loadLeft() {
  try {
    const v = parseInt(localStorage.getItem("glass-calc-credits-left") || "0", 10);
    return Number.isFinite(v) && v >= 0 ? v : 0;
  } catch {
    return 0;
  }
}

// Operators where "10%" means "10% of the value already on the left",
// e.g. 200 + 10% === 220. For * and / the plain value is correct.
const PERCENT_OF_PREVIOUS = ["+", "−"];

function compute(a, b, op) {
  switch (op) {
    case "+": return a + b;
    case "−": return a - b;
    case "×": return a * b;
    case "÷": return b === 0 ? null : a / b;
    case "^": {
      const r = Math.pow(a, b);
      return Number.isFinite(r) ? r : NaN;
    }
    default: return b;
  }
}

function format(n) {
  if (!Number.isFinite(n)) return "Error";
  return String(parseFloat(n.toPrecision(PRECISION)));
}

export default function Calculator() {
  const [current, setCurrent] = useState("0");
  const [previous, setPrevious] = useState(null);
  const [operator, setOperator] = useState(null);
  const [overwrite, setOverwrite] = useState(false);
  const [expression, setExpression] = useState("");
  const [error, setError] = useState(false);
  const [showSub, setShowSub] = useState(false);
  const [showMeme, setShowMeme] = useState(false);
  const [lastResult, setLastResult] = useState("0");
  const [subscribedPlanId, setSubscribedPlanId] = useState(loadPlanId);
  const [correctCount, setCorrectCount] = useState(loadCount);
  const [creditsLeft, setCreditsLeft] = useState(loadLeft);
  const [deg, setDeg] = useState(true);
  const [showSci, setShowSci] = useState(true);

  useEffect(() => {
    try {
      localStorage.setItem("glass-calc-correct-count", String(correctCount));
    } catch {
      /* storage unavailable */
    }
  }, [correctCount]);

  useEffect(() => {
    try {
      if (subscribedPlanId) localStorage.setItem("glass-calc-plan", subscribedPlanId);
      else localStorage.removeItem("glass-calc-plan");
    } catch {
      /* storage unavailable */
    }
  }, [subscribedPlanId]);

  useEffect(() => {
    try {
      localStorage.setItem("glass-calc-credits-left", String(creditsLeft));
    } catch {
      /* storage unavailable */
    }
  }, [creditsLeft]);

  const subscribedPlan = TIERS.find((t) => t.id === subscribedPlanId) || null;

  const clearAll = useCallback(() => {
    setCurrent("0");
    setPrevious(null);
    setOperator(null);
    setOverwrite(false);
    setExpression("");
    setError(false);
  }, []);

  const triggerWrong = useCallback((msg) => {
    setCurrent(msg);
    setError(true);
    setExpression("");
    setOperator(null);
    setPrevious(null);
    // Wrong answer → meme pops up where numbers compute (center-screen video popup)
    setShowMeme(true);
  }, []);

  const inputDigit = useCallback(
    (d) => {
      if (error) clearAll();
      if (overwrite || error) {
        setCurrent(d);
        setOverwrite(false);
        if (!operator) setExpression("");
        return;
      }
      setCurrent((c) =>
        c === "0" ? d : c.length >= MAX_DIGITS ? c : c + d
      );
    },
    [overwrite, error, operator, clearAll]
  );

  const inputDecimal = useCallback(() => {
    if (error) clearAll();
    if (overwrite || error) {
      setCurrent("0.");
      setOverwrite(false);
      return;
    }
    setCurrent((c) => (c.includes(".") ? c : c + "."));
  }, [overwrite, error, clearAll]);

  const chooseOperator = useCallback(
    (op) => {
      if (error) return;
      if (operator && !overwrite) {
        const result = compute(parseFloat(previous), parseFloat(current), operator);
        if (result === null) {
          triggerWrong("Cannot divide by zero");
          return;
        }
        const r = format(result);
        setPrevious(r);
        setCurrent(r);
        setExpression(`${r} ${op}`);
      } else {
        setPrevious(current);
        setExpression(`${current} ${op}`);
      }
      setOperator(op);
      setOverwrite(true);
    },
    [operator, overwrite, previous, current, error, triggerWrong]
  );

  const equals = useCallback(() => {
    if (error || !operator || previous === null) return;
    const result = compute(parseFloat(previous), parseFloat(current), operator);
    if (result === null) {
      triggerWrong("Cannot divide by zero");
    } else {
      const formatted = format(result);
      setExpression(`${previous} ${operator} ${current} =`);
      setCurrent(formatted);
      setLastResult(formatted);
      // Correct answer → spend 1 subscription credit if any remain.
      // No credits (or none left) → subscription modal pops up like before.
      setCorrectCount((c) => c + 1);
      if (creditsLeft > 0) {
        setCreditsLeft(creditsLeft - 1);
      } else {
        setShowSub(true);
      }
    }
    setPrevious(null);
    setOperator(null);
    setOverwrite(true);
  }, [error, operator, previous, current, triggerWrong, creditsLeft]);

  const backspace = useCallback(() => {
    if (error) return clearAll();
    if (overwrite) return;
    setCurrent((c) => (c.length > 1 ? c.slice(0, -1) : "0"));
  }, [error, overwrite, clearAll]);

  const toggleSign = useCallback(() => {
    if (error || current === "0") return;
    setCurrent((c) => (c.startsWith("-") ? c.slice(1) : "-" + c));
  }, [error, current]);

  const percent = useCallback(() => {
    if (error) return;
    const value = parseFloat(current);
    if (Number.isNaN(value)) return;

    if (operator && previous !== null && PERCENT_OF_PREVIOUS.includes(operator)) {
      setCurrent(format(parseFloat(previous) * (value / 100)));
    } else {
      setCurrent(format(value / 100));
    }
  }, [error, current, operator, previous]);

  // Snap float noise (sin 30° → 0.5, cos 90° → 0).
  const snap = (r) =>
    Number.isFinite(r) && Math.abs(r - Math.round(r)) < 1e-9 ? Math.round(r) : r;

  // Scientific unary ops apply to the current entry immediately.
  // Domain errors (√−9, log 0, 1/0, bad factorial) count as wrong → meme popup.
  const applyUnary = useCallback(
    (name, fn) => {
      if (error) return;
      const value = parseFloat(current);
      if (Number.isNaN(value)) {
        triggerWrong("Invalid input");
        return;
      }
      let r;
      try {
        r = fn(value);
      } catch {
        r = NaN;
      }
      if (typeof r !== "number" || Number.isNaN(r) || !Number.isFinite(r)) {
        triggerWrong(name === "1/x" ? "Cannot divide by zero" : "Invalid input");
        return;
      }
      const s = format(snap(r));
      setExpression(`${name}(${current})`);
      setCurrent(s);
      setOverwrite(true);
    },
    [error, current, triggerWrong]
  );

  const insertConst = useCallback(
    (name, val) => {
      if (error) clearAll();
      setExpression(`${name}`);
      setCurrent(val);
      setOverwrite(false);
    },
    [error, clearAll]
  );

  const toRad = (d) => (deg ? (d * Math.PI) / 180 : d);
  const sciSin = useCallback(() => applyUnary("sin", (v) => Math.sin(toRad(v))), [applyUnary, deg]);
  const sciCos = useCallback(() => applyUnary("cos", (v) => Math.cos(toRad(v))), [applyUnary, deg]);
  const sciTan = useCallback(() => applyUnary("tan", (v) => Math.tan(toRad(v))), [applyUnary, deg]);
  const sciLn = useCallback(() => applyUnary("ln", (v) => Math.log(v)), [applyUnary]);
  const sciLog = useCallback(() => applyUnary("log", (v) => Math.log10(v)), [applyUnary]);
  const sciSqrt = useCallback(() => applyUnary("√", (v) => Math.sqrt(v)), [applyUnary]);
  const sciSquare = useCallback(() => applyUnary("sqr", (v) => v * v), [applyUnary]);
  const sciRecip = useCallback(() => applyUnary("1/x", (v) => 1 / v), [applyUnary]);
  const sciFact = useCallback(
    () =>
      applyUnary("fact", (v) => {
        if (!Number.isInteger(v) || v < 0 || v > 170) return NaN;
        let f = 1;
        for (let i = 2; i <= v; i++) f *= i;
        return f;
      }),
    [applyUnary]
  );
  const sciExp = useCallback(() => applyUnary("eˣ", (v) => Math.exp(v)), [applyUnary]);
  const sciPow10 = useCallback(() => applyUnary("10ˣ", (v) => Math.pow(10, v)), [applyUnary]);
  const sciAbs = useCallback(() => applyUnary("abs", (v) => Math.abs(v)), [applyUnary]);

  // Keyboard support
  useEffect(() => {
    const onKey = (e) => {
      // Don't hijack keys while a modal is open (except Escape handled by modals)
      if (showSub || showMeme) return;
      const k = e.key;
      if (/^[0-9]$/.test(k)) inputDigit(k);
      else if (k === ".") inputDecimal();
      else if (k === "+") chooseOperator("+");
      else if (k === "-") chooseOperator("−");
      else if (k === "*") chooseOperator("×");
      else if (k === "/") { e.preventDefault(); chooseOperator("÷"); }
      else if (k === "%") { e.preventDefault(); percent(); }
      else if (k === "^") chooseOperator("^");
      else if (k === "Enter" || k === "=") { e.preventDefault(); equals(); }
      else if (k === "Backspace") backspace();
      else if (k === "Escape" || k.toLowerCase() === "c") clearAll();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inputDigit, inputDecimal, chooseOperator, equals, backspace, percent, clearAll, showSub, showMeme]);

  const handleSubscribe = (plan) => {
    // Subscribing grants correct-answer access: Weekly 5, Monthly 10, Yearly 15.
    setSubscribedPlanId(plan.id);
    setCreditsLeft(plan.credits);
    setShowSub(false);
  };

  const creditsTotal = subscribedPlan ? subscribedPlan.credits : 0;
  const creditsPct = creditsTotal > 0 ? (creditsLeft / creditsTotal) * 100 : 0;

  return (
    <>
      <section
        className="glass rounded-[1.75rem] p-3 sm:p-5 w-full max-w-[400px] mx-auto relative"
        aria-label="Calculator"
      >
        {/* inner highlight */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />

        {subscribedPlan && creditsLeft > 0 ? (
          <div className="mb-2 flex items-center justify-between gap-2 rounded-xl border border-emerald-300/30 bg-emerald-400/10 px-3 py-1.5 text-xs sm:text-sm text-emerald-100">
            <span className="truncate">
              ⭐ Premium <strong>{subscribedPlan.name}</strong> · {creditsLeft}/{creditsTotal} answers left · ✅ {correctCount} correct
            </span>
            <button
              type="button"
              onClick={() => { setSubscribedPlanId(null); setCreditsLeft(0); }}
              className="shrink-0 rounded-lg bg-white/10 px-2 py-1 hover:bg-white/20 transition"
              aria-label="Cancel subscription demo"
            >
              Cancel
            </button>
          </div>
        ) : null}

        {/* Remaining subscription access before the modal pops again */}
        <div
          className="mb-2 rounded-xl border border-white/15 bg-white/[0.06] px-3 py-1.5"
          role="status"
          aria-live="polite"
        >
          {subscribedPlan && creditsLeft > 0 ? (
            <>
              <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-200/90">
                <span>
                  🎟️ <strong>{creditsLeft}/{creditsTotal}</strong> {subscribedPlan.name} answers left
                </span>
                <span className="font-mono text-cyan-200">{Math.floor(creditsPct)}%</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-cyan-300 transition-all duration-300"
                  style={{ width: `${creditsPct}%` }}
                />
              </div>
            </>
          ) : (
            <p className="text-center text-[11px] sm:text-xs text-slate-300/80">
              ✅ {correctCount} correct · next correct shows Premium — Weekly 5 · Monthly 10 · Yearly 15
            </p>
          )}
        </div>

        {/* Scientific toggle */}
        <div className="mb-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowSci((s) => !s)}
            aria-expanded={showSci}
            className="rounded-xl border border-white/15 bg-white/[0.06] hover:bg-white/[0.12] px-3 py-1 text-xs sm:text-sm font-bold text-cyan-100 transition active:scale-95 touch-manipulation"
          >
            ƒx Scientific {showSci ? "▾" : "▸"}
          </button>
          {showSci && (
            <button
              type="button"
              onClick={() => setDeg((d) => !d)}
              aria-label="Toggle degrees radians"
              title="Toggle DEG / RAD"
              className="rounded-xl border border-white/15 bg-white/[0.06] hover:bg-white/[0.12] px-3 py-1 text-xs sm:text-sm font-mono font-bold text-amber-200 transition active:scale-95 touch-manipulation"
            >
              {deg ? "DEG" : "RAD"}
            </button>
          )}
        </div>

        {showSci && (
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2.5 mb-2" aria-label="Scientific functions">
            <Button compact label="sin" type="util" onClick={sciSin} ariaLabel="Sine" title="Sine" />
            <Button compact label="cos" type="util" onClick={sciCos} ariaLabel="Cosine" title="Cosine" />
            <Button compact label="tan" type="util" onClick={sciTan} ariaLabel="Tangent" title="Tangent" />
            <Button compact label="ln" type="util" onClick={sciLn} ariaLabel="Natural log" title="Natural logarithm" />
            <Button compact label="log" type="util" onClick={sciLog} ariaLabel="Base ten log" title="Base-10 logarithm" />
            <Button compact label="√" type="util" onClick={sciSqrt} ariaLabel="Square root" title="Square root" />
            <Button compact label="x²" type="util" onClick={sciSquare} ariaLabel="Square" title="Square (x²)" />
            <Button compact label="xʸ" type="operator" onClick={() => chooseOperator("^")} ariaLabel="Power" title="Power (x^y)" />
            <Button compact label="1/x" type="util" onClick={sciRecip} ariaLabel="Reciprocal" title="Reciprocal (1/x)" />
            <Button compact label="x!" type="util" onClick={sciFact} ariaLabel="Factorial" title="Factorial" />
            <Button compact label="eˣ" type="util" onClick={sciExp} ariaLabel="E to the x" title="e^x" />
            <Button compact label="10ˣ" type="util" onClick={sciPow10} ariaLabel="Ten to the x" title="10^x" />
            <Button compact label="|x|" type="util" onClick={sciAbs} ariaLabel="Absolute value" title="Absolute value" />
            <Button compact label="π" type="number" onClick={() => insertConst("π", String(Math.PI))} ariaLabel="Pi" title="Pi" />
            <Button compact label="e" type="number" onClick={() => insertConst("e", String(Math.E))} ariaLabel="Euler's number" title="Euler's number" />
          </div>
        )}

        <Display expression={expression} value={current} isError={error} />

        <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
          <Button label="AC" type="clear" onClick={clearAll} ariaLabel="All clear" title="Clear all (Esc)" />
          <Button label="±" type="util" onClick={toggleSign} ariaLabel="Toggle sign" title="Toggle sign" />
          <Button label="%" type="util" onClick={percent} ariaLabel="Percent" title="Percent (%)" />
          <Button label="÷" type="operator" onClick={() => chooseOperator("÷")} ariaLabel="Divide" title="Divide (/)" />

          {["7", "8", "9"].map((n) => <Button key={n} label={n} onClick={() => inputDigit(n)} />)}
          <Button label="×" type="operator" onClick={() => chooseOperator("×")} ariaLabel="Multiply" title="Multiply (*)" />

          {["4", "5", "6"].map((n) => <Button key={n} label={n} onClick={() => inputDigit(n)} />)}
          <Button label="−" type="operator" onClick={() => chooseOperator("−")} ariaLabel="Subtract" title="Subtract (-)" />

          {["1", "2", "3"].map((n) => <Button key={n} label={n} onClick={() => inputDigit(n)} />)}
          <Button label="+" type="operator" onClick={() => chooseOperator("+")} ariaLabel="Add" title="Add (+)" />

          <Button label="0" span="col-span-2" onClick={() => inputDigit("0")} />
          <Button label="." onClick={inputDecimal} ariaLabel="Decimal point" title="Decimal point (.)" />
          <Button label="=" type="equals" onClick={equals} ariaLabel="Equals" title="Equals (Enter)" />
        </div>

        <button
          type="button"
          onClick={backspace}
          className="mt-2 w-full rounded-xl border border-white/15 bg-white/[0.06] hover:bg-white/[0.12] py-1.5 text-xs sm:text-sm text-slate-200/90 transition active:scale-[0.99] touch-manipulation"
        >
          ⌫ Backspace
        </button>
      </section>

      {showSub && (
        <SubscriptionModal
          result={lastResult}
          onClose={() => setShowSub(false)}
          onSubscribe={handleSubscribe}
        />
      )}

      {showMeme && <MemePopup onClose={() => setShowMeme(false)} />}
    </>
  );
}
