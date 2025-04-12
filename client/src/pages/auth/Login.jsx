import { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/Login.css';

// Validation schema
const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
});

const Login = () => {
  const { login } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setError('');

    try {
      // Call the login function from AuthContext
      const result = await login(values.email, values.password);

      if (result.success) {
        // Navigate to the redirect path or dashboard
        navigate(from, { replace: true });
      } else {
        // Display error message from API
        setError(result.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <Link to="/" className="logo">
          IELTS<span>Prep</span>
        </Link>

        <h2 className="title">Login to Your Account</h2>

        {error && (
          <div className="error-text" style={{ textAlign: 'center', marginBottom: '15px' }}>
            {error}
          </div>
        )}

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isValid, dirty }) => (
            <Form>
              <div className="form-group">
                <div className="icon-wrapper">
                  <FaEnvelope />
                </div>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="styled-field"
                />
                <ErrorMessage name="email" component="div" className="error-text" />
              </div>

              <div className="form-group">
                <div className="icon-wrapper">
                  <FaLock />
                </div>
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="styled-field"
                />
                <ErrorMessage name="password" component="div" className="error-text" />
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting || !(isValid && dirty)}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </Form>
          )}
        </Formik>

        <p className="link-text">
          <Link to="/forgot-password">Forgot your password?</Link>
        </p>

        <div className="divider-line">
          <span>OR</span>
        </div>

        <p className="link-text">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
