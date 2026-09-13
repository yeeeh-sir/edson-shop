import React, { useRef, useState } from 'react';
import { Save, UserRound, UploadCloud, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, uploadProfileImage } from '../../services/api';

export default function Profile() {
    const { user, refreshUser } = useAuth();
    const inputRef = useRef(null);
    const [preview, setPreview] = useState(null);
    const [form, setForm] = useState({ full_name: user.full_name || '', phone: user.phone || '', address: user.address || '', city: user.city || '', country: user.country || '' });
    const [status, setStatus] = useState({ saving: false, message: '', error: '' });

    const uploadAvatar = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setPreview(URL.createObjectURL(file));
        setStatus({ saving: true, message: '', error: '' });
        try {
            const updated = await uploadProfileImage(file);
            let nextUser = updated;
            try { nextUser = await refreshUser(); } catch (_err) { /* fall back to returned user */ }
            setForm((current) => ({ ...current, full_name: nextUser.full_name || current.full_name }));
            setStatus({ saving: false, message: 'Profile picture updated.', error: '' });
        } catch (error) {
            setPreview(null);
            setStatus({ saving: false, message: '', error: error.message });
        } finally {
            event.target.value = '';
        }
    };

    const submit = async (event) => {
        event.preventDefault();
        setStatus({ saving: true, message: '', error: '' });
        try {
            await updateProfile(form);
            try { await refreshUser(); } catch (_err) { /* user fields update on next load */ }
            setStatus({ saving: false, message: 'Profile updated successfully.', error: '' });
        } catch (error) {
            setStatus({ saving: false, message: '', error: error.message });
        }
    };

    return <div className="container-site max-w-2xl py-12">
        <div className="flex items-center gap-3"><UserRound className="text-brand-600" /><h1 className="font-display text-3xl font-bold text-slate-900">My Profile</h1></div>
        <p className="mt-2 text-sm text-slate-500">Your email is managed securely by Google.</p>

        <form onSubmit={submit} className="card mt-8 space-y-5 p-6 sm:p-8">
            {status.message && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{status.message}</p>}
            {status.error && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm font-semibold text-rose-700">{status.error}</p>}

            <div>
                <label className="label">Profile picture</label>
                <div className="flex items-center gap-4">
                    <div className="h-20 w-20 overflow-hidden rounded-full bg-slate-100 ring-2 ring-brand-100">
                        {preview ? (
                            <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                        ) : user.profile_image ? (
                            <img src={user.profile_image} alt={user.full_name || 'Profile'} className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-brand-50 text-brand-600"><UserRound size={32} /></div>
                        )}
                    </div>
                    <div className="flex-1">
                        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={uploadAvatar} />
                        <button type="button" onClick={() => inputRef.current?.click()} disabled={status.saving} className="btn-ghost !py-2.5 disabled:cursor-not-allowed disabled:opacity-60">
                            {status.saving ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                            {status.saving ? 'Uploading...' : 'Change picture'}
                        </button>
                        <p className="mt-1 text-xs text-slate-400">JPG, PNG or WEBP only, max 5 MB.</p>
                    </div>
                </div>
            </div>

            <label className="label">Email<input className="input mt-1.5 bg-slate-50" value={user.email} readOnly /></label>
            {['full_name', 'phone', 'address', 'city', 'country'].map((field) => <label key={field} className="label">{field.replace('_', ' ')}<input className="input mt-1.5" value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} /></label>)}
            <button className="btn-primary" type="submit" disabled={status.saving}><Save size={16} />{status.saving ? 'Saving...' : 'Save changes'}</button>
        </form>
    </div>;
}