import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Typography,
  Tooltip,
  TextField,
  InputAdornment,
  Chip,
  Button,
  Stack,
  Rating,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Flag as FlagIcon,
  CheckCircle as CheckCircleIcon,
  Message as MessageIcon
} from '@mui/icons-material';
import { CustomerFeedback, Customer } from '@/types';
import { format } from 'date-fns';

interface CustomerFeedbackListProps {
  feedback: CustomerFeedback[];
  customers: Customer[];
  selectedCustomerId?: string;
  onEdit: (feedback: CustomerFeedback) => void;
  onDelete: (feedbackId: string) => void;
  onAddNew: () => void;
  onToggleResolved: (feedbackId: string, resolved: boolean) => void;
  isAdmin?: boolean;
}

const CustomerFeedbackList: React.FC<CustomerFeedbackListProps> = ({
  feedback,
  customers,
  selectedCustomerId,
  onEdit,
  onDelete,
  onAddNew,
  onToggleResolved,
  isAdmin = false
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [showResolvedOnly, setShowResolvedOnly] = useState(false);
  const [showUnresolvedOnly, setShowUnresolvedOnly] = useState(false);

  // Get customer name by id
  const getCustomerName = (customerId: string): string => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown Customer';
  };

  // Filter feedback by customer id if selected
  const filteredByCustomer = selectedCustomerId
    ? feedback.filter(f => f.customerId === selectedCustomerId)
    : feedback;

  // Filter feedback based on search term and resolved status
  const filteredFeedback = filteredByCustomer.filter((feedbackItem) => {
    const searchTermLower = searchTerm.toLowerCase();
    const customerName = getCustomerName(feedbackItem.customerId).toLowerCase();
    
    // Filter by search term
    const matchesSearch = 
      customerName.includes(searchTermLower) ||
      (feedbackItem.category?.toLowerCase() || '').includes(searchTermLower) ||
      (feedbackItem.comment && feedbackItem.comment.toLowerCase().includes(searchTermLower)) ||
      (feedbackItem.response && feedbackItem.response.toLowerCase().includes(searchTermLower));
    
    // Filter by resolved status
    if (showResolvedOnly && !feedbackItem.resolved) return false;
    if (showUnresolvedOnly && feedbackItem.resolved) return false;
    
    return matchesSearch;
  });

  // Handle page change
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle search term change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  // Handle resolved toggle
  const handleResolvedToggle = (event: React.ChangeEvent<HTMLInputElement>, feedbackId: string) => {
    onToggleResolved(feedbackId, event.target.checked);
  };

  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Get category chip color
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'product':
        return 'primary';
      case 'service':
        return 'secondary';
      case 'ambiance':
        return 'info';
      case 'price':
        return 'warning';
      case 'cleanliness':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search feedback..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: '250px' }}
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={showResolvedOnly}
                onChange={(e) => {
                  setShowResolvedOnly(e.target.checked);
                  if (e.target.checked) setShowUnresolvedOnly(false);
                }}
                size="small"
              />
            }
            label="Resolved Only"
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={showUnresolvedOnly}
                onChange={(e) => {
                  setShowUnresolvedOnly(e.target.checked);
                  if (e.target.checked) setShowResolvedOnly(false);
                }}
                size="small"
              />
            }
            label="Unresolved Only"
          />
        </Box>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddNew}
          color="primary"
        >
          Add New Feedback
        </Button>
      </Box>

      {selectedCustomerId && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="medium" color="primary">
            Feedback from: {getCustomerName(selectedCustomerId)}
          </Typography>
        </Box>
      )}

      {filteredFeedback.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">
            No feedback records found matching your criteria.
          </Typography>
        </Paper>
      ) : (
        <>
          {filteredFeedback
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((feedbackItem) => (
              <Card key={feedbackItem.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Box>
                      {!selectedCustomerId && (
                        <Typography variant="subtitle1" fontWeight="medium">
                          {getCustomerName(feedbackItem.customerId)}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(feedbackItem.date)}
                        </Typography>
                        {feedbackItem.category && (
                          <Chip
                            label={feedbackItem.category}
                            size="small"
                            color={getCategoryColor(feedbackItem.category) as any}
                          />
                        )}
                        {feedbackItem.resolved ? (
                          <Chip
                            icon={<CheckCircleIcon />}
                            label="Resolved"
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                        ) : (
                          <Chip
                            icon={<FlagIcon />}
                            label="Unresolved"
                            size="small"
                            color="warning"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </Box>
                    
                    <Box>
                      <Rating value={feedbackItem.rating} readOnly size="small" />
                    </Box>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-line' }}>
                      {feedbackItem.comment}
                    </Typography>
                  </Box>
                  
                  {feedbackItem.response && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Box sx={{ pl: 2, borderLeft: '2px solid', borderColor: 'primary.main' }}>
                        <Typography variant="subtitle2" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <MessageIcon fontSize="small" />
                          Staff Response:
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-line' }}>
                          {feedbackItem.response}
                        </Typography>
                      </Box>
                    </>
                  )}
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                    {isAdmin && (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={feedbackItem.resolved}
                            onChange={(e) => handleResolvedToggle(e, feedbackItem.id)}
                            size="small"
                          />
                        }
                        label="Resolved"
                      />
                    )}
                    <Tooltip title="Edit Feedback">
                      <IconButton
                        size="small"
                        onClick={() => onEdit(feedbackItem)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Feedback">
                      <IconButton
                        size="small"
                        onClick={() => onDelete(feedbackItem.id)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            ))}
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredFeedback.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Box>
  );
};

export default CustomerFeedbackList; 