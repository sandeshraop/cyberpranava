import React, { useState, useEffect } from 'react';
import { checkAuthStatus, getCurrentUser } from '../../utils/authStatus';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import './AuthStatus.css';

const AuthStatus = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const loggedIn = await checkAuthStatus();
        setIsLoggedIn(loggedIn);
        if (loggedIn) {
          setUser(getCurrentUser());
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="auth-status-container">
        <h2>Checking authentication status...</h2>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="auth-status-container">
      <h2>Authentication Status</h2>
      {isLoggedIn && user ? (
        <div className="auth-details">
          <p>✅ You are logged in!</p>
          <div className="user-info">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>User ID:</strong> {user.uid}</p>
            {user.photoURL && (
              <img 
                src={user.photoURL} 
                alt="Profile" 
                className="profile-pic"
                referrerPolicy="no-referrer"
              />
            )}
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      ) : (
        <div className="auth-details">
          <p>❌ You are not logged in.</p>
          <div className="auth-actions">
            <button onClick={() => navigate('/login')} className="login-btn">
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthStatus;
