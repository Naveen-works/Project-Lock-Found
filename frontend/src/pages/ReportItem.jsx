import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportLostItem } from '../services/itemService';
import { useAuth } from '../context/AuthContext';

const inputStyle = {
  width: '100%', boxSizing: 'border-box', padding: '0.875rem 1rem',
  background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '0.75rem', color: '#f1f5f9', fontSize: '0.95rem',
  outline: 'none', fontFamily: 'Inter, sans-serif', transition: 'border-color 0.2s',
};

const labelStyle = {
  display: 'block', fontSize: '0.85rem', fontWeight: 600,
  color: '#cbd5e1', marginBottom: '0.5rem',
};

const ReportItem = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [type, setType] = useState('lost');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    itemName: '', description: '', location: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      // Include `type` ("lost" or "found") so the backend sets the correct ItemStatus
      await reportLostItem({ ...form, type }, user.username);
      setSuccess('Report submitted successfully!');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  const accentColor = type === 'lost' ? '#6366f1' : '#10b981';
  const accentShadow = type === 'lost' ? 'rgba(99,102,241,0.3)' : 'rgba(16,185,129,0.3)';

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      {/* Page header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '4rem', height: '4rem', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '1.25rem', marginBottom: '1.25rem' }}>
          <svg width="28" height="28" fill="none" stroke="#818cf8" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>Report an Item</h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem' }}>Help the community by providing accurate details</p>
      </div>

      {/* Card */}
      <div style={{ background: 'rgba(30,41,59,0.5)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1.5rem', padding: '2.5rem', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>

        {/* Type toggle */}
        <div style={{ display: 'flex', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '0.875rem', padding: '0.375rem', marginBottom: '2rem' }}>
          {[{ id: 'lost', label: 'I Lost Something', color: '#6366f1', shadow: 'rgba(99,102,241,0.3)' }, { id: 'found', label: 'I Found Something', color: '#10b981', shadow: 'rgba(16,185,129,0.3)' }].map(opt => (
            <button key={opt.id} type="button" onClick={() => setType(opt.id)} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.625rem', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif', background: type === opt.id ? opt.color : 'transparent', color: type === opt.id ? '#fff' : '#94a3b8', boxShadow: type === opt.id ? `0 4px 15px ${opt.shadow}` : 'none' }}>
              {opt.label}
            </button>
          ))}
        </div>

        {/* Feedback msgs */}
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.875rem 1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.75rem', color: '#f87171', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}
        {success && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.875rem 1rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '0.75rem', color: '#34d399', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Item Name <span style={{ color: accentColor }}>*</span></label>
            <input type="text" name="itemName" value={form.itemName} onChange={handleChange} placeholder="e.g. Apple AirPods Pro (White case)" required style={inputStyle} />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Description <span style={{ color: accentColor }}>*</span></label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe color, brand, size, unique markings, serial number..." required rows={5} style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={labelStyle}>{type === 'lost' ? 'Last Seen Location' : 'Found Location'} <span style={{ color: accentColor }}>*</span></label>
              <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Library, Floor 2" required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>{type === 'lost' ? 'Date Lost' : 'Date Found'} <span style={{ color: accentColor }}>*</span></label>
              <input type="date" name="date" value={form.date} onChange={handleChange} required style={inputStyle} />
            </div>
          </div>

          {/* Reporting as */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '2rem', fontSize: '0.85rem', color: '#64748b' }}>
            <svg width="15" height="15" fill="none" stroke="#475569" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Reporting as <strong style={{ color: '#94a3b8', marginLeft: '0.25rem' }}>{user?.username}</strong>
          </div>

          <button type="submit" disabled={loading || !!success} style={{ width: '100%', padding: '1rem', background: loading ? `${accentColor}aa` : accentColor, color: '#fff', border: `1px solid ${accentColor}66`, borderRadius: '0.875rem', fontWeight: 700, fontSize: '1rem', cursor: loading || success ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${accentShadow}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem', fontFamily: 'Inter, sans-serif' }}>
            {loading ? (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                Submitting...
              </>
            ) : (
              <>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="22 2 11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                {type === 'lost' ? 'Submit Lost Item Report' : 'Submit Found Item Report'}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportItem;
