import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function CustomerGuard() {
    const location = useLocation();
    const { user, loading } = useAuth();

    if (loading) return <div className="flex min-h-[60vh] items-center justify-center text-sm font-semibold text-slate-500">Checking your account...</div>;
    if (!user || user.role !== 'customer') return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    return <Outlet />;
}
