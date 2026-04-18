import { convex } from '../convexClient';
import { api } from '../convexClient';

export async function initializeAdmin() {
  try {
    console.log('Initializing admin user...');
    const adminUser = await convex.mutation(api.users.ensureAdminUser, {});
    console.log('Admin user initialized:', adminUser);
    return adminUser;
  } catch (error) {
    console.error('Failed to initialize admin user:', error);
    throw error;
  }
}