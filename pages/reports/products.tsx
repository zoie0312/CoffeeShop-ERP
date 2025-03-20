import React, { useState } from 'react';
import {
    Box, Typography, Card, CardContent, Grid, Paper, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, TablePagination,
    Button, IconButton, TextField, Chip, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CustomDateAdapter from '../../lib/dateAdapter';
import { Cached as RefreshIcon, Print as PrintIcon, FileDownload as DownloadIcon } from '@mui/icons-material';
import Layout from '../../components/Layout';

// Import product performance data
import productData from '../../data/reports/products.json';

export default function ProductPerformancePage() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [startDate, setStartDate] = useState<Date | null>(new Date(new Date().setDate(new Date().getDate() - 30)));
    const [endDate, setEndDate] = useState<Date | null>(new Date());
    const [categoryFilter, setCategoryFilter] = useState('all');

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Apply filters
    const filteredData = productData.filter((product: any) => {
        if (categoryFilter !== 'all' && product.category !== categoryFilter) {
            return false;
        }
        return true;
    });

    // Get unique categories using Array.from instead of spread operator with Set
    const categories = ['all', ...Array.from(
        new Set(productData.map((item: any) => item.category))
    )];

    return (
        <Layout title="Product Performance Report">
            <Box sx={{ padding: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h4" component="h1">Product Performance Report</Typography>
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
                        </Box>
                    </Grid>
                </Grid>

                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>Total Products Sold</Typography>
                                <Typography variant="h4">
                                    {filteredData.reduce((sum, product) => sum + product.quantity, 0).toLocaleString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>Total Revenue</Typography>
                                <Typography variant="h4">
                                    ${filteredData.reduce((sum, product) => sum + product.revenue, 0).toLocaleString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>Total Profit</Typography>
                                <Typography variant="h4">
                                    ${filteredData.reduce((sum, product) => sum + product.profit, 0).toLocaleString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>Average Growth</Typography>
                                <Typography variant="h4">
                                    {(filteredData.reduce((sum, product) => sum + product.growth, 0) / filteredData.length).toFixed(1)}%
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer>
                        <Table stickyHeader aria-label="product performance table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product Name</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell align="right">Quantity Sold</TableCell>
                                    <TableCell align="right">Revenue</TableCell>
                                    <TableCell align="right">Profit</TableCell>
                                    <TableCell align="right">Growth</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((product) => (
                                        <TableRow hover key={product.id}>
                                            <TableCell>{product.name}</TableCell>
                                            <TableCell>{product.category}</TableCell>
                                            <TableCell align="right">{product.quantity.toLocaleString()}</TableCell>
                                            <TableCell align="right">${product.revenue.toLocaleString()}</TableCell>
                                            <TableCell align="right">${product.profit.toLocaleString()}</TableCell>
                                            <TableCell align="right">
                                                <Chip 
                                                    label={`${product.growth > 0 ? '+' : ''}${product.growth}%`}
                                                    color={product.growth >= 0 ? 'success' : 'error'}
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