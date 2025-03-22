import React, { useState } from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  ListItemSecondaryAction,
  Switch,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Divider,
  useTheme as useMuiTheme,
  useMediaQuery,
  Stack,
  IconButton
} from '@mui/material';
import { 
  Notifications, 
  Security, 
  Language, 
  Palette, 
  Storage,
  Backup,
  Speed,
  BugReport,
  MoreVert
} from '@mui/icons-material';
import { useCustomTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const Settings = () => {
  const { mode, toggleTheme } = useCustomTheme();
  const { translate, currentLanguage, changeLanguage } = useLanguage();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  const [settings, setSettings] = useState({
    language: currentLanguage,
    darkMode: mode === 'dark',
    emailNotifications: true,
    pushNotifications: false,
    collectionAlerts: true,
    reportUpdates: false,
    twoFactorAuth: true,
    sessionTimeout: true,
    passwordExpiry: false
  });

  const handleChange = (setting) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    
    if (setting === 'language') {
      changeLanguage(value);
    } else if (setting === 'darkMode') {
      toggleTheme();
    }
    
    setSettings({
      ...settings,
      [setting]: value
    });
  };

  const MobileSettingsSection = ({ title, icon, children }) => (
    <Paper sx={{ mb: 2, p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <IconButton size="small">
          <MoreVert />
        </IconButton>
      </Box>
      {children}
    </Paper>
  );

  const renderSettings = () => {
    const sections = [
      {
        title: translate('settings.general'),
        icon: <Palette />,
        settings: [
          {
            name: 'language',
            label: translate('settings.language'),
            type: 'select',
            value: settings.language,
            options: [
              { value: 'en', label: translate('settings.english') },
              { value: 'hi', label: translate('settings.hindi') },
              { value: 'mr', label: translate('settings.marathi') }
            ]
          },
          {
            name: 'darkMode',
            label: translate('settings.darkMode'),
            type: 'switch',
            value: settings.darkMode
          }
        ]
      },
      {
        title: translate('settings.notifications'),
        icon: <Notifications />,
        settings: [
          {
            name: 'emailNotifications',
            label: translate('settings.emailNotifications'),
            type: 'switch',
            value: settings.emailNotifications
          },
          {
            name: 'pushNotifications',
            label: translate('settings.pushNotifications'),
            type: 'switch',
            value: settings.pushNotifications
          },
          {
            name: 'collectionAlerts',
            label: translate('settings.collectionAlerts'),
            type: 'switch',
            value: settings.collectionAlerts
          },
          {
            name: 'reportUpdates',
            label: translate('settings.reportUpdates'),
            type: 'switch',
            value: settings.reportUpdates
          }
        ]
      },
      {
        title: translate('settings.security'),
        icon: <Security />,
        settings: [
          {
            name: 'twoFactorAuth',
            label: translate('settings.twoFactorAuth'),
            type: 'switch',
            value: settings.twoFactorAuth
          },
          {
            name: 'sessionTimeout',
            label: translate('settings.sessionTimeout'),
            type: 'switch',
            value: settings.sessionTimeout
          },
          {
            name: 'passwordExpiry',
            label: translate('settings.passwordExpiry'),
            type: 'switch',
            value: settings.passwordExpiry
          }
        ]
      }
    ];

    return sections.map((section) => {
      const content = (
        <List>
          {section.settings.map((setting) => (
            <ListItem key={setting.name}>
              <ListItemText primary={setting.label} />
              <ListItemSecondaryAction>
                {setting.type === 'switch' ? (
                  <Switch
                    edge="end"
                    checked={setting.value}
                    onChange={handleChange(setting.name)}
                  />
                ) : setting.type === 'select' ? (
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={setting.value}
                      onChange={handleChange(setting.name)}
                    >
                      {setting.options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : null}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      );

      return isMobile ? (
        <MobileSettingsSection key={section.title} title={section.title} icon={section.icon}>
          {content}
        </MobileSettingsSection>
      ) : (
        <Paper key={section.title} sx={{ mb: 3 }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
            {section.icon}
            <Typography variant="h6" sx={{ ml: 1 }}>
              {section.title}
            </Typography>
          </Box>
          {content}
        </Paper>
      );
    });
  };

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
          {translate('settings.title')}
        </Typography>
        <Button variant="contained">
          {translate('settings.saveChanges')}
        </Button>
      </Box>

      {renderSettings()}
    </Box>
  );
};

export default Settings; 