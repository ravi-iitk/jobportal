import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteJob, getJobs, updateJobStatus } from '../../api/jobsAPI';
import JobCard from '../../components/jobs/JobCard';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import Skeleton from '../../components/ui/Skeleton';
const initialParams = {
  page: 1,
  limit: 10,
  search: '',
  status: '',
  type: '',
  category: '',
  sortBy: 'createdAt',
  order: 'desc'
};
export default function JobsList() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [params, setParams] = useState(initialParams);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getJobs(params);
      setJobs(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [params]);

  const remove = async (id) => {
    if (!confirm('Delete this job?')) return;
    await deleteJob(id);
    load();
  };

  const toggle = async (job) => {
    await updateJobStatus(job._id, job.status === 'active' ? 'closed' : 'active');
    load();
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black">Job Posts</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">Create and manage active roles with a quick view of candidate flow and status.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/jobs/create"><Button>Create Job</Button></Link>
            <Button variant="secondary" onClick={() => setParams(initialParams)}>Reset Filters</Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <div className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">Total roles</p>
              <p className="mt-3 text-3xl font-black text-slate-900 dark:text-white">{pagination?.total || 0}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">Showing</p>
              <p className="mt-3 text-3xl font-black text-slate-900 dark:text-white">{jobs.length}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">Page</p>
              <p className="mt-3 text-3xl font-black text-slate-900 dark:text-white">{pagination?.page || 1}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">Sort</p>
              <p className="mt-3 text-3xl font-black text-slate-900 dark:text-white">{params.sortBy}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                placeholder="Search jobs"
                value={params.search}
                onChange={(e) => setParams({ ...params, page: 1, search: e.target.value })}
              />
              <select
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                value={params.status}
                onChange={(e) => setParams({ ...params, page: 1, status: e.target.value })}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <select
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                value={params.type}
                onChange={(e) => setParams({ ...params, page: 1, type: e.target.value })}
              >
                <option value="">All Types</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
              <select
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                value={params.category}
                onChange={(e) => setParams({ ...params, page: 1, category: e.target.value })}
              >
                <option value="">All Categories</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <select
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                value={params.sortBy}
                onChange={(e) => setParams({ ...params, page: 1, sortBy: e.target.value })}
              >
                <option value="createdAt">Newest</option>
                <option value="title">Title</option>
                <option value="applicantCount">Applicants</option>
              </select>
              <select
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                value={params.order}
                onChange={(e) => setParams({ ...params, page: 1, order: e.target.value })}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="rounded-3xl bg-red-50 p-6 text-red-700 dark:bg-red-900/20">{error}</div>}

      {loading ? (
        <Skeleton lines={8} />
      ) : jobs.length ? (
        <div className="grid gap-6 xl:grid-cols-2">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} onDelete={remove} onToggle={toggle} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-white p-10 shadow-soft dark:bg-slate-900">
          <p className="text-center text-slate-600 dark:text-slate-300">No job posts found. Try changing the filters or create a new job.</p>
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={(page) => setParams({ ...params, page })} />
    </div>
  );
}
