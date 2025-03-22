import React, { useState, useMemo } from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Button,
  TextField,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CardActions,
  Stack,
  Menu,
  MenuItem,
  Container,
  Divider,
} from '@mui/material';
import { 
  LocationOn, 
  Delete, 
  Edit, 
  Search, 
  Warning, 
  CheckCircle,
  MoreVert,
  Add as AddIcon,
  Map as MapIcon,
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import NewCollectionPointForm from '../components/forms/NewCollectionPointForm';
import { useLanguage } from '../context/LanguageContext';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Mumbai coordinates
const MUMBAI_CENTER = [19.0760, 72.8777];
const MUMBAI_BOUNDS = [
  [18.8928, 72.7764], // Southwest coordinates
  [19.2766, 72.9919], // Northeast coordinates
];

const LeafletMap = ({ points }) => {
  const getMarkerColor = (status) => {
    switch (status) {
      case 'Full':
        return 'red';
      case 'Maintenance':
        return 'orange';
      default:
        return 'green';
    }
  };

  const createCustomIcon = (status) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${getMarkerColor(status)}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  return (
    <MapContainer
      center={MUMBAI_CENTER}
      zoom={11}
      maxBounds={MUMBAI_BOUNDS}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {points.map((point) => (
        <Marker
          key={point.id}
          position={point.coordinates}
          icon={createCustomIcon(point.status)}
        >
          <Popup>
            <div>
              <Typography variant="subtitle1">{point.name}</Typography>
              <Typography variant="body2">{point.address}</Typography>
              <Typography variant="body2">Status: {point.status}</Typography>
              <Typography variant="body2">Capacity: {point.capacity}%</Typography>
              <Typography variant="body2">Type: {point.type}</Typography>
              <Typography variant="body2">Next Collection: {point.nextCollection}</Typography>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

const Points = () => {
  const { translate } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [menuState, setMenuState] = useState({ anchorEl: null, pointId: null });
  const [openNewPoint, setOpenNewPoint] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [points, setPoints] = useState([
    {
      id: 1,
      name: 'Dharavi Collection Center',
      address: 'Dharavi, Mumbai, Maharashtra',
      type: 'General',
      status: 'Active',
      capacity: 75,
      lastCollection: '2024-02-20',
      nextCollection: '2024-02-27',
      coordinates: [19.0419, 72.8530]
    },
    {
      id: 2,
      name: 'Bandra Recycling Hub',
      address: 'Bandra West, Mumbai, Maharashtra',
      type: 'Recyclable',
      status: 'Full',
      capacity: 95,
      lastCollection: '2024-02-21',
      nextCollection: '2024-02-24',
      coordinates: [19.0596, 72.8295]
    },
    {
      id: 3,
      name: 'Andheri E-Waste Center',
      address: 'Andheri East, Mumbai, Maharashtra',
      type: 'Electronic',
      status: 'Maintenance',
      capacity: 45,
      lastCollection: '2024-02-19',
      nextCollection: '2024-02-26',
      coordinates: [19.1136, 72.8697]
    },
    {
      id: 4,
      name: 'Dadar Community Collection',
      address: 'Dadar West, Mumbai, Maharashtra',
      type: 'General',
      status: 'Active',
      capacity: 60,
      lastCollection: '2024-02-22',
      nextCollection: '2024-02-25',
      coordinates: [19.0178, 72.8478]
    },
    {
      id: 5,
      name: 'Powai Waste Management',
      address: 'Powai, Mumbai, Maharashtra',
      type: 'Mixed',
      status: 'Active',
      capacity: 55,
      lastCollection: '2024-02-21',
      nextCollection: '2024-02-24',
      coordinates: [19.1176, 72.9060]
    },
    {
      id: 6,
      name: 'Colaba Collection Point',
      address: 'Colaba, Mumbai, Maharashtra',
      type: 'General',
      status: 'Full',
      capacity: 90,
      lastCollection: '2024-02-20',
      nextCollection: '2024-02-23',
      coordinates: [18.9067, 72.8147]
    },
    {
      id: 7,
      name: 'Chembur Recycling Center',
      address: 'Chembur, Mumbai, Maharashtra',
      type: 'Recyclable',
      status: 'Active',
      capacity: 40,
      lastCollection: '2024-02-22',
      nextCollection: '2024-02-25',
      coordinates: [19.0522, 72.9005]
    },
    {
      id: 8,
      name: 'Goregaon Collection Hub',
      address: 'Goregaon East, Mumbai, Maharashtra',
      type: 'Mixed',
      status: 'Active',
      capacity: 65,
      lastCollection: '2024-02-21',
      nextCollection: '2024-02-24',
      coordinates: [19.1663, 72.8526]
    },
    {
      id: 9,
      name: 'Worli Hazardous Waste',
      address: 'Worli, Mumbai, Maharashtra',
      type: 'Hazardous',
      status: 'Maintenance',
      capacity: 30,
      lastCollection: '2024-02-20',
      nextCollection: '2024-02-27',
      coordinates: [19.0096, 72.8175]
    },
    {
      id: 10,
      name: 'Ghatkopar Collection Point',
      address: 'Ghatkopar West, Mumbai, Maharashtra',
      type: 'General',
      status: 'Active',
      capacity: 70,
      lastCollection: '2024-02-22',
      nextCollection: '2024-02-25',
      coordinates: [19.0858, 72.9062]
    }
  ]);

  const handleNewPoint = () => {
    setOpenNewPoint(true);
  };

  const handleCloseNewPoint = () => {
    setOpenNewPoint(false);
  };

  const handleMenuOpen = (event, pointId) => {
    setMenuState({ anchorEl: event.currentTarget, pointId });
  };

  const handleMenuClose = () => {
    setMenuState({ anchorEl: null, pointId: null });
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredPoints = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return points.filter(point => 
      point.name.toLowerCase().includes(query) ||
      point.address.toLowerCase().includes(query) ||
      point.type.toLowerCase().includes(query) ||
      point.status.toLowerCase().includes(query)
    );
  }, [points, searchQuery]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'full':
        return 'error';
      case 'maintenance':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          {translate('points.title')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewPoint}
        >
          {translate('points.addNew')}
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper 
            sx={{ 
              height: '600px', 
              position: 'relative', 
              overflow: 'hidden',
              '& .leaflet-container': {
                height: '100%',
                width: '100%',
                zIndex: 1
              }
            }}
          >
            <LeafletMap points={filteredPoints} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 2, 
              mb: 2, 
              height: '600px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder={translate('points.search')}
                value={searchQuery}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            
            <Box sx={{ 
              flexGrow: 1, 
              overflow: 'auto',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#888',
                borderRadius: '4px',
                '&:hover': {
                  background: '#666',
                },
              },
            }}>
              <Stack spacing={2}>
                {filteredPoints.map((point) => (
                  <Card key={point.id} variant="outlined">
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Typography variant="h6" component="h2">
                          {point.name}
                        </Typography>
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, point.id)}>
                          <MoreVert />
                        </IconButton>
                      </Box>
                      <Typography color="textSecondary" gutterBottom>
                        {point.address}
                      </Typography>
                      <Box display="flex" gap={1} mt={1}>
                        <Chip 
                          label={point.type} 
                          size="small" 
                          color="primary" 
                          variant="outlined" 
                        />
                        <Chip 
                          label={point.status} 
                          size="small" 
                          color={getStatusColor(point.status)}
                        />
                      </Box>
                      <Box mt={2}>
                        <Typography variant="body2" color="textSecondary">
                          {translate('points.capacity')}: {point.capacity}%
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {translate('points.lastCollection')}: {point.lastCollection}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {translate('points.nextCollection')}: {point.nextCollection}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Menu
        anchorEl={menuState.anchorEl}
        open={Boolean(menuState.anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <Edit sx={{ mr: 1 }} /> {translate('actions.edit')}
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Delete sx={{ mr: 1 }} /> {translate('actions.delete')}
        </MenuItem>
      </Menu>

      <NewCollectionPointForm
        open={openNewPoint}
        onClose={handleCloseNewPoint}
      />
    </Container>
  );
};

export default Points; 