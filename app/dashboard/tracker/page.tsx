'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { T } from '@/lib/i18n';

type Status = 'applied' | 'interview' | 'offer' | 'rejected';
interface App { id: string; company: string; role: string; status: Status; notes: string; applied_at: string; }

const EMPTY = { company: '', role: '', status: 'applied' as Status, notes: '', applied_at: new Date().toISOString().split('T')[0] };

export default function TrackerPage() {
  const { lang } = useLanguage();
  const t = T[lang];

  const STATUSES = [
    { v: 'applied'   as Status, l: t.trackerStatusApplied,   cls: 'status-applied'   },
    { v: 'interview' as Status, l: t.trackerStatusInterview,  cls: 'status-interview' },
    { v: 'offer'     as Status, l: t.trackerStatusOffer,      cls: 'status-offer'     },
    { v: 'rejected'  as Status, l: t.trackerStatusRejected,   cls: 'status-rejected'  },
  ];

  const locale = lang === 'nl' ? 'nl-NL' : 'en-GB';

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
    if (!confirm(t.trackerDeleteConfirm)) return;
    await fetch('/api/tracker', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    load();
  }

  const filtered = filter === 'all' ? apps : apps.filter(a => a.status === filter);

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <h1 className="db-page-title">{t.trackerTitle}</h1>
          <p className="db-page-sub">{t.trackerSub}</p>
        </div>
        <button onClick={openNew} className="btn btn-primary">{t.trackerAdd}</button>
      </div>

      <div className="filter-row">
        <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
          {t.trackerAll} <span style={{ opacity: .6 }}>{apps.length}</span>
        </button>
        {STATUSES.map(s => (
          <button key={s.v} className={`filter-btn ${filter === s.v ? 'active' : ''}`} onClick={() => setFilter(s.v)}>
            {s.l} <span style={{ opacity: .6 }}>{apps.filter(a => a.status === s.v).length}</span>
          </button>
        ))}
      </div>

      {showForm && (
        <div className="form-panel">
          <h3>{editId ? t.trackerFormEdit : t.trackerFormNew}</h3>
          <div className="form-grid">
            <div>
              <label className="label">{t.trackerLabelCompany}</label>
              <input className="input" placeholder={t.trackerPlaceholderCompany} value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} />
            </div>
            <div>
              <label className="label">{t.trackerLabelRole}</label>
              <input className="input" placeholder={t.trackerPlaceholderRole} value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} />
            </div>
            <div>
              <label className="label">{t.trackerLabelStatus}</label>
              <select className="input" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as Status }))}>
                {STATUSES.map(s => <option key={s.v} value={s.v}>{s.l}</option>)}
              </select>
            </div>
            <div>
              <label className="label">{t.trackerLabelDate}</label>
              <input type="date" className="input" value={form.applied_at} onChange={e => setForm(p => ({ ...p, applied_at: e.target.value }))} />
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label className="label">{t.trackerLabelNotes}</label>
            <textarea className="input" rows={2} placeholder={t.trackerPlaceholderNotes} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
          </div>
          <div className="form-actions">
            <button onClick={handleSave} disabled={saving || !form.company || !form.role} className="btn btn-primary btn-sm">
              {saving ? t.trackerSaving : t.trackerSave}
            </button>
            <button onClick={() => setShowForm(false)} className="btn btn-secondary btn-sm">{t.trackerCancel}</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-box"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <p>{filter === 'all' ? t.trackerEmptyAll : t.trackerEmptyFiltered}</p>
            {filter === 'all' && <button onClick={openNew} className="btn btn-primary btn-sm">{t.trackerFirstAdd}</button>}
          </div>
        </div>
      ) : (
        <div className="table-wrap overflow-x">
          <table>
            <thead>
              <tr>
                <th>{t.trackerColCompany}</th><th>{t.trackerColRole}</th><th>{t.trackerColStatus}</th>
                <th>{t.trackerColDate}</th><th>{t.trackerColNotes}</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => {
                const s = STATUSES.find(s => s.v === a.status);
                return (
                  <tr key={a.id}>
                    <td className="td-main">{a.company}</td>
                    <td style={{ fontSize: 14 }}>{a.role}</td>
                    <td><span className={s?.cls}>{s?.l}</span></td>
                    <td>{a.applied_at ? new Date(a.applied_at).toLocaleDateString(locale) : '—'}</td>
                    <td>{a.notes || '—'}</td>
                    <td>
                      <button onClick={() => openEdit(a)} className="action-edit">{t.trackerEditBtn}</button>
                      {' '}
                      <button onClick={() => handleDelete(a.id)} className="action-del">{t.trackerDeleteBtn}</button>
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
