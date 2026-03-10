import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllItems } from '../services/itemService';
import { useAuth } from '../context/AuthContext';

const STATUS_CONFIG = {
  LOST: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: 'LOST' },
  FOUND: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', label: 'FOUND' },
  CLAIMED: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', label: 'CLAIMED' },
  DISPATCHED: { color: '#a855f7', bg: 'rgba(168,85,247,0.1)', label: 'DISPATCHED' },
};

const FILTERS = ['ALL', 'LOST', 'FOUND', 'CLAIMED'];

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllItems();
      setItems(data);
    } catch {
      setError('Could not connect to server. Make sure the backend is running on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const filtered = items.filter(item => {
    const matchFilter = filter === 'ALL' || item.status === filter;
    const matchSearch = !search || item.itemName?.toLowerCase().includes(search.toLowerCase()) || item.location?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,1) 50%, rgba(2,6,23,1) 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '1.5rem',
        padding: '4rem 2rem',
        marginBottom: '3.5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background blobs */}
        <div style={{ position: 'absolute', top: '-5rem', left: '20%', width: '25rem', height: '25rem', background: 'rgba(99,102,241,0.12)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-5rem', right: '20%', width: '20rem', height: '20rem', background: 'rgba(168,85,247,0.08)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '9999px', color: '#818cf8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            <span style={{ width: 8, height: 8, background: '#818cf8', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
            Campus Lost &amp; Found Platform
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, color: '#f1f5f9', lineHeight: 1.1, marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
            Find What You Lost<br />on Campus
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#94a3b8', maxWidth: '36rem', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Lock&amp;Found connects people who've lost items with those who found them. Report a missing item or help someone today.
          </p>

          {/* Search bar */}
          <div style={{ maxWidth: '38rem', margin: '0 auto', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#818cf8', display: 'flex', alignItems: 'center' }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by item name or location..."
              style={{ width: '100%', boxSizing: 'border-box', padding: '1rem 1.5rem 1rem 3.5rem', background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.875rem', color: '#f1f5f9', fontSize: '1rem', outline: 'none', fontFamily: 'Inter, sans-serif' }}
            />
          </div>

          {!isAuthenticated && (
            <p style={{ marginTop: '1.5rem', color: '#64748b', fontSize: '0.9rem' }}>
              <button onClick={() => navigate('/register')} style={{ color: '#818cf8', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Create an account</button>
              {' '}to report a lost or found item.
            </p>
          )}
        </div>
      </div>

      {/* Recent Reports */}
      <div>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>Recent Reports</h2>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
              {loading ? 'Loading...' : `${filtered.length} item${filtered.length !== 1 ? 's' : ''} found`}
            </p>
          </div>
          {/* Filter dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              style={{
                padding: '0.5rem 2.25rem 0.5rem 1rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                background: 'rgba(30,41,59,0.8)',
                color: '#f1f5f9',
                border: '1px solid rgba(99,102,241,0.35)',
                borderRadius: '0.75rem',
                cursor: 'pointer',
                outline: 'none',
                fontFamily: 'Inter, sans-serif',
                appearance: 'none',
                WebkitAppearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23818cf8' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
                boxShadow: '0 4px 15px rgba(99,102,241,0.15)',
                transition: 'border-color 0.2s',
              }}
            >
              {FILTERS.map(f => (
                <option key={f} value={f} style={{ background: '#1e293b', color: '#f1f5f9' }}>
                  {f}
                </option>
              ))}
            </select>
            <button onClick={fetchItems} title="Refresh" style={{ padding: '0.5rem 0.625rem', background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.75rem', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}>
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
            </button>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.875rem', color: '#f87171', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}

        {/* Loading skeletons */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ background: 'rgba(30,41,59,0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1rem', padding: '1.5rem', animation: 'pulse 1.5s infinite' }}>
                <div style={{ height: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', marginBottom: '1rem', width: '40%' }} />
                <div style={{ height: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', marginBottom: '0.75rem', width: '70%' }} />
                <div style={{ height: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', marginBottom: '0.5rem' }} />
                <div style={{ height: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', width: '60%' }} />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1.25rem', background: 'rgba(255,255,255,0.01)' }}>
            <svg width="48" height="48" fill="none" stroke="#64748b" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: '0 auto 1rem' }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.5rem' }}>No items found</p>
            <p style={{ fontSize: '0.875rem', color: '#475569' }}>Try changing the filter or search query.</p>
            {isAuthenticated && (
              <button onClick={() => navigate('/report')} style={{ marginTop: '1.5rem', padding: '0.75rem 1.5rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '0.75rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
                Report an Item
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {filtered.map(item => {
              const s = STATUS_CONFIG[item.status] || STATUS_CONFIG.LOST;
              return (
                <div key={item.id} style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.25rem', overflow: 'hidden', transition: 'all 0.25s', cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(99,102,241,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
                      <div style={{ padding: '0.5rem', borderRadius: '0.625rem', background: s.bg }}>
                        <svg width="16" height="16" fill="none" stroke={s.color} strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      </div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', color: s.color, textTransform: 'uppercase' }}>{s.label}</span>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.itemName}</h3>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.6 }}>{item.description}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#64748b' }}>
                        <svg width="14" height="14" fill="none" stroke="#818cf8" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        <span>{item.location}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#64748b' }}>
                        <svg width="14" height="14" fill="none" stroke="#818cf8" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: '0.875rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.15)', fontSize: '0.8rem', color: '#475569' }}>
                    Reported by <span style={{ color: '#94a3b8', fontWeight: 600 }}>{item.reportedByUsername}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
