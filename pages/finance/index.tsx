import React, { useState } from 'react';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    ButtonGroup,
    Button,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Link as MuiLink,
    Stack
} from '@mui/material';
import {
    AttachMoney as MoneyIcon,
    AccountBalance as AccountIcon,
    Receipt as ReceiptIcon,
    ArrowUpward as IncomeIcon,
    ArrowDownward as ExpenseIcon,
    TrendingUp as TrendingUpIcon,
    CalendarToday as CalendarIcon
} from '@mui/icons-material';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

// Import mock data
import accounts from '../../data/finance/financial-accounts.json';
import transactions from '../../data/finance/transactions.json';

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
            id={`finance-tabpanel-${index}`}
            aria-labelledby={`finance-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default function FinanceDashboard() {
    const [tabValue, setTabValue] = useState(0);
    const [timeRange, setTimeRange] = useState('month');

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Calculate total assets
    const totalAssets = accounts
        .filter(account => account.balance > 0)
        .reduce((sum, account) => sum + account.balance, 0);

    // Calculate total liabilities
    const totalLiabilities = accounts
        .filter(account => account.balance < 0)
        .reduce((sum, account) => sum + Math.abs(account.balance), 0);

    // Calculate net worth
    const netWorth = totalAssets - totalLiabilities;

    // Calculate total income for the current month
    const currentMonthIncome = transactions
        .filter(transaction => 
            transaction.type === 'sale' && 
            new Date(transaction.date).getMonth() === new Date().getMonth()
        )
        .reduce((sum, transaction) => sum + transaction.amount, 0);

    // Calculate total expenses for the current month
    const currentMonthExpenses = transactions
        .filter(transaction => 
            transaction.type === 'expense' && 
            new Date(transaction.date).getMonth() === new Date().getMonth()
        )
        .reduce((sum, transaction) => sum + transaction.amount, 0);

    // Sample cash flow data for chart
    const cashFlowData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Income',
                data: [12500, 13200, 14100, 13800, 15200, 16100],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.4
            },
            {
                label: 'Expenses',
                data: [9800, 10200, 10500, 10700, 11200, 11500],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value: any) {
                        return '$' + value.toLocaleString();
                    }
                }
            }
        }
    };

    return (
        <Layout title="Finance Dashboard">
            <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
                {/* Summary KPIs */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom variant="subtitle2">
                                    Net Worth
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <AccountIcon sx={{ color: 'primary.main', mr: 1 }} />
                                    <Typography variant="h4" component="div">
                                        ${netWorth.toLocaleString()}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                    Assets: ${totalAssets.toLocaleString()} <br />
                                    Liabilities: ${totalLiabilities.toLocaleString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom variant="subtitle2">
                                    Monthly Income
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <IncomeIcon sx={{ color: 'success.main', mr: 1 }} />
                                    <Typography variant="h4" component="div">
                                        ${currentMonthIncome.toLocaleString()}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                                    +12.5% vs. last month
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom variant="subtitle2">
                                    Monthly Expenses
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <ExpenseIcon sx={{ color: 'error.main', mr: 1 }} />
                                    <Typography variant="h4" component="div">
                                        ${currentMonthExpenses.toLocaleString()}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
                                    +5.2% vs. last month
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom variant="subtitle2">
                                    Profit Margin
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <TrendingUpIcon sx={{ color: 'info.main', mr: 1 }} />
                                    <Typography variant="h4" component="div">
                                        {((currentMonthIncome - currentMonthExpenses) / currentMonthIncome * 100).toFixed(1)}%
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="info.main" sx={{ mt: 1 }}>
                                    +2.3% vs. last month
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                
                {/* Chart & Tabs Section */}
                <Grid container spacing={4}>
                    {/* Cash Flow Chart */}
                    <Grid item xs={12} lg={8}>
                        <Paper sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6">Cash Flow</Typography>
                                <ButtonGroup size="small" variant="outlined">
                                    <Button 
                                        variant={timeRange === 'month' ? 'contained' : 'outlined'}
                                        onClick={() => setTimeRange('month')}
                                    >
                                        Month
                                    </Button>
                                    <Button 
                                        variant={timeRange === 'quarter' ? 'contained' : 'outlined'}
                                        onClick={() => setTimeRange('quarter')}
                                    >
                                        Quarter
                                    </Button>
                                    <Button 
                                        variant={timeRange === 'year' ? 'contained' : 'outlined'}
                                        onClick={() => setTimeRange('year')}
                                    >
                                        Year
                                    </Button>
                                </ButtonGroup>
                            </Box>
                            <Box sx={{ height: 300 }}>
                                <Line data={cashFlowData} options={chartOptions} />
                            </Box>
                        </Paper>
                    </Grid>
                    
                    {/* Accounts Summary */}
                    <Grid item xs={12} lg={4}>
                        <Paper sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h6" gutterBottom>
                                Accounts
                            </Typography>
                            <TableContainer sx={{ maxHeight: 340, overflow: 'auto' }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Account</TableCell>
                                            <TableCell align="right">Balance</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {accounts.map((account) => (
                                            <TableRow key={account.id} hover>
                                                <TableCell>
                                                    <Link href={`/finance/accounts/${account.id}`} passHref legacyBehavior>
                                                        <MuiLink color="inherit" underline="hover">
                                                            {account.name}
                                                        </MuiLink>
                                                    </Link>
                                                    <Typography variant="caption" display="block" color="text.secondary">
                                                        {account.institution}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography
                                                        variant="body2"
                                                        color={account.balance >= 0 ? 'success.main' : 'error.main'}
                                                    >
                                                        ${account.balance.toLocaleString()}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Box sx={{ mt: 2, textAlign: 'right' }}>
                                <Button 
                                    component={Link} 
                                    href="/finance/accounts" 
                                    size="small"
                                    variant="text"
                                >
                                    View All Accounts
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                    
                    {/* Transactions and Financial Data Tabs */}
                    <Grid item xs={12}>
                        <Paper sx={{ width: '100%' }}>
                            <Tabs 
                                value={tabValue} 
                                onChange={handleTabChange} 
                                aria-label="finance tabs"
                                variant="scrollable"
                                scrollButtons="auto"
                            >
                                <Tab label="Recent Transactions" />
                                <Tab label="Upcoming Bills" />
                                <Tab label="Income Breakdown" />
                                <Tab label="Expense Breakdown" />
                            </Tabs>
                            
                            {/* Recent Transactions Tab */}
                            <TabPanel value={tabValue} index={0}>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Date</TableCell>
                                                <TableCell>Description</TableCell>
                                                <TableCell>Category</TableCell>
                                                <TableCell align="right">Amount</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {transactions.slice(0, 10).map((transaction) => (
                                                <TableRow 
                                                    key={transaction.id} 
                                                    hover
                                                    sx={{ 
                                                        '&:hover': { 
                                                            cursor: 'pointer',
                                                            bgcolor: 'action.hover'
                                                        }
                                                    }}
                                                >
                                                    <TableCell>{transaction.date}</TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">{transaction.description}</Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {transaction.referenceId}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip 
                                                            label={transaction.category} 
                                                            size="small"
                                                            color={transaction.type === 'sale' ? 'success' : 'default'}
                                                            variant="outlined"
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography
                                                            variant="body2"
                                                            color={transaction.type === 'sale' ? 'success.main' : 'error.main'}
                                                        >
                                                            {transaction.type === 'sale' ? '+' : '-'}
                                                            ${transaction.amount.toLocaleString()}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <Box sx={{ mt: 2, textAlign: 'right' }}>
                                    <Button 
                                        component={Link} 
                                        href="/finance/transactions" 
                                        size="small"
                                        variant="text"
                                    >
                                        View All Transactions
                                    </Button>
                                </Box>
                            </TabPanel>
                            
                            {/* Upcoming Bills Tab */}
                            <TabPanel value={tabValue} index={1}>
                                <Typography variant="body1">
                                    No upcoming bills due within the next 7 days.
                                </Typography>
                            </TabPanel>
                            
                            {/* Income Breakdown Tab */}
                            <TabPanel value={tabValue} index={2}>
                                <Typography variant="body1">
                                    Income breakdown by category will be displayed here.
                                </Typography>
                            </TabPanel>
                            
                            {/* Expense Breakdown Tab */}
                            <TabPanel value={tabValue} index={3}>
                                <Typography variant="body1">
                                    Expense breakdown by category will be displayed here.
                                </Typography>
                            </TabPanel>
                        </Paper>
                    </Grid>
                </Grid>
                
                {/* Quick Actions */}
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Quick Actions
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Button 
                            variant="outlined" 
                            component={Link}
                            href="/finance/transactions/new"
                            startIcon={<ReceiptIcon />}
                        >
                            Record Transaction
                        </Button>
                        <Button 
                            variant="outlined"
                            component={Link}
                            href="/finance/reports"
                            startIcon={<CalendarIcon />}
                        >
                            Financial Reports
                        </Button>
                        <Button 
                            variant="outlined"
                            component={Link}
                            href="/finance/budgets"
                            startIcon={<MoneyIcon />}
                        >
                            Budget Planning
                        </Button>
                    </Stack>
                </Box>
            </Container>
        </Layout>
    );
} 