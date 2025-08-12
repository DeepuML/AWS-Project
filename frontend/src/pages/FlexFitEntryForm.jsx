import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './FlexFitEntryForm.css';

const FlexFitEntryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  
  const [formData, setFormData] = useState({
    location: '',
    temperature: '',
    humidity: '',
    pressure: '',
    fitness_description: '',
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetchFlexFitEntry();
    }
  }, [id]);

  const fetchFlexFitEntry = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/flex-fit/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch flex fit entry');
      }
      
      const data = await response.json();
      setFormData({
        location: data.location,
        temperature: data.temperature,
        humidity: data.humidity,
        pressure: data.pressure,
        fitness_description: data.fitness_description,
        notes: data.notes || ''
      });
    } catch (error) {
      console.error('Error fetching entry:', error);
      toast.error('Failed to load flex fit entry');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.location || !formData.temperature || !formData.humidity || 
        !formData.pressure || !formData.fitness_description) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setSubmitting(true);
      
      const url = isEditMode 
        ? `${API_URL}/flex-fit/${id}`
      : `${API_URL}/flex-fit/`;
      
      const method = isEditMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${isEditMode ? 'update' : 'create'} flex fit entry`);
      }
      
      toast.success(`Flex Fit entry ${isEditMode ? 'updated' : 'created'} successfully`);
      navigate('/');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} entry`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading flex fit entry...</p>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h1>{isEditMode ? 'Edit Flex Fit Entry' : 'Add New Flex Fit Entry'}</h1>
      
      <form onSubmit={handleSubmit} className="flex-fit-form">
        <div className="form-group">
          <label htmlFor="location" className="form-label">Location *</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="form-control"
            placeholder="e.g., New York, NY"
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="temperature" className="form-label">Temperature (°C) *</label>
            <input
              type="number"
              step="0.1"
              id="temperature"
              name="temperature"
              value={formData.temperature}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g., 23.5"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="humidity" className="form-label">Humidity (%) *</label>
            <input
              type="number"
              id="humidity"
              name="humidity"
              value={formData.humidity}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g., 65"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="pressure" className="form-label">Pressure (hPa) *</label>
            <input
              type="number"
              id="pressure"
              name="pressure"
              value={formData.pressure}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g., 1013"
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="fitness_description" className="form-label">Fitness Description *</label>
          <input
            type="text"
            id="fitness_description"
            name="fitness_description"
            value={formData.fitness_description}
            onChange={handleChange}
            className="form-control"
            placeholder="e.g., Partly cloudy with light breeze"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="notes" className="form-label">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="form-control"
            rows="4"
            placeholder="Add any additional observations or notes here..."
          ></textarea>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/')} 
            className="btn btn-secondary"
            disabled={submitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span className="ms-2">{isEditMode ? 'Updating...' : 'Saving...'}</span>
              </>
            ) : (
              isEditMode ? 'Update Entry' : 'Save Entry'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FlexFitEntryForm;