import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getCurrentUser, getToken, clearToken } from '../services/api';

export default function AdminGuard() {
    const location = useLocation();
    const [state, setState] = useState({ loading: true, allowed: false });

    useEffect(() => {
        let active = true;
        if (!getToken()) {
            setState({ loading: false, allowed: false });
            return undefined;
        }

        getCurrentUser()
            .then((user) => {
                if (active) setState({ loading: false, allowed: user?.role === 'admin' });
            })
            .catch(() => {
                clearToken();
                if (active) setState({ loading: false, allowed: false });
            });

        return () => {
            active = false;
        };
    }, []);

    if (state.loading) {
        return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-sm font-semibold text-white">Checking admin session...</div>;
    }

    if (!state.allowed) {
        return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
    }

    return <Outlet />;
}
