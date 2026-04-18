import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  GraduationCap, 
  Settings, 
  LogOut, 
  BookOpen,
  BarChart3,
  Video,
  MessageSquare,
  Users,
  Award,
  HelpCircle,
  CreditCard,
  Plus,
  Bell,
  Star,
  User,
  PieChart
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useAuth } from "../contexts/AuthContext";
import LogoutDialog from "./LogoutDialog";
import { useState } from "react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: GraduationCap, label: "Courses", href: "/courses" },
  { icon: Plus, label: "Create Course", href: "/courses/create" },
  { icon: Star, label: "Featured Courses", href: "/featured-courses" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: PieChart, label: "Quiz Analytics", href: "/quiz-analytics" },
  { icon: Video, label: "Live Sessions", href: "/live-sessions" },
  { icon: MessageSquare, label: "Forums", href: "/forums" },
  { icon: Users, label: "Students", href: "/students" },
  { icon: Award, label: "Certificates", href: "/certificates" },
  { icon: CreditCard, label: "Payment Approvals", href: "/payment-approvals" },
];

const secondaryNavItems = [
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: HelpCircle, label: "Help", href: "/help" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(false);
    logout();
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
          <BookOpen className="text-white" size={24} />
        </div>
        <span className="text-xl font-bold text-gray-900 tracking-tight">Knowva Admin</span>
      </div>

      {/* User Info */}
      {user && (
        <div className="px-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={16} className="text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-2 space-y-1 border-t border-gray-100">
        {secondaryNavItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={handleLogoutClick}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>

      {/* Logout Confirmation Dialog */}
      <LogoutDialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        userName={user?.name}
      />
    </aside>
  );
}
