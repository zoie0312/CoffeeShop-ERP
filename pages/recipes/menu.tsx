import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Button,
    Tabs,
    Tab,
    TextField,
    InputAdornment,
    Select,
    MenuItem as MuiMenuItem,
    FormControl,
    InputLabel,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Snackbar,
    Alert,
    Paper,
    Divider,
    Chip,
    Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import LayersIcon from '@mui/icons-material/Layers';
import Layout from '../../components/Layout';
import MenuItemCard from '../../components/recipes/MenuItemCard';
import MenuItemForm from '../../components/recipes/MenuItemForm';
import { MenuItem as MenuItemType, Recipe, MenuCategory } from '../../types';

// Import mock data directly
import menuItemsData from '../../data/menu-items.json';
import recipesData from '../../data/recipes.json';
import categoriesData from '../../data/menu-categories.json';

// Type assertions for imported data
const menuItems = menuItemsData as MenuItemType[];
const recipes = recipesData as Recipe[];
const menuCategories = categoriesData as MenuCategory[];

export default function MenuPage() {
    // State for menu items data - initialized with imported data directly
    const [menuItemsList, setMenuItemsList] = useState<MenuItemType[]>(menuItems);
    const [filteredMenuItems, setFilteredMenuItems] = useState<MenuItemType[]>(menuItems);
    const [activeRecipes, setActiveRecipes] = useState<Recipe[]>(
        recipes.filter(recipe => recipe.isActive)
    );
    const [categories, setCategories] = useState<string[]>(
        menuCategories.filter(category => category.isActive).map(cat => cat.name)
    );
    
    // State for UI
    const [loading, setLoading] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('');
    const [viewMode, setViewMode] = useState<'all' | 'featured' | 'seasonal'>('all');
    
    // State for menu item form dialog
    const [formOpen, setFormOpen] = useState(false);
    const [currentMenuItem, setCurrentMenuItem] = useState<MenuItemType | undefined>(undefined);
    
    // State for snackbar
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });
    
    // Filter menu items when search term, category filter, tab value or view mode changes
    useEffect(() => {
        let filtered = [...menuItemsList];
        
        // Filter by active status based on tab value
        if (tabValue === 0) {
            filtered = filtered.filter(item => item.isActive);
        } else if (tabValue === 1) {
            filtered = filtered.filter(item => !item.isActive);
        }
        
        // Apply view mode filter
        if (viewMode === 'featured') {
            filtered = filtered.filter(item => item.isFeatured);
        } else if (viewMode === 'seasonal') {
            filtered = filtered.filter(item => item.isSeasonalItem);
        }
        
        // Filter by search term
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            filtered = filtered.filter(item => 
                item.name.toLowerCase().includes(search) || 
                item.description.toLowerCase().includes(search)
            );
        }
        
        // Filter by category
        if (categoryFilter) {
            filtered = filtered.filter(item => item.category === categoryFilter);
        }
        
        setFilteredMenuItems(filtered);
    }, [menuItemsList, searchTerm, categoryFilter, tabValue, viewMode]);
    
    // Handle tab change
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };
    
    // Open form to add a new menu item
    const handleAddMenuItem = () => {
        setCurrentMenuItem(undefined);
        setFormOpen(true);
    };
    
    // Open form to edit an existing menu item
    const handleEditMenuItem = (menuItem: MenuItemType) => {
        setCurrentMenuItem(menuItem);
        setFormOpen(true);
    };
    
    // Handle form submission (add or update menu item)
    const handleSaveMenuItem = (menuItem: MenuItemType) => {
        try {
            if (menuItem.id && menuItemsList.some(item => item.id === menuItem.id)) {
                // Update existing menu item
                const updatedMenuItems = menuItemsList.map(item => 
                    item.id === menuItem.id ? menuItem : item
                );
                setMenuItemsList(updatedMenuItems);
                setSnackbar({
                    open: true,
                    message: 'Menu item updated successfully',
                    severity: 'success'
                });
            } else {
                // Add new menu item
                setMenuItemsList([...menuItemsList, menuItem]);
                setSnackbar({
                    open: true,
                    message: 'Menu item added successfully',
                    severity: 'success'
                });
            }
            setFormOpen(false);
        } catch (error) {
            console.error('Failed to save menu item:', error);
            setSnackbar({
                open: true,
                message: 'Failed to save menu item',
                severity: 'error'
            });
        }
    };
    
    // Close form dialog
    const handleCloseForm = () => {
        setFormOpen(false);
        setCurrentMenuItem(undefined);
    };
    
    // Toggle menu item active status
    const toggleMenuItemStatus = (menuItem: MenuItemType) => {
        const updatedMenuItem = {
            ...menuItem,
            isActive: !menuItem.isActive,
            dateModified: new Date().toISOString()
        };
        
        const updatedMenuItems = menuItemsList.map(item => 
            item.id === menuItem.id ? updatedMenuItem : item
        );
        
        setMenuItemsList(updatedMenuItems);
        
        setSnackbar({
            open: true,
            message: `Menu item ${updatedMenuItem.isActive ? 'activated' : 'deactivated'} successfully`,
            severity: 'success'
        });
    };
    
    // Close snackbar
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };
    
    // Handle view mode change
    const handleViewModeChange = (mode: 'all' | 'featured' | 'seasonal') => {
        setViewMode(mode);
    };
    
    return (
        <Layout title="Menu Management">
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1">
                        Menu Management
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleAddMenuItem}
                    >
                        Add Menu Item
                    </Button>
                </Box>
                
                {/* Filters */}
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                label="Search Menu Items"
                                variant="outlined"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                    endAdornment: searchTerm ? (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="clear search"
                                                onClick={() => setSearchTerm('')}
                                                edge="end"
                                            >
                                                <CloseIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ) : null
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="category-filter-label">Filter by Category</InputLabel>
                                <Select
                                    labelId="category-filter-label"
                                    id="category-filter"
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value as string)}
                                    label="Filter by Category"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <FilterListIcon />
                                        </InputAdornment>
                                    }
                                >
                                    <MuiMenuItem value="">
                                        <em>All Categories</em>
                                    </MuiMenuItem>
                                    {categories.map((category) => (
                                        <MuiMenuItem key={category} value={category}>
                                            {category}
                                        </MuiMenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Stack direction="row" spacing={1}>
                                <Chip
                                    label="All Items"
                                    onClick={() => handleViewModeChange('all')}
                                    color={viewMode === 'all' ? 'primary' : 'default'}
                                    variant={viewMode === 'all' ? 'filled' : 'outlined'}
                                />
                                <Chip
                                    label="Featured"
                                    onClick={() => handleViewModeChange('featured')}
                                    color={viewMode === 'featured' ? 'primary' : 'default'}
                                    variant={viewMode === 'featured' ? 'filled' : 'outlined'}
                                />
                                <Chip
                                    label="Seasonal"
                                    onClick={() => handleViewModeChange('seasonal')}
                                    color={viewMode === 'seasonal' ? 'primary' : 'default'}
                                    variant={viewMode === 'seasonal' ? 'filled' : 'outlined'}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            {filteredMenuItems.length > 0 && (
                                <Typography variant="subtitle1" sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                                    Showing {filteredMenuItems.length} of {menuItemsList.length} items
                                </Typography>
                            )}
                        </Grid>
                    </Grid>
                </Paper>
                
                {/* Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs 
                        value={tabValue}
                        onChange={handleTabChange}
                        aria-label="menu item status tabs"
                    >
                        <Tab label="Active Menu Items" />
                        <Tab label="Inactive Menu Items" />
                        <Tab label="All Menu Items" />
                    </Tabs>
                </Box>
                
                {/* Menu Item Grid */}
                {loading ? (
                    <Typography variant="body1">Loading menu items...</Typography>
                ) : filteredMenuItems.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 5 }}>
                        <Typography variant="h6" color="text.secondary">
                            No menu items found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {searchTerm || categoryFilter || viewMode !== 'all'
                                ? 'Try adjusting your filters'
                                : 'Add your first menu item to get started'}
                        </Typography>
                        {!searchTerm && !categoryFilter && viewMode === 'all' && (
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                onClick={handleAddMenuItem}
                                sx={{ mt: 2 }}
                            >
                                Add Menu Item
                            </Button>
                        )}
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {filteredMenuItems.map((menuItem) => (
                            <Grid item xs={12} sm={6} md={4} key={menuItem.id}>
                                <MenuItemCard
                                    menuItem={menuItem}
                                    onSelect={() => handleEditMenuItem(menuItem)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                )}
                
                {/* Menu Item Form Dialog */}
                <Dialog
                    open={formOpen}
                    onClose={handleCloseForm}
                    aria-labelledby="menu-item-form-dialog-title"
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle id="menu-item-form-dialog-title">
                        {currentMenuItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                        <IconButton
                            aria-label="close"
                            onClick={handleCloseForm}
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
                        <MenuItemForm
                            menuItem={currentMenuItem}
                            recipes={activeRecipes}
                            categories={categories}
                            onSubmit={handleSaveMenuItem}
                            onCancel={handleCloseForm}
                        />
                    </DialogContent>
                </Dialog>
                
                {/* Snackbar for notifications */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity={snackbar.severity}
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </Layout>
    );
} 