import React from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaChalkboardTeacher, FaUsers, FaAward, FaBookOpen, FaPhone, FaCheckCircle } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const features = [
    {
      icon: <FaGraduationCap />,
      title: "One Dedicated Teacher for Each Subject",
      description: "Personalized attention with dedicated teachers for every subject"
    },
    {
      icon: <FaUsers />,
      title: "1000+ Verified & Experienced Teachers",
      description: "Highly qualified and verified teachers with years of experience"
    },
    {
      icon: <FaBookOpen />,
      title: "Teaching Based on Latest Exam Patterns",
      description: "Updated curriculum following the latest CBSE exam patterns"
    },
    {
      icon: <FaAward />,
      title: "Regular Chapter-Wise Tests",
      description: "Boost confidence with regular assessments and progress tracking"
    },
    {
      icon: <FaChalkboardTeacher />,
      title: "Personal Mentor Support",
      description: "Individual guidance and support for every student's success"
    },
    {
      icon: <FaCheckCircle />,
      title: "High-Quality Learning at Affordable Price",
      description: "Premium education at competitive and affordable pricing"
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                <span className="title-main">HOME TUTION</span>
                <span className="title-sub">Your Personal Teacher — Right at Your Home</span>
                <span className="title-classes">1 to 12th</span>
              </h1>
              
              <div className="hero-features">
                <h2>What We Offer</h2>
                <div className="features-grid">
                  {features.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <div className="feature-icon">{feature.icon}</div>
                      <div className="feature-content">
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hero-cta">
                <div className="contact-info">
                  <div className="phone-numbers">
                    <FaPhone className="phone-icon" />
                    <div>
                      <a href="tel:+916205165191">+91 6205165191</a>
                      <a href="tel:+918252241135">+91 8252241135</a>
                    </div>
                  </div>
                  <p className="call-now">Call Now for a Free Demo Class!</p>
                </div>
                
                <div className="cta-buttons">
                  <Link to="/register" className="btn btn-primary btn-large">
                    Try Free 3-Day Demo Class
                  </Link>
                  <Link to="/pricing" className="btn btn-secondary btn-large">
                    View Pricing
                  </Link>
                </div>
              </div>

              <div className="hiring-notice">
                <h3>WE ARE ALSO HIRING TEACHERS</h3>
                <p>All Subjects</p>
                <Link to="/register" className="btn btn-success">
                  Join as Teacher
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">1000+</div>
              <div className="stat-label">Verified Teachers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5000+</div>
              <div className="stat-label">Happy Students</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">95%</div>
              <div className="stat-label">Success Rate</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">12</div>
              <div className="stat-label">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us">
        <div className="container">
          <h2 className="section-title">Why Choose Home Tuition?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <FaGraduationCap />
              </div>
              <h3>Personalized Learning</h3>
              <p>One-on-one attention ensures your child gets the focus they need to excel in their studies.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <FaBookOpen />
              </div>
              <h3>Flexible Schedule</h3>
              <p>Learn at your own pace with flexible timings that fit your family's schedule.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <FaAward />
              </div>
              <h3>Proven Results</h3>
              <p>Our students consistently achieve higher grades and improved confidence in their studies.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <FaChalkboardTeacher />
              </div>
              <h3>Expert Teachers</h3>
              <p>Highly qualified teachers with years of experience in their respective subjects.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Learning Journey?</h2>
            <p>Join thousands of students who have achieved academic success with our home tuition services.</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary btn-large">
                Get Started Today
              </Link>
              <Link to="/find-tutor" className="btn btn-secondary btn-large">
                Find a Tutor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <h2 className="section-title">What Parents And Students Say</h2>
          <div className="testimonials-grid">
            {[{
              name: 'Rahul Sharma (Class 10)',
              quote: 'The dedicated Math teacher helped me boost my score from 65% to 90% in just 3 months!',
              city: 'Patna'
            }, {
              name: 'Priya Singh (Parent)',
              quote: 'Regular tests and mentor support made a big difference. Highly recommended!',
              city: 'Delhi'
            }, {
              name: 'Arjun Verma (Class 12)',
              quote: 'Amazing Physics tuition matched to my exam pattern. Scored 95% in Boards.',
              city: 'Bengaluru'
            }].map((t, i) => (
              <div key={i} className="testimonial-card">
                <p className="quote">“{t.quote}”</p>
                <div className="author">{t.name}</div>
                <div className="city">{t.city}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="faqs">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-list">
            {[{
              q: 'Do you provide a free demo?',
              a: 'Yes, we offer a 3-day free demo class so you can experience our teaching quality.'
            }, {
              q: 'How are teachers verified?',
              a: 'All teachers undergo document verification and experience checks before onboarding.'
            }, {
              q: 'Can I change the teacher if not satisfied?',
              a: 'Absolutely. You can request a replacement teacher anytime at no extra cost.'
            }, {
              q: 'Do you cover all CBSE subjects?',
              a: 'Yes, we cover all CBSE subjects from Class 1 to 12.'
            }].map((f, i) => (
              <div key={i} className="faq-item">
                <div className="faq-q">{f.q}</div>
                <div className="faq-a">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

