import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../convexClient';

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin';
  accountStatus: string;
}

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const adminLoginMutation = useMutation(api.users.adminLogin);

  // Session timeout (24 hours)
  const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const ACTIVITY_CHECK_INTERVAL = 5 * 60 * 1000; // Check every 5 minutes

  // Check session validity
  const isSessionValid = (loginTime: number) => {
    return Date.now() - loginTime < SESSION_TIMEOUT;
  };

  // Update last activity time
  const updateActivity = () => {
    if (user) {
      localStorage.setItem('admin-last-activity', Date.now().toString());
    }
  };

  // Set up activity tracking
  useEffect(() => {
    if (user) {
      // Track user activity
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      
      events.forEach(event => {
        document.addEventListener(event, updateActivity, true);
      });

      // Check session validity periodically
      const activityInterval = setInterval(() => {
        const loginTime = localStorage.getItem('admin-login-time');
        const lastActivity = localStorage.getItem('admin-last-activity');
        
        if (loginTime && lastActivity) {
          const loginTimestamp = parseInt(loginTime);
          const lastActivityTimestamp = parseInt(lastActivity);
          
          // Check if session has expired or user has been inactive too long
          if (!isSessionValid(loginTimestamp) || 
              (Date.now() - lastActivityTimestamp > SESSION_TIMEOUT)) {
            logout();
          }
        }
      }, ACTIVITY_CHECK_INTERVAL);

      return () => {
        events.forEach(event => {
          document.removeEventListener(event, updateActivity, true);
        });
        clearInterval(activityInterval);
      };
    }
  }, [user]);

  // Get stored session
  useEffect(() => {
    const storedUser = localStorage.getItem('admin-user');
    const loginTime = localStorage.getItem('admin-login-time');
    
    if (storedUser && loginTime) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const parsedLoginTime = parseInt(loginTime);
        
        if (isSessionValid(parsedLoginTime)) {
          setUser(parsedUser);
          updateActivity(); // Update activity on page load
        } else {
          // Session expired, clear storage
          localStorage.removeItem('admin-user');
          localStorage.removeItem('admin-login-time');
          localStorage.removeItem('admin-last-activity');
        }
      } catch (error) {
        localStorage.removeItem('admin-user');
        localStorage.removeItem('admin-login-time');
        localStorage.removeItem('admin-last-activity');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userData = await adminLoginMutation({ email, password });
      
      const adminUser: AdminUser = {
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role as 'admin',
        accountStatus: userData.accountStatus,
      };
      
      const loginTime = Date.now();
      
      setUser(adminUser);
      localStorage.setItem('admin-user', JSON.stringify(adminUser));
      localStorage.setItem('admin-login-time', loginTime.toString());
      localStorage.setItem('admin-last-activity', loginTime.toString());
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('admin-user');
    localStorage.removeItem('admin-login-time');
    localStorage.removeItem('admin-last-activity');
    localStorage.removeItem('admin-session');
    
    // Clear any sensitive data from memory
    setIsLoading(false);
    
    // Force navigation to login page
    window.location.href = '/login';
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};