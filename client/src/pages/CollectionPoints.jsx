import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Card,
  CardContent,
  Chip,
  Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Add global styles for Leaflet map
const mapStyles = {
  '.leaflet-container': {
    height: '100%',
    width: '100%',
    margin: 0,
    padding: 0,
  },
};

const CollectionPoints = () => {
  const [points, setPoints] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter] = useState([19.0760, 72.8777]); // Mumbai center coordinates

  useEffect(() => {
    fetchCollectionPoints();
    
    // Add global styles for Leaflet
    const style = document.createElement('style');
    style.textContent = Object.entries(mapStyles)
      .map(([selector, rules]) => 
        `${selector} {${Object.entries(rules)
          .map(([property, value]) => `${property}: ${value}`)
          .join(';')}}`
      )
      .join('');
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const fetchCollectionPoints = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/collection-points');
      const data = await response.json();
      setPoints(data);
    } catch (error) {
      console.error('Error fetching collection points:', error);
    }
  };

  const filteredPoints = points.filter(point =>
    point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    point.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    point.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'maintenance':
        return 'warning';
      case 'full':
        return 'error';
      default:
        return 'default';
    }
  };

  const getCapacityColor = (capacity) => {
    if (capacity >= 90) return 'error';
    if (capacity >= 70) return 'warning';
    return 'success';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1">
              Collection Points
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ borderRadius: 2 }}
            >
              Add Point
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ height: '600px', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ height: '100%', width: '100%', position: 'absolute' }}>
              <MapContainer
                center={mapCenter}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {filteredPoints.map((point) => (
                  <Marker
                    key={point.id}
                    position={[point.latitude, point.longitude]}
                  >
                    <Popup>
                      <Typography variant="subtitle1" component="div">
                        {point.name}
                      </Typography>
                      <Typography variant="body2" component="div">
                        {point.address}
                      </Typography>
                      <Typography variant="body2" component="div">
                        Status: {point.status}
                        <br />
                        Capacity: {point.capacity}%
                      </Typography>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              placeholder="Search collection points..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
            />
          </Box>

          <Box sx={{ height: '540px', overflowY: 'auto' }}>
            {filteredPoints.map((point) => (
              <Card key={point.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h6" component="div" gutterBottom>
                        {point.name}
                      </Typography>
                      <Typography variant="body2" component="div" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOnIcon fontSize="small" />
                        {point.address}
                      </Typography>
                    </Box>
                    <IconButton>
                      <MoreVertIcon />
                    </IconButton>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" component="div" color="text.secondary" gutterBottom>
                      Last Collection: {point.last_collection || 'N/A'}
                    </Typography>
                    <Typography variant="body2" component="div" color="text.secondary" gutterBottom>
                      Next: {point.next_collection || 'Not scheduled'}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Chip
                      label={point.status}
                      color={getStatusColor(point.status)}
                      size="small"
                    />
                    <Chip
                      label={`${Math.round(point.capacity)}% Capacity`}
                      color={getCapacityColor(point.capacity)}
                      size="small"
                    />
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CollectionPoints; 