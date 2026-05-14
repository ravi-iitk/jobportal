import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr('');
    try {
      await login(form);
      nav('/dashboard');
    } catch (error) {
      setErr(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <form onSubmit={submit} className="w-full max-w-md space-y-5 rounded-3xl bg-white p-8 shadow-xl dark:bg-slate-900">
        <div>
          <h1 className="text-3xl font-black">Recruiter Login</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Sign in to manage jobs, review candidates, and track applications.</p>
        </div>
        {err && <p className="rounded-3xl bg-rose-50 p-3 text-rose-700 dark:bg-rose-900/20">{err}</p>}
        <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <Button loading={loading} className="w-full">Login</Button>
        <p className="text-sm text-slate-500 dark:text-slate-400">No account? <Link className="text-brand-600 hover:underline" to="/signup">Signup</Link></p>
      </form>
    </div>
  );
}
