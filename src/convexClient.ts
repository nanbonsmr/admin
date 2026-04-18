import { ConvexReactClient } from "convex/react";

const convexUrl = import.meta.env.VITE_CONVEX_URL;

if (!convexUrl) {
  throw new Error("VITE_CONVEX_URL is not defined. Please check your environment variables.");
}

export const convex = new ConvexReactClient(convexUrl);

// Re-export the API from the main project
export { api } from "../../convex/_generated/api";
