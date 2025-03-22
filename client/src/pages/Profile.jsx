import { 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Avatar, 
  Button, 
  TextField, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Divider,
  Switch,
  FormControlLabel,
  useTheme,
  useMediaQuery,
  Stack,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Input
} from '@mui/material';
import { 
  Person, 
  Email, 
  Phone, 
  LocationOn, 
  Notifications, 
  Security,
  Language,
  Palette,
  MoreVert,
  Save as SaveIcon,
  PhotoCamera
} from '@mui/icons-material';
import { useState, useEffect, useRef } from 'react';

const API_BASE_URL = 'http://127.0.0.1:8080/api';

const Profile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    address: '123 Main Street, City',
    emailNotifications: true,
    twoFactorAuth: true,
    darkMode: false,
    profilePhoto: null
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [hasChanges, setHasChanges] = useState(false);

  // Load saved profile data on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        setFormData(prev => ({
          ...prev,
          ...parsedProfile,
          profilePhoto: parsedProfile.profilePhoto || null
        }));
      } catch (error) {
        console.error('Error loading saved profile:', error);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    const newValue = e.target.type === 'checkbox' ? checked : value;
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    setHasChanges(true);
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profilePhoto: reader.result
        }));
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      // Save to localStorage for persistence
      localStorage.setItem('userProfile', JSON.stringify(formData));

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSnackbar({
        open: true,
        message: 'Profile updated successfully',
        severity: 'success'
      });
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update profile. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const activities = [
    {
      id: 1,
      action: 'Updated profile information',
      time: '2 hours ago'
    },
    {
      id: 2,
      action: 'Changed notification settings',
      time: '1 day ago'
    },
    {
      id: 3,
      action: 'Updated security preferences',
      time: '2 days ago'
    }
  ];

  const MobileProfileSection = ({ title, children }) => (
    <Paper sx={{ mb: 2, p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{title}</Typography>
        <IconButton size="small">
          <MoreVert />
        </IconButton>
      </Box>
      {children}
    </Paper>
  );

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 }
      }}>
        <Typography variant="h4" component="h1">
          Profile Settings
        </Typography>
        <Button 
          variant="contained" 
          startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
          onClick={handleSaveChanges}
          disabled={isLoading || !hasChanges}
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>

      {isMobile ? (
        <Box>
          <MobileProfileSection title="Profile Overview">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handlePhotoUpload}
              />
              <Avatar
                sx={{ 
                  width: 100, 
                  height: 100, 
                  mb: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.8
                  }
                }}
                src={formData.profilePhoto || '/path-to-avatar.jpg'}
                onClick={handlePhotoClick}
              />
              <Typography variant="h6">{formData.firstName} {formData.lastName}</Typography>
              <Typography color="text.secondary">Waste Management Officer</Typography>
              <Button 
                size="small" 
                sx={{ mt: 1 }}
                onClick={handlePhotoClick}
                startIcon={<PhotoCamera />}
              >
                Change Photo
              </Button>
            </Box>
          </MobileProfileSection>

          <MobileProfileSection title="Personal Information">
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                size="small"
              />
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                size="small"
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                size="small"
              />
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                size="small"
              />
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                size="small"
                multiline
                rows={2}
              />
            </Stack>
          </MobileProfileSection>

          <MobileProfileSection title="Preferences">
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={formData.emailNotifications}
                    onChange={handleChange}
                    name="emailNotifications"
                  />
                }
                label="Email Notifications"
              />
              <FormControlLabel
                control={
                  <Switch 
                    checked={formData.twoFactorAuth}
                    onChange={handleChange}
                    name="twoFactorAuth"
                  />
                }
                label="Two-Factor Authentication"
              />
              <FormControlLabel
                control={
                  <Switch 
                    checked={formData.darkMode}
                    onChange={handleChange}
                    name="darkMode"
                  />
                }
                label="Dark Mode"
              />
            </Stack>
          </MobileProfileSection>

          <MobileProfileSection title="Recent Activity">
            <List>
              {activities.map((activity) => (
                <ListItem key={activity.id} divider>
                  <ListItemText
                    primary={activity.action}
                    secondary={activity.time}
                  />
                </ListItem>
              ))}
            </List>
          </MobileProfileSection>
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handlePhotoUpload}
              />
              <Avatar
                sx={{ 
                  width: 120, 
                  height: 120, 
                  mx: 'auto', 
                  mb: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.8
                  }
                }}
                src={formData.profilePhoto || '/path-to-avatar.jpg'}
                onClick={handlePhotoClick}
              />
              <Typography variant="h5">{formData.firstName} {formData.lastName}</Typography>
              <Typography color="text.secondary" gutterBottom>
                Waste Management Officer
              </Typography>
              <Button 
                variant="outlined" 
                startIcon={<PhotoCamera />}
                onClick={handlePhotoClick}
              >
                Change Photo
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    size="small"
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Preferences
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={formData.emailNotifications}
                        onChange={handleChange}
                        name="emailNotifications"
                      />
                    }
                    label="Email Notifications"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={formData.twoFactorAuth}
                        onChange={handleChange}
                        name="twoFactorAuth"
                      />
                    }
                    label="Two-Factor Authentication"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={formData.darkMode}
                        onChange={handleChange}
                        name="darkMode"
                      />
                    }
                    label="Dark Mode"
                  />
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <List>
                {activities.map((activity) => (
                  <ListItem key={activity.id} divider>
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.action}
                      secondary={activity.time}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile; 