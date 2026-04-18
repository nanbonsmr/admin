import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Tooltip,
  Alert,
  TablePagination,
  InputAdornment,
  Menu,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { SimpleGrid as Grid } from '../components/SimpleGrid';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  PersonAdd as PersonAddIcon,
  Email as EmailIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convexClient';
import { Id } from '../../../convex/_generated/dataModel';

interface StudentDetailsModalProps {
  student: any;
  open: boolean;
  onClose: () => void;
}

function StudentDetailsModal({ student, open, onClose }: StudentDetailsModalProps) {
  const studentEnrollments = useQuery(
    api.enrollments.getUserEnrollments,
    student ? { userId: student._id } : 'skip'
  );
  const studentNotes = useQuery(
    api.notes.getUserNotes,
    student ? { userId: student._id } : 'skip'
  );
  const studentDownloads = useQuery(
    api.offlineDownloads.getUserDownloads,
    student ? { userId: student._id } : 'skip'
  );

  if (!student) return null;

  const completedCourses = studentEnrollments?.filter(e => e.completionStatus === 'completed').length || 0;
  const inProgressCourses = studentEnrollments?.filter(e => e.completionStatus === 'in_progress').length || 0;
  const totalLearningTime = studentEnrollments?.reduce((total, e) => total + (e.timeSpent || 0), 0) || 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {student.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h6">{student.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {student.email}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3}>
          {/* Student Info */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Account Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2">
                    <strong>Phone:</strong> {student.phone || 'Not provided'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Role:</strong> {student.role}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Status:</strong> 
                    <Chip 
                      label={student.accountStatus} 
                      size="small" 
                      sx={{ ml: 1 }}
                      color={student.accountStatus === 'approved' ? 'success' : 'warning'}
                    />
                  </Typography>
                  <Typography variant="body2">
                    <strong>Joined:</strong> {new Date(student.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Learning Statistics */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Learning Statistics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary">
                        {studentEnrollments?.length || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Enrolled Courses
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="success.main">
                        {completedCourses}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Completed
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="warning.main">
                        {inProgressCourses}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        In Progress
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="info.main">
                        {Math.round(totalLearningTime / 60)}h
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Learning Time
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Additional Stats */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="primary">
                      {studentNotes?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Notes Created
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="secondary">
                      {studentDownloads?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Downloads
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="success.main">
                      {completedCourses > 0 ? Math.round((completedCourses / (studentEnrollments?.length || 1)) * 100) : 0}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completion Rate
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          {/* Recent Enrollments */}
          {studentEnrollments && studentEnrollments.length > 0 && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Enrollments
                  </Typography>
                  <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                    {studentEnrollments.slice(0, 5).map((enrollment) => (
                      <Box key={enrollment._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: '1px solid #eee' }}>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {enrollment.course?.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Chip 
                          label={enrollment.completionStatus} 
                          size="small"
                          color={enrollment.completionStatus === 'completed' ? 'success' : 
                                 enrollment.completionStatus === 'in_progress' ? 'warning' : 'default'}
                        />
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function Students() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuStudent, setMenuStudent] = useState<any>(null);
  
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    accountStatus: 'active' as any,
    role: 'student' as any,
  });

  // Queries
  const allUsers = useQuery(api.users.getAllUsers);
  const pendingPayments = useQuery(api.payments.getPendingPaymentReceipts);
  const updateUserStatus = useMutation(api.users.updateAccountStatus);
  const updateUserRole = useMutation(api.users.updateUserRole);

  // Filter students only
  const students = allUsers?.filter(user => user.role === 'student') || [];

  // Apply filters
  const filteredStudents = students.filter(student => {
    const matchesSearch = searchQuery === '' || 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || student.accountStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const paginatedStudents = filteredStudents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleViewDetails = (student: any) => {
    setSelectedStudent(student);
    setDetailsModalOpen(true);
    handleMenuClose();
  };

  const handleEdit = (student: any) => {
    setSelectedStudent(student);
    setEditForm({
      name: student.name,
      email: student.email,
      phone: student.phone || '',
      accountStatus: student.accountStatus,
      role: student.role,
    });
    setEditModalOpen(true);
    handleMenuClose();
  };

  const handleSaveEdit = async () => {
    if (!selectedStudent) return;

    try {
      // Update account status if changed
      if (editForm.accountStatus !== selectedStudent.accountStatus) {
        await updateUserStatus({
          userId: selectedStudent._id,
          status: editForm.accountStatus,
        });
      }

      // Update role if changed
      if (editForm.role !== selectedStudent.role) {
        await updateUserRole({
          userId: selectedStudent._id,
          role: editForm.role,
        });
      }

      setEditModalOpen(false);
      setSelectedStudent(null);
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const handleStatusChange = async (student: any, newStatus: string) => {
    try {
      await updateUserStatus({
        userId: student._id,
        status: newStatus as any,
      });
      handleMenuClose();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, student: any) => {
    setAnchorEl(event.currentTarget);
    setMenuStudent(student);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuStudent(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'active': return 'success';
      case 'pending_payment': return 'warning';
      case 'payment_submitted': return 'info';
      case 'rejected': return 'error';
      case 'suspended': return 'error';
      default: return 'default';
    }
  };

  const exportStudents = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Status', 'Role', 'Joined Date'].join(','),
      ...filteredStudents.map(student => [
        student.name,
        student.email,
        student.phone || '',
        student.accountStatus,
        student.role,
        new Date(student.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Students Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={exportStudents}
          >
            Export CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => {/* Add new student functionality */}}
          >
            Add Student
          </Button>
        </Box>
      </Box>

      {/* Payment Alerts */}
      {pendingPayments && pendingPayments.length > 0 && (
        <Alert 
          severity="info" 
          sx={{ mb: 3 }}
          action={
            <Button 
              color="inherit" 
              size="small"
              onClick={() => window.open('/payment-approvals', '_blank')}
            >
              Review Payments
            </Button>
          }
        >
          <strong>{pendingPayments.length} new payment receipt{pendingPayments.length > 1 ? 's' : ''}</strong> waiting for approval. 
          Students cannot access course content until their payments are approved.
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Students
                  </Typography>
                  <Typography variant="h4">
                    {students.length}
                  </Typography>
                </Box>
                <SchoolIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Active Students
                  </Typography>
                  <Typography variant="h4">
                    {students.filter(s => s.accountStatus === 'approved' || s.accountStatus === 'active').length}
                  </Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Pending Approval
                  </Typography>
                  <Typography variant="h4">
                    {students.filter(s => s.accountStatus === 'payment_submitted' || s.accountStatus === 'pending_payment').length}
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, color: 'warning.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    New This Month
                  </Typography>
                  <Typography variant="h4">
                    {students.filter(s => {
                      const oneMonthAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
                      return s.createdAt > oneMonthAgo;
                    }).length}
                  </Typography>
                </Box>
                <PersonAddIcon sx={{ fontSize: 40, color: 'info.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search students by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status Filter"
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="pending_payment">Pending Payment</MenuItem>
                  <MenuItem value="payment_submitted">Payment Submitted</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">
                Showing {filteredStudents.length} of {students.length} students
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Joined Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedStudents.map((student) => (
                <TableRow key={student._id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {student.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {student.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {student._id.slice(-8)}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{student.email}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {student.phone || 'No phone'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={student.accountStatus}
                        color={getStatusColor(student.accountStatus) as any}
                        size="small"
                      />
                      {student.accountStatus === 'payment_submitted' && (
                        <Tooltip title="Payment receipt submitted - needs admin approval">
                          <Chip
                            label="NEW PAYMENT"
                            color="warning"
                            size="small"
                            variant="outlined"
                            sx={{ 
                              animation: 'pulse 2s infinite',
                              '@keyframes pulse': {
                                '0%': { opacity: 1 },
                                '50%': { opacity: 0.5 },
                                '100%': { opacity: 1 },
                              }
                            }}
                          />
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(student.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, student)}
                      size="small"
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredStudents.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleViewDetails(menuStudent)}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleEdit(menuStudent)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Student</ListItemText>
        </MenuItem>
        {menuStudent?.accountStatus !== 'approved' && (
          <MenuItem onClick={() => handleStatusChange(menuStudent, 'approved')}>
            <ListItemIcon>
              <CheckCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Approve</ListItemText>
          </MenuItem>
        )}
        {menuStudent?.accountStatus !== 'suspended' && (
          <MenuItem onClick={() => handleStatusChange(menuStudent, 'suspended')}>
            <ListItemIcon>
              <BlockIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Suspend</ListItemText>
          </MenuItem>
        )}
      </Menu>

      {/* Student Details Modal */}
      <StudentDetailsModal
        student={selectedStudent}
        open={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedStudent(null);
        }}
      />

      {/* Edit Student Modal */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Student</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Name"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              fullWidth
              disabled
            />
            <TextField
              label="Email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              fullWidth
              disabled
            />
            <TextField
              label="Phone"
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              fullWidth
              disabled
            />
            <FormControl fullWidth>
              <InputLabel>Account Status</InputLabel>
              <Select
                value={editForm.accountStatus}
                onChange={(e) => setEditForm({ ...editForm, accountStatus: e.target.value })}
                label="Account Status"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="pending_payment">Pending Payment</MenuItem>
                <MenuItem value="payment_submitted">Payment Submitted</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={editForm.role}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                label="Role"
              >
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="instructor">Instructor</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}