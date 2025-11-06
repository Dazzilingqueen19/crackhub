import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>CrackHub</h3>
          <p>Your ultimate destination for interview preparation and career growth.</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/practice">Practice</a></li>
            <li><a href="/resources">Resources</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Companies</h4>
          <ul>
            <li><a href="/company/amazon">Amazon</a></li>
            <li><a href="/company/tcs">TCS</a></li>
            <li><a href="/company/infosys">Infosys</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>Email: support@crackhub.com</p>
          <div className="social-links">
            <span>🌐</span>
            <span>💼</span>
            <span>📱</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} CrackHub. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;