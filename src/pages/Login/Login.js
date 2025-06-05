import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { signInWithGoogle, auth, signInWithEmailAndPassword } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import VideoBackground from '../../components/VideoBackground/VideoBackground';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
    
    // Update the corresponding state
    if (e.target.name === 'email') {
      setEmail(e.target.value);
    } else if (e.target.name === 'password') {
      setPassword(e.target.value);
    }
  };

  useEffect(() => {
    // Check if user is already logged in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Current user in Login page:', user); // Debugging line
      if (user && window.location.pathname === '/login') {
        navigate('/', { replace: true });
      } else {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setIsLoading(true);
      const result = await signInWithGoogle();
      if (result && result.user) {
        navigate('/', { replace: true });
      }
    } catch (err) {
      console.error('Error signing in with Google:', err);
      setError('Failed to sign in with Google. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors when form is submitted again
    setError('');
    
    // Basic validation
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    
    if (!password) {
      setError('Please enter your password');
      return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Password length validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        navigate('/', { replace: true });
      }
    } catch (err) {
      console.error('Error signing in with email and password:', err);
      let errorMessage = 'Invalid email or password';
      
      // More specific error messages
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later';
      } else if (err.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled';
      }
      
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  // Check auth state once on component mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'No user');
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="login-page">
        <div className="login-content">
          <div className="login-container" style={{ textAlign: 'center' }}>
            <div className="spinner"></div>
            <p>Loading authentication state...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <VideoBackground />
      <div className="login-content">
        <Link to="/" className="logo-link">
          <div className="login-logo">
            <div className="cube"></div>
            <div className="text-logo">CyberPranava</div>
          </div>
        </Link>
        <div className="login-container">
          <h1 className="login-heading">Sign in to CyberPranava</h1>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="form-group">
              <div className="password-label-container">
                <label htmlFor="password">Password</label>
                <Link to="/forgot-password" className="forgot-password">
                  Forgot Password?
                </Link>
              </div>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
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
            
            {error ? (
              <div className="error-message">
                {error}
              </div>
            ) : (
              <button 
                type="submit" 
                className="login-btn" 
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            )}
          </form>
          
          <div className="divider">
            <span>or continue with</span>
          </div>
          
          <div className="social-login">
            <button 
              type="button" 
              className="social-btn google"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <FcGoogle className="social-icon" />
              <span>{isLoading ? 'Signing in...' : 'Sign in with Google'}</span>
            </button>
            <button type="button" className="social-btn linkedin">
              <FaLinkedin className="social-icon" />
              <span>Sign in with LinkedIn</span>
            </button>
            <button type="button" className="social-btn github">
              <FaGithub className="social-icon" />
              <span>Sign in with GitHub</span>
            </button>
          </div>
          
          <div className="signup-link">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
