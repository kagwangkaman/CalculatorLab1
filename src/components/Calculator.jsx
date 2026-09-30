import { useState, useEffect, useCallback } from "react";
import Display from "./Display.jsx";
import Button from "./Button.jsx";

const MAX_DIGITS = 15;
const PRECISION = 12;

// Operators where "10%" means "10% of the value already on the left",
// e.g. 200 + 10% === 220. For * and / the plain value is correct.
const PERCENT_OF_PREVIOUS = ["+", "−"];

function compute(a, b, op) {
  switch (op) {
    case "+": return a + b;
    case "−": return a - b;
    case "×": return a * b;
    case "÷": return b === 0 ? null : a / b;
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

  const clearAll = useCallback(() => {
    setCurrent("0");
    setPrevious(null);
    setOperator(null);
    setOverwrite(false);
    setExpression("");
    setError(false);
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
          setCurrent("Cannot divide by zero");
          setError(true);
          setExpression("");
          setOperator(null);
          setPrevious(null);
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
    [operator, overwrite, previous, current, error]
  );

  const equals = useCallback(() => {
    if (error || !operator || previous === null) return;
    const result = compute(parseFloat(previous), parseFloat(current), operator);
    if (result === null) {
      setCurrent("Cannot divide by zero");
      setError(true);
      setExpression("");
    } else {
      setExpression(`${previous} ${operator} ${current} =`);
      setCurrent(format(result));
    }
    setPrevious(null);
    setOperator(null);
    setOverwrite(true);
  }, [error, operator, previous, current]);

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

  // Keyboard support
  useEffect(() => {
    const onKey = (e) => {
      const k = e.key;
      if (/^[0-9]$/.test(k)) inputDigit(k);
      else if (k === ".") inputDecimal();
      else if (k === "+") chooseOperator("+");
      else if (k === "-") chooseOperator("−");
      else if (k === "*") chooseOperator("×");
      else if (k === "/") { e.preventDefault(); chooseOperator("÷"); }
      else if (k === "%") { e.preventDefault(); percent(); }
      else if (k === "Enter" || k === "=") { e.preventDefault(); equals(); }
      else if (k === "Backspace") backspace();
      else if (k === "Escape" || k.toLowerCase() === "c") clearAll();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inputDigit, inputDecimal, chooseOperator, equals, backspace, percent, clearAll]);

  return (
    <section
      className="bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl w-full max-w-sm mx-auto"
      aria-label="Calculator"
    >
      <Display expression={expression} value={current} isError={error} />
      <div className="grid grid-cols-4 gap-3">
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
    </section>
  );
}
