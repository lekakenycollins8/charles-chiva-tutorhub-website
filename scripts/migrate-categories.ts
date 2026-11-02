import { PrismaClient } from '@prisma/client';
import { getCategoryNames } from '../src/lib/constants/resource-categories';

const prisma = new PrismaClient();

async function migrateCategories() {
  console.log('Starting category migration...');

  const validCategories = getCategoryNames();
  console.log('Valid categories:', validCategories);

  // Find all resources with categories not in the new list
  const resourcesToUpdate = await prisma.resource.findMany({
    where: {
      category: {
        notIn: validCategories
      }
    }
  });

  console.log(`Found ${resourcesToUpdate.length} resources to migrate`);

  if (resourcesToUpdate.length === 0) {
    console.log('No resources need migration. Exiting.');
    return;
  }

  // Log what will be changed
  console.log('\nResources to migrate:');
  resourcesToUpdate.forEach((resource) => {
    console.log(`- ${resource.title}: "${resource.category}" -> "Other"`);
  });

  // Update all resources to "Other" category
  const updateResult = await prisma.resource.updateMany({
    where: {
      category: {
        notIn: validCategories
      }
    },
    data: {
      category: 'Other'
    }
  });

  console.log(`\nMigration complete! Updated ${updateResult.count} resources to "Other" category.`);

  // Verify the migration
  const remainingInvalid = await prisma.resource.count({
    where: {
      category: {
        notIn: validCategories
      }
    }
  });

  if (remainingInvalid === 0) {
    console.log('✓ Migration verified successfully.');
  } else {
    console.log(`⚠ Warning: ${remainingInvalid} resources still have invalid categories.`);
  }
}

migrateCategories()
  .then(() => {
    console.log('\nMigration script completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error during migration:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
