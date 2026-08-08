import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import cloudLogo from '../assets/cloud1.png';
import './ForgotPasswordPage.css';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Simulate API call
      setTimeout(() => setIsSent(true), 1000);
    }
  };

  return (
    <div className="forgot-page">
      <header className="forgot-header">
        <div className="header-logo">
          <img src={cloudLogo} alt="Cloud Orchestrator Logo" className="cloud-icon" />
          <span className="logo-text">Cloud Orchestrator</span>
        </div>
        <Link to="/login" className="back-link-top">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Login
        </Link>
      </header>

      <main className="forgot-main">
        <div className="forgot-card">
          <div className="icon-circle">
            <svg className="envelope-lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="14" y="11" width="7" height="5" rx="1" fill="white" stroke="#6366F1" strokeWidth="1.5"/>
              <path d="M15.5 11V9.5a2 2 0 014 0V11" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          
          <h1>Forgot Password?</h1>
          <p className="description">
            No worries! Enter your email address and we'll send you a link to reset your password.
          </p>

          {!isSent ? (
            <>
              <form className="forgot-form" onSubmit={handleSubmit}>
                <div className="form-group-light">
                  <label htmlFor="reset-email">Email Address</label>
                  <div className="input-wrapper-light">
                    <svg className="input-icon-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <input
                      id="reset-email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="reset-btn">
                  Send Reset Link
                </button>
              </form>

              <div className="divider-light">
                <span>or</span>
              </div>

              <button type="button" className="security-questions-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Reset using Security Questions
              </button>
            </>
          ) : (
            <div className="success-message">
              Reset link sent! Please check your inbox.
            </div>
          )}

          <Link to="/login" className="back-link-bottom">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Login
          </Link>
        </div>

        <div className="info-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="info-icon">
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="info-content">
            <h4>Secure Password Reset</h4>
            <p>We'll send a secure link to your email. The link will expire in 15 minutes.</p>
          </div>
        </div>
      </main>

      <footer className="forgot-footer">
        © 2024 Cloud Orchestrator. All rights reserved.
      </footer>
    </div>
  );
}

export default ForgotPasswordPage;
