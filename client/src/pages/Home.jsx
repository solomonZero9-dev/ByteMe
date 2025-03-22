import React, { useEffect, useState } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Avatar, 
  Skeleton, 
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  Button,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  Recycling as RecyclingIcon, 
  LocationOn as LocationIcon, 
  CheckCircle as CheckIcon, 
  CalendarToday as CalendarIcon,
  LocalShipping as TruckIcon, 
  Scale as ScaleIcon,
  OpenInNew as OpenInNewIcon,
  ArrowForward as ArrowForwardIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  AttachMoney as AttachMoneyIcon,
  BarChart as BarChartIcon,
  Language as LanguageIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const API_BASE_URL = 'http://127.0.0.1:8080/api';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { translate, currentLanguage, changeLanguage } = useLanguage();
  const [collections, setCollections] = useState([]);
  const [points, setPoints] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [languageMenu, setLanguageMenu] = useState(null);

  // State for statistics
  const [totalWasteCollected, setTotalWasteCollected] = useState(360.0);
  const [recyclingRate, setRecyclingRate] = useState(22);
  const [activeCollectionPoints, setActiveCollectionPoints] = useState(0);
  const [binsAtCapacity, setBinsAtCapacity] = useState(0);

  // Recent activity data
  const recentActivitiesData = [
    {
      id: 1,
      type: 'collection',
      location: 'Dadar Collection Point',
      amount: '25kg',
      timestamp: '2024-03-15T10:30:00',
      status: 'completed'
    },
    {
      id: 2,
      type: 'recycling',
      location: 'Powai Recycling Center',
      amount: '15kg',
      timestamp: '2024-03-15T09:15:00',
      status: 'processing'
    },
    {
      id: 3,
      type: 'hazardous',
      location: 'Worli Disposal Facility',
      amount: '5kg',
      timestamp: '2024-03-15T08:45:00',
      status: 'completed'
    }
  ];

  // Sample data for statistics
  const sampleStatsData = {
    totalWaste: 360.0,
    recyclingRate: 22,
    activePoints: 8,
    binsAtCapacity: 3
  };

  // Sample data for waste distribution
  const sampleCollections = [
    {
      id: 1,
      waste_type: 'General Waste',
      waste_collected: 150,
      status: 'Completed'
    },
    {
      id: 2,
      waste_type: 'Recyclable',
      waste_collected: 80,
      status: 'Completed'
    },
    {
      id: 3,
      waste_type: 'Hazardous',
      waste_collected: 30,
      status: 'Completed'
    },
    {
      id: 4,
      waste_type: 'Organic',
      waste_collected: 100,
      status: 'Completed'
    }
  ];

  // Fetch data on component mount
  useEffect(() => {
    const fetchHomeData = async () => {
      setIsLoading(true);
      try {
        const [statsResponse, activitiesResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/statistics`),
          fetch(`${API_BASE_URL}/recent-activities`)
        ]);

        if (!statsResponse.ok || !activitiesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const statsData = await statsResponse.json();
        const activitiesData = await activitiesResponse.json();

        // Update statistics
        setTotalWasteCollected(statsData.totalWaste);
        setRecyclingRate(statsData.recyclingRate);
        setActiveCollectionPoints(statsData.activePoints);
        setBinsAtCapacity(statsData.binsAtCapacity);

        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        // Fall back to sample data
        setTotalWasteCollected(sampleStatsData.totalWaste);
        setRecyclingRate(sampleStatsData.recyclingRate);
        setActiveCollectionPoints(sampleStatsData.activePoints);
        setBinsAtCapacity(sampleStatsData.binsAtCapacity);
        setCollections(sampleCollections);
        setError(null); // Clear error since we're using sample data
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const fetchPoints = async () => {
    try {
      console.log('Fetching collection points...');
      const response = await fetch(`${API_BASE_URL}/collection-points`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Collection points data:', data);
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received');
      }

      setPoints(data);
    } catch (error) {
      console.error('Error in fetchPoints:', error);
      throw error;
    }
  };

  const getTotalWasteCollected = () => {
    if (!collections.length) return 0;
    
    return collections
      .filter(c => c.status === 'Completed')
      .reduce((total, curr) => total + parseFloat(curr.waste_collected || 0), 0);
  };

  const getRecyclingRate = () => {
    if (!collections.length) return 0;
    
    const completedCollections = collections.filter(c => c.status === 'Completed');
    if (!completedCollections.length) return 0;
    
    const recyclableWaste = completedCollections
      .filter(c => c.waste_type === 'Recyclable')
      .reduce((total, curr) => total + (curr.waste_collected || 0), 0);
    
    const totalWaste = completedCollections
      .reduce((total, curr) => total + (curr.waste_collected || 0), 0);
    
    return totalWaste > 0 ? Math.round((recyclableWaste / totalWaste) * 100) : 0;
  };

  const getActiveCollectionPoints = () => {
    return points.filter(p => p.status !== 'Inactive').length || 0;
  };

  const getFullBinCount = () => {
    return points.filter(p => p.status === 'Full').length || 0;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getWasteTypeColor = (type) => {
    switch (type) {
      case 'General Waste':
        return '#64748B'; // Slate
      case 'Recyclable':
        return '#22C55E'; // Green
      case 'Hazardous':
        return '#EF4444'; // Red
      case 'Organic':
        return '#10B981'; // Emerald
      default:
        return '#94A3B8'; // Gray
    }
  };

  const calculateWasteDistribution = (collections) => {
    if (!collections || collections.length === 0) {
      return [];
    }

    const completedCollections = collections.filter(c => c.status === 'Completed');
    const totalWaste = completedCollections.reduce((sum, curr) => 
      sum + parseFloat(curr.waste_collected || 0), 0
    );

    const wasteTypes = ['General Waste', 'Recyclable', 'Hazardous', 'Organic'];
    return wasteTypes.map(wasteType => {
      const typeCollections = completedCollections.filter(c => c.waste_type === wasteType);
      const typeTotal = typeCollections.reduce((sum, curr) => 
        sum + parseFloat(curr.waste_collected || 0), 0
      );
      
      const percentage = totalWaste > 0 ? (typeTotal / totalWaste) * 100 : 0;
      
      return {
        type: wasteType,
        total: typeTotal,
        percentage: percentage
      };
    });
  };

  const calculateRecycledWaste = () => {
    return collections
      .filter(c => c.status === 'Completed' && c.waste_type === 'Recyclable')
      .reduce((total, curr) => total + parseFloat(curr.waste_collected || 0), 0);
  };

  const stats = [
    {
      id: 'totalWaste',
      title: 'stats.totalWaste',
      value: `${getTotalWasteCollected().toFixed(1)}`,
      unit: 'kg',
      icon: <DeleteIcon />,
      color: '#2196f3',
      description: 'stats.totalCollected',
      link: '/collections'
    },
    {
      id: 'recyclingRate',
      title: 'stats.recyclingRate',
      value: getRecyclingRate(),
      unit: '%',
      icon: <RecyclingIcon />,
      color: '#4caf50',
      description: 'stats.ofTotalWaste',
      link: '/reports'
    },
    {
      id: 'collectionPoints',
      title: 'stats.collectionPoints',
      value: getActiveCollectionPoints(),
      unit: '',
      icon: <LocationIcon />,
      color: '#ff9800',
      description: 'stats.activeLocations',
      link: '/points'
    },
    {
      id: 'binsAtCapacity',
      title: 'stats.binsAtCapacity',
      value: getFullBinCount(),
      unit: '',
      icon: <WarningIcon />,
      color: '#f44336',
      description: 'stats.needAttention',
      link: '/points'
    }
  ];

  const handleLanguageClick = (event) => {
    setLanguageMenu(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLanguageMenu(null);
  };

  const handleLanguageSelect = (lang) => {
    changeLanguage(lang);
    handleLanguageClose();
  };

  // Render statistics card
  const renderStatisticsCard = ({ id, title, value, unit, icon, color, link }) => (
    <Card 
      component={Link} 
      to={link}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        textDecoration: 'none',
        '&:hover': {
          transform: 'translateY(-4px)'
        }
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar sx={{ bgcolor: color, mr: 2 }}>
            {icon}
          </Avatar>
          <Typography variant="h6" color="textSecondary">
            {translate(title)}
          </Typography>
        </Box>
        {isLoading ? (
          <Skeleton variant="text" width="60%" />
        ) : (
          <Typography variant="h4">
            {value}
            {unit && <Typography component="span" variant="h6" color="textSecondary"> {unit}</Typography>}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  // Render waste distribution
  const renderWasteDistribution = () => (
    <Card
      sx={{
        background: (theme) => theme.palette.mode === 'light' 
          ? 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)'
          : 'linear-gradient(135deg, #1a2027 0%, #111827 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid',
        borderColor: (theme) => theme.palette.mode === 'light' 
          ? 'rgba(255, 255, 255, 0.5)'
          : 'rgba(255, 255, 255, 0.05)',
        boxShadow: (theme) => theme.palette.mode === 'light'
          ? '0 4px 20px rgba(0,0,0,0.05)'
          : '0 4px 20px rgba(0,0,0,0.2)',
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 4,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            color: 'text.primary'
          }}
        >
          <TrendingUpIcon sx={{ mr: 2, color: 'primary.main' }} /> 
          {translate('Waste Distribution')}
        </Typography>
        
        {isLoading ? (
          // Loading skeleton
          [...Array(4)].map((_, index) => (
            <Box key={index} sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Skeleton width={120} height={24} />
                <Skeleton width={60} height={24} />
              </Box>
              <Skeleton variant="rectangular" height={8} sx={{ borderRadius: 4 }} />
            </Box>
          ))
        ) : error ? (
          // Error state
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography color="error" gutterBottom>
              {error}
            </Typography>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={() => window.location.reload()}
              startIcon={<RefreshIcon />}
            >
              {translate('common.retry')}
            </Button>
          </Box>
        ) : collections.length === 0 ? (
          // Empty state
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography color="textSecondary">
              {translate('home.noWasteData')}
            </Typography>
          </Box>
        ) : (
          // Data display
          calculateWasteDistribution(collections).map((waste, index) => (
            <Box key={index} sx={{ mb: 4 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mb: 2,
                  alignItems: 'center'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      bgcolor: getWasteTypeColor(waste.type),
                      mr: 2
                    }}
                  />
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: '1rem'
                    }}
                  >
                    {translate(waste.type)}
                  </Typography>
                </Box>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontWeight: 700,
                    color: getWasteTypeColor(waste.type)
                  }}
                >
                  {waste.percentage.toFixed(1)}%
                </Typography>
              </Box>
              <Box sx={{ position: 'relative', mb: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={waste.percentage}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: (theme) => 
                      theme.palette.mode === 'light' 
                        ? 'rgba(0,0,0,0.06)'
                        : 'rgba(255,255,255,0.06)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getWasteTypeColor(waste.type),
                      borderRadius: 4,
                      transition: 'transform 0.8s ease-in-out'
                    }
                  }}
                />
              </Box>
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block',
                  color: 'text.secondary',
                  textAlign: 'right',
                  fontSize: '0.85rem'
                }}
              >
                {waste.total.toFixed(1)} kg collected
              </Typography>
            </Box>
          ))
        )}
      </CardContent>
    </Card>
  );

  // Render recent activities
  const renderRecentActivities = () => (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          {translate('Recent Activities')}
        </Typography>
        <Button
          component={Link}
          to="/collection"
          endIcon={<ArrowForwardIcon />}
          color="primary"
        >
          {translate('View All')}
        </Button>
      </Box>
      <List>
        {recentActivitiesData.map(activity => (
          <ListItem key={activity.id} divider>
            <ListItemIcon>
              {activity.type === 'collection' && <TruckIcon color="primary" />}
              {activity.type === 'recycling' && <RecyclingIcon color="success" />}
              {activity.type === 'hazardous' && <WarningIcon color="error" />}
            </ListItemIcon>
            <ListItemText
              primary={activity.location}
              secondary={`${activity.amount} • ${new Date(activity.timestamp).toLocaleString()}`}
            />
            <Chip
              size="small"
              label={translate(activity.status)}
              color={activity.status === 'completed' ? 'success' : 'warning'}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );

  return (
    <Box 
      sx={{ 
        p: { xs: 2, sm: 3, md: 4 },
        maxWidth: 1400,
        mx: 'auto',
        background: (theme) => theme.palette.mode === 'light' 
          ? 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)'
          : 'linear-gradient(135deg, #1a1f24 0%, #121417 100%)',
        borderRadius: 2,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Box 
        sx={{ 
          mb: 6,
          textAlign: 'center',
          position: 'relative'
        }}
      >
        <Box sx={{ position: 'absolute', right: 0, top: 0 }}>
          <IconButton onClick={handleLanguageClick}>
            <LanguageIcon />
          </IconButton>
          <Menu
            anchorEl={languageMenu}
            open={Boolean(languageMenu)}
            onClose={handleLanguageClose}
          >
            <MenuItem onClick={() => handleLanguageSelect('en')}>English</MenuItem>
            <MenuItem onClick={() => handleLanguageSelect('hi')}>हिंदी</MenuItem>
            <MenuItem onClick={() => handleLanguageSelect('mr')}>मराठी</MenuItem>
          </Menu>
        </Box>
        
        <Typography 
          variant="h1" 
          sx={{ 
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            fontWeight: 800,
            background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
            letterSpacing: '-0.02em',
            animation: 'fadeIn 0.5s ease-in-out',
            '@keyframes fadeIn': {
              '0%': {
                opacity: 0,
                transform: 'translateY(20px)'
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0)'
              }
            }
          }}
        >
          {translate('app.title')}
        </Typography>
        <Typography 
          variant="h2" 
          sx={{ 
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            color: 'text.secondary',
            fontWeight: 500,
            maxWidth: '600px',
            mx: 'auto',
            lineHeight: 1.6
          }}
        >
          {translate('app.subtitle')}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            {renderStatisticsCard(stat)}
          </Grid>
        ))}
        
        <Grid item xs={12} md={8}>
          {renderWasteDistribution()}
        </Grid>
        
        <Grid item xs={12} md={4}>
          {renderRecentActivities()}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home; 