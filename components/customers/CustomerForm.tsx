import React, { useState, useEffect, ReactNode } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Divider,
  Box,
  SelectChangeEvent,
  Chip,
  Autocomplete
} from '@mui/material';
import { Customer } from '@/types';

// Generate a simple ID instead of using uuid
const generateId = () => `cust-${Math.random().toString(36).substring(2, 10)}`;

interface CustomerFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (customer: Customer) => void;
  initialData?: Customer;
  productList?: string[];
}

const defaultCustomer: Customer = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  birthdate: '',
  joinDate: new Date().toISOString().split('T')[0], // Today as default
  points: 0,
  totalSpent: 0,
  status: 'new',
  notes: '',
  preferences: {
    favoriteProducts: [],
    milkPreference: '',
    sugarPreference: ''
  }
};

const milkOptions = [
  'Whole Milk',
  'Skim Milk',
  '2% Milk',
  'Oat Milk',
  'Almond Milk',
  'Soy Milk',
  'Coconut Milk',
  'Lactose-Free Milk',
  'No Milk'
];

const sugarOptions = [
  'No Sugar',
  'One Sugar',
  'Two Sugars',
  'Raw Sugar',
  'Brown Sugar',
  'Honey',
  'Stevia',
  'Splenda',
  'Equal'
];

const CustomerForm: React.FC<CustomerFormProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  productList = []
}) => {
  const [formData, setFormData] = useState<Customer>(defaultCustomer);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        ...defaultCustomer,
        id: generateId()
      });
    }
    setErrors({});
  }, [initialData, open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    // Email format validation if provided
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
    }
    
    // Phone format validation if provided
    if (formData.phone) {
      const phoneRegex = /^[0-9-+() ]{10,15}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Invalid phone format';
      }
    }
    
    // Date validation for birthdate if provided
    if (formData.birthdate) {
      const birthdateDate = new Date(formData.birthdate);
      if (isNaN(birthdateDate.getTime())) {
        newErrors.birthdate = 'Invalid date format';
      } else if (birthdateDate > new Date()) {
        newErrors.birthdate = 'Birthdate cannot be in the future';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle text field changes
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle number field changes
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    
    setFormData({
      ...formData,
      [name]: isNaN(numValue) ? 0 : numValue
    });
  };

  // Handle select field changes
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle preferences changes
  const handlePreferenceChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        [field]: value
      }
    });
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? 'Edit Customer' : 'Add New Customer'}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold">
              Personal Information
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="firstName"
              label="First Name"
              fullWidth
              required
              value={formData.firstName}
              onChange={handleTextChange}
              error={!!errors.firstName}
              helperText={errors.firstName}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="lastName"
              label="Last Name"
              fullWidth
              required
              value={formData.lastName}
              onChange={handleTextChange}
              error={!!errors.lastName}
              helperText={errors.lastName}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="email"
              label="Email"
              type="email"
              fullWidth
              value={formData.email || ''}
              onChange={handleTextChange}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="phone"
              label="Phone"
              fullWidth
              value={formData.phone || ''}
              onChange={handleTextChange}
              error={!!errors.phone}
              helperText={errors.phone}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="address"
              label="Address"
              fullWidth
              value={formData.address || ''}
              onChange={handleTextChange}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="birthdate"
              label="Birth Date"
              type="date"
              fullWidth
              value={formData.birthdate || ''}
              onChange={handleTextChange}
              error={!!errors.birthdate}
              helperText={errors.birthdate}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="joinDate"
              label="Join Date"
              type="date"
              fullWidth
              required
              value={formData.joinDate}
              onChange={handleTextChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle1" fontWeight="bold">
              Loyalty Program Information
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="points"
              label="Points Balance"
              type="number"
              fullWidth
              value={formData.points}
              onChange={handleNumberChange}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="totalSpent"
              label="Total Spent"
              type="number"
              fullWidth
              value={formData.totalSpent}
              onChange={handleNumberChange}
              InputProps={{ 
                startAdornment: <Box component="span" sx={{ mr: 1 }}>$</Box>,
                inputProps: { min: 0, step: 0.01 }
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Customer Status</InputLabel>
              <Select<'new' | 'regular' | 'vip'>
                name="status"
                value={formData.status}
                label="Customer Status"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    status: e.target.value as 'new' | 'regular' | 'vip'
                  });
                }}
              >
                <MenuItem value="new">New</MenuItem>
                <MenuItem value="regular">Regular</MenuItem>
                <MenuItem value="vip">VIP</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle1" fontWeight="bold">
              Preferences
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Autocomplete
              multiple
              id="favoriteProducts"
              options={productList}
              value={formData.preferences?.favoriteProducts || []}
              onChange={(event, newValue) => {
                handlePreferenceChange('favoriteProducts', newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Favorite Products"
                  placeholder="Select favorite products"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip 
                    label={option} 
                    {...getTagProps({ index })} 
                    color="primary" 
                    variant="outlined" 
                    size="small" 
                  />
                ))
              }
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Autocomplete
              id="milkPreference"
              options={milkOptions}
              value={formData.preferences?.milkPreference || null}
              onChange={(event, newValue) => {
                handlePreferenceChange('milkPreference', newValue);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Milk Preference" />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Autocomplete
              id="sugarPreference"
              options={sugarOptions}
              value={formData.preferences?.sugarPreference || null}
              onChange={(event, newValue) => {
                handlePreferenceChange('sugarPreference', newValue);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Sugar Preference" />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle1" fontWeight="bold">
              Additional Information
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="notes"
              label="Notes"
              fullWidth
              multiline
              rows={3}
              value={formData.notes || ''}
              onChange={handleTextChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {initialData ? 'Update' : 'Add'} Customer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomerForm; 