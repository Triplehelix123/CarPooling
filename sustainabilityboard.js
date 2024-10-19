import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Divider } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProfessionalSustainabilityDashboard = () => {
  // Static data for the dashboard
  const data = {
    carbonFootprint: 1150,
    totalRides: 700,
    ridesShared: 650,
    fuelSaved: 1800,
  };

  // Data for the bar chart
  const barChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Rides Shared',
        data: [60, 80, 90, 75, 100, 120],
        backgroundColor: '#007bff',
        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box sx={{ padding: 2, backgroundColor: '#282c34', minHeight: '100vh', maxWidth: '1000px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom style={{ color: '#ffffff', marginBottom: '15px', fontSize: '1.8rem' }}>
        Sustainability Dashboard
      </Typography>
      
      <Divider style={{ backgroundColor: '#555', marginBottom: '20px' }} />
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Card style={{ backgroundColor: '#3b3f47', border: '1px solid #555' }}>
            <CardContent>
              <Typography variant="subtitle2" style={{ color: '#cccccc', fontSize: '0.9rem' }}>Total Carbon Footprint (kg CO2)</Typography>
              <Typography variant="h4" style={{ color: '#ffffff', fontSize: '1.5rem' }}>{data.carbonFootprint}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card style={{ backgroundColor: '#3b3f47', border: '1px solid #555' }}>
            <CardContent>
              <Typography variant="subtitle2" style={{ color: '#cccccc', fontSize: '0.9rem' }}>Total Fuel Saved (liters)</Typography>
              <Typography variant="h4" style={{ color: '#ffffff', fontSize: '1.5rem' }}>{data.fuelSaved}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card style={{ backgroundColor: '#3b3f47', border: '1px solid #555' }}>
            <CardContent>
              <Typography variant="subtitle2" style={{ color: '#cccccc', fontSize: '0.9rem' }}>Total Rides</Typography>
              <Typography variant="h4" style={{ color: '#ffffff', fontSize: '1.5rem' }}>{data.totalRides}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card style={{ backgroundColor: '#3b3f47', border: '1px solid #555' }}>
            <CardContent>
              <Typography variant="subtitle2" style={{ color: '#cccccc', fontSize: '0.9rem' }}>Rides Shared</Typography>
              <Typography variant="h4" style={{ color: '#ffffff', fontSize: '1.5rem' }}>{data.ridesShared}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider style={{ backgroundColor: '#555', marginTop: '20px', marginBottom: '20px' }} />

      <Typography variant="h6" gutterBottom style={{ color: '#ffffff', fontSize: '1.2rem' }}>Rides Shared (Monthly)</Typography>
      <Box style={{ maxWidth: '500px', margin: '0 auto', paddingTop: '15px' }}>
        <Bar
          data={barChartData}
          options={{
            responsive: true,
            scales: {
              x: { ticks: { color: '#ffffff' }, grid: { color: '#555' } },
              y: { ticks: { color: '#ffffff' }, grid: { color: '#555' } },
            },
            plugins: {
              legend: {
                labels: {
                  color: '#ffffff',
                },
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default ProfessionalSustainabilityDashboard;