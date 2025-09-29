import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUsers, FaChalkboardTeacher, FaMoneyBill, FaSave } from 'react-icons/fa';
import './Dashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [pricingConfig, setPricingConfig] = useState({ classBase: {}, discountPercent: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [u, s, t, cfg] = await Promise.all([
        axios.get('/api/admin/users'),
        axios.get('/api/admin/students'),
        axios.get('/api/admin/teachers'),
        axios.get('/api/admin/pricing-config')
      ]);
      setUsers(u.data || []);
      setStudents(s.data || []);
      setTeachers(t.data || []);
      setPricingConfig(cfg.data || { classBase: {}, discountPercent: 0 });
    } catch (err) {
      console.error('Admin fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClassBaseChange = (cls, value) => {
    setPricingConfig(prev => ({
      ...prev,
      classBase: { ...prev.classBase, [cls]: Number(value) }
    }));
  };

  const saveConfig = async () => {
    try {
      await axios.post('/api/admin/pricing-config', pricingConfig);
      alert('Pricing config saved');
    } catch (err) {
      console.error('Save config error', err);
      alert('Failed to save pricing config');
    }
  };

  if (loading) return <div className="dashboard-loading"><div className="loading-spinner"></div><p>Loading admin dashboard...</p></div>;

  return (
    <div className="admin-dashboard container">
      <div className="dashboard-header">
        <h1>Admin Panel</h1>
        <p>Manage users, teachers, students and pricing</p>
      </div>

      <div className="admin-grid">
        <div className="card">
          <div className="card-header"><FaUsers /> All Users</div>
          <div className="card-content">
            <ul>
              {users.map(u => <li key={u._id}>{u.name} - {u.email} - {u.role}</li>)}
            </ul>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><FaChalkboardTeacher /> Teachers</div>
          <div className="card-content">
            <ul>
              {teachers.map(t => <li key={t._id}>{t.userId?.name} - {t.userId?.email}</li>)}
            </ul>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><FaUsers /> Students</div>
          <div className="card-content">
            <ul>
              {students.map(s => <li key={s._id}>{s.userId?.name} - Class {s.class}</li>)}
            </ul>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><FaMoneyBill /> Pricing Configuration</div>
          <div className="card-content">
            <div className="pricing-config-form">
              <div className="form-row">
                {Array.from({ length: 12 }, (_, i) => String(i + 1)).map(cls => (
                  <div key={cls} className="form-group small">
                    <label>Class {cls}</label>
                    <input type="number" value={pricingConfig.classBase?.[cls] || ''} onChange={e => handleClassBaseChange(cls, e.target.value)} />
                  </div>
                ))}
              </div>
              <div className="form-row">
                <div className="form-group small">
                  <label>Discount Percent</label>
                  <input type="number" value={pricingConfig.discountPercent || 0} onChange={e => setPricingConfig(prev => ({ ...prev, discountPercent: Number(e.target.value) }))} />
                </div>
              </div>
              <button className="btn btn-primary" onClick={saveConfig}><FaSave /> Save Pricing</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
