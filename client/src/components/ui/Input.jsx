export default function Input({ label, error, ...props }) {
  return <label className="block space-y-1"><span className="text-sm font-medium">{label}</span><input className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900" {...props}/>{error && <p className="text-sm text-red-500">{error}</p>}</label>;
}
