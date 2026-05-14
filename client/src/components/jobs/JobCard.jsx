import { Link } from 'react-router-dom';
import StatusBadge from '../applicants/StatusBadge';
import Button from '../ui/Button';
const currencySymbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£', AED: 'د.إ' };
export default function JobCard({ job, onDelete, onToggle }) {
  const excerpt = job.description
    ? job.description.split(' ').slice(0, 20).join(' ') + (job.description.split(' ').length > 20 ? '...' : '')
    : '';
  const symbol = currencySymbols[job.currency] || job.currency || '₹';
  const salaryText = job.salaryMin || job.salaryMax
    ? `${job.salaryMin ? `${symbol}${job.salaryMin}` : ''}${job.salaryMin && job.salaryMax ? ' - ' : ''}${job.salaryMax ? `${symbol}${job.salaryMax}` : ''}`
    : 'Salary negotiable';

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold">{job.title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{job.company} • {job.location}</p>
        </div>
        <StatusBadge status={job.status} />
      </div>
      {excerpt && <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{excerpt}</p>}
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <span className="rounded-lg bg-slate-100 px-2 py-1 dark:bg-slate-800">{job.type}</span>
        <span className="rounded-lg bg-slate-100 px-2 py-1 dark:bg-slate-800">{job.category}</span>
        <span className="rounded-lg bg-slate-100 px-2 py-1 dark:bg-slate-800">{job.currency}</span>
        <span>{job.applicantCount || 0} applicants</span>
        {job.deadline && <span className="rounded-lg bg-slate-100 px-2 py-1 dark:bg-slate-800">Deadline: {new Date(job.deadline).toLocaleDateString()}</span>}
      </div>
      <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">{salaryText}</div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link to={`/jobs/${job._id}/edit`}><Button variant="secondary">Edit</Button></Link>
        <Button variant="secondary" onClick={() => onToggle(job)}>{job.status === 'active' ? 'Close' : 'Activate'}</Button>
        <Button variant="danger" onClick={() => onDelete(job._id)}>Delete</Button>
      </div>
    </div>
  );
}
