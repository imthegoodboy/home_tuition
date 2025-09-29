import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaBookOpen, FaRupeeSign, FaChartLine, FaUser, FaPhone, FaEnvelope, FaCalendarAlt, FaTrophy, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';
import './Dashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchStudentData = useCallback(async () => {
    try {
      const response = await axios.get(`/api/students/profile/${user.id}`);
      setStudentData(response.data);
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchStudentData();
    }
  }, [user?.id, fetchStudentData]);


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const calculateOverallPercentage = () => {
    if (!studentData?.testMarks || studentData.testMarks.length === 0) return 0;
    
    const totalMarks = studentData.testMarks.reduce((sum, test) => sum + test.marks, 0);
    const totalPossibleMarks = studentData.testMarks.reduce((sum, test) => sum + test.totalMarks, 0);
    
    return totalPossibleMarks > 0 ? Math.round((totalMarks / totalPossibleMarks) * 100) : 0;
  };

  const getRecentTests = () => {
    if (!studentData?.testMarks) return [];
    return studentData.testMarks
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  };

  const getPendingFees = () => {
    if (!studentData?.pendingFees) return [];
    return studentData.pendingFees.filter(fee => !fee.isPaid);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="dashboard-error">
        <FaExclamationTriangle className="error-icon" />
        <h2>Unable to load dashboard</h2>
        <p>Please try refreshing the page or contact support if the problem persists.</p>
      </div>
    );
  }

  return (
    <div className="student-dashboard">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>Welcome back, {user?.name}!</h1>
            <p>Class {studentData.class} • {studentData.subjects?.length || 0} Subjects</p>
          </div>
          <div className="quick-stats">
            <div className="stat-card">
              <FaChartLine className="stat-icon" />
              <div>
                <div className="stat-value">{calculateOverallPercentage()}%</div>
                <div className="stat-label">Overall Performance</div>
              </div>
            </div>
            <div className="stat-card">
              <FaBookOpen className="stat-icon" />
              <div>
                <div className="stat-value">{studentData.testMarks?.length || 0}</div>
                <div className="stat-label">Tests Taken</div>
              </div>
            </div>
            <div className="stat-card">
              <FaRupeeSign className="stat-icon" />
              <div>
                <div className="stat-value">{getPendingFees().length}</div>
                <div className="stat-label">Pending Fees</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="dashboard-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'tests' ? 'active' : ''}`}
            onClick={() => setActiveTab('tests')}
          >
            Test Results
          </button>
          <button 
            className={`tab ${activeTab === 'teachers' ? 'active' : ''}`}
            onClick={() => setActiveTab('teachers')}
          >
            My Teachers
          </button>
          <button 
            className={`tab ${activeTab === 'fees' ? 'active' : ''}`}
            onClick={() => setActiveTab('fees')}
          >
            Fee Structure
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="overview-grid">
                {/* Recent Tests */}
                <div className="card">
                  <div className="card-header">
                    <h3>Recent Test Results</h3>
                    <button className="btn btn-secondary btn-sm">View All</button>
                  </div>
                  <div className="card-content">
                    {getRecentTests().length > 0 ? (
                      <div className="test-list">
                        {getRecentTests().map((test, index) => (
                          <div key={index} className="test-item">
                            <div className="test-info">
                              <h4>{test.testName}</h4>
                              <p>{test.subject} • {formatDate(test.date)}</p>
                            </div>
                            <div className="test-score">
                              <span className="score">{test.marks}/{test.totalMarks}</span>
                              <span className="percentage">
                                {Math.round((test.marks / test.totalMarks) * 100)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <FaBookOpen className="empty-icon" />
                        <p>No test results yet</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* My Teachers */}
                <div className="card">
                  <div className="card-header">
                    <h3>My Teachers</h3>
                  </div>
                  <div className="card-content">
                    {studentData.subjects?.length > 0 ? (
                      <div className="teachers-list">
                        {studentData.subjects.map((subject, index) => (
                          <div key={index} className="teacher-item">
                            <div className="teacher-avatar">
                              <FaUser />
                            </div>
                            <div className="teacher-info">
                              <h4>{subject.teacherId?.userId?.name || 'Teacher Not Assigned'}</h4>
                              <p>{subject.subject}</p>
                              {subject.teacherId?.userId?.phone && (
                                <a href={`tel:${subject.teacherId.userId.phone}`} className="teacher-contact">
                                  <FaPhone /> {subject.teacherId.userId.phone}
                                </a>
                              )}
                            </div>
                            <div className="teacher-status">
                              <span className={`status ${subject.isActive ? 'active' : 'inactive'}`}>
                                {subject.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <FaUser className="empty-icon" />
                        <p>No teachers assigned yet</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pending Fees */}
                <div className="card">
                  <div className="card-header">
                    <h3>Pending Fees</h3>
                  </div>
                  <div className="card-content">
                    {getPendingFees().length > 0 ? (
                      <div className="fees-list">
                        {getPendingFees().map((fee, index) => (
                          <div key={index} className="fee-item">
                            <div className="fee-info">
                              <h4>{fee.month} {fee.year}</h4>
                              <p>Due: {formatDate(fee.dueDate)}</p>
                            </div>
                            <div className="fee-amount">
                              <span className="amount">₹{fee.amount}</span>
                              <button className="btn btn-primary btn-sm">Pay Now</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <FaRupeeSign className="empty-icon" />
                        <p>No pending fees</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Performance Chart Placeholder */}
                <div className="card performance-card">
                  <div className="card-header">
                    <h3>Performance Overview</h3>
                  </div>
                  <div className="card-content">
                    <div className="performance-chart">
                      <div className="chart-placeholder">
                        <FaTrophy className="chart-icon" />
                        <p>Performance tracking coming soon</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tests' && (
            <div className="tests-tab">
              <div className="card">
                <div className="card-header">
                  <h3>All Test Results</h3>
                  <button className="btn btn-primary btn-sm">Add New Test</button>
                </div>
                <div className="card-content">
                  {studentData.testMarks?.length > 0 ? (
                    <div className="tests-table">
                      <div className="table-header">
                        <div>Test Name</div>
                        <div>Subject</div>
                        <div>Date</div>
                        <div>Score</div>
                        <div>Percentage</div>
                        <div>Remarks</div>
                      </div>
                      {studentData.testMarks.map((test, index) => (
                        <div key={index} className="table-row">
                          <div className="test-name">{test.testName}</div>
                          <div className="test-subject">{test.subject}</div>
                          <div className="test-date">{formatDate(test.date)}</div>
                          <div className="test-score">{test.marks}/{test.totalMarks}</div>
                          <div className="test-percentage">
                            {Math.round((test.marks / test.totalMarks) * 100)}%
                          </div>
                          <div className="test-remarks">{test.remarks || '-'}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <FaBookOpen className="empty-icon" />
                      <p>No test results available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'teachers' && (
            <div className="teachers-tab">
              <div className="card">
                <div className="card-header">
                  <h3>My Teachers</h3>
                </div>
                <div className="card-content">
                  {studentData.subjects?.length > 0 ? (
                    <div className="teachers-grid">
                      {studentData.subjects.map((subject, index) => (
                        <div key={index} className="teacher-card">
                          <div className="teacher-avatar">
                            <FaUser />
                          </div>
                          <div className="teacher-details">
                            <h4>{subject.teacherId?.userId?.name || 'Teacher Not Assigned'}</h4>
                            <p className="teacher-subject">{subject.subject}</p>
                            <p className="teacher-class">Class {studentData.class}</p>
                            {subject.teacherId?.userId?.phone && (
                              <div className="teacher-contact-info">
                                <a href={`tel:${subject.teacherId.userId.phone}`} className="contact-link">
                                  <FaPhone /> {subject.teacherId.userId.phone}
                                </a>
                                <a href={`mailto:${subject.teacherId.userId.email}`} className="contact-link">
                                  <FaEnvelope /> Email
                                </a>
                              </div>
                            )}
                            <div className="teacher-status">
                              <span className={`status ${subject.isActive ? 'active' : 'inactive'}`}>
                                {subject.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <FaUser className="empty-icon" />
                      <p>No teachers assigned yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fees' && (
            <div className="fees-tab">
              <div className="fees-grid">
                <div className="card">
                  <div className="card-header">
                    <h3>Fee Structure</h3>
                  </div>
                  <div className="card-content">
                    {studentData.feeStructure ? (
                      <div className="fee-structure">
                        <div className="fee-summary">
                          <div className="total-fee">
                            <span className="label">Total Monthly Fee:</span>
                            <span className="amount">₹{studentData.feeStructure.totalMonthlyFee || 0}</span>
                          </div>
                        </div>
                        <div className="subject-fees">
                          {studentData.feeStructure.subjects?.map((subject, index) => (
                            <div key={index} className="subject-fee-item">
                              <span className="subject">{subject.subject}</span>
                              <span className="fee">₹{subject.fee}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="empty-state">
                        <FaRupeeSign className="empty-icon" />
                        <p>Fee structure not available</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h3>Payment History</h3>
                  </div>
                  <div className="card-content">
                    {studentData.pendingFees?.length > 0 ? (
                      <div className="payment-history">
                        {studentData.pendingFees.map((fee, index) => (
                          <div key={index} className={`payment-item ${fee.isPaid ? 'paid' : 'pending'}`}>
                            <div className="payment-info">
                              <h4>{fee.month} {fee.year}</h4>
                              <p>Due: {formatDate(fee.dueDate)}</p>
                            </div>
                            <div className="payment-amount">
                              <span className="amount">₹{fee.amount}</span>
                              <span className={`status ${fee.isPaid ? 'paid' : 'pending'}`}>
                                {fee.isPaid ? 'Paid' : 'Pending'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <FaCalendarAlt className="empty-icon" />
                        <p>No payment records</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

