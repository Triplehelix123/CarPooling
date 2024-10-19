import React, { useEffect, useState } from 'react';
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
  const [isEditing, setIsEditing] = useState(false);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [points, setPoints] = useState(0);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      const email = localStorage.getItem('email');
      try {
        // Fetch profile data
        const response = await fetch(http://localhost:8080/profile/email/${email});
        if (!response.ok) throw new Error('Failed to fetch profile data');
        const data = await response.json();
        if (data) {
          setName(data.name);
          setEmail(data.email);
          setPhone(data.phone);
          setHomeAddress(data.homeAddress);
          setWorkAddress(data.workAddress);
          setBloodGroup(data.bloodGroup);
          setPaymentWallet(data.paymentWallet);
          setGender(data.gender);
          setAgeGroup(data.ageGroup);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }

      // Fetch booking history
      try {
        const historyResponse = await fetch(http://localhost:8080/api/rides/user/${email});
        if (!historyResponse.ok) throw new Error('Failed to fetch booking history');
        const history = await historyResponse.json();
        setBookingHistory(history);
        setPoints(history.length); // Calculate points based on number of rides
      } catch (error) {
        console.error('Error fetching booking history:', error);
      }

      // Increment rides and points on login
      try {
        const incrementResponse = await fetch('http://localhost:8080/profile/increment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
        if (!incrementResponse.ok) throw new Error('Failed to increment rides and points');
        const incrementData = await incrementResponse.json();
        console.log('Increment data:', incrementData);
      } catch (error) {
        console.error('Error incrementing rides and points:', error);
      }
    };

    fetchProfileData();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const profileData = {
      name,
      email, // Updated: Now editable
      phone,
      homeAddress,
      workAddress,
      bloodGroup,
      paymentWallet,
      gender,
      ageGroup,
    };

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
        setIsEditing(false);
      })
      .catch((error) => {
        console.error('Error saving profile:', error);
        alert('Error saving profile');
      });
  };

  const toggleBookingHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <div className="w">
      <div className="profile-page">
        <div className="profile-page-container">
          <h2>Complete Your Profile</h2>
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-grid">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={!isEditing}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Email input is now editable
                required
                disabled={!isEditing} // Keep editable based on isEditing state
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={!isEditing}
              />
              <input
                type="text"
                placeholder="Blood Group"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                required
                disabled={!isEditing}
              />
              <input
                type="text"
                placeholder="Payment Wallet"
                value={paymentWallet}
                onChange={(e) => setPaymentWallet(e.target.value)}
                required
                disabled={!isEditing}
              />
              <div className="address-container">
                <div className="address-box">
                  <h3>Home Address</h3>
                  <input
                    type="text"
                    placeholder="Home Address"
                    value={homeAddress}
                    onChange={(e) => setHomeAddress(e.target.value)}
                    required
                    disabled={!isEditing}
                  />
                </div>
                <div className="address-box">
                  <h3>Work Address</h3>
                  <input
                    type="text"
                    placeholder="Work Address"
                    value={workAddress}
                    onChange={(e) => setWorkAddress(e.target.value)}
                    required
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                disabled={!isEditing}
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
                disabled={!isEditing}
              >
                <option value="">Select Age Group</option>
                <option value="18-25">18-25</option>
                <option value="26-35">26-35</option>
                <option value="36-45">36-45</option>
                <option value="46-60">46-60</option>
                <option value="60+">60+</option>
              </select>
            </div>

            <button type="submit" className="profile-submit-button" disabled={!isEditing}>Save Profile</button>
          </form>
          <button onClick={handleEditToggle} className="edit-button">
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>

          {/* Points Display */}
          <div className="points-display">
            <h3>Your Points: {points}</h3>
            {points >= 10 && <p>Congratulations! You can redeem a free ride!</p>}
          </div>

          {/* Button to fetch and toggle booking history */}
          <button onClick={toggleBookingHistory} className="history-button">
            {showHistory ? 'Hide Booking History' : 'Show Booking History'}
          </button>

          {/* Booking History Display */}
          {showHistory && (
            <div className="booking-history">
              <h3>Booking History</h3>
              {bookingHistory.length > 0 ? (
                <ul>
                  {bookingHistory.map((ride, index) => (
                    <li key={index}>
                      {Ride ID: ${ride.id}, Pick Up: ${ride.pickUpPoint.label}, Destination: ${ride.destinationPoint.label}, Date: ${new Date(ride.date).toLocaleString()}}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No booking history found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;