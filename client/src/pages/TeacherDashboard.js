import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUsers, FaRupeeSign, FaChartLine, FaPhone, FaEnvelope, FaCalendarAlt, FaTrophy, FaExclamationTriangle, FaBookOpen, FaGraduationCap } from 'react-icons/fa';
import axios from 'axios';
import './Dashboard.css';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchTeacherData = useCallback(async () => {
    try {
      const response = await axios.get(`/api/teachers/profile/${user.id}`);
      setTeacherData(response.data);
    } catch (error) {
      console.error('Error fetching teacher data:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchTeacherData();
    }
  }, [user?.id, fetchTeacherData]);


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const getActiveStudents = () => {
    if (!teacherData?.students) return [];
    return teacherData.students.filter(student => student.isActive);
  };

  const getPendingPayments = () => {
    if (!teacherData?.pendingPayments) return [];
    return teacherData.pendingPayments.filter(payment => !payment.isPaid);
  };

  const calculateTotalEarnings = () => {
    if (!teacherData?.salary) return 0;
    return teacherData.salary.totalMonthlySalary || 0;
  };

  const getUpcomingPayments = () => {
    const pending = getPendingPayments();
    const now = new Date();
    return pending.filter(payment => new Date(payment.dueDate) > now);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (!teacherData) {
    return (
      <div className="dashboard-error">
        <FaExclamationTriangle className="error-icon" />
        <h2>Unable to load dashboard</h2>
        <p>Please try refreshing the page or contact support if the problem persists.</p>
      </div>
    );
  }

  return (
    <div className="teacher-dashboard">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>Welcome back, {user?.name}!</h1>
            <p>Teacher • {getActiveStudents().length} Active Students</p>
          </div>
          <div className="quick-stats">
            <div className="stat-card">
              <FaUsers className="stat-icon" />
              <div>
                <div className="stat-value">{getActiveStudents().length}</div>
                <div className="stat-label">Active Students</div>
              </div>
            </div>
            <div className="stat-card">
              <FaRupeeSign className="stat-icon" />
              <div>
                <div className="stat-value">₹{calculateTotalEarnings()}</div>
                <div className="stat-label">Monthly Salary</div>
              </div>
            </div>
            <div className="stat-card">
              <FaTrophy className="stat-icon" />
              <div>
                <div className="stat-value">{teacherData.rating?.average || 0}/5</div>
                <div className="stat-label">Rating</div>
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
            className={`tab ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            My Students
          </button>
          <button 
            className={`tab ${activeTab === 'salary' ? 'active' : ''}`}
            onClick={() => setActiveTab('salary')}
          >
            Salary & Payments
          </button>
          <button 
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="overview-grid">
                {/* My Students */}
                <div className="card">
                  <div className="card-header">
                    <h3>My Students</h3>
                    <button className="btn btn-secondary btn-sm">View All</button>
                  </div>
                  <div className="card-content">
                    {getActiveStudents().length > 0 ? (
                      <div className="students-list">
                        {getActiveStudents().slice(0, 5).map((student, index) => (
                          <div key={index} className="student-item">
                            <div className="student-avatar">
                              <FaGraduationCap />
                            </div>
                            <div className="student-info">
                              <h4>{student.studentId?.userId?.name || 'Student'}</h4>
                              <p>{student.subject} • Started: {formatDate(student.startDate)}</p>
                            </div>
                            <div className="student-status">
                              <span className="status active">Active</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <FaUsers className="empty-icon" />
                        <p>No students assigned yet</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Salary Overview */}
                <div className="card">
                  <div className="card-header">
                    <h3>Salary Overview</h3>
                  </div>
                  <div className="card-content">
                    <div className="salary-summary">
                      <div className="salary-item">
                        <span className="label">Monthly Salary:</span>
                        <span className="amount">₹{calculateTotalEarnings()}</span>
                      </div>
                      <div className="salary-item">
                        <span className="label">Pending Payments:</span>
                        <span className="amount pending">₹{getPendingPayments().reduce((sum, p) => sum + p.amount, 0)}</span>
                      </div>
                      <div className="salary-item">
                        <span className="label">Upcoming Payments:</span>
                        <span className="amount upcoming">{getUpcomingPayments().length}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="card">
                  <div className="card-header">
                    <h3>Recent Activity</h3>
                  </div>
                  <div className="card-content">
                    <div className="activity-list">
                      <div className="activity-item">
                        <div className="activity-icon">
                          <FaUsers />
                        </div>
                        <div className="activity-info">
                          <p>New student assigned to {teacherData.subjects?.[0]?.subject || 'your subject'}</p>
                          <span className="activity-time">2 days ago</span>
                        </div>
                      </div>
                      <div className="activity-item">
                        <div className="activity-icon">
                          <FaRupeeSign />
                        </div>
                        <div className="activity-info">
                          <p>Payment received for March 2024</p>
                          <span className="activity-time">1 week ago</span>
                        </div>
                      </div>
                      <div className="activity-item">
                        <div className="activity-icon">
                          <FaTrophy />
                        </div>
                        <div className="activity-info">
                          <p>New rating received: 5 stars</p>
                          <span className="activity-time">2 weeks ago</span>
                        </div>
                      </div>
                    </div>
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
                        <FaChartLine className="chart-icon" />
                        <p>Performance analytics coming soon</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="students-tab">
              <div className="card">
                <div className="card-header">
                  <h3>All My Students</h3>
                  <button className="btn btn-primary btn-sm">Add Student</button>
                </div>
                <div className="card-content">
                  {getActiveStudents().length > 0 ? (
                    <div className="students-grid">
                      {getActiveStudents().map((student, index) => (
                        <div key={index} className="student-card">
                          <div className="student-avatar">
                            <FaGraduationCap />
                          </div>
                          <div className="student-details">
                            <h4>{student.studentId?.userId?.name || 'Student'}</h4>
                            <p className="student-subject">{student.subject}</p>
                            <p className="student-class">Class {student.studentId?.class || 'N/A'}</p>
                            <div className="student-contact-info">
                              {student.studentId?.userId?.phone && (
                                <a href={`tel:${student.studentId.userId.phone}`} className="contact-link">
                                  <FaPhone /> {student.studentId.userId.phone}
                                </a>
                              )}
                              {student.studentId?.userId?.email && (
                                <a href={`mailto:${student.studentId.userId.email}`} className="contact-link">
                                  <FaEnvelope /> Email
                                </a>
                              )}
                            </div>
                            <div className="student-meta">
                              <span className="start-date">
                                Started: {formatDate(student.startDate)}
                              </span>
                              <span className={`status ${student.isActive ? 'active' : 'inactive'}`}>
                                {student.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <FaUsers className="empty-icon" />
                      <p>No students assigned yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'salary' && (
            <div className="salary-tab">
              <div className="salary-grid">
                <div className="card">
                  <div className="card-header">
                    <h3>Salary Structure</h3>
                  </div>
                  <div className="card-content">
                    {teacherData.salary ? (
                      <div className="salary-structure">
                        <div className="salary-summary">
                          <div className="total-salary">
                            <span className="label">Total Monthly Salary:</span>
                            <span className="amount">₹{teacherData.salary.totalMonthlySalary || 0}</span>
                          </div>
                        </div>
                        <div className="subject-salaries">
                          {teacherData.salary.subjects?.map((subject, index) => (
                            <div key={index} className="subject-salary-item">
                              <span className="subject">{subject.subject}</span>
                              <span className="salary">₹{subject.salary}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="empty-state">
                        <FaRupeeSign className="empty-icon" />
                        <p>Salary structure not available</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h3>Payment History</h3>
                  </div>
                  <div className="card-content">
                    {teacherData.pendingPayments?.length > 0 ? (
                      <div className="payment-history">
                        {teacherData.pendingPayments.map((payment, index) => (
                          <div key={index} className={`payment-item ${payment.isPaid ? 'paid' : 'pending'}`}>
                            <div className="payment-info">
                              <h4>{payment.month} {payment.year}</h4>
                              <p>Due: {formatDate(payment.dueDate)}</p>
                            </div>
                            <div className="payment-amount">
                              <span className="amount">₹{payment.amount}</span>
                              <span className={`status ${payment.isPaid ? 'paid' : 'pending'}`}>
                                {payment.isPaid ? 'Received' : 'Pending'}
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

          {activeTab === 'profile' && (
            <div className="profile-tab">
              <div className="profile-grid">
                <div className="card">
                  <div className="card-header">
                    <h3>Personal Information</h3>
                    <button className="btn btn-secondary btn-sm">Edit Profile</button>
                  </div>
                  <div className="card-content">
                    <div className="profile-info">
                      <div className="profile-item">
                        <span className="label">Name:</span>
                        <span className="value">{user?.name}</span>
                      </div>
                      <div className="profile-item">
                        <span className="label">Email:</span>
                        <span className="value">{user?.email}</span>
                      </div>
                      <div className="profile-item">
                        <span className="label">Phone:</span>
                        <span className="value">{user?.phone}</span>
                      </div>
                      <div className="profile-item">
                        <span className="label">Experience:</span>
                        <span className="value">{teacherData.experience?.years || 0} years</span>
                      </div>
                      <div className="profile-item">
                        <span className="label">Rating:</span>
                        <span className="value">{teacherData.rating?.average || 0}/5 ({teacherData.rating?.count || 0} reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h3>Subjects & Classes</h3>
                  </div>
                  <div className="card-content">
                    {teacherData.subjects?.length > 0 ? (
                      <div className="subjects-list">
                        {teacherData.subjects.map((subject, index) => (
                          <div key={index} className="subject-item">
                            <div className="subject-info">
                              <h4>{subject.subject}</h4>
                              <p>Classes: {subject.classes?.join(', ') || 'Not specified'}</p>
                            </div>
                            <div className="subject-rate">
                              <span className="rate">₹{subject.hourlyRate}/hour</span>
                              <span className={`availability ${subject.isAvailable ? 'available' : 'unavailable'}`}>
                                {subject.isAvailable ? 'Available' : 'Unavailable'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <FaBookOpen className="empty-icon" />
                        <p>No subjects specified</p>
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

export default TeacherDashboard;

