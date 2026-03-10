import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllItems, reportFoundItem, claimItem, dispatchItem } from '../services/itemService';
import { useAuth } from '../context/AuthContext';

const STATUS_MAP = {
  LOST:       { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',    label: 'LOST' },
  FOUND:      { color: '#10b981', bg: 'rgba(16,185,129,0.12)',   label: 'FOUND' },
  CLAIMED:    { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',   label: 'CLAIMED' },
  DISPATCHED: { color: '#a855f7', bg: 'rgba(168,85,247,0.12)',   label: 'DISPATCHED' },
};

const Btn = ({ onClick, disabled, color, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      display: 'flex', alignItems: 'center', gap: '0.35rem',
      padding: '0.45rem 0.9rem', borderRadius: '0.625rem',
      fontSize: '0.78rem', fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: 'Inter, sans-serif', transition: 'all 0.2s', opacity: disabled ? 0.5 : 1,
      background: color.bg, color: color.fg, border: `1px solid ${color.border}`,
    }}
  >
    {children}
  </button>
);

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [toast, setToast] = useState('');

  // Access guard
  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (user?.role !== 'ADMIN') { navigate('/'); }
  }, [isAuthenticated, user, navigate]);

  const fetchItems = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const data = await getAllItems();
      setItems(data);
    } catch {
      setError('Could not load items. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handle = async (action, itemId, label) => {
    setBusyId(itemId);
    try {
      await action(itemId, user.username);
      showToast(`✓ ${label} successful`);
      await fetchItems();
    } catch (e) {
      setError(e?.response?.data || e?.message || 'Action failed');
    } finally {
      setBusyId(null);
    }
  };

  if (!isAuthenticated || user?.role !== 'ADMIN') return null;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0.8rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '9999px', color: '#f87171', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
            🛡 ADMIN
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.03em', marginBottom: '0.375rem' }}>Admin Dashboard</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Manage all reported items — mark found, claim, or dispatch
          </p>
        </div>
        <button onClick={fetchItems} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: '#94a3b8', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          Refresh
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: '5.5rem', right: '1.5rem', padding: '0.75rem 1.25rem', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '0.75rem', color: '#34d399', fontWeight: 600, fontSize: '0.875rem', zIndex: 999 }}>
          {toast}
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.875rem 1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.75rem', color: '#f87171', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </div>
      )}

      {/* Summary stats */}
      {!loading && (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {['LOST', 'FOUND', 'CLAIMED', 'DISPATCHED'].map(s => {
            const count = items.filter(i => i.status === s).length;
            const c = STATUS_MAP[s];
            return (
              <div key={s} style={{ flex: '1 1 120px', background: 'rgba(30,41,59,0.5)', border: `1px solid ${c.bg}`, borderRadius: '1rem', padding: '1rem 1.25rem' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: c.color }}>{count}</div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.08em' }}>{s}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Items list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '6rem 2rem', color: '#64748b' }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" style={{ margin: '0 auto 1rem', display: 'block', animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          Loading items…
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', color: '#475569' }}>No items found.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.map(item => {
            const s = STATUS_MAP[item.status] || STATUS_MAP.LOST;
            const busy = busyId === item.id;
            return (
              <div key={item.id}
                style={{ background: 'rgba(30,41,59,0.55)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.125rem', padding: '1.25rem 1.5rem', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', justifyContent: 'space-between' }}>
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
                      <span style={{ padding: '0.2rem 0.65rem', borderRadius: '9999px', background: s.bg, color: s.color, fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em' }}>{s.label}</span>
                      {item.dispatch && (
                        <span style={{ padding: '0.2rem 0.65rem', borderRadius: '9999px', background: 'rgba(168,85,247,0.12)', color: '#c084fc', fontSize: '0.68rem', fontWeight: 700 }}>DISPATCHED ✓</span>
                      )}
                      <span style={{ fontSize: '0.72rem', color: '#475569' }}>#{item.id}</span>
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.25rem' }}>{item.itemName}</h3>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.description}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.78rem', color: '#64748b' }}>
                      <span>📍 {item.location}</span>
                      <span>📅 {item.date}</span>
                      <span>👤 Reported by <b style={{ color: '#94a3b8' }}>{item.reportedByUsername}</b></span>
                      {item.foundByName && <span>🔍 Found by <b style={{ color: '#10b981' }}>{item.foundByName}</b></span>}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {item.status === 'LOST' && (
                      <Btn disabled={busy} onClick={() => handle(reportFoundItem, item.id, 'Mark as Found')}
                        color={{ bg: 'rgba(16,185,129,0.12)', fg: '#34d399', border: 'rgba(16,185,129,0.25)' }}>
                        {busy ? '…' : '✓ Mark Found'}
                      </Btn>
                    )}
                    {item.status === 'FOUND' && (
                      <>
                        <Btn disabled={busy} onClick={() => handle(claimItem, item.id, 'Mark as Claimed')}
                          color={{ bg: 'rgba(59,130,246,0.12)', fg: '#60a5fa', border: 'rgba(59,130,246,0.25)' }}>
                          {busy ? '…' : '📋 Mark Claimed'}
                        </Btn>
                        <Btn disabled={busy} onClick={() => handle(dispatchItem, item.id, 'Dispatch')}
                          color={{ bg: 'rgba(168,85,247,0.12)', fg: '#c084fc', border: 'rgba(168,85,247,0.25)' }}>
                          {busy ? '…' : '🚀 Dispatch'}
                        </Btn>
                      </>
                    )}
                    {item.status === 'CLAIMED' && (
                      <Btn disabled={busy} onClick={() => handle(dispatchItem, item.id, 'Dispatch')}
                        color={{ bg: 'rgba(168,85,247,0.12)', fg: '#c084fc', border: 'rgba(168,85,247,0.25)' }}>
                        {busy ? '…' : '🚀 Dispatch'}
                      </Btn>
                    )}
                    {item.status === 'DISPATCHED' && (
                      <span style={{ fontSize: '0.78rem', color: '#475569', fontStyle: 'italic' }}>No further actions</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
