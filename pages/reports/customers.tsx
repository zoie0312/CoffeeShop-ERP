import React, { useState } from 'react';
import {
    Box, Typography, Card, CardContent, Grid, Paper, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, TablePagination,
    Button, IconButton, TextField, Select, MenuItem, FormControl, InputLabel,
    Tabs, Tab
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CustomDateAdapter from '../../lib/dateAdapter';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { 
    Cached as RefreshIcon, 
    Print as PrintIcon, 
    FileDownload as DownloadIcon,
    TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import Layout from '../../components/Layout';

// Import customer data
import customerData from '../../data/reports/customers.json';
import segmentData from '../../data/reports/customer-segments.json';

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
            id={`customer-tabpanel-${index}`}
            aria-labelledby={`customer-tab-${index}`}
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

export default function CustomerAnalysisPage() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [startDate, setStartDate] = useState<Date | null>(new Date(new Date().setDate(new Date().getDate() - 30)));
    const [endDate, setEndDate] = useState<Date | null>(new Date());
    const [segmentFilter, setSegmentFilter] = useState('all');
    const [tabValue, setTabValue] = useState(0);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Apply filters
    const filteredData = customerData.filter((customer: any) => {
        if (segmentFilter !== 'all' && customer.segment !== segmentFilter) {
            return false;
        }
        return true;
    });

    // Get unique segments using Array.from instead of spread operator with Set
    const segments = ['all', ...Array.from(
        new Set(customerData.map((item: any) => item.segment))
    )];

    return (
        <Layout title="Customer Analysis Report">
            <Box sx={{ padding: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Box>
                        <Button startIcon={<PrintIcon />} sx={{ mr: 1 }}>Print</Button>
                        <Button startIcon={<DownloadIcon />} sx={{ mr: 1 }}>Export</Button>
                        <IconButton>
                            <RefreshIcon />
                        </IconButton>
                    </Box>
                </Box>

                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={8}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <LocalizationProvider dateAdapter={CustomDateAdapter}>
                                <DatePicker
                                    label="Start Date"
                                    value={startDate}
                                    onChange={(newValue) => setStartDate(newValue)}
                                    slotProps={{ textField: { size: 'small' } }}
                                />
                                <DatePicker
                                    label="End Date"
                                    value={endDate}
                                    onChange={(newValue) => setEndDate(newValue)}
                                    slotProps={{ textField: { size: 'small' } }}
                                />
                            </LocalizationProvider>
                            <FormControl size="small" sx={{ minWidth: 150 }}>
                                <InputLabel id="segment-filter-label">Customer Segment</InputLabel>
                                <Select
                                    labelId="segment-filter-label"
                                    id="segment-filter"
                                    value={segmentFilter}
                                    label="Customer Segment"
                                    onChange={(e) => setSegmentFilter(e.target.value)}
                                >
                                    {segments.map((segment) => (
                                        <MenuItem key={segment} value={segment}>
                                            {segment === 'all' ? 'All Segments' : segment}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Grid>
                </Grid>

                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>Total Customers</Typography>
                                <Typography variant="h4">{filteredData.length}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>Total Visits</Typography>
                                <Typography variant="h4">
                                    {filteredData.reduce((sum, customer) => sum + customer.visits, 0).toLocaleString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>Total Revenue</Typography>
                                <Typography variant="h4">
                                    ${filteredData.reduce((sum, customer) => sum + customer.totalSpent, 0).toLocaleString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>Avg. Order Value</Typography>
                                <Typography variant="h4">
                                    ${(filteredData.reduce((sum, customer) => sum + customer.avgOrderValue, 0) / filteredData.length).toFixed(2)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                    <Tabs value={tabValue} onChange={handleChangeTab}>
                        <Tab label="Customer List" />
                        <Tab label="Customer Segments" />
                    </Tabs>
                </Box>

                <TabPanel value={tabValue} index={0}>
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <TableContainer>
                            <Table stickyHeader aria-label="customer analysis table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Customer Name</TableCell>
                                        <TableCell align="right">Total Visits</TableCell>
                                        <TableCell align="right">Total Spent</TableCell>
                                        <TableCell align="right">Avg. Order Value</TableCell>
                                        <TableCell>Last Visit</TableCell>
                                        <TableCell align="right">Loyalty Points</TableCell>
                                        <TableCell>Segment</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredData
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((customer) => (
                                            <TableRow hover key={customer.id}>
                                                <TableCell>{customer.name}</TableCell>
                                                <TableCell align="right">{customer.visits}</TableCell>
                                                <TableCell align="right">${customer.totalSpent.toFixed(2)}</TableCell>
                                                <TableCell align="right">${customer.avgOrderValue.toFixed(2)}</TableCell>
                                                <TableCell>{customer.lastVisit}</TableCell>
                                                <TableCell align="right">{customer.loyaltyPoints}</TableCell>
                                                <TableCell>{customer.segment}</TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={filteredData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <TableContainer>
                            <Table stickyHeader aria-label="segment analysis table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Segment</TableCell>
                                        <TableCell align="right">Customer Count</TableCell>
                                        <TableCell align="right">Revenue</TableCell>
                                        <TableCell align="right">% of Customers</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {segmentData.map((segment: any) => (
                                        <TableRow hover key={segment.segment}>
                                            <TableCell>{segment.segment}</TableCell>
                                            <TableCell align="right">{segment.count}</TableCell>
                                            <TableCell align="right">${segment.revenue.toFixed(2)}</TableCell>
                                            <TableCell align="right">{segment.percentage}%</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </TabPanel>
            </Box>
        </Layout>
    );
} 