import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaUser, FaLock, FaEnvelope, FaUserAlt } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/Register.css';

// Validation schema
const validationSchema = Yup.object({
  firstname: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastname: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
});

const Register = () => {
  const { register } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setError('');

    try {
      // Extract confirmPassword from values
      const { confirmPassword, ...userData } = values;

      // Call the register function from AuthContext
      const result = await register(userData);

      if (result.success) {
        // Redirect to dashboard on successful registration
        navigate('/dashboard', { replace: true });
      } else {
        // Display error message from API
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
      console.error('Registration error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form-wrapper">
        <Link to="/" className="logo">
          IELTS<span>Prep</span>
        </Link>

        <h2 className="title">Create Your Account</h2>

        {error && (
          <div className="error-text" style={{ textAlign: 'center', marginBottom: '15px' }}>
            {error}
          </div>
        )}

        <Formik
          initialValues={{
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            confirmPassword: ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isValid, dirty }) => (
            <Form>
              <div className="field-row">
                <div className="form-group">
                  <div className="icon-wrapper">
                    <FaUser />
                  </div>
                  <Field
                    type="text"
                    name="firstname"
                    placeholder="First Name"
                    className="styled-field"
                  />
                  <ErrorMessage name="firstname" component="div" className="error-text" />
                </div>

                <div className="form-group">
                  <div className="icon-wrapper">
                    <FaUser />
                  </div>
                  <Field
                    type="text"
                    name="lastname"
                    placeholder="Last Name"
                    className="styled-field"
                  />
                  <ErrorMessage name="lastname" component="div" className="error-text" />
                </div>
              </div>

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

              <div className="form-group">
                <div className="icon-wrapper">
                  <FaLock />
                </div>
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="styled-field"
                />
                <ErrorMessage name="confirmPassword" component="div" className="error-text" />
              </div>

              <p className="info-text">
                By signing up, you agree to our Terms of Service and Privacy Policy.
              </p>

              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting || !(isValid && dirty)}
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </Form>
          )}
        </Formik>

        <div className="divider-line">
          <span>OR</span>
        </div>

        <p className="link-text">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
