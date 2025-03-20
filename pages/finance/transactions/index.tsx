import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    Button,
    IconButton,
    Chip,
    MenuItem,
    Menu,
    InputAdornment,
    Divider,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TableSortLabel,
    Tooltip,
    alpha,
    ListItemIcon
} from '@mui/material';
import { 
    Add as AddIcon,
    Search as SearchIcon,
    FilterList as FilterListIcon,
    MoreVert as MoreVertIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Download as DownloadIcon,
    Print as PrintIcon,
    ArrowCircleUp as IncomeIcon,
    ArrowCircleDown as ExpenseIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';

// Mock data import - would be replaced by actual API call
import transactionsData from '../../../data/finance/transactions.json';

interface Transaction {
    id: string;
    date: string;
    description: string;
    category: string;
    subcategory?: string;
    type: 'income' | 'expense';
    amount: number;
    account: string;
    referenceId?: string;
    notes?: string;
}

type Order = 'asc' | 'desc';

interface HeadCell {
    id: keyof Transaction;
    label: string;
    numeric: boolean;
    disablePadding: boolean;
}

const headCells: HeadCell[] = [
    { id: 'date', label: 'Date', numeric: false, disablePadding: false },
    { id: 'description', label: 'Description', numeric: false, disablePadding: false },
    { id: 'category', label: 'Category', numeric: false, disablePadding: false },
    { id: 'account', label: 'Account', numeric: false, disablePadding: false },
    { id: 'type', label: 'Type', numeric: false, disablePadding: false },
    { id: 'amount', label: 'Amount', numeric: true, disablePadding: false },
];

const TransactionsPage: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [selectedType, setSelectedType] = useState<string>('all');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
    const [order, setOrder] = useState<Order>('desc');
    const [orderBy, setOrderBy] = useState<keyof Transaction>('date');
    const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    // Load and process transactions
    useEffect(() => {
        try {
            // In real application, this would be an API call
            const loadedTransactions = transactionsData as Transaction[];
            setTransactions(loadedTransactions);
            setLoading(false);
        } catch (error) {
            console.error('Error loading transactions:', error);
            setLoading(false);
        }
    }, []);

    // Get unique categories from transactions
    const categories = React.useMemo(() => {
        const uniqueCategories = new Set<string>();
        transactions.forEach(transaction => {
            uniqueCategories.add(transaction.category);
        });
        return Array.from(uniqueCategories);
    }, [transactions]);

    // Get unique accounts from transactions
    const accounts = React.useMemo(() => {
        const uniqueAccounts = new Set<string>();
        transactions.forEach(transaction => {
            uniqueAccounts.add(transaction.account);
        });
        return Array.from(uniqueAccounts);
    }, [transactions]);

    // Filter and sort functions
    const filteredTransactions = React.useMemo(() => {
        return transactions
            .filter(transaction => {
                // Apply search filter
                const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    transaction.account.toLowerCase().includes(searchTerm.toLowerCase());
                
                // Apply date filter
                const transactionDate = new Date(transaction.date);
                const afterStartDate = startDate ? transactionDate >= startDate : true;
                const beforeEndDate = endDate ? transactionDate <= endDate : true;
                
                // Apply type filter
                const matchesType = selectedType === 'all' || transaction.type === selectedType;
                
                // Apply category filter
                const matchesCategory = selectedCategories.length === 0 || 
                    selectedCategories.includes(transaction.category);
                
                // Apply account filter
                const matchesAccount = selectedAccounts.length === 0 || 
                    selectedAccounts.includes(transaction.account);
                
                return matchesSearch && afterStartDate && beforeEndDate && 
                       matchesType && matchesCategory && matchesAccount;
            })
            .sort((a, b) => {
                const isAsc = order === 'asc';
                if (orderBy === 'date') {
                    return isAsc 
                        ? new Date(a.date).getTime() - new Date(b.date).getTime()
                        : new Date(b.date).getTime() - new Date(a.date).getTime();
                } else if (orderBy === 'amount') {
                    return isAsc 
                        ? a.amount - b.amount
                        : b.amount - a.amount;
                } else {
                    const aValue = a[orderBy]?.toString() || '';
                    const bValue = b[orderBy]?.toString() || '';
                    return isAsc
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue);
                }
            });
    }, [transactions, searchTerm, startDate, endDate, selectedType, selectedCategories, selectedAccounts, order, orderBy]);

    // Pagination handlers
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Sorting handlers
    const handleRequestSort = (property: keyof Transaction) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // Filter handlers
    const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
        setFilterAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setFilterAnchorEl(null);
    };

    const handleClearFilters = () => {
        setStartDate(null);
        setEndDate(null);
        setSelectedType('all');
        setSelectedCategories([]);
        setSelectedAccounts([]);
        setFilterAnchorEl(null);
    };

    const handleTypeFilter = (type: string) => {
        setSelectedType(type);
    };

    const handleCategoryToggle = (category: string) => {
        setSelectedCategories(prev => 
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const handleAccountToggle = (account: string) => {
        setSelectedAccounts(prev => 
            prev.includes(account)
                ? prev.filter(a => a !== account)
                : [...prev, account]
        );
    };

    // Action menu handlers
    const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>, transactionId: string) => {
        setActionMenuAnchorEl(event.currentTarget);
        setSelectedTransaction(transactionId);
    };

    const handleActionMenuClose = () => {
        setActionMenuAnchorEl(null);
        setSelectedTransaction(null);
    };

    const handleViewDetails = () => {
        setDetailsOpen(true);
        handleActionMenuClose();
    };

    const handleEditTransaction = () => {
        // Implement edit functionality
        console.log('Edit transaction:', selectedTransaction);
        handleActionMenuClose();
    };

    const handleDeleteTransaction = () => {
        // Implement delete functionality
        console.log('Delete transaction:', selectedTransaction);
        handleActionMenuClose();
    };

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    // Get the selected transaction details
    const selectedTransactionDetails = transactions.find(t => t.id === selectedTransaction);

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom component="div">
                Transactions
            </Typography>
            <Box sx={{ display: 'flex', mb: 3, justifyContent: 'space-between' }}>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                    <TextField
                        label="Search transactions"
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button 
                        variant="outlined"
                        onClick={handleFilterClick}
                        startIcon={<FilterListIcon />}
                        color={startDate || endDate || selectedType !== 'all' || 
                            selectedCategories.length > 0 || selectedAccounts.length > 0 
                            ? 'primary' : 'inherit'}
                    >
                        Filters
                        {(startDate || endDate || selectedType !== 'all' || 
                          selectedCategories.length > 0 || selectedAccounts.length > 0) && (
                            <Chip 
                                label={
                                    startDate || endDate || selectedType !== 'all' || 
                                    selectedCategories.length > 0 || selectedAccounts.length > 0 
                                    ? 'Active' : ''
                                }
                                size="small" 
                                color="primary"
                                sx={{ ml: 1 }}
                            />
                        )}
                    </Button>
                </Stack>
                <Stack direction="row" spacing={2}>
                    <Button 
                        variant="outlined" 
                        startIcon={<DownloadIcon />}
                    >
                        Export
                    </Button>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        startIcon={<AddIcon />}
                    >
                        New Transaction
                    </Button>
                </Stack>
            </Box>

            {/* Filter menu */}
            <Menu
                anchorEl={filterAnchorEl}
                open={Boolean(filterAnchorEl)}
                onClose={handleFilterClose}
                PaperProps={{
                    sx: { 
                        width: 320,
                        maxHeight: 500,
                        p: 2
                    },
                }}
            >
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>Filters</Typography>
                
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>Date Range</Typography>
                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                        <DatePicker 
                            label="From"
                            value={startDate}
                            onChange={setStartDate}
                            slotProps={{ textField: { size: 'small', fullWidth: true } }}
                        />
                        <DatePicker 
                            label="To"
                            value={endDate}
                            onChange={setEndDate}
                            slotProps={{ textField: { size: 'small', fullWidth: true } }}
                        />
                    </Stack>
                </LocalizationProvider>
                
                <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>Transaction Type</Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip 
                        label="All" 
                        onClick={() => handleTypeFilter('all')}
                        color={selectedType === 'all' ? 'primary' : 'default'}
                        variant={selectedType === 'all' ? 'filled' : 'outlined'}
                    />
                    <Chip 
                        label="Income" 
                        onClick={() => handleTypeFilter('income')}
                        color={selectedType === 'income' ? 'primary' : 'default'}
                        variant={selectedType === 'income' ? 'filled' : 'outlined'}
                    />
                    <Chip 
                        label="Expense" 
                        onClick={() => handleTypeFilter('expense')}
                        color={selectedType === 'expense' ? 'primary' : 'default'}
                        variant={selectedType === 'expense' ? 'filled' : 'outlined'}
                    />
                </Stack>
                
                <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>Categories</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {categories.map((category) => (
                        <Chip 
                            key={category}
                            label={category} 
                            onClick={() => handleCategoryToggle(category)}
                            color={selectedCategories.includes(category) ? 'primary' : 'default'}
                            variant={selectedCategories.includes(category) ? 'filled' : 'outlined'}
                            size="small"
                        />
                    ))}
                </Box>
                
                <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>Accounts</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {accounts.map((account) => (
                        <Chip 
                            key={account}
                            label={account} 
                            onClick={() => handleAccountToggle(account)}
                            color={selectedAccounts.includes(account) ? 'primary' : 'default'}
                            variant={selectedAccounts.includes(account) ? 'filled' : 'outlined'}
                            size="small"
                        />
                    ))}
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button onClick={handleClearFilters} sx={{ mr: 1 }}>
                        Clear All
                    </Button>
                    <Button onClick={handleFilterClose} variant="contained">
                        Apply
                    </Button>
                </Box>
            </Menu>

            <Paper elevation={1}>
                <TableContainer>
                    <Table sx={{ minWidth: 650 }} aria-label="transactions table">
                        <TableHead>
                            <TableRow>
                                {headCells.map((headCell) => (
                                    <TableCell
                                        key={headCell.id}
                                        align={headCell.numeric ? 'right' : 'left'}
                                        sortDirection={orderBy === headCell.id ? order : false}
                                    >
                                        <TableSortLabel
                                            active={orderBy === headCell.id}
                                            direction={orderBy === headCell.id ? order : 'asc'}
                                            onClick={() => handleRequestSort(headCell.id)}
                                        >
                                            {headCell.label}
                                        </TableSortLabel>
                                    </TableCell>
                                ))}
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        Loading transactions...
                                    </TableCell>
                                </TableRow>
                            ) : filteredTransactions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        No transactions found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredTransactions
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((transaction) => (
                                        <TableRow
                                            key={transaction.id}
                                            hover
                                            onClick={() => {}}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell>
                                                {format(new Date(transaction.date), 'MMM dd, yyyy')}
                                            </TableCell>
                                            <TableCell>{transaction.description}</TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={transaction.category} 
                                                    size="small" 
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell>{transaction.account}</TableCell>
                                            <TableCell>
                                                <Chip 
                                                    icon={transaction.type === 'income' ? <IncomeIcon /> : <ExpenseIcon />}
                                                    label={transaction.type === 'income' ? 'Income' : 'Expense'} 
                                                    size="small"
                                                    color={transaction.type === 'income' ? 'success' : 'error'}
                                                    variant="filled"
                                                    sx={{ 
                                                        bgcolor: transaction.type === 'income' 
                                                            ? (theme) => alpha(theme.palette.success.main, 0.2)
                                                            : (theme) => alpha(theme.palette.error.main, 0.2),
                                                        color: transaction.type === 'income' 
                                                            ? 'success.main' 
                                                            : 'error.main'
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="right" sx={{ 
                                                color: transaction.type === 'income' ? 'success.main' : 'error.main',
                                                fontWeight: 'medium'
                                            }}>
                                                {formatCurrency(transaction.amount)}
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    size="small"
                                                    onClick={(event) => handleActionMenuOpen(event, transaction.id)}
                                                >
                                                    <MoreVertIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
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
            </Paper>

            {/* Action Menu */}
            <Menu
                anchorEl={actionMenuAnchorEl}
                open={Boolean(actionMenuAnchorEl)}
                onClose={handleActionMenuClose}
            >
                <MenuItem onClick={handleViewDetails}>
                    <ListItemIcon>
                        <SearchIcon fontSize="small" />
                    </ListItemIcon>
                    View Details
                </MenuItem>
                <MenuItem onClick={handleEditTransaction}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    Edit
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleDeleteTransaction} sx={{ color: 'error.main' }}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    Delete
                </MenuItem>
            </Menu>

            {/* Transaction Details Dialog */}
            <Dialog
                open={detailsOpen}
                onClose={() => setDetailsOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Transaction Details
                    <IconButton
                        aria-label="close"
                        onClick={() => setDetailsOpen(false)}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedTransactionDetails && (
                        <Stack spacing={2}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Date</Typography>
                                <Typography variant="body1">
                                    {format(new Date(selectedTransactionDetails.date), 'MMMM dd, yyyy')}
                                </Typography>
                            </Box>
                            <Divider />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Description</Typography>
                                <Typography variant="body1">{selectedTransactionDetails.description}</Typography>
                            </Box>
                            <Divider />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Amount</Typography>
                                <Typography 
                                    variant="body1" 
                                    sx={{ 
                                        fontWeight: 'bold',
                                        color: selectedTransactionDetails.type === 'income' ? 'success.main' : 'error.main'
                                    }}
                                >
                                    {formatCurrency(selectedTransactionDetails.amount)}
                                </Typography>
                            </Box>
                            <Divider />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Type</Typography>
                                <Chip 
                                    label={selectedTransactionDetails.type === 'income' ? 'Income' : 'Expense'} 
                                    size="small"
                                    color={selectedTransactionDetails.type === 'income' ? 'success' : 'error'}
                                    variant="filled"
                                />
                            </Box>
                            <Divider />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Category</Typography>
                                <Typography variant="body1">{selectedTransactionDetails.category}</Typography>
                            </Box>
                            {selectedTransactionDetails.subcategory && (
                                <>
                                    <Divider />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" color="text.secondary">Subcategory</Typography>
                                        <Typography variant="body1">{selectedTransactionDetails.subcategory}</Typography>
                                    </Box>
                                </>
                            )}
                            <Divider />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Account</Typography>
                                <Typography variant="body1">{selectedTransactionDetails.account}</Typography>
                            </Box>
                            {selectedTransactionDetails.referenceId && (
                                <>
                                    <Divider />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" color="text.secondary">Reference ID</Typography>
                                        <Typography variant="body1">{selectedTransactionDetails.referenceId}</Typography>
                                    </Box>
                                </>
                            )}
                            {selectedTransactionDetails.notes && (
                                <>
                                    <Divider />
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Notes</Typography>
                                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                            {selectedTransactionDetails.notes}
                                        </Typography>
                                    </Box>
                                </>
                            )}
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleEditTransaction()} startIcon={<EditIcon />}>
                        Edit
                    </Button>
                    <Button 
                        onClick={() => setDetailsOpen(false)} 
                        variant="contained"
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TransactionsPage; 