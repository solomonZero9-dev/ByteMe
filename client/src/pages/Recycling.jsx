import React, { useState } from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Card, 
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Stack,
  Menu,
  MenuItem,
  Rating
} from '@mui/material';
import { 
  Recycling, 
  LocationOn, 
  Phone, 
  Email, 
  AccessTime, 
  Star, 
  StarBorder,
  Search,
  MoreVert,
  Add as AddIcon
} from '@mui/icons-material';
import NewRecyclingCenterForm from '../components/forms/NewRecyclingCenterForm';

const RecyclingCenters = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [openNewCenter, setOpenNewCenter] = useState(false);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNewCenter = () => {
    setOpenNewCenter(true);
  };

  const handleCloseNewCenter = () => {
    setOpenNewCenter(false);
  };

  const handleSubmitNewCenter = (data) => {
    // Handle the new center data
    console.log('New recycling center:', data);
  };

  const centers = [
    {
      id: 1,
      name: 'Mumbai Eco Solutions',
      address: '24, Mahim Industrial Estate, Mahim West, Mumbai - 400016',
      phone: '+91 22 2445 8901',
      email: 'info@mumbaiecosolutions.com',
      hours: 'Mon-Sat: 9:00 AM - 7:00 PM',
      rating: 4.5,
      materials: ['Paper', 'Plastic', 'Glass', 'Metal', 'E-waste'],
      status: 'Open',
      capacity: 85
    },
    {
      id: 2,
      name: 'Dharavi Recycling Center',
      address: 'Plot 13, 90 Feet Road, Dharavi, Mumbai - 400017',
      phone: '+91 22 2446 7890',
      email: 'contact@dharavirecycling.com',
      hours: 'Mon-Sun: 8:00 AM - 8:00 PM',
      rating: 4.7,
      materials: ['Plastic', 'Metal', 'Paper', 'Textiles'],
      status: 'Open',
      capacity: 90
    },
    {
      id: 3,
      name: 'Andheri Green Hub',
      address: '401, MIDC Industrial Area, Andheri East, Mumbai - 400093',
      phone: '+91 22 2632 5678',
      email: 'info@andherigreenhub.com',
      hours: 'Mon-Sat: 8:30 AM - 6:30 PM',
      rating: 4.3,
      materials: ['E-waste', 'Batteries', 'Electronics', 'Metal'],
      status: 'Open',
      capacity: 75
    },
    {
      id: 4,
      name: 'Powai Recyclers',
      address: '15, Central Avenue, Hiranandani Gardens, Powai, Mumbai - 400076',
      phone: '+91 22 2570 1234',
      email: 'contact@powairecyclers.com',
      hours: 'Mon-Fri: 9:00 AM - 5:00 PM',
      rating: 4.4,
      materials: ['Paper', 'Plastic', 'Glass', 'Organic Waste'],
      status: 'Open',
      capacity: 70
    },
    {
      id: 5,
      name: 'Chembur Waste Management',
      address: 'Plot 7, RCF Colony, Chembur, Mumbai - 400074',
      phone: '+91 22 2556 9012',
      email: 'info@chemburwaste.com',
      hours: 'Mon-Sat: 7:00 AM - 7:00 PM',
      rating: 4.6,
      materials: ['All Materials', 'Hazardous Waste'],
      status: 'Open',
      capacity: 95
    }
  ];

  const getStatusChip = (status) => {
    switch (status) {
      case 'active':
        return <Chip label="Active" color="success" size="small" />;
      case 'maintenance':
        return <Chip label="Maintenance" color="warning" size="small" />;
      case 'closed':
        return <Chip label="Closed" color="error" size="small" />;
      default:
        return null;
    }
  };

  const getCapacityChip = (capacity) => {
    switch (capacity) {
      case 'high':
        return <Chip label="High Capacity" color="success" size="small" />;
      case 'medium':
        return <Chip label="Medium Capacity" color="warning" size="small" />;
      case 'low':
        return <Chip label="Low Capacity" color="error" size="small" />;
      default:
        return null;
    }
  };

  const MobileCenterCard = ({ center }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="h6">{center.name}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOn fontSize="small" />
            <Typography variant="body2">{center.address}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Phone fontSize="small" />
            <Typography variant="body2">{center.phone}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Email fontSize="small" />
            <Typography variant="body2">{center.email}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTime fontSize="small" />
            <Typography variant="body2">{center.hours}</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {center.materials.map((material) => (
              <Chip key={material} label={material} size="small" />
            ))}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Rating value={center.rating} readOnly size="small" />
            <Typography variant="body2">({center.rating})</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {getStatusChip(center.status)}
            {getCapacityChip(center.capacity)}
          </Box>
        </Stack>
      </CardContent>
      <CardActions>
        <IconButton onClick={handleMenuClick}>
          <MoreVert />
        </IconButton>
      </CardActions>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 2 : 0
      }}>
        <Typography variant="h4">Recycling Centers</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewCenter}
        >
          Add Center
        </Button>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search recycling centers..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {isMobile ? (
        <Box>
          {centers.map((center) => (
            <MobileCenterCard key={center.id} center={center} />
          ))}
        </Box>
      ) : (
        <Grid container spacing={3}>
          {centers.map((center) => (
            <Grid item xs={12} sm={6} md={4} key={center.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {center.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <LocationOn fontSize="small" />
                    <Typography variant="body2">{center.address}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Phone fontSize="small" />
                    <Typography variant="body2">{center.phone}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Email fontSize="small" />
                    <Typography variant="body2">{center.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <AccessTime fontSize="small" />
                    <Typography variant="body2">{center.hours}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                    {center.materials.map((material) => (
                      <Chip key={material} label={material} size="small" />
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Rating value={center.rating} readOnly size="small" />
                    <Typography variant="body2">({center.rating})</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {getStatusChip(center.status)}
                    {getCapacityChip(center.capacity)}
                  </Box>
                </CardContent>
                <CardActions>
                  <IconButton onClick={handleMenuClick}>
                    <MoreVert />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
        <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
        <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
      </Menu>

      <NewRecyclingCenterForm
        open={openNewCenter}
        onClose={handleCloseNewCenter}
        onSubmit={handleSubmitNewCenter}
      />
    </Box>
  );
};

export default RecyclingCenters; 