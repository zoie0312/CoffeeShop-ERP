import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  Grid,
  Chip,
  Divider,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  Alert,
  CircularProgress,
  Avatar
} from '@mui/material';
import {
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  Feedback as FeedbackIcon,
  Edit as EditIcon,
  ArrowBack as BackIcon,
  MailOutline as EmailIcon,
  Phone as PhoneIcon,
  Cake as CakeIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Star as StarIcon
} from '@mui/icons-material';
import Layout from '@/components/Layout';
import CustomerForm from '@/components/customers/CustomerForm';
import CustomerTransactionList from '@/components/customers/CustomerTransactionList';
import CustomerTransactionForm from '@/components/customers/CustomerTransactionForm';
import CustomerFeedbackList from '@/components/customers/CustomerFeedbackList';
import CustomerFeedbackForm from '@/components/customers/CustomerFeedbackForm';
import { Customer, CustomerTransaction, CustomerFeedback } from '@/types';
import { format } from 'date-fns';

// Import mockup data directly
import customersData from '@/data/customers.json';
import customerTransactionsData from '@/data/customer-transactions.json';
import customerFeedbackData from '@/data/customer-feedback.json';
import productListData from '@/data/product-names.json';

// Helper function to validate customer status
function isValidCustomerStatus(status: string): status is "regular" | "vip" | "new" | "inactive" | "active" {
  return ["regular", "vip", "new", "inactive", "active"].includes(status);
}

const CustomerDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  
  // Tab state
  const [tabValue, setTabValue] = useState(0);
  
  // Data states
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<CustomerTransaction[]>([]);
  const [feedback, setFeedback] = useState<CustomerFeedback[]>([]);
  const [products, setProducts] = useState<string[]>(productListData as string[]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [customerFormOpen, setCustomerFormOpen] = useState(false);
  const [transactionFormOpen, setTransactionFormOpen] = useState(false);
  const [feedbackFormOpen, setFeedbackFormOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<CustomerTransaction | null>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<CustomerFeedback | null>(null);
  
  // Load customer data
  useEffect(() => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      // Find customer by ID
      const customerData = customersData.find((c) => c.id === id);
      if (!customerData || !isValidCustomerStatus(customerData.status)) {
        setError('Customer not found');
        setLoading(false);
        return;
      }
      
      // Filter transactions and feedback by customer ID
      const transactionsData = customerTransactionsData.filter(
        (t) => t.customerId === id
      );
      
      const feedbackData = customerFeedbackData.filter(
        (f) => f.customerId === id
      );
      
      setCustomer(customerData as Customer);
      setTransactions(transactionsData as unknown as CustomerTransaction[]);
      setFeedback(feedbackData as unknown as CustomerFeedback[]);
    } catch (err) {
      console.error('Error loading customer data:', err);
      setError('Failed to load customer data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [id, router.asPath]);

  // Handle tab change
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Get status chip color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'regular':
        return 'success';
      case 'vip':
        return 'secondary';
      case 'new':
        return 'info';
      case 'inactive':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Calculate customer stats
  const getTotalSpent = () => {
    if (!transactions) return '0.00';
    return transactions
      .filter(t => t.type === 'purchase')
      .reduce((sum: number, t) => sum + t.amount, 0)
      .toFixed(2);
  };

  const getAverageTransaction = () => {
    if (!transactions) return '0.00';
    const purchases = transactions.filter(t => t.type === 'purchase');
    if (purchases.length === 0) return '0.00';
    return (purchases.reduce((sum: number, t) => sum + t.amount, 0) / purchases.length).toFixed(2);
  };

  const getTransactionCount = () => {
    if (!transactions) return 0;
    return transactions.filter(t => t.type === 'purchase').length;
  };

  const getAverageRating = () => {
    if (!feedback || feedback.length === 0) return 'N/A';
    const sum = feedback.reduce((total: number, f) => total + (f.rating as number || 0), 0);
    return (sum / feedback.length).toFixed(1);
  };

  // Handle customer edit
  const handleEditCustomer = () => {
    setCustomerFormOpen(true);
  };

  // Handle customer save
  const handleSaveCustomer = (updatedCustomer: Customer) => {
    // In a real app, this would be an API call
    setCustomer(updatedCustomer);
  };

  // Handle transaction form open
  const handleAddTransaction = () => {
    setSelectedTransaction(null);
    setTransactionFormOpen(true);
  };

  // Handle transaction edit
  const handleEditTransaction = (transaction: CustomerTransaction) => {
    setSelectedTransaction(transaction);
    setTransactionFormOpen(true);
  };

  // Handle transaction save
  const handleSaveTransaction = (transaction: CustomerTransaction) => {
    // In a real app, this would be an API call
    if (selectedTransaction) {
      // Update existing transaction
      setTransactions(prev => prev.map(t => t.id === transaction.id ? transaction : t));
    } else {
      // Add new transaction
      setTransactions(prev => [...prev, transaction]);
      
      // Update customer points in a real app this would happen server-side
      if (customer && (transaction.pointsEarned > 0 || transaction.pointsRedeemed > 0)) {
        const newPoints = (customer.points || 0) + transaction.pointsEarned - transaction.pointsRedeemed;
        setCustomer({ ...customer, points: newPoints });
      }
    }
  };

  // Handle transaction delete
  const handleDeleteTransaction = (transactionId: string) => {
    // In a real app, this would be an API call with confirmation
    setTransactions(prev => prev.filter(t => t.id !== transactionId));
  };

  // Handle feedback form open
  const handleAddFeedback = () => {
    setSelectedFeedback(null);
    setFeedbackFormOpen(true);
  };

  // Handle feedback edit
  const handleEditFeedback = (feedbackItem: CustomerFeedback) => {
    setSelectedFeedback(feedbackItem);
    setFeedbackFormOpen(true);
  };

  // Handle feedback save
  const handleSaveFeedback = (feedbackItem: CustomerFeedback) => {
    // In a real app, this would be an API call
    if (selectedFeedback) {
      // Update existing feedback
      setFeedback(prev => prev.map(f => f.id === feedbackItem.id ? feedbackItem : f));
    } else {
      // Add new feedback
      setFeedback(prev => [...prev, feedbackItem]);
    }
  };

  // Handle feedback delete
  const handleDeleteFeedback = (feedbackId: string) => {
    // In a real app, this would be an API call with confirmation
    setFeedback(prev => prev.filter(f => f.id !== feedbackId));
  };

  // Handle feedback resolved toggle
  const handleToggleResolved = (feedbackId: string, resolved: boolean) => {
    // In a real app, this would be an API call
    setFeedback(prev => prev.map(f => 
      f.id === feedbackId ? { ...f, resolved } : f
    ));
  };

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center', py: 10 }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>Loading customer details...</Typography>
        </Container>
      </Layout>
    );
  }

  if (error || !customer) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || 'Customer not found'}
          </Alert>
          <Button 
            startIcon={<BackIcon />}
            onClick={() => router.push('/customers')}
            variant="outlined"
          >
            Back to Customers
          </Button>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<BackIcon />}
            onClick={() => router.push('/customers')}
            sx={{ mb: 2 }}
          >
            Back to Customers
          </Button>
          
          {/* Customer Profile Header */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      width: 64,
                      height: 64,
                      fontSize: 28,
                      mr: 2
                    }}
                  >
                    {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h4">
                      {customer.firstName} {customer.lastName}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Chip
                        label={customer.status}
                        size="small"
                        color={getStatusColor(customer.status) as any}
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Customer since {formatDate(customer.joinDate)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{customer.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{customer.phone}</Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    {customer.birthdate && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <CakeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          Birthday: {formatDate(customer.birthdate)}
                        </Typography>
                      </Box>
                    )}
                    {customer.address && (
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                        <LocationIcon sx={{ mr: 1, color: 'text.secondary', mt: 0.25 }} />
                        <Typography variant="body2">{customer.address}</Typography>
                      </Box>
                    )}
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <StarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {customer.points?.toLocaleString() || 0} Loyalty Points
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                {customer.notes && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" gutterBottom>Notes:</Typography>
                    <Typography variant="body2">{customer.notes}</Typography>
                  </>
                )}
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>Customer Stats</Typography>
                  
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Total Spent</Typography>
                    <Typography variant="h5" color="primary">${getTotalSpent()}</Typography>
                  </Box>
                  
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Average Transaction</Typography>
                    <Typography variant="h6">${getAverageTransaction()}</Typography>
                  </Box>
                  
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Transactions</Typography>
                    <Typography variant="h6">{getTransactionCount()}</Typography>
                  </Box>
                  
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Average Rating</Typography>
                    <Typography variant="h6">{getAverageRating()}</Typography>
                  </Box>
                </Paper>
                
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={handleEditCustomer}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Edit Customer
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<ShoppingCartIcon />}
                  onClick={handleAddTransaction}
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  Record Transaction
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<FeedbackIcon />}
                  onClick={handleAddFeedback}
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  Record Feedback
                </Button>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Preferences Section */}
          {customer.preferences && Object.keys(customer.preferences).length > 0 && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Customer Preferences</Typography>
              
              <Grid container spacing={2}>
                {customer.preferences.favoriteProducts && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2" gutterBottom>Favorite Products</Typography>
                    <Box>
                      {customer.preferences.favoriteProducts.map((product, index) => (
                        <Chip 
                          key={index} 
                          label={product} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </Box>
                  </Grid>
                )}
                
                {customer.preferences.milkPreference && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2" gutterBottom>Milk Preference</Typography>
                    <Typography variant="body2">{customer.preferences.milkPreference}</Typography>
                  </Grid>
                )}
                
                {customer.preferences.sugarPreference && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2" gutterBottom>Sugar Preference</Typography>
                    <Typography variant="body2">{customer.preferences.sugarPreference}</Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          )}
          
          {/* Tabs for Transactions and Feedback */}
          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab 
                label="Transactions" 
                icon={<ShoppingCartIcon />} 
                iconPosition="start"
              />
              <Tab 
                label="Feedback" 
                icon={<FeedbackIcon />} 
                iconPosition="start"
              />
            </Tabs>
          </Paper>
          
          {/* Transactions Tab */}
          {tabValue === 0 && customer && (
            <CustomerTransactionList
              transactions={transactions}
              customers={[customer]}
              selectedCustomerId={customer.id}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
              onAddNew={handleAddTransaction}
            />
          )}
          
          {/* Feedback Tab */}
          {tabValue === 1 && customer && (
            <CustomerFeedbackList
              feedback={feedback}
              customers={[customer]}
              selectedCustomerId={customer.id}
              onEdit={handleEditFeedback}
              onDelete={handleDeleteFeedback}
              onAddNew={handleAddFeedback}
              onToggleResolved={handleToggleResolved}
              isAdmin={true}
            />
          )}
        </Box>
        
        {/* Customer Form Dialog */}
        {customer && (
          <CustomerForm
            open={customerFormOpen}
            onClose={() => setCustomerFormOpen(false)}
            onSave={handleSaveCustomer}
            initialData={customer}
            productList={products}
          />
        )}
        
        {/* Transaction Form Dialog */}
        {customer && (
          <CustomerTransactionForm
            open={transactionFormOpen}
            onClose={() => setTransactionFormOpen(false)}
            onSave={handleSaveTransaction}
            initialData={selectedTransaction || undefined}
            customerList={[customer]}
            selectedCustomerId={customer.id}
          />
        )}
        
        {/* Feedback Form Dialog */}
        {customer && (
          <CustomerFeedbackForm
            open={feedbackFormOpen}
            onClose={() => setFeedbackFormOpen(false)}
            onSave={handleSaveFeedback}
            initialData={selectedFeedback || undefined}
            customerList={[customer]}
            selectedCustomerId={customer.id}
            isAdmin={true}
          />
        )}
      </Container>
    </Layout>
  );
};

export default CustomerDetail; 