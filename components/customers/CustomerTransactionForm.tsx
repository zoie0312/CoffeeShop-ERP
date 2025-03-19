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
  Box,
  SelectChangeEvent
} from '@mui/material';
import { CustomerTransaction, Customer } from '@/types';

// Generate a simple ID instead of using uuid
const generateId = () => `trans-${Math.random().toString(36).substring(2, 10)}`;

interface CustomerTransactionFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (transaction: CustomerTransaction) => void;
  initialData?: CustomerTransaction;
  customerList: Customer[];
  selectedCustomerId?: string;
}

const defaultTransaction: CustomerTransaction = {
  id: '',
  customerId: '',
  date: new Date().toISOString().split('T')[0],
  orderId: '',
  amount: 0,
  pointsEarned: 0,
  pointsRedeemed: 0,
  type: 'purchase',
  notes: ''
};

const CustomerTransactionForm: React.FC<CustomerTransactionFormProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  customerList,
  selectedCustomerId
}) => {
  const [formData, setFormData] = useState<CustomerTransaction>(defaultTransaction);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        ...defaultTransaction,
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
    if (!formData.type) newErrors.type = 'Transaction type is required';
    
    // For purchase and refund types, order ID is required
    if ((formData.type === 'purchase' || formData.type === 'refund') && !formData.orderId) {
      newErrors.orderId = 'Order ID is required for purchases and refunds';
    }
    
    // Amount validation for purchases and refunds
    if (formData.type === 'purchase' && formData.amount <= 0) {
      newErrors.amount = 'Amount must be positive for purchases';
    } else if (formData.type === 'refund' && formData.amount >= 0) {
      newErrors.amount = 'Amount must be negative for refunds';
    }
    
    // Points earned validation
    if (formData.type === 'purchase' && formData.pointsEarned < 0) {
      newErrors.pointsEarned = 'Points earned cannot be negative';
    }
    
    // Points redeemed validation
    if (formData.pointsRedeemed < 0) {
      newErrors.pointsRedeemed = 'Points redeemed cannot be negative';
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
    
    if (name === 'type') {
      // Type assertion to ensure value is of the correct type
      const transactionType = value as CustomerTransaction['type'];
      
      // Create a new form data object with the updated type
      const newFormData: CustomerTransaction = {
        ...formData,
        type: transactionType
      };
      
      // Adjust form values based on transaction type
      if (transactionType === 'refund' && formData.amount > 0) {
        newFormData.amount = -Math.abs(formData.amount);
        newFormData.pointsEarned = 0;
      } else if (transactionType === 'purchase' && formData.amount < 0) {
        newFormData.amount = Math.abs(formData.amount);
      } else if (transactionType === 'points_redemption') {
        newFormData.amount = 0;
        newFormData.pointsEarned = 0;
      } else if (transactionType === 'points_adjustment') {
        newFormData.amount = 0;
      }
      
      setFormData(newFormData);
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

  // Calculate points earned based on amount if it's a purchase
  const calculatePointsEarned = () => {
    if (formData.type === 'purchase' && formData.amount > 0) {
      // Simple rule: 1 point per dollar spent, rounded to nearest integer
      return Math.round(formData.amount);
    }
    return 0;
  };

  // Auto-update points earned when amount changes for purchases
  useEffect(() => {
    if (formData.type === 'purchase') {
      setFormData(prev => ({
        ...prev,
        pointsEarned: calculatePointsEarned()
      }));
    }
  }, [formData.amount, formData.type]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? 'Edit Transaction' : 'Record New Transaction'}
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
              label="Transaction Date"
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
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors.type}>
              <InputLabel>Transaction Type</InputLabel>
              <Select
                name="type"
                value={formData.type}
                label="Transaction Type"
                onChange={handleSelectChange}
              >
                <MenuItem value="purchase">Purchase</MenuItem>
                <MenuItem value="refund">Refund</MenuItem>
                <MenuItem value="points_redemption">Points Redemption</MenuItem>
                <MenuItem value="points_adjustment">Points Adjustment</MenuItem>
              </Select>
              {errors.type && (
                <Typography variant="caption" color="error">
                  {errors.type}
                </Typography>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="orderId"
              label="Order ID"
              fullWidth
              required={formData.type === 'purchase' || formData.type === 'refund'}
              value={formData.orderId}
              onChange={handleTextChange}
              error={!!errors.orderId}
              helperText={errors.orderId}
              disabled={formData.type === 'points_adjustment'}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              name="amount"
              label="Transaction Amount"
              type="number"
              fullWidth
              value={formData.amount}
              onChange={handleNumberChange}
              error={!!errors.amount}
              helperText={errors.amount}
              InputProps={{ 
                startAdornment: <Box component="span" sx={{ mr: 1 }}>$</Box>,
                inputProps: { step: 0.01 }
              }}
              disabled={formData.type === 'points_redemption' || formData.type === 'points_adjustment'}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              name="pointsEarned"
              label="Points Earned"
              type="number"
              fullWidth
              value={formData.pointsEarned}
              onChange={handleNumberChange}
              error={!!errors.pointsEarned}
              helperText={errors.pointsEarned}
              InputProps={{ inputProps: { min: 0 } }}
              disabled={formData.type === 'refund' || formData.type === 'points_redemption'}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              name="pointsRedeemed"
              label="Points Redeemed"
              type="number"
              fullWidth
              value={formData.pointsRedeemed}
              onChange={handleNumberChange}
              error={!!errors.pointsRedeemed}
              helperText={errors.pointsRedeemed}
              InputProps={{ inputProps: { min: 0 } }}
              disabled={formData.type === 'points_adjustment'}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="notes"
              label="Notes"
              fullWidth
              multiline
              rows={3}
              value={formData.notes}
              onChange={handleTextChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {initialData ? 'Update' : 'Record'} Transaction
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomerTransactionForm; 