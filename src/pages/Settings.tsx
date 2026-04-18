import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Alert,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tab,
  Tabs,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
} from '@mui/material';
import { SimpleGrid as Grid } from '../components/SimpleGrid';
import {
  Settings as SettingsIcon,
  Security,
  Notifications,
  Storage,
  Palette,
  Language,
  Email,
  Backup,
  Delete,
  Edit,
  Add,
  Save,
  Refresh,
  Download,
  Upload,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../convexClient';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function Settings() {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch settings from Convex
  const allSettings = useQuery(api.settings.getAllSettings);
  const systemInfo = useQuery(api.settings.getSystemInfo);

  // Mutations
  const updateGeneralSettings = useMutation(api.settings.updateGeneralSettings);
  const updateSecuritySettings = useMutation(api.settings.updateSecuritySettings);
  const updateNotificationSettings = useMutation(api.settings.updateNotificationSettings);
  const updateSystemSettings = useMutation(api.settings.updateSystemSettings);

  // Settings state - initialize with data from Convex
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Knowva Learning Platform',
    siteDescription: 'Advanced Learning Management System',
    adminEmail: 'admin@knowva.com',
    supportEmail: 'support@knowva.com',
    timezone: 'UTC',
    language: 'en',
    maintenanceMode: false,
  });

  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: 24,
    maxLoginAttempts: 5,
    requireStrongPasswords: true,
    enableTwoFactor: false,
    autoLogoutInactive: true,
    passwordExpiry: 90,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    paymentAlerts: true,
    newUserRegistrations: true,
    courseCompletions: true,
    systemAlerts: true,
    weeklyReports: true,
  });

  const [systemSettings, setSystemSettings] = useState({
    maxFileSize: 50,
    allowedFileTypes: ['pdf', 'doc', 'docx', 'jpg', 'png', 'mp4'],
    autoBackup: true,
    backupFrequency: 'daily',
    cacheEnabled: true,
    debugMode: false,
  });

  // Update state when Convex data loads
  React.useEffect(() => {
    if (allSettings) {
      setGeneralSettings(allSettings.general);
      setSecuritySettings(allSettings.security);
      setNotificationSettings(allSettings.notifications);
      setSystemSettings(allSettings.system);
    }
  }, [allSettings]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSaveSettings = async (settingsType: string) => {
    if (!user) return;
    
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      switch (settingsType) {
        case 'General':
          await updateGeneralSettings({
            settings: generalSettings,
            updatedBy: user._id as any,
          });
          break;
        case 'Security':
          await updateSecuritySettings({
            settings: securitySettings,
            updatedBy: user._id as any,
          });
          break;
        case 'Notification':
          await updateNotificationSettings({
            settings: notificationSettings,
            updatedBy: user._id as any,
          });
          break;
        case 'System':
          await updateSystemSettings({
            settings: systemSettings,
            updatedBy: user._id as any,
          });
          break;
      }
      
      setSuccess(`${settingsType} settings saved successfully!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      setError(`Failed to save ${settingsType.toLowerCase()} settings: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportSettings = () => {
    const allSettings = {
      general: generalSettings,
      security: securitySettings,
      notifications: notificationSettings,
      system: systemSettings,
      exportedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(allSettings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `knowva-settings-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const settings = JSON.parse(e.target?.result as string);
          if (settings.general) setGeneralSettings(settings.general);
          if (settings.security) setSecuritySettings(settings.security);
          if (settings.notifications) setNotificationSettings(settings.notifications);
          if (settings.system) setSystemSettings(settings.system);
          setSuccess('Settings imported successfully!');
        } catch (error) {
          setError('Invalid settings file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            System Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Configure your Knowva learning platform settings
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportSettings}
          >
            Export Settings
          </Button>
          <Button
            variant="outlined"
            component="label"
            startIcon={<Upload />}
          >
            Import Settings
            <input
              type="file"
              accept=".json"
              hidden
              onChange={handleImportSettings}
            />
          </Button>
        </Box>
      </Box>

      {/* Success/Error Messages */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Settings Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<SettingsIcon />} label="General" />
          <Tab icon={<Security />} label="Security" />
          <Tab icon={<Notifications />} label="Notifications" />
          <Tab icon={<Storage />} label="System" />
        </Tabs>

        {/* General Settings */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Site Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      label="Site Name"
                      value={generalSettings.siteName}
                      onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                      fullWidth
                    />
                    <TextField
                      label="Site Description"
                      value={generalSettings.siteDescription}
                      onChange={(e) => setGeneralSettings({...generalSettings, siteDescription: e.target.value})}
                      multiline
                      rows={3}
                      fullWidth
                    />
                    <TextField
                      label="Admin Email"
                      type="email"
                      value={generalSettings.adminEmail}
                      onChange={(e) => setGeneralSettings({...generalSettings, adminEmail: e.target.value})}
                      fullWidth
                    />
                    <TextField
                      label="Support Email"
                      type="email"
                      value={generalSettings.supportEmail}
                      onChange={(e) => setGeneralSettings({...generalSettings, supportEmail: e.target.value})}
                      fullWidth
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Localization
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControl fullWidth>
                      <InputLabel>Timezone</InputLabel>
                      <Select
                        value={generalSettings.timezone}
                        onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
                        label="Timezone"
                      >
                        <MenuItem value="UTC">UTC</MenuItem>
                        <MenuItem value="America/New_York">Eastern Time</MenuItem>
                        <MenuItem value="America/Chicago">Central Time</MenuItem>
                        <MenuItem value="America/Denver">Mountain Time</MenuItem>
                        <MenuItem value="America/Los_Angeles">Pacific Time</MenuItem>
                        <MenuItem value="Europe/London">London</MenuItem>
                        <MenuItem value="Europe/Paris">Paris</MenuItem>
                        <MenuItem value="Asia/Tokyo">Tokyo</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl fullWidth>
                      <InputLabel>Language</InputLabel>
                      <Select
                        value={generalSettings.language}
                        onChange={(e) => setGeneralSettings({...generalSettings, language: e.target.value})}
                        label="Language"
                      >
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="es">Spanish</MenuItem>
                        <MenuItem value="fr">French</MenuItem>
                        <MenuItem value="de">German</MenuItem>
                        <MenuItem value="ja">Japanese</MenuItem>
                        <MenuItem value="zh">Chinese</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControlLabel
                      control={
                        <Switch
                          checked={generalSettings.maintenanceMode}
                          onChange={(e) => setGeneralSettings({...generalSettings, maintenanceMode: e.target.checked})}
                        />
                      }
                      label="Maintenance Mode"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={() => handleSaveSettings('General')}
                  disabled={isLoading}
                >
                  Save General Settings
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Security Settings */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Authentication Security
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box>
                      <Typography gutterBottom>Session Timeout (hours)</Typography>
                      <Slider
                        value={securitySettings.sessionTimeout}
                        onChange={(e, value) => setSecuritySettings({...securitySettings, sessionTimeout: value as number})}
                        min={1}
                        max={72}
                        marks={[
                          { value: 1, label: '1h' },
                          { value: 24, label: '24h' },
                          { value: 72, label: '72h' }
                        ]}
                        valueLabelDisplay="auto"
                      />
                    </Box>

                    <TextField
                      label="Max Login Attempts"
                      type="number"
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})}
                      inputProps={{ min: 1, max: 10 }}
                    />

                    <TextField
                      label="Password Expiry (days)"
                      type="number"
                      value={securitySettings.passwordExpiry}
                      onChange={(e) => setSecuritySettings({...securitySettings, passwordExpiry: parseInt(e.target.value)})}
                      inputProps={{ min: 30, max: 365 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Security Options
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={securitySettings.requireStrongPasswords}
                          onChange={(e) => setSecuritySettings({...securitySettings, requireStrongPasswords: e.target.checked})}
                        />
                      }
                      label="Require Strong Passwords"
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={securitySettings.enableTwoFactor}
                          onChange={(e) => setSecuritySettings({...securitySettings, enableTwoFactor: e.target.checked})}
                        />
                      }
                      label="Enable Two-Factor Authentication"
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={securitySettings.autoLogoutInactive}
                          onChange={(e) => setSecuritySettings({...securitySettings, autoLogoutInactive: e.target.checked})}
                        />
                      }
                      label="Auto Logout on Inactivity"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={() => handleSaveSettings('Security')}
                  disabled={isLoading}
                >
                  Save Security Settings
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Notification Settings */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Email Notifications
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.emailNotifications}
                          onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})}
                        />
                      }
                      label="Enable Email Notifications"
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.paymentAlerts}
                          onChange={(e) => setNotificationSettings({...notificationSettings, paymentAlerts: e.target.checked})}
                        />
                      }
                      label="Payment Receipt Alerts"
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.newUserRegistrations}
                          onChange={(e) => setNotificationSettings({...notificationSettings, newUserRegistrations: e.target.checked})}
                        />
                      }
                      label="New User Registrations"
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.courseCompletions}
                          onChange={(e) => setNotificationSettings({...notificationSettings, courseCompletions: e.target.checked})}
                        />
                      }
                      label="Course Completions"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    System Alerts
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.systemAlerts}
                          onChange={(e) => setNotificationSettings({...notificationSettings, systemAlerts: e.target.checked})}
                        />
                      }
                      label="System Alerts"
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.weeklyReports}
                          onChange={(e) => setNotificationSettings({...notificationSettings, weeklyReports: e.target.checked})}
                        />
                      }
                      label="Weekly Reports"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={() => handleSaveSettings('Notification')}
                  disabled={isLoading}
                >
                  Save Notification Settings
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* System Settings */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    File Management
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography gutterBottom>Max File Size (MB)</Typography>
                      <Slider
                        value={systemSettings.maxFileSize}
                        onChange={(e, value) => setSystemSettings({...systemSettings, maxFileSize: value as number})}
                        min={1}
                        max={500}
                        marks={[
                          { value: 10, label: '10MB' },
                          { value: 50, label: '50MB' },
                          { value: 100, label: '100MB' },
                          { value: 500, label: '500MB' }
                        ]}
                        valueLabelDisplay="auto"
                      />
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Allowed File Types
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {systemSettings.allowedFileTypes.map((type) => (
                          <Chip
                            key={type}
                            label={type}
                            onDelete={() => {
                              setSystemSettings({
                                ...systemSettings,
                                allowedFileTypes: systemSettings.allowedFileTypes.filter(t => t !== type)
                              });
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    System Options
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={systemSettings.autoBackup}
                          onChange={(e) => setSystemSettings({...systemSettings, autoBackup: e.target.checked})}
                        />
                      }
                      label="Auto Backup"
                    />

                    <FormControl fullWidth>
                      <InputLabel>Backup Frequency</InputLabel>
                      <Select
                        value={systemSettings.backupFrequency}
                        onChange={(e) => setSystemSettings({...systemSettings, backupFrequency: e.target.value})}
                        label="Backup Frequency"
                        disabled={!systemSettings.autoBackup}
                      >
                        <MenuItem value="hourly">Hourly</MenuItem>
                        <MenuItem value="daily">Daily</MenuItem>
                        <MenuItem value="weekly">Weekly</MenuItem>
                        <MenuItem value="monthly">Monthly</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControlLabel
                      control={
                        <Switch
                          checked={systemSettings.cacheEnabled}
                          onChange={(e) => setSystemSettings({...systemSettings, cacheEnabled: e.target.checked})}
                        />
                      }
                      label="Enable Caching"
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={systemSettings.debugMode}
                          onChange={(e) => setSystemSettings({...systemSettings, debugMode: e.target.checked})}
                        />
                      }
                      label="Debug Mode"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={() => handleSaveSettings('System')}
                  disabled={isLoading}
                >
                  Save System Settings
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* System Information */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            System Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                <Typography variant="h4" color="primary.contrastText">
                  {systemInfo?.version || '1.0.0'}
                </Typography>
                <Typography variant="body2" color="primary.contrastText">
                  Version
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                <Typography variant="h4" color="success.contrastText">
                  {systemInfo?.uptime || '99.9%'}
                </Typography>
                <Typography variant="body2" color="success.contrastText">
                  Uptime
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                <Typography variant="h4" color="info.contrastText">
                  {systemInfo?.statistics?.totalUsers || 0}
                </Typography>
                <Typography variant="body2" color="info.contrastText">
                  Total Users
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                <Typography variant="h4" color="warning.contrastText">
                  {systemInfo?.status || 'Online'}
                </Typography>
                <Typography variant="body2" color="warning.contrastText">
                  Status
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Additional Statistics */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Platform Statistics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="h6" color="primary">
                    {systemInfo?.statistics?.totalCourses || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total Courses
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="h6" color="success.main">
                    {systemInfo?.statistics?.activeUsers || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Active Users
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="h6" color="info.main">
                    {systemInfo?.statistics?.totalPayments || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Payment Records
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="h6" color="warning.main">
                    {systemInfo?.lastUpdated ? new Date(systemInfo.lastUpdated).toLocaleDateString() : new Date().toLocaleDateString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Last Updated
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}