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
  Stack
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
  ReceiptLong as ReceiptIcon
} from '@mui/icons-material';
import { CustomerTransaction, Customer } from '@/types';
import { format } from 'date-fns';

interface CustomerTransactionListProps {
  transactions: CustomerTransaction[];
  customers: Customer[];
  selectedCustomerId?: string;
  onEdit: (transaction: CustomerTransaction) => void;
  onDelete: (transactionId: string) => void;
  onAddNew: () => void;
}

const CustomerTransactionList: React.FC<CustomerTransactionListProps> = ({
  transactions,
  customers,
  selectedCustomerId,
  onEdit,
  onDelete,
  onAddNew
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Get customer name by id
  const getCustomerName = (customerId: string): string => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown Customer';
  };

  // Filter transactions by customer id if selected
  const filteredByCustomer = selectedCustomerId
    ? transactions.filter(t => t.customerId === selectedCustomerId)
    : transactions;

  // Filter transactions based on search term
  const filteredTransactions = filteredByCustomer.filter((transaction) => {
    const searchTermLower = searchTerm.toLowerCase();
    const customerName = getCustomerName(transaction.customerId).toLowerCase();
    
    return (
      customerName.includes(searchTermLower) ||
      transaction.orderId.toLowerCase().includes(searchTermLower) ||
      transaction.type.toLowerCase().includes(searchTermLower) ||
      (transaction.notes && transaction.notes.toLowerCase().includes(searchTermLower))
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

  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Get chip color and label based on transaction type
  const getTransactionTypeInfo = (type: string) => {
    switch (type.toLowerCase()) {
      case 'purchase':
        return { color: 'success', label: 'Purchase' };
      case 'refund':
        return { color: 'error', label: 'Refund' };
      case 'points_redemption':
        return { color: 'primary', label: 'Points Redemption' };
      case 'points_adjustment':
        return { color: 'warning', label: 'Points Adjustment' };
      default:
        return { color: 'default', label: type };
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search transactions..."
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
          Record New Transaction
        </Button>
      </Box>

      {selectedCustomerId && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="medium" color="primary">
            Transactions for: {getCustomerName(selectedCustomerId)}
          </Typography>
        </Box>
      )}

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="medium">
          <TableHead>
            <TableRow>
              {!selectedCustomerId && <TableCell>Customer</TableCell>}
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Order ID</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Points Earned</TableCell>
              <TableCell align="right">Points Redeemed</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((transaction) => {
                const typeInfo = getTransactionTypeInfo(transaction.type);
                
                return (
                  <TableRow key={transaction.id} hover>
                    {!selectedCustomerId && (
                      <TableCell>
                        <Typography variant="body2">
                          {getCustomerName(transaction.customerId)}
                        </Typography>
                      </TableCell>
                    )}
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell>
                      <Chip
                        label={typeInfo.label}
                        size="small"
                        color={typeInfo.color as any}
                      />
                    </TableCell>
                    <TableCell>
                      {transaction.orderId ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ReceiptIcon fontSize="small" sx={{ mr: 0.5, opacity: 0.7 }} />
                          {transaction.orderId}
                        </Box>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        color={transaction.amount < 0 ? 'error.main' : transaction.amount > 0 ? 'success.main' : 'text.secondary'}
                        fontWeight="medium"
                      >
                        ${Math.abs(transaction.amount).toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" color="primary.main" fontWeight="medium">
                        {transaction.pointsEarned > 0 ? `+${transaction.pointsEarned}` : transaction.pointsEarned}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" color="secondary.main" fontWeight="medium">
                        {transaction.pointsRedeemed > 0 ? `-${transaction.pointsRedeemed}` : 0}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: '150px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {transaction.notes || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Edit Transaction">
                          <IconButton
                            size="small"
                            onClick={() => onEdit(transaction)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Transaction">
                          <IconButton
                            size="small"
                            onClick={() => onDelete(transaction.id)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            {filteredTransactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={selectedCustomerId ? 8 : 9} align="center">
                  <Typography variant="body1" py={2}>
                    No transactions found.
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
        count={filteredTransactions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default CustomerTransactionList; 