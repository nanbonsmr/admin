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

// Define the API structure without importing external modules
declare const fullApi: ApiFromModules<{
  analytics: any;
  courses: any;
  enrollments: any;
  featuredCourses: any;
  fileStorage: any;
  files: any;
  forums: any;
  lessonProgress: any;
  lessons: any;
  liveSessions: any;
  migrations: any;
  notes: any;
  notifications: any;
  offlineDownloads: any;
  payments: any;
  quizzes: any;
  savedCourses: any;
  schedules: any;
  schema_backup: any;
  schema_simple: any;
  settings: any;
  units: any;
  users: any;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: any;

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