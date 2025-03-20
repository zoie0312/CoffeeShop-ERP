import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Paper,
    Card,
    CardContent,
    CardActions,
    Button,
    IconButton,
    Chip,
    TextField,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Menu,
    Divider,
    Stack,
    Alert
} from '@mui/material';
import {
    AccountBalance as AccountIcon,
    CreditCard as CreditCardIcon,
    Savings as SavingsIcon,
    MonetizationOn as CashIcon,
    ReceiptLong as LoanIcon,
    Add as AddIcon,
    Search as SearchIcon,
    MoreVert as MoreVertIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    LinkOff as DisconnectIcon,
    Refresh as RefreshIcon,
    ArrowUpward as TransferOutIcon,
    ArrowDownward as TransferInIcon,
    Visibility as ViewIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

// Mock data import - would be replaced by actual API call
import accountsData from '../../../data/finance/financial-accounts.json';

interface FinancialAccount {
    id: string;
    name: string;
    type: 'checking' | 'savings' | 'credit' | 'loan' | 'cash';
    institution: string;
    accountNumber: string;
    currency: string;
    balance: number;
    lastUpdated: string;
    isActive: boolean;
    creditLimit?: number;
    interestRate?: number;
    paymentAmount?: number;
    paymentFrequency?: string;
    maturityDate?: string;
}

const AccountsPage: React.FC = () => {
    const [accounts, setAccounts] = useState<FinancialAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [newAccountOpen, setNewAccountOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
    const [accountDetailsOpen, setAccountDetailsOpen] = useState(false);
    const [accountMenuAnchorEl, setAccountMenuAnchorEl] = useState<null | HTMLElement>(null);

    // Load accounts
    useEffect(() => {
        try {
            // In real application, this would be an API call
            const loadedAccounts = accountsData as FinancialAccount[];
            setAccounts(loadedAccounts);
            setLoading(false);
        } catch (error) {
            console.error('Error loading accounts:', error);
            setLoading(false);
        }
    }, []);

    // Filter accounts
    const filteredAccounts = React.useMemo(() => {
        return accounts.filter(account => {
            const matchesSearch = 
                account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                account.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
                account.type.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesType = selectedType === 'all' || account.type === selectedType;
            
            return matchesSearch && matchesType;
        });
    }, [accounts, searchTerm, selectedType]);

    // Account menu handlers
    const handleAccountMenuOpen = (event: React.MouseEvent<HTMLElement>, accountId: string) => {
        event.stopPropagation();
        setAccountMenuAnchorEl(event.currentTarget);
        setSelectedAccount(accountId);
    };

    const handleAccountMenuClose = () => {
        setAccountMenuAnchorEl(null);
        setSelectedAccount(null);
    };

    const handleViewAccountDetails = (accountId: string) => {
        setSelectedAccount(accountId);
        setAccountDetailsOpen(true);
        handleAccountMenuClose();
    };

    const handleEditAccount = () => {
        // Implement edit functionality
        console.log('Edit account:', selectedAccount);
        handleAccountMenuClose();
    };

    const handleDeleteAccount = () => {
        // Implement delete functionality
        console.log('Delete account:', selectedAccount);
        handleAccountMenuClose();
    };

    const handleCloseAccountDetails = () => {
        setAccountDetailsOpen(false);
        setSelectedAccount(null);
    };

    // Type filter handlers
    const handleTypeFilter = (type: string) => {
        setSelectedType(type);
    };

    // Format currency
    const formatCurrency = (amount: number, currency: string = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    // Get account icon based on type
    const getAccountIcon = (type: string) => {
        switch (type) {
            case 'checking':
                return <AccountIcon />;
            case 'savings':
                return <SavingsIcon />;
            case 'credit':
                return <CreditCardIcon />;
            case 'loan':
                return <LoanIcon />;
            case 'cash':
                return <CashIcon />;
            default:
                return <AccountIcon />;
        }
    };

    // Get account type label
    const getAccountTypeLabel = (type: string) => {
        switch (type) {
            case 'checking':
                return 'Checking';
            case 'savings':
                return 'Savings';
            case 'credit':
                return 'Credit Card';
            case 'loan':
                return 'Loan';
            case 'cash':
                return 'Cash';
            default:
                return type.charAt(0).toUpperCase() + type.slice(1);
        }
    };

    // Get color based on account type
    const getAccountColor = (type: string) => {
        switch (type) {
            case 'checking':
                return 'primary';
            case 'savings':
                return 'success';
            case 'credit':
                return 'secondary';
            case 'loan':
                return 'error';
            case 'cash':
                return 'warning';
            default:
                return 'default';
        }
    };

    // Calculate total assets, liabilities and net worth
    const totalAssets = accounts
        .filter(account => account.balance > 0)
        .reduce((sum, account) => sum + account.balance, 0);

    const totalLiabilities = accounts
        .filter(account => account.balance < 0)
        .reduce((sum, account) => sum + Math.abs(account.balance), 0);

    const netWorth = totalAssets - totalLiabilities;

    // Get the selected account
    const accountDetails = accounts.find(a => a.id === selectedAccount);

    return (
        <Box sx={{ padding: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Accounts
                </Typography>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    onClick={() => setNewAccountOpen(true)}
                >
                    Add Account
                </Button>
            </Box>
            
            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <Paper elevation={1} sx={{ p: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">Total Assets</Typography>
                        <Typography variant="h4" sx={{ color: 'success.main', fontWeight: 'bold', my: 1 }}>
                            {formatCurrency(totalAssets)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Last updated: {format(new Date(), 'MMM dd, yyyy')}
                        </Typography>
                    </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                    <Paper elevation={1} sx={{ p: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">Total Liabilities</Typography>
                        <Typography variant="h4" sx={{ color: 'error.main', fontWeight: 'bold', my: 1 }}>
                            {formatCurrency(totalLiabilities)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Last updated: {format(new Date(), 'MMM dd, yyyy')}
                        </Typography>
                    </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                    <Paper elevation={1} sx={{ p: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">Net Worth</Typography>
                        <Typography variant="h4" sx={{ 
                            color: netWorth >= 0 ? 'success.main' : 'error.main', 
                            fontWeight: 'bold',
                            my: 1 
                        }}>
                            {formatCurrency(netWorth)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Last updated: {format(new Date(), 'MMM dd, yyyy')}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Filters and Search */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                    <Chip 
                        label="All Accounts" 
                        onClick={() => handleTypeFilter('all')}
                        color={selectedType === 'all' ? 'primary' : 'default'}
                        variant={selectedType === 'all' ? 'filled' : 'outlined'}
                    />
                    <Chip 
                        label="Checking" 
                        onClick={() => handleTypeFilter('checking')}
                        color={selectedType === 'checking' ? 'primary' : 'default'}
                        variant={selectedType === 'checking' ? 'filled' : 'outlined'}
                        icon={<AccountIcon />}
                    />
                    <Chip 
                        label="Savings" 
                        onClick={() => handleTypeFilter('savings')}
                        color={selectedType === 'savings' ? 'primary' : 'default'}
                        variant={selectedType === 'savings' ? 'filled' : 'outlined'}
                        icon={<SavingsIcon />}
                    />
                    <Chip 
                        label="Credit Cards" 
                        onClick={() => handleTypeFilter('credit')}
                        color={selectedType === 'credit' ? 'primary' : 'default'}
                        variant={selectedType === 'credit' ? 'filled' : 'outlined'}
                        icon={<CreditCardIcon />}
                    />
                    <Chip 
                        label="Loans" 
                        onClick={() => handleTypeFilter('loan')}
                        color={selectedType === 'loan' ? 'primary' : 'default'}
                        variant={selectedType === 'loan' ? 'filled' : 'outlined'}
                        icon={<LoanIcon />}
                    />
                    <Chip 
                        label="Cash" 
                        onClick={() => handleTypeFilter('cash')}
                        color={selectedType === 'cash' ? 'primary' : 'default'}
                        variant={selectedType === 'cash' ? 'filled' : 'outlined'}
                        icon={<CashIcon />}
                    />
                </Stack>
                
                <TextField
                    label="Search accounts"
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
            </Box>

            {/* Account Cards */}
            {loading ? (
                <Typography>Loading accounts...</Typography>
            ) : filteredAccounts.length === 0 ? (
                <Alert severity="info">No accounts match your search criteria.</Alert>
            ) : (
                <Grid container spacing={3}>
                    {filteredAccounts.map((account) => (
                        <Grid item xs={12} sm={6} md={4} key={account.id}>
                            <Card 
                                elevation={2} 
                                sx={{ 
                                    height: '100%', 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    '&:hover': { boxShadow: 6 },
                                    position: 'relative',
                                    cursor: 'pointer'
                                }}
                                onClick={() => handleViewAccountDetails(account.id)}
                            >
                                <Box 
                                    sx={{ 
                                        p: 2, 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        bgcolor: `${getAccountColor(account.type)}.light`,
                                        color: `${getAccountColor(account.type)}.dark`
                                    }}
                                >
                                    <Box sx={{ mr: 1 }}>
                                        {getAccountIcon(account.type)}
                                    </Box>
                                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                        {account.name}
                                    </Typography>
                                    <IconButton 
                                        size="small" 
                                        onClick={(e) => handleAccountMenuOpen(e, account.id)}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                </Box>
                                
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box sx={{ mb: 2 }}>
                                        <Chip 
                                            label={getAccountTypeLabel(account.type)} 
                                            size="small"
                                            color={getAccountColor(account.type) as any}
                                            variant="outlined"
                                            icon={getAccountIcon(account.type)}
                                        />
                                        {!account.isActive && (
                                            <Chip 
                                                label="Inactive" 
                                                size="small"
                                                color="default"
                                                sx={{ ml: 1 }}
                                            />
                                        )}
                                    </Box>
                                    
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {account.institution}
                                    </Typography>
                                    
                                    <Typography variant="body2" gutterBottom>
                                        Account: {account.accountNumber}
                                    </Typography>
                                    
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Balance
                                        </Typography>
                                        <Typography 
                                            variant="h5"
                                            sx={{ 
                                                color: account.balance >= 0 ? 'success.main' : 'error.main',
                                                fontWeight: 'medium'
                                            }}
                                        >
                                            {formatCurrency(account.balance, account.currency)}
                                        </Typography>
                                    </Box>
                                    
                                    {account.type === 'credit' && account.creditLimit && (
                                        <Box sx={{ mt: 1 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Credit Limit: {formatCurrency(account.creditLimit, account.currency)}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Available: {formatCurrency(account.creditLimit - Math.abs(account.balance), account.currency)}
                                            </Typography>
                                        </Box>
                                    )}
                                    
                                    {account.type === 'loan' && account.interestRate && (
                                        <Box sx={{ mt: 1 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Interest Rate: {account.interestRate}%
                                            </Typography>
                                            {account.paymentAmount && account.paymentFrequency && (
                                                <Typography variant="body2" color="text.secondary">
                                                    Payment: {formatCurrency(account.paymentAmount, account.currency)} {account.paymentFrequency}
                                                </Typography>
                                            )}
                                        </Box>
                                    )}
                                </CardContent>
                                
                                <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Last updated: {format(new Date(account.lastUpdated), 'MMM dd, yyyy')}
                                    </Typography>
                                    <Button size="small" onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewAccountDetails(account.id);
                                    }}>
                                        View Details
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Account Actions Menu */}
            <Menu
                anchorEl={accountMenuAnchorEl}
                open={Boolean(accountMenuAnchorEl)}
                onClose={handleAccountMenuClose}
            >
                <MenuItem onClick={() => {
                    if (selectedAccount) handleViewAccountDetails(selectedAccount);
                }}>
                    <ListItemIcon>
                        <ViewIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>View Details</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleEditAccount}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <RefreshIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Refresh Balance</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem>
                    <ListItemIcon>
                        <TransferOutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Transfer From</ListItemText>
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <TransferInIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Transfer To</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleDeleteAccount} sx={{ color: 'error.main' }}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
                <MenuItem sx={{ color: 'text.secondary' }}>
                    <ListItemIcon>
                        <DisconnectIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Disconnect</ListItemText>
                </MenuItem>
            </Menu>

            {/* Account Details Dialog */}
            <Dialog
                open={accountDetailsOpen}
                onClose={handleCloseAccountDetails}
                maxWidth="md"
                fullWidth
            >
                {accountDetails && (
                    <>
                        <DialogTitle sx={{ 
                            bgcolor: `${getAccountColor(accountDetails.type)}.light`,
                            color: `${getAccountColor(accountDetails.type)}.dark`,
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            {getAccountIcon(accountDetails.type)}
                            <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
                                {accountDetails.name}
                            </Typography>
                            <IconButton onClick={handleCloseAccountDetails}>
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent dividers>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={2}>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Account Type
                                            </Typography>
                                            <Chip 
                                                label={getAccountTypeLabel(accountDetails.type)} 
                                                size="small"
                                                color={getAccountColor(accountDetails.type) as any}
                                                icon={getAccountIcon(accountDetails.type)}
                                            />
                                        </Box>
                                        
                                        <Box>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Financial Institution
                                            </Typography>
                                            <Typography variant="body1">
                                                {accountDetails.institution}
                                            </Typography>
                                        </Box>
                                        
                                        <Box>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Account Number
                                            </Typography>
                                            <Typography variant="body1">
                                                {accountDetails.accountNumber}
                                            </Typography>
                                        </Box>
                                        
                                        <Box>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Status
                                            </Typography>
                                            <Chip 
                                                label={accountDetails.isActive ? 'Active' : 'Inactive'}
                                                color={accountDetails.isActive ? 'success' : 'default'}
                                                size="small"
                                            />
                                        </Box>
                                        
                                        <Box>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Last Updated
                                            </Typography>
                                            <Typography variant="body1">
                                                {format(new Date(accountDetails.lastUpdated), 'MMMM dd, yyyy')}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={2}>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Current Balance
                                            </Typography>
                                            <Typography 
                                                variant="h4"
                                                sx={{ 
                                                    color: accountDetails.balance >= 0 ? 'success.main' : 'error.main',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {formatCurrency(accountDetails.balance, accountDetails.currency)}
                                            </Typography>
                                        </Box>
                                        
                                        {accountDetails.type === 'credit' && accountDetails.creditLimit && (
                                            <>
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                                        Credit Limit
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {formatCurrency(accountDetails.creditLimit, accountDetails.currency)}
                                                    </Typography>
                                                </Box>
                                                
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                                        Available Credit
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {formatCurrency(accountDetails.creditLimit - Math.abs(accountDetails.balance), accountDetails.currency)}
                                                    </Typography>
                                                </Box>
                                                
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                                        Utilization
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {((Math.abs(accountDetails.balance) / accountDetails.creditLimit) * 100).toFixed(1)}%
                                                    </Typography>
                                                </Box>
                                            </>
                                        )}
                                        
                                        {accountDetails.type === 'loan' && (
                                            <>
                                                {accountDetails.interestRate && (
                                                    <Box>
                                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                                            Interest Rate
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {accountDetails.interestRate}%
                                                        </Typography>
                                                    </Box>
                                                )}
                                                
                                                {accountDetails.paymentAmount && (
                                                    <Box>
                                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                                            Payment Amount
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {formatCurrency(accountDetails.paymentAmount, accountDetails.currency)} {accountDetails.paymentFrequency}
                                                        </Typography>
                                                    </Box>
                                                )}
                                                
                                                {accountDetails.maturityDate && (
                                                    <Box>
                                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                                            Maturity Date
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {format(new Date(accountDetails.maturityDate), 'MMMM dd, yyyy')}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </>
                                        )}
                                    </Stack>
                                </Grid>
                                
                                <Grid item xs={12} sx={{ mt: 2 }}>
                                    <Divider />
                                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                        Recent Transactions
                                    </Typography>
                                    <Alert severity="info">
                                        Transaction history view will be implemented here.
                                    </Alert>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions sx={{ p: 2 }}>
                            <Button 
                                startIcon={<RefreshIcon />}
                                variant="outlined"
                            >
                                Refresh Balance
                            </Button>
                            <Button 
                                startIcon={<EditIcon />}
                                variant="outlined"
                                onClick={handleEditAccount}
                            >
                                Edit Account
                            </Button>
                            <Button 
                                onClick={handleCloseAccountDetails} 
                                variant="contained"
                            >
                                Close
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* New Account Dialog */}
            <Dialog
                open={newAccountOpen}
                onClose={() => setNewAccountOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Add New Account
                    <IconButton
                        aria-label="close"
                        onClick={() => setNewAccountOpen(false)}
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
                    <Alert severity="info" sx={{ mb: 3 }}>
                        This is a placeholder for the new account form. In a real application, this would include fields for account details and integration options.
                    </Alert>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Account Name"
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel>Account Type</InputLabel>
                                <Select
                                    label="Account Type"
                                    value="checking"
                                >
                                    <MenuItem value="checking">Checking</MenuItem>
                                    <MenuItem value="savings">Savings</MenuItem>
                                    <MenuItem value="credit">Credit Card</MenuItem>
                                    <MenuItem value="loan">Loan</MenuItem>
                                    <MenuItem value="cash">Cash</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Financial Institution"
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Account Number"
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Current Balance"
                                fullWidth
                                required
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setNewAccountOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="contained">
                        Add Account
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AccountsPage; 