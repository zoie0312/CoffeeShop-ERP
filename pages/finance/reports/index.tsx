import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Paper,
    Card,
    CardContent,
    Button,
    IconButton,
    Chip,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Tabs,
    Tab,
    Divider,
    Stack,
    Alert,
    Tooltip,
    Link,
    ButtonGroup,
    ToggleButtonGroup,
    ToggleButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton
} from '@mui/material';
import {
    PieChart as PieChartIcon,
    BarChart as BarChartIcon,
    ShowChart as LineChartIcon,
    DateRange as DateRangeIcon,
    Download as DownloadIcon,
    Print as PrintIcon,
    Share as ShareIcon,
    Refresh as RefreshIcon,
    Description as ReportIcon,
    FilterList as FilterIcon,
    TableChart as TableChartIcon,
    AccountBalance as BalanceSheetIcon,
    TrendingUp as IncomeStatementIcon,
    Money as CashFlowIcon,
    Paid as ExpenseIcon,
    RequestQuote as InvoiceIcon,
    Settings as SettingsIcon,
    TrendingUp
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, subMonths, startOfMonth, endOfMonth, parseISO } from 'date-fns';

// Chart.js imports
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip as ChartTooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    ChartTooltip,
    Legend,
    Filler
);

// Mock data import - would be replaced by actual API call
import transactions from '../../../data/finance/transactions.json';
import expenses from '../../../data/finance/expenses.json';
import budgets from '../../../data/finance/budgets.json';
import accounts from '../../../data/finance/financial-accounts.json';

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
            id={`report-tabpanel-${index}`}
            aria-labelledby={`report-tab-${index}`}
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

