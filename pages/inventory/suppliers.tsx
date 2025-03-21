import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { 
  Box, 
  Button, 
  Card, 
  Grid, 
  Typography, 
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  EventNote as EventNoteIcon,
  Schedule as ScheduleIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import { Supplier } from '@/types';

// Import supplier data
import suppliersData from '@/data/suppliers.json';

interface SupplierFormData {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  preferredPaymentTerms: string;
}

const initialFormData: SupplierFormData = {
  id: '',
  name: '',
  contactPerson: '',
  email: '',
  phone: '',
  address: '',
  notes: '',
  preferredPaymentTerms: 'Net 30'
};

const SuppliersPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(suppliersData as Supplier[]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<SupplierFormData>(initialFormData);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter suppliers based on search term
  const filteredSuppliers = suppliers.filter(supplier => {
    const search = searchTerm.toLowerCase();
    return (
      supplier.name.toLowerCase().includes(search) ||
      supplier.contactPerson.toLowerCase().includes(search) ||
      supplier.email.toLowerCase().includes(search) ||
      supplier.phone.toLowerCase().includes(search) ||
      supplier.id.toLowerCase().includes(search)
    );
  });

  // Handle pagination
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle form dialog
  const handleOpenAddDialog = () => {
    setFormData(initialFormData);
    setFormMode('add');
    setDialogOpen(true);
    setErrors({});
  };

  const handleOpenEditDialog = (supplier: Supplier) => {
    setFormData(supplier);
    setFormMode('edit');
    setDialogOpen(true);
    setErrors({});
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.preferredPaymentTerms.trim()) {
      newErrors.preferredPaymentTerms = 'Payment terms are required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveSupplier = () => {
    if (validateForm()) {
      if (formMode === 'add') {
        // Add new supplier with generated ID
        const newSupplier = {
          ...formData,
          id: `SUP${Math.floor(Math.random() * 900) + 100}`
        };
        setSuppliers(prev => [...prev, newSupplier]);
      } else {
        // Edit existing supplier
        setSuppliers(prev => prev.map(sup => sup.id === formData.id ? formData : sup));
      }
      handleCloseDialog();
    }
  };

  const handleDeleteSupplier = (id: string) => {
    // In a real app, you might want to add a confirmation dialog
    setSuppliers(prev => prev.filter(sup => sup.id !== id));
  };

  // Format payment terms for display
  const formatPaymentTerms = (terms: string) => {
    switch (terms) {
      case 'Net 15':
        return { color: 'success', label: 'Net 15' };
      case 'Net 30':
        return { color: 'primary', label: 'Net 30' };
      case 'Net 45':
        return { color: 'warning', label: 'Net 45' };
      case 'Net 60':
        return { color: 'error', label: 'Net 60' };
      default:
        return { color: 'default', label: terms };
    }
  };

  return (
    <Layout title="Supplier Management">
      <Head>
        <title>Supplier Management | Bean Counter Coffee Shop ERP</title>
      </Head>

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined"
            onClick={() => window.location.href = '/inventory'}
            startIcon={<InventoryIcon />}
          >
            Back to Inventory
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
          >
            Add Supplier
          </Button>
        </Box>
      </Box>

      <Card sx={{ mb: 4 }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <TextField
            placeholder="Search suppliers..."
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 300 }}
          />
        </Box>

        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
          <Table sx={{ minWidth: 650 }} aria-label="suppliers table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Contact Person</TableCell>
                <TableCell>Contact Info</TableCell>
                <TableCell>Payment Terms</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSuppliers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((supplier) => {
                  const paymentTerms = formatPaymentTerms(supplier.preferredPaymentTerms);
                  
                  return (
                    <TableRow key={supplier.id} hover>
                      <TableCell>{supplier.id}</TableCell>
                      <TableCell>
                        <Box sx={{ fontWeight: 'bold' }}>{supplier.name}</Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          <BusinessIcon fontSize="small" sx={{ verticalAlign: 'text-bottom', mr: 0.5 }} />
                          {supplier.address.split(',')[0]}
                        </Typography>
                      </TableCell>
                      <TableCell>{supplier.contactPerson}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography variant="body2">
                            <PhoneIcon fontSize="small" sx={{ verticalAlign: 'text-bottom', mr: 0.5 }} />
                            {supplier.phone}
                          </Typography>
                          <Typography variant="body2">
                            <EmailIcon fontSize="small" sx={{ verticalAlign: 'text-bottom', mr: 0.5 }} />
                            {supplier.email}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={paymentTerms.label} 
                          color={paymentTerms.color as any} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => handleOpenEditDialog(supplier)}
                            size="small"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => handleDeleteSupplier(supplier.id)}
                            size="small"
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {filteredSuppliers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No suppliers found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredSuppliers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {/* Supplier Detail Cards */}
      <Typography variant="h6" gutterBottom>
        Supplier Details
      </Typography>
      
      <Grid container spacing={3}>
        {filteredSuppliers
          .slice(0, 2) // Just show a couple for this demo
          .map((supplier) => (
            <Grid item xs={12} md={6} key={supplier.id}>
              <Card>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h6" component="h2">
                      {supplier.name}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      {supplier.id}
                    </Typography>
                  </Box>
                  <Chip 
                    label={supplier.preferredPaymentTerms} 
                    color="primary" 
                    size="small" 
                  />
                </Box>
                <Divider />
                <Box sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" gutterBottom>
                        Contact
                      </Typography>
                      <Typography variant="body2">
                        {supplier.contactPerson}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        <PhoneIcon fontSize="small" sx={{ verticalAlign: 'text-bottom', mr: 0.5 }} />
                        Phone
                      </Typography>
                      <Typography variant="body2">
                        {supplier.phone}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        <EmailIcon fontSize="small" sx={{ verticalAlign: 'text-bottom', mr: 0.5 }} />
                        Email
                      </Typography>
                      <Typography variant="body2">
                        {supplier.email}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        <BusinessIcon fontSize="small" sx={{ verticalAlign: 'text-bottom', mr: 0.5 }} />
                        Address
                      </Typography>
                      <Typography variant="body2">
                        {supplier.address}
                      </Typography>
                    </Grid>
                    {supplier.notes && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          <EventNoteIcon fontSize="small" sx={{ verticalAlign: 'text-bottom', mr: 0.5 }} />
                          Notes
                        </Typography>
                        <Typography variant="body2">
                          {supplier.notes}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>
                <Box sx={{ p: 2, bgcolor: 'action.hover', borderTop: 1, borderColor: 'divider' }}>
                  <Button 
                    size="small"
                    onClick={() => handleOpenEditDialog(supplier)}
                    startIcon={<EditIcon />}
                  >
                    Edit Supplier
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
      </Grid>

      {/* Supplier Form Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {formMode === 'add' ? 'Add New Supplier' : 'Edit Supplier'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {formMode === 'edit' && (
              <Grid item xs={12} sm={6}>
                <TextField
                  name="id"
                  label="Supplier ID"
                  value={formData.id}
                  fullWidth
                  disabled
                />
              </Grid>
            )}
            
            <Grid item xs={12} sm={formMode === 'edit' ? 6 : 12}>
              <TextField
                required
                name="name"
                label="Supplier Name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                name="contactPerson"
                label="Contact Person"
                value={formData.contactPerson}
                onChange={handleInputChange}
                fullWidth
                error={!!errors.contactPerson}
                helperText={errors.contactPerson}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                name="phone"
                label="Phone"
                value={formData.phone}
                onChange={handleInputChange}
                fullWidth
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                name="address"
                label="Address"
                value={formData.address}
                onChange={handleInputChange}
                fullWidth
                error={!!errors.address}
                helperText={errors.address}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                name="preferredPaymentTerms"
                label="Payment Terms"
                value={formData.preferredPaymentTerms}
                onChange={handleInputChange}
                fullWidth
                error={!!errors.preferredPaymentTerms}
                helperText={errors.preferredPaymentTerms}
                select
                SelectProps={{
                  native: true,
                }}
              >
                <option value="Net 15">Net 15</option>
                <option value="Net 30">Net 30</option>
                <option value="Net 45">Net 45</option>
                <option value="Net 60">Net 60</option>
                <option value="Cash on Delivery">Cash on Delivery</option>
              </TextField>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="notes"
                label="Notes"
                value={formData.notes}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={3}
                placeholder="Enter any additional notes about this supplier"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveSupplier} 
            variant="contained" 
            color="primary"
          >
            {formMode === 'add' ? 'Add Supplier' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default SuppliersPage; 