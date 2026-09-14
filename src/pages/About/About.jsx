import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Eye, Heart, Users, Award, Rocket, Mail } from 'lucide-react';

const values = [
  { icon: Heart, title: 'Customer first', text: 'Every decision starts with what is best for our customers.' },
  { icon: Eye, title: 'Quality obsessed', text: 'From products to prints, we never compromise on quality.' },
  { icon: Target, title: 'Honest pricing', text: 'Clear prices, real discounts and zero hidden fees.' },
  { icon: Rocket, title: 'Always improving', text: 'New products and better services, shipped every week.' },
];

const stats = [
  { value: '39+', label: 'Products & services' },
  { value: '1,200+', label: 'Happy customers' },
  { value: '150+', label: 'Design projects' },
  { value: '4.9/5', label: 'Average rating' },
];

const team = [
  { name: 'Edson Mensah', role: 'Founder & CEO', init: 'EM' },
  { name: 'Ama Serwaa', role: 'Head of Design', init: 'AS' },
  { name: 'Kwame Boateng', role: 'Electronics Lead', init: 'KB' },
  { name: 'Nana Owusu', role: 'Customer Success', init: 'NO' },
];

export default function About() {
  return (
    <div>
      <section className="bg-gradient-to-br from-[#050505] via-[#171717] to-brand-900 py-16 text-white">
        <div className="container-site text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold backdrop-blur ring-1 ring-white/20">
            <Users size={13} /> About Edison Shop
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">Every Shop You Need, In One</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-brand-100 sm:text-lg">
            Edison Shop started with a simple idea: you shouldn’t have to hop between five stores to get what you
            need. Electronics, stationery, and a full design &amp; printing studio — under one roof.
          </p>
        </div>
      </section>

      <section className="container-site py-16">
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="card p-6 text-center">
              <p className="font-display text-3xl font-extrabold text-brand-700">{s.value}</p>
              <p className="mt-1 text-sm text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700">
              <Award size={13} /> Our story
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold text-slate-900">Built for real people.</h2>
            <div className="mt-5 space-y-4 text-slate-600">
              <p>
                What began as a small stationery stall grew into a trusted destination for gadgets, supplies and
                design services. Today we help students, professionals and businesses get what they need — fast.
              </p>
              <p>
                Our graphics studio handles everything from a quick logo to a full brand package, and our product
                shelves are stocked with electronics and stationery that we use and love ourselves.
              </p>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/shop" className="btn-primary">Explore the shop</Link>
              <Link to="/graphics/request" className="btn-ghost">Work with our studio</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&q=80',
              'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=600&q=80',
              'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
              'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80',
            ].map((src) => (
              <img key={src} src={src} alt="Edison Shop work" loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover shadow-card" />
            ))}
          </div>
        </div>
      </section>

      <section className="container-site py-16">
        <div className="mb-10 text-center">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">What we stand for</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">The values behind every order we fulfill and every design we deliver.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-400 text-black">
                  <Icon size={20} />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-slate-900">{v.title}</h3>
                <p className="mt-1.5 text-sm text-slate-500">{v.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-slate-950 py-16 text-white">
        <div className="container-site">
          <h2 className="text-center font-display text-2xl font-bold sm:text-3xl">Meet the team</h2>
          <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {team.map((t) => (
              <div key={t.name} className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/50">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-400 font-display text-lg font-bold text-black">
                  {t.init}
                </span>
                <h3 className="mt-4 font-display text-base font-semibold">{t.name}</h3>
                <p className="mt-0.5 text-xs text-slate-400">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-site py-16">
        <div className="card overflow-hidden p-1">
          <div className="rounded-2xl bg-gradient-to-r from-[#050505] to-brand-700 p-10 text-center sm:p-14">
            <Mail size={38} className="mx-auto text-white/80" />
            <h2 className="mt-4 font-display text-2xl font-bold text-white sm:text-3xl">Talk to us</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-brand-100 sm:text-base">
              Questions, orders or a design project in mind? Email the team and we will reply within 24 hours.
            </p>
            <a
              href="mailto:edisonigiraneza@gmail.com"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-base font-bold text-brand-800 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-100"
            >
              <Mail size={18} />
              edisonigiraneza@gmail.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}




