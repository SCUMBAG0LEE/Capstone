import React from 'react';
import { Link } from 'react-router-dom';
import './app.css';

const About = () => {
  return (
    <div className="home-container">
      <nav className="home-nav">
        <div>{/* Logo here */}</div>
        <div className="home-nav-links">
          <Link to="/" className="home-nav-link">Home</Link>
          <Link to="/predict" className="home-nav-link">Predict</Link>
          <Link to="/about" className="home-nav-link">About</Link>
          <Link to="/login" className="home-nav-link">Login</Link>
        </div>
      </nav>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
        <img
          src="/about.gif"
          alt="About"
          style={{ maxWidth: '500px', width: '100%', borderRadius: '16px', boxShadow: '0 0 24px #0004' }}
        />
      </div>
    </div>
  );
};

export default About;