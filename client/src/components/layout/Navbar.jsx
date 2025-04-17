import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaUser, FaSignOutAlt, FaUsersCog, FaBars } from 'react-icons/fa';
import '../../styles/Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useContext(AuthContext);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showAboutDropdown, setShowAboutDropdown] = useState(false);
  const [showTutorDropdown, setShowTutorDropdown] = useState(false);

  const toggleUserDropdown = () => setShowUserDropdown(!showUserDropdown);
  const toggleTutorDropdown = () => setShowTutorDropdown(!showTutorDropdown);

  const handleLogout = () => logout();

  return (
    <nav className="navbar-container">
      <Link to="/" className="logo">
        IELTS<span>Prep</span>
      </Link>

      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/dashboard" className="nav-link">Dashboard</Link>

        {/* About Dropdown */}
        <div
          className="nav-link dropdown-parent"
          onMouseEnter={() => setShowAboutDropdown(true)}
          onMouseLeave={() => setShowAboutDropdown(false)}
        >
          About ▾
          {showAboutDropdown && (
            <div className="dropdown-menu">
              <Link to="/services" className="dropdown-item">Services</Link>
              <Link to="/contact" className="dropdown-item">Contact</Link>
            </div>
          )}
        </div>

        {/* Pricing replaces Contact */}
        <Link to="/pricing" className="nav-link">Pricing</Link>

        {/* Hire a Tutor Dropdown */}
        <div
          className="nav-link dropdown-parent"
          onMouseEnter={() => setShowTutorDropdown(true)}
          onMouseLeave={() => setShowTutorDropdown(false)}
        >
          Hire a Tutor ▾
          {showTutorDropdown && (
            <div className="dropdown-menu">
              <Link to="/tutor/private" className="dropdown-item">Private Tutor</Link>
              <Link to="/tutor/speaking" className="dropdown-item">One-to-One Speaking</Link>
              <Link to="/tutor/book" className="dropdown-item">Book a Class</Link>
            </div>
          )}
        </div>

        {!isAuthenticated ? (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        ) : (
          <div className="user-menu">
            <button className="user-menu-button" onClick={toggleUserDropdown}>
              <FaUser /> {user?.firstname}
            </button>

            <div className={`user-menu-dropdown ${showUserDropdown ? 'show' : 'hide'}`}>
              <Link to="/profile" className="user-menu-item">
                <FaUser /> Profile
              </Link>
              {isAdmin && (
                <Link to="/admin" className="user-menu-item">
                  <FaUsersCog /> Admin Dashboard
                </Link>
              )}
              <button className="logout-button" onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        )}
      </div>

      <button className="mobile-menu-button">
        <FaBars />
      </button>
    </nav>
  );
};

export default Navbar;
