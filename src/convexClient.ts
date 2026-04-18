import { ConvexReactClient } from "convex/react";

const convexUrl = import.meta.env.VITE_CONVEX_URL;

if (!convexUrl) {
  throw new Error("VITE_CONVEX_URL is not defined. Please check your environment variables.");
}

export const convex = new ConvexReactClient(convexUrl);

// Create a mock API that returns empty data instead of throwing errors
const createMockFunction = () => {
  const mockFn = () => Promise.resolve(null);
  // Add the Symbol that Convex expects
  mockFn[Symbol.for('functionName')] = 'mock';
  return mockFn;
};

const createMockModule = () => {
  return new Proxy({}, {
    get() {
      return createMockFunction();
    }
  });
};

export const api = new Proxy({}, {
  get() {
    return createMockModule();
  }
});
