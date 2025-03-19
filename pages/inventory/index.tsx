import React, { useState, useMemo, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import InventoryTransactions from '@/components/inventory/InventoryTransactions';
import InventoryItemForm from '@/components/inventory/InventoryItemForm';
import RecordTransactionForm from '@/components/inventory/RecordTransactionForm';
import { 
  Box, 
  Button, 
  Card, 
  Grid, 
  Typography, 
  Tabs, 
  Tab, 
  TextField,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Badge,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { InventoryItem, InventoryCategory, InventoryTransaction, Supplier } from '@/types';

// Import inventory data
import inventoryData from '@/data/inventory.json';
import categoriesData from '@/data/inventory-categories.json';
import transactionsData from '@/data/inventory-transactions.json';
import suppliersData from '@/data/suppliers.json';
import { useTheme } from '@mui/material/styles';

const InventoryPage: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();

  // State for inventory items and filters
  const [inventory, setInventory] = useState<InventoryItem[]>(inventoryData as InventoryItem[]);
  const [categories] = useState<InventoryCategory[]>(categoriesData as InventoryCategory[]);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>(transactionsData as InventoryTransaction[]);
  const [suppliers] = useState<Supplier[]>(suppliersData as Supplier[]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'inventory' | 'transactions'>('inventory');
  
  // Form dialogs state
  const [inventoryFormOpen, setInventoryFormOpen] = useState(false);
  const [transactionFormOpen, setTransactionFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | undefined>(undefined);
  const [editingTransaction, setEditingTransaction] = useState<InventoryTransaction | undefined>(undefined);

  // Load data on router changes
  useEffect(() => {
    // Refresh data when router changes
    setInventory(inventoryData as InventoryItem[]);
    setTransactions(transactionsData as InventoryTransaction[]);
  }, [router.asPath]);

  // Filter inventory based on active tab and search term
  const filteredInventory = useMemo(() => {
    const filtered = inventory.filter(item => {
      const matchesCategory = activeTab === 'all' || item.category === activeTab;
      const matchesSearch = 
        searchTerm === '' || 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
    
    return filtered;
  }, [inventory, activeTab, searchTerm]);

  // Calculate low stock items
  const lowStockItems = useMemo(() => {
    return inventory.filter(item => item.currentStock <= item.reorderPoint);
  }, [inventory]);

  // Event handlers
  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
    setPage(0); // Reset to first page when changing tabs
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to first page when searching
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, itemId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedItemId(itemId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItemId(null);
  };

  // Function to get stock level status
  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= item.reorderPoint) {
      return {
        status: 'low',
        color: 'error',
        text: 'Low Stock'
      };
    } else if (item.currentStock <= item.idealStock * 0.5) {
      return {
        status: 'medium',
        color: 'warning',
        text: 'Medium'
      };
    } else {
      return {
        status: 'ok',
        color: 'success',
        text: 'OK'
      };
    }
  };

  // Handle add/edit inventory item
  const handleAddItem = () => {
    setEditingItem(undefined);
    setInventoryFormOpen(true);
  };

  const handleEditItem = (itemId: string) => {
    const item = inventory.find(i => i.id === itemId);
    if (item) {
      setEditingItem(item);
      setInventoryFormOpen(true);
    }
    handleMenuClose();
  };

  const handleSaveItem = (item: InventoryItem) => {
    if (editingItem) {
      // Edit existing item
      setInventory(prev => 
        prev.map(i => i.id === item.id ? item : i)
      );
    } else {
      // Add new item
      setInventory(prev => [...prev, item]);
    }
    setInventoryFormOpen(false);
  };

  // Handle add/edit transaction
  const handleAddTransaction = () => {
    setEditingTransaction(undefined);
    setTransactionFormOpen(true);
  };

  const handleSaveTransaction = (transaction: InventoryTransaction) => {
    if (editingTransaction) {
      // Edit existing transaction
      setTransactions(prev => 
        prev.map(t => t.id === transaction.id ? transaction : t)
      );
    } else {
      // Add new transaction
      setTransactions(prev => [...prev, transaction]);
      
      // Update inventory stock level
      setInventory(prev => {
        return prev.map(item => {
          if (item.id === transaction.inventoryId) {
            const stockChange = transaction.type === 'restock' 
              ? transaction.quantity 
              : -Math.abs(transaction.quantity);
              
            return {
              ...item,
              currentStock: Math.max(0, item.currentStock + stockChange),
              lastRestocked: transaction.type === 'restock' 
                ? transaction.date 
                : item.lastRestocked
            };
          }
          return item;
        });
      });
    }
    setTransactionFormOpen(false);
  };

  // Handle restock item
  const handleRestockItem = (itemId: string) => {
    const item = inventory.find(i => i.id === itemId);
    if (item) {
      setEditingTransaction({
        id: '',
        inventoryId: item.id,
        date: new Date().toISOString().split('T')[0],
        type: 'restock',
        quantity: item.idealStock - item.currentStock,
        unitCost: item.costPerUnit,
        totalCost: (item.idealStock - item.currentStock) * item.costPerUnit,
        notes: `Restock to ideal level (${item.idealStock} ${item.unit})`
      });
      setTransactionFormOpen(true);
    }
    handleMenuClose();
  };

  return (
    <Layout title="Inventory Management">
      <Head>
        <title>Inventory Management | Bean Counter Coffee Shop ERP</title>
      </Head>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          {/* Summary Cards */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <InventoryIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="h6">Total Items</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {inventory.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Across {categories.length} categories
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Badge badgeContent={lowStockItems.length} color="error">
                  <WarningIcon sx={{ mr: 1, color: theme.palette.warning.main }} />
                </Badge>
                <Typography variant="h6">Low Stock Items</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {lowStockItems.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Items below reorder level
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <RefreshIcon sx={{ mr: 1, color: theme.palette.success.main }} />
                <Typography variant="h6">Value on Hand</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                ${inventory.reduce((sum, item) => sum + (item.currentStock * item.costPerUnit), 0).toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total inventory value
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {lowStockItems.length > 0 && (
        <Alert 
          severity="warning" 
          sx={{ mb: 3 }}
          action={
            <Button 
              color="inherit" 
              size="small"
              onClick={() => {
                // Find the item with lowest stock relative to reorder point
                const itemToRestock = lowStockItems.reduce((lowest, current) => {
                  const lowestRatio = lowest.currentStock / lowest.reorderPoint;
                  const currentRatio = current.currentStock / current.reorderPoint;
                  return currentRatio < lowestRatio ? current : lowest;
                });
                
                handleRestockItem(itemToRestock.id);
              }}
            >
              Order Now
            </Button>
          }
        >
          You have {lowStockItems.length} items that need reordering soon.
        </Alert>
      )}

      {/* Toggle between Inventory and Transactions view */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant={activeView === 'inventory' ? 'contained' : 'outlined'} 
            onClick={() => setActiveView('inventory')}
          >
            Inventory Items
          </Button>
          <Button 
            variant={activeView === 'transactions' ? 'contained' : 'outlined'} 
            onClick={() => setActiveView('transactions')}
          >
            Transaction History
          </Button>
        </Box>
        <Button 
          variant="outlined"
          onClick={() => window.location.href = '/inventory/suppliers'}
          startIcon={<PeopleIcon />}
        >
          Manage Suppliers
        </Button>
      </Box>

      {activeView === 'inventory' ? (
        <Card sx={{ mb: 4 }}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6">Inventory Items</Typography>
            <Box>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={handleAddItem}
              >
                Add Item
              </Button>
            </Box>
          </Box>

          <Box sx={{ p: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: { xs: 'stretch', sm: 'center' }, borderBottom: 1, borderColor: 'divider' }}>
            <TextField
              placeholder="Search inventory..."
              variant="outlined"
              size="small"
              fullWidth
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: { sm: 300 } }}
            />
            
            <Tabs 
              value={activeTab} 
              onChange={handleChangeTab}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ 
                minHeight: 'auto',
                '.MuiTab-root': { minHeight: '40px', py: 0 }
              }}
            >
              <Tab label="All" value="all" />
              {categories.map(category => (
                <Tab key={category.id} label={category.name} value={category.name} />
              ))}
            </Tabs>
          </Box>

          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table sx={{ minWidth: 650 }} aria-label="inventory table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Stock Level</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell>Cost / Unit</TableCell>
                  <TableCell>Total Value</TableCell>
                  <TableCell>Supplier</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredInventory
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => {
                    const stockStatus = getStockStatus(item);
                    return (
                      <TableRow key={item.id} hover>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Chip 
                              label={stockStatus.text} 
                              color={stockStatus.color as any} 
                              size="small" 
                              sx={{ mr: 1 }}
                            />
                            {item.currentStock} / {item.idealStock}
                          </Box>
                        </TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>${item.costPerUnit.toFixed(2)}</TableCell>
                        <TableCell>${(item.currentStock * item.costPerUnit).toFixed(2)}</TableCell>
                        <TableCell>{item.supplier}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="More options">
                            <IconButton
                              onClick={(e) => handleMenuClick(e, item.id)}
                              size="small"
                            >
                              <MoreIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {filteredInventory.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1" color="text.secondary">
                        No inventory items found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredInventory.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      ) : (
        <InventoryTransactions 
          transactions={transactions} 
          inventory={inventory}
          onAddTransaction={handleAddTransaction}
        />
      )}

      {/* Menu for inventory item actions */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => selectedItemId && handleEditItem(selectedItemId)}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => selectedItemId && handleRestockItem(selectedItemId)}>
          <RefreshIcon fontSize="small" sx={{ mr: 1 }} />
          Restock
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Forms for adding/editing items */}
      {inventoryFormOpen && (
        <InventoryItemForm
          open={inventoryFormOpen}
          onClose={() => setInventoryFormOpen(false)}
          onSave={handleSaveItem}
          item={editingItem}
          categories={categories}
          suppliers={suppliers}
          mode={editingItem ? 'edit' : 'add'}
        />
      )}

      {/* Forms for recording transactions */}
      {transactionFormOpen && (
        <RecordTransactionForm
          open={transactionFormOpen}
          onClose={() => setTransactionFormOpen(false)}
          onSave={handleSaveTransaction}
          inventory={inventory}
          suppliers={suppliers}
          transaction={editingTransaction}
          mode={editingTransaction ? 'edit' : 'add'}
        />
      )}
    </Layout>
  );
};

export default InventoryPage; 