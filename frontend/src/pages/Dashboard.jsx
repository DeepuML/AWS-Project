import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Dashboard.css';

const Dashboard = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/flex-fit/`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch flex fit entries');
      }
      
      const data = await response.json();
      setEntries(data);
    } catch (error) {
      console.error('Error fetching entries:', error);
      toast.error('Failed to load flex fit entries');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
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
      
      setEntries(entries.filter(entry => entry.id !== id));
      toast.success('Flex Fit entry deleted successfully');
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast.error('Failed to delete entry');
    }
  };

  const filteredEntries = entries.filter(entry => 
    entry.location.toLowerCase().includes(filter.toLowerCase()) ||
    entry.fitness_description.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading flex fit entries...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Flex Fit Entries</h1>
        <Link to="/add-flex-fit" className="btn btn-primary">
          <i className="fas fa-plus"></i> Add New Entry
        </Link>
      </div>
      
      <div className="filter-container">
        <input
          type="text"
          placeholder="Filter by location or fitness description..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-input"
        />
      </div>
      
      {filteredEntries.length === 0 ? (
        <div className="no-entries">
          <p>{filter ? 'No entries match your filter.' : 'No flex fit entries yet. Add your first one!'}</p>
          {filter && (
            <button 
              onClick={() => setFilter('')} 
              className="btn btn-secondary"
            >
              Clear Filter
            </button>
          )}
        </div>
      ) : (
        <div className="entries-grid">
          {filteredEntries.map(entry => (
            <div key={entry.id} className="entry-card">
              <div className="entry-header">
                <h3>{entry.location}</h3>
                <span className="entry-date">
                  {new Date(entry.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <div className="entry-fitness">
                <p className="fitness-description">{entry.fitness_description}</p>
                <div className="fitness-details">
                  <p><i className="fas fa-temperature-high"></i> {entry.temperature}°C</p>
                  <p><i className="fas fa-tint"></i> {entry.humidity}%</p>
                  <p><i className="fas fa-compress-alt"></i> {entry.pressure} hPa</p>
                </div>
              </div>
              
              {entry.notes && (
                <div className="entry-notes">
                  <p>{entry.notes.length > 100 ? `${entry.notes.substring(0, 100)}...` : entry.notes}</p>
                </div>
              )}
              
              <div className="entry-actions">
                <Link to={`/flex-fit-entry/${entry.id}`} className="btn-view">
                  <i className="fas fa-eye"></i> View
                </Link>
                <Link to={`/edit-flex-fit/${entry.id}`} className="btn-edit">
                  <i className="fas fa-edit"></i> Edit
                </Link>
                <button 
                  onClick={() => handleDelete(entry.id)} 
                  className="btn-delete"
                >
                  <i className="fas fa-trash"></i> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;