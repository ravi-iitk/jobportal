import { Briefcase, Home, LogOut, User, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
const items = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/jobs', label: 'Job Posts', icon: Briefcase },
  { to: '/applicants', label: 'Applicants', icon: Users },
  { to: '/profile', label: 'Profile', icon: User }
];
export default function Sidebar({ open, onClose }) {
  const { logout } = useAuth();

  return (
    <>
      <div className={`fixed inset-0 z-10 bg-slate-900/30 transition-opacity ${open ? 'opacity-100 visible' : 'opacity-0 invisible'} md:hidden`} onClick={onClose} />
      <aside className={`fixed inset-y-0 left-0 z-20 w-64 border-r bg-white p-2 shadow-lg transition-transform duration-200 dark:border-slate-800 dark:bg-slate-900 ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:shadow-none`}>
        <h1 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-slate-900 dark:text-slate-100">Mini Job Portal</h1>
        <nav className="space-y-2">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2 ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
          <button onClick={() => { onClose?.(); logout(); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-slate-800">
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
}
