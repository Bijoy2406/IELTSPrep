import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaPaperPlane } from 'react-icons/fa';
import '../../styles/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);

    // For demo purposes, we'll just show a success message
    setSubmitted(true);

    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });

    // Hide success message after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <Layout>
      <div className="contact-container">
        <h1 className="title">Contact Us</h1>
        <p className="subtitle">
          Have questions about our IELTS preparation services? We're here to help.
          Reach out to us using the contact information below or send us a message.
        </p>

        <div className="contact-grid">
          <div className="contact-info">
            <h2 className="info-title">Get in Touch</h2>

            <div className="info-item">
              <div className="info-icon">
                <FaMapMarkerAlt />
              </div>
              <div className="info-content">
                <h3 className="info-label">Our Location</h3>
                <p className="info-text">123 Education Street, Academic District, London, UK</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <FaPhoneAlt />
              </div>
              <div className="info-content">
                <h3 className="info-label">Phone Number</h3>
                <p className="info-text">+44 (0) 123 456 7890</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <FaEnvelope />
              </div>
              <div className="info-content">
                <h3 className="info-label">Email Address</h3>
                <p className="info-text">info@ieltsprep.com</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <FaClock />
              </div>
              <div className="info-content">
                <h3 className="info-label">Office Hours</h3>
                <p className="info-text">Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p className="info-text">Saturday: 10:00 AM - 4:00 PM</p>
                <p className="info-text">Sunday: Closed</p>
              </div>
            </div>
          </div>

          <div className="contact-form">
            <h2 className="form-title">Send Us a Message</h2>

            {submitted && (
              <div className="success-message">
                Thank you for your message! We'll get back to you soon.
              </div>
            )}

            <form className="form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name" className="label">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject" className="label">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message" className="label">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="text-area"
                />
              </div>

              <button type="submit" className="submit-button">
                <FaPaperPlane />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
