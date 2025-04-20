import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../styles/PasswordToggle.css';

const PasswordToggle = ({ field, form }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="password-field">
      <input
        {...field}
        type={showPassword ? "text" : "password"}
        className="styled-field"
        placeholder={field.name === "confirmPassword" ? "Confirm Password" : "Password"}
      />
      <button
        type="button"
        className="password-toggle"
        onClick={togglePasswordVisibility}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  );
};

export default PasswordToggle;
