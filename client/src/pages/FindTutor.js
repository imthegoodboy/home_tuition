import React, { useState, useEffect } from 'react';
import { FaSearch, FaMapMarkerAlt, FaGraduationCap, FaPhone, FaStar, FaClock, FaBookOpen } from 'react-icons/fa';
import axios from 'axios';
import './FindTutor.css';

const FindTutor = () => {
  const [searchData, setSearchData] = useState({
    pincode: '',
    area: '',
    subject: '',
    class: ''
  });
  const [tutors, setTutors] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [recommended, setRecommended] = useState([]);
  const [minRating, setMinRating] = useState(0);

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
    fetchRecommended();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/api/subjects/classes');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  // Fetch some recommended tutors for dummy data experience
  const fetchRecommended = async () => {
    try {
      const resp = await axios.get('/api/tutors/search', { params: { area: 'Andheri' } });
      setRecommended(resp.data.slice(0, 3));
    } catch (e) {
      // ignore
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const searchTutors = async (e) => {
    e.preventDefault();
    
    if (!searchData.pincode && !searchData.area) {
      alert('Please enter pincode or area name');
      return;
    }

    setLoading(true);
    setHasSearched(true);
    
    try {
      const response = await axios.get('/api/tutors/search', {
        params: {
          pincode: searchData.pincode,
          area: searchData.area,
          subject: searchData.subject,
          class: searchData.class,
          minRating
        }
      });
      setTutors(response.data);
    } catch (error) {
      console.error('Error searching tutors:', error);
      alert('Error searching tutors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="star filled" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="star half" />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="star empty" />);
    }
    
    return stars;
  };

  return (
    <div className="find-tutor-page">
      <div className="container">
        <div className="page-header">
          <h1>Find Your Perfect Tutor</h1>
          <p>Connect with experienced teachers in your area</p>
        </div>

        {/* Search Form */}
        <div className="search-section">
          <form onSubmit={searchTutors} className="search-form">
            <div className="search-grid">
              <div className="form-group">
                <label className="form-label">
                  <FaMapMarkerAlt className="label-icon" />
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={searchData.pincode}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter pincode"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  <FaMapMarkerAlt className="label-icon" />
                  Area/Location
                </label>
                <input
                  type="text"
                  name="area"
                  value={searchData.area}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter area name"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  <FaBookOpen className="label-icon" />
                  Class
                </label>
                <select
                  name="class"
                  value={searchData.class}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls} value={cls}>Class {cls}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  <FaGraduationCap className="label-icon" />
                  Subject
                </label>
                <select
                  name="subject"
                  value={searchData.subject}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select Subject</option>
                  {searchData.class && cbseSubjects[searchData.class]?.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Minimum Rating</label>
                <select value={minRating} onChange={e => setMinRating(parseFloat(e.target.value))} className="form-select">
                  <option value={0}>Any</option>
                  <option value={4}>4.0+</option>
                  <option value={4.5}>4.5+</option>
                </select>
              </div>
            </div>
            
            <button
              type="submit"
              className="btn btn-primary btn-large search-btn"
              disabled={loading}
            >
              <FaSearch className="btn-icon" />
              {loading ? 'Searching...' : 'Find Tutors'}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {hasSearched && (
          <div className="results-section">
            <div className="results-header">
              <h2>
                {loading ? 'Searching...' : `${tutors.length} Tutor${tutors.length !== 1 ? 's' : ''} Found`}
              </h2>
              {!loading && tutors.length > 0 && (
                <p>Showing tutors in your area</p>
              )}
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Searching for tutors...</p>
              </div>
            ) : tutors.length > 0 ? (
              <div className="tutors-grid">
                {tutors.map((tutor, index) => (
                  <div key={index} className="tutor-card">
                    <div className="tutor-header">
                      <div className="tutor-avatar">
                        <FaGraduationCap />
                      </div>
                      <div className="tutor-info">
                        <h3>{tutor.name}</h3>
                        <p className="tutor-location">
                          <FaMapMarkerAlt /> {tutor.location.area}, {tutor.location.pincode}
                        </p>
                      </div>
                      <div className="tutor-rating">
                        <div className="stars">
                          {renderStars(tutor.rating.average)}
                        </div>
                        <span className="rating-text">
                          {tutor.rating.average}/5 ({tutor.rating.count} reviews)
                        </span>
                      </div>
                    </div>
                    
                    <div className="tutor-details">
                      <div className="detail-item">
                        <strong>Experience:</strong> {tutor.experience.years} years
                      </div>
                      
                      <div className="detail-item">
                        <strong>Subjects:</strong>
                        <div className="subjects-list">
                          {tutor.subjects.map((subject, idx) => (
                            <span key={idx} className="subject-tag">
                              {subject.subject}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {tutor.bio && (
                        <div className="detail-item">
                          <strong>About:</strong>
                          <p className="tutor-bio">{tutor.bio}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="tutor-actions">
                      <a href={`tel:${tutor.phone}`} className="btn btn-primary">
                        <FaPhone className="btn-icon" />
                        Contact Now
                      </a>
                      <button className="btn btn-secondary">
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <div className="no-results-icon">
                  <FaGraduationCap />
                </div>
                <h3>No tutors found</h3>
                <p>We couldn't find any tutors in the specified location. Try searching in nearby areas or contact us for assistance.</p>
                <div className="no-results-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => setHasSearched(false)}
                  >
                    Try Different Search
                  </button>
                  <a href="tel:+916205165191" className="btn btn-secondary">
                    Call for Help
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recommended Tutors */}
        {!hasSearched && recommended.length > 0 && (
          <div className="results-section">
            <div className="results-header">
              <h2>Recommended Tutors Near You</h2>
              <p>Popular and highly rated teachers</p>
            </div>
            <div className="tutors-grid">
              {recommended.map((tutor, index) => (
                <div key={index} className="tutor-card">
                  <div className="tutor-header">
                    <div className="tutor-avatar"><FaGraduationCap /></div>
                    <div className="tutor-info">
                      <h3>{tutor.name}</h3>
                      <p className="tutor-location"><FaMapMarkerAlt /> {tutor.location.area}, {tutor.location.pincode}</p>
                    </div>
                  </div>
                  <div className="tutor-details">
                    <div className="detail-item"><strong>Experience:</strong> {tutor.experience.years} years</div>
                    <div className="detail-item"><strong>Subjects:</strong> <div className="subjects-list">{tutor.subjects.map((s, i) => (<span key={i} className="subject-tag">{s.subject}</span>))}</div></div>
                  </div>
                  <div className="tutor-actions">
                    <a href={`tel:${tutor.phone}`} className="btn btn-primary">Contact Now</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="features-section">
          <h2>Why Choose Our Tutors?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <FaGraduationCap className="feature-icon" />
              <h3>Verified Teachers</h3>
              <p>All our tutors are verified and have proper qualifications</p>
            </div>
            <div className="feature-card">
              <FaStar className="feature-icon" />
              <h3>Highly Rated</h3>
              <p>Our tutors have excellent ratings from students and parents</p>
            </div>
            <div className="feature-card">
              <FaClock className="feature-icon" />
              <h3>Flexible Timings</h3>
              <p>Choose timings that work best for your schedule</p>
            </div>
            <div className="feature-card">
              <FaMapMarkerAlt className="feature-icon" />
              <h3>Local Teachers</h3>
              <p>Find teachers in your area for convenient home visits</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindTutor;

