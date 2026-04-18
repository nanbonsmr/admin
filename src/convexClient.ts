import { ConvexReactClient } from "convex/react";
import { makeFunctionReference } from "convex/server";

// Use the production Convex deployment URL
const convexUrl = import.meta.env.VITE_CONVEX_URL || "https://brainy-crow-276.convex.cloud";

export const convex = new ConvexReactClient(convexUrl);

// Create proper function references for all the functions used in the admin panel
const createFunctionRef = (module: string, functionName: string, type: "query" | "mutation") => {
  return makeFunctionReference(type, module, functionName);
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
  },
  users: {
    getAll: createFunctionRef("users", "getAll", "query"),
    create: createFunctionRef("users", "create", "mutation"),
    update: createFunctionRef("users", "update", "mutation"),
    delete: createFunctionRef("users", "delete", "mutation"),
    createAdmin: createFunctionRef("users", "createAdmin", "mutation"),
  },
  payments: {
    getAll: createFunctionRef("payments", "getAll", "query"),
    approve: createFunctionRef("payments", "approve", "mutation"),
    reject: createFunctionRef("payments", "reject", "mutation"),
  },
  enrollments: {
    getAll: createFunctionRef("enrollments", "getAll", "query"),
  },
  notes: {
    getAll: createFunctionRef("notes", "getAll", "query"),
  },
  offlineDownloads: {
    getAll: createFunctionRef("offlineDownloads", "getAll", "query"),
  },
  settings: {
    get: createFunctionRef("settings", "get", "query"),
    update: createFunctionRef("settings", "update", "mutation"),
    getSystemSettings: createFunctionRef("settings", "getSystemSettings", "query"),
    updateSystemSettings: createFunctionRef("settings", "updateSystemSettings", "mutation"),
    getNotificationSettings: createFunctionRef("settings", "getNotificationSettings", "query"),
    updateNotificationSettings: createFunctionRef("settings", "updateNotificationSettings", "mutation"),
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