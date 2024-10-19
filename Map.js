import React, { useState, useEffect } from 'react';
import { TextField, Autocomplete, Box, Button, Typography } from '@mui/material';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import './Map.css'; // Import the CSS file

const libraries = ['places'];

const Map = () => {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [pickUpPoint, setPickUpPoint] = useState(null);
  const [destinationPoint, setDestinationPoint] = useState(null);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    if (!isLoaded) return;

    const autocompleteService = new window.google.maps.places.AutocompleteService();

    const fetchOptions = (input) => {
      if (input === '') {
        setOptions([]);
        return;
      }

      autocompleteService.getPlacePredictions({ input }, (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setOptions(predictions.map((prediction) => ({
            label: prediction.description,
            placeId: prediction.place_id,
          })));
        } else {
          setOptions([]);
        }
      });
    };

    fetchOptions(inputValue);
  }, [inputValue, isLoaded]);

  const handlePlaceSelect = (event, value, type) => {
    if (value) {
      if (type === 'pickUp') {
        setPickUpPoint({ label: value.label, lat: null, lng: null });
      } else {
        setDestinationPoint({ label: value.label, lat: null, lng: null });
      }
    }
  };

  const handleMapClick = async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    console.log('Map clicked at:', lat, lng); // Debug log for clicked coordinates

    // Use Nominatim to get the address from the latitude and longitude
    try {
      const response = await fetch(https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json);
      if (!response.ok) throw new Error('Failed to fetch address');

      const data = await response.json();
      const address = data.display_name; // Get the formatted address
      console.log('Address fetched from Nominatim:', address); // Debug log for fetched address

      if (!pickUpPoint) {
        setPickUpPoint({ label: address, lat, lng });
      } else if (!destinationPoint) {
        setDestinationPoint({ label: address, lat, lng });
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Always redirect to the rideList page without any conditions
    navigate('/rideList');
  };

  if (loadError) return <div>Error loading Google Maps API</div>;

  return (
    <div className="bike-ride-page">
      <Box className="map-container">
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            zoom={15}
            center={{ lat: 10.927606756388924, lng: 76.92319257408951 }}
            onClick={handleMapClick}
          >
            {pickUpPoint && <Marker position={{ lat: pickUpPoint.lat, lng: pickUpPoint.lng }} />}
            {destinationPoint && <Marker position={{ lat: destinationPoint.lat, lng: destinationPoint.lng }} />}
          </GoogleMap>
        )}
      </Box>

      <Box className="booking-form">
        <Typography variant="h4" gutterBottom>Book a Ride</Typography>
        <Box component="form" width="100%" maxWidth="400px" display="flex" flexDirection="column" onSubmit={handleSubmit}>
          <TextField
            label="Name"
            variant="outlined"
            margin="normal"
            fullWidth
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            InputProps={{
              style: { color: 'white' }, // Set input text color to white
            }}
            InputLabelProps={{
              style: { color: 'white' }, // Set label text color to white
            }}
          />
          <Autocomplete
            freeSolo
            options={options}
            getOptionLabel={(option) => option.label || ''}
            inputValue={pickUpPoint ? pickUpPoint.label : inputValue}
            onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
            onChange={(event, value) => handlePlaceSelect(event, value, 'pickUp')}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Enter Pick Up Point"
                variant="outlined"
                margin="normal"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  style: { color: 'white' }, // Set input text color to white
                }}
                InputLabelProps={{
                  style: { color: 'white' }, // Set label text color to white
                }}
              />
            )}
          />
          <Autocomplete
            freeSolo
            options={options}
            getOptionLabel={(option) => option.label || ''}
            inputValue={destinationPoint ? destinationPoint.label : inputValue}
            onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
            onChange={(event, value) => handlePlaceSelect(event, value, 'destination')}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Enter Destination"
                variant="outlined"
                margin="normal"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  style: { color: 'white' }, // Set input text color to white
                }}
                InputLabelProps={{
                  style: { color: 'white' }, // Set label text color to white
                }}
              />
            )}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            style={{ padding: '15px', fontSize: '18px', borderRadius: '8px', backgroundColor: '#007bff', marginTop: '20px' }}
          >
            Pick Me
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default Map;