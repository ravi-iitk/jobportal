import { Moon, Sun, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useDarkMode } from '../../hooks/useDarkMode';
export default function Navbar({ onToggle, isOpen }) {
  const { user } = useAuth();
  const { dark, setDark } = useDarkMode();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="flex items-center justify-between gap-3 px-4 py-2 md:px-5">
        <div className="flex items-center gap-2">
          <button onClick={onToggle} className="inline-flex h-8 w-8 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 md:hidden">
            {isOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
          <p className="text-sm font-semibold">Recruiter Dashboard</p>
        </div>
        <button onClick={() => setDark(!dark)} className="inline-flex h-8 w-8 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
