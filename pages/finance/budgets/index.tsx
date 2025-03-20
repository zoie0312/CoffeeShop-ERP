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
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Tab,
    Divider,
    Stack,
    Alert,
    Tooltip,
    Fab
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    FileCopy as DuplicateIcon,
    Archive as ArchiveIcon,
    CalendarToday as CalendarIcon,
    AttachMoney as MoneyIcon,
    CheckCircle as CheckCircleIcon,
    MoreVert as MoreVertIcon,
    Close as CloseIcon,
    ArrowUpward as IncreaseIcon,
    ArrowDownward as DecreaseIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, isAfter, isBefore, isWithinInterval } from 'date-fns';

// Mock data import - would be replaced by actual API call
import budgetsData from '../../../data/finance/budgets.json';

interface BudgetSubcategory {
    name: string;
    budgeted: number;
    actual: number;
}

interface BudgetCategory {
    category: string;
    budgeted: number;
    actual: number;
    variance: number;
    subcategories: BudgetSubcategory[];
}

interface Budget {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    status: 'active' | 'planned' | 'completed' | 'archived';
    createdBy: string;
    createdAt: string;
    categories: BudgetCategory[];
    notes?: string;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`budget-tabpanel-${index}`}
            aria-labelledby={`budget-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const BudgetsPage: React.FC = () => {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
    const [budgetDetailsOpen, setBudgetDetailsOpen] = useState(false);
    const [newBudgetOpen, setNewBudgetOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Load budgets
    useEffect(() => {
        try {
            // In real application, this would be an API call
            const loadedBudgets = budgetsData as Budget[];
            setBudgets(loadedBudgets);
            setLoading(false);
        } catch (error) {
            console.error('Error loading budgets:', error);
            setLoading(false);
        }
    }, []);

    // Active, planned, and past budgets
    const currentDate = new Date();
    
    const activeBudgets = budgets.filter(budget => 
        budget.status === 'active' && 
        isWithinInterval(currentDate, {
            start: new Date(budget.startDate),
            end: new Date(budget.endDate)
        })
    );
    
    const plannedBudgets = budgets.filter(budget => 
        budget.status === 'planned' || 
        (budget.status === 'active' && isAfter(new Date(budget.startDate), currentDate))
    );
    
    const pastBudgets = budgets.filter(budget => 
        budget.status === 'completed' || 
        (budget.status === 'active' && isBefore(new Date(budget.endDate), currentDate))
    );

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    // Calculate progress percentage
    const calculateProgress = (budget: Budget) => {
        const totalBudgeted = budget.categories.reduce((total, category) => total + category.budgeted, 0);
        const totalActual = budget.categories.reduce((total, category) => total + category.actual, 0);
        return Math.min(Math.round((totalActual / totalBudgeted) * 100), 100);
    };

    // Calculate total budget and actual
    const calculateTotals = (budget: Budget) => {
        const totalBudgeted = budget.categories.reduce((total, category) => total + category.budgeted, 0);
        const totalActual = budget.categories.reduce((total, category) => total + category.actual, 0);
        const totalVariance = totalActual - totalBudgeted;
        const percentSpent = totalBudgeted > 0 ? (totalActual / totalBudgeted) * 100 : 0;
        
        return { totalBudgeted, totalActual, totalVariance, percentSpent };
    };

    // Tab change handler
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Budget details handlers
    const handleViewBudgetDetails = (budgetId: string) => {
        setSelectedBudget(budgetId);
        setBudgetDetailsOpen(true);
    };

    const handleCloseBudgetDetails = () => {
        setBudgetDetailsOpen(false);
        setSelectedBudget(null);
    };

    // New budget handlers
    const handleNewBudget = () => {
        setNewBudgetOpen(true);
    };

    const handleCloseNewBudget = () => {
        setNewBudgetOpen(false);
    };

    // Edit budget handler
    const handleEditBudget = (budgetId: string) => {
        // Implement edit functionality
        console.log('Edit budget:', budgetId);
    };

    // Get selected budget details
    const budgetDetails = budgets.find(b => b.id === selectedBudget);

    // Render budget card
    const renderBudgetCard = (budget: Budget) => {
        const { totalBudgeted, totalActual, totalVariance, percentSpent } = calculateTotals(budget);
        const isOverBudget = totalVariance > 0;
        const progressColor = isOverBudget ? 'error' : percentSpent > 85 ? 'warning' : 'success';
        
        return (
            <Card 
                elevation={2} 
                sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    '&:hover': { boxShadow: 6 }
                }}
            >
                <Box 
                    sx={{ 
                        p: 2, 
                        bgcolor: budget.status === 'active' ? 'primary.light' : 
                            budget.status === 'planned' ? 'info.light' : 'grey.200',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <MoneyIcon sx={{ mr: 1 }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {budget.name}
                    </Typography>
                    <Chip 
                        label={budget.status.charAt(0).toUpperCase() + budget.status.slice(1)}
                        size="small"
                        color={budget.status === 'active' ? 'primary' : 
                            budget.status === 'planned' ? 'info' : 'default'}
                    />
                </Box>
                
                <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Period
                        </Typography>
                        <Typography variant="body1">
                            {format(new Date(budget.startDate), 'MMM dd, yyyy')} - {format(new Date(budget.endDate), 'MMM dd, yyyy')}
                        </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Budget Total
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
                            {formatCurrency(totalBudgeted)}
                        </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">
                                Progress ({percentSpent.toFixed(0)}%)
                            </Typography>
                            <Typography 
                                variant="body2" 
                                color={isOverBudget ? 'error.main' : 'success.main'}
                            >
                                {formatCurrency(totalActual)}
                            </Typography>
                        </Box>
                        <LinearProgress 
                            variant="determinate" 
                            value={Math.min(percentSpent, 100)}
                            color={progressColor}
                            sx={{ mt: 1, height: 8, borderRadius: 4 }}
                        />
                    </Box>
                    
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Variance
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            {isOverBudget ? (
                                <DecreaseIcon fontSize="small" color="error" />
                            ) : (
                                <IncreaseIcon fontSize="small" color="success" />
                            )}
                            <Typography 
                                variant="body1" 
                                sx={{ 
                                    color: isOverBudget ? 'error.main' : 'success.main',
                                    fontWeight: 'medium'
                                }}
                            >
                                {formatCurrency(Math.abs(totalVariance))} {isOverBudget ? 'over budget' : 'under budget'}
                            </Typography>
                        </Stack>
                    </Box>
                </CardContent>
                
                <CardActions>
                    <Button 
                        size="small" 
                        onClick={() => handleViewBudgetDetails(budget.id)}
                    >
                        View Details
                    </Button>
                    <Button 
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleEditBudget(budget.id)}
                    >
                        Edit
                    </Button>
                </CardActions>
            </Card>
        );
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Budgets
                </Typography>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    onClick={handleNewBudget}
                >
                    Create Budget
                </Button>
            </Box>
            
            {/* Budget Tab Navigation */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="budget tabs">
                    <Tab label={`Active Budgets (${activeBudgets.length})`} />
                    <Tab label={`Planned Budgets (${plannedBudgets.length})`} />
                    <Tab label={`Past Budgets (${pastBudgets.length})`} />
                </Tabs>
            </Box>
            
            {/* Active Budgets */}
            <TabPanel value={tabValue} index={0}>
                {loading ? (
                    <Typography>Loading budgets...</Typography>
                ) : activeBudgets.length === 0 ? (
                    <Alert 
                        severity="info"
                        action={
                            <Button color="inherit" size="small" onClick={handleNewBudget}>
                                Create Now
                            </Button>
                        }
                    >
                        No active budgets found. Create a new budget to get started.
                    </Alert>
                ) : (
                    <Grid container spacing={3}>
                        {activeBudgets.map((budget) => (
                            <Grid item xs={12} sm={6} md={4} key={budget.id}>
                                {renderBudgetCard(budget)}
                            </Grid>
                        ))}
                    </Grid>
                )}
            </TabPanel>
            
            {/* Planned Budgets */}
            <TabPanel value={tabValue} index={1}>
                {loading ? (
                    <Typography>Loading budgets...</Typography>
                ) : plannedBudgets.length === 0 ? (
                    <Alert 
                        severity="info"
                        action={
                            <Button color="inherit" size="small" onClick={handleNewBudget}>
                                Create Now
                            </Button>
                        }
                    >
                        No planned budgets found. Plan ahead by creating a future budget.
                    </Alert>
                ) : (
                    <Grid container spacing={3}>
                        {plannedBudgets.map((budget) => (
                            <Grid item xs={12} sm={6} md={4} key={budget.id}>
                                {renderBudgetCard(budget)}
                            </Grid>
                        ))}
                    </Grid>
                )}
            </TabPanel>
            
            {/* Past Budgets */}
            <TabPanel value={tabValue} index={2}>
                {loading ? (
                    <Typography>Loading budgets...</Typography>
                ) : pastBudgets.length === 0 ? (
                    <Alert severity="info">
                        No past budgets found.
                    </Alert>
                ) : (
                    <Grid container spacing={3}>
                        {pastBudgets.map((budget) => (
                            <Grid item xs={12} sm={6} md={4} key={budget.id}>
                                {renderBudgetCard(budget)}
                            </Grid>
                        ))}
                    </Grid>
                )}
            </TabPanel>
            
            {/* Fixed Action Button */}
            <Tooltip title="Create New Budget">
                <Fab 
                    color="primary" 
                    aria-label="add"
                    sx={{ position: 'fixed', bottom: 32, right: 32 }}
                    onClick={handleNewBudget}
                >
                    <AddIcon />
                </Fab>
            </Tooltip>
            
            {/* Budget Details Dialog */}
            <Dialog
                open={budgetDetailsOpen}
                onClose={handleCloseBudgetDetails}
                maxWidth="lg"
                fullWidth
            >
                {budgetDetails && (
                    <>
                        <DialogTitle sx={{ 
                            bgcolor: 'primary.light',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <MoneyIcon sx={{ mr: 1 }} />
                                <Typography variant="h6">
                                    {budgetDetails.name}
                                </Typography>
                                <Chip 
                                    label={budgetDetails.status.charAt(0).toUpperCase() + budgetDetails.status.slice(1)}
                                    size="small"
                                    color={budgetDetails.status === 'active' ? 'primary' : 
                                        budgetDetails.status === 'planned' ? 'info' : 'default'}
                                    sx={{ ml: 2 }}
                                />
                            </Box>
                            <IconButton onClick={handleCloseBudgetDetails}>
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent dividers>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    <Stack spacing={2}>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Budget Period
                                            </Typography>
                                            <Typography variant="body1">
                                                {format(new Date(budgetDetails.startDate), 'MMMM dd, yyyy')} - {format(new Date(budgetDetails.endDate), 'MMMM dd, yyyy')}
                                            </Typography>
                                        </Box>
                                        
                                        <Box>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Created By
                                            </Typography>
                                            <Typography variant="body1">
                                                {budgetDetails.createdBy} on {format(new Date(budgetDetails.createdAt), 'MMMM dd, yyyy')}
                                            </Typography>
                                        </Box>
                                        
                                        {budgetDetails.notes && (
                                            <Box>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    Notes
                                                </Typography>
                                                <Typography variant="body1">
                                                    {budgetDetails.notes}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Stack>
                                </Grid>
                                
                                <Grid item xs={12} md={8}>
                                    <Paper sx={{ p: 2, mb: 3 }}>
                                        {(() => {
                                            const { totalBudgeted, totalActual, totalVariance, percentSpent } = calculateTotals(budgetDetails);
                                            const isOverBudget = totalVariance > 0;
                                            const progressColor = isOverBudget ? 'error' : percentSpent > 85 ? 'warning' : 'success';
                                            
                                            return (
                                                <>
                                                    <Typography variant="h6" gutterBottom>
                                                        Budget Summary
                                                    </Typography>
                                                    <Grid container spacing={3}>
                                                        <Grid item xs={12} sm={4}>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Total Budgeted
                                                            </Typography>
                                                            <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
                                                                {formatCurrency(totalBudgeted)}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={12} sm={4}>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Total Spent
                                                            </Typography>
                                                            <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
                                                                {formatCurrency(totalActual)}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={12} sm={4}>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Variance
                                                            </Typography>
                                                            <Typography 
                                                                variant="h5" 
                                                                sx={{ 
                                                                    color: isOverBudget ? 'error.main' : 'success.main',
                                                                    fontWeight: 'medium'
                                                                }}
                                                            >
                                                                {isOverBudget ? '+' : ''}{formatCurrency(totalVariance)}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Box sx={{ mt: 1 }}>
                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        Overall Progress ({percentSpent.toFixed(0)}%)
                                                                    </Typography>
                                                                    <Typography 
                                                                        variant="body2" 
                                                                        sx={{ color: progressColor + '.main' }}
                                                                    >
                                                                        {isOverBudget ? 'Over Budget' : percentSpent > 85 ? 'Approaching Limit' : 'On Track'}
                                                                    </Typography>
                                                                </Box>
                                                                <LinearProgress 
                                                                    variant="determinate" 
                                                                    value={Math.min(percentSpent, 100)}
                                                                    color={progressColor}
                                                                    sx={{ mt: 1, height: 10, borderRadius: 5 }}
                                                                />
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                </>
                                            );
                                        })()}
                                    </Paper>
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom>
                                        Budget Categories
                                    </Typography>
                                    <TableContainer component={Paper}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Category</TableCell>
                                                    <TableCell align="right">Budgeted</TableCell>
                                                    <TableCell align="right">Actual</TableCell>
                                                    <TableCell align="right">Variance</TableCell>
                                                    <TableCell align="right">Progress</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {budgetDetails.categories.map((category) => {
                                                    const percentSpent = category.budgeted > 0 ? 
                                                        (category.actual / category.budgeted) * 100 : 0;
                                                    const isOverBudget = category.variance > 0;
                                                    const progressColor = isOverBudget ? 'error' : percentSpent > 85 ? 'warning' : 'success';
                                                    
                                                    return (
                                                        <React.Fragment key={category.category}>
                                                            <TableRow sx={{ '& > *': { fontWeight: 'bold' } }}>
                                                                <TableCell>{category.category}</TableCell>
                                                                <TableCell align="right">{formatCurrency(category.budgeted)}</TableCell>
                                                                <TableCell align="right">{formatCurrency(category.actual)}</TableCell>
                                                                <TableCell 
                                                                    align="right"
                                                                    sx={{ 
                                                                        color: isOverBudget ? 'error.main' : 'success.main'
                                                                    }}
                                                                >
                                                                    {isOverBudget ? '+' : ''}{formatCurrency(category.variance)}
                                                                </TableCell>
                                                                <TableCell align="right">
                                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                        <Box sx={{ width: '100%', mr: 1 }}>
                                                                            <LinearProgress 
                                                                                variant="determinate" 
                                                                                value={Math.min(percentSpent, 100)}
                                                                                color={progressColor}
                                                                            />
                                                                        </Box>
                                                                        <Box sx={{ minWidth: 35 }}>
                                                                            <Typography variant="body2" color="text.secondary">
                                                                                {percentSpent.toFixed(0)}%
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>
                                                                </TableCell>
                                                            </TableRow>
                                                            {category.subcategories.map((subcategory) => {
                                                                const subPercentSpent = subcategory.budgeted > 0 ? 
                                                                    (subcategory.actual / subcategory.budgeted) * 100 : 0;
                                                                const subIsOverBudget = subcategory.actual > subcategory.budgeted;
                                                                const subProgressColor = subIsOverBudget ? 'error' : subPercentSpent > 85 ? 'warning' : 'success';
                                                                
                                                                return (
                                                                    <TableRow key={subcategory.name} sx={{ bgcolor: 'action.hover' }}>
                                                                        <TableCell sx={{ pl: 4 }}>{subcategory.name}</TableCell>
                                                                        <TableCell align="right">{formatCurrency(subcategory.budgeted)}</TableCell>
                                                                        <TableCell align="right">{formatCurrency(subcategory.actual)}</TableCell>
                                                                        <TableCell 
                                                                            align="right"
                                                                            sx={{ 
                                                                                color: subIsOverBudget ? 'error.main' : 'success.main'
                                                                            }}
                                                                        >
                                                                            {subIsOverBudget ? '+' : ''}{formatCurrency(subcategory.actual - subcategory.budgeted)}
                                                                        </TableCell>
                                                                        <TableCell align="right">
                                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                                <Box sx={{ width: '100%', mr: 1 }}>
                                                                                    <LinearProgress 
                                                                                        variant="determinate" 
                                                                                        value={Math.min(subPercentSpent, 100)}
                                                                                        color={subProgressColor}
                                                                                    />
                                                                                </Box>
                                                                                <Box sx={{ minWidth: 35 }}>
                                                                                    <Typography variant="body2" color="text.secondary">
                                                                                        {subPercentSpent.toFixed(0)}%
                                                                                    </Typography>
                                                                                </Box>
                                                                            </Box>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                );
                                                            })}
                                                        </React.Fragment>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions sx={{ p: 2 }}>
                            <Button 
                                startIcon={<DuplicateIcon />}
                                variant="outlined"
                            >
                                Duplicate
                            </Button>
                            <Button 
                                startIcon={<EditIcon />}
                                variant="outlined"
                                onClick={() => handleEditBudget(budgetDetails.id)}
                            >
                                Edit Budget
                            </Button>
                            <Button 
                                onClick={handleCloseBudgetDetails} 
                                variant="contained"
                            >
                                Close
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
            
            {/* New Budget Dialog */}
            <Dialog
                open={newBudgetOpen}
                onClose={handleCloseNewBudget}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Create New Budget
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseNewBudget}
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
                        This is a placeholder for the new budget form. In a real application, this would include fields for budget details, categories, and allocations.
                    </Alert>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                label="Budget Name"
                                fullWidth
                                required
                                placeholder="e.g., Q3 2023 Budget"
                            />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Start Date"
                                    slotProps={{ textField: { fullWidth: true, required: true } }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="End Date"
                                    slotProps={{ textField: { fullWidth: true, required: true } }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    label="Status"
                                    defaultValue="planned"
                                >
                                    <MenuItem value="planned">Planned</MenuItem>
                                    <MenuItem value="active">Active</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        
                        <Grid item xs={12}>
                            <TextField
                                label="Notes"
                                fullWidth
                                multiline
                                rows={4}
                                placeholder="Add any notes or details about this budget"
                            />
                        </Grid>
                        
                        <Grid item xs={12}>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                Budget Categories
                            </Typography>
                            <Alert severity="info">
                                You'll be able to add and configure budget categories in the next step.
                            </Alert>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseNewBudget}>
                        Cancel
                    </Button>
                    <Button variant="contained">
                        Create Budget
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default BudgetsPage; 