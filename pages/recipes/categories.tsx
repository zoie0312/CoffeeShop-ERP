import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Grid,
    Typography,
    Button,
    Paper,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Divider,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Tabs,
    Tab,
    Snackbar,
    Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import Layout from '../../components/Layout';
import { MenuCategory } from '../../types';

// Import mock data directly
import menuCategoriesData from '../../data/menu-categories.json';

// Type assertion to ensure JSON data conforms to our MenuCategory type
const menuCategories = menuCategoriesData as MenuCategory[];

// Generate a unique ID for new categories
const generateId = (): string => {
    return 'mc' + Math.random().toString(36).substring(2, 9);
};

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
            id={`category-tabpanel-${index}`}
            aria-labelledby={`category-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}

export default function CategoriesPage() {
    // State for categories
    const [categories, setCategories] = useState<MenuCategory[]>(menuCategories);
    const [tabValue, setTabValue] = useState(0);
    
    // Filtered categories based on tab value
    const [filteredCategories, setFilteredCategories] = useState<MenuCategory[]>([]);
    
    // State for category form
    const [formOpen, setFormOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<MenuCategory | null>(null);
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [categoryDisplayOrder, setCategoryDisplayOrder] = useState<number>(0);
    const [categoryActive, setCategoryActive] = useState(true);
    
    // State for delete confirmation
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<MenuCategory | null>(null);
    
    // State for snackbar
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });
    
    // Filter categories when tab changes
    useEffect(() => {
        if (tabValue === 0) {
            // Active categories
            setFilteredCategories(categories.filter(cat => cat.isActive));
        } else if (tabValue === 1) {
            // Inactive categories
            setFilteredCategories(categories.filter(cat => !cat.isActive));
        } else {
            // All categories
            setFilteredCategories(categories);
        }
    }, [categories, tabValue]);
    
    // Handle tab change
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };
    
    // Open form to add a new category
    const handleAddCategory = () => {
        setCurrentCategory(null);
        setCategoryName('');
        setCategoryDescription('');
        setCategoryDisplayOrder(categories.length + 1);
        setCategoryActive(true);
        setFormOpen(true);
    };
    
    // Open form to edit an existing category
    const handleEditCategory = (category: MenuCategory) => {
        setCurrentCategory(category);
        setCategoryName(category.name);
        setCategoryDescription(category.description);
        setCategoryDisplayOrder(category.displayOrder);
        setCategoryActive(category.isActive);
        setFormOpen(true);
    };
    
    // Handle form submission
    const handleSaveCategory = () => {
        if (!categoryName.trim()) {
            setSnackbar({
                open: true,
                message: 'Category name is required',
                severity: 'error'
            });
            return;
        }
        
        const updatedCategory: MenuCategory = {
            id: currentCategory?.id || generateId(),
            name: categoryName.trim(),
            description: categoryDescription.trim(),
            displayOrder: categoryDisplayOrder,
            isActive: categoryActive
        };
        
        if (currentCategory) {
            // Update existing category
            const updatedCategories = categories.map(cat => 
                cat.id === currentCategory.id ? updatedCategory : cat
            );
            setCategories(updatedCategories);
            setSnackbar({
                open: true,
                message: 'Category updated successfully',
                severity: 'success'
            });
        } else {
            // Add new category
            setCategories([...categories, updatedCategory]);
            setSnackbar({
                open: true,
                message: 'Category added successfully',
                severity: 'success'
            });
        }
        
        setFormOpen(false);
    };
    
    // Toggle category active status
    const toggleCategoryStatus = (category: MenuCategory) => {
        const updatedCategory = {
            ...category,
            isActive: !category.isActive
        };
        
        const updatedCategories = categories.map(cat => 
            cat.id === category.id ? updatedCategory : cat
        );
        
        setCategories(updatedCategories);
        
        setSnackbar({
            open: true,
            message: `Category ${updatedCategory.isActive ? 'activated' : 'deactivated'} successfully`,
            severity: 'success'
        });
    };
    
    // Open delete confirmation dialog
    const handleDeleteConfirmation = (category: MenuCategory) => {
        setCategoryToDelete(category);
        setDeleteDialogOpen(true);
    };
    
    // Delete category
    const handleDeleteCategory = () => {
        if (categoryToDelete) {
            const updatedCategories = categories.filter(cat => cat.id !== categoryToDelete.id);
            setCategories(updatedCategories);
            
            setSnackbar({
                open: true,
                message: 'Category deleted successfully',
                severity: 'success'
            });
        }
        
        setDeleteDialogOpen(false);
        setCategoryToDelete(null);
    };
    
    // Close form dialog
    const handleCloseForm = () => {
        setFormOpen(false);
        setCurrentCategory(null);
    };
    
    // Close snackbar
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };
    
    return (
        <Layout title="Category Management">
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1">
                        Category Management
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleAddCategory}
                    >
                        Add Category
                    </Button>
                </Box>
                
                {/* Tabs */}
                <Paper sx={{ mb: 3 }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        <Tab label="Active Categories" />
                        <Tab label="Inactive Categories" />
                        <Tab label="All Categories" />
                    </Tabs>
                </Paper>
                
                {/* Categories Table */}
                <TabPanel value={tabValue} index={0}>
                    <CategoryTable 
                        categories={filteredCategories} 
                        onEdit={handleEditCategory}
                        onToggleStatus={toggleCategoryStatus}
                        onDelete={handleDeleteConfirmation}
                    />
                </TabPanel>
                
                <TabPanel value={tabValue} index={1}>
                    <CategoryTable 
                        categories={filteredCategories} 
                        onEdit={handleEditCategory}
                        onToggleStatus={toggleCategoryStatus}
                        onDelete={handleDeleteConfirmation}
                    />
                </TabPanel>
                
                <TabPanel value={tabValue} index={2}>
                    <CategoryTable 
                        categories={filteredCategories} 
                        onEdit={handleEditCategory}
                        onToggleStatus={toggleCategoryStatus}
                        onDelete={handleDeleteConfirmation}
                    />
                </TabPanel>
                
                {/* Category Form Dialog */}
                <Dialog 
                    open={formOpen} 
                    onClose={handleCloseForm}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>
                        {currentCategory ? 'Edit Category' : 'Add New Category'}
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
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Category Name"
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    required
                                    error={!categoryName.trim()}
                                    helperText={!categoryName.trim() ? 'Name is required' : ''}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    value={categoryDescription}
                                    onChange={(e) => setCategoryDescription(e.target.value)}
                                    multiline
                                    rows={2}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Display Order"
                                    type="number"
                                    value={categoryDisplayOrder}
                                    onChange={(e) => setCategoryDisplayOrder(parseInt(e.target.value))}
                                    inputProps={{ min: 1 }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Chip
                                    label={categoryActive ? 'Active' : 'Inactive'}
                                    color={categoryActive ? 'success' : 'default'}
                                    onClick={() => setCategoryActive(!categoryActive)}
                                    sx={{ mt: 2 }}
                                />
                                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                    Click to toggle status
                                </Typography>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseForm}>Cancel</Button>
                        <Button 
                            onClick={handleSaveCategory} 
                            variant="contained" 
                            color="primary"
                            disabled={!categoryName.trim()}
                        >
                            {currentCategory ? 'Update' : 'Create'}
                        </Button>
                    </DialogActions>
                </Dialog>
                
                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                >
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to delete the category "<strong>{categoryToDelete?.name}</strong>"? 
                            This action cannot be undone.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleDeleteCategory} color="error">Delete</Button>
                    </DialogActions>
                </Dialog>
                
                {/* Snackbar */}
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
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </Layout>
    );
}

// Category Table Component
interface CategoryTableProps {
    categories: MenuCategory[];
    onEdit: (category: MenuCategory) => void;
    onToggleStatus: (category: MenuCategory) => void;
    onDelete: (category: MenuCategory) => void;
}

function CategoryTable({ categories, onEdit, onToggleStatus, onDelete }: CategoryTableProps) {
    // Sort categories by display order
    const sortedCategories = [...categories].sort((a, b) => a.displayOrder - b.displayOrder);
    
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Order</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedCategories.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} align="center">
                                <Typography variant="body1" sx={{ py: 2 }}>
                                    No categories found
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        sortedCategories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell>{category.displayOrder}</TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2">
                                        {category.name}
                                    </Typography>
                                </TableCell>
                                <TableCell>{category.description}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={category.isActive ? 'Active' : 'Inactive'}
                                        color={category.isActive ? 'success' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <IconButton 
                                            size="small" 
                                            color="primary" 
                                            onClick={() => onEdit(category)}
                                            title="Edit"
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton 
                                            size="small" 
                                            color={category.isActive ? 'warning' : 'success'} 
                                            onClick={() => onToggleStatus(category)}
                                            title={category.isActive ? 'Deactivate' : 'Activate'}
                                        >
                                            {category.isActive ? 
                                                <VisibilityOffIcon fontSize="small" /> : 
                                                <VisibilityIcon fontSize="small" />
                                            }
                                        </IconButton>
                                        <IconButton 
                                            size="small" 
                                            color="error" 
                                            onClick={() => onDelete(category)}
                                            title="Delete"
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
} 