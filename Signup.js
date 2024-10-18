import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';
import UpdatePassword from './PasswordReset'; // Import your PasswordReset component
import Modal from './Modal'; // Import your modal.js

const SignupModal = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [message, setMessage] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isUpdatePasswordOpen, setIsUpdatePasswordOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for the new modal
  const navigate = useNavigate();

  const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

  const sendOtp = async () => {
    const otpToSend = generateOtp();
    setGeneratedOtp(otpToSend);

    try {
      // Sending the OTP to the email
      await axios.post('http://localhost:8080/login/send-otp', { email: email.trim(), otp: otpToSend });
      setMessage('OTP sent to your email!');
      setIsOtpSent(true);
    } catch (error) {
      console.error('Error sending OTP:', error);
      setMessage('Failed to send OTP. Please try again.');
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        document.getElementById(otp-input-${index + 1}).focus();
      }
    }
  };

  const verifyOtp = () => {
    if (otp.join('') === generatedOtp) {
      setIsOtpVerified(true);
      setMessage('OTP verified! Proceeding with registration...');
      handleSignup(); // Call the signup function after verification
    } else {
      setMessage('Invalid OTP. Please try again.');
    }
  };

  const handleSignup = async () => {
    try {
      const response = await axios.post('http://localhost:8080/login', {
        username,
        email,
        password,
        role: 'user',
      });

      if (response.status === 200) {
        setMessage('Successfully registered!');
        setTimeout(() => {
          setIsModalOpen(true); // Open the new modal
          onClose(); // Close the signup modal
        }, 3000);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setMessage('Registration failed. Please try again.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isOtpSent) {
      sendOtp();
    } else if (!isOtpVerified) {
      verifyOtp();
    } else {
      handleSignup();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={modal-overlay ${isOpen ? 'open' : ''}} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <input
            type="email"
            className="modal-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
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

          {isOtpSent && (
            <div className="otp-input-container">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={otp-input-${index}}
                  type="text"
                  className="otp-digit-input"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  required
                />
              ))}
            </div>
          )}

          <button type="submit" className="modal-button signin">
            {isOtpSent && !isOtpVerified ? 'Verify OTP' : 'Send OTP'}
          </button>
        </form>

        {message && <p className="modal-message">{message}</p>}

        {isOtpVerified && (
          <UpdatePassword isOpen={isUpdatePasswordOpen} onClose={() => setIsUpdatePasswordOpen(false)} />
        )}

        <div className="modal-footer">
          By signing up, you agree to our <a href="#">Terms of Service</a>. Read our{' '}
          <a href="#">Privacy Policy</a>.
        </div>
      </div>

      {/* Modal Component for Post-Registration Action */}
      {isModalOpen && <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default SignupModal;