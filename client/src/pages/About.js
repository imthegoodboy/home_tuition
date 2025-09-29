import React from 'react';
import { FaGraduationCap, FaUsers, FaAward, FaHeart, FaLightbulb, FaBullseye, FaHandshake, FaBookOpen } from 'react-icons/fa';
import './About.css';

const About = () => {
  const values = [
    {
      icon: <FaGraduationCap />,
      title: "Excellence in Education",
      description: "We are committed to providing the highest quality education through experienced and qualified teachers."
    },
    {
      icon: <FaUsers />,
      title: "Student-Centered Approach",
      description: "Every student is unique, and we tailor our teaching methods to meet individual learning needs."
    },
    {
      icon: <FaAward />,
      title: "Proven Results",
      description: "Our track record speaks for itself with thousands of successful students achieving their academic goals."
    },
    {
      icon: <FaHeart />,
      title: "Passion for Teaching",
      description: "Our teachers are not just educators; they are passionate mentors who care about student success."
    },
    {
      icon: <FaLightbulb />,
      title: "Innovative Methods",
      description: "We use modern teaching techniques and technology to make learning engaging and effective."
    },
    {
      icon: <FaBullseye />,
      title: "Goal-Oriented",
      description: "We help students set and achieve their academic goals through structured learning plans."
    }
  ];

  const team = [
    {
      name: "Dr. Priya Sharma",
      role: "Founder & Director",
      experience: "15+ years in Education",
      description: "PhD in Education with extensive experience in curriculum development and student mentoring."
    },
    {
      name: "Prof. Rajesh Kumar",
      role: "Academic Head",
      experience: "12+ years in Teaching",
      description: "Mathematics expert with a proven track record of helping students excel in competitive exams."
    },
    {
      name: "Ms. Anjali Singh",
      role: "Student Coordinator",
      experience: "8+ years in Student Care",
      description: "Dedicated to ensuring every student receives personalized attention and support."
    }
  ];

  const achievements = [
    { number: "5000+", label: "Students Taught" },
    { number: "95%", label: "Success Rate" },
    { number: "1000+", label: "Verified Teachers" },
    { number: "12", label: "Years of Excellence" }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="hero-content">
            <h1>About Home Tuition</h1>
            <p className="hero-subtitle">
              Empowering students with personalized education right at their doorstep
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <div className="mission-text">
              <h2>Our Mission</h2>
              <p>
                At Home Tuition, we believe that every child deserves access to quality education 
                that is tailored to their individual learning style and pace. Our mission is to 
                provide personalized, one-on-one tutoring services that help students not just 
                pass their exams, but truly understand and love learning.
              </p>
              <p>
                We understand that traditional classroom settings may not work for every student. 
                Some students need extra attention, while others need to be challenged beyond 
                the standard curriculum. That's where we come in – bringing the classroom to 
                your home with expert teachers who are passionate about education.
              </p>
            </div>
            <div className="mission-image">
              <div className="image-placeholder">
                <FaBookOpen className="placeholder-icon" />
                <p>Quality Education at Home</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2 className="section-title">Our Core Values</h2>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="achievements-section">
        <div className="container">
          <h2 className="section-title">Our Achievements</h2>
          <div className="achievements-grid">
            {achievements.map((achievement, index) => (
              <div key={index} className="achievement-item">
                <div className="achievement-number">{achievement.number}</div>
                <div className="achievement-label">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2 className="section-title">Meet Our Team</h2>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <div className="member-avatar">
                  <FaUsers />
                </div>
                <h3>{member.name}</h3>
                <p className="member-role">{member.role}</p>
                <p className="member-experience">{member.experience}</p>
                <p className="member-description">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-section">
        <div className="container">
          <h2 className="section-title">Why Choose Home Tuition?</h2>
          <div className="why-choose-content">
            <div className="why-choose-text">
              <div className="why-item">
                <FaHandshake className="why-icon" />
                <div>
                  <h3>Personalized Attention</h3>
                  <p>One-on-one teaching ensures your child gets the individual attention they need to excel.</p>
                </div>
              </div>
              <div className="why-item">
                <FaBullseye className="why-icon" />
                <div>
                  <h3>Flexible Scheduling</h3>
                  <p>Learn at your own pace with flexible timings that fit your family's schedule.</p>
                </div>
              </div>
              <div className="why-item">
                <FaAward className="why-icon" />
                <div>
                  <h3>Proven Results</h3>
                  <p>Our students consistently achieve higher grades and improved confidence in their studies.</p>
                </div>
              </div>
              <div className="why-item">
                <FaGraduationCap className="why-icon" />
                <div>
                  <h3>Expert Teachers</h3>
                  <p>Highly qualified and experienced teachers who are passionate about education.</p>
                </div>
              </div>
            </div>
            <div className="why-choose-image">
              <div className="image-placeholder">
                <FaHeart className="placeholder-icon" />
                <p>Dedicated to Student Success</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="contact-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Learning Journey?</h2>
            <p>Join thousands of students who have achieved academic success with our home tuition services.</p>
            <div className="cta-buttons">
              <a href="tel:+916205165191" className="btn btn-primary btn-large">
                Call Now: +91 6205165191
              </a>
              <a href="tel:+918252241135" className="btn btn-secondary btn-large">
                Call Now: +91 8252241135
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

