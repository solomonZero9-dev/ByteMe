import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Switch,
  FormControl,
  Select,
  MenuItem,
  Button,
  Grid
} from '@mui/material';

const Settings = () => {
  const [settings, setSettings] = useState({
    language: 'English',
    darkMode: true,
    emailNotifications: true,
    pushNotifications: false,
    collectionAlerts: true,
    reportUpdates: false,
    twoFactorAuth: true,
    sessionTimeout: true,
    passwordExpiry: false
  });

  const handleChange = (setting) => (event) => {
    setSettings({
      ...settings,
      [setting]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Settings
        </Typography>
        <Button variant="contained" color="primary">
          Save Changes
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom>
              General Settings
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Language
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={settings.language}
                  onChange={handleChange('language')}
                  sx={{ bgcolor: 'background.paper' }}
                >
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Hindi">Hindi</MenuItem>
                  <MenuItem value="Marathi">Marathi</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography>Dark Mode</Typography>
              <Switch
                checked={settings.darkMode}
                onChange={handleChange('darkMode')}
                color="primary"
              />
            </Box>
          </Paper>

          <Paper sx={{ p: 3, bgcolor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom>
              Notification Settings
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>Email Notifications</Typography>
                <Switch
                  checked={settings.emailNotifications}
                  onChange={handleChange('emailNotifications')}
                  color="primary"
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>Push Notifications</Typography>
                <Switch
                  checked={settings.pushNotifications}
                  onChange={handleChange('pushNotifications')}
                  color="primary"
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>Collection Alerts</Typography>
                <Switch
                  checked={settings.collectionAlerts}
                  onChange={handleChange('collectionAlerts')}
                  color="primary"
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>Report Updates</Typography>
                <Switch
                  checked={settings.reportUpdates}
                  onChange={handleChange('reportUpdates')}
                  color="primary"
                />
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, bgcolor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom>
              Security Settings
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>Two-Factor Authentication</Typography>
                <Switch
                  checked={settings.twoFactorAuth}
                  onChange={handleChange('twoFactorAuth')}
                  color="primary"
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>Session Timeout</Typography>
                <Switch
                  checked={settings.sessionTimeout}
                  onChange={handleChange('sessionTimeout')}
                  color="primary"
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>Password Expiry</Typography>
                <Switch
                  checked={settings.passwordExpiry}
                  onChange={handleChange('passwordExpiry')}
                  color="primary"
                />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings; 