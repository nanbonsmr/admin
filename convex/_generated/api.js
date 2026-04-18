/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import { anyApi, componentsGeneric } from "convex/server";

// Create a minimal API structure for the admin panel
const adminApi = {
  ...anyApi,
  fileStorage: {
    getDownloadUrl: null, // Will be handled gracefully by the component
    generateUploadUrl: null,
    storeFileMetadata: null,
  },
  users: {
    getAllUsers: null,
    getAdminUser: null,
    adminLogin: null,
    updateAccountStatus: null,
    updateUserRole: null,
    ensureAdminUser: null,
    testDatabaseConnection: null,
  },
  courses: {
    list: null,
    getById: null,
    create: null,
    update: null,
    remove: null,
  },
  payments: {
    getPendingPaymentReceipts: null,
    getAllPaymentReceipts: null,
    getPaymentStatistics: null,
    approvePaymentReceipt: null,
    rejectPaymentReceipt: null,
  },
  notifications: {
    getAllNotifications: null,
    createNotification: null,
    updateNotification: null,
    deleteNotification: null,
  },
  analytics: {
    getEnrollmentStats: null,
    getPopularContent: null,
    getTimeSpentAnalytics: null,
    getLessonCompletionRates: null,
    getProgressHeatmap: null,
  },
  featuredCourses: {
    getAllFeaturedCoursesAdmin: null,
    addFeaturedCourse: null,
    updateFeaturedCourse: null,
    removeFeaturedCourse: null,
    reorderFeaturedCourses: null,
  },
  settings: {
    getAllSettings: null,
    getSystemInfo: null,
    updateGeneralSettings: null,
    updateSecuritySettings: null,
    updateNotificationSettings: null,
    updateSystemSettings: null,
  },
  units: {
    create: null,
    createUnit: null,
    updateUnit: null,
    removeUnit: null,
    createSubunit: null,
    updateSubunit: null,
    listUnits: null,
    listSubunits: null,
  },
  lessons: {
    create: null,
    createLesson: null,
    updateLesson: null,
    removeLesson: null,
    listLessons: null,
  },
  quizzes: {
    createQuiz: null,
    updateQuiz: null,
    deleteQuiz: null,
    getQuiz: null,
    getQuizzesByCourse: null,
  },
  forums: {
    getTopicsByCourse: null,
    getPostsByTopic: null,
    createTopic: null,
    createPost: null,
    updateTopic: null,
    deleteTopic: null,
  },
  liveSessions: {
    getSessionsByCourse: null,
    getUpcomingSessions: null,
    createSession: null,
    updateSession: null,
    deleteSession: null,
  },
  enrollments: {
    getUserEnrollments: null,
  },
  notes: {
    getUserNotes: null,
  },
  offlineDownloads: {
    getUserDownloads: null,
  },
  files: {
    generateUploadUrl: null,
    storeFileMetadata: null,
  },
};

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export const api = adminApi;
export const internal = anyApi;
export const components = componentsGeneric();