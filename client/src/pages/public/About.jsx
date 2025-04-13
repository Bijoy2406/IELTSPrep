import React from 'react';
import Layout from '../../components/layout/Layout';
import { FaGraduationCap, FaChartLine, FaUsers, FaGlobe } from 'react-icons/fa';
import '../../styles/About.css';

const About = () => {
  return (
    <Layout>
      <div className="about-container">
        <section className="hero-section">
          <h1 className="title">About IELTS Prep</h1>
          <p className="subtitle">
            We're dedicated to helping students around the world achieve their target IELTS scores
            through comprehensive preparation and personalized feedback.
          </p>
        </section>

        <section className="section">
          <div className="mission-section">
            <h2 className="section-title">Our Mission</h2>
            <p className="mission-text">
              At IELTS Prep, our mission is to make high-quality IELTS preparation accessible to everyone.
              We believe that language proficiency should never be a barrier to educational and professional
              opportunities. Through our innovative platform, we aim to empower test-takers with the skills,
              strategies, and confidence they need to succeed in the IELTS exam and beyond.
            </p>
          </div>

          <h2 className="section-title">Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <FaGraduationCap />
              </div>
              <h3 className="value-title">Excellence in Education</h3>
              <p className="value-description">
                We are committed to providing the highest quality educational resources
                and maintaining rigorous standards in all our practice materials.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <FaUsers />
              </div>
              <h3 className="value-title">Student-Centered Approach</h3>
              <p className="value-description">
                We put our users first, designing our platform and services to meet
                the diverse needs of IELTS test-takers around the world.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <FaChartLine />
              </div>
              <h3 className="value-title">Continuous Improvement</h3>
              <p className="value-description">
                We constantly update our materials and methods based on the latest
                IELTS trends and educational research.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <FaGlobe />
              </div>
              <h3 className="value-title">Global Accessibility</h3>
              <p className="value-description">
                We strive to make quality IELTS preparation accessible to students
                from all backgrounds and geographical locations.
              </p>
            </div>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Our Team</h2>
          <div className="team-section">
            <div className="team-grid">
              <div className="team-member">
                <img className="member-image" src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80" alt="John Davis" />
                <div className="member-info">
                  <h3 className="member-name">John Davis</h3>
                  <p className="member-role">Founder & CEO</p>
                  <p className="member-bio">
                    Former IELTS examiner with over 15 years of experience in language education.
                    John founded IELTS Prep with a vision to transform how students prepare for the exam.
                  </p>
                </div>
              </div>

              <div className="team-member">
                <img className="member-image" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=776&q=80" alt="Sarah Johnson" />
                <div className="member-info">
                  <h3 className="member-name">Sarah Johnson</h3>
                  <p className="member-role">Head of Content</p>
                  <p className="member-bio">
                    With a background in linguistics and education, Sarah leads our team of content
                    creators, ensuring all practice materials meet the highest standards.
                  </p>
                </div>
              </div>

              <div className="team-member">
                <img className="member-image" src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80" alt="Michael Chen" />
                <div className="member-info">
                  <h3 className="member-name">Michael Chen</h3>
                  <p className="member-role">Chief Technology Officer</p>
                  <p className="member-bio">
                    A tech innovator with a passion for education, Michael oversees the development
                    of our platform, making it intuitive, responsive, and effective.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;
