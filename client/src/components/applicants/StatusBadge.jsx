const map = {
  active: 'bg-emerald-100 text-emerald-700',
  closed: 'bg-slate-100 text-slate-700',
  draft: 'bg-slate-100 text-slate-700',
  pending: 'bg-slate-100 text-slate-700',
  reviewed: 'bg-sky-100 text-sky-700',
  shortlisted: 'bg-lime-100 text-lime-700',
  hired: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-rose-100 text-rose-700',
  interview: 'bg-blue-100 text-blue-700'
};
export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${map[status] || map.pending}`}>
      {status}
    </span>
  );
}

