import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import Logo from '../Logo/Logo';
import { getCategories, getStoreSettings } from '../../services/api';

const InstagramIcon = (p) => (
  <svg viewBox="0 0 24 24" width={17} height={17} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const TikTokIcon = (p) => (
  <svg viewBox="0 0 24 24" width={17} height={17} fill="currentColor" aria-hidden="true">
    <path d="M16.5 3c.4 2.3 1.9 3.9 4.3 4.2v3.1c-1.6 0-3-.5-4.3-1.4v6.5c0 3.9-3 6-6.5 5.2-2-.5-3.4-1.9-4-3.9-.9-3.3 1.6-6.4 4.9-6.2v3.2c-.7.1-1.4.4-1.8 1-.6 1-.3 2.3.8 2.8.7.3 1.4.3 2.1 0 1.2-.6 1.7-1.7 1.7-3V3h3.8z" />
  </svg>
);

const socials = [
  { icon: InstagramIcon, label: 'Instagram', href: 'https://www.instagram.com/_edson_edits/' },
  { icon: TikTokIcon, label: 'TikTok', href: 'https://www.tiktok.com/@edson_editz?is_from_webapp=1&sender_device=pc' },
];

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const support = [
  { label: 'Help Center', to: '/contact' },
  { label: 'Shipping', to: '/contact' },
  { label: 'Returns', to: '/contact' },
  { label: 'Privacy', to: '/contact' },
  { label: 'Terms', to: '/contact' },
];

export default function Footer() {
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState({ email: 'edisonigiraneza@gmail.com', phone: '+250 795 031 113', address: 'Rubavu District, Rwanda' });

  useEffect(() => {
    getCategories().then((items) => setCategories(items.map((category) => ({ label: category.name, to: `/shop/${category.slug}` })))).catch(() => setCategories([]));
    getStoreSettings().then(setSettings).catch(() => { });
  }, []);

  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="container-site grid gap-10 border-b border-slate-800/60 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center">
            <Logo className="h-20 w-20" />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
            Your trusted online shop for electronics, stationery and graphics. Everything you need, in one place.
          </p>
          <div className="mt-5 flex gap-2.5">
            {socials.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800/80 text-slate-300 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-500 hover:text-black"
                >
                  <Icon />
                </a>
              );
            })}
          </div>
          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-800/60">
            <iframe
              title="Edson Shop location — Rubavu District, Rwanda"
              src="https://maps.google.com/maps?q=Rubavu%20District%2C%20Rwanda&output=embed"
              width="100%"
              height="160"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <nav aria-label="Quick links">
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">Quick Links</h3>
          <ul className="mt-4 space-y-2.5">
            {quickLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-sm text-slate-400 transition-colors hover:text-brand-300">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Categories">
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">Categories</h3>
          <ul className="mt-4 space-y-2.5">
            {categories.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-sm text-slate-400 transition-colors hover:text-brand-300">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">Support</h3>
          <ul className="mt-4 space-y-2.5">
            {support.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-sm text-slate-400 transition-colors hover:text-brand-300">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-5 space-y-2 text-sm text-slate-400">
            <p className="flex items-center gap-2"><Mail size={14} className="text-brand-400" /> <a href={`mailto:${settings.email}`} className="text-slate-400 transition-colors hover:text-brand-300">{settings.email}</a></p>
            <p className="flex items-center gap-2"><Phone size={14} className="text-brand-400" /> {settings.phone}</p>
            <p className="flex items-center gap-2"><MapPin size={14} className="text-brand-400" /> {settings.address}</p>
          </div>
        </div>
      </div>

      <div className="container-site flex flex-col items-center justify-between gap-3 py-6 text-xs text-slate-500 sm:flex-row">
        <p>© {new Date().getFullYear()} Edson Shop. All rights reserved.</p>
      </div>
    </footer>
  );
}