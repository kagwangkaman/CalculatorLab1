import Calculator from "./components/Calculator.jsx";
import UserGuide from "./components/UserGuide.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">React Calculator</h1>
        <p className="text-slate-400 mt-1">Built with React and Tailwind CSS</p>
      </header>

      <main
        aria-label="Calculator and instructions"
        className="max-w-5xl mx-auto grid gap-8 md:grid-cols-2 items-start"
      >
        <Calculator />
        <UserGuide />
      </main>

      <footer className="text-center text-slate-500 text-sm mt-10">
        <p>DCIT 26 &ndash; Laboratory 1</p>
      </footer>
    </div>
  );
}
