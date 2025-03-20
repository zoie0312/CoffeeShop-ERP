import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Button, 
    TextField, 
    Grid, 
    Typography, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem, 
    InputAdornment,
    Divider,
    Switch,
    FormControlLabel,
    FormHelperText
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MenuItem as MenuItemType, Recipe } from '../../types';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PercentIcon from '@mui/icons-material/Percent';

// Simple function to generate unique IDs
const generateId = (): string => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
};

interface MenuItemFormProps {
    menuItem?: MenuItemType;
    recipes: Recipe[];
    categories: string[];
    onSubmit: (menuItem: MenuItemType) => void;
    onCancel: () => void;
}

export default function MenuItemForm({
    menuItem,
    recipes,
    categories,
    onSubmit,
    onCancel
}: MenuItemFormProps) {
    const isEdit = !!menuItem;
    
    // Form state
    const [name, setName] = useState(menuItem?.name || '');
    const [description, setDescription] = useState(menuItem?.description || '');
    const [category, setCategory] = useState(menuItem?.category || '');
    const [price, setPrice] = useState(menuItem?.price || 0);
    const [recipeId, setRecipeId] = useState(menuItem?.recipeId || '');
    const [imageUrl, setImageUrl] = useState(menuItem?.imageUrl || '');
    const [isFeatured, setIsFeatured] = useState(menuItem?.isFeatured || false);
    const [isSeasonalItem, setIsSeasonalItem] = useState(menuItem?.isSeasonalItem || false);
    const [seasonStartDate, setSeasonStartDate] = useState<Date | null>(
        menuItem?.seasonStartDate ? new Date(menuItem.seasonStartDate) : null
    );
    const [seasonEndDate, setSeasonEndDate] = useState<Date | null>(
        menuItem?.seasonEndDate ? new Date(menuItem.seasonEndDate) : null
    );
    const [isActive, setIsActive] = useState(menuItem?.isActive !== false);
    
    // Calculated fields
    const [cost, setCost] = useState(menuItem?.cost || 0);
    const [profit, setProfit] = useState(menuItem?.profit || 0);
    const [profitMargin, setProfitMargin] = useState(menuItem?.profitMargin || 0);
    const [nutritionalInfo, setNutritionalInfo] = useState(menuItem?.nutritionalInfo || {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        allergens: []
    });
    
    // Update cost, profit, and nutritional info when recipe changes
    useEffect(() => {
        if (recipeId) {
            const selectedRecipe = recipes.find(r => r.id === recipeId);
            if (selectedRecipe) {
                // Update cost from recipe
                setCost(selectedRecipe.costPerServing);
                
                // Update profit and margin
                const calculatedProfit = price - selectedRecipe.costPerServing;
                setProfit(calculatedProfit);
                setProfitMargin(price > 0 ? calculatedProfit / price : 0);
                
                // Update nutritional info
                if (selectedRecipe.nutritionalInfo) {
                    setNutritionalInfo(selectedRecipe.nutritionalInfo);
                }
            }
        }
    }, [recipeId, recipes, price]);
    
    // Update profit and margin when price changes
    useEffect(() => {
        const calculatedProfit = price - cost;
        setProfit(calculatedProfit);
        setProfitMargin(price > 0 ? calculatedProfit / price : 0);
    }, [price, cost]);
    
    // Form validation
    const [nameError, setNameError] = useState('');
    const [recipeError, setRecipeError] = useState('');
    const [priceError, setPriceError] = useState('');
    const [categoryError, setCategoryError] = useState('');
    
    const validateForm = (): boolean => {
        let isValid = true;
        
        if (!name.trim()) {
            setNameError('Name is required');
            isValid = false;
        } else {
            setNameError('');
        }
        
        if (!recipeId) {
            setRecipeError('Recipe is required');
            isValid = false;
        } else {
            setRecipeError('');
        }
        
        if (price <= 0) {
            setPriceError('Price must be greater than 0');
            isValid = false;
        } else {
            setPriceError('');
        }
        
        if (!category) {
            setCategoryError('Category is required');
            isValid = false;
        } else {
            setCategoryError('');
        }
        
        return isValid;
    };
    
    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        const newMenuItem: MenuItemType = {
            id: menuItem?.id || generateId(),
            name,
            description,
            category,
            price,
            cost,
            profit,
            profitMargin,
            recipeId,
            imageUrl: imageUrl || undefined,
            isFeatured,
            isSeasonalItem,
            seasonStartDate: seasonStartDate ? seasonStartDate.toISOString().split('T')[0] : undefined,
            seasonEndDate: seasonEndDate ? seasonEndDate.toISOString().split('T')[0] : undefined,
            isActive,
            nutritionalInfo,
            dateCreated: menuItem?.dateCreated || new Date().toISOString(),
            dateModified: new Date().toISOString()
        };
        
        onSubmit(newMenuItem);
    };
    
    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
            <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid item xs={12}>
                    <Typography variant="h6">Basic Information</Typography>
                    <Divider sx={{ mb: 2, mt: 1 }} />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        fullWidth
                        label="Menu Item Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={!!nameError}
                        helperText={nameError}
                    />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required error={!!categoryError}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={category}
                            label="Category"
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            {categories.map((cat) => (
                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                            ))}
                        </Select>
                        {categoryError && <FormHelperText>{categoryError}</FormHelperText>}
                    </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Description"
                        multiline
                        rows={2}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required error={!!recipeError}>
                        <InputLabel>Recipe</InputLabel>
                        <Select
                            value={recipeId}
                            label="Recipe"
                            onChange={(e) => setRecipeId(e.target.value)}
                        >
                            {recipes.map((recipe) => (
                                <MenuItem key={recipe.id} value={recipe.id}>
                                    {recipe.name} (${recipe.costPerServing.toFixed(2)})
                                </MenuItem>
                            ))}
                        </Select>
                        {recipeError && <FormHelperText>{recipeError}</FormHelperText>}
                    </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        fullWidth
                        label="Price"
                        type="number"
                        inputProps={{ min: 0, step: 0.01 }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        error={!!priceError}
                        helperText={priceError}
                    />
                </Grid>
                
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Image URL"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                    />
                </Grid>
                
                {/* Pricing Information */}
                <Grid item xs={12}>
                    <Typography variant="h6">Pricing Information</Typography>
                    <Divider sx={{ mb: 2, mt: 1 }} />
                </Grid>
                
                <Grid item xs={12} sm={4}>
                    <TextField
                        fullWidth
                        label="Cost"
                        value={`$${cost.toFixed(2)}`}
                        InputProps={{
                            readOnly: true,
                            startAdornment: <InputAdornment position="start"><AttachMoneyIcon fontSize="small" /></InputAdornment>,
                        }}
                    />
                </Grid>
                
                <Grid item xs={12} sm={4}>
                    <TextField
                        fullWidth
                        label="Profit"
                        value={`$${profit.toFixed(2)}`}
                        InputProps={{
                            readOnly: true,
                            startAdornment: <InputAdornment position="start"><AttachMoneyIcon fontSize="small" /></InputAdornment>,
                        }}
                    />
                </Grid>
                
                <Grid item xs={12} sm={4}>
                    <TextField
                        fullWidth
                        label="Profit Margin"
                        value={`${(profitMargin * 100).toFixed(1)}%`}
                        InputProps={{
                            readOnly: true,
                            startAdornment: <InputAdornment position="start"><PercentIcon fontSize="small" /></InputAdornment>,
                        }}
                    />
                </Grid>
                
                {/* Display Settings */}
                <Grid item xs={12}>
                    <Typography variant="h6">Display Settings</Typography>
                    <Divider sx={{ mb: 2, mt: 1 }} />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    <FormControlLabel
                        control={
                            <Switch 
                                checked={isFeatured} 
                                onChange={(e) => setIsFeatured(e.target.checked)} 
                            />
                        }
                        label="Featured Item"
                    />
                    <FormHelperText>Featured items are highlighted in the menu</FormHelperText>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    <FormControlLabel
                        control={
                            <Switch 
                                checked={isActive} 
                                onChange={(e) => setIsActive(e.target.checked)} 
                            />
                        }
                        label="Active Menu Item"
                    />
                    <FormHelperText>Inactive items will not be displayed in the menu</FormHelperText>
                </Grid>
                
                {/* Seasonal Settings */}
                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Switch 
                                checked={isSeasonalItem} 
                                onChange={(e) => setIsSeasonalItem(e.target.checked)} 
                            />
                        }
                        label="Seasonal Item"
                    />
                    <FormHelperText>Seasonal items are only available during a specific period</FormHelperText>
                </Grid>
                
                {isSeasonalItem && (
                    <>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Season Start Date"
                                    value={seasonStartDate}
                                    onChange={(date) => setSeasonStartDate(date)}
                                    slotProps={{ textField: { fullWidth: true } }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Season End Date"
                                    value={seasonEndDate}
                                    onChange={(date) => setSeasonEndDate(date)}
                                    slotProps={{ 
                                        textField: { 
                                            fullWidth: true,
                                            helperText: "The item will automatically become inactive after this date"
                                        } 
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                    </>
                )}
                
                {/* Nutritional Information */}
                <Grid item xs={12}>
                    <Typography variant="h6">Nutritional Information</Typography>
                    <Divider sx={{ mb: 2, mt: 1 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        This information is automatically pulled from the selected recipe
                    </Typography>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                    <TextField
                        fullWidth
                        label="Calories"
                        value={nutritionalInfo.calories || 'N/A'}
                        InputProps={{ readOnly: true }}
                    />
                </Grid>
                
                <Grid item xs={6} sm={3}>
                    <TextField
                        fullWidth
                        label="Protein"
                        value={nutritionalInfo.protein ? `${nutritionalInfo.protein}g` : 'N/A'}
                        InputProps={{ readOnly: true }}
                    />
                </Grid>
                
                <Grid item xs={6} sm={3}>
                    <TextField
                        fullWidth
                        label="Carbs"
                        value={nutritionalInfo.carbs ? `${nutritionalInfo.carbs}g` : 'N/A'}
                        InputProps={{ readOnly: true }}
                    />
                </Grid>
                
                <Grid item xs={6} sm={3}>
                    <TextField
                        fullWidth
                        label="Fat"
                        value={nutritionalInfo.fat ? `${nutritionalInfo.fat}g` : 'N/A'}
                        InputProps={{ readOnly: true }}
                    />
                </Grid>
                
                {nutritionalInfo.allergens && nutritionalInfo.allergens.length > 0 && (
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Allergens"
                            value={nutritionalInfo.allergens.join(', ')}
                            InputProps={{ readOnly: true }}
                        />
                    </Grid>
                )}
                
                {/* Form Actions */}
                <Grid item xs={12}>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button onClick={onCancel} variant="outlined">
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained">
                            {isEdit ? 'Update' : 'Create'} Menu Item
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
} 