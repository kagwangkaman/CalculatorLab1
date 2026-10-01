import Calculator from "./components/Calculator.jsx";

export default function App() {
  return (
    <div className="relative min-h-dvh overflow-x-clip bg-[#0b1026] text-slate-100 flex flex-col">
      {/* Reality background: deep gradient + aurora blobs + grid + noise */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_10%_-10%,#7c3aed55,transparent),radial-gradient(1000px_500px_at_90%_10%,#06b6d455,transparent),radial-gradient(900px_600px_at_50%_110%,#ec489955,transparent),linear-gradient(180deg,#0b1026_0%,#111a3d_55%,#0b1026_100%)]" />
        <div className="blob blob-a absolute -top-24 -left-24 h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-fuchsia-500/40 blur-3xl" />
        <div className="blob blob-b absolute top-1/3 -right-24 h-72 w-72 sm:h-[28rem] sm:w-[28rem] rounded-full bg-cyan-400/30 blur-3xl" />
        <div className="blob blob-c absolute -bottom-32 left-1/4 h-80 w-80 sm:h-[26rem] sm:w-[26rem] rounded-full bg-violet-600/40 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]" />
      </div>

      <header className="relative z-10 px-4 pt-2 sm:pt-4 pb-1 text-center shrink-0">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-[10px] sm:text-xs tracking-widest uppercase text-cyan-100/90 backdrop-blur-xl shadow-lg">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Glassmorphism Reality
        </div>
        <h1 className="mt-1.5 text-2xl sm:text-4xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-white via-cyan-200 to-fuchsia-300 bg-clip-text text-transparent drop-shadow">
            Glass Calculator
          </span>
        </h1>
        <p className="mt-0.5 text-xs sm:text-base text-slate-300/80">
          Solve it right, unlock premium. Solve it wrong… expect cats.
        </p>
      </header>

      <main
        aria-label="Calculator"
        className="relative w-full max-w-md mx-auto px-3 sm:px-4 py-1 sm:py-2 flex-1 flex flex-col justify-center"
      >
        <Calculator />
      </main>

      <footer className="relative z-10 text-center text-slate-400 text-[10px] sm:text-xs pb-1.5 sm:pb-2 px-4 shrink-0">
        <p>DCIT 26 – Laboratory 1 · Weekly 5 · Monthly 10 · Yearly 15 · ÷0 summons cats 😹</p>
      </footer>
    </div>
  );
}
