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
  InputAdornment,
  Typography,
  Box,
  FormHelperText
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { InventoryItem, InventoryCategory, Supplier } from '@/types';
import { format, parse } from 'date-fns';

interface InventoryItemFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (item: InventoryItem) => void;
  item?: InventoryItem;
  categories: InventoryCategory[];
  suppliers: Supplier[];
  mode: 'add' | 'edit';
}

const initialItem: InventoryItem = {
  id: '',
  name: '',
  category: '',
  unit: '',
  currentStock: 0,
  reorderPoint: 0,
  idealStock: 0,
  costPerUnit: 0,
  supplier: '',
  location: '',
  lastRestocked: format(new Date(), 'yyyy-MM-dd'),
  expiryDate: null
};

const InventoryItemForm: React.FC<InventoryItemFormProps> = ({
  open,
  onClose,
  onSave,
  item,
  categories,
  suppliers,
  mode
}) => {
  const [formData, setFormData] = useState<InventoryItem>(item || initialItem);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when item changes
  useEffect(() => {
    setFormData(item || initialItem);
    setErrors({});
  }, [item, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? 0 : parseFloat(value);
    
    setFormData(prev => ({ ...prev, [name]: numValue }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleLastRestockedChange = (date: Date | null) => {
    if (date) {
      setFormData(prev => ({ 
        ...prev, 
        lastRestocked: format(date, 'yyyy-MM-dd')
      }));
    }
  };

  const handleExpiryDateChange = (date: Date | null) => {
    setFormData(prev => ({ 
      ...prev, 
      expiryDate: date ? format(date, 'yyyy-MM-dd') : null
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.unit.trim()) {
      newErrors.unit = 'Unit is required';
    }
    
    if (formData.reorderPoint < 0) {
      newErrors.reorderPoint = 'Reorder point must be a positive number';
    }
    
    if (formData.idealStock <= 0) {
      newErrors.idealStock = 'Ideal stock must be greater than zero';
    }
    
    if (formData.costPerUnit < 0) {
      newErrors.costPerUnit = 'Cost per unit must be a positive number';
    }
    
    if (!formData.supplier) {
      newErrors.supplier = 'Supplier is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Generate ID if it's a new item
      const finalItem = mode === 'add' 
        ? { ...formData, id: `INV${Math.floor(Math.random() * 9000) + 1000}` } 
        : formData;
        
      onSave(finalItem);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === 'add' ? 'Add New Inventory Item' : 'Edit Inventory Item'}
      </DialogTitle>
      
      <DialogContent dividers>
        <Grid container spacing={3}>
          {mode === 'edit' && (
            <Grid item xs={12} sm={6}>
              <TextField
                name="id"
                label="ID"
                value={formData.id}
                fullWidth
                disabled
              />
            </Grid>
          )}
          
          <Grid item xs={12} sm={mode === 'edit' ? 6 : 12}>
            <TextField
              required
              name="name"
              label="Item Name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.category}>
              <InputLabel id="category-label">Category *</InputLabel>
              <Select
                labelId="category-label"
                name="category"
                value={formData.category}
                onChange={handleSelectChange}
                label="Category *"
              >
                {categories.map(category => (
                  <MenuItem key={category.id} value={category.name}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              name="unit"
              label="Unit of Measurement"
              value={formData.unit}
              onChange={handleChange}
              fullWidth
              error={!!errors.unit}
              helperText={errors.unit}
              placeholder="e.g., kg, L, pcs"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
              Stock Information
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              required
              name="currentStock"
              label="Current Stock"
              type="number"
              value={formData.currentStock}
              onChange={handleNumberChange}
              fullWidth
              InputProps={{
                endAdornment: <InputAdornment position="end">{formData.unit}</InputAdornment>,
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              required
              name="reorderPoint"
              label="Reorder Point"
              type="number"
              value={formData.reorderPoint}
              onChange={handleNumberChange}
              fullWidth
              error={!!errors.reorderPoint}
              helperText={errors.reorderPoint}
              InputProps={{
                endAdornment: <InputAdornment position="end">{formData.unit}</InputAdornment>,
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              required
              name="idealStock"
              label="Ideal Stock Level"
              type="number"
              value={formData.idealStock}
              onChange={handleNumberChange}
              fullWidth
              error={!!errors.idealStock}
              helperText={errors.idealStock}
              InputProps={{
                endAdornment: <InputAdornment position="end">{formData.unit}</InputAdornment>,
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
              Cost & Supplier
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              name="costPerUnit"
              label="Cost Per Unit"
              type="number"
              value={formData.costPerUnit}
              onChange={handleNumberChange}
              fullWidth
              error={!!errors.costPerUnit}
              helperText={errors.costPerUnit}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.supplier}>
              <InputLabel id="supplier-label">Supplier *</InputLabel>
              <Select
                labelId="supplier-label"
                name="supplier"
                value={formData.supplier}
                onChange={handleSelectChange}
                label="Supplier *"
              >
                {suppliers.map(supplier => (
                  <MenuItem key={supplier.id} value={supplier.name}>
                    {supplier.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.supplier && <FormHelperText>{errors.supplier}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="location"
              label="Storage Location"
              value={formData.location}
              onChange={handleChange}
              fullWidth
              placeholder="e.g., Main Storage, Refrigerator 1"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
              Dates
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Last Restocked"
                value={formData.lastRestocked ? parse(formData.lastRestocked, 'yyyy-MM-dd', new Date()) : null}
                onChange={handleLastRestockedChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Expiry Date (if applicable)"
                value={formData.expiryDate ? parse(formData.expiryDate, 'yyyy-MM-dd', new Date()) : null}
                onChange={handleExpiryDateChange}
                slotProps={{
                  textField: {
                    fullWidth: true
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
        >
          {mode === 'add' ? 'Add Item' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InventoryItemForm; 