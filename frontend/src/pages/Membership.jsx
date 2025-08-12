import React from 'react';
import { Link } from 'react-router-dom';
import './Membership.css';

const Membership = () => {
  const membershipPlans = [
    {
      id: 1,
      name: 'Basic',
      price: 29.99,
      duration: 'month',
      features: [
        { text: 'Access to gym equipment', included: true },
        { text: 'Locker room access', included: true },
        { text: '2 guest passes per month', included: true },
        { text: 'Fitness assessment', included: false },
        { text: 'Personal training sessions', included: false },
        { text: 'Group classes', included: false },
        { text: '24/7 access', included: false },
      ],
      popular: false,
      color: '#333333'
    },
    {
      id: 2,
      name: 'Premium',
      price: 49.99,
      duration: 'month',
      features: [
        { text: 'Access to gym equipment', included: true },
        { text: 'Locker room access', included: true },
        { text: '5 guest passes per month', included: true },
        { text: 'Fitness assessment', included: true },
        { text: '2 personal training sessions', included: true },
        { text: 'Unlimited group classes', included: true },
        { text: '24/7 access', included: false },
      ],
      popular: true,
      color: '#ff4d4d'
    },
    {
      id: 3,
      name: 'Elite',
      price: 79.99,
      duration: 'month',
      features: [
        { text: 'Access to gym equipment', included: true },
        { text: 'Locker room access', included: true },
        { text: 'Unlimited guest passes', included: true },
        { text: 'Fitness assessment', included: true },
        { text: '5 personal training sessions', included: true },
        { text: 'Priority class booking', included: true },
        { text: '24/7 access', included: true },
      ],
      popular: false,
      color: '#ffc107'
    }
  ];

  const membershipBenefits = [
    {
      icon: 'fas fa-dumbbell',
      title: 'State-of-the-Art Equipment',
      description: 'Access to premium fitness equipment from top brands, regularly maintained and updated.'
    },
    {
      icon: 'fas fa-users',
      title: 'Expert Trainers',
      description: 'Work with certified fitness professionals who will guide you to achieve your fitness goals.'
    },
    {
      icon: 'fas fa-calendar-alt',
      title: 'Diverse Class Schedule',
      description: 'From yoga to HIIT, we offer a wide variety of classes to keep your workouts exciting and effective.'
    },
    {
      icon: 'fas fa-shower',
      title: 'Premium Facilities',
      description: 'Enjoy clean locker rooms, showers, and amenities that make your gym experience comfortable.'
    },
    {
      icon: 'fas fa-heartbeat',
      title: 'Fitness Assessment',
      description: 'Regular evaluations to track your progress and adjust your fitness plan accordingly.'
    },
    {
      icon: 'fas fa-clock',
      title: 'Flexible Hours',
      description: 'With extended hours and 24/7 access for Elite members, work out on your own schedule.'
    }
  ];

  const faqItems = [
    {
      question: 'Is there a joining fee?',
      answer: 'No, we do not charge any joining fees or hidden costs. The price you see is the price you pay.'
    },
    {
      question: 'Can I freeze my membership?',
      answer: 'Yes, you can freeze your membership for up to 3 months per year with a small administrative fee.'
    },
    {
      question: 'What is your cancellation policy?',
      answer: 'We require 30 days notice for cancellation. You can cancel by visiting the gym or through your online account.'
    },
    {
      question: 'Do you offer family memberships?',
      answer: 'Yes, we offer family packages with discounted rates. Please inquire at the front desk for more information.'
    },
    {
      question: 'Are there age restrictions?',
      answer: 'Members must be 16 years or older. We offer special teen programs for those aged 13-15 with parental supervision.'
    },
    {
      question: 'Can I try before I join?',
      answer: 'Absolutely! We offer a free day pass for first-time visitors. Contact us to schedule your visit.'
    }
  ];

  return (
    <div className="membership-container">
      <div className="membership-header">
        <h1>Membership Plans</h1>
        <p>Choose the perfect membership plan for your fitness journey</p>
      </div>

      <div className="membership-plans">
        {membershipPlans.map(plan => (
          <div 
            className={`plan-card ${plan.popular ? 'popular' : ''}`} 
            key={plan.id}
            style={{
              '--plan-color': plan.color
            }}
          >
            {plan.popular && <div className="popular-tag">Most Popular</div>}
            <h2 className="plan-name">{plan.name}</h2>
            <p className="plan-price">
              <span className="currency">$</span>
              <span className="amount">{plan.price}</span>
              <span className="duration">/{plan.duration}</span>
            </p>
            <ul className="plan-features">
              {plan.features.map((feature, index) => (
                <li key={index} className={feature.included ? 'included' : 'not-included'}>
                  <i className={`fas ${feature.included ? 'fa-check' : 'fa-times'}`}></i>
                  {feature.text}
                </li>
              ))}
            </ul>
            <Link to={`/checkout?plan=${plan.name}`} className="btn btn-plan">
              Choose Plan
            </Link>
          </div>
        ))}
      </div>

      <div className="membership-benefits">
        <h2 className="section-title">Membership Benefits</h2>
        <div className="benefits-grid">
          {membershipBenefits.map((benefit, index) => (
            <div className="benefit-card" key={index}>
              <div className="benefit-icon">
                <i className={benefit.icon}></i>
              </div>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="membership-faq">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div className="faq-grid">
          {faqItems.map((item, index) => (
            <div className="faq-item" key={index}>
              <h3><i className="fas fa-question-circle"></i> {item.question}</h3>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="membership-cta">
        <h2>Ready to Start Your Fitness Journey?</h2>
        <p>Join FitFlex Gym today and take the first step towards a healthier, stronger you.</p>
        <Link to="/checkout?plan=Premium" className="btn btn-primary btn-large">
          Become a Member
        </Link>
      </div>
    </div>
  );
};

export default Membership;