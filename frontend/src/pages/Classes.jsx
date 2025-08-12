import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Classes.css';

const Classes = () => {
  const [filter, setFilter] = useState('all');

  const classesData = [
    {
      id: 1,
      name: 'Power Yoga',
      instructor: 'Emma Wilson',
      schedule: 'Mon, Wed, Fri - 8:00 AM',
      duration: '60 min',
      level: 'All Levels',
      category: 'yoga',
      description: 'A vigorous, fitness-based approach to vinyasa-style yoga that emphasizes strength and flexibility.',
      image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      id: 2,
      name: 'HIIT Circuit',
      instructor: 'Marcus Johnson',
      schedule: 'Tue, Thu - 6:00 PM',
      duration: '45 min',
      level: 'Intermediate',
      category: 'cardio',
      description: 'High-intensity interval training that alternates between intense bursts of activity and fixed periods of less-intense activity or rest.',
      image: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      id: 3,
      name: 'Strength & Conditioning',
      instructor: 'David Chen',
      schedule: 'Mon, Wed, Fri - 5:30 PM',
      duration: '60 min',
      level: 'Intermediate/Advanced',
      category: 'strength',
      description: 'Build muscle, increase strength, and improve overall fitness with this comprehensive strength training class.',
      image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      id: 4,
      name: 'Spin Class',
      instructor: 'Sarah Miller',
      schedule: 'Tue, Thu, Sat - 7:00 AM',
      duration: '45 min',
      level: 'All Levels',
      category: 'cardio',
      description: 'A high-energy indoor cycling workout that simulates outdoor riding with sprints, climbs, and intervals.',
      image: 'https://images.unsplash.com/photo-1561214078-f3247647fc5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      id: 5,
      name: 'Pilates Reformer',
      instructor: 'Lisa Wong',
      schedule: 'Wed, Fri - 9:00 AM',
      duration: '50 min',
      level: 'All Levels',
      category: 'pilates',
      description: 'Strengthen your core, improve flexibility, and enhance body awareness with this equipment-based Pilates class.',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      id: 6,
      name: 'CrossFit',
      instructor: 'Mike Taylor',
      schedule: 'Mon, Wed, Fri - 6:00 AM',
      duration: '60 min',
      level: 'Intermediate/Advanced',
      category: 'strength',
      description: 'A high-intensity fitness program incorporating elements from several sports and types of exercise.',
      image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
  ];

  const filteredClasses = filter === 'all' 
    ? classesData 
    : classesData.filter(cls => cls.category === filter);

  return (
    <div className="classes-container">
      <div className="classes-header">
        <h1>Our Fitness Classes</h1>
        <p>Discover a variety of classes designed to help you achieve your fitness goals</p>
      </div>

      <div className="filter-tabs">
        <button 
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Classes
        </button>
        <button 
          className={`filter-tab ${filter === 'cardio' ? 'active' : ''}`}
          onClick={() => setFilter('cardio')}
        >
          Cardio
        </button>
        <button 
          className={`filter-tab ${filter === 'strength' ? 'active' : ''}`}
          onClick={() => setFilter('strength')}
        >
          Strength
        </button>
        <button 
          className={`filter-tab ${filter === 'yoga' ? 'active' : ''}`}
          onClick={() => setFilter('yoga')}
        >
          Yoga
        </button>
        <button 
          className={`filter-tab ${filter === 'pilates' ? 'active' : ''}`}
          onClick={() => setFilter('pilates')}
        >
          Pilates
        </button>
      </div>

      <div className="classes-grid">
        {filteredClasses.map(cls => (
          <div className="class-card" key={cls.id}>
            <div className="class-image" style={{ backgroundImage: `url(${cls.image})` }}>
              <div className="class-category">{cls.category}</div>
            </div>
            <div className="class-details">
              <h2>{cls.name}</h2>
              <p className="instructor"><i className="fas fa-user"></i> {cls.instructor}</p>
              <p className="schedule"><i className="fas fa-calendar-alt"></i> {cls.schedule}</p>
              <p className="duration"><i className="fas fa-clock"></i> {cls.duration}</p>
              <p className="level"><i className="fas fa-signal"></i> {cls.level}</p>
              <p className="description">{cls.description}</p>
              <Link to="/add" className="btn btn-primary">
                Book Class
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="classes-cta">
        <h2>Ready to start your fitness journey?</h2>
        <p>Join FitFlex Gym today and get access to all our premium classes</p>
        <Link to="/add" className="btn btn-primary btn-large">
          Become a Member
        </Link>
      </div>
    </div>
  );
};

export default Classes;