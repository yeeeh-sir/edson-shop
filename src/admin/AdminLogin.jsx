import React, { useState } from 'react';
import { Eye, EyeOff, LockKeyhole, LogIn } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { clearToken, login } from '../services/api';
import Logo from '../components/Logo/Logo';

export default function AdminLogin() {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState({ loading: false, error: '' });

    const submit = async (event) => {
        event.preventDefault();
        setStatus({ loading: true, error: '' });
        try {
            const user = await login(email, password);
            if (user.role !== 'admin') {
                clearToken();
                throw new Error('This sign-in is restricted to administrators.');
            }
            if (!remember) sessionStorage.setItem('edson_admin_session', '1');
            navigate(location.state?.from || '/admin/dashboard', { replace: true });
        } catch (error) {
            let message = error.message || 'Unable to sign in.';
            const status = error.status;
            if (status === 401) message = 'Invalid email or password.';
            else if (status === 403) message = 'This sign-in is restricted to administrators.';
            else if (status === 404) message = 'Admin login route was not found on the backend.';
            else if (status >= 500) message = 'Server error. The backend may be down or the database may be unreachable.';
            setStatus({ loading: false, error: message });
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <Logo className="mx-auto h-24 w-24" />
                    <h1 className="mt-5 font-display text-3xl font-bold text-white">Edson Shop Admin</h1>
                    <p className="mt-2 text-sm text-slate-400">Private operations console</p>
                </div>

                <form onSubmit={submit} className="rounded-2xl border border-slate-800 bg-white p-6 shadow-2xl sm:p-8">
                    <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">
                        <LockKeyhole size={19} className="text-brand-600" />
                        <div>
                            <h2 className="font-display font-bold text-slate-900">Administrator sign in</h2>
                            <p className="text-xs text-slate-500">Use an active admin account to continue.</p>
                        </div>
                    </div>

                    {status.error && <p role="alert" className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{status.error}</p>}

                    <label className="mb-4 block text-sm font-semibold text-slate-700">
                        Email
                        <input className="input mt-1.5 w-full" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="username" />
                    </label>

                    <label className="block text-sm font-semibold text-slate-700">
                        Password
                        <span className="relative mt-1.5 block">
                            <input className="input w-full !pr-11" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" />
                            <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                        </span>
                    </label>

                    <div className="mt-5 flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-slate-600">
                            <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                            Remember me
                        </label>
                        <span className="font-semibold text-slate-400">Forgot password?</span>
                    </div>

                    <button type="submit" disabled={status.loading} className="btn-primary mt-6 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60">
                        <LogIn size={17} />
                        {status.loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
            </div>
        </main>
    );
}
