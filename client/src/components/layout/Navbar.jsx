import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaUser, FaSignOutAlt, FaUsersCog, FaBars } from 'react-icons/fa';
import '../../styles/Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className="navbar-container">
      <Link to="/" className="logo">
        IELTS<span>Prep</span>
      </Link>

      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/about" className="nav-link">About</Link>
        <Link to="/contact" className="nav-link">Contact</Link>

        {!isAuthenticated ? (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        ) : (
          <div className="user-menu">
            <button className="user-menu-button" onClick={toggleDropdown}>
              <FaUser /> {user?.firstname}
            </button>

            <div className={`user-menu-dropdown ${showDropdown ? 'show' : 'hide'}`}>
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
