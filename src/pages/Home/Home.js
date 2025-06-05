import React from 'react';
import { Link } from 'react-router-dom';
import VideoBackground from '../../components/VideoBackground/VideoBackground';
import './Home.css';
import './ClientsSection.css';

const Home = () => {

  return (
    <div className="home-container">
      <VideoBackground />
      <div className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">CYBERPRANAVA</h1>
            <div className="hero-description">
              <p>A leading <span className="highlight">Cyber Security</span> firm with</p>
              <div className="skills-grid">
                <span className="skill-tag">Professionals</span>
                <span className="skill-tag">Hackers</span>
                <span className="skill-tag">Security Experts</span>
              </div>
            </div>
          </div>
        </section>

        {/* Client Logos Section */}
        <section className="clients-section">
          <h2>Trusted by leading companies</h2>
          <div className="logos-scroll">
            {['google', 'amazon', 'microsoft', 'apple', 'meta', 'netflix', 'spotify', 'twitter', 'slack', 'github'].map((company, index) => (
              <div key={index} className="logo-item">
                <i className={`fab fa-${company}`}></i>
              </div>
            ))}
            {/* Duplicate logos for seamless loop */}
            {['google', 'amazon', 'microsoft', 'apple', 'meta', 'netflix', 'spotify', 'twitter', 'slack', 'github'].map((company, index) => (
              <div key={`dup-${index}`} className="logo-item">
                <i className={`fab fa-${company}`}></i>
              </div>
            ))}
          </div>
        </section>

        {/* Services Section */}
        <section className="services-section">
          <h2 className="section-title">Our Services</h2>
          <div className="services-grid">
            {[
              {
                icon: 'shield-alt',
                title: 'Penetration Testing',
                description: 'Comprehensive security assessments to identify vulnerabilities in your systems before attackers do.'
              },
              {
                icon: 'search',
                title: 'Vulnerability Assessment',
                description: 'Thorough analysis of your digital assets to find and fix security weaknesses.'
              },
              {
                icon: 'code',
                title: 'Secure Development',
                description: 'Building secure applications with security best practices integrated into the development lifecycle.'
              },
              {
                icon: 'user-shield',
                title: 'Security Training',
                description: 'Customized training programs to empower your team with the latest security knowledge.'
              }
            ].map((service, index) => (
              <div key={index} className="service-card">
                <i className={`fas fa-${service.icon} service-icon`}></i>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Latest News Section */}
        <section className="news-section">
          <div className="news-container">
            <div className="news-content-wrapper">
              <div className="news-text">
                <span className="news-tag">LATEST NEWS</span>
                <h2>Google and Hack The Box leading the AI security race</h2>
                <p>Discover how Google and Hack The Box are collaborating to advance AI security solutions and protect against emerging cyber threats.</p>
              </div>
              <div className="news-image">
                <img src="/images/news/ai.png" alt="AI Security" />
              </div>
            </div>
          </div>
        </section>

        {/* Get Started Section */}
        <section className="get-started-section">
          <div className="get-started-container">
            <h2>Ready to start your cybersecurity journey?</h2>
            <p>Join thousands of security professionals and enthusiasts who are already improving their skills with our platform.</p>
            <div className="cta-buttons">
              <Link to="/signup" className="cta-button primary">Sign Up Free</Link>
              <Link to="/contact" className="cta-button secondary">Contact Sales</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
