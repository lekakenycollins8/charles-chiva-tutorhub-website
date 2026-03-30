import { PrismaClient } from '@prisma/client';

// Global PrismaClient instance to prevent connection leaks
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// Configure Prisma client with MongoDB-specific settings
export const prisma = global.prisma || new PrismaClient({
  // Query logging removed to prevent debug package from accessing localStorage during SSR
  // If needed, enable with: log: process.env.PRISMA_DEBUG === 'true' ? ['query'] : []
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Add MongoDB connection health check
prisma.$use(async (params, next) => {
  try {
    return await next(params);
  } catch (error) {
    console.error('Prisma error:', error);
    throw error;
  }
});
