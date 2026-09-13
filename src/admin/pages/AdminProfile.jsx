import React, { useEffect, useState } from 'react';
import { UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminProfileForm from '../components/AdminProfileForm';
import { clearToken } from '../../services/api';
import { getAdminProfile } from '../../services/adminApi';

export default function AdminProfile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        getAdminProfile().then(setProfile).catch((err) => setError(err.message));
    }, []);

    if (error) return <div role="alert" className="rounded-xl bg-rose-50 p-5 text-sm font-semibold text-rose-700">{error}</div>;
    if (!profile) return <div className="rounded-xl bg-white p-8 text-sm font-semibold text-slate-500 shadow-sm">Loading admin profile...</div>;

    const handlePasswordChanged = () => {
        clearToken();
        navigate('/admin/login', { replace: true });
    };

    return (
        <div className="mx-auto max-w-3xl space-y-8">
            <header>
                <div className="flex items-center gap-3"><UserRound className="text-brand-600" size={24} /><h1 className="font-display text-2xl font-bold text-slate-900">Admin profile</h1></div>
                <p className="mt-2 text-sm text-slate-500">Manage your administrator email and password securely.</p>
            </header>
            <div className="card flex items-center gap-4 p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-lg font-bold text-brand-700">{profile.full_name?.slice(0, 2).toUpperCase()}</div>
                <div><p className="font-display text-lg font-bold text-slate-900">{profile.full_name}</p><p className="text-sm text-slate-500">{profile.email}</p><span className="badge mt-2 bg-brand-50 text-brand-700">Administrator</span></div>
            </div>
            <AdminProfileForm profile={profile} showPassword={false} onEmailChanged={(email) => setProfile({ ...profile, email })} onPasswordChanged={handlePasswordChanged} />
        </div>
    );
}
