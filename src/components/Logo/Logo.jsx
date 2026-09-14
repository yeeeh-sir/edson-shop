import React from 'react';

export default function Logo({ className = '', imageClassName = '', alt = 'Edison Shop' }) {
    return (
        <img
            src="/Logo.png"
            alt={alt}
            className={`object-contain ${imageClassName} ${className}`.trim()}
            loading="eager"
        />
    );
}
