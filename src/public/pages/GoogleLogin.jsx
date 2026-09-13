import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Logo/Logo';

export default function GoogleLogin() {
    const navigate = useNavigate();
    const location = useLocation();
    const { signInWithGoogle } = useAuth();
    const [state, setState] = useState({ loading: false, error: '' });

    const handleSuccess = async (credential) => {
        setState({ loading: true, error: '' });
        try {
            await signInWithGoogle(credential);
            navigate(location.state?.from || '/checkout', { replace: true });
        } catch (error) {
            const message = error.message === 'Google authentication is not configured'
                ? 'Google login is not configured.'
                : error.status
                    ? 'Google sign-in failed. Please try again.'
                    : 'Unable to connect to the authentication server.';
            setState({ loading: false, error: message });
        }
    };

    return (
        <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
            <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-lift sm:p-10">
                <Logo className="mx-auto h-24 w-24" />
                <h1 className="mt-6 font-display text-2xl font-bold text-slate-900">Welcome to Edson Shop</h1>
                <p className="mt-2 text-sm leading-6 text-slate-500">Sign in with your Google account to continue to checkout.</p>
                {state.error && <p role="alert" className="mt-5 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{state.error}</p>}
                <div className="mt-7 flex justify-center"><GoogleLoginButton onSuccess={handleSuccess} onError={() => setState({ loading: false, error: 'Google sign-in failed. Please try again.' })} disabled={state.loading} /></div>
                {state.loading && <p className="mt-4 text-xs font-semibold text-slate-500">Signing you in securely...</p>}
                <p className="mt-7 flex items-center justify-center gap-2 text-xs text-slate-400"><ShieldCheck size={14} className="text-emerald-600" /> Your Google password is never shared with Edson Shop.</p>
            </section>
        </main>
    );
}
