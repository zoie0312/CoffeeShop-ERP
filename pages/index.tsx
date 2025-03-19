import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import KpiCard from '../components/KpiCard';
import { 
  AttachMoney as MoneyIcon,
  ShoppingCart as CartIcon, 
  LocalCafe as CoffeeIcon, 
  Person as PersonIcon,
  Add as AddIcon
} from '@mui/icons-material';
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  useTheme
} from '@mui/material';

const Dashboard = () => {
  const theme = useTheme();
  
  // Sample data for KPI cards - in a real app, this would come from API or context
  const kpiData = [
    {
      title: 'Daily Sales',
      value: '$1,250.80',
      icon: <MoneyIcon />,
      comparison: { value: '8%', isPositive: true },
      details: [
        { label: 'Cash', value: '$450.30' },
        { label: 'Card', value: '$800.50' }
      ]
    },
    {
      title: 'Orders',
      value: '42',
      icon: <CartIcon />,
      comparison: { value: '12%', isPositive: true },
      details: [
        { label: 'Dine-in', value: '24' },
        { label: 'Take-away', value: '18' }
      ]
    },
    {
      title: 'Popular Item',
      value: 'Latte',
      icon: <CoffeeIcon />,
      details: [
        { label: 'Sold', value: '28' },
        { label: 'Revenue', value: '$112.00' }
      ]
    },
    {
      title: 'New Customers',
      value: '8',
      icon: <PersonIcon />,
      comparison: { value: '5%', isPositive: true }
    }
  ];

  // Activity data
  const activityData = [
    { time: '10:45 AM', description: 'New order #1089 - $24.50' },
    { time: '10:32 AM', description: 'Inventory alert: Low milk stock' },
    { time: '10:15 AM', description: 'Staff check-in: Sarah Johnson' },
    { time: '9:58 AM', description: 'New order #1088 - $18.75' }
  ];

  // Quick actions
  const quickActions = [
    { text: 'New Order', path: '/pos' },
    { text: 'Add Inventory', path: '/inventory' },
    { text: 'Manage Customers', path: '/customers' },
    { text: 'Staff Schedule', path: '/staff' },
    { text: 'Daily Report', path: '/reports' }
  ];

  return (
    <Layout title="Dashboard">
      <Head>
        <title>Dashboard | Bean Counter Coffee Shop ERP</title>
        <meta name="description" content="Dashboard for Bean Counter Coffee Shop ERP system" />
      </Head>

      <Box sx={{ pt: 2, pb: 4 }}>
        {/* KPI Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {kpiData.map((kpi, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <KpiCard
                title={kpi.title}
                value={kpi.value}
                icon={kpi.icon}
                comparison={kpi.comparison}
                details={kpi.details}
              />
            </Grid>
          ))}
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Sales Overview" />
              <CardContent>
                <Box 
                  sx={{ 
                    height: 250, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    bgcolor: 'background.default',
                    borderRadius: 1,
                    color: 'text.secondary'
                  }}
                >
                  <Typography>Sales chart will be displayed here</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Popular Items" />
              <CardContent>
                <Box 
                  sx={{ 
                    height: 250, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    bgcolor: 'background.default',
                    borderRadius: 1,
                    color: 'text.secondary'
                  }}
                >
                  <Typography>Product popularity chart will be displayed here</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Bottom Row: Quick Actions and Recent Activity */}
        <Grid container spacing={3}>
          {/* Quick Actions */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Quick Actions" />
              <CardContent>
                <Grid container spacing={2}>
                  {quickActions.map((action) => (
                    <Grid item xs={6} sm={3} key={action.text}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => {}}
                        sx={{ py: 1 }}
                      >
                        {action.text}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Recent Activity */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Recent Activity" />
              <List>
                {activityData.map((activity, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <Box sx={{ width: 80, color: 'text.secondary' }}>
                        <Typography variant="body2">{activity.time}</Typography>
                      </Box>
                      <ListItemText primary={activity.description} />
                    </ListItem>
                    {index < activityData.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default Dashboard; 