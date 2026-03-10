import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserItems, reportFoundItem } from '../services/itemService';
import { useAuth } from '../context/AuthContext';

const STATUS_MAP = {
  LOST: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: 'Lost' },
  FOUND: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', label: 'Found' },
  CLAIMED: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', label: 'Claimed' },
  DISPATCHED: { color: '#a855f7', bg: 'rgba(168,85,247,0.1)', label: 'Dispatched' },
};

const MyReports = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [markingId, setMarkingId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  const fetchMyItems = useCallback(async () => {
    if (!user) return;
    setLoading(true); setError('');
    try {
      const data = await getUserItems(user.username);
      setItems(data);
    } catch {
      setError('Could not load your reports. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchMyItems(); }, [fetchMyItems]);

  const handleMarkFound = async id => {
    setMarkingId(id);
    try {
      await reportFoundItem(id, user.username);
      await fetchMyItems();
    } catch {
      setError('Failed to update item status.');
    } finally {
      setMarkingId(null);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.03em', marginBottom: '0.375rem' }}>My Reports</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Items reported by <span style={{ color: '#818cf8', fontWeight: 600 }}>{user?.username}</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={fetchMyItems} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: '#94a3b8', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' }}>
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
            Refresh
          </button>
          <button onClick={() => navigate('/report')} style={{ padding: '0.625rem 1.5rem', background: '#6366f1', border: '1px solid rgba(99,102,241,0.4)', borderRadius: '0.75rem', color: '#fff', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}>
            + New Report
          </button>
        </div>
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.875rem 1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.75rem', color: '#f87171', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '6rem 2rem', color: '#64748b' }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" style={{ margin: '0 auto 1rem', display: 'block', animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          <p>Loading your reports...</p>
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1.25rem', background: 'rgba(255,255,255,0.01)' }}>
          <svg width="48" height="48" fill="none" stroke="#475569" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: '0 auto 1rem', display: 'block' }}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
          <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.5rem' }}>No reports yet</p>
          <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1.5rem' }}>You haven't reported any items yet.</p>
          <button onClick={() => navigate('/report')} style={{ padding: '0.75rem 1.5rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
            Report an Item
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.map(item => {
            const s = STATUS_MAP[item.status] || STATUS_MAP.LOST;
            return (
              <div key={item.id} style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.125rem', padding: '1.5rem', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: '1rem', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
                      <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', background: s.bg, color: s.color, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        {s.label}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#475569' }}>#{item.id}</span>
                    </div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.375rem' }}>{item.itemName}</h3>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.875rem', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.description}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.8rem', color: '#64748b' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <svg width="13" height="13" fill="none" stroke="#818cf8" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {item.location}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <svg width="13" height="13" fill="none" stroke="#818cf8" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        {item.date}
                      </span>
                    </div>
                  </div>
                  {item.status === 'LOST' && (
                    <button onClick={() => handleMarkFound(item.id)} disabled={markingId === item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.125rem', background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '0.75rem', fontSize: '0.85rem', fontWeight: 600, cursor: markingId === item.id ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' }}>
                      {markingId === item.id ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                      ) : (
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                      {markingId === item.id ? 'Updating...' : 'Mark as Found'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyReports;
