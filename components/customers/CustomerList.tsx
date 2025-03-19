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
  Chip,
  Typography,
  Tooltip,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Button,
  Stack
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Sync as SyncIcon,
  Assessment as AssessmentIcon,
  MessageOutlined as MessageIcon,
  ShoppingCart as ShoppingCartIcon,
  ViewList as ViewListIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { Customer } from '@/types';
import { format } from 'date-fns';
import { useRouter } from 'next/router';

interface CustomerListProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
  onAddNew: () => void;
  onViewTransactions?: (customerId: string) => void;
  onViewFeedback?: (customerId: string) => void;
  onRecordTransaction?: (customerId: string) => void;
  onRecordFeedback?: (customerId: string) => void;
}

const CustomerList: React.FC<CustomerListProps> = ({
  customers,
  onEdit,
  onDelete,
  onAddNew,
  onViewTransactions,
  onViewFeedback,
  onRecordTransaction,
  onRecordFeedback
}) => {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  // Handle menu opening
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, customerId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedCustomerId(customerId);
  };

  // Handle menu closing
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCustomerId(null);
  };

  // Navigate to customer details page
  const handleViewCustomerDetails = (customerId: string) => {
    router.push(`/customers/${customerId}`);
  };

  // Filter customers based on search term
  const filteredCustomers = customers.filter((customer) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      customer.firstName.toLowerCase().includes(searchTermLower) ||
      customer.lastName.toLowerCase().includes(searchTermLower) ||
      (customer.email || '').toLowerCase().includes(searchTermLower) ||
      (customer.phone || '').includes(searchTerm) ||
      customer.status.toLowerCase().includes(searchTermLower)
    );
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

  // Get status chip color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'regular':
        return 'success';
      case 'vip':
        return 'secondary';
      case 'new':
        return 'info';
      case 'inactive':
        return 'warning';
      default:
        return 'default';
    }
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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: '300px' }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddNew}
          color="primary"
        >
          Add New Customer
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="medium">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Loyalty Points</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((customer) => (
                <TableRow 
                  key={customer.id} 
                  hover
                  onClick={() => handleViewCustomerDetails(customer.id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <Typography variant="body1">
                      {customer.firstName} {customer.lastName}
                    </Typography>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{formatDate(customer.joinDate)}</TableCell>
                  <TableCell>
                    <Chip
                      label={customer.status}
                      size="small"
                      color={getStatusColor(customer.status) as any}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {customer.points?.toLocaleString() || 0} pts
                    </Typography>
                  </TableCell>
                  <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleViewCustomerDetails(customer.id)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Customer">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(customer);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="More Options">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMenuOpen(e, customer.id);
                          }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            {filteredCustomers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" py={2}>
                    No customers found matching your search.
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
        count={filteredCustomers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {onViewTransactions && (
          <MenuItem
            onClick={() => {
              if (selectedCustomerId && onViewTransactions) {
                onViewTransactions(selectedCustomerId);
              }
              handleMenuClose();
            }}
          >
            <ViewListIcon fontSize="small" sx={{ mr: 1 }} />
            View Transactions
          </MenuItem>
        )}
        
        {onRecordTransaction && (
          <MenuItem
            onClick={() => {
              if (selectedCustomerId && onRecordTransaction) {
                onRecordTransaction(selectedCustomerId);
              }
              handleMenuClose();
            }}
          >
            <ShoppingCartIcon fontSize="small" sx={{ mr: 1 }} />
            Record Transaction
          </MenuItem>
        )}
        
        {onViewFeedback && (
          <MenuItem
            onClick={() => {
              if (selectedCustomerId && onViewFeedback) {
                onViewFeedback(selectedCustomerId);
              }
              handleMenuClose();
            }}
          >
            <AssessmentIcon fontSize="small" sx={{ mr: 1 }} />
            View Feedback
          </MenuItem>
        )}
        
        {onRecordFeedback && (
          <MenuItem
            onClick={() => {
              if (selectedCustomerId && onRecordFeedback) {
                onRecordFeedback(selectedCustomerId);
              }
              handleMenuClose();
            }}
          >
            <MessageIcon fontSize="small" sx={{ mr: 1 }} />
            Record Feedback
          </MenuItem>
        )}
        
        <MenuItem
          onClick={() => {
            if (selectedCustomerId) {
              onDelete(selectedCustomerId);
            }
            handleMenuClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete Customer
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default CustomerList; 