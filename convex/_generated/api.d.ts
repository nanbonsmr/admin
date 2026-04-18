/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

// Define the API structure with all needed properties
interface AdminApiType {
  analytics: {
    getEnrollmentStats: any;
    getPopularContent: any;
    getTimeSpentAnalytics: any;
    getLessonCompletionRates: any;
    getProgressHeatmap: any;
  };
  courses: {
    list: any;
    getById: any;
    create: any;
    update: any;
    remove: any;
  };
  enrollments: {
    getUserEnrollments: any;
  };
  featuredCourses: {
    getAllFeaturedCoursesAdmin: any;
    addFeaturedCourse: any;
    updateFeaturedCourse: any;
    removeFeaturedCourse: any;
    reorderFeaturedCourses: any;
  };
  fileStorage: {
    getDownloadUrl: any;
    generateUploadUrl: any;
    storeFileMetadata: any;
  };
  files: {
    generateUploadUrl: any;
    storeFileMetadata: any;
  };
  forums: {
    getTopicsByCourse: any;
    getPostsByTopic: any;
    createTopic: any;
    createPost: any;
    updateTopic: any;
    deleteTopic: any;
  };
  lessonProgress: any;
  lessons: {
    create: any;
    createLesson: any;
    updateLesson: any;
    removeLesson: any;
    listLessons: any;
  };
  liveSessions: {
    getSessionsByCourse: any;
    getUpcomingSessions: any;
    createSession: any;
    updateSession: any;
    deleteSession: any;
  };
  migrations: any;
  notes: {
    getUserNotes: any;
  };
  notifications: {
    getAllNotifications: any;
    createNotification: any;
    updateNotification: any;
    deleteNotification: any;
  };
  offlineDownloads: {
    getUserDownloads: any;
  };
  payments: {
    getPendingPaymentReceipts: any;
    getAllPaymentReceipts: any;
    getPaymentStatistics: any;
    approvePaymentReceipt: any;
    rejectPaymentReceipt: any;
  };
  quizzes: {
    createQuiz: any;
    updateQuiz: any;
    deleteQuiz: any;
    getQuiz: any;
    getQuizzesByCourse: any;
  };
  savedCourses: any;
  schedules: any;
  schema_backup: any;
  schema_simple: any;
  settings: {
    getAllSettings: any;
    getSystemInfo: any;
    updateGeneralSettings: any;
    updateSecuritySettings: any;
    updateNotificationSettings: any;
    updateSystemSettings: any;
  };
  units: {
    create: any;
    createUnit: any;
    updateUnit: any;
    removeUnit: any;
    createSubunit: any;
    updateSubunit: any;
    listUnits: any;
    listSubunits: any;
  };
  users: {
    getAllUsers: any;
    getAdminUser: any;
    adminLogin: any;
    updateAccountStatus: any;
    updateUserRole: any;
    ensureAdminUser: any;
    testDatabaseConnection: any;
  };
}

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: AdminApiType;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: any;

export declare const components: {};