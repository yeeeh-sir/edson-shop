import React, { useState } from 'react';
import { KeyRound, Mail, Save } from 'lucide-react';
import { updateAdminEmail, updateAdminPassword } from '../../services/adminApi';

const initialPassword = { currentPassword: '', newPassword: '', confirmPassword: '' };

export default function AdminProfileForm({ profile, onEmailChanged, onPasswordChanged, showEmail = true, showPassword = true }) {
    const [email, setEmail] = useState(profile.email || '');
    const [currentEmailPassword, setCurrentEmailPassword] = useState('');
    const [password, setPassword] = useState(initialPassword);
    const [state, setState] = useState({ loading: '', success: '', error: '' });

    const submitEmail = async (event) => {
        event.preventDefault();
        setState({ loading: 'email', success: '', error: '' });
        try {
            const result = await updateAdminEmail({ newEmail: email, currentPassword: currentEmailPassword });
            setCurrentEmailPassword('');
            onEmailChanged(email);
            setState({ loading: '', success: result.message, error: '' });
        } catch (error) {
            setState({ loading: '', success: '', error: error.message });
        }
    };

    const submitPassword = async (event) => {
        event.preventDefault();
        if (password.newPassword !== password.confirmPassword) {
            setState({ loading: '', success: '', error: 'New passwords do not match.' });
            return;
        }
        setState({ loading: 'password', success: '', error: '' });
        try {
            const result = await updateAdminPassword(password);
            setPassword(initialPassword);
            setState({ loading: '', success: result.message, error: '' });
            onPasswordChanged();
        } catch (error) {
            setState({ loading: '', success: '', error: error.message });
        }
    };

    return (
        <div className="space-y-6">
            {state.success && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{state.success}</div>}
            {state.error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{state.error}</div>}

            {showEmail && <form onSubmit={submitEmail} className="card space-y-5 p-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <Mail size={19} className="text-brand-600" />
                    <div><h2 className="font-display text-lg font-bold text-slate-900">Email address</h2><p className="text-sm text-slate-500">Changing your email affects your next login.</p></div>
                </div>
                <label className="block text-sm font-semibold text-slate-700">Current email<input className="input mt-1.5 w-full bg-slate-50" value={profile.email} readOnly /></label>
                <label className="block text-sm font-semibold text-slate-700">New email<input className="input mt-1.5 w-full" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /></label>
                <label className="block text-sm font-semibold text-slate-700">Current password<input className="input mt-1.5 w-full" type="password" value={currentEmailPassword} onChange={(event) => setCurrentEmailPassword(event.target.value)} required autoComplete="current-password" /></label>
                <button type="submit" disabled={state.loading === 'email'} className="btn-primary disabled:opacity-60"><Save size={16} />{state.loading === 'email' ? 'Updating...' : 'Update email'}</button>
            </form>}

            {showPassword && <form onSubmit={submitPassword} className="card space-y-5 p-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <KeyRound size={19} className="text-brand-600" />
                    <div><h2 className="font-display text-lg font-bold text-slate-900">Password</h2><p className="text-sm text-slate-500">You will need to sign in again after changing it.</p></div>
                </div>
                <label className="block text-sm font-semibold text-slate-700">Current password<input className="input mt-1.5 w-full" type="password" value={password.currentPassword} onChange={(event) => setPassword({ ...password, currentPassword: event.target.value })} required autoComplete="current-password" /></label>
                <label className="block text-sm font-semibold text-slate-700">New password<input className="input mt-1.5 w-full" type="password" minLength="8" value={password.newPassword} onChange={(event) => setPassword({ ...password, newPassword: event.target.value })} required autoComplete="new-password" /></label>
                <label className="block text-sm font-semibold text-slate-700">Confirm new password<input className="input mt-1.5 w-full" type="password" minLength="8" value={password.confirmPassword} onChange={(event) => setPassword({ ...password, confirmPassword: event.target.value })} required autoComplete="new-password" /></label>
                <button type="submit" disabled={state.loading === 'password'} className="btn-primary disabled:opacity-60"><KeyRound size={16} />{state.loading === 'password' ? 'Updating...' : 'Update password'}</button>
            </form>}
        </div>
    );
}
