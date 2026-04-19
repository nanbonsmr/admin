import { ConvexReactClient } from "convex/react";

// Use the production Convex deployment URL
const convexUrl = "https://brainy-crow-276.convex.cloud";

export const convex = new ConvexReactClient(convexUrl);

// Create a proxy API that handles missing functions gracefully
export const api = new Proxy({}, {
  get(target, module) {
    return new Proxy({}, {
      get(target, functionName) {
        // Create a function reference that won't crash if the function doesn't exist
        const ref = {
          [Symbol.for('functionName')]: `${String(module)}:${String(functionName)}`,
          toString: () => `${String(module)}:${String(functionName)}`,
          _type: 'query', // Default to query, will be overridden by Convex
        };
        
        return ref;
      }
    });
  }
});