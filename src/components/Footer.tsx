import Logo from "./Logo";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="py-12 border-t border-white/5 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
          
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center justify-center text-emerald-400">
                <Logo className="w-5 h-5" />
              </div>
              <span className="text-xl font-display font-bold tracking-tight text-white">
                SproutoGO
              </span>
            </div>

            <p className="text-slate-400 text-sm">
              82 King Street<br />
              Manchester<br />
              M2 4WQ
            </p>
          </div>

          {/* Legal Links ONLY */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/5 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} SproutoGO. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}