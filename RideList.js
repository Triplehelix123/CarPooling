import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RidesList.css';

// Utility function to generate a random number between min and max
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Extended list of car models categorized by price tiers
const luxuryCarModels = [
  'BMW 3 Series', 'Audi A4', 'Mercedes-Benz C-Class', 'Tesla Model S', 'Lexus ES',
  'Jaguar XF', 'Porsche Macan', 'Volvo XC90', 'Land Rover Range Rover', 'Bentley Continental'
];

const midRangeCarModels = [
  'Toyota Camry', 'Honda Accord', 'Ford Fusion', 'Skoda Superb', 'Volkswagen Passat',
  'Hyundai Elantra', 'Mazda CX-5', 'Jeep Compass', 'Subaru Outback', 'Nissan Altima'
];

const economyCarModels = [
  'Toyota Corolla', 'Honda Civic', 'Chevrolet Cruze', 'Kia Forte', 'Renault Duster',
  'Hyundai Tucson', 'Maruti Ertiga', 'Ford EcoSport', 'MG Hector', 'Nissan Kicks'
];

const bikeModels = [
  'Kawasaki Ninja', 'Yamaha R15', 'Royal Enfield Classic', 'Ducati Monster', 
  'Harley-Davidson Street 750', 'Honda CBR 250R', 'Suzuki Gixxer', 'Bajaj Pulsar 220F', 
  'KTM Duke 390', 'BMW G 310 R', 'TVS Apache RR 310', 'Hero Xtreme 200S', 'Yamaha FZ-S', 
  'Honda CB Hornet 160R', 'Bajaj Dominar 400'
];

// Function to assign fare based on car type and number of seats
const getFare = (model, numberOfSeats) => {
  let baseFare = luxuryCarModels.includes(model) ? getRandomNumber(1000, 1500) :
                 midRangeCarModels.includes(model) ? getRandomNumber(500, 800) :
                 economyCarModels.includes(model) ? getRandomNumber(250, 400) :
                 getRandomNumber(150, 250); // Bikes have the lowest fares

  // Calculate reduced fare per seat for multiple bookings
  if (numberOfSeats > 1) {
    baseFare *= 0.9; // 10% discount per seat for 2 or more seats
  }
  return baseFare; // Return adjusted fare for one seat
};

// Function to calculate discount based on number of seats booked
const getDiscount = (numberOfSeats) => {
  if (numberOfSeats >= 5) return 0.20; // 20% discount for 5 or more seats
  if (numberOfSeats >= 3) return 0.10; // 10% discount for 3 or more seats
  return 0; // No discount for less than 3 seats
};

const generateRandomRides = (count) => {
  const rides = [];
  for (let i = 0; i < count; i++) {
    const isBike = Math.random() > 0.7; // 30% chance of generating a bike ride
    let model;
    if (isBike) {
      model = bikeModels[getRandomNumber(0, bikeModels.length - 1)];
    } else {
      // Choose from one of the three tiers
      const carType = Math.random();
      if (carType < 0.2) {
        model = luxuryCarModels[getRandomNumber(0, luxuryCarModels.length - 1)]; // 20% chance for luxury cars
      } else if (carType < 0.6) {
        model = midRangeCarModels[getRandomNumber(0, midRangeCarModels.length - 1)]; // 40% chance for mid-range cars
      } else {
        model = economyCarModels[getRandomNumber(0, economyCarModels.length - 1)]; // 40% chance for economy cars
      }
    }
    const availableSeats = isBike ? 1 : getRandomNumber(2, 6); // Bikes have 1 seat, cars have 2-6 seats

    rides.push({
      id: i + 1,
      model,
      availableSeats,
    });
  }
  return rides;
};

