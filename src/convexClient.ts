import { ConvexReactClient } from "convex/react";

// Use the production Convex deployment URL
const convexUrl = "https://warmhearted-panda-643.convex.cloud";

export const convex = new ConvexReactClient(convexUrl);

// Import the main backend's API
export { api } from "../../../convex/_generated/api";