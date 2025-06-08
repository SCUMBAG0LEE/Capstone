import React from 'react';
import { Link } from 'react-router-dom';
import './app.css';

const Home = () => {
    return (
        <div className="home-container">
            <nav className="home-nav">
                <div>
                    {/* Logo here */}
                </div>
                <div className="home-nav-links">
                    <Link to="/" className="home-nav-link">Home</Link>
                    <Link to="/predict" className="home-nav-link">Predict</Link>
                    <Link to="/about" className="home-nav-link">About</Link>
                    <Link to="/login" className="home-nav-link">Login</Link>
                </div>
            </nav>
            <div className="home-main">
                <div>
                    <h1 className="home-title">SignalX</h1>
                    <p className="home-subtitle">Your stock prediction genie</p>
                </div>
                <img
                    src="/QQ.webp"
                    alt="Genie"
                    className="genie-art"
                />
            </div>
        </div>
    );
};

export default Home;