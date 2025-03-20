import React from 'react';
import { 
    Card, 
    CardContent, 
    Typography, 
    Chip, 
    Stack, 
    Box, 
    Divider,
    List,
    ListItem,
    ListItemText,
    Grid,
    Tooltip
} from '@mui/material';
import { Recipe } from '../../types';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined';

interface RecipeCardProps {
    recipe: Recipe;
    onSelect?: (recipe: Recipe) => void;
    variant?: 'summary' | 'detailed';
}

export default function RecipeCard({ 
    recipe, 
    onSelect, 
    variant = 'summary' 
}: RecipeCardProps) {
    const handleClick = () => {
        if (onSelect) {
            onSelect(recipe);
        }
    };

    return (
        <Card 
            onClick={handleClick} 
            sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                cursor: onSelect ? 'pointer' : 'default',
                transition: 'all 0.2s',
                '&:hover': onSelect ? {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                } : {}
            }}
        >
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div" gutterBottom>
                    {recipe.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {recipe.description}
                </Typography>
                
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip 
                        label={recipe.category} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                    />
                    {!recipe.isActive && (
                        <Chip 
                            label="Inactive" 
                            size="small" 
                            color="error" 
                            variant="outlined"
                        />
                    )}
                </Stack>
                
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Tooltip title="Preparation Time">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TimerOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} />
                            <Typography variant="body2">{recipe.preparationTime} min</Typography>
                        </Box>
                    </Tooltip>
                    <Tooltip title="Cost Per Serving">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AttachMoneyOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} />
                            <Typography variant="body2">${recipe.costPerServing.toFixed(2)}</Typography>
                        </Box>
                    </Tooltip>
                    <Tooltip title="Serving Size">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <RestaurantOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} />
                            <Typography variant="body2">{recipe.servingSize}</Typography>
                        </Box>
                    </Tooltip>
                </Stack>

                {variant === 'detailed' && (
                    <>
                        <Divider sx={{ my: 2 }} />
                        
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Ingredients
                        </Typography>
                        <List dense disablePadding>
                            {recipe.ingredients.map((ingredient, index) => (
                                <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                                    <ListItemText 
                                        primary={`${ingredient.name}`}
                                        secondary={`${ingredient.quantity} ${ingredient.unit} ($${ingredient.cost.toFixed(2)})`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                        
                        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                            Preparation Steps
                        </Typography>
                        <List dense>
                            {recipe.preparationSteps.map((step, index) => (
                                <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                                    <ListItemText 
                                        primary={`${index + 1}. ${step}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                        
                        {recipe.nutritionalInfo && (
                            <>
                                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                                    Nutritional Information
                                </Typography>
                                <Grid container spacing={1}>
                                    <Grid item xs={3}>
                                        <Typography variant="body2">
                                            <strong>Calories:</strong> {recipe.nutritionalInfo.calories}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography variant="body2">
                                            <strong>Protein:</strong> {recipe.nutritionalInfo.protein}g
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography variant="body2">
                                            <strong>Carbs:</strong> {recipe.nutritionalInfo.carbs}g
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography variant="body2">
                                            <strong>Fat:</strong> {recipe.nutritionalInfo.fat}g
                                        </Typography>
                                    </Grid>
                                </Grid>
                                
                                {recipe.nutritionalInfo.allergens && recipe.nutritionalInfo.allergens.length > 0 && (
                                    <Box sx={{ mt: 1 }}>
                                        <Typography variant="body2">
                                            <strong>Allergens:</strong> {recipe.nutritionalInfo.allergens.join(', ')}
                                        </Typography>
                                    </Box>
                                )}
                            </>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
} 