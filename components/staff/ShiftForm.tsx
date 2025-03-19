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
  FormHelperText,
  Typography,
  SelectChangeEvent
} from '@mui/material';
import { Shift, Staff } from '@/types';

// Remove uuid import and use a simple function to generate IDs
const generateId = () => `shift-${Math.random().toString(36).substring(2, 10)}`;

interface ShiftFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (shift: Shift) => void;
  initialData?: Shift;
  staffList: Staff[];
}

const defaultShift: Shift = {
  id: '',
  staffId: '',
  date: new Date().toISOString().split('T')[0], // Today as default
  startTime: '09:00',
  endTime: '17:00',
  position: '',
  status: 'scheduled',
  notes: ''
};

const ShiftForm: React.FC<ShiftFormProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  staffList
}) => {
  const [formData, setFormData] = useState<Shift>(defaultShift);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        ...defaultShift,
        id: generateId()
      });
    }
    setErrors({});
  }, [initialData, open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields validation
    if (!formData.staffId) newErrors.staffId = 'Staff member is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (!formData.position) newErrors.position = 'Position is required';
    
    // Time validation
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
      
      if (end <= start) {
        newErrors.endTime = 'End time must be after start time';
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
  
  // Handle select field changes
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    
    if (name === 'staffId') {
      const selectedStaff = staffList.find(staff => staff.id === value);
      if (selectedStaff) {
        setFormData(prev => ({
          ...prev,
          staffId: value,
          position: selectedStaff.position
        }));
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const calculateHoursWorked = () => {
    if (formData.status === 'completed' && formData.startTime && formData.endTime) {
      const startParts = formData.startTime.split(':').map(Number);
      const endParts = formData.endTime.split(':').map(Number);
      
      const startHours = startParts[0] + (startParts[1] / 60);
      const endHours = endParts[0] + (endParts[1] / 60);
      
      const hoursWorked = endHours - startHours;
      
      if (hoursWorked > 0) {
        return hoursWorked;
      }
    }
    return undefined;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Calculate hours worked for completed shifts
      const hoursWorked = calculateHoursWorked();
      
      onSave({
        ...formData,
        hoursWorked
      });
      onClose();
    }
  };

  // Find the selected staff member
  const selectedStaff = staffList.find(staff => staff.id === formData.staffId);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? 'Edit Shift' : 'Add New Shift'}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth required error={!!errors.staffId}>
              <InputLabel>Staff Member</InputLabel>
              <Select
                name="staffId"
                value={formData.staffId}
                label="Staff Member"
                onChange={handleSelectChange}
              >
                {staffList.map((staff) => (
                  <MenuItem key={staff.id} value={staff.id}>
                    {staff.firstName} {staff.lastName} ({staff.position})
                  </MenuItem>
                ))}
              </Select>
              {errors.staffId && <FormHelperText>{errors.staffId}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="date"
              label="Shift Date"
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
            <FormControl fullWidth required>
              <InputLabel>Shift Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                label="Shift Status"
                onChange={handleSelectChange}
              >
                <MenuItem value="scheduled">Scheduled</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="missed">Missed</MenuItem>
                <MenuItem value="sick-leave">Sick Leave</MenuItem>
                <MenuItem value="vacation">Vacation</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="startTime"
              label="Start Time"
              type="time"
              fullWidth
              required
              value={formData.startTime}
              onChange={handleTextChange}
              error={!!errors.startTime}
              helperText={errors.startTime}
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }} // 5 min intervals
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="endTime"
              label="End Time"
              type="time"
              fullWidth
              required
              value={formData.endTime}
              onChange={handleTextChange}
              error={!!errors.endTime}
              helperText={errors.endTime}
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }} // 5 min intervals
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="position"
              label="Position"
              fullWidth
              required
              value={formData.position}
              onChange={handleTextChange}
              error={!!errors.position}
              helperText={errors.position}
              InputProps={{
                readOnly: !!selectedStaff,
              }}
            />
            {selectedStaff && (
              <Typography variant="caption" color="text.secondary">
                Position is based on staff member&apos;s current role
              </Typography>
            )}
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
          
          {formData.status === 'completed' && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Hours to be logged: {calculateHoursWorked()?.toFixed(2) || '--'}
              </Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {initialData ? 'Update' : 'Add'} Shift
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShiftForm; 