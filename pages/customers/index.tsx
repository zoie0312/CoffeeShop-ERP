import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Tabs, 
  Tab, 
  Paper, 
  Button,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { 
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  Feedback as FeedbackIcon
} from '@mui/icons-material';
import Layout from '@/components/Layout';
import CustomerList from '@/components/customers/CustomerList';
import CustomerForm from '@/components/customers/CustomerForm';
import CustomerTransactionList from '@/components/customers/CustomerTransactionList';
import CustomerTransactionForm from '@/components/customers/CustomerTransactionForm';
import CustomerFeedbackList from '@/components/customers/CustomerFeedbackList';
import CustomerFeedbackForm from '@/components/customers/CustomerFeedbackForm';
import { Customer, CustomerTransaction, CustomerFeedback } from '@/types';
import { useRouter } from 'next/router';

// Import mockup data directly
import customersData from '@/data/customers.json';
import customerTransactionsData from '@/data/customer-transactions.json';
import customerFeedbackData from '@/data/customer-feedback.json';
import productListData from '@/data/product-names.json';

const CustomersPage = () => {
  const router = useRouter();
  const { tab } = router.query;
  
  // State for tab value
  const [tabValue, setTabValue] = useState(0);
  
  // Data states
  const [customers, setCustomers] = useState<Customer[]>(customersData as Customer[]);
  const [transactions, setTransactions] = useState<CustomerTransaction[]>(customerTransactionsData as CustomerTransaction[]);
  const [feedback, setFeedback] = useState<CustomerFeedback[]>(customerFeedbackData as CustomerFeedback[]);
  const [products, setProducts] = useState<string[]>(productListData as string[]);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [customerFormOpen, setCustomerFormOpen] = useState(false);
  const [transactionFormOpen, setTransactionFormOpen] = useState(false);
  const [feedbackFormOpen, setFeedbackFormOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<CustomerTransaction | null>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<CustomerFeedback | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | undefined>(undefined);
  
  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  // Load initial data
  useEffect(() => {
    // Set selected tab based on URL query param if present
    if (tab) {
      const tabMap: Record<string, number> = {
        'customers': 0,
        'transactions': 1,
        'feedback': 2
      };
      
      const newTabValue = tabMap[tab as string];
      if (newTabValue !== undefined) {
        setTabValue(newTabValue);
      }
    }
  }, [tab]);

  // Update URL when tab changes
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    const tabMap: Record<number, string> = {
      0: 'customers',
      1: 'transactions',
      2: 'feedback'
    };
    
    router.push({
      pathname: router.pathname,
      query: { tab: tabMap[newValue] }
    }, undefined, { shallow: true });
  };

  // Handle customer form open
  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setCustomerFormOpen(true);
  };

  // Handle customer edit
  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerFormOpen(true);
  };

  // Handle customer save
  const handleSaveCustomer = (customer: Customer) => {
    // In a real app, this would be an API call
    if (selectedCustomer) {
      // Update existing customer
      setCustomers(prev => prev.map(c => c.id === customer.id ? customer : c));
      setNotification({
        open: true,
        message: 'Customer updated successfully',
        severity: 'success'
      });
    } else {
      // Add new customer
      setCustomers(prev => [...prev, customer]);
      setNotification({
        open: true,
        message: 'Customer added successfully',
        severity: 'success'
      });
    }
  };

  // Handle customer delete
  const handleDeleteCustomer = (customerId: string) => {
    // In a real app, this would be an API call with confirmation
    setCustomers(prev => prev.filter(c => c.id !== customerId));
    
    // Also delete related transactions and feedback
    setTransactions(prev => prev.filter(t => t.customerId !== customerId));
    setFeedback(prev => prev.filter(f => f.customerId !== customerId));
    
    setNotification({
      open: true,
      message: 'Customer deleted successfully',
      severity: 'info'
    });
  };

  // Handle transaction form open
  const handleAddTransaction = (customerId?: string) => {
    setSelectedTransaction(null);
    setSelectedCustomerId(customerId);
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
      setNotification({
        open: true,
        message: 'Transaction updated successfully',
        severity: 'success'
      });
    } else {
      // Add new transaction
      setTransactions(prev => [...prev, transaction]);
      
      // Update customer points in a real app this would happen server-side
      if (transaction.pointsEarned > 0 || transaction.pointsRedeemed > 0) {
        setCustomers(prev => prev.map(c => {
          if (c.id === transaction.customerId) {
            const newPoints = (c.points || 0) + transaction.pointsEarned - transaction.pointsRedeemed;
            return { ...c, points: newPoints };
          }
          return c;
        }));
      }
      
      setNotification({
        open: true,
        message: 'Transaction recorded successfully',
        severity: 'success'
      });
    }
  };

  // Handle transaction delete
  const handleDeleteTransaction = (transactionId: string) => {
    // In a real app, this would be an API call with confirmation
    // Also would need to adjust customer points
    setTransactions(prev => prev.filter(t => t.id !== transactionId));
    setNotification({
      open: true,
      message: 'Transaction deleted successfully',
      severity: 'info'
    });
  };

  // Handle feedback form open
  const handleAddFeedback = (customerId?: string) => {
    setSelectedFeedback(null);
    setSelectedCustomerId(customerId);
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
      setNotification({
        open: true,
        message: 'Feedback updated successfully',
        severity: 'success'
      });
    } else {
      // Add new feedback
      setFeedback(prev => [...prev, feedbackItem]);
      setNotification({
        open: true,
        message: 'Feedback recorded successfully',
        severity: 'success'
      });
    }
  };

  // Handle feedback delete
  const handleDeleteFeedback = (feedbackId: string) => {
    // In a real app, this would be an API call with confirmation
    setFeedback(prev => prev.filter(f => f.id !== feedbackId));
    setNotification({
      open: true,
      message: 'Feedback deleted successfully',
      severity: 'info'
    });
  };

  // Handle feedback resolved toggle
  const handleToggleResolved = (feedbackId: string, resolved: boolean) => {
    // In a real app, this would be an API call
    setFeedback(prev => prev.map(f => 
      f.id === feedbackId ? { ...f, resolved } : f
    ));
    
    setNotification({
      open: true,
      message: `Feedback marked as ${resolved ? 'resolved' : 'unresolved'}`,
      severity: 'success'
    });
  };

  // Handle notification close
  const handleNotificationClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setNotification({ ...notification, open: false });
  };

  // Handle view transactions for specific customer
  const handleViewCustomerTransactions = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setTabValue(1);
    router.push({
      pathname: router.pathname,
      query: { tab: 'transactions', customerId }
    }, undefined, { shallow: true });
  };

  // Handle view feedback for specific customer
  const handleViewCustomerFeedback = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setTabValue(2);
    router.push({
      pathname: router.pathname,
      query: { tab: 'feedback', customerId }
    }, undefined, { shallow: true });
  };

  // Handle clear selection
  const handleClearSelection = () => {
    setSelectedCustomerId(undefined);
    router.push({
      pathname: router.pathname,
      query: { tab: tabValue === 1 ? 'transactions' : 'feedback' }
    }, undefined, { shallow: true });
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <PeopleIcon sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Customer Management
          </Typography>
        </Box>
        
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab 
              label="Customers" 
              icon={<PeopleIcon />} 
              iconPosition="start"
            />
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
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ ml: 2 }}>
              Loading data...
            </Typography>
          </Box>
        ) : (
          <>
            {/* Customers Tab */}
            {tabValue === 0 && (
              <Box>
                <CustomerList
                  customers={customers}
                  onEdit={handleEditCustomer}
                  onDelete={handleDeleteCustomer}
                  onAddNew={handleAddCustomer}
                  onViewTransactions={handleViewCustomerTransactions}
                  onViewFeedback={handleViewCustomerFeedback}
                  onRecordTransaction={(customerId) => handleAddTransaction(customerId)}
                  onRecordFeedback={(customerId) => handleAddFeedback(customerId)}
                />
              </Box>
            )}
            
            {/* Transactions Tab */}
            {tabValue === 1 && (
              <Box>
                {selectedCustomerId && (
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={handleClearSelection} variant="outlined" size="small">
                      View All Transactions
                    </Button>
                  </Box>
                )}
                <CustomerTransactionList
                  transactions={transactions}
                  customers={customers}
                  selectedCustomerId={selectedCustomerId}
                  onEdit={handleEditTransaction}
                  onDelete={handleDeleteTransaction}
                  onAddNew={() => handleAddTransaction(selectedCustomerId)}
                />
              </Box>
            )}
            
            {/* Feedback Tab */}
            {tabValue === 2 && (
              <Box>
                {selectedCustomerId && (
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={handleClearSelection} variant="outlined" size="small">
                      View All Feedback
                    </Button>
                  </Box>
                )}
                <CustomerFeedbackList
                  feedback={feedback}
                  customers={customers}
                  selectedCustomerId={selectedCustomerId}
                  onEdit={handleEditFeedback}
                  onDelete={handleDeleteFeedback}
                  onAddNew={() => handleAddFeedback(selectedCustomerId)}
                  onToggleResolved={handleToggleResolved}
                  isAdmin={true}
                />
              </Box>
            )}
          </>
        )}
        
        {/* Customer Form Dialog */}
        <CustomerForm
          open={customerFormOpen}
          onClose={() => setCustomerFormOpen(false)}
          onSave={handleSaveCustomer}
          initialData={selectedCustomer || undefined}
          productList={products}
        />
        
        {/* Transaction Form Dialog */}
        <CustomerTransactionForm
          open={transactionFormOpen}
          onClose={() => {
            setTransactionFormOpen(false);
            setSelectedCustomerId(undefined);
          }}
          onSave={handleSaveTransaction}
          initialData={selectedTransaction || undefined}
          customerList={customers}
          selectedCustomerId={selectedCustomerId}
        />
        
        {/* Feedback Form Dialog */}
        <CustomerFeedbackForm
          open={feedbackFormOpen}
          onClose={() => {
            setFeedbackFormOpen(false);
            setSelectedCustomerId(undefined);
          }}
          onSave={handleSaveFeedback}
          initialData={selectedFeedback || undefined}
          customerList={customers}
          selectedCustomerId={selectedCustomerId}
          isAdmin={true}
        />
        
        {/* Notification Snackbar */}
        <Snackbar
          open={notification.open}
          autoHideDuration={5000}
          onClose={handleNotificationClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleNotificationClose} 
            severity={notification.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </Layout>
  );
};

export default CustomersPage; 