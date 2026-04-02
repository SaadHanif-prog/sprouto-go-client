import  Logo from "./Logo";

export default function LegalHeader() {
  return (
    <div className="bg-[#050505] p-6 flex items-center justify-between border-b border-white/5">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
          <Logo className="w-8 h-8" />
        </div>
        <span className="text-xl font-bold text-white">SproutoGO</span>
      </div>
    </div>
  );
}