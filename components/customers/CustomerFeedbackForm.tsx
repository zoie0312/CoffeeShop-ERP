import React, { useState, useEffect } from 'react';
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
  Rating,
  FormControlLabel,
  Switch,
  SelectChangeEvent
} from '@mui/material';
import { CustomerFeedback, Customer } from '@/types';

// Generate a simple ID 
const generateId = () => `feedback-${Math.random().toString(36).substring(2, 10)}`;

interface CustomerFeedbackFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (feedback: CustomerFeedback) => void;
  initialData?: CustomerFeedback;
  customerList: Customer[];
  selectedCustomerId?: string;
  isAdmin?: boolean;
}

const defaultFeedback: CustomerFeedback = {
  id: '',
  customerId: '',
  date: new Date().toISOString().split('T')[0],
  rating: 5,
  comment: '',
  resolved: false,
  category: 'other'
};

const CustomerFeedbackForm: React.FC<CustomerFeedbackFormProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  customerList,
  selectedCustomerId,
  isAdmin = false
}) => {
  const [formData, setFormData] = useState<CustomerFeedback>(defaultFeedback);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        ...defaultFeedback,
        id: generateId(),
        customerId: selectedCustomerId || '',
        date: new Date().toISOString().split('T')[0]
      });
    }
    setErrors({});
  }, [initialData, open, selectedCustomerId]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields validation
    if (!formData.customerId) newErrors.customerId = 'Customer is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.comment) newErrors.comment = 'Feedback comment is required';
    if (!formData.category) newErrors.category = 'Category is required';
    
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

  // Handle select field changes
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle switch changes
  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  // Handle rating changes
  const handleRatingChange = (_: React.SyntheticEvent, value: number | null) => {
    // Ensure the rating is one of the valid values (1-5)
    let validRating: 1 | 2 | 3 | 4 | 5 = 5;
    if (value === 1) validRating = 1;
    else if (value === 2) validRating = 2;
    else if (value === 3) validRating = 3;
    else if (value === 4) validRating = 4;
    else if (value === 5) validRating = 5;
    
    setFormData({
      ...formData,
      rating: validRating
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
        {initialData ? 'Edit Customer Feedback' : 'Record New Feedback'}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors.customerId}>
              <InputLabel>Customer</InputLabel>
              <Select
                name="customerId"
                value={formData.customerId}
                label="Customer"
                onChange={handleSelectChange}
                disabled={!!selectedCustomerId}
              >
                {customerList.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.firstName} {customer.lastName}
                  </MenuItem>
                ))}
              </Select>
              {errors.customerId && (
                <Typography variant="caption" color="error">
                  {errors.customerId}
                </Typography>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="date"
              label="Feedback Date"
              type="date"
              fullWidth
              required
              value={formData.date}
              onChange={handleTextChange}
              error={!!errors.date}
              helperText={errors.date}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography component="legend">Rating</Typography>
            <Rating
              name="rating"
              value={formData.rating}
              onChange={handleRatingChange}
              size="large"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors.category}>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category || 'other'}
                label="Category"
                onChange={handleSelectChange}
              >
                <MenuItem value="product">Product</MenuItem>
                <MenuItem value="service">Service</MenuItem>
                <MenuItem value="ambiance">Ambiance</MenuItem>
                <MenuItem value="price">Price</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
              {errors.category && (
                <Typography variant="caption" color="error">
                  {errors.category}
                </Typography>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            {isAdmin && (
              <FormControlLabel
                control={
                  <Switch
                    name="resolved"
                    checked={formData.resolved}
                    onChange={handleSwitchChange}
                    color="primary"
                  />
                }
                label="Resolved"
              />
            )}
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="comment"
              label="Feedback Comment"
              fullWidth
              required
              multiline
              rows={4}
              value={formData.comment}
              onChange={handleTextChange}
              error={!!errors.comment}
              helperText={errors.comment || 'Please provide detailed feedback'}
            />
          </Grid>
          
          {isAdmin && (
            <Grid item xs={12}>
              <TextField
                name="response"
                label="Staff Response"
                fullWidth
                multiline
                rows={3}
                value={formData.response || ''}
                onChange={handleTextChange}
                placeholder="Enter your response to the customer feedback"
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {initialData ? 'Update' : 'Submit'} Feedback
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomerFeedbackForm; 