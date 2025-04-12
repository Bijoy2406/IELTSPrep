import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1 className="logo">
          IELTS<span>Prep</span>
        </h1>
        <div className="user-info">
          <div className="user-name">
            {user?.firstname} {user?.lastname}
          </div>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="card">
        <h2 className="welcome-message">Welcome to IELTS Prep Platform!</h2>
        <p>
          This is a placeholder dashboard. In a real application, you would see
          your test history, upcoming speaking tests, study recommendations, and more.
        </p>

        {user && (
          <div>
            <h3>Your Profile</h3>
            <p><strong>Name:</strong> {user.firstname} {user.lastname}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            {user.targetBand && (
              <p><strong>Target Band:</strong> {user.targetBand}</p>
            )}
            {user.examDate && (
              <p><strong>Exam Date:</strong> {new Date(user.examDate).toLocaleDateString()}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
