import React from 'react';
import { Link } from 'react-router-dom';
import './Trainers.css';

const Trainers = () => {
  const trainersData = [
    {
      id: 1,
      name: 'Marcus Johnson',
      specialty: 'HIIT & Functional Training',
      experience: '8+ years',
      certifications: ['NASM Certified Personal Trainer', 'CrossFit Level 2 Trainer'],
      bio: 'Marcus specializes in high-intensity workouts that push you to your limits. His training philosophy focuses on functional movements that translate to real-world strength and agility.',
      image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      socialMedia: {
        instagram: '#',
        twitter: '#',
        facebook: '#'
      }
    },
    {
      id: 2,
      name: 'Emma Wilson',
      specialty: 'Yoga & Mindfulness',
      experience: '10+ years',
      certifications: ['RYT-500 Yoga Alliance Certified', 'Mindfulness Meditation Teacher'],
      bio: 'Emma brings a holistic approach to fitness, combining physical postures with breathing techniques and meditation. Her classes focus on building strength, flexibility, and inner peace.',
      image: 'https://images.unsplash.com/photo-1591291621166-e070868884d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', // New image for Emma Wilson
      socialMedia: {
        instagram: '#',
        twitter: '#',
        facebook: '#'
      }
    },
    {
      id: 3,
      name: 'David Chen',
      specialty: 'Strength & Conditioning',
      experience: '12+ years',
      certifications: ['NSCA Certified Strength and Conditioning Specialist', 'USA Weightlifting Level 2 Coach'],
      bio: 'David is passionate about helping clients build strength and power through proper technique and progressive programming. He specializes in Olympic weightlifting and powerlifting.',
      image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      socialMedia: {
        instagram: '#',
        twitter: '#',
        facebook: '#'
      }
    },
    {
      id: 4,
      name: 'Sarah Miller',
      specialty: 'Cardio & Spin',
      experience: '7+ years',
      certifications: ['ACE Certified Personal Trainer', 'Schwinn Certified Spin Instructor'],
      bio: 'Sarah brings high energy to every class, motivating you to push through barriers and achieve new personal bests. Her spin classes are legendary for their motivating playlists and challenging intervals.',
      image: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      socialMedia: {
        instagram: '#',
        twitter: '#',
        facebook: '#'
      }
    },
    {
      id: 5,
      name: 'Mike Taylor',
      specialty: 'CrossFit & Athletic Performance',
      experience: '9+ years',
      certifications: ['CrossFit Level 3 Trainer', 'NSCA Certified Personal Trainer'],
      bio: 'Mike focuses on building well-rounded athletes through varied, functional movements performed at high intensity. His background in competitive sports informs his approach to training.',
      image: 'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      socialMedia: {
        instagram: '#',
        twitter: '#',
        facebook: '#'
      }
    },
    {
      id: 6,
      name: 'Lisa Wong',
      specialty: 'Pilates & Rehabilitation',
      experience: '15+ years',
      certifications: ['Comprehensive Pilates Certification', 'Corrective Exercise Specialist'],
      bio: 'Lisa specializes in helping clients recover from injuries and improve their movement patterns. Her background in physical therapy informs her approach to Pilates and corrective exercise.',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      socialMedia: {
        instagram: '#',
        twitter: '#',
        facebook: '#'
      }
    }
  ];

  return (
    <div className="trainers-container">
      <div className="trainers-header">
        <h1>Meet Our Expert Trainers</h1>
        <p>Our certified fitness professionals are here to help you achieve your goals</p>
      </div>

      <div className="trainers-grid">
        {trainersData.map(trainer => (
          <div className="trainer-card" key={trainer.id}>
            <div className="trainer-image">
              <img src={trainer.image} alt={trainer.name} />
              <div className="trainer-social">
                <a href={trainer.socialMedia.instagram} aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href={trainer.socialMedia.twitter} aria-label="Twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href={trainer.socialMedia.facebook} aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
              </div>
            </div>
            <div className="trainer-details">
              <h2>{trainer.name}</h2>
              <p className="trainer-specialty">{trainer.specialty}</p>
              <p className="trainer-experience"><i className="fas fa-clock"></i> {trainer.experience} experience</p>
              <div className="trainer-certifications">
                <h3>Certifications:</h3>
                <ul>
                  {trainer.certifications.map((cert, index) => (
                    <li key={index}><i className="fas fa-certificate"></i> {cert}</li>
                  ))}
                </ul>
              </div>
              <p className="trainer-bio">{trainer.bio}</p>
              <Link to="/add" className="btn btn-primary">
                Book a Session
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="trainers-cta">
        <h2>Want to Work with Our Expert Trainers?</h2>
        <p>Join FitFlex Gym today and get access to personal training sessions with our certified professionals</p>
        <Link to="/add" className="btn btn-primary btn-large">
          Become a Member
        </Link>
      </div>
    </div>
  );
};

export default Trainers;