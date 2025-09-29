import React, { useState, useEffect } from 'react';
import { FaCalculator, FaSearch, FaMapMarkerAlt, FaGraduationCap, FaRupeeSign } from 'react-icons/fa';
import axios from 'axios';
import './Pricing.css';

const Pricing = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [pricing, setPricing] = useState(null);
  const [pricingConfig, setPricingConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allSubjects, setAllSubjects] = useState(false);
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [searchLocation, setSearchLocation] = useState('');
  const [searchPincode, setSearchPincode] = useState('');
  const [tutors, setTutors] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // CBSE Subjects for different classes
  const cbseSubjects = {
    '1': ['English', 'Mathematics', 'Environmental Studies', 'Hindi'],
    '2': ['English', 'Mathematics', 'Environmental Studies', 'Hindi'],
    '3': ['English', 'Mathematics', 'Environmental Studies', 'Hindi'],
    '4': ['English', 'Mathematics', 'Environmental Studies', 'Hindi'],
    '5': ['English', 'Mathematics', 'Environmental Studies', 'Hindi'],
    '6': ['English', 'Mathematics', 'Science', 'Social Studies', 'Hindi'],
    '7': ['English', 'Mathematics', 'Science', 'Social Studies', 'Hindi'],
    '8': ['English', 'Mathematics', 'Science', 'Social Studies', 'Hindi'],
    '9': ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Social Studies', 'Hindi'],
    '10': ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Social Studies', 'Hindi'],
    '11': ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Accountancy', 'Business Studies', 'Economics', 'Computer Science', 'Hindi'],
    '12': ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Accountancy', 'Business Studies', 'Economics', 'Computer Science', 'Hindi']
  };

  useEffect(() => {
    fetchClasses();
    fetchPricingConfig();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      setSelectedSubjects([]);
      setPricing(null);
    }
  }, [selectedClass]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/api/subjects/classes');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const calculatePricing = async () => {
    if (!selectedClass) {
      alert('Please select a class');
      return;
    }

    if (!allSubjects && selectedSubjects.length === 0) {
      alert('Please select at least one subject or choose All Subjects');
      return;
    }
    setLoading(true);

    try {

      const response = await axios.post('/api/pricing/calculate', {
        selectedSubjects,
        class: selectedClass,
        allSubjects,
        daysPerWeek
      });
      setPricing(response.data);

    } catch (error) {
      console.error('Error calculating pricing:', error);
      alert('Error calculating pricing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPricingConfig = async () => {
    try {
      const response = await axios.get('/api/admin/pricing-config');
      setPricingConfig(response.data || null);
    } catch (error) {
      console.warn('No pricing config available');
    }
  };

  const searchTutors = async () => {
    if (!searchPincode && !searchLocation) {
      alert('Please enter pincode or location');
      return;
    }

    setSearchLoading(true);
    try {
      const response = await axios.get('/api/tutors/search', {
        params: {
          pincode: searchPincode,
          area: searchLocation,
          subject: selectedSubjects[0] || '',
          class: selectedClass
        }
      });
      setTutors(response.data);
    } catch (error) {
      console.error('Error searching tutors:', error);
      alert('Error searching tutors. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSubjectToggle = (subject) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  return (
    <div className="pricing-page">
      <div className="container">
        <div className="page-header">
          <h1>Pricing & Find Tutor</h1>
          <p>Calculate your tuition fees and find the perfect tutor for your needs</p>
        </div>

        <div className="pricing-content">
          {/* Price Calculator Section */}
          <section className="calculator-section">
            <div className="section-header">
              <FaCalculator className="section-icon" />
              <h2>Price Calculator</h2>
            </div>

            <div className="calculator-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Select Class</label>
                  <select
                    className="form-select"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    <option value="">Choose Class</option>
                    {classes.map(cls => (
                      <option key={cls} value={cls}>Class {cls}</option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedClass && (
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Select Subjects</label>
                    <div className="subjects-grid">
                      <label className="subject-checkbox">
                        <input type="checkbox" checked={allSubjects} onChange={() => setAllSubjects(!allSubjects)} />
                        <span className="checkbox-label">All Subjects</span>
                      </label>
                      {cbseSubjects[selectedClass]?.map(subject => (
                        <label key={subject} className="subject-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedSubjects.includes(subject)}
                            onChange={() => handleSubjectToggle(subject)}
                          />
                          <span className="checkbox-label">{subject}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedClass && (
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Days per week</label>
                    <select value={daysPerWeek} onChange={e => setDaysPerWeek(parseInt(e.target.value))} className="form-select">
                      {[1,2,3,4,5,6,7].map(d => <option key={d} value={d}>{d} day{d>1?'s':''} / week</option>)}
                    </select>
                  </div>
                </div>
              )}

              <button
                className="btn btn-primary btn-large"
                onClick={calculatePricing}
                disabled={loading || !selectedClass || (!allSubjects && selectedSubjects.length === 0)}
              >
                {loading ? 'Calculating...' : 'Calculate Price'}
              </button>
            </div>

            {pricing && (
              <div className="pricing-result">
                <h3>Pricing Breakdown</h3>
                <div className="pricing-details">
                  {pricingConfig?.classBase && (
                    <div className="pricing-config">
                      <small>Base price for Class {selectedClass}: {pricingConfig.classBase && pricingConfig.classBase[selectedClass] ? `₹${pricingConfig.classBase[selectedClass]}` : 'N/A'}</small>
                    </div>
                  )}
                  {pricing.subjects.map((subject, index) => (
                    <div key={index} className="subject-pricing">
                      <span className="subject-name">{subject.subject}</span>
                      <span className="subject-fee">
                        <FaRupeeSign /> {subject.monthlyFee}/month
                      </span>
                    </div>
                  ))}
                  
                  <div className="pricing-total">
                    <div className="total-row">
                      <span>Subtotal:</span>
                      <span><FaRupeeSign /> {pricing.totalMonthlyFee}</span>
                    </div>
                    {pricing.discount > 0 && (
                      <div className="total-row discount">
                        <span>Discount:</span>
                        <span>-<FaRupeeSign /> {pricing.discount}</span>
                      </div>
                    )}
                    <div className="total-row final">
                      <span>Total Monthly Fee:</span>
                      <span><FaRupeeSign /> {pricing.finalAmount}</span>
                    </div>
                    <div className="total-row note">
                      <small>Price adjusted for {pricing.daysPerWeek} day(s) per week.</small>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Find Tutor Section */}
          <section className="find-tutor-section">
            <div className="section-header">
              <FaSearch className="section-icon" />
              <h2>Find a Tutor</h2>
            </div>

            <div className="search-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <FaMapMarkerAlt className="label-icon" />
                    Pincode
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter pincode"
                    value={searchPincode}
                    onChange={(e) => setSearchPincode(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <FaMapMarkerAlt className="label-icon" />
                    Location/Area
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter area name"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                  />
                </div>
              </div>

              <button
                className="btn btn-primary btn-large"
                onClick={searchTutors}
                disabled={searchLoading || (!searchPincode && !searchLocation)}
              >
                {searchLoading ? 'Searching...' : 'Find Tutors'}
              </button>
            </div>

            {tutors.length > 0 && (
              <div className="tutors-results">
                <h3>Available Tutors</h3>
                <div className="tutors-grid">
                  {tutors.map((tutor, index) => (
                    <div key={index} className="tutor-card">
                      <div className="tutor-header">
                        <div className="tutor-avatar">
                          <FaGraduationCap />
                        </div>
                        <div className="tutor-info">
                          <h4>{tutor.name}</h4>
                          <p className="tutor-location">
                            <FaMapMarkerAlt /> {tutor.location.area}, {tutor.location.pincode}
                          </p>
                        </div>
                      </div>
                      
                      <div className="tutor-details">
                        <div className="tutor-subjects">
                          <strong>Subjects:</strong>
                          <div className="subjects-list">
                            {tutor.subjects.map((subject, idx) => (
                              <span key={idx} className="subject-tag">
                                {subject.subject}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="tutor-experience">
                          <strong>Experience:</strong> {tutor.experience.years} years
                        </div>
                        
                        <div className="tutor-rating">
                          <strong>Rating:</strong> {tutor.rating.average}/5 ({tutor.rating.count} reviews)
                        </div>
                        
                        {tutor.bio && (
                          <div className="tutor-bio">
                            <strong>About:</strong> {tutor.bio}
                          </div>
                        )}
                      </div>
                      
                      <div className="tutor-actions">
                        <a href={`tel:${tutor.phone}`} className="btn btn-primary">
                          Contact Now
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tutors.length === 0 && searchLoading === false && (searchPincode || searchLocation) && (
              <div className="no-tutors">
                <p>No tutors found in the specified location. Try searching in nearby areas.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Pricing;

