import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import { requestSignupOtpAPI, verifySignupOtpAPI } from '../../api/authAPI';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', company: '', password: '' });
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('details');
  const [err, setErr] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr('');
    try {
      if (step === 'details') {
        await requestSignupOtpAPI(form);
        setStep('verify');
        setMessage(`Verification code sent to ${form.email}.`);
      } else {
        const { data } = await verifySignupOtpAPI({ email: form.email, otp });
        localStorage.setItem('jwtToken', data.token);
        setUser(data.user);
        nav('/dashboard');
      }
    } catch (error) {
      setErr(error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <form onSubmit={submit} className="w-full max-w-md space-y-5 rounded-3xl bg-white p-8 shadow-xl dark:bg-slate-900">
        <div>
          <h1 className="text-3xl font-black">Create Recruiter Account</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Sign up with your email and verify your account before accessing the dashboard.</p>
        </div>
        {message && <div className="rounded-3xl bg-emerald-50 p-4 text-emerald-700 dark:bg-emerald-900/20">{message}</div>}
        {err && <p className="rounded-3xl bg-rose-50 p-3 text-rose-700 dark:bg-rose-900/20">{err}</p>}

        {step === 'details' ? (
          <>
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <Button loading={loading} className="w-full">Send OTP</Button>
          </>
        ) : (
          <>
            <Input label="Email" type="email" value={form.email} disabled />
            <Input label="OTP Code" value={otp} onChange={(e) => setOtp(e.target.value)} />
            <div className="flex items-center justify-between gap-3">
              <Button loading={loading} className="w-full">Verify OTP</Button>
              <button
                type="button"
                onClick={async () => {
                  setLoading(true);
                  setErr('');
                  try {
                    await requestSignupOtpAPI(form);
                    setMessage(`New OTP sent to ${form.email}.`);
                  } catch (error) {
                    setErr(error.response?.data?.message || 'Resend failed');
                  } finally {
                    setLoading(false);
                  }
                }}
                className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                Resend
              </button>
            </div>
          </>
        )}

        <p className="text-sm text-slate-500 dark:text-slate-400">Already have an account? <Link className="text-brand-600 hover:underline" to="/login">Login</Link></p>
      </form>
    </div>
  );
}
