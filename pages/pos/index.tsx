import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { Product, CartItem } from '@/types';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Paper,
  Divider,
  TextField,
  Chip,
  IconButton,
  Badge,
  useTheme,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  AttachMoney as MoneyIcon,
  CreditCard as CardIcon
} from '@mui/icons-material';

// Import product and category data from JSON files
import productsData from '@/data/products.json';
import categoriesData from '@/data/categories.json';
import optionsData from '@/data/options.json';

// Type assertion to ensure JSON data conforms to our Product type
const sampleProducts = productsData as Product[];
const categories = categoriesData as string[];

const POS: React.FC = () => {
  const theme = useTheme();
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  
  // Filter products by category
  const filteredProducts = activeCategory === 'All' 
    ? sampleProducts 
    : sampleProducts.filter(product => product.category === activeCategory);
  
  // Add product to cart
  const addToCart = (product: Product) => {
    setCart(prevCart => {
      // Check if product already in cart
      const existingItemIndex = prevCart.findIndex(item => 
        item.product.id === product.id
      );
      
      if (existingItemIndex >= 0) {
        // Increment quantity of existing item
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += 1;
        newCart[existingItemIndex].total = newCart[existingItemIndex].quantity * product.price;
        return newCart;
      } else {
        // Add new item to cart with default options
        return [...prevCart, { 
          product, 
          quantity: 1, 
          total: product.price,
          options: optionsData.defaults
        }];
      }
    });
  };
  
  // Remove product from cart
  const removeFromCart = (index: number) => {
    setCart(prevCart => prevCart.filter((_, i) => i !== index));
  };
  
  // Update item quantity
  const updateQuantity = (index: number, delta: number) => {
    setCart(prevCart => {
      const newCart = [...prevCart];
      newCart[index].quantity = Math.max(1, newCart[index].quantity + delta);
      newCart[index].total = newCart[index].quantity * newCart[index].product.price;
      return newCart;
    });
  };
  
  // Calculate subtotal
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.1; // 10% tax rate
  const total = subtotal + tax;
  
  return (
    <Layout title="Point of Sale">
      <Head>
        <title>Point of Sale | Bean Counter Coffee Shop ERP</title>
      </Head>
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, height: '100%' }}>
        {/* Products Section */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}`, display: 'flex', overflowX: 'auto' }}>
              {categories.map(category => (
                <Chip 
                  key={category}
                  label={category}
                  clickable
                  color={activeCategory === category ? 'primary' : 'default'}
                  onClick={() => setActiveCategory(category)}
                  sx={{ mx: 0.5 }}
                />
              ))}
            </Box>
            
            <Box sx={{ p: 2, flex: 1, overflowY: 'auto' }}>
              <Grid container spacing={2}>
                {filteredProducts.map(product => (
                  <Grid item xs={6} sm={4} md={3} key={product.id}>
                    <Paper 
                      elevation={2} 
                      sx={{ 
                        p: 2, 
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': {
                          boxShadow: theme.shadows[4],
                          transform: 'translateY(-2px)',
                          transition: 'all 0.2s'
                        }
                      }}
                      onClick={() => addToCart(product)}
                    >
                      <Box 
                        sx={{ 
                          height: 80,
                          width: 80,
                          borderRadius: '50%',
                          backgroundColor: 'primary.light',
                          color: 'primary.contrastText',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '2rem',
                          mx: 'auto',
                          mb: 1.5
                        }}
                      >
                        {product.category === 'Coffee' ? '☕' : '🍽️'}
                      </Box>
                      <Typography variant="subtitle1" component="h3" fontWeight={500}>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="primary" fontWeight={600}>
                        ${product.price.toFixed(2)}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Card>
        </Box>
        
        {/* Order Section */}
        <Box sx={{ width: { xs: '100%', md: 350 } }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ 
              p: 2, 
              borderBottom: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Typography variant="h6">Current Order</Typography>
              {cart.length > 0 && (
                <Button 
                  variant="text" 
                  size="small" 
                  color="inherit"
                  onClick={() => setCart([])}
                >
                  Clear
                </Button>
              )}
            </Box>
            
            {cart.length === 0 ? (
              <Box sx={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'text.secondary',
                p: 3
              }}>
                <Typography variant="body1" gutterBottom>No items in cart</Typography>
                <Typography variant="body2" color="text.disabled">
                  Click on products to add them to your order
                </Typography>
              </Box>
            ) : (
              <>
                <List sx={{ flex: 1, overflowY: 'auto', px: 1 }}>
                  {cart.map((item, index) => (
                    <ListItem key={index} alignItems="flex-start" sx={{ py: 1.5 }}>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2" fontWeight={600}>
                            {item.product.name}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary" component="span">
                              ${item.product.price.toFixed(2)}
                            </Typography>
                            {item.options && (
                              <Typography variant="caption" display="block" color="text.secondary">
                                {item.options.size}, {item.options.milk} milk
                                {item.options.extras.length > 0 && `, ${item.options.extras.join(', ')}`}
                              </Typography>
                            )}
                          </>
                        }
                      />
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        flexDirection: 'column'
                      }}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 1,
                          mb: 1
                        }}>
                          <IconButton 
                            size="small" 
                            onClick={() => updateQuantity(index, -1)}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <Typography sx={{ width: 30, textAlign: 'center' }}>
                            {item.quantity}
                          </Typography>
                          <IconButton 
                            size="small"
                            onClick={() => updateQuantity(index, 1)}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                          <Typography variant="body2" fontWeight={600}>
                            ${item.total.toFixed(2)}
                          </Typography>
                          <IconButton
                            size="small"
                            edge="end"
                            color="error"
                            onClick={() => removeFromCart(index)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </ListItem>
                  ))}
                </List>
                
                <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    mb: 1
                  }}>
                    <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                    <Typography variant="body2">${subtotal.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    mb: 1
                  }}>
                    <Typography variant="body2" color="text.secondary">Tax (10%)</Typography>
                    <Typography variant="body2">${tax.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    mb: 2,
                    pt: 1,
                    borderTop: `1px dashed ${theme.palette.divider}`
                  }}>
                    <Typography variant="subtitle2">Total</Typography>
                    <Typography variant="subtitle2">${total.toFixed(2)}</Typography>
                  </Box>
                  
                  {showPayment ? (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom align="center">
                        Select Payment Method
                      </Typography>
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={6}>
                          <Button
                            fullWidth
                            variant="outlined"
                            size="large"
                            color="success"
                            startIcon={<MoneyIcon />}
                            sx={{ 
                              py: 2, 
                              display: 'flex', 
                              flexDirection: 'column',
                              '& .MuiButton-startIcon': {
                                margin: 0,
                                mb: 1
                              } 
                            }}
                          >
                            Cash
                          </Button>
                        </Grid>
                        <Grid item xs={6}>
                          <Button
                            fullWidth
                            variant="outlined"
                            size="large"
                            color="primary"
                            startIcon={<CardIcon />}
                            sx={{ 
                              py: 2, 
                              display: 'flex', 
                              flexDirection: 'column',
                              '& .MuiButton-startIcon': {
                                margin: 0,
                                mb: 1
                              } 
                            }}
                          >
                            Card
                          </Button>
                        </Grid>
                      </Grid>
                      <Button
                        fullWidth
                        variant="text"
                        onClick={() => setShowPayment(false)}
                        sx={{ mt: 1 }}
                      >
                        Back
                      </Button>
                    </Box>
                  ) : (
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      size="large"
                      onClick={() => setShowPayment(true)}
                      disabled={cart.length === 0}
                    >
                      Proceed to Payment
                    </Button>
                  )}
                </Box>
              </>
            )}
          </Card>
        </Box>
      </Box>
    </Layout>
  );
};

export default POS; 