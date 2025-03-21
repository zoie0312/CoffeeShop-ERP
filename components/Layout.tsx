import React, { useState, MouseEvent } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutProps } from '../types';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
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
  Menu as MenuIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon
} from '@mui/icons-material';

// Drawer width
const drawerWidth = 260;

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // State for dropdown menus
  const [anchorElReports, setAnchorElReports] = useState<null | HTMLElement>(null);
  const [anchorElRecipes, setAnchorElRecipes] = useState<null | HTMLElement>(null);
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Dropdown handlers
  const handleReportsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorElReports(event.currentTarget);
  };
  
  const handleReportsClose = () => {
    setAnchorElReports(null);
  };
  
  const handleRecipesClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorElRecipes(event.currentTarget);
  };
  
  const handleRecipesClose = () => {
    setAnchorElRecipes(null);
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

  // Mobile drawer content
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
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <CssBaseline />
      
      <Head>
        {title && <title>{title} | Bean Counter Coffee Shop ERP</title>}
      </Head>
      
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 1,
          bgcolor: 'background.paper',
          color: 'text.primary',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ height: { md: 72 } }}>
          {/* Left section - mobile menu button, app title and date */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              //borderRight: { md: `1px solid ${theme.palette.divider}` },
              pr: { md: 3 },
              minWidth: { md: '200px' }
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', mr: { md: 4 } }}>
              <Typography variant="h6" component="h1" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                Bean Counter
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' } }}>
                {currentDate}
              </Typography>
            </Box>
          </Box>
          
          {/* Middle section - main navigation (desktop only) */}
          <Stack 
            direction="row" 
            spacing={1} 
            divider={
              <Divider 
                orientation="vertical"
                flexItem
              />
            }
            sx={{ 
              display: { xs: 'none', md: 'flex' },
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {menuItems.map((item) => (
              <React.Fragment key={item.text}>
                {item.subItems ? (
                  <>
                    <Button
                      color="inherit"
                      startIcon={item.icon}
                      endIcon={<KeyboardArrowDownIcon />}
                      onClick={item.text === 'Reports' ? handleReportsClick : handleRecipesClick}
                      sx={{
                        borderBottom: '2px solid transparent',
                        borderBottomColor: router.pathname === item.path || 
                          (item.subItems && item.subItems.some(subItem => router.pathname === subItem.path)) 
                          ? theme.palette.primary.main 
                          : 'transparent',
                        color: router.pathname === item.path || 
                          (item.subItems && item.subItems.some(subItem => router.pathname === subItem.path))
                          ? theme.palette.primary.main 
                          : theme.palette.text.primary,
                        textTransform: 'none',
                        px: 2,
                        height: '100%',
                        borderRadius: 0
                      }}
                    >
                      {item.text}
                    </Button>
                    
                    {/* Dropdown menu for Reports */}
                    {item.text === 'Reports' && (
                      <Menu
                        anchorEl={anchorElReports}
                        open={Boolean(anchorElReports)}
                        onClose={handleReportsClose}
                        MenuListProps={{
                          'aria-labelledby': 'reports-button',
                        }}
                        sx={{
                          mt: 1,
                          '& .MuiPaper-root': {
                            border: `1px solid ${theme.palette.divider}`,
                            boxShadow: theme.shadows[3]
                          }
                        }}
                      >
                        {item.subItems.map((subItem) => (
                          <MenuItem 
                            key={subItem.text} 
                            component={Link}
                            href={subItem.path}
                            onClick={handleReportsClose}
                            selected={router.pathname === subItem.path}
                            sx={{
                              py: 1.2,
                              minWidth: 180,
                              color: router.pathname === subItem.path ? theme.palette.primary.main : 'inherit'
                            }}
                          >
                            {subItem.text}
                          </MenuItem>
                        ))}
                      </Menu>
                    )}
                    
                    {/* Dropdown menu for Recipes & Menu */}
                    {item.text === 'Recipes & Menu' && (
                      <Menu
                        anchorEl={anchorElRecipes}
                        open={Boolean(anchorElRecipes)}
                        onClose={handleRecipesClose}
                        MenuListProps={{
                          'aria-labelledby': 'recipes-button',
                        }}
                        sx={{
                          mt: 1,
                          '& .MuiPaper-root': {
                            border: `1px solid ${theme.palette.divider}`,
                            boxShadow: theme.shadows[3]
                          }
                        }}
                      >
                        {item.subItems.map((subItem) => (
                          <MenuItem 
                            key={subItem.text} 
                            component={Link}
                            href={subItem.path}
                            onClick={handleRecipesClose}
                            selected={router.pathname === subItem.path}
                            sx={{
                              py: 1.2,
                              minWidth: 180,
                              color: router.pathname === subItem.path ? theme.palette.primary.main : 'inherit'
                            }}
                          >
                            {subItem.text}
                          </MenuItem>
                        ))}
                      </Menu>
                    )}
                  </>
                ) : (
                  <Button
                    component={Link}
                    href={item.path}
                    color="inherit"
                    startIcon={item.icon}
                    sx={{
                      borderBottom: '2px solid transparent',
                      borderBottomColor: router.pathname === item.path ? theme.palette.primary.main : 'transparent',
                      color: router.pathname === item.path ? theme.palette.primary.main : theme.palette.text.primary,
                      textTransform: 'none',
                      px: 2,
                      height: '100%',
                      borderRadius: 0
                    }}
                  >
                    {item.text}
                  </Button>
                )}
              </React.Fragment>
            ))}
          </Stack>
          
          {/* Right section - notifications and user profile */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              pl: { md: 3 },
              minWidth: { md: '180px' },
              justifyContent: 'flex-end'
            }}
          >
            <IconButton color="inherit" size="large" sx={{ mr: 1 }}>
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            
            <Tooltip title="Admin User">
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
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Mobile Drawer */}
      <Box
        component="nav"
        sx={{ 
          width: { xs: drawerWidth },
          flexShrink: { xs: 0 },
          display: { md: 'none' }
        }}
      >
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
      </Box>
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          bgcolor: 'background.default',
          minHeight: '100vh',
          mt: { xs: 8, md: 9 }
        }}
      >
        {title && (
          <Typography variant="h4" component="h1" gutterBottom sx={{ pt: { md: 2 } }}>
            {title}
          </Typography>
        )}
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 