import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';

const inputStyle = {
  width: '100%', boxSizing: 'border-box', padding: '0.875rem 1rem',
  background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '0.75rem', color: '#f1f5f9', fontSize: '0.95rem',
  outline: 'none', fontFamily: 'Inter, sans-serif', transition: 'border-color 0.2s',
};

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      await registerUser(formData);
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      setError(err.response?.data || 'Registration failed. Username or email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '440px', background: 'rgba(30,41,59,0.5)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.4)' }}>
        {/* Top gradient bar */}
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #a855f7, #6366f1, #a855f7)' }} />

        <div style={{ padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '3.5rem', height: '3.5rem', background: 'rgba(168,85,247,0.15)', borderRadius: '1rem', border: '1px solid rgba(168,85,247,0.2)', marginBottom: '1.25rem' }}>
              <svg width="24" height="24" fill="none" stroke="#c084fc" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.375rem', letterSpacing: '-0.02em' }}>Create Account</h1>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Join Lock&amp;Found to report or find items</p>
          </div>

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
            {[
              { label: 'Username', name: 'username', type: 'text', placeholder: 'Choose a username' },
              { label: 'Email Address', name: 'email', type: 'email', placeholder: 'you@campus.edu' },
              { label: 'Password', name: 'password', type: 'password', placeholder: '••••••••' },
            ].map(field => (
              <div key={field.name} style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.5rem' }}>{field.label}</label>
                <input type={field.type} name={field.name} value={formData[field.name]} onChange={handleChange} placeholder={field.placeholder} required minLength={field.name === 'password' ? 6 : undefined} style={inputStyle} />
              </div>
            ))}
            <div style={{ marginTop: '0.5rem' }}>
              <button type="submit" disabled={loading || !!success} style={{ width: '100%', padding: '0.9rem', background: loading ? '#7c3aedaa' : '#9333ea', color: '#fff', border: '1px solid rgba(168,85,247,0.4)', borderRadius: '0.75rem', fontWeight: 700, fontSize: '1rem', cursor: loading || success ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: '0 8px 20px rgba(168,85,247,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: 'Inter, sans-serif' }}>
                {loading ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    Creating account...
                  </>
                ) : 'Create Account'}
              </button>
            </div>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.75rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.07)', fontSize: '0.875rem', color: '#64748b' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#c084fc', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
