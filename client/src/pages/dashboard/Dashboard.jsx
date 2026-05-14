import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../../api/jobsAPI';
import StatusBadge from '../../components/applicants/StatusBadge';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
const statusLabels = ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'];
export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await getDashboardStats();
        setStats(data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Skeleton lines={8} />;
  if (error) return <div className="rounded-3xl bg-rose-50 p-6 text-rose-700 dark:bg-rose-900/20">{error}</div>;

  const cards = [
    { label: 'Total Jobs', value: stats.totalJobs },
    { label: 'Active Jobs', value: stats.activeJobs },
    { label: 'Applicants', value: stats.totalApplicants },
    { label: 'Shortlisted', value: stats.shortlisted }
  ];

  const statusItems = Object.entries(stats.applicantsByStatus || {}).map(([status, count]) => ({ status, count }));

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black">Dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">Overview of your recruitment activity, live jobs, and the latest candidates.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/jobs/create"><Button>Create Job</Button></Link>
            <Link to="/jobs"><Button variant="secondary">View Jobs</Button></Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value }) => (
          <div key={label} className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
            <p className="mt-4 text-4xl font-black text-slate-900 dark:text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <section className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Recent Job Posts</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Your latest roles with applicant activity.</p>
            </div>
            <Link to="/jobs" className="text-sm text-brand-600 hover:text-brand-700">See all</Link>
          </div>
          <div className="mt-6 space-y-4">
            {stats.recentJobs.map((job) => (
              <div key={job._id} className="rounded-3xl border border-slate-200 p-4 transition hover:border-brand-500 dark:border-slate-800 dark:hover:border-brand-400">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{job.title}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{job.applicantCount || 0} applicants · Posted {job.createdAt ? `${Math.max(1, Math.ceil((new Date() - new Date(job.createdAt)) / 86400000))}d ago` : 'recently'}</p>
                  </div>
                  <StatusBadge status={job.status} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Recent Applicants</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Candidates who recently applied to your roles.</p>
            </div>
            <Link to="/applicants" className="text-sm text-brand-600 hover:text-brand-700">See all</Link>
          </div>
          <div className="mt-6 space-y-4">
            {stats.recentApplicants.map((applicant) => (
              <div key={applicant._id} className="rounded-3xl border border-slate-200 p-4 transition hover:border-brand-500 dark:border-slate-800 dark:hover:border-brand-400">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{applicant.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{applicant.job?.title || 'No role assigned'}</p>
                  </div>
                  <StatusBadge status={applicant.status} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {statusItems.length > 0 && (
        <section className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
          <h2 className="text-xl font-semibold">Applicant Status</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statusItems.map(({ status, count }) => (
              <div key={status} className="rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{status}</p>
                <p className="mt-3 text-3xl font-black text-slate-900 dark:text-white">{count}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
