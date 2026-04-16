'use client';

import { useState, useEffect, useCallback } from 'react';

type Status = 'applied' | 'interview' | 'offer' | 'rejected';
interface App { id: string; company: string; role: string; status: Status; notes: string; applied_at: string; }

const STATUSES = [
  { v: 'applied',   l: 'Gesolliciteerd', cls: 'status-applied'   },
  { v: 'interview', l: 'Gesprek',        cls: 'status-interview' },
  { v: 'offer',     l: 'Aanbod',         cls: 'status-offer'     },
  { v: 'rejected',  l: 'Afgewezen',      cls: 'status-rejected'  },
] as const;

const EMPTY = { company: '', role: '', status: 'applied' as Status, notes: '', applied_at: new Date().toISOString().split('T')[0] };

export default function TrackerPage() {
  const [apps,     setApps]     = useState<App[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState(EMPTY);
  const [editId,   setEditId]   = useState<string | null>(null);
  const [saving,   setSaving]   = useState(false);
  const [filter,   setFilter]   = useState<Status | 'all'>('all');

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch('/api/tracker');
    if (r.ok) setApps(await r.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function openNew() { setForm(EMPTY); setEditId(null); setShowForm(true); }
  function openEdit(a: App) { setForm({ company: a.company, role: a.role, status: a.status, notes: a.notes || '', applied_at: a.applied_at || '' }); setEditId(a.id); setShowForm(true); }

  async function handleSave() {
    if (!form.company.trim() || !form.role.trim()) return;
    setSaving(true);
    const method = editId ? 'PATCH' : 'POST';
    const body   = editId ? { id: editId, ...form } : form;
    await fetch('/api/tracker', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setSaving(false);
    setShowForm(false);
    setEditId(null);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm('Sollicitatie verwijderen?')) return;
    await fetch('/api/tracker', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    load();
  }

  const filtered = filter === 'all' ? apps : apps.filter(a => a.status === filter);

  return (
    <>
      <div className="db-page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1>Sollicitatie Tracker</h1>
          <p>Houd al je sollicitaties bij op één plek.</p>
        </div>
        <button onClick={openNew} className="btn btn-primary">+ Toevoegen</button>
      </div>

      {/* Filters */}
      <div className="filter-row">
        <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
          Alles <span style={{ opacity: .6 }}>{apps.length}</span>
        </button>
        {STATUSES.map(s => (
          <button key={s.v} className={`filter-btn ${filter === s.v ? 'active' : ''}`} onClick={() => setFilter(s.v as Status)}>
            {s.l} <span style={{ opacity: .6 }}>{apps.filter(a => a.status === s.v).length}</span>
          </button>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div className="form-panel">
          <h3>{editId ? 'Bewerken' : 'Nieuwe sollicitatie'}</h3>
          <div className="form-grid">
            <div>
              <label className="label">Bedrijf *</label>
              <input className="input" placeholder="bijv. ASML" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} />
            </div>
            <div>
              <label className="label">Functie *</label>
              <input className="input" placeholder="bijv. Software Engineer" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} />
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as Status }))}>
                {STATUSES.map(s => <option key={s.v} value={s.v}>{s.l}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Datum gesolliciteerd</label>
              <input type="date" className="input" value={form.applied_at} onChange={e => setForm(p => ({ ...p, applied_at: e.target.value }))} />
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label className="label">Notities</label>
            <textarea className="input" rows={2} placeholder="Contactpersoon, recruiter, volgende stap..." value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
          </div>
          <div className="form-actions">
            <button onClick={handleSave} disabled={saving || !form.company || !form.role} className="btn btn-primary btn-sm">
              {saving ? 'Opslaan...' : editId ? 'Opslaan' : 'Toevoegen'}
            </button>
            <button onClick={() => setShowForm(false)} className="btn btn-secondary btn-sm">Annuleren</button>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="loading-box"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <p>{filter === 'all' ? 'Nog geen sollicitaties.' : 'Geen sollicitaties met deze status.'}</p>
            {filter === 'all' && <button onClick={openNew} className="btn btn-primary btn-sm">Eerste toevoegen</button>}
          </div>
        </div>
      ) : (
        <div className="table-wrap overflow-x">
          <table>
            <thead>
              <tr>
                <th>Bedrijf</th><th>Functie</th><th>Status</th>
                <th>Datum</th><th>Notities</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => {
                const s = STATUSES.find(s => s.v === a.status);
                return (
                  <tr key={a.id}>
                    <td className="td-main">{a.company}</td>
                    <td style={{ color: 'var(--text-2)', fontSize: 14 }}>{a.role}</td>
                    <td><span className={s?.cls}>{s?.l}</span></td>
                    <td className="td-sub">{a.applied_at ? new Date(a.applied_at).toLocaleDateString('nl-NL') : '—'}</td>
                    <td className="td-notes">{a.notes || '—'}</td>
                    <td className="td-actions">
                      <button onClick={() => openEdit(a)} className="action-edit">Bewerk</button>
                      {' '}
                      <button onClick={() => handleDelete(a.id)} className="action-del">Verwijder</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
