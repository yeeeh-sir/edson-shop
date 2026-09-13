import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

export default function GoogleLoginButton({ onSuccess, onError, disabled = false }) {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

    if (!clientId) {
        return <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">Google login is temporarily unavailable.</p>;
    }

    return (
        <div className={disabled ? 'pointer-events-none opacity-60' : ''}>
            <GoogleLogin
                onSuccess={(response) => response.credential && onSuccess(response.credential)}
                onError={onError}
                useOneTap={false}
                theme="outline"
                size="large"
                text="continue_with"
                shape="rectangular"
                width="360"
            />
        </div>
    );
}
