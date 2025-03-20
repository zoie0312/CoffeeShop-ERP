import React, { useState } from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    ButtonGroup,
    Button,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TablePagination,
    Card,
    CardContent,
    Tabs,
    Tab,
    Divider,
    Stack,
    FormControlLabel,
    Switch
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CustomDateAdapter from '../../lib/dateAdapter';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import {
    FileDownload as FileDownloadIcon,
    Print as PrintIcon
} from '@mui/icons-material';
import Layout from '../../components/Layout';
import SalesChart from '../../components/reports/SalesChart';

// Import mock data
import salesData from '../../data/reports/sales.json';
import dailySalesData from '../../data/reports/dailysales.json';

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
            id={`sales-tabpanel-${index}`}
            aria-labelledby={`sales-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ pt: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default function SalesReportPage() {
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
        new Date(new Date().setDate(new Date().getDate() - 30)),
        new Date()
    ]);
    
    const [tabValue, setTabValue] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [chartView, setChartView] = useState('daily'); // daily, weekly, monthly
    const [showTotal, setShowTotal] = useState(true);
    
    // Mock data
    const salesSummary = {
        totalSales: 15872.45,
        salesGrowth: 12.7,
        totalOrders: 1238,
        ordersGrowth: 8.3,
        averageOrder: 12.82,
        averageOrderGrowth: 4.1,
        highestDaySales: 872.50,
        highestDayDate: '2023-05-15',
        lowestDaySales: 312.25,
        lowestDayDate: '2023-05-02'
    };
    
    // Handle pagination
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    
    // Handle tab change
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };
    
    return (
        <Layout title="Sales Report">
            <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1">
                        Sales Report
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button variant="outlined" startIcon={<PrintIcon />}>
                            Print
                        </Button>
                        <Button variant="outlined" startIcon={<FileDownloadIcon />}>
                            Export
                        </Button>
                    </Box>
                </Box>
                
                {/* Date Range Picker */}
                <Paper sx={{ p: 2, mb: 4 }}>
                    <LocalizationProvider dateAdapter={CustomDateAdapter}>
                        <DateRangePicker
                            value={dateRange}
                            onChange={(newValue) => {
                                setDateRange(newValue);
                            }}
                            slots={{ field: SingleInputDateRangeField }}
                            slotProps={{ textField: { fullWidth: true } }}
                        />
                    </LocalizationProvider>
                </Paper>
                
                {/* Sales Summary Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Total Sales
                                </Typography>
                                <Typography variant="h5" component="div">
                                    ${salesSummary.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </Typography>
                                <Typography variant="body2" color={salesSummary.salesGrowth > 0 ? 'success.main' : 'error.main'}>
                                    {salesSummary.salesGrowth > 0 ? '+' : ''}{salesSummary.salesGrowth}% vs. last period
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Total Orders
                                </Typography>
                                <Typography variant="h5" component="div">
                                    {salesSummary.totalOrders.toLocaleString()}
                                </Typography>
                                <Typography variant="body2" color={salesSummary.ordersGrowth > 0 ? 'success.main' : 'error.main'}>
                                    {salesSummary.ordersGrowth > 0 ? '+' : ''}{salesSummary.ordersGrowth}% vs. last period
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Average Order Value
                                </Typography>
                                <Typography variant="h5" component="div">
                                    ${salesSummary.averageOrder.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </Typography>
                                <Typography variant="body2" color={salesSummary.averageOrderGrowth > 0 ? 'success.main' : 'error.main'}>
                                    {salesSummary.averageOrderGrowth > 0 ? '+' : ''}{salesSummary.averageOrderGrowth}% vs. last period
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Highest Day
                                </Typography>
                                <Typography variant="h5" component="div">
                                    ${salesSummary.highestDaySales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {new Date(salesSummary.highestDayDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                
                {/* Tabs */}
                <Paper sx={{ mb: 4 }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        <Tab label="Sales Trend" />
                        <Tab label="Sales by Product" />
                        <Tab label="Sales by Category" />
                        <Tab label="Sales by Payment Method" />
                    </Tabs>
                    
                    <TabPanel value={tabValue} index={0}>
                        <Box sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <ButtonGroup size="small" variant="outlined">
                                    <Button 
                                        variant={chartView === 'daily' ? 'contained' : 'outlined'} 
                                        onClick={() => setChartView('daily')}
                                        disableElevation
                                    >
                                        Daily
                                    </Button>
                                    <Button 
                                        variant={chartView === 'weekly' ? 'contained' : 'outlined'} 
                                        onClick={() => setChartView('weekly')}
                                        disableElevation
                                    >
                                        Weekly
                                    </Button>
                                    <Button 
                                        variant={chartView === 'monthly' ? 'contained' : 'outlined'} 
                                        onClick={() => setChartView('monthly')}
                                        disableElevation
                                    >
                                        Monthly
                                    </Button>
                                </ButtonGroup>
                                <FormControlLabel
                                    control={
                                        <Switch 
                                            checked={showTotal} 
                                            onChange={(e) => setShowTotal(e.target.checked)} 
                                        />
                                    }
                                    label="Show Total"
                                />
                            </Box>
                            <SalesChart data={salesData} />
                        </Box>
                    </TabPanel>
                    
                    <TabPanel value={tabValue} index={1}>
                        <Box sx={{ p: 2 }}>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Product</TableCell>
                                            <TableCell>Category</TableCell>
                                            <TableCell align="right">Price</TableCell>
                                            <TableCell align="right">Quantity</TableCell>
                                            <TableCell align="right">Total Sales</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Espresso</TableCell>
                                            <TableCell>Coffee</TableCell>
                                            <TableCell align="right">$2.95</TableCell>
                                            <TableCell align="right">421</TableCell>
                                            <TableCell align="right">$1,241.95</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Cappuccino</TableCell>
                                            <TableCell>Coffee</TableCell>
                                            <TableCell align="right">$4.25</TableCell>
                                            <TableCell align="right">389</TableCell>
                                            <TableCell align="right">$1,653.25</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Latte</TableCell>
                                            <TableCell>Coffee</TableCell>
                                            <TableCell align="right">$4.50</TableCell>
                                            <TableCell align="right">456</TableCell>
                                            <TableCell align="right">$2,052.00</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={20}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Box>
                    </TabPanel>
                    
                    <TabPanel value={tabValue} index={2}>
                        <Box sx={{ p: 2 }}>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Category</TableCell>
                                            <TableCell align="right">Items Sold</TableCell>
                                            <TableCell align="right">Total Sales</TableCell>
                                            <TableCell align="right">Percentage</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Coffee</TableCell>
                                            <TableCell align="right">1,878</TableCell>
                                            <TableCell align="right">$7,234.50</TableCell>
                                            <TableCell align="right">46%</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Food</TableCell>
                                            <TableCell align="right">782</TableCell>
                                            <TableCell align="right">$4,876.30</TableCell>
                                            <TableCell align="right">31%</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Bakery</TableCell>
                                            <TableCell align="right">597</TableCell>
                                            <TableCell align="right">$2,102.75</TableCell>
                                            <TableCell align="right">13%</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Merchandise</TableCell>
                                            <TableCell align="right">160</TableCell>
                                            <TableCell align="right">$1,658.90</TableCell>
                                            <TableCell align="right">10%</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </TabPanel>
                    
                    <TabPanel value={tabValue} index={3}>
                        <Box sx={{ p: 2 }}>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Payment Method</TableCell>
                                            <TableCell align="right">Count</TableCell>
                                            <TableCell align="right">Total Amount</TableCell>
                                            <TableCell align="right">Percentage</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Card</TableCell>
                                            <TableCell align="right">652</TableCell>
                                            <TableCell align="right">$8,845.20</TableCell>
                                            <TableCell align="right">56%</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Cash</TableCell>
                                            <TableCell align="right">487</TableCell>
                                            <TableCell align="right">$5,972.35</TableCell>
                                            <TableCell align="right">37%</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Mobile Payment</TableCell>
                                            <TableCell align="right">99</TableCell>
                                            <TableCell align="right">$1,054.90</TableCell>
                                            <TableCell align="right">7%</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </TabPanel>
                </Paper>
            </Container>
        </Layout>
    );
} 