const ReportsPage: React.FC = () => {
    const [tabValue, setTabValue] = useState(0);
    const [selectedReportType, setSelectedReportType] = useState('income-expense');
    const [startDate, setStartDate] = useState<Date>(startOfMonth(subMonths(new Date(), 1)));
    const [endDate, setEndDate] = useState<Date>(endOfMonth(subMonths(new Date(), 1)));
    const [timeFrame, setTimeFrame] = useState('monthly');
    const [chartType, setChartType] = useState('bar');
    const [loading, setLoading] = useState(false);
    const [reportGenerated, setReportGenerated] = useState(true); // Set to true for demo
    
    // Tab change handler
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };
    
    // Report type change handler
    const handleReportTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedReportType(event.target.value as string);
        setReportGenerated(false);
    };
    
    // Time frame change handler
    const handleTimeFrameChange = (event: React.MouseEvent<HTMLElement>, newTimeFrame: string) => {
        if (newTimeFrame !== null) {
            setTimeFrame(newTimeFrame);
            setReportGenerated(false);
            
            // Update date range based on selected time frame
            const currentDate = new Date();
            
            switch (newTimeFrame) {
                case 'weekly':
                    setStartDate(subMonths(currentDate, 1));
                    setEndDate(currentDate);
                    break;
                case 'monthly':
                    setStartDate(startOfMonth(subMonths(currentDate, 1)));
                    setEndDate(endOfMonth(subMonths(currentDate, 1)));
                    break;
                case 'quarterly':
                    setStartDate(subMonths(currentDate, 3));
                    setEndDate(currentDate);
                    break;
                case 'yearly':
                    setStartDate(subMonths(currentDate, 12));
                    setEndDate(currentDate);
                    break;
                default:
                    setStartDate(startOfMonth(subMonths(currentDate, 1)));
                    setEndDate(endOfMonth(subMonths(currentDate, 1)));
            }
        }
    };
    
    // Chart type change handler
    const handleChartTypeChange = (event: React.MouseEvent<HTMLElement>, newChartType: string) => {
        if (newChartType !== null) {
            setChartType(newChartType);
        }
    };
    
    // Generate report handler
    const handleGenerateReport = () => {
        setLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            setReportGenerated(true);
            setLoading(false);
        }, 800);
    };
    
    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };
    
    // Sample data for charts
    const monthlyData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Income',
                data: [12500, 13200, 14100, 13800, 15200, 16100],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            },
            {
                label: 'Expenses',
                data: [9800, 10200, 10500, 10700, 11200, 11500],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }
        ]
    };
    
    const expenseByCategoryData = {
        labels: ['Inventory', 'Labor', 'Rent', 'Utilities', 'Marketing', 'Insurance', 'Other'],
        datasets: [
            {
                label: 'Expenses by Category',
                data: [2800, 4500, 1800, 950, 1200, 800, 1100],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                    'rgba(199, 199, 199, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(199, 199, 199, 1)'
                ],
                borderWidth: 1
            }
        ]
    };
    
    const cashFlowData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
            {
                label: 'Cash Flow',
                data: [3500, -1200, 2800, 4100],
                backgroundColor: (context: any) => {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return undefined;
                    
                    return context.raw < 0
                        ? 'rgba(255, 99, 132, 0.7)'
                        : 'rgba(75, 192, 192, 0.7)';
                },
                borderColor: (context: any) => {
                    return context.raw < 0
                        ? 'rgba(255, 99, 132, 1)'
                        : 'rgba(75, 192, 192, 1)';
                },
                borderWidth: 1
            }
        ]
    };

    const profitMarginData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Profit Margin (%)',
                data: [18.2, 19.5, 20.3, 22.1, 21.5, 23.8],
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(153, 102, 255, 1)',
                pointRadius: 4,
                tension: 0.4
            }
        ]
    };
    
    // Chart options
    const lineOptions = {
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
    
    const barOptions = {
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
    
    const pieOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right' as const,
            },
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: ${formatCurrency(value)} (${percentage}%)`;
                    }
                }
            }
        }
    };
    
    // Financial metrics summary - would typically be calculated from actual data
    const financialMetrics = [
        { name: 'Revenue', value: 92500, change: 8.5, isPositive: true },
        { name: 'Expenses', value: 63900, change: 5.2, isPositive: false },
        { name: 'Net Profit', value: 28600, change: 12.3, isPositive: true },
        { name: 'Profit Margin', value: 30.9, change: 3.5, isPositive: true, isPercentage: true }
    ];
    
    // Calculate actual financial data from transactions
    const calculateActualFinancials = () => {
        // In a real application, this would be done server-side or with more robust calculations
        // This is a simplified example
        
        const saleTransactions = transactions.filter((t: any) => t.type === 'sale');
        const expenseTransactions = transactions.filter((t: any) => t.type === 'expense');
        
        const totalSales = saleTransactions.reduce((sum: number, transaction: any) => sum + transaction.amount, 0);
        const totalExpenses = expenseTransactions.reduce((sum: number, transaction: any) => sum + transaction.amount, 0);
        const netProfit = totalSales - totalExpenses;
        const profitMargin = (netProfit / totalSales) * 100;
        
        return {
            revenue: totalSales,
            expenses: totalExpenses,
            netProfit: netProfit,
            profitMargin: profitMargin
        };
    };

    // Render the appropriate chart based on selected chart type and report
    const renderChart = () => {
        switch (selectedReportType) {
            case 'income-expense':
                switch (chartType) {
                    case 'bar':
                        return <Bar data={monthlyData} options={barOptions} />;
                    case 'line':
                        return <Line data={monthlyData} options={lineOptions} />;
                    default:
                        return <Bar data={monthlyData} options={barOptions} />;
                }
            case 'expense-breakdown':
                switch (chartType) {
                    case 'pie':
                        return <Pie data={expenseByCategoryData} options={pieOptions} />;
                    case 'doughnut':
                        return <Doughnut data={expenseByCategoryData} options={pieOptions} />;
                    case 'bar':
                        return <Bar data={expenseByCategoryData} options={barOptions} />;
                    default:
                        return <Pie data={expenseByCategoryData} options={pieOptions} />;
                }
            case 'cash-flow':
                switch (chartType) {
                    case 'bar':
                        return <Bar data={cashFlowData} options={barOptions} />;
                    case 'line':
                        return <Line data={cashFlowData} options={lineOptions} />;
                    default:
                        return <Bar data={cashFlowData} options={barOptions} />;
                }
            case 'profit-margin':
                return <Line data={profitMarginData} options={lineOptions} />;
            default:
                return <Bar data={monthlyData} options={barOptions} />;
        }
    };
    
    // List of available reports
    const availableReports = [
        { id: 'income-expense', name: 'Income & Expenses', icon: <IncomeStatementIcon />, description: 'Analysis of income and expenses over time' },
        { id: 'expense-breakdown', name: 'Expense Breakdown', icon: <ExpenseIcon />, description: 'Detailed breakdown of expenses by category' },
        { id: 'cash-flow', name: 'Cash Flow', icon: <CashFlowIcon />, description: 'Weekly cash flow analysis' },
        { id: 'profit-margin', name: 'Profit Margin', icon: <TrendingUp />, description: 'Profit margin trends over time' },
        { id: 'balance-sheet', name: 'Balance Sheet', icon: <BalanceSheetIcon />, description: 'Assets, liabilities and equity' },
        { id: 'tax-summary', name: 'Tax Summary', icon: <ReportIcon />, description: 'Tax-related income and expenses' },
    ];
    
    // Get report title and description
    const getReportInfo = () => {
        const report = availableReports.find(r => r.id === selectedReportType);
        return {
            title: report?.name || 'Report',
            description: report?.description || 'Financial report'
        };
    };
    
    const reportInfo = getReportInfo();
    
    return (
        <Box sx={{ padding: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Financial Reports
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<DownloadIcon />}
                    disabled={!reportGenerated}
                >
                    Export Report
                </Button>
            </Box>
            
            {/* Report Type Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="report tabs">
                    <Tab label="Standard Reports" />
                    <Tab label="Custom Reports" />
                    <Tab label="Saved Reports" />
                </Tabs>
            </Box>
            
            {/* Standard Reports */}
            <TabPanel value={tabValue} index={0}>
                <Grid container spacing={3}>
                    {/* Report Selection Sidebar */}
                    <Grid item xs={12} md={3}>
                        <Paper sx={{ p: 2, height: '100%' }}>
                            <Typography variant="h6" gutterBottom>
                                Available Reports
                            </Typography>
                            <List>
                                {availableReports.map((report) => (
                                    <ListItemButton 
                                        key={report.id}
                                        selected={selectedReportType === report.id}
                                        onClick={() => setSelectedReportType(report.id)}
                                        sx={{
                                            borderRadius: 1,
                                            mb: 1,
                                            '&.Mui-selected': {
                                                backgroundColor: 'primary.light',
                                                '&:hover': {
                                                    backgroundColor: 'primary.light',
                                                },
                                            },
                                        }}
                                    >
                                        <ListItemIcon>
                                            {report.icon}
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary={report.name} 
                                            secondary={report.description}
                                            primaryTypographyProps={{
                                                fontWeight: selectedReportType === report.id ? 'bold' : 'regular',
                                            }}
                                        />
                                    </ListItemButton>
                                ))}
                            </List>
                            
                            <Divider sx={{ my: 2 }} />
                            
                            <Typography variant="subtitle2" gutterBottom>
                                Report Period
                            </Typography>
                            
                            <ToggleButtonGroup
                                value={timeFrame}
                                exclusive
                                onChange={handleTimeFrameChange}
                                size="small"
                                fullWidth
                                sx={{ mb: 2 }}
                            >
                                <ToggleButton value="weekly">Weekly</ToggleButton>
                                <ToggleButton value="monthly">Monthly</ToggleButton>
                                <ToggleButton value="quarterly">Quarterly</ToggleButton>
                                <ToggleButton value="yearly">Yearly</ToggleButton>
                            </ToggleButtonGroup>
                            
                            <Stack spacing={2}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Start Date"
                                        value={startDate}
                                        onChange={(newValue) => {
                                            if (newValue) {
                                                setStartDate(newValue);
                                                setReportGenerated(false);
                                            }
                                        }}
                                        slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                    />
                                    <DatePicker
                                        label="End Date"
                                        value={endDate}
                                        onChange={(newValue) => {
                                            if (newValue) {
                                                setEndDate(newValue);
                                                setReportGenerated(false);
                                            }
                                        }}
                                        slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                    />
                                </LocalizationProvider>
                            </Stack>
                            
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mt: 2 }}
                                onClick={handleGenerateReport}
                                disabled={loading}
                            >
                                {loading ? 'Generating...' : 'Generate Report'}
                            </Button>
                        </Paper>
                    </Grid>
                    
                    {/* Report Content */}
                    <Grid item xs={12} md={9}>
                        <Paper sx={{ p: 3 }}>
                            {!reportGenerated ? (
                                <Box sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    minHeight: 400
                                }}>
                                    <ReportIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        No Report Generated
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" align="center">
                                        Select your report parameters and click "Generate Report" to view your financial data.
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ mt: 2 }}
                                        onClick={handleGenerateReport}
                                        disabled={loading}
                                    >
                                        {loading ? 'Generating...' : 'Generate Report'}
                                    </Button>
                                </Box>
                            ) : (
                                <>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                        <Box>
                                            <Typography variant="h5" gutterBottom>
                                                {reportInfo.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {format(startDate, 'MMMM d, yyyy')} - {format(endDate, 'MMMM d, yyyy')}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <ButtonGroup variant="outlined" size="small">
                                                <Button startIcon={<PrintIcon />}>Print</Button>
                                                <Button startIcon={<DownloadIcon />}>PDF</Button>
                                                <Button startIcon={<ShareIcon />}>Share</Button>
                                            </ButtonGroup>
                                        </Box>
                                    </Box>
                                    
                                    {/* Financial Metrics */}
                                    <Grid container spacing={2} sx={{ mb: 3 }}>
                                        {financialMetrics.map((metric) => (
                                            <Grid item xs={6} sm={3} key={metric.name}>
                                                <Card>
                                                    <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {metric.name}
                                                        </Typography>
                                                        <Typography variant="h6" sx={{ fontWeight: 'medium', my: 0.5 }}>
                                                            {metric.isPercentage 
                                                                ? `${metric.value.toFixed(1)}%` 
                                                                : formatCurrency(metric.value)
                                                            }
                                                        </Typography>
                                                        <Typography 
                                                            variant="body2" 
                                                            sx={{ 
                                                                color: metric.isPositive 
                                                                    ? 'success.main' 
                                                                    : 'error.main',
                                                                display: 'flex',
                                                                alignItems: 'center'
                                                            }}
                                                        >
                                                            {metric.isPositive ? '↑' : '↓'} {metric.change}%
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                    
                                    {/* Chart Controls */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography variant="subtitle1">
                                            {reportInfo.description}
                                        </Typography>
                                        {/* Chart Type Selector */}
                                        {(selectedReportType === 'income-expense' || selectedReportType === 'cash-flow') && (
                                            <ToggleButtonGroup
                                                value={chartType}
                                                exclusive
                                                onChange={handleChartTypeChange}
                                                size="small"
                                            >
                                                <ToggleButton value="bar">
                                                    <Tooltip title="Bar Chart">
                                                        <BarChartIcon fontSize="small" />
                                                    </Tooltip>
                                                </ToggleButton>
                                                <ToggleButton value="line">
                                                    <Tooltip title="Line Chart">
                                                        <LineChartIcon fontSize="small" />
                                                    </Tooltip>
                                                </ToggleButton>
                                            </ToggleButtonGroup>
                                        )}
                                        {selectedReportType === 'expense-breakdown' && (
                                            <ToggleButtonGroup
                                                value={chartType}
                                                exclusive
                                                onChange={handleChartTypeChange}
                                                size="small"
                                            >
                                                <ToggleButton value="pie">
                                                    <Tooltip title="Pie Chart">
                                                        <PieChartIcon fontSize="small" />
                                                    </Tooltip>
                                                </ToggleButton>
                                                <ToggleButton value="doughnut">
                                                    <Tooltip title="Doughnut Chart">
                                                        <PieChartIcon fontSize="small" />
                                                    </Tooltip>
                                                </ToggleButton>
                                                <ToggleButton value="bar">
                                                    <Tooltip title="Bar Chart">
                                                        <BarChartIcon fontSize="small" />
                                                    </Tooltip>
                                                </ToggleButton>
                                            </ToggleButtonGroup>
                                        )}
                                    </Box>
                                    
                                    {/* Chart */}
                                    <Box sx={{ height: 400, width: '100%' }}>
                                        {renderChart()}
                                    </Box>
                                </>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </TabPanel>
            
            {/* Custom Reports */}
            <TabPanel value={tabValue} index={1}>
                <Paper sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 5 }}>
                        <SettingsIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h5" gutterBottom>
                            Custom Report Builder
                        </Typography>
                        <Typography variant="body1" color="text.secondary" align="center" sx={{ maxWidth: 600, mb: 3 }}>
                            Create your own custom reports by selecting specific data points, metrics, and visualizations that matter most to your business.
                        </Typography>
                        <Button variant="contained" color="primary">
                            Create Custom Report
                        </Button>
                    </Box>
                </Paper>
            </TabPanel>
            
            {/* Saved Reports */}
            <TabPanel value={tabValue} index={2}>
                <Paper sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 5 }}>
                        <ReportIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h5" gutterBottom>
                            No Saved Reports Yet
                        </Typography>
                        <Typography variant="body1" color="text.secondary" align="center" sx={{ maxWidth: 600, mb: 3 }}>
                            You haven't saved any reports yet. Generate a report and click "Save Report" to access it quickly in the future.
                        </Typography>
                        <Button 
                            variant="contained" 
                            color="primary"
                            onClick={() => setTabValue(0)}
                        >
                            Go to Reports
                        </Button>
                    </Box>
                </Paper>
            </TabPanel>
        </Box>
    );
};

export default ReportsPage; 