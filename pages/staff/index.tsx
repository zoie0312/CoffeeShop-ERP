import React, { useState, useMemo, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import StaffForm from '@/components/staff/StaffForm';
import ShiftForm from '@/components/staff/ShiftForm';
import { 
  Box, 
  Button, 
  Card,
  Chip,
  Grid, 
  Typography, 
  Tabs, 
  Tab, 
  TextField,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Tooltip,
  Divider,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarMonth as CalendarIcon,
  ContentPaste as ContentPasteIcon,
  School as SchoolIcon,
  AssessmentOutlined as AssessmentOutlinedIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { Staff, Shift } from '@/types';
import { useTheme } from '@mui/material/styles';

// Import staff data
import staffData from '@/data/staff.json';
import shiftsData from '@/data/shifts.json';
import staffTrainingData from '@/data/staff-training.json';
import staffPerformanceData from '@/data/staff-performance.json';

const StaffPage: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  
  // State for staff data and filters
  const [staff, setStaff] = useState<Staff[]>(staffData as Staff[]);
  const [shifts, setShifts] = useState<Shift[]>(shiftsData as Shift[]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  
  // Form dialogs state
  const [staffFormOpen, setStaffFormOpen] = useState(false);
  const [shiftFormOpen, setShiftFormOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | undefined>(undefined);
  
  // Load data on router changes
  useEffect(() => {
    // Refresh data when router changes
    setStaff(staffData as Staff[]);
    setShifts(shiftsData as Shift[]);
  }, [router.asPath]);
  
  // Filter staff based on active tab and search term
  const filteredStaff = useMemo(() => {
    return staff.filter(member => {
      const matchesDepartment = activeTab === 'all' || member.department === activeTab;
      const matchesSearch = 
        searchTerm === '' || 
        `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesDepartment && matchesSearch;
    });
  }, [staff, activeTab, searchTerm]);
  
  // Get unique departments for tabs
  const departments = useMemo(() => {
    const departmentSet = new Set(staff.map(member => member.department));
    return ['all', ...Array.from(departmentSet)];
  }, [staff]);
  
  // Event handlers
  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
    setPage(0); // Reset to first page when changing tabs
  };
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to first page when searching
  };
  
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, staffId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedStaffId(staffId);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStaffId(null);
  };
  
  const getStatusChipColor = (status: Staff['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'on-leave':
        return 'warning';
      case 'terminated':
        return 'error';
      default:
        return 'default';
    }
  };
  
  const handleAddStaff = () => {
    setEditingStaff(undefined);
    setStaffFormOpen(true);
  };
  
  const handleEditStaff = (staffId: string) => {
    const staffToEdit = staff.find(s => s.id === staffId);
    setEditingStaff(staffToEdit);
    setStaffFormOpen(true);
    handleMenuClose();
  };
  
  const handleSaveStaff = (staffMember: Staff) => {
    if (editingStaff) {
      // Update existing staff
      setStaff(staff.map(s => s.id === staffMember.id ? staffMember : s));
    } else {
      // Add new staff
      setStaff([...staff, staffMember]);
    }
    setStaffFormOpen(false);
  };
  
  const handleDeleteStaff = (staffId: string) => {
    setStaff(staff.filter(s => s.id !== staffId));
    handleMenuClose();
  };
  
  const handleAddShift = () => {
    setShiftFormOpen(true);
    handleMenuClose();
  };
  
  const handleSaveShift = (shift: Shift) => {
    setShifts([...shifts, shift]);
    setShiftFormOpen(false);
  };
  
  const handleViewSchedule = (staffId: string) => {
    router.push(`/staff/schedule?id=${staffId}`);
    handleMenuClose();
  };
  
  const handleViewTraining = (staffId: string) => {
    router.push(`/staff/training?id=${staffId}`);
    handleMenuClose();
  };
  
  const handleViewPerformance = (staffId: string) => {
    router.push(`/staff/performance?id=${staffId}`);
    handleMenuClose();
  };
  
  return (
    <Layout title="Staff Management">
      <Head>
        <title>Staff Management | Bean Counter Coffee Shop ERP</title>
      </Head>
      
      <Box mb={4}>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="body2" color="textSecondary">
              Manage staff information, schedules, and performance
            </Typography>
          </Grid>
          
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddStaff}
            >
              Add Staff Member
            </Button>
          </Grid>
        </Grid>
      </Box>
      
      <Paper sx={{ mb: 4, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search staff by name, position, email..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={activeTab}
                onChange={handleChangeTab}
                variant="scrollable"
                scrollButtons="auto"
              >
                {departments.map((dept) => (
                  <Tab 
                    key={dept}
                    label={dept === 'all' ? 'All Departments' : dept}
                    value={dept}
                  />
                ))}
              </Tabs>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {filteredStaff.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          No staff members found matching your criteria.
        </Alert>
      ) : (
        <Paper>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100' }}>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStaff
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((member) => (
                    <TableRow key={member.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: theme.palette.primary.main,
                              color: theme.palette.primary.contrastText,
                              mr: 2
                            }}
                          >
                            {member.firstName[0]}{member.lastName[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="body1">
                              {member.firstName} {member.lastName}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              Since {new Date(member.hireDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{member.position}</TableCell>
                      <TableCell>{member.department}</TableCell>
                      <TableCell>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <EmailIcon fontSize="small" sx={{ mr: 1, color: 'action.active' }} />
                            <Typography variant="body2">{member.email}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'action.active' }} />
                            <Typography variant="body2">{member.phone}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={member.status.charAt(0).toUpperCase() + member.status.slice(1).replace('-', ' ')}
                          color={getStatusChipColor(member.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="More Actions">
                          <IconButton onClick={(e) => handleMenuClick(e, member.id)}>
                            <MoreIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredStaff.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => selectedStaffId && handleEditStaff(selectedStaffId)}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit Staff Member
        </MenuItem>
        <MenuItem onClick={() => handleAddShift()}>
          <CalendarIcon fontSize="small" sx={{ mr: 1 }} />
          Add Shift
        </MenuItem>
        <MenuItem onClick={() => selectedStaffId && handleViewSchedule(selectedStaffId)}>
          <ContentPasteIcon fontSize="small" sx={{ mr: 1 }} />
          View Schedule
        </MenuItem>
        <MenuItem onClick={() => selectedStaffId && handleViewTraining(selectedStaffId)}>
          <SchoolIcon fontSize="small" sx={{ mr: 1 }} />
          Training Records
        </MenuItem>
        <MenuItem onClick={() => selectedStaffId && handleViewPerformance(selectedStaffId)}>
          <AssessmentOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
          Performance Reviews
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => selectedStaffId && handleDeleteStaff(selectedStaffId)}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete Staff Member
        </MenuItem>
      </Menu>
      
      {/* Forms */}
      <StaffForm
        open={staffFormOpen}
        onClose={() => setStaffFormOpen(false)}
        onSave={handleSaveStaff}
        initialData={editingStaff}
      />
      
      <ShiftForm
        open={shiftFormOpen}
        onClose={() => setShiftFormOpen(false)}
        onSave={handleSaveShift}
        staffList={staff}
      />
    </Layout>
  );
};

export default StaffPage; 