/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as analytics from "../../../convex/analytics.js";
import type * as courses from "../../../convex/courses.js";
import type * as enrollments from "../../../convex/enrollments.js";
import type * as featuredCourses from "../../../convex/featuredCourses.js";
import type * as fileStorage from "../../../convex/fileStorage.js";
import type * as files from "../../../convex/files.js";
import type * as forums from "../../../convex/forums.js";
import type * as lessonProgress from "../../../convex/lessonProgress.js";
import type * as lessons from "../../../convex/lessons.js";
import type * as liveSessions from "../../../convex/liveSessions.js";
import type * as migrations from "../../../convex/migrations.js";
import type * as notes from "../../../convex/notes.js";
import type * as notifications from "../../../convex/notifications.js";
import type * as offlineDownloads from "../../../convex/offlineDownloads.js";
import type * as payments from "../../../convex/payments.js";
import type * as quizzes from "../../../convex/quizzes.js";
import type * as savedCourses from "../../../convex/savedCourses.js";
import type * as schedules from "../../../convex/schedules.js";
import type * as schema_backup from "../../../convex/schema_backup.js";
import type * as schema_simple from "../../../convex/schema_simple.js";
import type * as settings from "../../../convex/settings.js";
import type * as units from "../../../convex/units.js";
import type * as users from "../../../convex/users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  analytics: typeof analytics;
  courses: typeof courses;
  enrollments: typeof enrollments;
  featuredCourses: typeof featuredCourses;
  fileStorage: typeof fileStorage;
  files: typeof files;
  forums: typeof forums;
  lessonProgress: typeof lessonProgress;
  lessons: typeof lessons;
  liveSessions: typeof liveSessions;
  migrations: typeof migrations;
  notes: typeof notes;
  notifications: typeof notifications;
  offlineDownloads: typeof offlineDownloads;
  payments: typeof payments;
  quizzes: typeof quizzes;
  savedCourses: typeof savedCourses;
  schedules: typeof schedules;
  schema_backup: typeof schema_backup;
  schema_simple: typeof schema_simple;
  settings: typeof settings;
  units: typeof units;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};