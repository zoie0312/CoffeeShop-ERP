import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Tabs,
    Tab,
    Button,
    ButtonGroup,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Divider,
    Chip,
    Card,
    CardContent,
    Stack,
    IconButton
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import CustomDateAdapter from '../../lib/dateAdapter';
import {
    FileDownload as FileDownloadIcon,
    Refresh as RefreshIcon,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    ShowChart as ShowChartIcon,
    MoreVert as MoreVertIcon,
    Print as PrintIcon
} from '@mui/icons-material';
import Layout from '../../components/Layout';
import SalesChart from '../../components/reports/SalesChart';
import ProductPerformanceTable from '../../components/reports/ProductPerformanceTable';
import KpiCard from '../../components/KpiCard';
import { useRouter } from 'next/router';

// Import mock data
import salesData from '../../data/reports/sales.json';
import revenueData from '../../data/reports/revenue.json';
import productsData from '../../data/reports/products.json';

// Type assertions
const dailySales = salesData as any;
const monthlyRevenue = revenueData as any;
const productPerformance = productsData as any;

export default function ReportsPage() {
    // State for date range picker
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
        new Date(new Date().setDate(new Date().getDate() - 30)), // Last 30 days
        new Date()
    ]);
    
    // State for report type
    const [reportType, setReportType] = useState('overview');
    
    // Derived metrics from mock data
    const totalSales = 15872.45;
    const salesGrowth = 12.7;
    const totalOrders = 1238;
    const ordersGrowth = 8.3;
    const averageOrder = 12.82;
    const averageOrderGrowth = 4.1;
    const topCategory = 'Coffee';
    
    const router = useRouter();

    return (
        <Layout title="Reports & Analytics">
            <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
                {/* Report Controls */}
                <Paper sx={{ p: 2, mb: 4 }}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="report-type-label">Report Type</InputLabel>
                                <Select
                                    labelId="report-type-label"
                                    id="report-type"
                                    value={reportType}
                                    onChange={(e) => {
                                        setReportType(e.target.value);
                                        const selectedReport = e.target.value as string;
                                        
                                        // Navigate based on selection
                                        switch(selectedReport) {
                                            case 'sales':
                                                router.push('/reports/sales');
                                                break;
                                            case 'products':
                                                router.push('/reports/products');
                                                break;
                                            case 'customers':
                                                router.push('/reports/customers');
                                                break;
                                            case 'inventory':
                                                router.push('/reports/inventory');
                                                break;
                                            default:
                                                // Stay on the overview page
                                                break;
                                        }
                                    }}
                                    label="Report Type"
                                >
                                    <MenuItem value="overview">Overview</MenuItem>
                                    <MenuItem value="sales">Sales Report</MenuItem>
                                    <MenuItem value="products">Product Performance</MenuItem>
                                    <MenuItem value="customers">Customer Analysis</MenuItem>
                                    <MenuItem value="inventory">Inventory Turnover</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <LocalizationProvider dateAdapter={CustomDateAdapter}>
                                <DateRangePicker
                                    value={dateRange}
                                    onChange={(newValue: [Date | null, Date | null]) => {
                                        setDateRange(newValue);
                                    }}
                                    slots={{ field: SingleInputDateRangeField }}
                                    slotProps={{
                                        textField: { fullWidth: true, size: 'small' }
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                <Button 
                                    variant="outlined" 
                                    startIcon={<RefreshIcon />}
                                >
                                    Refresh
                                </Button>
                                <Button 
                                    variant="outlined" 
                                    startIcon={<FileDownloadIcon />}
                                >
                                    Export
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                    
                    {/* Quick Date Filters */}
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                        <Chip 
                            label="Today" 
                            variant="outlined" 
                            onClick={() => {
                                const today = new Date();
                                setDateRange([today, today]);
                            }}
                        />
                        <Chip 
                            label="Yesterday" 
                            variant="outlined" 
                            onClick={() => {
                                const yesterday = new Date();
                                yesterday.setDate(yesterday.getDate() - 1);
                                setDateRange([yesterday, yesterday]);
                            }}
                        />
                        <Chip 
                            label="Last 7 Days" 
                            variant="outlined" 
                            onClick={() => {
                                const end = new Date();
                                const start = new Date();
                                start.setDate(start.getDate() - 6);
                                setDateRange([start, end]);
                            }}
                        />
                        <Chip 
                            label="Last 30 Days"
                            color="primary"
                            variant="filled"
                            onClick={() => {
                                const end = new Date();
                                const start = new Date();
                                start.setDate(start.getDate() - 29);
                                setDateRange([start, end]);
                            }}
                        />
                        <Chip 
                            label="This Month" 
                            variant="outlined" 
                            onClick={() => {
                                const today = new Date();
                                const start = new Date(today.getFullYear(), today.getMonth(), 1);
                                setDateRange([start, today]);
                            }}
                        />
                        <Chip 
                            label="Last Month" 
                            variant="outlined" 
                            onClick={() => {
                                const today = new Date();
                                const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                                const end = new Date(today.getFullYear(), today.getMonth(), 0);
                                setDateRange([start, end]);
                            }}
                        />
                    </Box>
                </Paper>
                
                {/* KPI Summary */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={3}>
                        <KpiCard 
                            title="Total Sales"
                            value={`$${totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            icon={<ShowChartIcon color="primary" />}
                            comparison={{
                                value: `${salesGrowth > 0 ? '+' : ''}${salesGrowth}% vs. previous period`,
                                isPositive: salesGrowth > 0
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <KpiCard 
                            title="Total Orders"
                            value={totalOrders.toLocaleString()}
                            icon={<ShowChartIcon color="primary" />}
                            comparison={{
                                value: `${ordersGrowth > 0 ? '+' : ''}${ordersGrowth}% vs. previous period`,
                                isPositive: ordersGrowth > 0
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <KpiCard 
                            title="Average Order Value"
                            value={`$${averageOrder.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            icon={<ShowChartIcon color="primary" />}
                            comparison={{
                                value: `${averageOrderGrowth > 0 ? '+' : ''}${averageOrderGrowth}% vs. previous period`,
                                isPositive: averageOrderGrowth > 0
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <KpiCard 
                            title="Top Selling Category"
                            value={topCategory}
                            icon={<ShowChartIcon color="primary" />}
                            details={[{ label: 'Sales', value: '$4,587.20' }]}
                        />
                    </Grid>
                </Grid>
                
                {/* Charts and Tables */}
                <Grid container spacing={4}>
                    {/* Sales Trend Chart */}
                    <Grid item xs={12} lg={8}>
                        <Paper sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6">Sales Trend</Typography>
                                <ButtonGroup size="small" variant="outlined">
                                    <Button>Daily</Button>
                                    <Button variant="contained" disableElevation>Weekly</Button>
                                    <Button>Monthly</Button>
                                </ButtonGroup>
                            </Box>
                            <SalesChart data={dailySales} />
                        </Paper>
                    </Grid>
                    
                    {/* Revenue By Category */}
                    <Grid item xs={12} lg={4}>
                        <Paper sx={{ p: 3, height: '100%' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6">Revenue by Category</Typography>
                                <IconButton size="small">
                                    <MoreVertIcon fontSize="small" />
                                </IconButton>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2" color="text.secondary">Coffee</Typography>
                                        <Typography variant="body2">$7,234.50</Typography>
                                    </Box>
                                    <Box sx={{ bgcolor: 'background.default', borderRadius: 1, height: 8, overflow: 'hidden' }}>
                                        <Box sx={{ width: '65%', height: '100%', bgcolor: 'primary.main' }} />
                                    </Box>
                                </Box>
                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2" color="text.secondary">Food</Typography>
                                        <Typography variant="body2">$4,876.30</Typography>
                                    </Box>
                                    <Box sx={{ bgcolor: 'background.default', borderRadius: 1, height: 8, overflow: 'hidden' }}>
                                        <Box sx={{ width: '45%', height: '100%', bgcolor: 'primary.main' }} />
                                    </Box>
                                </Box>
                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2" color="text.secondary">Bakery</Typography>
                                        <Typography variant="body2">$2,102.75</Typography>
                                    </Box>
                                    <Box sx={{ bgcolor: 'background.default', borderRadius: 1, height: 8, overflow: 'hidden' }}>
                                        <Box sx={{ width: '25%', height: '100%', bgcolor: 'primary.main' }} />
                                    </Box>
                                </Box>
                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2" color="text.secondary">Merchandise</Typography>
                                        <Typography variant="body2">$1,658.90</Typography>
                                    </Box>
                                    <Box sx={{ bgcolor: 'background.default', borderRadius: 1, height: 8, overflow: 'hidden' }}>
                                        <Box sx={{ width: '15%', height: '100%', bgcolor: 'primary.main' }} />
                                    </Box>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                    
                    {/* Product Performance Table */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6">Product Performance</Typography>
                                <Box>
                                    <Button startIcon={<PrintIcon />} variant="outlined" size="small" sx={{ mr: 1 }}>
                                        Print
                                    </Button>
                                    <Button startIcon={<FileDownloadIcon />} variant="outlined" size="small">
                                        Export
                                    </Button>
                                </Box>
                            </Box>
                            <ProductPerformanceTable products={productPerformance} />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Layout>
    );
} 