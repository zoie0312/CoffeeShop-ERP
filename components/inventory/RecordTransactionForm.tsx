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
  FormHelperText
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { InventoryItem, InventoryTransaction, Supplier } from '@/types';
import { format, parse } from 'date-fns';

interface RecordTransactionFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (transaction: InventoryTransaction) => void;
  inventory: InventoryItem[];
  suppliers: Supplier[];
  transaction?: InventoryTransaction;
  mode: 'add' | 'edit';
}

const initialTransaction: InventoryTransaction = {
  id: '',
  inventoryId: '',
  date: format(new Date(), 'yyyy-MM-dd'),
  type: 'restock',
  quantity: 0,
  unitCost: 0,
  totalCost: 0,
  notes: ''
};

const RecordTransactionForm: React.FC<RecordTransactionFormProps> = ({
  open,
  onClose,
  onSave,
  inventory,
  suppliers,
  transaction,
  mode
}) => {
  const [formData, setFormData] = useState<InventoryTransaction>(transaction || initialTransaction);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Reset form when transaction changes
  useEffect(() => {
    setFormData(transaction || initialTransaction);
    setErrors({});
    
    if (transaction?.inventoryId) {
      const item = inventory.find(i => i.id === transaction.inventoryId) || null;
      setSelectedItem(item);
    } else {
      setSelectedItem(null);
    }
  }, [transaction, inventory, open]);

  // Update related fields when selected item changes
  useEffect(() => {
    if (selectedItem && formData.type === 'restock') {
      setFormData(prev => ({
        ...prev,
        unitCost: selectedItem.costPerUnit,
        totalCost: prev.quantity * selectedItem.costPerUnit
      }));
    }
  }, [selectedItem]);

  // Update total cost when quantity or unit cost changes
  useEffect(() => {
    const total = formData.quantity * formData.unitCost;
    
    // For usage, adjustment, and write-off, the cost should be negative
    const adjustedTotal = formData.type === 'restock' ? total : -Math.abs(total);
    
    setFormData(prev => ({
      ...prev,
      totalCost: adjustedTotal
    }));
  }, [formData.quantity, formData.unitCost, formData.type]);

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
    
    if (name === 'inventoryId') {
      const item = inventory.find(i => i.id === value) || null;
      setSelectedItem(item);
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        date: format(date, 'yyyy-MM-dd')
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.inventoryId) {
      newErrors.inventoryId = 'Item is required';
    }
    
    if (!formData.type) {
      newErrors.type = 'Transaction type is required';
    }
    
    if (formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than zero';
    }
    
    if (formData.unitCost <= 0) {
      newErrors.unitCost = 'Unit cost must be greater than zero';
    }
    
    // For restock transactions, supplier and invoice are required
    if (formData.type === 'restock') {
      if (!formData.supplierRef) {
        newErrors.supplierRef = 'Supplier is required for restock transactions';
      }
      
      if (!formData.invoiceNumber) {
        newErrors.invoiceNumber = 'Invoice number is required for restock transactions';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Generate ID if it's a new transaction
      const finalTransaction = mode === 'add' 
        ? { ...formData, id: `TRX${Math.floor(Math.random() * 9000) + 1000}` } 
        : formData;
        
      onSave(finalTransaction);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === 'add' ? 'Record New Transaction' : 'Edit Transaction'}
      </DialogTitle>
      
      <DialogContent dividers>
        <Grid container spacing={3}>
          {mode === 'edit' && (
            <Grid item xs={12} sm={6}>
              <TextField
                name="id"
                label="Transaction ID"
                value={formData.id}
                fullWidth
                disabled
              />
            </Grid>
          )}
          
          <Grid item xs={12} sm={mode === 'edit' ? 6 : 12}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Transaction Date *"
                value={formData.date ? parse(formData.date, 'yyyy-MM-dd', new Date()) : null}
                onChange={handleDateChange}
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
            <FormControl fullWidth error={!!errors.inventoryId} required>
              <InputLabel id="inventory-item-label">Inventory Item</InputLabel>
              <Select
                labelId="inventory-item-label"
                name="inventoryId"
                value={formData.inventoryId}
                onChange={handleSelectChange}
                label="Inventory Item *"
              >
                {inventory.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name} ({item.currentStock} {item.unit} available)
                  </MenuItem>
                ))}
              </Select>
              {errors.inventoryId && <FormHelperText>{errors.inventoryId}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.type} required>
              <InputLabel id="transaction-type-label">Transaction Type</InputLabel>
              <Select
                labelId="transaction-type-label"
                name="type"
                value={formData.type}
                onChange={handleSelectChange}
                label="Transaction Type *"
              >
                <MenuItem value="restock">Restock</MenuItem>
                <MenuItem value="usage">Usage</MenuItem>
                <MenuItem value="adjustment">Adjustment</MenuItem>
                <MenuItem value="write-off">Write-off</MenuItem>
              </Select>
              {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              name="quantity"
              label="Quantity"
              type="number"
              value={formData.quantity}
              onChange={handleNumberChange}
              fullWidth
              error={!!errors.quantity}
              helperText={errors.quantity}
              InputProps={{
                endAdornment: selectedItem && (
                  <InputAdornment position="end">{selectedItem.unit}</InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              name="unitCost"
              label="Unit Cost"
              type="number"
              value={formData.unitCost}
              onChange={handleNumberChange}
              fullWidth
              error={!!errors.unitCost}
              helperText={errors.unitCost}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Grid>
          
          {formData.type === 'restock' && (
            <>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.supplierRef} required>
                  <InputLabel id="supplier-label">Supplier</InputLabel>
                  <Select
                    labelId="supplier-label"
                    name="supplierRef"
                    value={formData.supplierRef || ''}
                    onChange={handleSelectChange}
                    label="Supplier *"
                  >
                    {suppliers.map(supplier => (
                      <MenuItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.supplierRef && <FormHelperText>{errors.supplierRef}</FormHelperText>}
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  name="invoiceNumber"
                  label="Invoice Number"
                  value={formData.invoiceNumber || ''}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.invoiceNumber}
                  helperText={errors.invoiceNumber}
                />
              </Grid>
            </>
          )}
          
          <Grid item xs={12}>
            <TextField
              name="notes"
              label="Notes"
              value={formData.notes || ''}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              placeholder="Add any relevant notes about this transaction"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ 
              p: 2, 
              bgcolor: 'action.hover', 
              borderRadius: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Typography variant="subtitle1">
                Transaction Total
              </Typography>
              <Typography variant="h5" component="span" sx={{ 
                color: formData.totalCost >= 0 ? 'success.main' : 'error.main',
                fontWeight: 'bold'
              }}>
                {formData.totalCost >= 0 ? '+' : ''}{formData.totalCost.toFixed(2)}
              </Typography>
            </Box>
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
          {mode === 'add' ? 'Record Transaction' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Box = ({ children, sx, ...props }: any) => (
  <div style={{ ...sx }} {...props}>
    {children}
  </div>
);

export default RecordTransactionForm; 