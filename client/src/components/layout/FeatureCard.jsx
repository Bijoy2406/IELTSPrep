import { Link } from 'react-router-dom';
import { FaCoins, FaPlay } from 'react-icons/fa';

const FeatureCard = ({ icon, title, description, token, link }) => {
  return (
    <div className="feature-card">
      <div className="token-badge">
        <FaCoins /> {token > 0 ? `${token} Token` : "Free"}
      </div>
      
      <div className="feature-icon icon-bounce">
        {icon}
      </div>
      
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
      
      <Link to={link} className="test-button">
        <FaPlay /> {token > 0 ? "Test Now" : "Explore"}
      </Link>
    </div>
  );
};

export default FeatureCard;
