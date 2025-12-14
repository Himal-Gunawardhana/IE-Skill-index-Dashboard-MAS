import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  MenuItem,
  InputAdornment,
  Alert,
} from '@mui/material';
import {
  QrCodeScanner,
  Add,
  Send,
  MoveUp,
  KeyboardReturn,
  Search,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import {
  getAttachmentTypes,
  getLocations,
  getInventory,
  getTransactions,
  addAttachmentType,
  addLocation,
  issueAttachment,
  returnAttachment,
  moveAttachment,
  addStock,
} from '../services/attachmentService';
import { AttachmentType, Location, AttachmentInventory, AttachmentTransaction } from '../types/attachment';
import { formatDate } from '../utils/dateHelpers';
import { isAttachmentFirebaseConfigured } from '../services/attachmentFirebase';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const AttachmentStore: React.FC = () => {
  const { currentUser } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [attachmentTypes, setAttachmentTypes] = useState<AttachmentType[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [inventory, setInventory] = useState<AttachmentInventory[]>([]);
  const [transactions, setTransactions] = useState<AttachmentTransaction[]>([]);

  // Dialogs
  const [openAddType, setOpenAddType] = useState(false);
  const [openAddLocation, setOpenAddLocation] = useState(false);
  const [openIssue, setOpenIssue] = useState(false);
  const [openReturn, setOpenReturn] = useState(false);
  const [openMove, setOpenMove] = useState(false);
  const [openAddStock, setOpenAddStock] = useState(false);
  const [openQRScanner, setOpenQRScanner] = useState(false);

  // Form states
  const [newType, setNewType] = useState({ code: '', name: '', description: '' });
  const [newLocation, setNewLocation] = useState({ name: '', description: '' });
  const [issueForm, setIssueForm] = useState({
    attachmentTypeId: '',
    locationId: '',
    quantity: 1,
    requestedBy: '',
    comment: '',
  });
  const [returnForm, setReturnForm] = useState({
    attachmentTypeId: '',
    fromLocationId: '',
    toLocationId: '',
    quantity: 1,
    comment: '',
  });
  const [moveForm, setMoveForm] = useState({
    attachmentTypeId: '',
    fromLocationId: '',
    toLocationId: '',
    quantity: 1,
    comment: '',
  });
  const [addStockForm, setAddStockForm] = useState({
    attachmentTypeId: '',
    locationId: '',
    quantity: 1,
    comment: '',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isAttachmentFirebaseConfigured) {
      loadData();
    }
  }, []);

  const loadData = async () => {
    if (!isAttachmentFirebaseConfigured) return;
    
    try {
      const [types, locs, inv, trans] = await Promise.all([
        getAttachmentTypes(),
        getLocations(),
        getInventory(),
        getTransactions(),
      ]);
      setAttachmentTypes(types);
      setLocations(locs);
      setInventory(inv);
      setTransactions(trans);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleAddType = async () => {
    try {
      await addAttachmentType(newType);
      setNewType({ code: '', name: '', description: '' });
      setOpenAddType(false);
      loadData();
      showSuccess('Attachment type added successfully!');
    } catch (error) {
      console.error('Error adding attachment type:', error);
    }
  };

  const handleAddLocation = async () => {
    try {
      await addLocation(newLocation);
      setNewLocation({ name: '', description: '' });
      setOpenAddLocation(false);
      loadData();
      showSuccess('Location added successfully!');
    } catch (error) {
      console.error('Error adding location:', error);
    }
  };

  const handleIssue = async () => {
    try {
      const type = attachmentTypes.find(t => t.id === issueForm.attachmentTypeId);
      const loc = locations.find(l => l.id === issueForm.locationId);
      if (!type || !loc) return;

      await issueAttachment(
        type.id,
        type.code,
        loc.id,
        loc.name,
        issueForm.quantity,
        issueForm.requestedBy,
        issueForm.comment,
        currentUser?.email || ''
      );
      setIssueForm({ attachmentTypeId: '', locationId: '', quantity: 1, requestedBy: '', comment: '' });
      setOpenIssue(false);
      loadData();
      showSuccess('Attachment issued successfully!');
    } catch (error) {
      console.error('Error issuing attachment:', error);
    }
  };

  const handleReturn = async () => {
    try {
      const type = attachmentTypes.find(t => t.id === returnForm.attachmentTypeId);
      const fromLoc = locations.find(l => l.id === returnForm.fromLocationId);
      const toLoc = locations.find(l => l.id === returnForm.toLocationId);
      if (!type || !fromLoc || !toLoc) return;

      await returnAttachment(
        type.id,
        type.code,
        fromLoc.id,
        fromLoc.name,
        toLoc.id,
        toLoc.name,
        returnForm.quantity,
        returnForm.comment,
        currentUser?.email || ''
      );
      setReturnForm({ attachmentTypeId: '', fromLocationId: '', toLocationId: '', quantity: 1, comment: '' });
      setOpenReturn(false);
      loadData();
      showSuccess('Attachment returned successfully!');
    } catch (error) {
      console.error('Error returning attachment:', error);
    }
  };

  const handleMove = async () => {
    try {
      const type = attachmentTypes.find(t => t.id === moveForm.attachmentTypeId);
      const fromLoc = locations.find(l => l.id === moveForm.fromLocationId);
      const toLoc = locations.find(l => l.id === moveForm.toLocationId);
      if (!type || !fromLoc || !toLoc) return;

      await moveAttachment(
        type.id,
        type.code,
        fromLoc.id,
        fromLoc.name,
        toLoc.id,
        toLoc.name,
        moveForm.quantity,
        moveForm.comment,
        currentUser?.email || ''
      );
      setMoveForm({ attachmentTypeId: '', fromLocationId: '', toLocationId: '', quantity: 1, comment: '' });
      setOpenMove(false);
      loadData();
      showSuccess('Attachment moved successfully!');
    } catch (error) {
      console.error('Error moving attachment:', error);
    }
  };

  const handleAddStock = async () => {
    try {
      const type = attachmentTypes.find(t => t.id === addStockForm.attachmentTypeId);
      const loc = locations.find(l => l.id === addStockForm.locationId);
      if (!type || !loc) return;

      await addStock(
        type.id,
        type.code,
        loc.id,
        loc.name,
        addStockForm.quantity,
        addStockForm.comment,
        currentUser?.email || ''
      );
      setAddStockForm({ attachmentTypeId: '', locationId: '', quantity: 1, comment: '' });
      setOpenAddStock(false);
      loadData();
      showSuccess('Stock added successfully!');
    } catch (error) {
      console.error('Error adding stock:', error);
    }
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleQRScan = (data: string) => {
    // QR code should contain attachment type code (e.g., "WA001")
    const type = attachmentTypes.find(t => t.code === data);
    if (type) {
      setIssueForm(prev => ({ ...prev, attachmentTypeId: type.id }));
      setOpenQRScanner(false);
      setOpenIssue(true);
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesLocation = filterLocation === 'all' || item.locationId === filterLocation;
    const matchesType = filterType === 'all' || item.attachmentTypeId === filterType;
    const matchesSearch = item.attachmentTypeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.locationName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLocation && matchesType && matchesSearch;
  });

  const filteredTransactions = transactions.filter(trans => {
    return trans.attachmentTypeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trans.toLocationName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Show configuration notice if Firebase is not configured
  if (!isAttachmentFirebaseConfigured) {
    return (
      <Box>
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Attachment Store Database Not Configured
          </Typography>
          <Typography variant="body2" paragraph>
            The Attachment Store requires a separate Firebase database. Please follow these steps:
          </Typography>
          <Typography variant="body2" component="div">
            <ol>
              <li>Create a new Firebase project at <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer">Firebase Console</a></li>
              <li>Enable Firestore Database in the project</li>
              <li>Copy the Firebase configuration</li>
              <li>Add these environment variables to your <code>.env</code> file:</li>
            </ol>
          </Typography>
          <Box component="pre" sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1, mt: 2, overflow: 'auto' }}>
{`REACT_APP_ATTACHMENT_FIREBASE_API_KEY=your_api_key
REACT_APP_ATTACHMENT_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_ATTACHMENT_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_ATTACHMENT_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
REACT_APP_ATTACHMENT_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_ATTACHMENT_FIREBASE_APP_ID=your_app_id`}
          </Box>
          <Typography variant="body2" sx={{ mt: 2 }}>
            After adding the environment variables, restart the development server.
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(_, val) => setTabValue(val)}>
            <Tab label="Dashboard" />
            <Tab label="Issue Attachment" />
            <Tab label="Return / Move" />
            <Tab label="History" />
            <Tab label="Settings" />
          </Tabs>
        </Box>

        {/* Dashboard Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Attachment Types
                  </Typography>
                  <Typography variant="h4">{attachmentTypes.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Locations
                  </Typography>
                  <Typography variant="h4">{locations.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Stock Items
                  </Typography>
                  <Typography variant="h4">{inventory.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Transactions
                  </Typography>
                  <Typography variant="h4">{transactions.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              size="small"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              select
              size="small"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="all">All Locations</MenuItem>
              {locations.map(loc => (
                <MenuItem key={loc.id} value={loc.id}>{loc.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              size="small"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="all">All Types</MenuItem>
              {attachmentTypes.map(type => (
                <MenuItem key={type.id} value={type.id}>{type.code}</MenuItem>
              ))}
            </TextField>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Attachment Code</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell>Last Updated</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Chip label={item.attachmentTypeCode} color="primary" size="small" />
                    </TableCell>
                    <TableCell>{item.locationName}</TableCell>
                    <TableCell align="right">
                      <Typography variant="h6">{item.quantity}</Typography>
                    </TableCell>
                    <TableCell>{formatDate(item.lastUpdated, 'PPp')}</TableCell>
                  </TableRow>
                ))}
                {filteredInventory.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No inventory found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Issue Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={<QrCodeScanner />}
                onClick={() => setOpenQRScanner(true)}
                fullWidth
                size="large"
              >
                Scan QR Code
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                startIcon={<Send />}
                onClick={() => setOpenIssue(true)}
                fullWidth
                size="large"
              >
                Manual Issue
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => setOpenAddStock(true)}
                fullWidth
                size="large"
              >
                Add to Stock
              </Button>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Return/Move Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                startIcon={<KeyboardReturn />}
                onClick={() => setOpenReturn(true)}
                fullWidth
                size="large"
              >
                Return to Stock
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<MoveUp />}
                onClick={() => setOpenMove(true)}
                fullWidth
                size="large"
              >
                Move Between Locations
              </Button>
            </Grid>
          </Grid>
        </TabPanel>

        {/* History Tab */}
        <TabPanel value={tabValue} index={3}>
          <TextField
            size="small"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Attachment</TableCell>
                  <TableCell>From</TableCell>
                  <TableCell>To</TableCell>
                  <TableCell align="right">Qty</TableCell>
                  <TableCell>Requested By</TableCell>
                  <TableCell>Comment</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTransactions.map((trans) => (
                  <TableRow key={trans.id}>
                    <TableCell>{formatDate(trans.createdAt, 'PP')}</TableCell>
                    <TableCell>
                      <Chip
                        label={trans.transactionType.toUpperCase()}
                        color={
                          trans.transactionType === 'issue' ? 'primary' :
                          trans.transactionType === 'return' ? 'success' :
                          trans.transactionType === 'move' ? 'warning' : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{trans.attachmentTypeCode}</TableCell>
                    <TableCell>{trans.fromLocationName || '-'}</TableCell>
                    <TableCell>{trans.toLocationName}</TableCell>
                    <TableCell align="right">{trans.quantity}</TableCell>
                    <TableCell>{trans.requestedBy}</TableCell>
                    <TableCell>{trans.comment}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Settings Tab */}
        <TabPanel value={tabValue} index={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Attachment Types</Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setOpenAddType(true)}
                    size="small"
                  >
                    Add Type
                  </Button>
                </Box>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Code</TableCell>
                      <TableCell>Name</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attachmentTypes.map((type) => (
                      <TableRow key={type.id}>
                        <TableCell><Chip label={type.code} size="small" /></TableCell>
                        <TableCell>{type.name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Locations</Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setOpenAddLocation(true)}
                    size="small"
                  >
                    Add Location
                  </Button>
                </Box>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {locations.map((loc) => (
                      <TableRow key={loc.id}>
                        <TableCell>{loc.name}</TableCell>
                        <TableCell>{loc.description || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* Add Type Dialog */}
      <Dialog open={openAddType} onClose={() => setOpenAddType(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Attachment Type</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Code"
            value={newType.code}
            onChange={(e) => setNewType({ ...newType, code: e.target.value })}
            sx={{ mt: 2 }}
            placeholder="e.g., WA001"
          />
          <TextField
            fullWidth
            label="Name"
            value={newType.name}
            onChange={(e) => setNewType({ ...newType, name: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            value={newType.description}
            onChange={(e) => setNewType({ ...newType, description: e.target.value })}
            sx={{ mt: 2 }}
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddType(false)}>Cancel</Button>
          <Button onClick={handleAddType} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Add Location Dialog */}
      <Dialog open={openAddLocation} onClose={() => setOpenAddLocation(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Location</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={newLocation.name}
            onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            value={newLocation.description}
            onChange={(e) => setNewLocation({ ...newLocation, description: e.target.value })}
            sx={{ mt: 2 }}
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddLocation(false)}>Cancel</Button>
          <Button onClick={handleAddLocation} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Issue Dialog */}
      <Dialog open={openIssue} onClose={() => setOpenIssue(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Issue Attachment</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Attachment Type"
            value={issueForm.attachmentTypeId}
            onChange={(e) => setIssueForm({ ...issueForm, attachmentTypeId: e.target.value })}
            sx={{ mt: 2 }}
          >
            {attachmentTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.code} - {type.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            label="Location"
            value={issueForm.locationId}
            onChange={(e) => setIssueForm({ ...issueForm, locationId: e.target.value })}
            sx={{ mt: 2 }}
          >
            {locations.map((loc) => (
              <MenuItem key={loc.id} value={loc.id}>{loc.name}</MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            type="number"
            label="Quantity"
            value={issueForm.quantity}
            onChange={(e) => setIssueForm({ ...issueForm, quantity: parseInt(e.target.value) })}
            sx={{ mt: 2 }}
            inputProps={{ min: 1 }}
          />
          <TextField
            fullWidth
            label="Requested By"
            value={issueForm.requestedBy}
            onChange={(e) => setIssueForm({ ...issueForm, requestedBy: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Comment"
            value={issueForm.comment}
            onChange={(e) => setIssueForm({ ...issueForm, comment: e.target.value })}
            sx={{ mt: 2 }}
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenIssue(false)}>Cancel</Button>
          <Button onClick={handleIssue} variant="contained">Issue</Button>
        </DialogActions>
      </Dialog>

      {/* Return Dialog */}
      <Dialog open={openReturn} onClose={() => setOpenReturn(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Return Attachment to Stock</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Attachment Type"
            value={returnForm.attachmentTypeId}
            onChange={(e) => setReturnForm({ ...returnForm, attachmentTypeId: e.target.value })}
            sx={{ mt: 2 }}
          >
            {attachmentTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.code} - {type.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            label="From Location"
            value={returnForm.fromLocationId}
            onChange={(e) => setReturnForm({ ...returnForm, fromLocationId: e.target.value })}
            sx={{ mt: 2 }}
          >
            {locations.map((loc) => (
              <MenuItem key={loc.id} value={loc.id}>{loc.name}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            label="To Location (Stock)"
            value={returnForm.toLocationId}
            onChange={(e) => setReturnForm({ ...returnForm, toLocationId: e.target.value })}
            sx={{ mt: 2 }}
          >
            {locations.map((loc) => (
              <MenuItem key={loc.id} value={loc.id}>{loc.name}</MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            type="number"
            label="Quantity"
            value={returnForm.quantity}
            onChange={(e) => setReturnForm({ ...returnForm, quantity: parseInt(e.target.value) })}
            sx={{ mt: 2 }}
            inputProps={{ min: 1 }}
          />
          <TextField
            fullWidth
            label="Comment"
            value={returnForm.comment}
            onChange={(e) => setReturnForm({ ...returnForm, comment: e.target.value })}
            sx={{ mt: 2 }}
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReturn(false)}>Cancel</Button>
          <Button onClick={handleReturn} variant="contained">Return</Button>
        </DialogActions>
      </Dialog>

      {/* Move Dialog */}
      <Dialog open={openMove} onClose={() => setOpenMove(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Move Attachment</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Attachment Type"
            value={moveForm.attachmentTypeId}
            onChange={(e) => setMoveForm({ ...moveForm, attachmentTypeId: e.target.value })}
            sx={{ mt: 2 }}
          >
            {attachmentTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.code} - {type.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            label="From Location"
            value={moveForm.fromLocationId}
            onChange={(e) => setMoveForm({ ...moveForm, fromLocationId: e.target.value })}
            sx={{ mt: 2 }}
          >
            {locations.map((loc) => (
              <MenuItem key={loc.id} value={loc.id}>{loc.name}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            label="To Location"
            value={moveForm.toLocationId}
            onChange={(e) => setMoveForm({ ...moveForm, toLocationId: e.target.value })}
            sx={{ mt: 2 }}
          >
            {locations.map((loc) => (
              <MenuItem key={loc.id} value={loc.id}>{loc.name}</MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            type="number"
            label="Quantity"
            value={moveForm.quantity}
            onChange={(e) => setMoveForm({ ...moveForm, quantity: parseInt(e.target.value) })}
            sx={{ mt: 2 }}
            inputProps={{ min: 1 }}
          />
          <TextField
            fullWidth
            label="Comment"
            value={moveForm.comment}
            onChange={(e) => setMoveForm({ ...moveForm, comment: e.target.value })}
            sx={{ mt: 2 }}
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMove(false)}>Cancel</Button>
          <Button onClick={handleMove} variant="contained">Move</Button>
        </DialogActions>
      </Dialog>

      {/* Add Stock Dialog */}
      <Dialog open={openAddStock} onClose={() => setOpenAddStock(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Stock</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Attachment Type"
            value={addStockForm.attachmentTypeId}
            onChange={(e) => setAddStockForm({ ...addStockForm, attachmentTypeId: e.target.value })}
            sx={{ mt: 2 }}
          >
            {attachmentTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.code} - {type.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            label="Location"
            value={addStockForm.locationId}
            onChange={(e) => setAddStockForm({ ...addStockForm, locationId: e.target.value })}
            sx={{ mt: 2 }}
          >
            {locations.map((loc) => (
              <MenuItem key={loc.id} value={loc.id}>{loc.name}</MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            type="number"
            label="Quantity"
            value={addStockForm.quantity}
            onChange={(e) => setAddStockForm({ ...addStockForm, quantity: parseInt(e.target.value) })}
            sx={{ mt: 2 }}
            inputProps={{ min: 1 }}
          />
          <TextField
            fullWidth
            label="Comment"
            value={addStockForm.comment}
            onChange={(e) => setAddStockForm({ ...addStockForm, comment: e.target.value })}
            sx={{ mt: 2 }}
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddStock(false)}>Cancel</Button>
          <Button onClick={handleAddStock} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      {/* QR Scanner Dialog */}
      <Dialog open={openQRScanner} onClose={() => setOpenQRScanner(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Scan QR Code</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <QrCodeScanner sx={{ fontSize: 100, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              QR Scanner Placeholder
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Integrate QR scanner library here (e.g., react-qr-reader)
            </Typography>
            <TextField
              fullWidth
              label="Or enter code manually"
              sx={{ mt: 3 }}
              placeholder="e.g., WA001"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleQRScan((e.target as HTMLInputElement).value);
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenQRScanner(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AttachmentStore;