const RidesList = () => {
  const [rides, setRides] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [totalFare, setTotalFare] = useState(0);
  const navigate = useNavigate(); // Initialize useNavigate
  const userEmail = localStorage.getItem('email'); // Assuming the email is stored in localStorage

  // Generate random rides when the component mounts
  useEffect(() => {
    const randomRidesCount = getRandomNumber(5, 10); // Randomly generate between 5 to 10 rides
    const randomRides = generateRandomRides(randomRidesCount);
    setRides(randomRides);
  }, []);

  const handleSelectRide = (ride) => {
    setSelectedRide(ride);
    setSelectedSeats([]);
    setOpenDialog(true);
    setTotalFare(0); // Reset total fare when a new ride is selected
  };

  const handleSeatSelect = (seatNumber) => {
    setSelectedSeats((prevSelected) => {
      if (prevSelected.includes(seatNumber)) {
        return prevSelected.filter(seat => seat !== seatNumber); // Deselect the seat
      } else {
        return [...prevSelected, seatNumber]; // Select the seat
      }
    });
  };

  const handleCloseDialog = async () => {
    if (selectedSeats.length > 0 && selectedRide) {
      setRides((prevRides) =>
        prevRides.map((ride) =>
          ride.id === selectedRide.id
            ? { ...ride, availableSeats: ride.availableSeats - selectedSeats.length }
            : ride
        )
      );

      // Send an email after booking the ride
      const emailData = {
        email: userEmail,
        model: selectedRide.model,
        seats: selectedSeats,
        fare: totalFare.toFixed(2), // Convert totalFare to string for email
      };

      try {
        await fetch('http://localhost:8080/login/send-confirmation-email', { // Adjusted to new API endpoint
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailData),
        });
      } catch (error) {
        console.error('Error sending email:', error);
      }
    }
    setOpenDialog(false);
    setSelectedRide(null);
    setSelectedSeats([]);
    setTotalFare(0);
    navigate('/ride-success'); // Navigate to ride success page
  };

  // Update total fare whenever selectedSeats or selectedRide changes
  useEffect(() => {
    if (selectedRide) {
      const farePerSeat = getFare(selectedRide.model, selectedSeats.length); // Get fare for selected seats
      const discount = getDiscount(selectedSeats.length); // Get discount based on number of seats
      const fareBeforeDiscount = farePerSeat * selectedSeats.length; // Calculate total fare before discount
      const finalFare = fareBeforeDiscount * (1 - discount); // Apply discount to total fare
      setTotalFare(finalFare); // Update total fare
    }
  }, [selectedSeats, selectedRide]);

  const renderSeats = () => {
    const totalSeats = selectedRide?.availableSeats || 0; // Get available seats
    const seats = [];

    // Always include the driver seat
    seats.push(
      <div key="driver" className="seat front-left disabled">Driver</div>
    );

    // Render passenger seats
    const passengerSeats = totalSeats > 0 ? (
      <div className="seat front-right">Passenger</div>
    ) : null;

    seats.push(passengerSeats);

    // Only render back seats if there are more than 2 total seats
    if (totalSeats > 2) {
      seats.push(<div key="back-left" className="seat back-left">Seat 3</div>);
    }
    if (totalSeats > 3) {
      seats.push(<div key="back-right" className="seat back-right">Seat 4</div>);
    }

    // Generate buttons for selectable seats starting from seat 2
    const selectableSeats = totalSeats > 1 ? totalSeats - 1 : 1; // Adjust for the driver seat
    const seatButtons = [];

    for (let index = 0; index < selectableSeats; index++) {
      const seatNumber = index + 2; // Start from seat 2
      seatButtons.push(
        <button
          key={seatNumber}
          className={seat-button ${selectedSeats.includes(seatNumber) ? 'selected' : ''}}
          onClick={() => handleSeatSelect(seatNumber)}
        >
          {seatNumber}
        </button>
      );
    }

    return (
      <div className="car-layout">
        <div className="front-seats">
          {seats}
        </div>
        <div className="seat-selection">
          {seatButtons}
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      <div className="rides-list">
        <h1>Available Rides</h1>
        <div className="rides-grid">
          {rides.map((ride) => (
            <div className="ride-card" key={ride.id}>
              <h2>{ride.model}</h2>
              <p>Available Seats: {ride.availableSeats}</p>
              <button
                className="select-ride-button"
                onClick={() => handleSelectRide(ride)}
                disabled={ride.availableSeats <= 0}
              >
                Select Ride
              </button>
            </div>
          ))}
        </div>

        {openDialog && (
          <div className="dialog">
            <div className="dialog-content">
              <h2>Select Seats for {selectedRide?.model}</h2>
              <div className="car-container">{renderSeats()}</div>
              {selectedSeats.length > 0 && (
                <p className="seat-selected-message">
                  You have selected {selectedSeats.join(', ')}. Total Fare: ₹{totalFare.toFixed(2)}
                </p>
              )}
              <button className="confirm-button" onClick={handleCloseDialog}>
                Confirm
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RidesList;