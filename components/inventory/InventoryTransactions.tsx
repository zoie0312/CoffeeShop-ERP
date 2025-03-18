import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Tune as TuneIcon
} from '@mui/icons-material';
import { InventoryTransaction, InventoryItem } from '@/types';
import { useTheme } from '@mui/material/styles';

interface InventoryTransactionsProps {
  transactions: InventoryTransaction[];
  inventory: InventoryItem[];
  onAddTransaction?: () => void;
}

const InventoryTransactions: React.FC<InventoryTransactionsProps> = ({
  transactions,
  inventory,
  onAddTransaction
}) => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];
    
    // Apply type filter
    if (filterType !== 'all') {
      result = result.filter(transaction => transaction.type === filterType);
    }
    
    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(transaction => {
        const item = inventory.find(i => i.id === transaction.inventoryId);
        const itemName = item ? item.name.toLowerCase() : '';
        
        return (
          transaction.id.toLowerCase().includes(search) ||
          itemName.includes(search) ||
          transaction.notes?.toLowerCase().includes(search) ||
          transaction.invoiceNumber?.toLowerCase().includes(search)
        );
      });
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'id':
          comparison = a.id.localeCompare(b.id);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'amount':
          comparison = Math.abs(a.totalCost) - Math.abs(b.totalCost);
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [transactions, inventory, filterType, searchTerm, sortBy, sortDirection]);

  // Handle pagination
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle sort
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
  };

  // Get inventory item name
  const getItemName = (inventoryId: string) => {
    const item = inventory.find(i => i.id === inventoryId);
    return item ? item.name : 'Unknown Item';
  };

  // Format transaction type
  const getTransactionTypeInfo = (type: string) => {
    switch (type) {
      case 'restock':
        return {
          color: 'success',
          icon: <AddIcon fontSize="small" />,
          label: 'Restock'
        };
      case 'usage':
        return {
          color: 'primary',
          icon: <RemoveIcon fontSize="small" />,
          label: 'Usage'
        };
      case 'adjustment':
        return {
          color: 'warning',
          icon: <TuneIcon fontSize="small" />,
          label: 'Adjustment'
        };
      case 'write-off':
        return {
          color: 'error',
          icon: <RemoveIcon fontSize="small" />,
          label: 'Write-off'
        };
      default:
        return {
          color: 'default',
          icon: null,
          label: type
        };
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Card>
      <CardHeader 
        title="Inventory Transactions" 
        action={
          onAddTransaction && (
            <IconButton 
              color="primary"
              onClick={onAddTransaction}
              title="Record New Transaction"
            >
              <AddIcon />
            </IconButton>
          )
        }
      />
      
      <Box sx={{ px: 3, pb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              placeholder="Search transactions..."
              variant="outlined"
              size="small"
              fullWidth
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="filter-type-label">Transaction Type</InputLabel>
              <Select
                labelId="filter-type-label"
                value={filterType}
                label="Transaction Type"
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="restock">Restock</MenuItem>
                <MenuItem value="usage">Usage</MenuItem>
                <MenuItem value="adjustment">Adjustment</MenuItem>
                <MenuItem value="write-off">Write-off</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      
      <CardContent sx={{ p: 0 }}>
        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
          <Table sx={{ minWidth: 650 }} aria-label="inventory transactions table">
            <TableHead>
              <TableRow>
                <TableCell 
                  onClick={() => handleSort('date')}
                  sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Date
                    {sortBy === 'date' && (
                      sortDirection === 'asc' ? <ArrowUpIcon fontSize="small" /> : <ArrowDownIcon fontSize="small" />
                    )}
                  </Box>
                </TableCell>
                <TableCell 
                  onClick={() => handleSort('id')}
                  sx={{ cursor: 'pointer' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    ID
                    {sortBy === 'id' && (
                      sortDirection === 'asc' ? <ArrowUpIcon fontSize="small" /> : <ArrowDownIcon fontSize="small" />
                    )}
                  </Box>
                </TableCell>
                <TableCell>Item</TableCell>
                <TableCell 
                  onClick={() => handleSort('type')}
                  sx={{ cursor: 'pointer' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Type
                    {sortBy === 'type' && (
                      sortDirection === 'asc' ? <ArrowUpIcon fontSize="small" /> : <ArrowDownIcon fontSize="small" />
                    )}
                  </Box>
                </TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell 
                  onClick={() => handleSort('amount')}
                  sx={{ cursor: 'pointer', textAlign: 'right' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    Amount
                    {sortBy === 'amount' && (
                      sortDirection === 'asc' ? <ArrowUpIcon fontSize="small" /> : <ArrowDownIcon fontSize="small" />
                    )}
                  </Box>
                </TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((transaction) => {
                  const typeInfo = getTransactionTypeInfo(transaction.type);
                  const item = inventory.find(i => i.id === transaction.inventoryId);
                  
                  return (
                    <TableRow key={transaction.id} hover>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell>{transaction.id}</TableCell>
                      <TableCell>{getItemName(transaction.inventoryId)}</TableCell>
                      <TableCell>
                        <Chip
                          label={typeInfo.label}
                          color={typeInfo.color as any}
                          size="small"
                          {...(typeInfo.icon ? { icon: typeInfo.icon } : {})}
                        />
                      </TableCell>
                      <TableCell>
                        {transaction.quantity} {item?.unit}
                      </TableCell>
                      <TableCell align="right" sx={{ 
                        color: transaction.totalCost >= 0 
                          ? theme.palette.success.main 
                          : theme.palette.error.main,
                        fontWeight: 'bold'
                      }}>
                        {transaction.totalCost >= 0 ? '+' : ''}${Math.abs(transaction.totalCost).toFixed(2)}
                      </TableCell>
                      <TableCell>{transaction.notes || '-'}</TableCell>
                    </TableRow>
                  );
                })}
              {filteredTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No transactions found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredTransactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </CardContent>
    </Card>
  );
};

export default InventoryTransactions; 