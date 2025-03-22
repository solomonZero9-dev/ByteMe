import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Alert,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const NewCollectionForm = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    location: '',
    date_time: new Date(),
    waste_type: '',
    assigned_team: '',
    notes: '',
    status: 'scheduled',
    waste_collected: '',
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (newValue) => {
    setFormData((prev) => ({
      ...prev,
      date_time: newValue,
    }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create collection');
      }

      const data = await response.json();
      onSubmit(data);
      onClose();
      setSnackbar({
        open: true,
        message: 'Collection created successfully!',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error creating collection:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to create collection',
        severity: 'error',
      });
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>New Collection</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <DateTimePicker
                  label="Collection Date & Time"
                  value={formData.date_time}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Waste Type</InputLabel>
                  <Select
                    name="waste_type"
                    value={formData.waste_type}
                    onChange={handleChange}
                    label="Waste Type"
                  >
                    <MenuItem value="general">General Waste</MenuItem>
                    <MenuItem value="recyclable">Recyclable</MenuItem>
                    <MenuItem value="hazardous">Hazardous</MenuItem>
                    <MenuItem value="organic">Organic</MenuItem>
                    <MenuItem value="electronic">Electronic</MenuItem>
                    <MenuItem value="medical">Medical</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Waste Collected (kg)"
                  name="waste_collected"
                  type="number"
                  value={formData.waste_collected}
                  onChange={handleChange}
                  required
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Assigned Team</InputLabel>
                  <Select
                    name="assigned_team"
                    value={formData.assigned_team}
                    onChange={handleChange}
                    label="Assigned Team"
                  >
                    <MenuItem value="Team Alpha">Team Alpha</MenuItem>
                    <MenuItem value="Team Beta">Team Beta</MenuItem>
                    <MenuItem value="Team Gamma">Team Gamma</MenuItem>
                    <MenuItem value="Team Delta">Team Delta</MenuItem>
                    <MenuItem value="Team Echo">Team Echo</MenuItem>
                    <MenuItem value="Team Foxtrot">Team Foxtrot</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    label="Status"
                  >
                    <MenuItem value="scheduled">Scheduled</MenuItem>
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  multiline
                  rows={4}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Create Collection
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default NewCollectionForm; 