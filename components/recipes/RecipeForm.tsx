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
    IconButton,
    Chip,
    Stack,
    Switch,
    FormControlLabel,
    Paper
} from '@mui/material';
import { Recipe, InventoryItem } from '../../types';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

// Simple function to generate unique IDs
const generateId = (): string => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
};

interface RecipeFormProps {
    recipe?: Recipe;
    inventoryItems: InventoryItem[];
    categories: string[];
    onSubmit: (recipe: Recipe) => void;
    onCancel: () => void;
}

interface RecipeIngredient {
    id: string;
    inventoryItemId: string;
    name: string;
    quantity: number;
    unit: string;
    cost: number;
}

interface NutritionalInfo {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    allergens: string[];
}

export default function RecipeForm({ 
    recipe, 
    inventoryItems, 
    categories, 
    onSubmit, 
    onCancel 
}: RecipeFormProps) {
    const isEdit = !!recipe;
    
    // Form state
    const [name, setName] = useState(recipe?.name || '');
    const [description, setDescription] = useState(recipe?.description || '');
    const [category, setCategory] = useState(recipe?.category || '');
    const [preparationTime, setPreparationTime] = useState(recipe?.preparationTime || 0);
    
    // Ensure ingredients have IDs
    const [ingredients, setIngredients] = useState<RecipeIngredient[]>(() => {
        if (recipe?.ingredients) {
            return recipe.ingredients.map(ing => ({
                id: generateId(),
                inventoryItemId: ing.inventoryItemId,
                name: ing.name,
                quantity: ing.quantity,
                unit: ing.unit,
                cost: ing.cost
            }));
        }
        return [];
    });
    
    const [preparationSteps, setPreparationSteps] = useState<string[]>(
        recipe?.preparationSteps || ['']
    );
    const [servingSize, setServingSize] = useState(recipe?.servingSize || 1);
    const [isActive, setIsActive] = useState(recipe?.isActive !== false);
    
    // Ensure nutritionalInfo.allergens is always an array
    const [nutritionalInfo, setNutritionalInfo] = useState<NutritionalInfo>({
        calories: recipe?.nutritionalInfo?.calories || 0,
        protein: recipe?.nutritionalInfo?.protein || 0,
        carbs: recipe?.nutritionalInfo?.carbs || 0,
        fat: recipe?.nutritionalInfo?.fat || 0,
        allergens: recipe?.nutritionalInfo?.allergens || []
    });
    
    const [allergenInput, setAllergenInput] = useState('');
    
    // Calculate costs
    const [totalCost, setTotalCost] = useState(recipe?.totalCost || 0);
    const [costPerServing, setCostPerServing] = useState(recipe?.costPerServing || 0);
    
    // Calculate total costs whenever ingredients or serving size changes
    useEffect(() => {
        const total = ingredients.reduce((sum, item) => sum + item.cost, 0);
        setTotalCost(total);
        setCostPerServing(servingSize > 0 ? total / servingSize : 0);
    }, [ingredients, servingSize]);
    
    // Add a new ingredient
    const handleAddIngredient = () => {
        setIngredients([...ingredients, {
            id: generateId(),
            inventoryItemId: '',
            name: '',
            quantity: 0,
            unit: '',
            cost: 0
        }]);
    };
    
    // Remove an ingredient
    const handleRemoveIngredient = (id: string) => {
        setIngredients(ingredients.filter(ingredient => ingredient.id !== id));
    };
    
    // Handle ingredient change
    const handleIngredientChange = (id: string, field: string, value: any) => {
        setIngredients(ingredients.map(ingredient => {
            if (ingredient.id === id) {
                const updatedIngredient = { ...ingredient, [field]: value };
                
                // If changing inventory item, update name, unit, and recalculate cost
                if (field === 'inventoryItemId') {
                    const item = inventoryItems.find(item => item.id === value);
                    if (item) {
                        updatedIngredient.name = item.name;
                        updatedIngredient.unit = item.unit;
                        updatedIngredient.cost = updatedIngredient.quantity * item.costPerUnit;
                    }
                }
                
                // If changing quantity, recalculate cost
                if (field === 'quantity') {
                    const item = inventoryItems.find(item => item.id === ingredient.inventoryItemId);
                    if (item) {
                        updatedIngredient.cost = value * item.costPerUnit;
                    }
                }
                
                return updatedIngredient;
            }
            return ingredient;
        }));
    };
    
    // Add a new preparation step
    const handleAddStep = () => {
        setPreparationSteps([...preparationSteps, '']);
    };
    
    // Remove a preparation step
    const handleRemoveStep = (index: number) => {
        setPreparationSteps(preparationSteps.filter((_, i) => i !== index));
    };
    
    // Update a preparation step
    const handleStepChange = (index: number, value: string) => {
        const newSteps = [...preparationSteps];
        newSteps[index] = value;
        setPreparationSteps(newSteps);
    };
    
    // Handle nutritional info change
    const handleNutritionalInfoChange = (field: string, value: any) => {
        setNutritionalInfo({ ...nutritionalInfo, [field]: value });
    };
    
    // Handle adding an allergen
    const handleAddAllergen = () => {
        if (allergenInput.trim() && !nutritionalInfo.allergens.includes(allergenInput.trim())) {
            handleNutritionalInfoChange('allergens', [...nutritionalInfo.allergens, allergenInput.trim()]);
            setAllergenInput('');
        }
    };
    
    // Handle removing an allergen
    const handleDeleteAllergen = (allergen: string) => {
        handleNutritionalInfoChange(
            'allergens', 
            nutritionalInfo.allergens.filter(a => a !== allergen)
        );
    };
    
    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate form
        if (!name || !category || ingredients.length === 0 || preparationSteps.length === 0) {
            // Display error message or add validation
            return;
        }
        
        const newRecipe: Recipe = {
            id: recipe?.id || generateId(),
            name,
            description,
            category,
            ingredients,
            preparationTime,
            preparationSteps: preparationSteps.filter(step => step.trim() !== ''),
            costPerServing,
            servingSize,
            totalCost,
            nutritionalInfo,
            isActive,
            dateCreated: recipe?.dateCreated || new Date().toISOString(),
            dateModified: new Date().toISOString(),
            createdBy: recipe?.createdBy || 'current-user', // Replace with actual user ID
            modifiedBy: 'current-user' // Replace with actual user ID
        };
        
        onSubmit(newRecipe);
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
                        label="Recipe Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
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
                    <TextField
                        required
                        fullWidth
                        label="Preparation Time"
                        type="number"
                        InputProps={{
                            endAdornment: <InputAdornment position="end">minutes</InputAdornment>,
                        }}
                        value={preparationTime}
                        onChange={(e) => setPreparationTime(Number(e.target.value))}
                    />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        fullWidth
                        label="Serving Size"
                        type="number"
                        value={servingSize}
                        onChange={(e) => setServingSize(Number(e.target.value))}
                    />
                </Grid>
                
                {/* Ingredients */}
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">Ingredients</Typography>
                        <Button 
                            startIcon={<AddIcon />} 
                            onClick={handleAddIngredient}
                            variant="outlined"
                            size="small"
                        >
                            Add Ingredient
                        </Button>
                    </Box>
                    <Divider sx={{ mb: 2, mt: 1 }} />
                </Grid>
                
                {ingredients.map((ingredient, index) => (
                    <Grid item xs={12} key={ingredient.id}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth required>
                                        <InputLabel>Inventory Item</InputLabel>
                                        <Select
                                            value={ingredient.inventoryItemId}
                                            label="Inventory Item"
                                            onChange={(e) => handleIngredientChange(ingredient.id, 'inventoryItemId', e.target.value)}
                                        >
                                            {inventoryItems.map((item) => (
                                                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                
                                <Grid item xs={6} sm={2}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Quantity"
                                        type="number"
                                        inputProps={{ min: 0, step: 0.01 }}
                                        value={ingredient.quantity}
                                        onChange={(e) => handleIngredientChange(ingredient.id, 'quantity', Number(e.target.value))}
                                    />
                                </Grid>
                                
                                <Grid item xs={6} sm={2}>
                                    <TextField
                                        fullWidth
                                        label="Unit"
                                        value={ingredient.unit}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                
                                <Grid item xs={12} sm={2}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                                        <TextField
                                            fullWidth
                                            label="Cost"
                                            value={`$${ingredient.cost.toFixed(2)}`}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            sx={{ mr: 1 }}
                                        />
                                        <IconButton 
                                            color="error" 
                                            onClick={() => handleRemoveIngredient(ingredient.id)}
                                            sx={{ mt: 1 }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                ))}
                
                {/* Recipe Preparation Steps */}
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">Preparation Steps</Typography>
                        <Button 
                            startIcon={<AddIcon />} 
                            onClick={handleAddStep}
                            variant="outlined"
                            size="small"
                        >
                            Add Step
                        </Button>
                    </Box>
                    <Divider sx={{ mb: 2, mt: 1 }} />
                </Grid>
                
                {preparationSteps.map((step, index) => (
                    <Grid item xs={12} key={index}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                            <TextField
                                fullWidth
                                multiline
                                label={`Step ${index + 1}`}
                                value={step}
                                onChange={(e) => handleStepChange(index, e.target.value)}
                                sx={{ mr: 1 }}
                            />
                            <IconButton 
                                color="error" 
                                onClick={() => handleRemoveStep(index)}
                                sx={{ mt: 1 }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    </Grid>
                ))}
                
                {/* Nutritional Information */}
                <Grid item xs={12}>
                    <Typography variant="h6">Nutritional Information</Typography>
                    <Divider sx={{ mb: 2, mt: 1 }} />
                </Grid>
                
                <Grid item xs={6} sm={3}>
                    <TextField
                        fullWidth
                        label="Calories"
                        type="number"
                        value={nutritionalInfo.calories || ''}
                        onChange={(e) => handleNutritionalInfoChange('calories', Number(e.target.value))}
                    />
                </Grid>
                
                <Grid item xs={6} sm={3}>
                    <TextField
                        fullWidth
                        label="Protein"
                        type="number"
                        InputProps={{
                            endAdornment: <InputAdornment position="end">g</InputAdornment>,
                        }}
                        value={nutritionalInfo.protein || ''}
                        onChange={(e) => handleNutritionalInfoChange('protein', Number(e.target.value))}
                    />
                </Grid>
                
                <Grid item xs={6} sm={3}>
                    <TextField
                        fullWidth
                        label="Carbs"
                        type="number"
                        InputProps={{
                            endAdornment: <InputAdornment position="end">g</InputAdornment>,
                        }}
                        value={nutritionalInfo.carbs || ''}
                        onChange={(e) => handleNutritionalInfoChange('carbs', Number(e.target.value))}
                    />
                </Grid>
                
                <Grid item xs={6} sm={3}>
                    <TextField
                        fullWidth
                        label="Fat"
                        type="number"
                        InputProps={{
                            endAdornment: <InputAdornment position="end">g</InputAdornment>,
                        }}
                        value={nutritionalInfo.fat || ''}
                        onChange={(e) => handleNutritionalInfoChange('fat', Number(e.target.value))}
                    />
                </Grid>
                
                <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Allergens</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <TextField
                            fullWidth
                            label="Add Allergen"
                            value={allergenInput}
                            onChange={(e) => setAllergenInput(e.target.value)}
                            sx={{ mr: 1 }}
                        />
                        <Button 
                            variant="outlined" 
                            onClick={handleAddAllergen}
                            sx={{ height: '56px' }}
                        >
                            Add
                        </Button>
                    </Box>
                    
                    <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
                        {nutritionalInfo.allergens.map((allergen) => (
                            <Chip
                                key={allergen}
                                label={allergen}
                                onDelete={() => handleDeleteAllergen(allergen)}
                                sx={{ m: 0.5 }}
                            />
                        ))}
                    </Stack>
                </Grid>
                
                {/* Recipe Cost Summary */}
                <Grid item xs={12}>
                    <Typography variant="h6">Cost Summary</Typography>
                    <Divider sx={{ mb: 2, mt: 1 }} />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Total Cost"
                        value={`$${totalCost.toFixed(2)}`}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Cost Per Serving"
                        value={`$${costPerServing.toFixed(2)}`}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Grid>
                
                {/* Status */}
                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Switch 
                                checked={isActive} 
                                onChange={(e) => setIsActive(e.target.checked)} 
                            />
                        }
                        label="Active Recipe"
                    />
                </Grid>
                
                {/* Form Actions */}
                <Grid item xs={12}>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button onClick={onCancel} variant="outlined">
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained">
                            {isEdit ? 'Update' : 'Create'} Recipe
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
} 