import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Palette,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Loader2,
  AlertCircle,
  User,
  Mail,
  Phone,
  Calendar,
  Image as ImageIcon,
  ImageOff,
  ChevronRight,
  RefreshCw,
  Inbox,
  Layers,
  Zap,
  FileText,
  Star,
} from 'lucide-react';
import { getAdminGraphicsRequests, updateGraphicsRequestStatus, formatPrice } from '../services/api';
import { cloudinaryVariant } from '../utils/cloudinary';

const STATUSES = [
  { value: 'all', label: 'All Requests', icon: Layers },
  { value: 'pending', label: 'Pending', icon: Clock },
  { value: 'reviewing', label: 'Reviewing', icon: Eye },
  { value: 'approved', label: 'Approved', icon: CheckCircle2 },
  { value: 'in_progress', label: 'In Progress', icon: Zap },
  { value: 'completed', label: 'Completed', icon: Star },
  { value: 'cancelled', label: 'Cancelled', icon: XCircle },
];

const STATUS_STYLES = {
  pending: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  reviewing: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  approved: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  in_progress: { bg: 'bg-violet-100', text: 'text-violet-700', dot: 'bg-violet-500' },
  completed: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  cancelled: { bg: 'bg-rose-100', text: 'text-rose-700', dot: 'bg-rose-500' },
};

function StatusBadge({ status, small }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-bold ${s.bg} ${s.text} ${small ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {status.replace('_', ' ')}
    </span>
  );
}

function StatsCard({ label, value, icon: Icon, color }) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
        <Icon size={22} />
      </span>
      <div>
        <p className="font-display text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="h-44 bg-slate-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-3/4 rounded bg-slate-200" />
        <div className="h-3 w-1/2 rounded bg-slate-200" />
        <div className="flex gap-2 mt-3">
          <div className="h-6 w-16 rounded-full bg-slate-200" />
          <div className="h-6 w-20 rounded-full bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

