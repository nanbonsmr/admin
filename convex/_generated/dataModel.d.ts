/* eslint-disable */
/**
 * Generated data model types.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type { GenericId } from "convex/values";

/**
 * The names of all of your Convex tables.
 */
export type TableNames = 
  | "courses"
  | "users" 
  | "enrollments"
  | "lessons"
  | "units"
  | "subunits"
  | "quizzes"
  | "quizAttempts"
  | "lessonProgress"
  | "paymentReceipts"
  | "notifications"
  | "userNotifications"
  | "featuredCourses"
  | "schedules"
  | "systemSettings"
  | "settingsBackups"
  | "forumTopics"
  | "forumPosts"
  | "liveSessions"
  | "sessionAttendance"
  | "certificates"
  | "files"
  | "offlineDownloads"
  | "analyticsEvents"
  | "fileStorage"
  | "notes"
  | "savedCourses";

/**
 * The type of a document stored in Convex.
 */
export type Doc<TableName extends TableNames> = any;

/**
 * An identifier for a document in Convex.
 */
export type Id<TableName extends TableNames> = GenericId<TableName>;