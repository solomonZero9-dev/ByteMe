import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  Chip,
  IconButton,
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
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Pagination,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { 
  Delete, 
  Edit, 
  Search, 
  Schedule, 
  LocationOn, 
  CheckCircle, 
  PendingActions,
  Cancel,
  MoreVert,
  Add
} from '@mui/icons-material';
import NewCollectionForm from '../components/forms/NewCollectionForm';
import EditCollectionForm from '../components/forms/EditCollectionForm';

const API_BASE_URL = 'http://127.0.0.1:8080/api';

const Collection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [openNewCollection, setOpenNewCollection] = useState(false);
  const [openEditCollection, setOpenEditCollection] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [collections, setCollections] = useState([]);
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    filterCollections();
  }, [searchQuery, collections]);

  const filterCollections = () => {
    if (!searchQuery.trim()) {
      setFilteredCollections(collections);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = collections.filter(collection => {
      return (
        collection.location?.toLowerCase().includes(query) ||
        collection.waste_type?.toLowerCase().includes(query) ||
        collection.assigned_team?.toLowerCase().includes(query) ||
        collection.status?.toLowerCase().includes(query) ||
        new Date(collection.date_time).toLocaleDateString().toLowerCase().includes(query) ||
        new Date(collection.date_time).toLocaleTimeString().toLowerCase().includes(query)
      );
    });
    setFilteredCollections(filtered);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1); // Reset to first page when searching
  };

  const fetchCollections = async () => {
    console.log('Fetching collections from API...');
    try {
      const response = await fetch(`${API_BASE_URL}/collections`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received collections:', data);
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received');
      }
      
      setCollections(data);
    } catch (error) {
      console.error('Error fetching collections:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (event, collection) => {
    setSelectedCollection(collection);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCollection(null);
  };

  const handleNewCollection = () => {
    setOpenNewCollection(true);
  };

  const handleCloseNewCollection = () => {
    setOpenNewCollection(false);
  };

  const handleEditCollection = () => {
    setOpenEditCollection(true);
    handleMenuClose();
  };

  const handleCloseEditCollection = () => {
    setOpenEditCollection(false);
    setSelectedCollection(null);
  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
    handleMenuClose();
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedCollection(null);
  };

  const handleSubmitNewCollection = async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/collections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to create collection: ${response.status} ${response.statusText}`);
      }

      const newCollection = await response.json();
      setCollections(prevCollections => [...prevCollections, newCollection]);
      setSnackbar({
        open: true,
        message: 'New collection scheduled successfully',
        severity: 'success'
      });
      handleCloseNewCollection();
    } catch (error) {
      console.error('Error creating collection:', error);
      setSnackbar({
        open: true,
        message: `Failed to create collection: ${error.message}`,
        severity: 'error'
      });
    }
  };

  const handleSubmitEditCollection = async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/collections/${selectedCollection.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to update collection: ${response.status} ${response.statusText}`);
      }

      const updatedCollection = await response.json();
      setCollections(prevCollections =>
        prevCollections.map(collection =>
          collection.id === selectedCollection.id ? updatedCollection : collection
        )
      );
      setSnackbar({
        open: true,
        message: 'Collection updated successfully',
        severity: 'success'
      });
      handleCloseEditCollection();
    } catch (error) {
      console.error('Error updating collection:', error);
      setSnackbar({
        open: true,
        message: `Failed to update collection: ${error.message}`,
        severity: 'error'
      });
    }
  };

  const handleDeleteCollection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/collections/${selectedCollection.id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to delete collection: ${response.status} ${response.statusText}`);
      }

      setCollections(prevCollections =>
        prevCollections.filter(collection => collection.id !== selectedCollection.id)
      );
      setSnackbar({
        open: true,
        message: 'Collection deleted successfully',
        severity: 'success'
      });
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting collection:', error);
      setSnackbar({
        open: true,
        message: `Failed to delete collection: ${error.message}`,
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const getStatusChip = (status) => {
    if (!status) return null;
    
    const statusConfig = {
      'scheduled': { color: 'info', icon: <Schedule /> },
      'in progress': { color: 'warning', icon: <PendingActions />, sx: { backgroundColor: '#ff9800', color: 'white' } },
      'completed': { color: 'success', icon: <CheckCircle /> },
      'cancelled': { color: 'error', icon: <Cancel /> }
    };

    const normalizedStatus = status.toLowerCase();
    const config = statusConfig[normalizedStatus];
    
    if (!config) return null;

    return (
      <Chip
        icon={config.icon}
        label={status}
        color={config.color}
        size="small"
        sx={config.sx}
      />
    );
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return '';
    try {
      const date = new Date(dateTime);
      if (isNaN(date.getTime())) return '';
      return {
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString()
      };
    } catch (error) {
      console.error('Error formatting date:', error);
      return { date: '', time: '' };
    }
  };

  const MobileCollectionCard = ({ collection }) => {
    if (!collection) return null;
    
    const { date, time } = formatDateTime(collection.date_time);
    
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="subtitle1">{collection.location || 'No Location'}</Typography>
            </Box>
            <IconButton size="small" onClick={(e) => handleMenuClick(e, collection)}>
              <MoreVert />
            </IconButton>
          </Box>
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              Date: {date}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Time: {time}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Type: {collection.waste_type || 'Not Specified'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Assigned To: {collection.assigned_team || 'Not Assigned'}
            </Typography>
            <Box sx={{ mt: 1 }}>
              {getStatusChip(collection.status)}
            </Box>
          </Stack>
        </CardContent>
        <CardActions>
          <Button 
            size="small" 
            startIcon={<Edit />}
            onClick={() => {
              setSelectedCollection(collection);
              setOpenEditCollection(true);
            }}
          >
            Edit
          </Button>
          <Button 
            size="small" 
            color="error" 
            startIcon={<Delete />}
            onClick={() => {
              setSelectedCollection(collection);
              setOpenDeleteDialog(true);
            }}
          >
            Delete
          </Button>
        </CardActions>
      </Card>
    );
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1); // Reset to first page when changing page size
  };

  const getPaginatedCollections = () => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredCollections.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredCollections.length / pageSize);

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
          Waste Collection
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Page Size</InputLabel>
            <Select
              value={pageSize}
              label="Page Size"
              onChange={handlePageSizeChange}
            >
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
              <MenuItem value={200}>200</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleNewCollection}
          >
            New Collection
          </Button>
        </Box>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search collections..."
          value={searchQuery}
          onChange={handleSearchChange}
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
          {filteredCollections && filteredCollections.length > 0 ? (
            getPaginatedCollections().map((collection) => (
              <MobileCollectionCard key={collection.id} collection={collection} />
            ))
          ) : (
            <Typography variant="body1" color="text.secondary" align="center">
              {searchQuery ? 'No collections found matching your search' : 'No collections found'}
            </Typography>
          )}
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Location</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCollections && filteredCollections.length > 0 ? (
                getPaginatedCollections().map((collection) => {
                  const { date, time } = formatDateTime(collection.date_time);
                  return (
                    <TableRow key={collection.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                          {collection.location || 'No Location'}
                        </Box>
                      </TableCell>
                      <TableCell>{date}</TableCell>
                      <TableCell>{time}</TableCell>
                      <TableCell>{collection.waste_type || 'Not Specified'}</TableCell>
                      <TableCell>{collection.assigned_team || 'Not Assigned'}</TableCell>
                      <TableCell>{getStatusChip(collection.status)}</TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          color="primary" 
                          onClick={() => {
                            setSelectedCollection(collection);
                            setOpenEditCollection(true);
                          }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => {
                            setSelectedCollection(collection);
                            setOpenDeleteDialog(true);
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body1" color="text.secondary">
                      {searchQuery ? 'No collections found matching your search' : 'No collections found'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {filteredCollections && filteredCollections.length > 0 && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: 2
        }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditCollection}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
      </Menu>

      <NewCollectionForm
        open={openNewCollection}
        onClose={handleCloseNewCollection}
        onSubmit={handleSubmitNewCollection}
      />

      <EditCollectionForm
        open={openEditCollection}
        onClose={handleCloseEditCollection}
        onSubmit={handleSubmitEditCollection}
        collection={selectedCollection}
      />

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Collection
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this collection? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteCollection} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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

export default Collection; 