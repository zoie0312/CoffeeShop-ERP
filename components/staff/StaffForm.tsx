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
  SelectChangeEvent
} from '@mui/material';
import { Staff } from '@/types';

// Generate a simple ID instead of using uuid
const generateId = () => `staff-${Math.random().toString(36).substring(2, 10)}`;

interface StaffFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (staff: Staff) => void;
  initialData?: Staff;
}

const defaultStaff: Staff = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  position: '',
  department: '',
  hireDate: new Date().toISOString().split('T')[0], // Today as default
  status: 'active',
  address: '',
  emergencyContact: {
    name: '',
    relationship: '',
    phone: ''
  },
  bankDetails: {
    accountName: '',
    accountNumber: '',
    bankName: ''
  }
};

const departments = [
  'Operations',
  'Service',
  'Kitchen',
  'Management',
  'Administration'
];

const positions = [
  'Manager',
  'Assistant Manager',
  'Shift Supervisor',
  'Barista',
  'Pastry Chef',
  'Cashier',
  'Dishwasher',
  'Cleaner'
];

const StaffForm: React.FC<StaffFormProps> = ({ 
  open, 
  onClose, 
  onSave, 
  initialData 
}) => {
  const [formData, setFormData] = useState<Staff>(defaultStaff);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        ...defaultStaff,
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
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.hireDate) newErrors.hireDate = 'Hire date is required';
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    // Phone format validation (simple check)
    const phoneRegex = /^[0-9-+() ]{10,15}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Invalid phone format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle text field changes
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      
      if (parent === 'emergencyContact') {
        const updatedContact = { ...formData.emergencyContact, [child]: value };
        setFormData({ ...formData, emergencyContact: updatedContact });
      } else if (parent === 'bankDetails') {
        const updatedBank = { ...formData.bankDetails, [child]: value };
        setFormData({ ...formData, bankDetails: updatedBank });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle select field changes
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    
    if (name === 'status') {
      // For status field, ensure it's one of the valid values
      const statusValue = value as 'active' | 'on-leave' | 'terminated';
      setFormData({
        ...formData,
        status: statusValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
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
        {initialData ? 'Edit Staff Member' : 'Add New Staff Member'}
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
              required
              value={formData.email}
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
              required
              value={formData.phone}
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
              value={formData.address}
              onChange={handleTextChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle1" fontWeight="bold">
              Employment Details
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors.position}>
              <InputLabel>Position</InputLabel>
              <Select
                name="position"
                value={formData.position}
                label="Position"
                onChange={handleSelectChange}
              >
                {positions.map((pos) => (
                  <MenuItem key={pos} value={pos}>
                    {pos}
                  </MenuItem>
                ))}
              </Select>
              {errors.position && (
                <Typography variant="caption" color="error">
                  {errors.position}
                </Typography>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors.department}>
              <InputLabel>Department</InputLabel>
              <Select
                name="department"
                value={formData.department}
                label="Department"
                onChange={handleSelectChange}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
              {errors.department && (
                <Typography variant="caption" color="error">
                  {errors.department}
                </Typography>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="hireDate"
              label="Hire Date"
              type="date"
              fullWidth
              required
              value={formData.hireDate}
              onChange={handleTextChange}
              error={!!errors.hireDate}
              helperText={errors.hireDate}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                label="Status"
                onChange={handleSelectChange}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="on-leave">On Leave</MenuItem>
                <MenuItem value="terminated">Terminated</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="hourlyRate"
              label="Hourly Rate"
              type="number"
              fullWidth
              value={formData.hourlyRate || ''}
              onChange={handleTextChange}
              InputProps={{ startAdornment: <Box component="span" sx={{ mr: 1 }}>$</Box> }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="salary"
              label="Annual Salary"
              type="number"
              fullWidth
              value={formData.salary || ''}
              onChange={handleTextChange}
              InputProps={{ startAdornment: <Box component="span" sx={{ mr: 1 }}>$</Box> }}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle1" fontWeight="bold">
              Emergency Contact
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="emergencyContact.name"
              label="Emergency Contact Name"
              fullWidth
              value={formData.emergencyContact.name}
              onChange={handleTextChange}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="emergencyContact.relationship"
              label="Relationship"
              fullWidth
              value={formData.emergencyContact.relationship}
              onChange={handleTextChange}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="emergencyContact.phone"
              label="Emergency Contact Phone"
              fullWidth
              value={formData.emergencyContact.phone}
              onChange={handleTextChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle1" fontWeight="bold">
              Bank Details
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="bankDetails.accountName"
              label="Account Name"
              fullWidth
              value={formData.bankDetails.accountName}
              onChange={handleTextChange}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="bankDetails.accountNumber"
              label="Account Number"
              fullWidth
              value={formData.bankDetails.accountNumber}
              onChange={handleTextChange}
              type="password"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="bankDetails.bankName"
              label="Bank Name"
              fullWidth
              value={formData.bankDetails.bankName}
              onChange={handleTextChange}
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
          {initialData ? 'Update' : 'Add'} Staff Member
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StaffForm; 