import React, { useEffect, useState } from 'react';
import emailjs from 'emailjs-com';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';
import './Home.css';
import Header from './Header';
import SignupModal from './SignupModal'; 
import carGif from './car.gif';

const Home = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(Array(3).fill(false));
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false); 
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();

  const handleGetStarted = () => {
    setIsSignupModalOpen(true); 
  };

  const handleContactFormSubmit = (event) => {
    event.preventDefault();

    const templateParams = {
      from_name: fullName,
      from_email: email,
      message: message,
    };

    emailjs
      .send('service_grrc09p', 'template_2j8l23n', templateParams, '9qPVcliB0l4Hvmnc3')
      .then((response) => {
        console.log('Message sent successfully!', response.status, response.text);
        alert('Your message has been sent!');
        setFullName('');
        setEmail('');
        setMessage('');
      })
      .catch((error) => {
        console.error('Failed to send message:', error);
        alert('Failed to send your message. Please try again later.');
      });
  };

  const features = [
    {
      color: 'blue',
      title: 'Find Your Ride',
      icon: '🚗',
      description: 'Quickly discover available rides or offer one. Travel together and reduce expenses.',
    },
    {
      color: 'green',
      title: 'Sustainable Travel',
      icon: '🌱',
      description: 'Share rides, cut down emissions, and contribute to eco-friendly transportation.',
    },
    {
      color: 'red',
      title: 'Flexible Plans',
      icon: '⏳',
      description: 'Enjoy the freedom to adjust schedules and make spontaneous travel decisions.',
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        setIsVisible((prev) => {
          const newVisible = [...prev];
          newVisible[index] = entry.isIntersecting;
          return newVisible;
        });
      });
    });

    const cards = document.querySelectorAll('.chronoCraft-feature-card');
    cards.forEach((card) => observer.observe(card));

    return () => {
      cards.forEach((card) => observer.unobserve(card));
    };
  }, []);

  return (
    <div className="chronoCraft-home">
      <motion.div className="chronoCraft-progress-bar" style={{ scaleX: scrollYProgress }} />
      <Header />
      <div className="chronoCraft-hero-section" id="home">
        <div className="chronoCraft-hero-overlay"></div>
        <div className="chronoCraft-hero-content">
          <h1>Share Your Ride, Save the Planet</h1>
          <p>Join our eco-friendly carpooling community to reduce traffic, save fuel, and cut down <span className="spaced-text">carbon emissions. Together, we can make a difference!</span></p>
          <button className="chronoCraft-get-started-button" onClick={handleGetStarted}>
            Get Started
          </button>
          <img src={carGif} alt="Car animation" className="homepage-gif" /> {/* Updated image */}
        </div>
      </div>

      <section className="chronoCraft-features-section">
        <div className="chronoCraft-features-container">
          {features.map(({ color, title, icon, description }, index) => (
            <div
              key={title}
              className={chronoCraft-feature-card chronoCraft-${color} ${isVisible[index] ? 'fade-in' : 'fade-out'}}
            >
              <div className="chronoCraft-feature-card-icon">{icon}</div>
              <h3>{title}</h3>
              <div className="chronoCraft-feature-card-content">
                <p>{description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="chronoCraft-about-section" id="about">
          <div className="chronoCraft-about-text">
            <div className="chronoCraft-about-icon">🌍</div>
            <h3>Join the RideShare Movement</h3>
            <p>
              Make traveling more affordable and eco-friendly by joining our carpooling community. Whether you're commuting daily or planning a trip, RideShare Hub simplifies the process.
              <br />
              <br />
              Join us today and experience the benefits of smart travel.
            </p>
          </div>
        </div>
      </section>

      <section className="chronoCraft-contact-section" id="sign-in">
        <div className="chronoCraft-contact-container">
          <h2>Contact Us</h2>
          <p>If you have any questions, feel free to reach out. We're here to help with all your carpooling needs!</p>
          <form className="chronoCraft-contact-form" onSubmit={handleContactFormSubmit}>
            <div className="chronoCraft-form-group">
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <textarea
              placeholder="Message"
              rows="8"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
            <button type="submit" className="chronoCraft-submit-button">
              Send Message
            </button>
          </form>
        </div>
      </section>

      <section id="sign-up"></section>
      <footer className="chronoCraft-footer">
        <p>© 2024 RideShare Hub. All rights reserved.</p>
      </footer>

      {/* Modal for Signup */}
      <SignupModal isOpen={isSignupModalOpen} onClose={() => setIsSignupModalOpen(false)} />
    </div>
  );
};

export default Home;