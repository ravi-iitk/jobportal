import { useState } from 'react';
import { updateMeAPI } from '../../api/authAPI';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', company: user?.company || '', avatar: user?.avatar || '', password: '' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    setError('');

    try {
      const { data } = await updateMeAPI(form);
      setUser(data.user);
      setMsg('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-black">Profile</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">Update your recruiter name, company, avatar, and password from one place.</p>
          </div>
          {form.avatar && (
            <img className="h-28 w-28 rounded-3xl object-cover" src={form.avatar} alt="Profile avatar" />
          )}
        </div>
      </div>

      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6 rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
          {msg && <div className="rounded-3xl bg-emerald-50 p-4 text-emerald-700 dark:bg-emerald-900/20">{msg}</div>}
          {error && <div className="rounded-3xl bg-rose-50 p-4 text-rose-700 dark:bg-rose-900/20">{error}</div>}
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          <Input label="Avatar URL" value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} />
          <Input label="New Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Leave blank to keep current password" />
          <Button loading={saving}>Save Changes</Button>
        </div>

        <aside className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
          <h2 className="text-xl font-semibold">Profile Preview</h2>
          <div className="mt-6 space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
            <p className="text-sm text-slate-500 dark:text-slate-400">Current information will update after saving.</p>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Name</p>
              <p className="mt-2 font-semibold text-slate-900 dark:text-white">{form.name || 'No name set'}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Company</p>
              <p className="mt-2 font-semibold text-slate-900 dark:text-white">{form.company || 'No company set'}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Avatar</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{form.avatar ? 'Displayed on your profile' : 'No avatar provided'}</p>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
