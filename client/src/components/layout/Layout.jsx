import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import '../../styles/Layout.css';

const Layout = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="layout-container">
      <Navbar />
      <div className="main-content">
        {isAuthenticated && <Sidebar />}
        <div className="content-area">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
