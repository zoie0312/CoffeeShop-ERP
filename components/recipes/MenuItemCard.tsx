import React from 'react';
import { 
    Card, 
    CardContent, 
    CardMedia, 
    Typography, 
    Chip, 
    Stack, 
    Box,
    Divider,
    Badge
} from '@mui/material';
import { MenuItem as MenuItemType } from '../../types';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PercentIcon from '@mui/icons-material/Percent';
import ShowChartIcon from '@mui/icons-material/ShowChart';

interface MenuItemCardProps {
    menuItem: MenuItemType;
    onSelect?: (menuItem: MenuItemType) => void;
}

export default function MenuItemCard({ menuItem, onSelect }: MenuItemCardProps) {
    const handleClick = () => {
        if (onSelect) {
            onSelect(menuItem);
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
            {menuItem.imageUrl && (
                <Box sx={{ position: 'relative' }}>
                    <CardMedia
                        component="img"
                        height="140"
                        image={menuItem.imageUrl}
                        alt={menuItem.name}
                    />
                    {menuItem.isFeatured && (
                        <Chip
                            label="Featured"
                            color="secondary"
                            size="small"
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                            }}
                        />
                    )}
                </Box>
            )}
            <CardContent sx={{ flexGrow: 1, pt: menuItem.imageUrl ? 2 : 3 }}>
                <Typography variant="h6" component="div" gutterBottom>
                    {menuItem.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {menuItem.description}
                </Typography>
                
                <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
                    <Chip 
                        label={menuItem.category} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                    />
                    {menuItem.isSeasonalItem && (
                        <Chip 
                            label="Seasonal" 
                            size="small" 
                            color="warning" 
                            variant="outlined"
                        />
                    )}
                    {!menuItem.isActive && (
                        <Chip 
                            label="Inactive" 
                            size="small" 
                            color="error" 
                            variant="outlined"
                        />
                    )}
                </Stack>
                
                <Typography variant="h6" sx={{ mb: 1, color: 'primary.main' }}>
                    ${menuItem.price.toFixed(2)}
                </Typography>
                
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AttachMoneyIcon fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">Cost: ${menuItem.cost.toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ShowChartIcon fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">Profit: ${menuItem.profit.toFixed(2)}</Typography>
                    </Box>
                </Stack>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PercentIcon fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">
                        Profit Margin: {(menuItem.profitMargin * 100).toFixed(0)}%
                    </Typography>
                </Box>
                
                {menuItem.nutritionalInfo && (
                    <>
                        <Divider sx={{ my: 1.5 }} />
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            Nutrition: {menuItem.nutritionalInfo.calories} cal
                            {menuItem.nutritionalInfo.allergens && 
                             menuItem.nutritionalInfo.allergens.length > 0 && (
                                <Typography 
                                    component="span" 
                                    variant="caption" 
                                    sx={{ ml: 1, color: 'text.secondary' }}
                                >
                                    Allergens: {menuItem.nutritionalInfo.allergens.join(', ')}
                                </Typography>
                            )}
                        </Typography>
                    </>
                )}
            </CardContent>
        </Card>
    );
} 