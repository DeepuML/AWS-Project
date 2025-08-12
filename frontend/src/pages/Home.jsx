import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import gymBackground from '../assets/images/gym-background.svg';
import ctaBackground from '../assets/images/cta-bg.svg';

// Import membership plan images
import basicPlan from '../assets/images/membership/basic.svg';
import premiumPlan from '../assets/images/membership/premium.svg';
import elitePlan from '../assets/images/membership/elite.svg';

// Import avery section images
import trainerImage from '../assets/images/avery/trainer.svg';
import equipmentImage from '../assets/images/avery/equipment.svg';
import classesImage from '../assets/images/avery/classes.svg';
import facilitiesImage from '../assets/images/avery/facilities.svg';

const Home = () => {
  const featuresRef = useRef(null);
  const testimonialRefs = useRef([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px'
    };

    const handleIntersect = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    testimonialRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
      
    });
    
    // Smooth scroll for anchor links
    const smoothScroll = (e) => {
      if (e.target.tagName.toLowerCase() === 'a' && e.target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80, // Offset for header
            behavior: 'smooth'
          });
        }
      }
    };

    document.body.addEventListener('click', smoothScroll);

    // Preload background images
    const preloadImages = () => {
      const imageUrls = [
        '/images/gym-background.svg',
        '/images/cta-bg.svg'
      ];
      
      imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
      });
    };
    
    preloadImages();

    return () => {
      observer.disconnect();
      document.body.removeEventListener('click', smoothScroll);
      clearTimeout(timer);
    };
  }, []);

  const [showScrollTop, setShowScrollTop] = React.useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner-inner"></div>
        </div>
        <h2 className="loading-text">Loading Flex Fit</h2>
      </div>
    );
  }

  return (
    <div className="home-container">
      {showScrollTop && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          <i className="fas fa-arrow-up"></i>
        </button>
      )}
      <section className="hero-section">
        <div className="hero-video-container">
          <object className="hero-video-bg" type="image/svg+xml" data="/videos/workout-animation.svg">
            <div className="hero-video-bg" style={{ backgroundImage: `url(${gymBackground})` }}></div>
          </object>
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">Premium Fitness Experience</div>
          <h1 className="hero-title">Transform Your Body,<br /><span className="highlight">Transform Your Life</span></h1>
          <p className="hero-description">Join FitFlex Gym today and start your fitness journey with state-of-the-art equipment and expert trainers who will guide you every step of the way.</p>
          <div className="hero-buttons">
            <Link to="/add" className="btn btn-primary btn-large">
              Join Now
            </Link>
            <a href="#membership-section" className="btn btn-secondary btn-large">
              View Plans
            </a>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">25+</span>
              <span className="stat-label">Expert Trainers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100+</span>
              <span className="stat-label">Classes Weekly</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">5K+</span>
              <span className="stat-label">Happy Members</span>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section" ref={featuresRef} id="features-section">
        <div className="section-header">
          <h2 className="section-title">Why Choose FitFlex Gym?</h2>
          <p className="section-subtitle">Experience the difference with our premium facilities and services</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <i className="fas fa-dumbbell feature-icon"></i>
            </div>
            <h3>State-of-the-Art Equipment</h3>
            <p>Our gym features the latest fitness technology and premium equipment for all your workout needs.</p>
            <Link to="/features" className="feature-link">Learn more <i className="fas fa-arrow-right"></i></Link>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <i className="fas fa-users feature-icon"></i>
            </div>
            <h3>Expert Trainers</h3>
            <p>Work with certified fitness professionals who will guide you to achieve your fitness goals.</p>
            <Link to="/classes" className="feature-link">Learn more <i className="fas fa-arrow-right"></i></Link>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <i className="fas fa-calendar-alt feature-icon"></i>
            </div>
            <h3>Diverse Class Schedule</h3>
            <p>From yoga to HIIT, we offer a wide variety of classes to keep your workouts exciting and effective.</p>
            <Link to="/schedule" className="feature-link">Learn more <i className="fas fa-arrow-right"></i></Link>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <i className="fas fa-clock feature-icon"></i>
            </div>
            <h3>24/7 Access</h3>
            <p>Workout on your schedule with our around-the-clock facility access for all members.</p>
            <Link to="/access" className="feature-link">Learn more <i className="fas fa-arrow-right"></i></Link>
          </div>
        </div>
      </section>
      
      <section className="avery-section">
        <div className="section-header">
          <h2 className="section-title">Why Choose Us</h2>
          <p className="section-subtitle">Experience the difference with our premium facilities and services</p>
        </div>
        <div className="avery-grid">
          <div className="avery-card">
            <div className="avery-card-image">
              <img src={trainerImage} alt="Expert Trainers" />
            </div>
            <h3>Expert Trainers</h3>
            <p>Our certified trainers are dedicated to helping you achieve your fitness goals with personalized workout plans and constant motivation.</p>
            <Link to="/trainers" className="avery-link">Meet Our Trainers <i className="fas fa-arrow-right"></i></Link>
          </div>
          <div className="avery-card">
            <div className="avery-card-image">
              <img src={equipmentImage} alt="Premium Equipment" />
            </div>
            <h3>Premium Equipment</h3>
            <p>We provide top-of-the-line fitness equipment from leading brands to ensure you get the most effective and safe workout experience.</p>
            <Link to="/equipment" className="avery-link">Explore Equipment <i className="fas fa-arrow-right"></i></Link>
          </div>
          <div className="avery-card">
            <div className="avery-card-image">
              <img src={classesImage} alt="Diverse Classes" />
            </div>
            <h3>Diverse Classes</h3>
            <p>From high-intensity interval training to yoga and pilates, our diverse range of classes caters to all fitness levels and preferences.</p>
            <Link to="/classes" className="avery-link">Browse Classes <i className="fas fa-arrow-right"></i></Link>
          </div>
          <div className="avery-card">
            <div className="avery-card-image">
              <img src={facilitiesImage} alt="Modern Facilities" />
            </div>
            <h3>Modern Facilities</h3>
            <p>Our gym features spacious workout areas, clean locker rooms, sauna, and a juice bar to enhance your fitness journey.</p>
            <Link to="/facilities" className="avery-link">View Facilities <i className="fas fa-arrow-right"></i></Link>
          </div>
        </div>
      </section>

      <section className="membership-section" id="membership-section">
        <div className="section-header">
          <h2 className="section-title">Membership Plans</h2>
          <p className="section-subtitle">Choose the perfect plan for your fitness journey</p>
        </div>
        <div className="membership-cards">
          <div className="membership-card">
            <div className="membership-card-image">
              <img src={basicPlan} alt="Basic Plan" />
            </div>
            <h3 className="plan-name">Basic</h3>
            <p className="plan-price">$29.99<span>/month</span></p>
            <ul className="plan-features">
              <li><i className="fas fa-check-circle"></i> Access to gym floor</li>
              <li><i className="fas fa-check-circle"></i> Basic equipment usage</li>
              <li><i className="fas fa-check-circle"></i> Locker room access</li>
              <li><i className="fas fa-check-circle"></i> 2 guest passes per month</li>
            </ul>
            <Link to="/checkout?plan=Basic" className="btn btn-secondary">
              Select Plan
            </Link>
          </div>
          <div className="membership-card featured">
            <div className="featured-tag">Most Popular</div>
            <div className="membership-card-image">
              <img src={premiumPlan} alt="Premium Plan" />
            </div>
            <h3 className="plan-name">Premium</h3>
            <p className="plan-price">$49.99<span>/month</span></p>
            <ul className="plan-features">
              <li><i className="fas fa-check-circle"></i> All Basic features</li>
              <li><i className="fas fa-check-circle"></i> Unlimited group classes</li>
              <li><i className="fas fa-check-circle"></i> Fitness assessment</li>
              <li><i className="fas fa-check-circle"></i> 5 guest passes per month</li>
              <li><i className="fas fa-check-circle"></i> Towel service</li>
            </ul>
            <Link to="/checkout?plan=Premium" className="btn btn-primary">
              Select Plan
            </Link>
          </div>
          <div className="membership-card">
            <div className="membership-card-image">
              <img src={elitePlan} alt="Elite Plan" />
            </div>
            <h3 className="plan-name">Elite</h3>
            <p className="plan-price">$79.99<span>/month</span></p>
            <ul className="plan-features">
              <li><i className="fas fa-check-circle"></i> All Premium features</li>
              <li><i className="fas fa-check-circle"></i> Personal training sessions (2/month)</li>
              <li><i className="fas fa-check-circle"></i> Nutrition consultation</li>
              <li><i className="fas fa-check-circle"></i> Unlimited guest passes</li>
              <li><i className="fas fa-check-circle"></i> Exclusive access to spa</li>
            </ul>
            <Link to="/checkout?plan=Elite" className="btn btn-secondary">
              Select Plan
            </Link>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <h2 className="section-title">What Our Members Say</h2>
        <div className="testimonials-container">
          {[
            {
              content: "FitFlex Gym has completely transformed my fitness journey. The trainers are exceptional and the community is so supportive!",
              author: "Sarah Johnson",
              since: "Member since 2021"
            },
            {
              content: "I've tried many gyms over the years, but none compare to the equipment quality and atmosphere at FitFlex. It's become my second home!",
              author: "Michael Rodriguez",
              since: "Member since 2020"
            }
          ].map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-card"
              ref={el => testimonialRefs.current[index] = el}
            >
              <div className="testimonial-content">
                <p>{testimonial.content}</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <i className="fas fa-user-circle"></i>
                </div>
                <div className="author-info">
                  <h4>{testimonial.author}</h4>
                  <p>{testimonial.since}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url(${ctaBackground})` }}>
        <div className="cta-content">
          <h2>Ready to Start Your Fitness Journey?</h2>
          <p>Join FitFlex Gym today and take the first step towards a healthier, stronger you.</p>
          <Link to="/add" className="btn btn-primary btn-large">
            Become a Member
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;