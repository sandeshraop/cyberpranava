import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { signInWithGoogle, signUpWithEmailPassword } from '../../firebase';
import VideoBackground from '../../components/VideoBackground/VideoBackground';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const { name, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    // Clear any existing errors when user starts typing
    if (error) {
      setError('');
    }
    
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password should be at least 6 characters');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      console.log('Starting signup process...');
      
      // Create user and store data in Firestore
      const user = await signUpWithEmailPassword(email, password, name);
      console.log('Signup successful, user:', user);
      
      // Show success message and redirect to home page
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      console.error('Error in signup process:', {
        error: err,
        message: err.message,
        code: err.code,
        stack: err.stack
      });
      
      // Handle specific error cases
      if (err.code === 'auth/email-already-in-use') {
        setError('Account Already Exists');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters long.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError('Failed to create an account. Please try again.');
      }
      
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setError('');
      await signInWithGoogle();
      // The onAuthStateChanged in App.js will handle the redirect
    } catch (err) {
      console.error('Error signing up with Google:', err);
      setError('Failed to sign up with Google. Please try again.');
    }
  };

  return (
    <div className="signup-page">
      <VideoBackground />
      <div className="signup-content">
        <div className="signup-container">
          <div className="signup-logo">
            <h1>CYBERPRANAVA</h1>
          </div>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  minLength="6"
                />
                <button 
                  type="button" 
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                minLength="6"
              />
            </div>
            
            {error ? (
              <div className="account-exists-message">
                {error}
              </div>
            ) : (
              <button 
                type="submit" 
                className="login-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            )}
          </form>
          
          {!error && (
            <>
              <div className="divider">
                <span>or sign up with</span>
              </div>
              
              <div className="social-login">
                <button 
                  type="button" 
                  className="social-btn google"
                  onClick={handleGoogleSignUp}
                  disabled={isLoading}
                >
                  <FcGoogle className="social-icon" />
                  <span>Sign up with Google</span>
                </button>
                <button 
                  type="button" 
                  className="social-btn linkedin"
                  disabled={isLoading}
                >
                  <FaLinkedin className="social-icon" />
                  <span>Sign up with LinkedIn</span>
                </button>
                <button 
                  type="button" 
                  className="social-btn github"
                  disabled={isLoading}
                >
                  <FaGithub className="social-icon" />
                  <span>Sign up with GitHub</span>
                </button>
              </div>
            </>
          )}
          {success && (
          <div className="success-message">
            Account created successfully! Redirecting to home page...
          </div>
        )}
          
          <div className="signup-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
