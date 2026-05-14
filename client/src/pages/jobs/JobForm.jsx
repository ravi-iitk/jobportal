import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createJob, getJob, updateJob } from '../../api/jobsAPI';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
const blank = { title: '', location: '', type: 'Full-Time', category: 'Engineering', description: '', requirements: '', salaryMin: '', salaryMax: '', currency: 'INR', deadline: '', status: 'active' };
const currencyOptions = ['INR', 'USD', 'EUR', 'GBP', 'AED'];
export default function JobForm({ mode }) {
  const [form, setForm] = useState(blank);
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);
  const nav = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (mode === 'edit') {
      getJob(id).then(({ data }) => {
        const job = data.data;
        setForm({
          title: job.title || '',
          location: job.location || '',
          type: job.type || 'Full-Time',
          category: job.category || 'Engineering',
          description: job.description || '',
          requirements: (job.requirements || []).join('\n'),
          salaryMin: job.salaryMin || '',
          salaryMax: job.salaryMax || '',
          currency: job.currency || 'INR',
          deadline: job.deadline?.slice(0, 10) || '',
          status: job.status || 'active'
        });
      });
    }
  }, [mode, id]);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setSaving(true);
    const payload = {
      ...form,
      requirements: String(form.requirements).split('\n').filter(Boolean),
      salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
      salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined
    };

    try {
      if (mode === 'edit') {
        await updateJob(id, payload);
      } else {
        await createJob(payload);
      }
      nav('/jobs');
    } catch (error) {
      setErr(error.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black">{mode === 'edit' ? 'Edit Job' : 'Create Job'}</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Use this form to add or update your job posting quickly.</p>
          </div>
        </div>
      </div>

      <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-6 rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
          {err && <div className="rounded-3xl bg-rose-50 p-4 text-rose-700 dark:bg-rose-900/20">{err}</div>}
          <Input label="Job Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <div className="grid gap-4 sm:grid-cols-4">
            <select
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              {['Full-Time', 'Part-Time', 'Contract', 'Internship'].map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <select
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {['Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Other'].map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <select
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
            >
              {currencyOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <select
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              {['active', 'closed', 'draft'].map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Description</span>
            <textarea
              rows="6"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Requirements</span>
            <textarea
              rows="4"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              placeholder="One requirement per line"
              value={form.requirements}
              onChange={(e) => setForm({ ...form, requirements: e.target.value })}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Salary Min" type="number" value={form.salaryMin || ''} onChange={(e) => setForm({ ...form, salaryMin: e.target.value })} />
            <Input label="Salary Max" type="number" value={form.salaryMax || ''} onChange={(e) => setForm({ ...form, salaryMax: e.target.value })} />
            <Input label="Deadline" type="date" value={form.deadline || ''} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          </div>

          <Button loading={saving}>{mode === 'edit' ? 'Update Job' : 'Create Job'}</Button>
        </div>

        <aside className="space-y-6 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Job preview</p>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">This sidebar shows your job details before you save the posting.</p>
          </div>
          <div className="space-y-3 rounded-3xl bg-white p-5 shadow dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">Title</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">{form.title || 'Your job title'}</p>
            <div className="grid gap-2 text-sm text-slate-500 dark:text-slate-400">
              <p>{form.location || 'Location not set'}</p>
              <p>{form.type} • {form.category} • {form.currency}</p>
              {form.deadline && <p>Deadline: {form.deadline}</p>}
            </div>
          </div>
          <div className="space-y-3 rounded-3xl bg-white p-5 shadow dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">Status</p>
            <p className="text-base font-semibold text-slate-900 dark:text-white">{form.status}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Salary range: {form.salaryMin || 'N/A'} {form.currency} – {form.salaryMax || 'N/A'} {form.currency}</p>
          </div>
        </aside>
      </form>
    </div>
  );
}
