import { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import '../../styles/Layout.css';

const Layout = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const spotlightRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      if (spotlightRef.current) {
        spotlightRef.current.style.background = `
          radial-gradient(
            circle at ${clientX}px ${clientY}px,
             rgba(0, 128, 128, 0.2) 0%,       /* Teal Blue center */
          rgba(173, 216, 230, 0.15) 40%,   /* Light Blue middle */
          rgba(211, 211, 211, 0.1) 100%    /* Light Gray edge */
          )
        `;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="layout-container">
    {/* Spotlight background effect */}
    <div className="spotlight-overlay" ref={spotlightRef}></div>
  
    <Navbar />
    <div className="main-content">
      {isAuthenticated && <Sidebar />}
      <div className="content-area">{children}</div>
    </div>
    <Footer />
  </div>
  
  );
};

export default Layout;
