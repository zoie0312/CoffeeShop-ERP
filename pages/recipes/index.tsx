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
    MenuItem,
    FormControl,
    InputLabel,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Snackbar,
    Alert,
    Paper,
    Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import Layout from '../../components/Layout';
import RecipeCard from '../../components/recipes/RecipeCard';
import RecipeForm from '../../components/recipes/RecipeForm';
import { Recipe, InventoryItem } from '../../types';

// Import mock data directly
import recipesData from '../../data/recipes.json';
import inventoryData from '../../data/inventory.json';

// Type assertion to ensure JSON data conforms to our types
const recipes = recipesData as Recipe[];
const inventoryItems = inventoryData as InventoryItem[];

// Extract unique categories from recipes
const extractCategories = (recipes: Recipe[]): string[] => {
    const categories = new Set<string>();
    recipes.forEach(recipe => {
        if (recipe.category) {
            categories.add(recipe.category);
        }
    });
    return Array.from(categories).sort();
};

export default function RecipesPage() {
    // State for recipes data
    const [recipesList, setRecipesList] = useState<Recipe[]>(recipes);
    const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(recipes);
    const [categories, setCategories] = useState<string[]>(extractCategories(recipes));
    
    // State for UI
    const [tabValue, setTabValue] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('');
    
    // State for recipe form dialog
    const [formOpen, setFormOpen] = useState(false);
    const [currentRecipe, setCurrentRecipe] = useState<Recipe | undefined>(undefined);
    
    // State for snackbar
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });
    
    // State for recipe detail view
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    
    // Filter recipes when search term or category filter changes
    useEffect(() => {
        let filtered = [...recipesList];
        
        // Filter by active status based on tab value
        if (tabValue === 0) {
            filtered = filtered.filter(recipe => recipe.isActive);
        } else if (tabValue === 1) {
            filtered = filtered.filter(recipe => !recipe.isActive);
        }
        
        // Filter by search term
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            filtered = filtered.filter(recipe => 
                recipe.name.toLowerCase().includes(search) || 
                recipe.description.toLowerCase().includes(search)
            );
        }
        
        // Filter by category
        if (categoryFilter) {
            filtered = filtered.filter(recipe => recipe.category === categoryFilter);
        }
        
        setFilteredRecipes(filtered);
    }, [recipesList, searchTerm, categoryFilter, tabValue]);
    
    // Handle tab change
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };
    
    // Open form to add a new recipe
    const handleAddRecipe = () => {
        setCurrentRecipe(undefined);
        setFormOpen(true);
    };
    
    // Open form to edit an existing recipe
    const handleEditRecipe = (recipe: Recipe) => {
        setCurrentRecipe(recipe);
        setFormOpen(true);
    };
    
    // Handle form submission (add or update recipe)
    const handleSaveRecipe = (recipe: Recipe) => {
        try {
            if (recipe.id && recipesList.some(r => r.id === recipe.id)) {
                // Update existing recipe
                const updatedRecipes = recipesList.map(r => 
                    r.id === recipe.id ? recipe : r
                );
                setRecipesList(updatedRecipes);
                setSnackbar({
                    open: true,
                    message: 'Recipe updated successfully',
                    severity: 'success'
                });
            } else {
                // Add new recipe
                setRecipesList([...recipesList, recipe]);
                setSnackbar({
                    open: true,
                    message: 'Recipe added successfully',
                    severity: 'success'
                });
            }
            setFormOpen(false);
            
            // Update categories if needed
            if (!categories.includes(recipe.category)) {
                setCategories([...categories, recipe.category].sort());
            }
        } catch (error) {
            console.error('Failed to save recipe:', error);
            setSnackbar({
                open: true,
                message: 'Failed to save recipe',
                severity: 'error'
            });
        }
    };
    
    // Close form dialog
    const handleCloseForm = () => {
        setFormOpen(false);
        setCurrentRecipe(undefined);
    };
    
    // View recipe details
    const handleViewRecipe = (recipe: Recipe) => {
        setSelectedRecipe(recipe);
        setDetailOpen(true);
    };
    
    // Close recipe details
    const handleCloseDetail = () => {
        setDetailOpen(false);
        setSelectedRecipe(null);
    };
    
    // Toggle recipe active status
    const toggleRecipeStatus = (recipe: Recipe) => {
        const updatedRecipe = {
            ...recipe,
            isActive: !recipe.isActive,
            dateModified: new Date().toISOString()
        };
        
        const updatedRecipes = recipesList.map(r => 
            r.id === recipe.id ? updatedRecipe : r
        );
        
        setRecipesList(updatedRecipes);
        
        setSnackbar({
            open: true,
            message: `Recipe ${updatedRecipe.isActive ? 'activated' : 'deactivated'} successfully`,
            severity: 'success'
        });
    };
    
    // Close snackbar
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };
    
    return (
        <Layout title="Recipes Management">
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleAddRecipe}
                    >
                        Add Recipe
                    </Button>
                </Box>
                
                {/* Filters */}
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                label="Search Recipes"
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
                        <Grid item xs={12} sm={6} md={4}>
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
                                    <MenuItem value="">
                                        <em>All Categories</em>
                                    </MenuItem>
                                    {categories.map((category) => (
                                        <MenuItem key={category} value={category}>
                                            {category}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            {filteredRecipes.length > 0 && (
                                <Typography variant="subtitle1" sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                                    Showing {filteredRecipes.length} of {recipesList.length} recipes
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
                        aria-label="recipe status tabs"
                    >
                        <Tab label="Active Recipes" />
                        <Tab label="Inactive Recipes" />
                        <Tab label="All Recipes" />
                    </Tabs>
                </Box>
                
                {/* Recipe Grid */}
                {filteredRecipes.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 5 }}>
                        <Typography variant="h6" color="text.secondary">
                            No recipes found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {searchTerm || categoryFilter
                                ? 'Try adjusting your filters'
                                : 'Add your first recipe to get started'}
                        </Typography>
                        {!searchTerm && !categoryFilter && (
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                onClick={handleAddRecipe}
                                sx={{ mt: 2 }}
                            >
                                Add Recipe
                            </Button>
                        )}
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {filteredRecipes.map((recipe) => (
                            <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                                <RecipeCard
                                    recipe={recipe}
                                    onSelect={handleViewRecipe}
                                />
                            </Grid>
                        ))}
                    </Grid>
                )}
                
                {/* Recipe Form Dialog */}
                <Dialog
                    open={formOpen}
                    onClose={handleCloseForm}
                    aria-labelledby="recipe-form-dialog-title"
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle id="recipe-form-dialog-title">
                        {currentRecipe ? 'Edit Recipe' : 'Add New Recipe'}
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
                        <RecipeForm
                            recipe={currentRecipe}
                            inventoryItems={inventoryItems}
                            categories={categories}
                            onSubmit={handleSaveRecipe}
                            onCancel={handleCloseForm}
                        />
                    </DialogContent>
                </Dialog>
                
                {/* Recipe Detail Dialog */}
                <Dialog
                    open={detailOpen}
                    onClose={handleCloseDetail}
                    aria-labelledby="recipe-detail-dialog-title"
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle id="recipe-detail-dialog-title">
                        Recipe Details
                        <IconButton
                            aria-label="close"
                            onClick={handleCloseDetail}
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
                        {selectedRecipe && (
                            <Box>
                                <RecipeCard
                                    recipe={selectedRecipe}
                                    variant="detailed"
                                />
                                <Divider sx={{ my: 3 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                    <Button
                                        variant="outlined"
                                        color={selectedRecipe.isActive ? 'error' : 'success'}
                                        onClick={() => {
                                            toggleRecipeStatus(selectedRecipe);
                                            handleCloseDetail();
                                        }}
                                    >
                                        {selectedRecipe.isActive ? 'Deactivate' : 'Activate'} Recipe
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            handleCloseDetail();
                                            handleEditRecipe(selectedRecipe);
                                        }}
                                    >
                                        Edit Recipe
                                    </Button>
                                </Box>
                            </Box>
                        )}
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