import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './app.css';

const AuthPage = () => {
  const [showRegister, setShowRegister] = useState(false);

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
      <div
        className="auth-panel"
        style={{
          background: "#18104a url('/genie-art.png') center center no-repeat",
          backgroundSize: "cover"
        }}
      >
        {/* Overlay for legibility */}
        <div className={`auth-overlay${showRegister ? ' move-right' : ''}`}></div>
        <div className="auth-form-container">
          <div className={`login-form${showRegister ? ' hidden-form' : ''}`}>
            <h2>Login to your Account</h2>
            <p className="auth-subtitle">Welcome back! Select method to log in:</p>
            <div className="social-buttons">
              <button className="google-btn">Google</button>
              <button className="facebook-btn">Facebook</button>
            </div>
            <div className="divider">or continue with email</div>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <div className="form-options">
              <label><input type="checkbox" /> Remember me </label>
              <a href="#" className="forgot-link">Forgot Password?</a>
            </div>
            <button className="auth-btn">LOG IN</button>
            <div className="toggle-link">
              Don't have account?{' '}
              <span onClick={() => setShowRegister(true)}>Create an account</span>
            </div>
          </div>
          <div className={`register-form${showRegister ? '' : ' hidden-form'}`}>
            <h2>Create your account</h2>
            <p className="auth-subtitle">Unlock all Features!</p>
            <input type="text" placeholder="Username" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <input type="password" placeholder="Confirm Password" />
            <label>
              <input type="checkbox" /> Accept terms and conditions
            </label>
            <button className="auth-btn">REGISTER</button>
            <div className="toggle-link">
              You have account?{' '}
              <span onClick={() => setShowRegister(false)}>Login now</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;