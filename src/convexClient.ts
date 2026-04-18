import { ConvexReactClient } from "convex/react";

const convexUrl = import.meta.env.VITE_CONVEX_URL;

if (!convexUrl) {
  throw new Error("VITE_CONVEX_URL is not defined. Please check your environment variables.");
}

export const convex = new ConvexReactClient(convexUrl);

// Create a mock function that has the required Convex function symbol
const createMockFunction = (name: string) => {
  const mockFn = () => Promise.resolve(null);
  // Add the Symbol that Convex expects
  mockFn[Symbol.for('functionName')] = name;
  return mockFn;
};

// Create the API object that matches the TypeScript definition
export const api = {
  analytics: {
    getEnrollmentStats: createMockFunction('analytics:getEnrollmentStats'),
    getPopularContent: createMockFunction('analytics:getPopularContent'),
    getTimeSpentAnalytics: createMockFunction('analytics:getTimeSpentAnalytics'),
    getLessonCompletionRates: createMockFunction('analytics:getLessonCompletionRates'),
    getProgressHeatmap: createMockFunction('analytics:getProgressHeatmap'),
  },
  courses: {
    list: createMockFunction('courses:list'),
    getById: createMockFunction('courses:getById'),
    create: createMockFunction('courses:create'),
    update: createMockFunction('courses:update'),
    remove: createMockFunction('courses:remove'),
  },
  enrollments: {
    getUserEnrollments: createMockFunction('enrollments:getUserEnrollments'),
  },
  featuredCourses: {
    getAllFeaturedCoursesAdmin: createMockFunction('featuredCourses:getAllFeaturedCoursesAdmin'),
    addFeaturedCourse: createMockFunction('featuredCourses:addFeaturedCourse'),
    updateFeaturedCourse: createMockFunction('featuredCourses:updateFeaturedCourse'),
    removeFeaturedCourse: createMockFunction('featuredCourses:removeFeaturedCourse'),
    reorderFeaturedCourses: createMockFunction('featuredCourses:reorderFeaturedCourses'),
  },
  fileStorage: {
    getDownloadUrl: createMockFunction('fileStorage:getDownloadUrl'),
    generateUploadUrl: createMockFunction('fileStorage:generateUploadUrl'),
    storeFileMetadata: createMockFunction('fileStorage:storeFileMetadata'),
  },
  files: {
    generateUploadUrl: createMockFunction('files:generateUploadUrl'),
    storeFileMetadata: createMockFunction('files:storeFileMetadata'),
  },
  forums: {
    getTopicsByCourse: createMockFunction('forums:getTopicsByCourse'),
    getPostsByTopic: createMockFunction('forums:getPostsByTopic'),
    createTopic: createMockFunction('forums:createTopic'),
    createPost: createMockFunction('forums:createPost'),
    updateTopic: createMockFunction('forums:updateTopic'),
    deleteTopic: createMockFunction('forums:deleteTopic'),
  },
  lessonProgress: createMockFunction('lessonProgress'),
  lessons: {
    create: createMockFunction('lessons:create'),
    createLesson: createMockFunction('lessons:createLesson'),
    updateLesson: createMockFunction('lessons:updateLesson'),
    removeLesson: createMockFunction('lessons:removeLesson'),
    listLessons: createMockFunction('lessons:listLessons'),
  },
  liveSessions: {
    getSessionsByCourse: createMockFunction('liveSessions:getSessionsByCourse'),
    getUpcomingSessions: createMockFunction('liveSessions:getUpcomingSessions'),
    createSession: createMockFunction('liveSessions:createSession'),
    updateSession: createMockFunction('liveSessions:updateSession'),
    deleteSession: createMockFunction('liveSessions:deleteSession'),
  },
  migrations: createMockFunction('migrations'),
  notes: {
    getUserNotes: createMockFunction('notes:getUserNotes'),
  },
  notifications: {
    getAllNotifications: createMockFunction('notifications:getAllNotifications'),
    createNotification: createMockFunction('notifications:createNotification'),
    updateNotification: createMockFunction('notifications:updateNotification'),
    deleteNotification: createMockFunction('notifications:deleteNotification'),
  },
  offlineDownloads: {
    getUserDownloads: createMockFunction('offlineDownloads:getUserDownloads'),
  },
  payments: {
    getPendingPaymentReceipts: createMockFunction('payments:getPendingPaymentReceipts'),
    getAllPaymentReceipts: createMockFunction('payments:getAllPaymentReceipts'),
    getPaymentStatistics: createMockFunction('payments:getPaymentStatistics'),
    approvePaymentReceipt: createMockFunction('payments:approvePaymentReceipt'),
    rejectPaymentReceipt: createMockFunction('payments:rejectPaymentReceipt'),
  },
  quizzes: {
    createQuiz: createMockFunction('quizzes:createQuiz'),
    updateQuiz: createMockFunction('quizzes:updateQuiz'),
    deleteQuiz: createMockFunction('quizzes:deleteQuiz'),
    getQuiz: createMockFunction('quizzes:getQuiz'),
    getQuizzesByCourse: createMockFunction('quizzes:getQuizzesByCourse'),
  },
  savedCourses: createMockFunction('savedCourses'),
  schedules: createMockFunction('schedules'),
  schema_backup: createMockFunction('schema_backup'),
  schema_simple: createMockFunction('schema_simple'),
  settings: {
    getAllSettings: createMockFunction('settings:getAllSettings'),
    getSystemInfo: createMockFunction('settings:getSystemInfo'),
    updateGeneralSettings: createMockFunction('settings:updateGeneralSettings'),
    updateSecuritySettings: createMockFunction('settings:updateSecuritySettings'),
    updateNotificationSettings: createMockFunction('settings:updateNotificationSettings'),
    updateSystemSettings: createMockFunction('settings:updateSystemSettings'),
  },
  units: {
    create: createMockFunction('units:create'),
    createUnit: createMockFunction('units:createUnit'),
    updateUnit: createMockFunction('units:updateUnit'),
    removeUnit: createMockFunction('units:removeUnit'),
    createSubunit: createMockFunction('units:createSubunit'),
    updateSubunit: createMockFunction('units:updateSubunit'),
    listUnits: createMockFunction('units:listUnits'),
    listSubunits: createMockFunction('units:listSubunits'),
  },
  users: {
    getAllUsers: createMockFunction('users:getAllUsers'),
    getAdminUser: createMockFunction('users:getAdminUser'),
    adminLogin: createMockFunction('users:adminLogin'),
    updateAccountStatus: createMockFunction('users:updateAccountStatus'),
    updateUserRole: createMockFunction('users:updateUserRole'),
    ensureAdminUser: createMockFunction('users:ensureAdminUser'),
    testDatabaseConnection: createMockFunction('users:testDatabaseConnection'),
  },
};
