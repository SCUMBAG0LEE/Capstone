import React from 'react';
import { Link } from 'react-router-dom';
import './app.css';

const NotFound = () => (
  <div className="home-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <nav className="home-nav">
      <div>{/* Logo here if needed */}</div>
      <div className="home-nav-links">
        <Link to="/" className="home-nav-link">Home</Link>
        <Link to="/predict" className="home-nav-link">Predict</Link>
        <Link to="/about" className="home-nav-link">About</Link>
        <Link to="/login" className="home-nav-link">Login</Link>
      </div>
    </nav>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ color: '#fff', fontSize: '48px', marginBottom: '24px' }}>Not Found</h1>
      <img src="/notfound.gif" alt="Not Found" style={{ maxWidth: '400px', width: '100%', borderRadius: '16px', boxShadow: '0 0 24px #0004' }} />
    </div>
  </div>
);

export default NotFound;