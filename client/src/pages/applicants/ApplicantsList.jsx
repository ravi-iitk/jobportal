import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApplicants } from '../../api/applicantsAPI';
import { getJobs } from '../../api/jobsAPI';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/applicants/StatusBadge';
import Pagination from '../../components/ui/Pagination';
import Skeleton from '../../components/ui/Skeleton';
const statusOptions = ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'];
export default function ApplicantsList() {
  const [items, setItems] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState({ page: 1, limit: 15, search: '', status: '', job: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    getJobs({ page: 1, limit: 100 }).then(({ data }) => setJobs(data.data)).catch(() => setJobs([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    getApplicants(params)
      .then(({ data }) => {
        setItems(data.data);
        setPagination(data.pagination);
      })
      .catch((err) => setError(err.response?.data?.message || 'Unable to load applicants.'))
      .finally(() => setLoading(false));
  }, [params]);

  const statusCounts = items.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black">Applicants</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">Review candidates, update statuses, and manage internal notes.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => setParams({ page: 1, limit: 15, search: '', status: '', job: '' })}>Reset Filters</Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">
        <div className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">Total applicants</p>
              <p className="mt-3 text-3xl font-black text-slate-900 dark:text-white">{pagination?.total || 0}</p>
            </div>
            {statusOptions.map((key) => (
              <div key={key} className="rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">{key}</p>
                <p className="mt-3 text-3xl font-black text-slate-900 dark:text-white">{statusCounts[key] || 0}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
          <div className="space-y-4">
            <input
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              placeholder="Search applicants"
              value={params.search}
              onChange={(e) => setParams({ ...params, page: 1, search: e.target.value })}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <select
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                value={params.status}
                onChange={(e) => setParams({ ...params, page: 1, status: e.target.value })}
              >
                <option value="">All Status</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <select
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                value={params.job}
                onChange={(e) => setParams({ ...params, page: 1, job: e.target.value })}
              >
                <option value="">All Jobs</option>
                {jobs.map((job) => (
                  <option key={job._id} value={job._id}>{job.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="rounded-3xl bg-red-50 p-6 text-red-700 dark:bg-red-900/20">{error}</div>}

      {loading ? (
        <Skeleton lines={8} />
      ) : items.length ? (
        <div className="overflow-hidden rounded-3xl bg-white shadow-soft dark:bg-slate-900">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Job</th>
                <th className="p-4">Email</th>
                <th className="p-4">Status</th>
                <th className="p-4">Applied</th>
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={a._id} className="border-t border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900">
                  <td className="p-4 font-semibold text-slate-900 dark:text-white"><Link className="text-brand-600 hover:underline" to={`/applicants/${a._id}`}>{a.name}</Link></td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{a.job?.title}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{a.email}</td>
                  <td className="p-4"><StatusBadge status={a.status} /></td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{new Date(a.appliedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-3xl bg-white p-10 shadow-soft dark:bg-slate-900">
          <p className="text-center text-slate-600 dark:text-slate-300">No applicants match the current filters. Try widening your search or clearing them.</p>
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={(page) => setParams({ ...params, page })} />
    </div>
  );
}
