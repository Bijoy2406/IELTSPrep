import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  FaHome,
  FaUser,
  FaBook,
  FaHistory,
  FaMicrophone,
  FaTicketAlt,
  FaChartLine,
  FaUsers,
  FaTasks,
  FaComments
} from 'react-icons/fa';
import '../../styles/Sidebar.css';

const Sidebar = () => {
  const { user, isAdmin } = useContext(AuthContext);

  // Get initials for avatar
  const getInitials = () => {
    if (!user) return '';
    return `${user.firstname[0]}${user.lastname[0]}`.toUpperCase();
  };

  return (
    <div className="sidebar-container">
      <div className="user-info">
        <div className="avatar">{getInitials()}</div>
        <h3 className="user-name">{user?.firstname} {user?.lastname}</h3>
        <p className="user-role">{user?.role === 'admin' ? 'Administrator' : 'Student'}</p>
      </div>

      <ul className="nav-items">
        {/* Common navigation items for all users */}
        <li className="nav-item">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <FaHome /> Dashboard
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <FaUser /> Profile
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/tests" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <FaBook /> Tests
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/speaking-schedule" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <FaMicrophone /> Speaking Tests
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/support" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <FaTicketAlt /> Support
          </NavLink>
        </li>

        {/* Admin specific navigation items */}
        {isAdmin && (
          <>
            <h4 className="section-title">Administration</h4>

            <li className="nav-item">
              <NavLink to="/admin" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                <FaChartLine /> Admin Dashboard
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/admin/users" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                <FaUsers /> Users
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/admin/tests" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                <FaTasks /> Test Management
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/admin/reviews" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                <FaBook /> Review Tests
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/admin/speaking-schedule" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                <FaMicrophone /> Speaking Schedule
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/admin/support" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                <FaComments /> Support Tickets
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
