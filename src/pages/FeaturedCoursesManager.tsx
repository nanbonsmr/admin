import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
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
  Switch,
  FormControlLabel,
  Autocomplete,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Divider,
} from '@mui/material';
import { SimpleGrid as Grid } from '../components/SimpleGrid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  DragIndicator as DragIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convexClient';
import { Id } from '../../convex/_generated/dataModel';

interface FeaturedCourseForm {
  courseId: Id<'courses'> | null;
  reason: string;
  badgeText: string;
  badgeColor: string;
  featuredUntil?: number;
}

const initialForm: FeaturedCourseForm = {
  courseId: null,
  reason: '',
  badgeText: 'Featured',
  badgeColor: '#3b82f6',
};

const badgeColors = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#10b981' },
  { name: 'Yellow', value: '#f59e0b' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Orange', value: '#f97316' },
];

export default function FeaturedCoursesManager() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<Id<'featuredCourses'> | null>(null);
  const [form, setForm] = useState<FeaturedCourseForm>(initialForm);
  const [deleteConfirm, setDeleteConfirm] = useState<Id<'featuredCourses'> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Queries
  const featuredCourses = useQuery(api.featuredCourses.getAllFeaturedCoursesAdmin);
  const allCourses = useQuery(api.courses.list, { onlyPublished: true });
  const adminUser = useQuery(api.users.getAdminUser);

  // Mutations
  const addFeaturedCourse = useMutation(api.featuredCourses.addFeaturedCourse);
  const updateFeaturedCourse = useMutation(api.featuredCourses.updateFeaturedCourse);
  const removeFeaturedCourse = useMutation(api.featuredCourses.removeFeaturedCourse);
  const reorderFeaturedCourses = useMutation(api.featuredCourses.reorderFeaturedCourses);

  // Get available courses (not already featured)
  const availableCourses = allCourses?.filter(course => 
    !featuredCourses?.some(fc => fc.courseId === course._id && fc.isActive)
  ) || [];

  const handleSubmit = async () => {
    if (!form.courseId) {
      alert('Please select a course');
      return;
    }

    setIsSubmitting(true);

    // Get admin ID - use adminUser if available, otherwise use first available user
    let adminId = adminUser?._id;
    
    if (!adminId) {
      alert('No admin user available. Please ensure an admin user exists.');
      setIsSubmitting(false);
      return;
    }

    try {
      const courseData = {
        courseId: form.courseId,
        featuredBy: adminId,
        reason: form.reason,
        badgeText: form.badgeText,
        badgeColor: form.badgeColor,
        featuredUntil: form.featuredUntil,
      };

      if (editingId) {
        await updateFeaturedCourse({
          featuredCourseId: editingId,
          ...courseData,
        });
        alert('Featured course updated successfully!');
      } else {
        await addFeaturedCourse(courseData);
        alert('Course added to featured list successfully!');
      }

      handleClose();
    } catch (error: unknown) {
      console.error('Error saving featured course:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert('Failed to save featured course: ' + errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (featuredCourse: any) => {
    setEditingId(featuredCourse._id);
    setForm({
      courseId: featuredCourse.courseId,
      reason: featuredCourse.reason || '',
      badgeText: featuredCourse.badgeText || 'Featured',
      badgeColor: featuredCourse.badgeColor || '#3b82f6',
      featuredUntil: featuredCourse.featuredUntil,
    });
    setOpen(true);
  };

  const handleDelete = async (id: Id<'featuredCourses'>) => {
    try {
      await removeFeaturedCourse({ featuredCourseId: id });
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error removing featured course:', error);
    }
  };

  const handleToggleActive = async (featuredCourse: any) => {
    try {
      await updateFeaturedCourse({
        featuredCourseId: featuredCourse._id,
        isActive: !featuredCourse.isActive,
      });
    } catch (error) {
      console.error('Error toggling featured course:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
    setForm(initialForm);
  };

  const activeFeaturedCourses = featuredCourses?.filter(fc => fc.isActive) || [];
  const inactiveFeaturedCourses = featuredCourses?.filter(fc => !fc.isActive) || [];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Featured Courses Manager
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {availableCourses.length} courses available to feature
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            disabled={availableCourses.length === 0}
          >
            Add Featured Course
          </Button>
        </Box>
      </Box>

      {availableCourses.length === 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography color="text.secondary">
            All published courses are already featured or no courses available.
          </Typography>
        </Box>
      )}

      {/* Active Featured Courses */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Active Featured Courses ({activeFeaturedCourses.length})
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {activeFeaturedCourses
          .sort((a, b) => a.order - b.order)
          .map((featuredCourse, index) => (
          <Grid item xs={12} md={6} lg={4} key={featuredCourse._id}>
            <Card sx={{ position: 'relative' }}>
              {featuredCourse.course?.coverImage && (
                <CardMedia
                  component="img"
                  height="140"
                  image={featuredCourse.course.coverImage}
                  alt={featuredCourse.course.title}
                />
              )}
              
              {/* Badge */}
              <Chip
                label={featuredCourse.badgeText}
                sx={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  backgroundColor: featuredCourse.badgeColor,
                  color: 'white',
                  fontWeight: 'bold',
                }}
              />

              {/* Order indicator */}
              <Chip
                label={`#${featuredCourse.order}`}
                size="small"
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                }}
              />

              <CardContent>
                <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                  {featuredCourse.course?.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {featuredCourse.course?.description}
                </Typography>

                {featuredCourse.reason && (
                  <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                    Reason: {featuredCourse.reason}
                  </Typography>
                )}

                <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                  Featured: {new Date(featuredCourse.featuredAt).toLocaleDateString()}
                </Typography>

                {featuredCourse.featuredUntil && (
                  <Typography variant="caption" display="block" sx={{ mb: 2 }}>
                    Until: {new Date(featuredCourse.featuredUntil).toLocaleDateString()}
                  </Typography>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={featuredCourse.isActive}
                        onChange={() => handleToggleActive(featuredCourse)}
                        size="small"
                      />
                    }
                    label="Active"
                  />
                  
                  <Box>
                    <IconButton onClick={() => handleEdit(featuredCourse)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => setDeleteConfirm(featuredCourse._id)} size="small">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Inactive Featured Courses */}
      {inactiveFeaturedCourses.length > 0 && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h5" sx={{ mb: 2 }}>
            Inactive Featured Courses ({inactiveFeaturedCourses.length})
          </Typography>
          
          <List>
            {inactiveFeaturedCourses.map((featuredCourse) => (
              <ListItem key={featuredCourse._id}>
                <Avatar sx={{ mr: 2, bgcolor: featuredCourse.badgeColor }}>
                  <StarIcon />
                </Avatar>
                <ListItemText
                  primary={featuredCourse.course?.title}
                  secondary={`Deactivated • Featured from ${new Date(featuredCourse.featuredAt).toLocaleDateString()}`}
                />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => handleToggleActive(featuredCourse)}>
                    <ViewIcon />
                  </IconButton>
                  <IconButton onClick={() => setDeleteConfirm(featuredCourse._id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingId ? 'Edit Featured Course' : 'Add Featured Course'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {!editingId && (
              <Autocomplete
                options={availableCourses}
                getOptionLabel={(course) => course.title}
                value={availableCourses.find(course => course._id === form.courseId) || null}
                onChange={(_, course) => setForm({ ...form, courseId: course?._id || null })}
                renderInput={(params) => (
                  <TextField {...params} label="Select Course" required />
                )}
              />
            )}

            <TextField
              label="Reason for Featuring"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              multiline
              rows={2}
              fullWidth
              placeholder="Why is this course being featured?"
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Badge Text"
                  value={form.badgeText}
                  onChange={(e) => setForm({ ...form, badgeText: e.target.value })}
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Badge Color</InputLabel>
                  <Select
                    value={form.badgeColor}
                    onChange={(e) => setForm({ ...form, badgeColor: e.target.value })}
                  >
                    {badgeColors.map((color) => (
                      <MenuItem key={color.value} value={color.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              backgroundColor: color.value,
                              borderRadius: 1,
                            }}
                          />
                          {color.name}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <TextField
              label="Featured Until (Optional)"
              type="datetime-local"
              value={form.featuredUntil ? new Date(form.featuredUntil).toISOString().slice(0, 16) : ''}
              onChange={(e) => setForm({ 
                ...form, 
                featuredUntil: e.target.value ? new Date(e.target.value).getTime() : undefined 
              })}
              fullWidth
              InputLabelProps={{ shrink: true }}
              helperText="Leave empty for no expiration"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={!form.courseId || isSubmitting}
          >
            {isSubmitting ? 'Saving...' : (editingId ? 'Update' : 'Add')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Confirm Remove</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove this course from featured courses?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button 
            onClick={() => deleteConfirm && handleDelete(deleteConfirm)} 
            color="error"
            variant="contained"
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}