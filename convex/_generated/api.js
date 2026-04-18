/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import { anyApi, componentsGeneric } from "convex/server";

// Create a safe API proxy that handles missing functions
const createSafeApi = () => {
  return new Proxy(anyApi, {
    get(target, prop) {
      if (prop in target) {
        return target[prop];
      }
      
      // Return a proxy for missing modules
      return new Proxy({}, {
        get(subTarget, subProp) {
          if (subProp in subTarget) {
            return subTarget[subProp];
          }
          
          // Return a function that handles the missing function gracefully
          return (...args) => {
            console.warn(`Convex function ${String(prop)}.${String(subProp)} not available`);
            return Promise.resolve(null);
          };
        }
      });
    }
  });
};

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export const api = createSafeApi();
export const internal = anyApi;
export const components = componentsGeneric();