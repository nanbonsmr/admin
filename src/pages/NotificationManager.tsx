import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Chip,
  IconButton,
  Alert,
  Switch,
  FormControlLabel,
  Autocomplete,
} from '@mui/material';
import { SimpleGrid as Grid } from '../components/SimpleGrid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  Visibility as ViewIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convexClient';
import { Id } from '../../convex/_generated/dataModel';

interface NotificationForm {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'announcement';
  targetAudience: 'all' | 'students' | 'instructors' | 'specific_users';
  targetUserIds: Id<'users'>[];
  courseId?: Id<'courses'>;
  scheduledAt?: number;
  expiresAt?: number;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  actionText?: string;
}

const initialForm: NotificationForm = {
  title: '',
  message: '',
  type: 'info',
  targetAudience: 'all',
  targetUserIds: [],
  priority: 'medium',
};

export default function NotificationManager() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<Id<'notifications'> | null>(null);
  const [form, setForm] = useState<NotificationForm>(initialForm);
  const [deleteConfirm, setDeleteConfirm] = useState<Id<'notifications'> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Queries
  const notifications = useQuery(api.notifications.getAllNotifications);
  const courses = useQuery(api.courses.list, { onlyPublished: false });
  const users = useQuery(api.users.getAllUsers);
  const adminUser = useQuery(api.users.getAdminUser);

  // Mutations
  const createNotification = useMutation(api.notifications.createNotification);
  const updateNotification = useMutation(api.notifications.updateNotification);
  const deleteNotification = useMutation(api.notifications.deleteNotification);

  const handleSubmit = async () => {
    console.log('Submit clicked, form data:', form);
    
    // Validate required fields
    if (!form.title.trim()) {
      alert('Title is required');
      return;
    }
    
    if (!form.message.trim()) {
      alert('Message is required');
      return;
    }
    
    setIsSubmitting(true);
    
    // Get admin ID - use adminUser if available, otherwise use first available user
    let adminId = adminUser?._id;
    
    if (!adminId && users && users.length > 0) {
      // Use the first user as fallback
      adminId = users[0]._id;
      console.log('Using fallback user ID:', adminId);
    }
    
    if (!adminId) {
      alert('No admin user available. Please ensure at least one user exists in the system.');
      setIsSubmitting(false);
      return;
    }
    
    console.log('Using admin ID:', adminId);
    
    try {
      const notificationData = {
        title: form.title,
        message: form.message,
        type: form.type,
        targetAudience: form.targetAudience,
        targetUserIds: form.targetUserIds,
        courseId: form.courseId,
        createdBy: adminId,
        scheduledAt: form.scheduledAt,
        expiresAt: form.expiresAt,
        priority: form.priority,
        actionUrl: form.actionUrl,
        actionText: form.actionText,
      };
      
      console.log('Sending notification data:', notificationData);

      if (editingId) {
        console.log('Updating notification:', editingId);
        await updateNotification({
          notificationId: editingId,
          ...notificationData,
        });
        console.log('Notification updated successfully');
        alert('Notification updated successfully!');
      } else {
        console.log('Creating new notification');
        const result = await createNotification(notificationData);
        console.log('Notification created successfully:', result);
        alert('Notification created successfully!');
      }

      handleClose();
    } catch (error) {
      console.error('Error saving notification:', error);
      alert('Failed to save notification: ' + (error?.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (notification: any) => {
    setEditingId(notification._id);
    setForm({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      targetAudience: notification.targetAudience,
      targetUserIds: notification.targetUserIds || [],
      courseId: notification.courseId,
      scheduledAt: notification.scheduledAt,
      expiresAt: notification.expiresAt,
      priority: notification.priority,
      actionUrl: notification.actionUrl,
      actionText: notification.actionText,
    });
    setOpen(true);
  };

  const handleDelete = async (id: Id<'notifications'>) => {
    try {
      await deleteNotification({ notificationId: id });
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
    setForm(initialForm);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      case 'announcement': return 'secondary';
      default: return 'primary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Notification Manager
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {users && (
            <Typography variant="body2" color="text.secondary">
              {users.length} users available
            </Typography>
          )}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            disabled={!users || users.length === 0}
          >
            Create Notification
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {notifications?.map((notification) => (
          <Grid item xs={12} md={6} lg={4} key={notification._id}>
            <Card>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                      {notification.title}
                    </Typography>
                    <Chip
                      label={notification.type}
                      color={getTypeColor(notification.type) as any}
                      size="small"
                    />
                  </Box>
                }
                subheader={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <Chip
                      label={notification.priority}
                      color={getPriorityColor(notification.priority) as any}
                      size="small"
                    />
                    <Chip
                      label={notification.targetAudience}
                      variant="outlined"
                      size="small"
                    />
                    {!notification.isActive && (
                      <Chip label="Inactive" color="default" size="small" />
                    )}
                  </Box>
                }
                action={
                  <Box>
                    <IconButton onClick={() => handleEdit(notification)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => setDeleteConfirm(notification._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {notification.message}
                </Typography>
                
                {notification.course && (
                  <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                    Course: {notification.course.title}
                  </Typography>
                )}
                
                <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                  Created: {new Date(notification.createdAt).toLocaleDateString()}
                </Typography>
                
                {notification.scheduledAt && (
                  <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                    Scheduled: {new Date(notification.scheduledAt).toLocaleDateString()}
                  </Typography>
                )}
                
                {notification.expiresAt && (
                  <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                    Expires: {new Date(notification.expiresAt).toLocaleDateString()}
                  </Typography>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Typography variant="caption">
                    Recipients: {notification.stats.totalRecipients}
                  </Typography>
                  <Typography variant="caption">
                    Read: {notification.stats.readCount}/{notification.stats.totalRecipients}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingId ? 'Edit Notification' : 'Create New Notification'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              fullWidth
              required
            />
            
            <TextField
              label="Message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              multiline
              rows={4}
              fullWidth
              required
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                  >
                    <MenuItem value="info">Info</MenuItem>
                    <MenuItem value="warning">Warning</MenuItem>
                    <MenuItem value="success">Success</MenuItem>
                    <MenuItem value="error">Error</MenuItem>
                    <MenuItem value="announcement">Announcement</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <FormControl fullWidth>
              <InputLabel>Target Audience</InputLabel>
              <Select
                value={form.targetAudience}
                onChange={(e) => setForm({ ...form, targetAudience: e.target.value as any })}
              >
                <MenuItem value="all">All Users</MenuItem>
                <MenuItem value="students">Students Only</MenuItem>
                <MenuItem value="instructors">Instructors Only</MenuItem>
                <MenuItem value="specific_users">Specific Users</MenuItem>
              </Select>
            </FormControl>

            {form.targetAudience === 'specific_users' && users && (
              <Autocomplete
                multiple
                options={users}
                getOptionLabel={(user) => `${user.name} (${user.email})`}
                value={users.filter(user => form.targetUserIds.includes(user._id))}
                onChange={(_, selectedUsers) => 
                  setForm({ ...form, targetUserIds: selectedUsers.map(user => user._id) })
                }
                renderInput={(params) => (
                  <TextField {...params} label="Select Users" />
                )}
              />
            )}

            {courses && (
              <Autocomplete
                options={courses}
                getOptionLabel={(course) => course.title}
                value={courses.find(course => course._id === form.courseId) || null}
                onChange={(_, course) => setForm({ ...form, courseId: course?._id })}
                renderInput={(params) => (
                  <TextField {...params} label="Related Course (Optional)" />
                )}
              />
            )}

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Action URL (Optional)"
                  value={form.actionUrl || ''}
                  onChange={(e) => setForm({ ...form, actionUrl: e.target.value })}
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  label="Action Button Text"
                  value={form.actionText || ''}
                  onChange={(e) => setForm({ ...form, actionText: e.target.value })}
                  fullWidth
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Schedule For (Optional)"
                  type="datetime-local"
                  value={form.scheduledAt ? new Date(form.scheduledAt).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setForm({ 
                    ...form, 
                    scheduledAt: e.target.value ? new Date(e.target.value).getTime() : undefined 
                  })}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  label="Expires At (Optional)"
                  type="datetime-local"
                  value={form.expiresAt ? new Date(form.expiresAt).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setForm({ 
                    ...form, 
                    expiresAt: e.target.value ? new Date(e.target.value).getTime() : undefined 
                  })}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : (editingId ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this notification? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button 
            onClick={() => deleteConfirm && handleDelete(deleteConfirm)} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}