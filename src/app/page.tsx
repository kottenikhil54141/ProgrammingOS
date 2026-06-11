import Navbar from "@/components/navbar/Navbar";
import GlassCard from "@/components/ui/GlassCard";
import PrimaryButton from "@/components/buttons/PrimaryButton";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(124,92,255,0.18),transparent_35%),linear-gradient(135deg,#090d1a_0%,#0b1020_45%,#050816_100%)] text-white">
      <Navbar />

      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-orange-400" />
              Python + JavaScript Learning Platform
            </div>

            <div className="space-y-4">
              <h1 className="max-w-xl text-5xl font-semibold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
                Become
                <br />
                an Engineer.
                <br />
                Not just another learner.
              </h1>

              <p className="max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                Master Python and JavaScript through immersive lessons, live coding,
                visual execution, and project-driven learning built for desktop and mobile.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <PrimaryButton className="min-w-[160px]">
                Start Learning
              </PrimaryButton>

              <button className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10">
                Explore Projects
              </button>
            </div>

            <div className="flex flex-wrap gap-3 pt-2 text-sm text-slate-400">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-xl">
                Dark / Light / System
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-xl">
                Mobile Ready
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-xl">
                Code + Output + Trace
              </span>
            </div>
          </div>

          <div className="w-full">
            <GlassCard className="overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400" />
                  <span className="h-3 w-3 rounded-full bg-green-400" />
                  <span className="ml-2 text-sm text-slate-300">main.py</span>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#0b1020]/80 p-5 font-mono text-sm leading-7 text-emerald-300 shadow-inner">
                  <div>name = "Nik"</div>
                  <div className="mt-4">print("Hello", name)</div>
                  <div className="mt-4">for i in range(5):</div>
                  <div className="pl-6">print(i)</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200 backdrop-blur-xl">
                  <div className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                    Running...
                  </div>
                  <div className="font-mono text-emerald-300">
                    Hello Nik
                    <br />
                    0
                    <br />
                    1
                    <br />
                    2
                    <br />
                    3
                    <br />
                    4
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>
    </main>
  );
}