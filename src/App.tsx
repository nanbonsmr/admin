import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConvexProvider } from "convex/react";
import { convex } from "./convexClient";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CourseList from "./pages/CourseList";
import CourseEditor from "./pages/CourseEditor";
import CourseCreator from "./pages/CourseCreator";
import Analytics from "./pages/Analytics";
import QuizBuilder from "./pages/QuizBuilder";
import LiveSessions from "./pages/LiveSessions";
import Forums from "./pages/Forums";
import PaymentApprovals from "./pages/PaymentApprovals";
import NotificationManager from "./pages/NotificationManager";
import FeaturedCoursesManager from "./pages/FeaturedCoursesManager";
import Students from "./pages/Students";
import Settings from "./pages/Settings";
import QuizAnalytics from "./pages/QuizAnalytics";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";
import { setupGlobalErrorHandler } from "./utils/errorHandler";
import "./App.css";
import { Suspense, useEffect } from "react";

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  // Setup global error handling in production
  useEffect(() => {
    setupGlobalErrorHandler();
  }, []);

  return (
    <ErrorBoundary>
      <ConvexProvider client={convex}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              
              {/* Protected Routes */}
              <Route path="/*" element={
                <ProtectedRoute>
                  <div className="flex h-screen bg-gray-50 overflow-hidden">
                    <Sidebar />
                    <main className="flex-1 overflow-y-auto p-8">
                      <Suspense fallback={<LoadingFallback />}>
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/courses" element={<CourseList />} />
                          <Route path="/courses/new" element={<CourseEditor isNew />} />
                          <Route path="/courses/create" element={<CourseCreator />} />
                          <Route path="/courses/:id" element={<CourseEditor />} />
                          <Route path="/featured-courses" element={<FeaturedCoursesManager />} />
                          <Route path="/notifications" element={<NotificationManager />} />
                          <Route path="/analytics" element={<Analytics />} />
                          <Route path="/quiz-analytics" element={<QuizAnalytics />} />
                          <Route path="/courses/:courseId/quiz/new" element={<QuizBuilder />} />
                          <Route path="/courses/:courseId/quiz/:quizId" element={<QuizBuilder />} />
                          <Route path="/live-sessions" element={<LiveSessions />} />
                          <Route path="/forums" element={<Forums />} />
                          <Route path="/students" element={<Students />} />
                          <Route path="/payment-approvals" element={<PaymentApprovals />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                      </Suspense>
                    </main>
                  </div>
                </ProtectedRoute>
              } />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ConvexProvider>
    </ErrorBoundary>
  );
}

export default App;
