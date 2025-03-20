import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutProps } from '../types';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Dashboard as DashboardIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  BarChart as BarChartIcon,
  MenuBook as MenuBookIcon,
  AttachMoney as AttachMoneyIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon
} from '@mui/icons-material';

// Drawer width
const drawerWidth = 260;

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Get current date formatted as "Tuesday, April 18, 2023"
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Point of Sale', icon: <ShoppingCartIcon />, path: '/pos' },
    { text: 'Inventory', icon: <InventoryIcon />, path: '/inventory' },
    { text: 'Staff', icon: <PeopleIcon />, path: '/staff' },
    { text: 'Customers', icon: <PersonIcon />, path: '/customers' },
    { 
      text: 'Reports', 
      icon: <BarChartIcon />, 
      path: '/reports',
      subItems: [
        { text: 'Overview', path: '/reports' },
        { text: 'Sales Report', path: '/reports/sales' },
        { text: 'Product Performance', path: '/reports/products' },
        { text: 'Customer Analysis', path: '/reports/customers' },
        { text: 'Inventory Turnover', path: '/reports/inventory' }
      ]
    },
    {
      text: 'Recipes & Menu',
      icon: <MenuBookIcon />,
      path: '/recipes',
      subItems: [
        { text: 'Recipes', path: '/recipes' },
        { text: 'Menu', path: '/recipes/menu' },
        { text: 'Categories', path: '/recipes/categories' }
      ]
    },
    { text: 'Finance', icon: <AttachMoneyIcon />, path: '/finance' },
  ];

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        <Typography variant="h6" component="h1" sx={{ fontWeight: 700 }}>
          Bean Counter
        </Typography>
      </Box>
      <List sx={{ flexGrow: 1, pt: 2 }}>
        {menuItems.map((item) => (
          <React.Fragment key={item.text}>
            <ListItem disablePadding>
              <ListItemButton
                selected={router.pathname === item.path || (item.subItems && item.subItems.some(subItem => router.pathname === subItem.path))}
                component={Link} 
                href={item.path}
                onClick={() => {
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  py: 1.5,
                  borderLeft: '3px solid transparent',
                  borderLeftColor: router.pathname === item.path || (item.subItems && item.subItems.some(subItem => router.pathname === subItem.path)) 
                    ? theme.palette.primary.main 
                    : 'transparent',
                  '&.Mui-selected': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: 40, 
                  color: router.pathname === item.path || (item.subItems && item.subItems.some(subItem => router.pathname === subItem.path))
                    ? theme.palette.primary.main 
                    : theme.palette.text.secondary 
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
            
            {/* Render submenu items if they exist */}
            {item.subItems && item.subItems.map((subItem) => (
              <ListItem key={subItem.text} disablePadding>
                <ListItemButton
                  selected={router.pathname === subItem.path}
                  component={Link} 
                  href={subItem.path}
                  onClick={() => {
                    if (isMobile) setMobileOpen(false);
                  }}
                  sx={{
                    py: 1.2,
                    pl: 7, // Indent submenu items
                    borderLeft: '3px solid transparent',
                    borderLeftColor: router.pathname === subItem.path ? theme.palette.primary.main : 'transparent',
                    '&.Mui-selected': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    }
                  }}
                >
                  <ListItemText 
                    primary={subItem.text} 
                    primaryTypographyProps={{ 
                      variant: 'body2',
                      sx: { 
                        color: router.pathname === subItem.path 
                          ? theme.palette.primary.main 
                          : theme.palette.text.secondary 
                      }
                    }} 
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </React.Fragment>
        ))}
      </List>
      <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}`, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          v1.0.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      
      <Head>
        {title && <title>{title} | Bean Counter Coffee Shop ERP</title>}
      </Head>
      
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          boxShadow: 1,
          bgcolor: 'background.paper',
          color: 'text.primary'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
            {currentDate}
          </Typography>
          
          <IconButton color="inherit" size="large" sx={{ mr: 1 }}>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: theme.palette.primary.light,
                color: theme.palette.primary.contrastText,
                mr: 1
              }}
            >
              A
            </Avatar>
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
              Admin User
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Sidebar / Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          bgcolor: 'background.default',
          minHeight: '100vh',
          pt: { xs: 10, md: 8 }
        }}
      >
        {title && (
          <Typography variant="h4" component="h1" gutterBottom>
            {title}
          </Typography>
        )}
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 