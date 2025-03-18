import React from 'react';
import { KpiCardProps } from '../types';
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import { ArrowDropUp, ArrowDropDown } from '@mui/icons-material';

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, comparison, details }) => {
  const theme = useTheme();
  
  return (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[1],
    }}>
      <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography variant="subtitle1" color="text.secondary" fontWeight={500} sx={{ mb: 0 }}>
            {title}
          </Typography>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            bgcolor: 'primary.light',
            color: 'primary.main',
            borderRadius: 1,
          }}>
            {icon}
          </Box>
        </Box>
        
        <Typography variant="h4" component="div" sx={{ fontWeight: 600, mb: 0.5 }}>
          {value}
        </Typography>
        
        {comparison && (
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 1.5, 
              color: comparison.isPositive ? 'success.main' : 'error.main' 
            }}
          >
            {comparison.isPositive ? <ArrowDropUp /> : <ArrowDropDown />}
            <Typography variant="body2" fontWeight={500} sx={{ mr: 0.5 }}>
              {comparison.value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              vs yesterday
            </Typography>
          </Box>
        )}
        
        {details && details.length > 0 && (
          <Box 
            sx={{ 
              mt: 'auto', 
              pt: 1.5, 
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            {details.map((detail, index) => (
              <Box 
                key={index} 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mb: index < details.length - 1 ? 0.5 : 0 
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {detail.label}
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {detail.value}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default KpiCard; 