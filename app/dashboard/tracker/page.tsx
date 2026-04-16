'use client';

import { useState, useEffect, useCallback } from 'react';

type Status = 'applied' | 'interview' | 'offer' | 'rejected';

interface Application {
  id: string;
  company: string;
  role: string;
  status: Status;
  notes: string;
  applied_at: string;
  created_at: string;
}

const STATUS_OPTIONS: { value: Status; label: string; cls: string }[] = [
  { value: 'applied',   label: 'Gesolliciteerd', cls: 'status-applied' },
  { value: 'interview', label: 'Gesprek',         cls: 'status-interview' },
  { value: 'offer',     label: 'Aanbod',          cls: 'status-offer' },
  { value: 'rejected',  label: 'Afgewezen',       cls: 'status-rejected' },
];

const EMPTY_FORM = { company: '', role: '', status: 'applied' as Status, notes: '', applied_at: new Date().toISOString().split('T')[0] };

export default function TrackerPage() {
  const [apps, setApps]         = useState<Application[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [editId, setEditId]     = useState<string | null>(null);
  const [saving, setSaving]     = useState(false);
  const [filter, setFilter]     = useState<Status | 'all'>('all');

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch('/api/tracker');
    if (r.ok) setApps(await r.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleSave() {
    if (!form.company.trim() || !form.role.trim()) return;
    setSaving(true);
    if (editId) {
      await fetch('/api/tracker', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editId, ...form }),
      });
    } else {
      await fetch('/api/tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setSaving(false);
    setShowForm(false);
    setEditId(null);
    setForm(EMPTY_FORM);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm('Sollicitatie verwijderen?')) return;
    await fetch('/api/tracker', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    load();
  }

  function startEdit(a: Application) {
    setForm({ company: a.company, role: a.role, status: a.status, notes: a.notes || '', applied_at: a.applied_at || '' });
    setEditId(a.id);
    setShowForm(true);
  }

  const filtered = filter === 'all' ? apps : apps.filter(a => a.status === filter);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">Sollicitatie Tracker</h1>
          <p className="text-sm text-gray-500 mt-0.5">Houd al je sollicitaties bij op één plek.</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY_FORM); }}
          className="btn-primary"
        >
          + Toevoegen
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {[{ v: 'all', l: 'Alles' }, ...STATUS_OPTIONS.map(s => ({ v: s.value, l: s.label }))].map(f => (
          <button
            key={f.v}
            onClick={() => setFilter(f.v as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filter === f.v ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            {f.l} {f.v !== 'all' && <span className="ml-1 opacity-60">{apps.filter(a => a.status === f.v).length}</span>}
            {f.v === 'all' && <span className="ml-1 opacity-60">{apps.length}</span>}
          </button>
        ))}
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <div className="card p-5 mb-6 bg-blue-50 border-blue-200">
          <h3 className="font-bold text-sm mb-4">{editId ? 'Bewerken' : 'Nieuwe sollicitatie'}</h3>
          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="label">Bedrijf *</label>
              <input className="input" placeholder="Bijv. ASML" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} />
            </div>
            <div>
              <label className="label">Functie *</label>
              <input className="input" placeholder="Bijv. Software Engineer" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} />
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as Status }))}>
                {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Datum gesolliciteerd</label>
              <input type="date" className="input" value={form.applied_at} onChange={e => setForm(p => ({ ...p, applied_at: e.target.value }))} />
            </div>
          </div>
          <div className="mb-4">
            <label className="label">Notities</label>
            <textarea
              className="input resize-none"
              rows={2}
              placeholder="Contactpersoon, recruiter, follow-up datum..."
              value={form.notes}
              onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving || !form.company || !form.role} className="btn-primary text-xs">
              {saving ? 'Opslaan...' : editId ? 'Wijzigingen opslaan' : 'Toevoegen'}
            </button>
            <button onClick={() => { setShowForm(false); setEditId(null); }} className="btn-secondary text-xs">
              Annuleren
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="text-center py-16 text-sm text-gray-400">Laden...</div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-400 text-sm mb-3">{filter === 'all' ? 'Nog geen sollicitaties toegevoegd.' : 'Geen sollicitaties met deze status.'}</p>
          {filter === 'all' && (
            <button onClick={() => setShowForm(true)} className="btn-primary text-xs">Eerste toevoegen</button>
          )}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Bedrijf', 'Functie', 'Status', 'Datum', 'Notities', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(a => {
                  const s = STATUS_OPTIONS.find(s => s.value === a.status);
                  return (
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{a.company}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{a.role}</td>
                      <td className="px-4 py-3">
                        <span className={s?.cls}>{s?.label}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 whitespace-nowrap text-xs">{a.applied_at ? new Date(a.applied_at).toLocaleDateString('nl-NL') : '—'}</td>
                      <td className="px-4 py-3 text-gray-400 max-w-xs truncate text-xs">{a.notes || '—'}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button onClick={() => startEdit(a)} className="text-xs text-primary hover:underline">Bewerk</button>
                          <button onClick={() => handleDelete(a.id)} className="text-xs text-red-400 hover:underline">Verwijder</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
