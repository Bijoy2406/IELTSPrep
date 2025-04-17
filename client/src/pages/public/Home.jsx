import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import FeatureCard from '../../components/layout/FeatureCard';
import features from '../../Data/features.jsx'
import { 
  FaBook, FaMicrophone, FaPencilAlt, FaHeadphones, 
  FaChartLine, FaGem, FaRocket, FaRegLightbulb, FaUsers ,FaCoins  , FaPlay
} from 'react-icons/fa';
import Layout from '../../components/layout/Layout';
import '../../styles/Home.css';


const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Layout>
   {/* Hero Section */}
   <section className="hero-section">
  <div className="hero-content">
  <h2 className="hero-title">
    Crack IELTS with Confidence
  </h2>
    <div className="hero-subtitle">
    <p>AI-Powered Mock Tests & Real-Time Feedback</p>
    <p>Boost Your Speaking, Track Progress — All at Unbeatable Prices</p>
    <p><strong>Start your free trial today!</strong></p>
    </div>
    <div className="button-group">
      {isAuthenticated ? (
        <Link to="/dashboard" className="button primary">Go to Dashboard</Link>
      ) : (
        <>
          <Link to="/demo" className="button primary">Try Free Demo</Link>
          <Link to="/register" className="button secondary">Sign Up</Link>
        </>
      )}
    </div>
  </div>
</section>



      {/* Features Section (Your Original Content) */}
      <section className="features-section">
        <div className="features-container">
          <h2 className="section-title">Comprehensive IELTS Preparation</h2>
           <h4 className="section-subtitle"> Our services for your best outcome  </h4>
          <div className="features-carousel">
            <div className="carousel-container">
              <div className="carousel-track">
                {/* Original Cards */}
                {features.map((feature, index) => (
                  <FeatureCard key={`original-${index}`} {...feature} animate />
                ))}
                
                {/* Duplicate Cards for seamless looping */}
                {features.map((feature, index) => (
                  <FeatureCard key={`duplicate-${index}`} {...feature} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* How It Works */}
      <section className="guide-section">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Take a Mock Test</h3>
            <p>Complete full-length tests under exam conditions</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Get AI Feedback</h3>
            <p>Receive instant scoring and detailed analysis</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Improve Weak Areas</h3>
            <p>Use personalized recommendations to boost your score</p>
          </div>
        </div>
      </section>

      {/* Daily Vocab & Mock Test Box */}
      <section className="practice-section">
        <div className="practice-container">
          <div className="vocab-box">
            <h3><FaRegLightbulb /> Daily Vocabulary</h3>
            <div className="vocab-card">
              <h4>Ubiquitous</h4>
              <p className="definition">(adj) present everywhere</p>
              <p className="example">Example: Smartphones have become ubiquitous in modern society.</p>
            </div>
            <button className="vocab-button">Get More Words</button>
          </div>
          
          <div className="mock-box">
  <div className="token-badge-mock">
    <FaCoins /> 5 Token
  </div>

  <h3><FaRocket /> Full Mock Test</h3>
  <p>Complete all 4 modules in one sitting (2 hours 45 minutes)</p>

  <div className="mock-modules">
    <span>Listening</span>
    <span>Reading</span>
    <span>Writing</span>
    <span>Speaking</span>
  </div>

  <Link to="/test" className="button primary">Start Test (5 Token)</Link>
</div>

        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section">
        <h2 className="section-title">Choose Your Plan</h2>
        <div className="pricing-cards">
          <div className="pricing-card">
            <div className="pricing-header">
              <h3>Free</h3>
              <div className="price">$0</div>
            </div>
            <ul className="features-list">
              <li>4 tokens (1 per module)</li>
              <li>Basic feedback</li>
              <li>Limited access</li>
            </ul>
            <button className="pricing-button">Current Plan</button>
          </div>
          
          <div className="pricing-card featured">
            <div className="pricing-header">
              <h3>Standard</h3>
              <div className="price">$9.99<span>/month</span></div>
            </div>
            <ul className="features-list">
              <li>100 tokens/month</li>
              <li>AI-powered feedback</li>
              <li>Vocabulary generator</li>
              <li>Progress analytics</li>
            </ul>
            <button className="pricing-button primary">Upgrade</button>
          </div>
          
          <div className="pricing-card">
            <div className="pricing-header">
              <h3>Premium</h3>
              <div className="price">$99<span>/lifetime</span></div>
            </div>
            <ul className="features-list">
              <li>Unlimited tokens</li>
              <li>Priority feedback</li>
              <li>All premium features</li>
              <li>Teacher consultations</li>
            </ul>
            <button className="pricing-button">Get Premium</button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;