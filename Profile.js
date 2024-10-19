import React, { useState } from 'react';
import './Profile.css';

const ProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [workAddress, setWorkAddress] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [paymentWallet, setPaymentWallet] = useState('');
  const [gender, setGender] = useState('');
  const [ageGroup, setAgeGroup] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const profileData = {
      name,
      email,
      phone,
      homeAddress,
      workAddress,
      bloodGroup,
      paymentWallet,
      gender,
      ageGroup,
    };

    // Save profile data to backend or localStorage
    fetch('http://localhost:8080/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Profile saved:', data);
        alert('Profile saved successfully!');
      })
      .catch((error) => {
        console.error('Error saving profile:', error);
        alert('Error saving profile');
      });
  };

  return (
    <div className="profile-page">
    <div className="profile-page-container">
      <h2>Complete Your Profile</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Home Address"
          value={homeAddress}
          onChange={(e) => setHomeAddress(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Work Address"
          value={workAddress}
          onChange={(e) => setWorkAddress(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Blood Group"
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
          required
        />
       
        
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <select
          value={ageGroup}
          onChange={(e) => setAgeGroup(e.target.value)}
          required
        >
          <option value="">Select Age Group</option>
          <option value="18-25">18-25</option>
          <option value="26-35">26-35</option>
          <option value="36-45">36-45</option>
          <option value="46-60">46-60</option>
          <option value="60+">60+</option>
        </select>

        <button type="submit" className="profile-submit-button">Save Profile</button>
      </form>
    </div>
    </div>
  );
};

export default ProfilePage;