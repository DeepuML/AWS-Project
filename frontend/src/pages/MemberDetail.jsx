import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './MemberDetail.css';

const MemberDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMember = async () => {
      setLoading(true);
      try {
        // This would normally be an API call
        // For now, we'll simulate with a timeout and mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const memberData = {
          id: id,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '555-123-4567',
          dateOfBirth: '1990-01-15',
          address: '123 Fitness St',
          city: 'Gymville',
          state: 'CA',
          zipCode: '90210',
          emergencyContactName: 'Jane Doe',
          emergencyContactPhone: '555-987-6543',
          membershipPlan: 'Elite',
          startDate: '2023-06-01',
          endDate: '2024-06-01',
          status: 'Active',
          healthConditions: 'None',
          fitnessGoals: 'Build muscle and improve endurance',
          referralSource: 'Friend',
          joinDate: '2023-06-01',
          lastCheckIn: '2023-09-15',
          checkInCount: 45,
          upcomingClasses: [
            { id: 1, name: 'HIIT Extreme', date: '2023-09-20', time: '18:00', instructor: 'Mike Johnson' },
            { id: 2, name: 'Yoga Flow', date: '2023-09-22', time: '10:00', instructor: 'Sarah Williams' }
          ],
          pastClasses: [
            { id: 3, name: 'Spin Class', date: '2023-09-10', time: '19:00', instructor: 'Alex Thompson' },
            { id: 4, name: 'Core Strength', date: '2023-09-05', time: '17:30', instructor: 'Lisa Chen' }
          ],
          trainingPackages: [
            { id: 1, name: 'Personal Training - 10 Sessions', purchased: '2023-07-15', sessionsLeft: 4 }
          ],
          paymentHistory: [
            { id: 1, date: '2023-08-01', amount: 79.99, description: 'Monthly membership fee', status: 'Paid' },
            { id: 2, date: '2023-07-01', amount: 79.99, description: 'Monthly membership fee', status: 'Paid' },
            { id: 3, date: '2023-07-15', amount: 450.00, description: 'Personal Training Package - 10 Sessions', status: 'Paid' }
          ]
        };
        
        setMember(memberData);
        setError(null);
      } catch (err) {
        console.error('Error fetching member:', err);
        setError('Failed to load member details. Please try again later.');
        toast.error('Error loading member details');
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to cancel this membership? This action cannot be undone.')) {
      setLoading(true);
      try {
        // This would normally be an API call
        // For now, we'll simulate with a timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast.success('Membership cancelled successfully');
        navigate('/membership');
      } catch (err) {
        console.error('Error deleting member:', err);
        toast.error('Error cancelling membership');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading member details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => navigate('/membership')}>
          Back to Memberships
        </button>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="error-container">
        <h2>Member Not Found</h2>
        <p>The member you're looking for doesn't exist or has been removed.</p>
        <button className="btn btn-primary" onClick={() => navigate('/membership')}>
          Back to Memberships
        </button>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="member-detail-container">
      <div className="member-detail-header">
        <h1>{member.firstName} {member.lastName}</h1>
        <div className="member-status">
          <span className={`status-badge ${member.status.toLowerCase()}`}>
            {member.status}
          </span>
          <span className="member-id">ID: {member.id}</span>
        </div>
      </div>

      <div className="member-actions">
        <Link to={`/edit/${member.id}`} className="btn btn-secondary">
          <i className="fas fa-edit"></i> Edit Membership
        </Link>
        <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>
          <i className="fas fa-trash-alt"></i> Cancel Membership
        </button>
      </div>

      <div className="member-detail-grid">
        <div className="detail-card membership-info">
          <h2>Membership Information</h2>
          <div className="detail-row">
            <span className="detail-label">Plan:</span>
            <span className="detail-value">{member.membershipPlan}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Start Date:</span>
            <span className="detail-value">{formatDate(member.startDate)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Renewal Date:</span>
            <span className="detail-value">{formatDate(member.endDate)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Member Since:</span>
            <span className="detail-value">{formatDate(member.joinDate)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Last Check-in:</span>
            <span className="detail-value">{formatDate(member.lastCheckIn)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Total Check-ins:</span>
            <span className="detail-value">{member.checkInCount}</span>
          </div>
        </div>

        <div className="detail-card personal-info">
          <h2>Personal Information</h2>
          <div className="detail-row">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{member.email}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Phone:</span>
            <span className="detail-value">{member.phone}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Date of Birth:</span>
            <span className="detail-value">{formatDate(member.dateOfBirth)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Address:</span>
            <span className="detail-value">
              {member.address}, {member.city}, {member.state} {member.zipCode}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Emergency Contact:</span>
            <span className="detail-value">
              {member.emergencyContactName} ({member.emergencyContactPhone})
            </span>
          </div>
        </div>

        <div className="detail-card health-info">
          <h2>Health & Fitness</h2>
          <div className="detail-row">
            <span className="detail-label">Health Conditions:</span>
            <span className="detail-value">{member.healthConditions || 'None specified'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Fitness Goals:</span>
            <span className="detail-value">{member.fitnessGoals || 'None specified'}</span>
          </div>
        </div>

        <div className="detail-card upcoming-classes">
          <h2>Upcoming Classes</h2>
          {member.upcomingClasses && member.upcomingClasses.length > 0 ? (
            <div className="classes-list">
              {member.upcomingClasses.map(cls => (
                <div className="class-item" key={cls.id}>
                  <div className="class-name">{cls.name}</div>
                  <div className="class-details">
                    <span><i className="far fa-calendar"></i> {formatDate(cls.date)}</span>
                    <span><i className="far fa-clock"></i> {cls.time}</span>
                    <span><i className="fas fa-user"></i> {cls.instructor}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No upcoming classes</p>
          )}
          <button className="btn btn-outline">Book a Class</button>
        </div>

        <div className="detail-card training-packages">
          <h2>Training Packages</h2>
          {member.trainingPackages && member.trainingPackages.length > 0 ? (
            <div className="packages-list">
              {member.trainingPackages.map(pkg => (
                <div className="package-item" key={pkg.id}>
                  <div className="package-name">{pkg.name}</div>
                  <div className="package-details">
                    <span><i className="far fa-calendar-check"></i> Purchased: {formatDate(pkg.purchased)}</span>
                    <span><i className="fas fa-clipboard-list"></i> Sessions Left: {pkg.sessionsLeft}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No active training packages</p>
          )}
          <button className="btn btn-outline">Purchase Training</button>
        </div>

        <div className="detail-card payment-history">
          <h2>Payment History</h2>
          {member.paymentHistory && member.paymentHistory.length > 0 ? (
            <div className="payment-list">
              {member.paymentHistory.map(payment => (
                <div className="payment-item" key={payment.id}>
                  <div className="payment-date">{formatDate(payment.date)}</div>
                  <div className="payment-details">
                    <span className="payment-description">{payment.description}</span>
                    <span className="payment-amount">${payment.amount.toFixed(2)}</span>
                    <span className={`payment-status ${payment.status.toLowerCase()}`}>{payment.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No payment history</p>
          )}
        </div>
      </div>

      <div className="back-button">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i> Back
        </button>
      </div>
    </div>
  );
};

export default MemberDetail;