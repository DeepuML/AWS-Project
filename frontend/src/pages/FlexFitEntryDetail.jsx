import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './FlexFitEntryDetail.css';

const FlexFitEntryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  useEffect(() => {
    fetchFlexFitEntry();
  }, [id]);

  const fetchFlexFitEntry = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/flex-fit/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch flex fit entry');
      }
      
      const data = await response.json();
      setEntry(data);
    } catch (error) {
      console.error('Error fetching entry:', error);
      toast.error('Failed to load flex fit entry');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this entry?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/flex-fit/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete entry');
      }
      
      toast.success('Flex Fit entry deleted successfully');
      navigate('/');
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast.error('Failed to delete entry');
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

  if (!entry) {
    return (
      <div className="error-container">
        <h2>Entry Not Found</h2>
        <p>The flex fit entry you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="btn btn-primary">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <div className="detail-header">
        <h1>{entry.location}</h1>
        <div className="detail-date">
          <p><strong>Created:</strong> {new Date(entry.created_at).toLocaleString()}</p>
          {entry.updated_at && entry.updated_at !== entry.created_at && (
            <p><strong>Updated:</strong> {new Date(entry.updated_at).toLocaleString()}</p>
          )}
        </div>
      </div>
      
      <div className="detail-card">
        <div className="fitness-info">
          <h2>Fitness Information</h2>
          <div className="fitness-grid">
            <div className="fitness-item">
              <i className="fas fa-temperature-high"></i>
              <div>
                <h3>Temperature</h3>
                <p>{entry.temperature}°C</p>
              </div>
            </div>
            
            <div className="fitness-item">
              <i className="fas fa-tint"></i>
              <div>
                <h3>Humidity</h3>
                <p>{entry.humidity}%</p>
              </div>
            </div>
            
            <div className="fitness-item">
              <i className="fas fa-compress-alt"></i>
              <div>
                <h3>Pressure</h3>
                <p>{entry.pressure} hPa</p>
              </div>
            </div>
          </div>
          
          <div className="fitness-description-box">
            <h3>Fitness Description</h3>
            <p>{entry.fitness_description}</p>
          </div>
        </div>
        
        {entry.notes && (
          <div className="notes-section">
            <h2>Notes</h2>
            <p>{entry.notes}</p>
          </div>
        )}
      </div>
      
      <div className="detail-actions">
        <Link to="/" className="btn btn-secondary">
          <i className="fas fa-arrow-left"></i> Back to Dashboard
        </Link>
        <div className="action-buttons">
          <Link to={`/edit/${entry.id}`} className="btn btn-primary">
            <i className="fas fa-edit"></i> Edit Entry
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            <i className="fas fa-trash"></i> Delete Entry
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlexFitEntryDetail;