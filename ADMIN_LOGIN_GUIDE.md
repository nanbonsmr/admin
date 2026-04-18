# Knowva Admin Dashboard - Login System

## 🔐 Admin Authentication

The admin dashboard now includes a secure login system that protects all admin routes and functionality.

### 📋 Login Credentials

**Default Admin Account:**
- **Email:** `admin@knowva.com`
- **Password:** `admin123`

### 🚀 Getting Started

1. **Start the Admin Dashboard:**
   ```bash
   cd admin
   npm run dev
   ```

2. **Access the Login Page:**
   - Open your browser to `http://localhost:5174`
   - You'll be automatically redirected to `/login` if not authenticated

3. **Login Process:**
   - Enter the admin credentials above
   - Click "Sign In"
   - You'll be redirected to the dashboard upon successful authentication

### 🔒 Security Features

- **Role-based Access:** Only users with `admin` role can access the dashboard
- **Session Management:** Login state persists across browser sessions
- **Protected Routes:** All admin pages require authentication
- **Secure Logout:** Clear session data on logout
- **Input Validation:** Email and password validation
- **Error Handling:** Clear error messages for invalid credentials

### 👤 User Interface

**Login Page Features:**
- Clean, professional design
- Password visibility toggle
- Loading states during authentication
- Error alerts for failed attempts
- Demo credentials display

**Sidebar Features:**
- Admin user info display (name, email)
- Visual user avatar
- Secure logout button with confirmation

### 🛠 Technical Implementation

**Authentication Flow:**
1. `AuthContext` manages authentication state
2. `ProtectedRoute` component guards admin routes
3. `Login` page handles credential submission
4. Convex `adminLogin` mutation validates credentials
5. Session data stored in localStorage

**Backend Security:**
- Admin role verification
- Password validation (production should use hashing)
- Account status checking
- Proper error messages without information leakage

### 🔧 Customization

**Adding New Admin Users:**
1. Create user account through regular registration
2. Update user role to "admin" using the `updateUserRole` mutation
3. Ensure account status is "approved"

**Changing Default Credentials:**
1. Update the admin user in the database
2. Use the profile edit functionality (coming soon)
3. Or run a custom script to update credentials

### 🚨 Production Notes

**Security Improvements for Production:**
- Implement proper password hashing (bcrypt)
- Add rate limiting for login attempts
- Use JWT tokens instead of localStorage
- Add two-factor authentication
- Implement session timeout
- Add audit logging for admin actions
- Use HTTPS only
- Add CSRF protection

### 📱 Mobile Responsive

The login page is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile devices

### 🎯 Next Steps

- [ ] Add password reset functionality
- [ ] Implement admin user management
- [ ] Add audit logs for admin actions
- [ ] Create admin profile editing
- [ ] Add session timeout warnings
- [ ] Implement remember me functionality