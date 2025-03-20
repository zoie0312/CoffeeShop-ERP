import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TableSortLabel,
    Box,
    Paper,
    Chip,
    Avatar,
    Typography,
    useTheme
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

type Product = {
    id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
    revenue: number;
    profit: number;
    growth: number;
};

interface ProductPerformanceTableProps {
    products: Product[];
}

export default function ProductPerformanceTable({ products }: ProductPerformanceTableProps) {
    const theme = useTheme();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [orderBy, setOrderBy] = useState<keyof Product>('revenue');
    const [order, setOrder] = useState<'asc' | 'desc'>('desc');
    
    // Sort products
    const sortedProducts = React.useMemo(() => {
        const comparator = (a: Product, b: Product) => {
            const valueA = a[orderBy];
            const valueB = b[orderBy];
            
            if (typeof valueA === 'number' && typeof valueB === 'number') {
                return order === 'asc' ? valueA - valueB : valueB - valueA;
            } else {
                const strA = String(valueA).toLowerCase();
                const strB = String(valueB).toLowerCase();
                return order === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
            }
        };
        
        return [...products].sort(comparator);
    }, [products, order, orderBy]);
    
    // Calculate pagination
    const paginatedProducts = sortedProducts.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );
    
    // Handle sort request
    const handleSort = (property: keyof Product) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    
    // Handle pagination
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    
    return (
        <Box>
            <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'category'}
                                    direction={orderBy === 'category' ? order : 'asc'}
                                    onClick={() => handleSort('category')}
                                >
                                    Category
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="right">
                                <TableSortLabel
                                    active={orderBy === 'price'}
                                    direction={orderBy === 'price' ? order : 'asc'}
                                    onClick={() => handleSort('price')}
                                >
                                    Price
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="right">
                                <TableSortLabel
                                    active={orderBy === 'quantity'}
                                    direction={orderBy === 'quantity' ? order : 'asc'}
                                    onClick={() => handleSort('quantity')}
                                >
                                    Quantity Sold
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="right">
                                <TableSortLabel
                                    active={orderBy === 'revenue'}
                                    direction={orderBy === 'revenue' ? order : 'asc'}
                                    onClick={() => handleSort('revenue')}
                                >
                                    Total Revenue
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="right">
                                <TableSortLabel
                                    active={orderBy === 'profit'}
                                    direction={orderBy === 'profit' ? order : 'asc'}
                                    onClick={() => handleSort('profit')}
                                >
                                    Profit
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="right">
                                <TableSortLabel
                                    active={orderBy === 'growth'}
                                    direction={orderBy === 'growth' ? order : 'asc'}
                                    onClick={() => handleSort('growth')}
                                >
                                    Growth
                                </TableSortLabel>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedProducts.map((product) => (
                            <TableRow key={product.id} hover>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar
                                            variant="rounded"
                                            sx={{ 
                                                bgcolor: `${theme.palette.primary.main}15`, 
                                                color: theme.palette.primary.main,
                                                width: 36,
                                                height: 36,
                                                mr: 2,
                                                fontSize: '1rem'
                                            }}
                                        >
                                            {product.name.charAt(0)}
                                        </Avatar>
                                        <Typography variant="body2" fontWeight={500}>
                                            {product.name}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={product.category} 
                                        size="small" 
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    ${product.price.toFixed(2)}
                                </TableCell>
                                <TableCell align="right">
                                    {product.quantity}
                                </TableCell>
                                <TableCell align="right">
                                    <Typography fontWeight={500}>
                                        ${product.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    ${product.profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </TableCell>
                                <TableCell align="right">
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                        {product.growth > 0 ? (
                                            <ArrowUpwardIcon 
                                                sx={{ 
                                                    color: 'success.main', 
                                                    fontSize: '1rem',
                                                    mr: 0.5
                                                }} 
                                            />
                                        ) : (
                                            <ArrowDownwardIcon 
                                                sx={{ 
                                                    color: 'error.main', 
                                                    fontSize: '1rem',
                                                    mr: 0.5
                                                }} 
                                            />
                                        )}
                                        <Typography 
                                            variant="body2" 
                                            color={product.growth > 0 ? 'success.main' : 'error.main'}
                                        >
                                            {Math.abs(product.growth)}%
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={products.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Box>
    );
} 