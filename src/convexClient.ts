import { ConvexReactClient } from "convex/react";

// Use the production Convex deployment URL
const convexUrl = "https://brainy-crow-276.convex.cloud";

export const convex = new ConvexReactClient(convexUrl);

// Create a simple function reference that works with Convex hooks
const createFunctionRef = (module: string, functionName: string, type: "query" | "mutation") => {
  // Create a function reference object that Convex hooks can use
  const ref = {
    _type: type,
    _module: module,
    _function: functionName,
    toString: () => `${module}:${functionName}`,
  };
  
  // Add the Symbol that Convex uses internally
  (ref as any)[Symbol.for('functionName')] = `${module}:${functionName}`;
  
  return ref as any;
};

// Create API object with proper function references
export const api = {
  courses: {
    getById: createFunctionRef("courses", "getById", "query"),
    create: createFunctionRef("courses", "create", "mutation"),
    update: createFunctionRef("courses", "update", "mutation"),
    list: createFunctionRef("courses", "list", "query"),
    delete: createFunctionRef("courses", "delete", "mutation"),
    getAll: createFunctionRef("courses", "getAll", "query"),
  },
  units: {
    listUnits: createFunctionRef("units", "listUnits", "query"),
    createUnit: createFunctionRef("units", "createUnit", "mutation"),
    updateUnit: createFunctionRef("units", "updateUnit", "mutation"),
    removeUnit: createFunctionRef("units", "removeUnit", "mutation"),
    createSubunit: createFunctionRef("units", "createSubunit", "mutation"),
    updateSubunit: createFunctionRef("units", "updateSubunit", "mutation"),
  },
  lessons: {
    createLesson: createFunctionRef("lessons", "createLesson", "mutation"),
    updateLesson: createFunctionRef("lessons", "updateLesson", "mutation"),
    removeLesson: createFunctionRef("lessons", "removeLesson", "mutation"),
    getById: createFunctionRef("lessons", "getById", "query"),
  },
  quizzes: {
    getQuizzesByCourse: createFunctionRef("quizzes", "getQuizzesByCourse", "query"),
    deleteQuiz: createFunctionRef("quizzes", "deleteQuiz", "mutation"),
    create: createFunctionRef("quizzes", "create", "mutation"),
    update: createFunctionRef("quizzes", "update", "mutation"),
    delete: createFunctionRef("quizzes", "delete", "mutation"),
    getAll: createFunctionRef("quizzes", "getAll", "query"),
    createQuiz: createFunctionRef("quizzes", "createQuiz", "mutation"),
    updateQuiz: createFunctionRef("quizzes", "updateQuiz", "mutation"),
    getQuiz: createFunctionRef("quizzes", "getQuiz", "query"),
  },
  users: {
    getAll: createFunctionRef("users", "getAll", "query"),
    create: createFunctionRef("users", "create", "mutation"),
    update: createFunctionRef("users", "update", "mutation"),
    delete: createFunctionRef("users", "delete", "mutation"),
    createAdmin: createFunctionRef("users", "createAdmin", "mutation"),
    getAllUsers: createFunctionRef("users", "getAllUsers", "query"),
    updateAccountStatus: createFunctionRef("users", "updateAccountStatus", "mutation"),
    updateUserRole: createFunctionRef("users", "updateUserRole", "mutation"),
    ensureAdminUser: createFunctionRef("users", "ensureAdminUser", "mutation"),
  },
  payments: {
    getAll: createFunctionRef("payments", "getAll", "query"),
    approve: createFunctionRef("payments", "approve", "mutation"),
    reject: createFunctionRef("payments", "reject", "mutation"),
    getPendingPaymentReceipts: createFunctionRef("payments", "getPendingPaymentReceipts", "query"),
  },
  enrollments: {
    getAll: createFunctionRef("enrollments", "getAll", "query"),
    getUserEnrollments: createFunctionRef("enrollments", "getUserEnrollments", "query"),
  },
  notes: {
    getAll: createFunctionRef("notes", "getAll", "query"),
    getUserNotes: createFunctionRef("notes", "getUserNotes", "query"),
  },
  offlineDownloads: {
    getAll: createFunctionRef("offlineDownloads", "getAll", "query"),
    getUserDownloads: createFunctionRef("offlineDownloads", "getUserDownloads", "query"),
  },
  settings: {
    get: createFunctionRef("settings", "get", "query"),
    update: createFunctionRef("settings", "update", "mutation"),
    getSystemSettings: createFunctionRef("settings", "getSystemSettings", "query"),
    updateSystemSettings: createFunctionRef("settings", "updateSystemSettings", "mutation"),
    getNotificationSettings: createFunctionRef("settings", "getNotificationSettings", "query"),
    updateNotificationSettings: createFunctionRef("settings", "updateNotificationSettings", "mutation"),
    getAllSettings: createFunctionRef("settings", "getAllSettings", "query"),
    getSystemInfo: createFunctionRef("settings", "getSystemInfo", "query"),
    updateGeneralSettings: createFunctionRef("settings", "updateGeneralSettings", "mutation"),
    updateSecuritySettings: createFunctionRef("settings", "updateSecuritySettings", "mutation"),
  },
  featuredCourses: {
    getAll: createFunctionRef("featuredCourses", "getAll", "query"),
    add: createFunctionRef("featuredCourses", "add", "mutation"),
    remove: createFunctionRef("featuredCourses", "remove", "mutation"),
    updateOrder: createFunctionRef("featuredCourses", "updateOrder", "mutation"),
  },
  notifications: {
    getAll: createFunctionRef("notifications", "getAll", "query"),
    create: createFunctionRef("notifications", "create", "mutation"),
    update: createFunctionRef("notifications", "update", "mutation"),
    delete: createFunctionRef("notifications", "delete", "mutation"),
  },
  analytics: {
    getOverview: createFunctionRef("analytics", "getOverview", "query"),
    getCourseStats: createFunctionRef("analytics", "getCourseStats", "query"),
    getUserStats: createFunctionRef("analytics", "getUserStats", "query"),
  },
  forums: {
    getAll: createFunctionRef("forums", "getAll", "query"),
  },
  liveSessions: {
    getAll: createFunctionRef("liveSessions", "getAll", "query"),
  },
};