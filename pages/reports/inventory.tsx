import React, { useState } from 'react';
import {
    Box, Typography, Card, CardContent, Grid, Paper, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, TablePagination,
    Button, IconButton, TextField, Select, MenuItem, FormControl, InputLabel,
    LinearProgress, Chip
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CustomDateAdapter from '../../lib/dateAdapter';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { 
    Cached as RefreshIcon, 
    Print as PrintIcon, 
    FileDownload as DownloadIcon
} from '@mui/icons-material';
import Layout from '../../components/Layout';

// Import inventory data
import inventoryData from '../../data/reports/inventory.json';

// Helper function to get color for stock status
const getStockStatusColor = (status: string) => {
    switch (status) {
        case 'Critical':
            return 'error';
        case 'Low':
            return 'warning';
        case 'Adequate':
            return 'success';
        case 'Overstocked':
            return 'info';
        default:
            return 'default';
    }
};

export default function InventoryTurnoverPage() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [startDate, setStartDate] = useState<Date | null>(new Date(new Date().setDate(new Date().getDate() - 30)));
    const [endDate, setEndDate] = useState<Date | null>(new Date());
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Apply filters
    const filteredData = inventoryData.filter((item: any) => {
        if (categoryFilter !== 'all' && item.category !== categoryFilter) {
            return false;
        }
        if (statusFilter !== 'all' && item.stockStatus !== statusFilter) {
            return false;
        }
        return true;
    });

    // Get unique categories and statuses using Array.from
    const categories = ['all', ...Array.from(
        new Set(inventoryData.map((item: any) => item.category))
    )];
    
    const statuses = ['all', ...Array.from(
        new Set(inventoryData.map((item: any) => item.stockStatus))
    )];

    // Calculate summary metrics
    const totalInventoryValue = filteredData.reduce((sum, item) => sum + item.costValue, 0);
    const avgTurnoverRate = filteredData.reduce((sum, item) => sum + item.turnoverRate, 0) / filteredData.length;
    const criticalItems = filteredData.filter(item => item.stockStatus === 'Critical').length;
    const overstockedItems = filteredData.filter(item => item.stockStatus === 'Overstocked').length;

    return (
        <Layout title="Inventory Turnover Report">
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
                                <InputLabel id="category-filter-label">Category</InputLabel>
                                <Select
                                    labelId="category-filter-label"
                                    id="category-filter"
                                    value={categoryFilter}
                                    label="Category"
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category} value={category}>
                                            {category === 'all' ? 'All Categories' : category}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl size="small" sx={{ minWidth: 150 }}>
                                <InputLabel id="status-filter-label">Stock Status</InputLabel>
                                <Select
                                    labelId="status-filter-label"
                                    id="status-filter"
                                    value={statusFilter}
                                    label="Stock Status"
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    {statuses.map((status) => (
                                        <MenuItem key={status} value={status}>
                                            {status === 'all' ? 'All Statuses' : status}
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
                                <Typography color="textSecondary" gutterBottom>Inventory Value</Typography>
                                <Typography variant="h4">${totalInventoryValue.toLocaleString()}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>Avg Turnover Rate</Typography>
                                <Typography variant="h4">{avgTurnoverRate.toFixed(2)}x</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>Critical Items</Typography>
                                <Typography variant="h4">{criticalItems}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>Overstocked Items</Typography>
                                <Typography variant="h4">{overstockedItems}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer>
                        <Table stickyHeader aria-label="inventory turnover table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell align="right">Units Sold</TableCell>
                                    <TableCell align="right">Ending Inventory</TableCell>
                                    <TableCell align="right">Turnover Rate</TableCell>
                                    <TableCell align="right">Avg Days to Sell</TableCell>
                                    <TableCell>Stock Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((item) => (
                                        <TableRow hover key={item.id}>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.category}</TableCell>
                                            <TableCell align="right">{item.unitsSold}</TableCell>
                                            <TableCell align="right">{item.endingInventory}</TableCell>
                                            <TableCell align="right">{item.turnoverRate.toFixed(2)}x</TableCell>
                                            <TableCell align="right">{item.averageDaysToSell.toFixed(1)}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={item.stockStatus}
                                                    color={getStockStatusColor(item.stockStatus) as any}
                                                    size="small"
                                                />
                                            </TableCell>
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
            </Box>
        </Layout>
    );
} 