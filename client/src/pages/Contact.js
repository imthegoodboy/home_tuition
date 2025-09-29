import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can call backend later; for now we just simulate success
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      <div className="container">
        <div className="page-header">
          <h1>Contact Us</h1>
          <p>We'd love to help you choose the right tutor</p>
        </div>

        <div className="contact-grid">
          <div className="contact-card">
            <h3>Get In Touch</h3>
            <div className="contact-item"><FaPhone /> <a href="tel:+916205165191">+91 6205165191</a></div>
            <div className="contact-item"><FaPhone /> <a href="tel:+918252241135">+91 8252241135</a></div>
            <div className="contact-item"><FaEnvelope /> support@hometuition.com</div>
            <div className="contact-item"><FaMapMarkerAlt /> India</div>
          </div>

          <div className="form-card">
            <h3>Send a Message</h3>
            {submitted ? (
              <div className="success-box">
                <FaPaperPlane /> Thank you! We'll contact you shortly.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <input name="name" value={form.name} onChange={handleChange} className="form-input" placeholder="Your Name" required />
                  <input type="email" name="email" value={form.email} onChange={handleChange} className="form-input" placeholder="Email" required />
                </div>
                <input name="phone" value={form.phone} onChange={handleChange} className="form-input" placeholder="Phone" required />
                <textarea name="message" value={form.message} onChange={handleChange} className="form-input" placeholder="Your Message" rows="5" required />
                <button type="submit" className="btn btn-primary btn-large"><FaPaperPlane /> Send</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;


