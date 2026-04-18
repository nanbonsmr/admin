import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Generate upload URL for files
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Store file metadata after upload
export const storeFileMetadata = mutation({
  args: {
    storageId: v.string(),
    originalName: v.string(),
    mimeType: v.string(),
    size: v.number(),
    uploadedBy: v.id("users"),
    isPublic: v.optional(v.boolean()),
    courseId: v.optional(v.id("courses")),
    lessonId: v.optional(v.id("lessons")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("fileStorage", {
      storageId: args.storageId,
      originalName: args.originalName,
      mimeType: args.mimeType,
      size: args.size,
      uploadedBy: args.uploadedBy,
      uploadedAt: Date.now(),
      isPublic: args.isPublic || false,
      courseId: args.courseId,
      lessonId: args.lessonId,
    });
  },
});

// Get file metadata
export const getFileMetadata = query({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("fileStorage")
      .filter((q) => q.eq(q.field("storageId"), args.storageId))
      .first();
  },
});

// Get files by course
export const getFilesByCourse = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("fileStorage")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect();
  },
});

// Get files by lesson
export const getFilesByLesson = query({
  args: { lessonId: v.id("lessons") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("fileStorage")
      .withIndex("by_lesson", (q) => q.eq("lessonId", args.lessonId))
      .collect();
  },
});

// Delete file
export const deleteFile = mutation({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    // Delete from storage
    await ctx.storage.delete(args.storageId);
    
    // Delete metadata
    const fileMetadata = await ctx.db
      .query("fileStorage")
      .filter((q) => q.eq(q.field("storageId"), args.storageId))
      .first();
    
    if (fileMetadata) {
      await ctx.db.delete(fileMetadata._id);
    }
  },
});

// Get download URL for file
export const getDownloadUrl = query({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});