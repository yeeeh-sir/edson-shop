import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, googleLogin, logout } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        getCurrentUser()
            .then((currentUser) => {
                if (active) setUser(currentUser);
            })
            .catch(() => {
                if (active) setUser(null);
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, []);

    const signInWithGoogle = async (credential) => {
        const currentUser = await googleLogin(credential);
        setUser(currentUser);
        return currentUser;
    };

    const refreshUser = async () => {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        return currentUser;
    };

    const signOut = async () => {
        await logout();
        setUser(null);
    };

    return <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut, refreshUser }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
