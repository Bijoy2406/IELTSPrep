import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="section-title">About IELTSPrep</h3>
          <p>
            We are dedicated to helping students prepare for the IELTS exam with comprehensive
            practice tests, expert feedback, and personalized learning resources.
          </p>
          <div className="social-links">
            <a href="#" className="social-link" target="_blank" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="#" className="social-link" target="_blank" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="#" className="social-link" target="_blank" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" className="social-link" target="_blank" aria-label="YouTube">
              <FaYoutube />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="section-title">Quick Links</h3>
          <ul className="footer-nav">
            <li className="footer-nav-item">
              <Link to="/" className="footer-link">Home</Link>
            </li>
            <li className="footer-nav-item">
              <Link to="/about" className="footer-link">About Us</Link>
            </li>
            <li className="footer-nav-item">
              <Link to="/tests" className="footer-link">Practice Tests</Link>
            </li>
            <li className="footer-nav-item">
              <Link to="/speaking-schedule" className="footer-link">Speaking Practice</Link>
            </li>
            <li className="footer-nav-item">
              <Link to="/support" className="footer-link">Help & Support</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="section-title">IELTS Resources</h3>
          <ul className="footer-nav">
            <li className="footer-nav-item">
              <Link to="#" className="footer-link">Listening Tips</Link>
            </li>
            <li className="footer-nav-item">
              <Link to="#" className="footer-link">Reading Strategies</Link>
            </li>
            <li className="footer-nav-item">
              <Link to="#" className="footer-link">Writing Templates</Link>
            </li>
            <li className="footer-nav-item">
              <Link to="#" className="footer-link">Speaking Practice</Link>
            </li>
            <li className="footer-nav-item">
              <Link to="#" className="footer-link">Grammar Review</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="section-title">Contact Us</h3>
          <div className="contact-item">
            <FaMapMarkerAlt />
            <span>123 Exam Street, Learn City</span>
          </div>
          <div className="contact-item">
            <FaPhone />
            <span>+1 (555) 123-4567</span>
          </div>
          <div className="contact-item">
            <FaEnvelope />
            <span>support@ieltsprep.com</span>
          </div>
        </div>
      </div>

      <div className="copyright">
        &copy; {currentYear} IELTSPrep. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
