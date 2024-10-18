import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import OTPVerification from './OTPVerification'; // Import the OTPVerification component
import './Modal.css';

const Modal = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false); // State for OTP verification modal
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/login/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert('Login failed: Invalid username or password.');
        } else {
          alert(Login failed: Server responded with status ${response.status}.);
        }
        return;
      }

      const result = await response.json();
      if (result.success) {
        const { id, role, email } = result;

        // Save user info to local storage
        localStorage.setItem('userId', id);
        localStorage.setItem('username', username);
        localStorage.setItem('role', role);
        localStorage.setItem('email', email);

        // Navigate based on role
        if (role === 'admin') {
          navigate('/AdminDashboard');
        } else {
          navigate('/Dashboard');
        }
      } else {
        alert('Login failed: ' + result.message);
      }
    } catch (error) {
      console.error('Error during fetch:', error);
      alert('Login failed: Network error or server not responding.');
    }
  };

  const handleForgotPassword = () => {
    onClose(); // Close the current modal
    setTimeout(() => {
      setIsOtpModalOpen(true); // Open the OTP verification modal after a delay
    }, 300); // Adjust the delay to match your modal's transition duration
  };

  return (
    <>
      <div className={modal-overlay ${isOpen ? 'open' : ''}} onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>Hello!</h2>
          <p>Use your username and password to continue with ChronoCraft.</p>
          <form onSubmit={handleLogin} className="modal-form">
            <input
              type="text"
              className="modal-input"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              className="modal-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="modal-button signin">
              Sign In
            </button>
          </form>
          <div className="modal-footer">
            <Link to="#" onClick={handleForgotPassword} className="reset-link">
              Forgot password?
            </Link>
            <p>
              By continuing, you agree to our <a href="#">Terms of Service</a>. Read our{' '}
              <a href="#">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
      <OTPVerification isOpen={isOtpModalOpen} onClose={() => setIsOtpModalOpen(false)} /> {/* Render OTP Verification modal */}
    </>
  );
};

export default Modal;