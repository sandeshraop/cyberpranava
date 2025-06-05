import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import './Header.css';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo-link">
            <div className="logo">
              <div className="cube"></div>
              <div className="text-logo">CyberPranava</div>
            </div>
          </Link>
          <nav className="nav-menu">
            <ul>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/solutions">Solutions</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/resources">Resources</Link></li>
              <li><a href="https://cyberpranava.com/" target="_blank" rel="noopener noreferrer">Company</a></li>
              <li><Link to="/business">Business</Link></li>
            </ul>
          </nav>
        </div>
        <div className="header-right">
          {isLoggedIn ? (
            <>
              <span className="welcome-text">Welcome, {user?.displayName || user?.email?.split('@')[0]}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="get-started-btn"><span>Login</span></Link>
              <Link to="/signup" className="get-started-btn"><span>Get Started</span></Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
