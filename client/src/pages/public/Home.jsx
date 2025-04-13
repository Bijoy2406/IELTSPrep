import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaBook, FaMicrophone, FaPencilAlt, FaHeadphones, FaUsers, FaChartLine } from 'react-icons/fa';
import Layout from '../../components/layout/Layout';
import '../../styles/Home.css';

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Layout>
      <section className="hero-section">
        <h1 className="hero-title">Prepare for IELTS Success</h1>
        <p className="hero-subtitle">
          Practice with realistic IELTS mock tests, receive expert feedback, and track your progress
          to achieve your target band score.
        </p>

        <div className="button-group">
          {isAuthenticated ? (
            <Link to="/dashboard" className="button primary">Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/register" className="button primary">Get Started</Link>
              <Link to="/login" className="button secondary">Log In</Link>
            </>
          )}
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Comprehensive IELTS Preparation</h2>
        <p className="section-subtitle">
          Our platform offers everything you need to prepare for all components of the IELTS exam
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FaHeadphones />
            </div>
            <h3 className="feature-title">Listening Tests</h3>
            <p className="feature-description">
              Practice with authentic listening materials and improve your comprehension skills with our
              timed exercises and detailed answers.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaBook />
            </div>
            <h3 className="feature-title">Reading Practice</h3>
            <p className="feature-description">
              Enhance your reading speed and accuracy with our collection of practice passages,
              covering a wide range of topics and question types.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaPencilAlt />
            </div>
            <h3 className="feature-title">Writing Feedback</h3>
            <p className="feature-description">
              Submit your essays and receive detailed feedback from our experts, helping you
              improve your writing structure, vocabulary, and grammar.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaMicrophone />
            </div>
            <h3 className="feature-title">Speaking Practice</h3>
            <p className="feature-description">
              Book one-on-one speaking sessions with our IELTS examiners to practice your speaking
              skills and receive immediate feedback.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaChartLine />
            </div>
            <h3 className="feature-title">Progress Tracking</h3>
            <p className="feature-description">
              Monitor your improvement with our detailed analytics dashboard. Track your band scores
              across all test components and identify areas for improvement.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaUsers />
            </div>
            <h3 className="feature-title">Community Support</h3>
            <p className="feature-description">
              Connect with other IELTS test-takers and our support team to get your questions
              answered and share preparation tips.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
