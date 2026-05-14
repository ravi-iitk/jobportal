import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getApplicant, updateApplicantNotes, updateApplicantStatus, deleteApplicant } from '../../api/applicantsAPI';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/applicants/StatusBadge';
import Skeleton from '../../components/ui/Skeleton';
export default function ApplicantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [applicant, setApplicant] = useState(null);
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getApplicant(id).then(({ data }) => {
      setApplicant(data.data);
      setNotes(data.data.notes || '');
    });
  }, [id]);

  if (!applicant) return <Skeleton lines={8} />;

  const saveStatus = async (status) => {
    setSaving(true);
    try {
      const { data } = await updateApplicantStatus(id, status);
      setApplicant(data.data);
      setMessage('Status updated successfully');
    } finally {
      setSaving(false);
    }
  };

  const saveNotes = async () => {
    setSaving(true);
    try {
      const { data } = await updateApplicantNotes(id, notes);
      setApplicant(data.data);
      setMessage('Internal notes saved');
    } finally {
      setSaving(false);
    }
  };

  const removeApplicant = async () => {
    if (!confirm('Delete this applicant permanently?')) return;
    setDeleting(true);
    try {
      await deleteApplicant(id);
      navigate('/applicants');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-brand-600">Applicant</p>
            <h1 className="mt-3 text-3xl font-black">{applicant.name}</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{applicant.email} {applicant.phone && `• ${applicant.phone}`}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <StatusBadge status={applicant.status} />
              <span className="text-sm text-slate-500 dark:text-slate-400">Applied for {applicant.job?.title}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {applicant.resumeUrl && (
              <a className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800" href={applicant.resumeUrl} target="_blank" rel="noreferrer">
                Open Resume
              </a>
            )}
            <Button variant="danger" onClick={removeApplicant} disabled={deleting}>{deleting ? 'Deleting...' : 'Delete Applicant'}</Button>
          </div>
        </div>
      </div>

      {message && <div className="rounded-3xl bg-emerald-50 p-4 text-emerald-700 dark:bg-emerald-900/20">{message}</div>}

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-6 rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
          <div>
            <h2 className="text-xl font-semibold">Cover Letter</h2>
            <p className="mt-3 whitespace-pre-wrap text-slate-600 dark:text-slate-300">{applicant.coverLetter || 'No cover letter provided.'}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Internal Notes</h2>
            <textarea
              rows="8"
              className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div className="mt-4 flex justify-end">
              <Button onClick={saveNotes} disabled={saving}>{saving ? 'Saving...' : 'Save Notes'}</Button>
            </div>
          </div>
        </div>

        <aside className="space-y-6 rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
          <div>
            <h2 className="text-xl font-semibold">Application Details</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center justify-between">
                <span>Job</span>
                <span>{applicant.job?.title || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Type</span>
                <span>{applicant.job?.type || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Location</span>
                <span>{applicant.job?.location || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Applied</span>
                <span>{new Date(applicant.appliedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
