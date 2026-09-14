import React, { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import { getStoreSettings } from '../../services/api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [settings, setSettings] = useState({ address: 'Rubavu District, Rwanda', phone: '+250 795 031 113', email: 'edisonigiraneza@gmail.com' });

  useEffect(() => {
    getStoreSettings().then(setSettings).catch(() => { });
  }, []);

  const whatsappNumber = settings.phone.replace(/\D/g, '');
  const whatsappMessage = encodeURIComponent(
    `Hello Edison Shop, my name is ${form.name || '[Your name]'}. ${form.email ? `My email is ${form.email}. ` : ''}${form.subject ? `Subject: ${form.subject}. ` : ''}${form.message || 'I would like to ask about your products.'}`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const submit = (e) => {
    e.preventDefault();
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div>
      <section className="bg-gradient-to-br from-[#050505] via-[#171717] to-brand-900 py-16 text-white">
        <div className="container-site text-center">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Contact Us</h1>
          <p className="mx-auto mt-4 max-w-xl text-brand-100 sm:text-lg">
            Questions about an order, a product, or a design project? We are one message away.
          </p>
        </div>
      </section>

      <section className="container-site grid gap-10 py-16 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900">Get in touch</h2>
          <p className="mt-2 text-sm text-slate-500">Reach us any way you like — we usually reply within a few hours.</p>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { icon: MapPin, title: 'Visit us', lines: [settings.address, 'Mon – Sat, 9am – 8pm'] },
              { icon: Phone, title: 'Call us', lines: [settings.phone, 'Support available 24/7'] },
              { icon: Mail, title: 'Email us', lines: [settings.email, 'We reply within 24h'], href: `mailto:${settings.email}` },
              { icon: Clock, title: 'Support hours', lines: ['Mon – Fri: 8am – 10pm', 'Weekends: 10am – 6pm'] },
            ].map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.title} className="card p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <Icon size={19} />
                  </span>
                  <h3 className="mt-3 font-display text-base font-semibold text-slate-900">{c.title}</h3>
                  {c.lines.map((l, i) => (
                    <p key={l} className="mt-0.5 text-sm text-slate-500">
                      {c.href && i === 0 ? (
                        <a href={c.href} className="font-medium text-brand-700 underline-offset-2 transition-colors hover:text-brand-500 hover:underline">{l}</a>
                      ) : l}
                    </p>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={submit} className="card p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold text-slate-900">Send us a message</h2>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="mt-1 text-sm text-slate-500">Choose the channel that works best for you.</p>
            </div>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#1ebe5d]">
              <MessageCircle size={17} /> Chat on WhatsApp
            </a>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="c-name">Full name *</label>
              <input id="c-name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="label" htmlFor="c-email">Email *</label>
              <input id="c-email" type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="c-subject">Subject *</label>
              <input id="c-subject" className="input" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="c-message">Message *</label>
              <textarea id="c-message" rows={5} className="input" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
            </div>
          </div>
          <button type="submit" className="btn-primary mt-6 !px-8">
            <Send size={16} />
            Continue in WhatsApp
          </button>
        </form>
      </section>
    </div>
  );
}