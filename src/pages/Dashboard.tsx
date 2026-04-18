import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { 
  GraduationCap, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Users, 
  TrendingUp, 
  DollarSign,
  Calendar,
  Award,
  MessageSquare,
  Video,
  BarChart3,
  Eye,
  PlayCircle,
  UserCheck,
  AlertCircle,
  Plus,
  Settings
} from "lucide-react";
import StatCard from "../components/StatCard";
import QuickActionCard from "../components/QuickActionCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Dashboard() {
  const courses = useQuery(api.courses.list, { onlyPublished: false });
  const paymentStats = useQuery(api.payments.getPaymentStatistics);
  const pendingReceipts = useQuery(api.payments.getPendingPaymentReceipts);
  const popularContent = useQuery(api.analytics.getPopularContent, { limit: 5 });
  const enrollmentStats = useQuery(api.analytics.getEnrollmentStats);
  const upcomingSessions = useQuery(api.liveSessions.getUpcomingSessions, { limit: 3 });

  // Loading state
  if (courses === undefined || paymentStats === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const mainStats = [
    {
      title: "Total Courses",
      value: courses?.length || 0,
      icon: GraduationCap,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+12%",
      changeType: "positive" as const
    },
    {
      title: "Total Students",
      value: paymentStats?.users.total || 0,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+8%",
      changeType: "positive" as const
    },
    {
      title: "Approved Users",
      value: paymentStats?.users.approved || 0,
      icon: UserCheck,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+15%",
      changeType: "positive" as const
    },
    {
      title: "Pending Approvals",
      value: paymentStats?.receipts.pending || 0,
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "3 new",
      changeType: "neutral" as const
    },
  ];

  const quickActions = [
    {
      title: "Create Course",
      description: "Build multimedia courses with ease",
      icon: Plus,
      href: "/courses/create",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Schedule Session",
      description: "Plan live learning events",
      icon: Video,
      href: "/live-sessions",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "View Analytics",
      description: "Check performance metrics",
      icon: BarChart3,
      href: "/analytics",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Payment Approvals",
      description: "Review pending payments",
      icon: DollarSign,
      href: "/payment-approvals",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const quickStats = [
    {
      label: "Published Courses",
      value: courses?.filter((c) => c.isPublished).length || 0,
      icon: CheckCircle2,
      color: "text-emerald-600"
    },
    {
      label: "Draft Courses",
      value: courses?.filter((c) => !c.isPublished).length || 0,
      icon: Clock,
      color: "text-amber-600"
    },
    {
      label: "Total Enrollments",
      value: enrollmentStats?.total || 0,
      icon: TrendingUp,
      color: "text-blue-600"
    },
    {
      label: "Completion Rate",
      value: `${enrollmentStats?.completionRate?.toFixed(1) || 0}%`,
      icon: Award,
      color: "text-green-600"
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your learning platform.</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Alert for Pending Approvals */}
      {pendingReceipts && pendingReceipts.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertCircle className="text-orange-600" size={24} />
              <div>
                <h3 className="text-lg font-semibold text-orange-900">
                  {pendingReceipts.length} Payment{pendingReceipts.length > 1 ? 's' : ''} Awaiting Review
                </h3>
                <p className="text-sm text-orange-700 mt-1">
                  Students are waiting for payment approval to access courses
                </p>
              </div>
            </div>
            <a 
              href="/payment-approvals" 
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              Review Now
            </a>
          </div>
        </div>
      )}

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            changeType={stat.changeType}
            color={stat.color}
            bgColor={stat.bgColor}
          />
        ))}
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickStats.map((stat) => (
          <div key={stat.label} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-3">
              <stat.icon className={stat.color} size={20} />
              <div>
                <div className="text-lg font-semibold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-600">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Courses</h2>
              <a href="/courses" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View all →
              </a>
            </div>
          </div>
          <div className="p-6">
            {!courses || courses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="mx-auto mb-3 text-gray-300" size={48} />
                <p className="text-lg font-medium text-gray-900 mb-1">No courses yet</p>
                <p className="text-sm mb-4">Create your first course to get started</p>
                <a 
                  href="/courses/new"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={16} className="mr-2" />
                  Create Course
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {courses.slice(0, 5).map((course) => (
                  <div key={course._id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center overflow-hidden">
                      {course.coverImage ? (
                        <img src={course.coverImage} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <BookOpen className="text-white" size={20} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{course.title}</div>
                      <div className="text-xs text-gray-500">{course.category}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        course.isPublished 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {course.isPublished ? 'Published' : 'Draft'}
                      </span>
                      <div className="text-xs text-gray-400">
                        {new Date(course.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Info */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-4 space-y-3">
              {quickActions.map((action) => (
                <QuickActionCard
                  key={action.title}
                  title={action.title}
                  description={action.description}
                  icon={action.icon}
                  href={action.href}
                  color={action.color}
                  bgColor={action.bgColor}
                />
              ))}
            </div>
          </div>

          {/* Upcoming Sessions */}
          {upcomingSessions && upcomingSessions.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Sessions</h3>
              </div>
              <div className="p-4 space-y-3">
                {upcomingSessions.map((session) => (
                  <div key={session._id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                    <Calendar className="text-blue-600" size={16} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{session.title}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(session.scheduledAt).toLocaleDateString()} at{' '}
                        {new Date(session.scheduledAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System Status */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">System Status</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-green-700">Online</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div>
                <div className="text-sm font-bold text-gray-900">99.9%</div>
                <div className="text-xs text-gray-600">Uptime</div>
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">
                  {paymentStats?.users.approved || 0}
                </div>
                <div className="text-xs text-gray-600">Active Users</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Content */}
      {popularContent && popularContent.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Popular Content</h2>
              <a href="/analytics" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View detailed analytics →
              </a>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularContent.map((content, index) => (
                <div key={content.lessonId} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <PlayCircle className="text-blue-600" size={16} />
                    </div>
                    <div className="text-lg font-bold text-blue-600">#{index + 1}</div>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1 truncate">{content.lessonTitle}</h4>
                  <p className="text-sm text-gray-600 mb-2 truncate">{content.courseTitle}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center">
                      <Eye size={12} className="mr-1" />
                      {content.views} views
                    </span>
                    <span>{Math.round(content.avgTimeSpent / 60)}m avg</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}