function RequestCard({ request, onView }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="card group overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift cursor-pointer" onClick={() => onView(request)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') onView(request); }}>
      <div className="relative h-44 bg-slate-100 overflow-hidden">
        {request.reference_image && !imgError ? (
          <img
            src={cloudinaryVariant(request.reference_image, 600)}
            alt={`Reference for ${request.design_type || request.service_name || 'design request'}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-300">
            <ImageOff size={32} />
            <span className="text-xs font-medium">No reference image</span>
          </div>
        )}
        <span className="absolute left-3 top-3 z-10">
          <StatusBadge status={request.status} />
        </span>
        <span className="absolute right-3 top-3 z-10 rounded-lg bg-slate-900/60 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
          #{request.id}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-display text-base font-bold text-slate-900 line-clamp-1">
          {request.design_type || request.service_name || 'Design Request'}
        </h3>
        {request.description && (
          <p className="mt-1 text-xs text-slate-500 line-clamp-2">{request.description}</p>
        )}

        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
          <User size={12} />
          <span className="font-medium text-slate-600">{request.customer_name || 'Guest'}</span>
          {request.service_name && (
            <>
              <span className="text-slate-300">·</span>
              <span>{request.service_name}</span>
            </>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="flex items-center gap-1 text-[11px] text-slate-400">
            <Calendar size={11} />
            {new Date(request.created_at).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-brand-600 opacity-0 transition group-hover:opacity-100">
            View details <ChevronRight size={14} />
          </span>
        </div>
      </div>
    </div>
  );
}

function DetailModal({ request, onClose, onUpdate }) {
  const [activeImage, setActiveImage] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [toast, setToast] = useState('');

  const images = useMemo(() => {
    if (!request.reference_image) return [];
    return [request.reference_image];
  }, [request.reference_image]);

  const handleStatusUpdate = useCallback(async (newStatus) => {
    setUpdating(true);
    setToast('');
    try {
      const updated = await updateGraphicsRequestStatus(request.id, newStatus);
      onUpdate(updated);
      setToast(`Status updated to "${newStatus.replace('_', ' ')}"`);
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      setToast(err.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  }, [request.id, onUpdate]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const timeline = useMemo(() => {
    const events = [{ status: 'pending', label: 'Request submitted', time: request.created_at }];
    const statusOrder = ['pending', 'reviewing', 'approved', 'in_progress', 'completed'];
    const currentIdx = statusOrder.indexOf(request.status);
    if (request.status === 'cancelled') {
      events.push({ status: 'cancelled', label: 'Request cancelled', time: request.updated_at });
    } else if (currentIdx >= 1) {
      events.push({ status: 'reviewing', label: 'Under review', time: null });
    }
    if (currentIdx >= 2) events.push({ status: 'approved', label: 'Approved', time: null });
    if (currentIdx >= 3) events.push({ status: 'in_progress', label: 'Work in progress', time: null });
    if (currentIdx >= 4) events.push({ status: 'completed', label: 'Completed', time: request.updated_at });
    return events;
  }, [request]);

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-slate-900/60 p-4 pt-8 pb-8 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-label={`Request #${request.id} details`} onClick={onClose}>
      <div className="w-full max-w-4xl animate-scale-in rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900">Request #{request.id}</h2>
            <p className="text-xs text-slate-400">{request.design_type || request.service_name || 'Design request'}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={request.status} />
            <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600" aria-label="Close">
              <XCircle size={20} />
            </button>
          </div>
        </div>

        {toast && (
          <div className={`mx-6 mt-4 rounded-xl px-4 py-3 text-sm font-medium ${toast.includes('Failed') ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
            {toast}
          </div>
        )}

        <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1fr_1fr]">
          <div className="border-b border-slate-100 p-6 lg:border-b-0 lg:border-r">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
              {images.length > 0 && !imgError ? (
                <img
                  src={cloudinaryVariant(images[activeImage], 1200)}
                  alt={`Reference image for request #${request.id}`}
                  className="h-full w-full object-contain"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-300">
                  <ImageOff size={48} />
                  <span className="text-sm font-medium">No reference image</span>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${activeImage === i ? 'border-brand-500' : 'border-transparent hover:border-slate-300'}`}
                  >
                    <img src={cloudinaryVariant(img, 120)} alt={`Thumbnail ${i + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Status Timeline</h4>
              <div className="mt-3 space-y-0">
                {timeline.map((ev, i) => (
                  <div key={ev.status} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className={`h-3 w-3 rounded-full border-2 ${i === timeline.length - 1 ? 'border-brand-500 bg-brand-500' : 'border-slate-300 bg-slate-200'}`} />
                      {i < timeline.length - 1 && <span className="w-px flex-1 bg-slate-200" />}
                    </div>
                    <div className="pb-4">
                      <p className={`text-sm font-semibold ${i === timeline.length - 1 ? 'text-slate-900' : 'text-slate-500'}`}>{ev.label}</p>
                      {ev.time && <p className="text-[11px] text-slate-400">{new Date(ev.time).toLocaleString()}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <User size={13} /> Customer
              </h4>
              <div className="mt-3 space-y-2">
                <p className="text-sm font-bold text-slate-900">{request.customer_name || 'Guest'}</p>
                {request.email && (
                  <p className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail size={13} className="text-slate-400" /> {request.email}
                  </p>
                )}
                {request.phone && (
                  <p className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone size={13} className="text-slate-400" /> {request.phone}
                  </p>
                )}
                {request.user_id && (
                  <p className="text-[11px] text-slate-400">User ID: {request.user_id}</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <FileText size={13} /> Design Details
              </h4>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {[
                  ['Service', request.service_name],
                  ['Design Type', request.design_type],
                  ['Size', request.size],
                  ['Quantity', request.quantity],
                ].filter(([, v]) => v).map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-[11px] text-slate-400">{label}</dt>
                    <dd className="mt-0.5 text-sm font-semibold text-slate-800">{value}</dd>
                  </div>
                ))}
              </div>
              {request.description && (
                <div className="mt-3">
                  <dt className="text-[11px] text-slate-400">Description</dt>
                  <dd className="mt-1 whitespace-pre-wrap text-sm text-slate-700 leading-relaxed">{request.description}</dd>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Submitted</h4>
              <p className="mt-1 text-sm text-slate-700">{new Date(request.created_at).toLocaleString()}</p>
            </div>

            <div className="border-t border-slate-100 pt-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Update Status</h4>
              <div className="flex flex-wrap gap-2">
                {STATUSES.filter((s) => s.value !== 'all').map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    disabled={updating || request.status === s.value}
                    onClick={() => handleStatusUpdate(s.value)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                      request.status === s.value
                        ? 'bg-brand-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {updating && <Loader2 size={12} className="mr-1 inline animate-spin" />}
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 px-6 py-4 text-right">
          <button type="button" onClick={onClose} className="btn-primary">Close</button>
        </div>
      </div>
    </div>
  );
}

export default function GraphicsAdmin() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewing, setViewing] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    getAdminGraphicsRequests()
      .then((data) => setRequests(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleUpdate = useCallback((updated) => {
    setRequests((prev) => prev.map((r) => r.id === updated.id ? { ...r, ...updated } : r));
    setViewing((prev) => (prev && prev.id === updated.id ? { ...prev, ...updated } : prev));
  }, []);

  const stats = useMemo(() => {
    const s = { total: requests.length, pending: 0, reviewing: 0, approved: 0, in_progress: 0, completed: 0, cancelled: 0 };
    requests.forEach((r) => { if (s[r.status] !== undefined) s[r.status]++; });
    return s;
  }, [requests]);

  const filtered = useMemo(() => {
    let list = requests;
    if (statusFilter !== 'all') list = list.filter((r) => r.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) =>
        (r.customer_name || '').toLowerCase().includes(q) ||
        (r.email || '').toLowerCase().includes(q) ||
        (r.design_type || '').toLowerCase().includes(q) ||
        (r.service_name || '').toLowerCase().includes(q) ||
        (r.description || '').toLowerCase().includes(q) ||
        String(r.id).includes(q)
      );
    }
    return list;
  }, [requests, statusFilter, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Design Requests</h1>
        <p className="mt-1 text-sm text-slate-500">Manage incoming customer design and graphics requests.</p>
      </div>

      {!loading && !error && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <StatsCard label="Total" value={stats.total} icon={Layers} color="bg-slate-100 text-slate-600" />
          <StatsCard label="Pending" value={stats.pending} icon={Clock} color="bg-amber-100 text-amber-600" />
          <StatsCard label="Reviewing" value={stats.reviewing} icon={Eye} color="bg-blue-100 text-blue-600" />
          <StatsCard label="Approved" value={stats.approved} icon={CheckCircle2} color="bg-emerald-100 text-emerald-600" />
          <StatsCard label="In Progress" value={stats.in_progress} icon={Zap} color="bg-violet-100 text-violet-600" />
          <StatsCard label="Completed" value={stats.completed} icon={Star} color="bg-emerald-100 text-emerald-600" />
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative sm:max-w-xs sm:flex-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, type…"
            aria-label="Search design requests"
            className="input !pl-10"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input sm:w-44" aria-label="Filter by status">
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="card flex flex-col items-center gap-3 p-10 text-center">
          <AlertCircle size={36} className="text-rose-400" />
          <p className="text-sm font-semibold text-rose-700">Unable to load design requests</p>
          <p className="text-xs text-slate-500">{error}</p>
          <button type="button" onClick={load} className="btn-primary mt-2">
            <RefreshCw size={14} className="mr-1.5" /> Retry
          </button>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="card flex flex-col items-center gap-4 p-14 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-50">
            <Inbox size={36} className="text-brand-400" />
          </div>
          <div>
            <p className="font-display text-lg font-bold text-slate-900">
              {requests.length === 0 ? 'No Design Requests Yet' : 'No Matching Requests'}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {requests.length === 0
                ? 'Customer design requests will appear here once submitted.'
                : 'Try adjusting your search or filter criteria.'}
            </p>
          </div>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((req) => (
            <RequestCard key={req.id} request={req} onView={setViewing} />
          ))}
        </div>
      )}

      {viewing && (
        <DetailModal
          request={viewing}
          onClose={() => setViewing(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
