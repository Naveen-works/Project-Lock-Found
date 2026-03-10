import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const navLink = { textDecoration: 'none', color: '#94a3b8', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' };

  return (
    <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(16px)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '5rem' }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{ background: 'rgba(99,102,241,0.15)', padding: '0.5rem', borderRadius: '0.75rem', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center' }}>
            <svg width="22" height="22" fill="none" stroke="#818cf8" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
            Lock<span style={{ color: '#818cf8', fontWeight: 300 }}>&</span>Found
          </span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          <Link to="/" style={navLink} onMouseEnter={e => e.target.style.color = '#f1f5f9'} onMouseLeave={e => e.target.style.color = '#94a3b8'}>Home</Link>
          {isAuthenticated && (
            <Link to="/my-reports" style={navLink} onMouseEnter={e => e.target.style.color = '#f1f5f9'} onMouseLeave={e => e.target.style.color = '#94a3b8'}>My Reports</Link>
          )}
          {isAuthenticated && user?.role === 'ADMIN' && (
            <Link to="/admin" style={{ ...navLink, color: '#fbbf24' }} onMouseEnter={e => e.target.style.color = '#fde68a'} onMouseLeave={e => e.target.style.color = '#fbbf24'}>🛡 Admin</Link>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {isAuthenticated ? (
              <>
                {/* User badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.875rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.75rem' }}>
                  <svg width="16" height="16" fill="none" stroke="#818cf8" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#e2e8f0' }}>{user.username}</span>
                  <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', background: 'rgba(99,102,241,0.15)', color: '#818cf8', borderRadius: '9999px', fontWeight: 700 }}>{user.role}</span>
                </div>

                <button onClick={() => navigate('/report')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', background: '#6366f1', color: '#fff', border: '1px solid rgba(99,102,241,0.4)', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}>
                  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                  Report Item
                </button>

                <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1rem', background: 'transparent', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.75rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; }} onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
                  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  Sign out
                </button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/login')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.125rem', background: 'transparent', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.75rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'color 0.2s' }}>
                  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                  Sign in
                </button>
                <button onClick={() => navigate('/register')} style={{ padding: '0.625rem 1.25rem', background: '#6366f1', color: '#fff', border: '1px solid rgba(99,102,241,0.4)', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}>
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
