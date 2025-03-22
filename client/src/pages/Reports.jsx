import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Card, 
  CardContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery,
  Stack,
  IconButton,
  Container,
  CircularProgress
} from '@mui/material';
import { 
  Assessment, 
  TrendingUp, 
  Recycling, 
  Delete, 
  Download,
  MoreVert
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const API_BASE_URL = 'http://localhost:8080';

const Reports = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    fetchCollections();
  }, [timeRange]);

  const fetchCollections = async () => {
    try {
      console.log('Fetching collections from API...');
      const response = await fetch(`${API_BASE_URL}/api/collections`);
      if (!response.ok) {
        throw new Error('Failed to fetch collections');
      }
      const data = await response.json();
      console.log('Received collections data:', data);
      setCollections(data);
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredCollections = () => {
    const now = new Date();
    return collections.filter(collection => {
      const collectionDate = new Date(collection.date_time);
      const daysDiff = (now - collectionDate) / (1000 * 60 * 60 * 24);
      
      switch (timeRange) {
        case 'week':
          return daysDiff <= 7;
        case 'month':
          return daysDiff <= 30;
        case 'year':
          return daysDiff <= 365;
        default:
          return true;
      }
    });
  };

  // Process data for charts
  const getWasteTypeDistribution = () => {
    console.log('Processing waste type distribution...');
    const filteredCollections = getFilteredCollections();
    const distribution = filteredCollections.reduce((acc, collection) => {
      acc[collection.waste_type] = (acc[collection.waste_type] || 0) + 1;
      return acc;
    }, {});
    console.log('Waste type distribution:', distribution);

    return {
      labels: Object.keys(distribution),
      datasets: [{
        data: Object.values(distribution),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
      }],
    };
  };

  const getCollectionsByStatus = () => {
    console.log('Processing collections by status...');
    const filteredCollections = getFilteredCollections();
    const statusCounts = filteredCollections.reduce((acc, collection) => {
      acc[collection.status] = (acc[collection.status] || 0) + 1;
      return acc;
    }, {});
    console.log('Status counts:', statusCounts);

    return {
      labels: Object.keys(statusCounts),
      datasets: [{
        label: 'Collections by Status',
        data: Object.values(statusCounts),
        backgroundColor: '#36A2EB',
      }],
    };
  };

  const getCollectionsOverTime = () => {
    console.log('Processing collections over time...');
    const filteredCollections = getFilteredCollections();
    
    // Sort collections by date
    const sortedCollections = [...filteredCollections].sort((a, b) => 
      new Date(a.date_time) - new Date(b.date_time)
    );
    console.log('Sorted collections:', sortedCollections);

    // Group by date with better formatting
    const groupedData = sortedCollections.reduce((acc, collection) => {
      const date = new Date(collection.date_time);
      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      acc[formattedDate] = (acc[formattedDate] || 0) + 1;
      return acc;
    }, {});
    console.log('Grouped data:', groupedData);

    return {
      labels: Object.keys(groupedData),
      datasets: [{
        label: 'Collections Over Time',
        data: Object.values(groupedData),
        borderColor: '#FF6384',
        tension: 0.1,
        fill: false
      }],
    };
  };

  const getWasteCollectionData = () => {
    console.log('Processing waste collection data...');
    const filteredCollections = getFilteredCollections();
    
    // Calculate total waste collected
    const totalWaste = filteredCollections.reduce((sum, collection) => 
      sum + (collection.waste_collected || 0), 0
    );

    // Group by waste type
    const wasteByType = filteredCollections.reduce((acc, collection) => {
      acc[collection.waste_type] = (acc[collection.waste_type] || 0) + (collection.waste_collected || 0);
      return acc;
    }, {});

    // Group by date for trend
    const wasteByDate = filteredCollections.reduce((acc, collection) => {
      const date = new Date(collection.date_time).toLocaleDateString();
      acc[date] = (acc[date] || 0) + (collection.waste_collected || 0);
      return acc;
    }, {});

    return {
      totalWaste,
      wasteByType,
      wasteByDate
    };
  };

  const getWasteCollectionChart = () => {
    const { wasteByType } = getWasteCollectionData();
    
    return {
      labels: Object.keys(wasteByType).map(type => type.charAt(0).toUpperCase() + type.slice(1)),
      datasets: [{
        label: 'Waste Collected (kg)',
        data: Object.values(wasteByType),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
      }],
    };
  };

  const getWasteTrendChart = () => {
    const { wasteByDate } = getWasteCollectionData();
    
    // Sort dates
    const sortedDates = Object.keys(wasteByDate).sort((a, b) => 
      new Date(a) - new Date(b)
    );

    return {
      labels: sortedDates,
      datasets: [{
        label: 'Daily Waste Collection (kg)',
        data: sortedDates.map(date => wasteByDate[date]),
        borderColor: '#4CAF50',
        tension: 0.1,
        fill: false
      }],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        display: true,
      },
      title: {
        display: true,
        font: {
          size: 16
        }
      }
    }
  };

  const pieChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        ...chartOptions.plugins.title,
        text: 'Waste Type Distribution'
      }
    }
  };

  const barChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        ...chartOptions.plugins.title,
        text: 'Collections by Status'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  const lineChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        ...chartOptions.plugins.title,
        text: 'Collections Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  const wasteCollectionOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        ...chartOptions.plugins.title,
        text: 'Waste Collection by Type'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Kilograms'
        }
      }
    }
  };

  const wasteTrendOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        ...chartOptions.plugins.title,
        text: 'Daily Waste Collection Trend'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Kilograms'
        }
      }
    }
  };

  const MobileReportCard = ({ title, value, icon, color }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {icon}
            <Typography variant="subtitle1" sx={{ ml: 1 }}>
              {title}
            </Typography>
          </Box>
          <IconButton size="small">
            <MoreVert />
          </IconButton>
        </Box>
        <Typography variant="h4" color={color}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  const MobileWasteTypeCard = ({ waste }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="subtitle1">
            {waste.type}
          </Typography>
          <IconButton size="small">
            <MoreVert />
          </IconButton>
        </Box>
        <Stack spacing={1}>
          <Typography variant="body2" color="text.secondary">
            Amount: {waste.amount}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Percentage: {waste.percentage}%
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Reports & Analytics
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="week">Last Week</MenuItem>
            <MenuItem value="month">Last Month</MenuItem>
            <MenuItem value="year">Last Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {/* Waste Collection by Type */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Waste Collection by Type
            </Typography>
            <Box height={300} display="flex" justifyContent="center" alignItems="center">
              <Bar 
                data={getWasteCollectionChart()} 
                options={wasteCollectionOptions}
                style={{ maxHeight: '100%' }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Daily Waste Collection Trend */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Daily Waste Collection Trend
            </Typography>
            <Box height={300} display="flex" justifyContent="center" alignItems="center">
              <Line 
                data={getWasteTrendChart()} 
                options={wasteTrendOptions}
                style={{ maxHeight: '100%' }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Waste Type Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Waste Type Distribution
            </Typography>
            <Box height={300} display="flex" justifyContent="center" alignItems="center">
              <Pie 
                data={getWasteTypeDistribution()} 
                options={pieChartOptions}
                style={{ maxHeight: '100%' }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Collections by Status */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Collections by Status
            </Typography>
            <Box height={300} display="flex" justifyContent="center" alignItems="center">
              <Bar 
                data={getCollectionsByStatus()} 
                options={barChartOptions}
                style={{ maxHeight: '100%' }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Collections Over Time */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Collections Over Time
            </Typography>
            <Box height={300} display="flex" justifyContent="center" alignItems="center">
              <Line 
                data={getCollectionsOverTime()} 
                options={lineChartOptions}
                style={{ maxHeight: '100%' }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Reports; 