import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import './JoinForm.css';

const JoinForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    membershipPlan: 'Premium',
    startDate: '',
    healthConditions: '',
    fitnessGoals: '',
    referralSource: '',
    agreeToTerms: false
  });

  useEffect(() => {
    // If ID is provided, fetch member data for editing
    if (id) {
      setLoading(true);
      // This would normally fetch from an API
      // For now, we'll simulate with a timeout
      setTimeout(() => {
        // Simulated data - in a real app, this would come from an API
        const memberData = {
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
          healthConditions: 'None',
          fitnessGoals: 'Build muscle and improve endurance',
          referralSource: 'Friend',
          agreeToTerms: true
        };
        
        setFormData(memberData);
        setLoading(false);
      }, 1000);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error('You must agree to the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      // This would normally be an API call
      // For now, we'll simulate with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(id 
        ? 'Membership updated successfully!' 
        : 'Welcome to FitFlex Gym! Your membership application has been submitted.');
      
      navigate('/membership');
    } catch (error) {
      toast.error('There was an error processing your request. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const membershipPlans = [
    { id: 'Basic', name: 'Basic - $29.99/month' },
    { id: 'Premium', name: 'Premium - $49.99/month' },
    { id: 'Elite', name: 'Elite - $79.99/month' }
  ];

  if (loading && id) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading member data...</p>
      </div>
    );
  }

  return (
    <div className="join-form-container">
      <div className="join-form-header">
        <h1>{id ? 'Update Membership' : 'Join FitFlex Gym'}</h1>
        <p>{id 
          ? 'Update your membership information below' 
          : 'Fill out the form below to become a member of FitFlex Gym'}</p>
      </div>

      <form className="join-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Personal Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Address</h2>
          <div className="form-group full-width">
            <label htmlFor="address">Street Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="state">State</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="zipCode">Zip Code</label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Emergency Contact</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="emergencyContactName">Name</label>
              <input
                type="text"
                id="emergencyContactName"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="emergencyContactPhone">Phone</label>
              <input
                type="tel"
                id="emergencyContactPhone"
                name="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Membership Details</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="membershipPlan">Membership Plan *</label>
              <select
                id="membershipPlan"
                name="membershipPlan"
                value={formData.membershipPlan}
                onChange={handleChange}
                required
              >
                {membershipPlans.map(plan => (
                  <option key={plan.id} value={plan.id}>{plan.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Health & Fitness</h2>
          <div className="form-group full-width">
            <label htmlFor="healthConditions">Health Conditions or Limitations</label>
            <textarea
              id="healthConditions"
              name="healthConditions"
              value={formData.healthConditions}
              onChange={handleChange}
              placeholder="Please list any health conditions, injuries, or limitations we should be aware of"
            ></textarea>
          </div>

          <div className="form-group full-width">
            <label htmlFor="fitnessGoals">Fitness Goals</label>
            <textarea
              id="fitnessGoals"
              name="fitnessGoals"
              value={formData.fitnessGoals}
              onChange={handleChange}
              placeholder="What are your fitness goals? This helps our trainers better assist you."
            ></textarea>
          </div>
        </div>

        <div className="form-section">
          <h2>Additional Information</h2>
          <div className="form-group full-width">
            <label htmlFor="referralSource">How did you hear about us?</label>
            <select
              id="referralSource"
              name="referralSource"
              value={formData.referralSource}
              onChange={handleChange}
            >
              <option value="">Select an option</option>
              <option value="Friend">Friend or Family</option>
              <option value="Social Media">Social Media</option>
              <option value="Search Engine">Search Engine</option>
              <option value="Advertisement">Advertisement</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="agreeToTerms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              required
            />
            <label htmlFor="agreeToTerms">
              I agree to the <a href="#">Terms and Conditions</a> and <a href="#">Privacy Policy</a> *
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-small"></span>
                {id ? 'Updating...' : 'Submitting...'}
              </>
            ) : (
              id ? 'Update Membership' : 'Submit Application'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JoinForm;