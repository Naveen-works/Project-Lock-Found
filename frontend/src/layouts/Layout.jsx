import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Layout = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#020617', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
            <Navbar />
            <main style={{ flexGrow: 1, width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '3rem 2rem' }}>
                <Outlet />
            </main>
            <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(15,23,42,0.8)', padding: '2rem', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
                © {new Date().getFullYear()} Lock&amp;Found. Campus Lost and Found system.
            </footer>
        </div>
    );
};

export default Layout;
