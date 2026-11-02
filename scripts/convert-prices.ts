import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function convertPrices() {
  try {
    console.log('Converting resource prices from USD to KES (1 USD = 130 KES)...');

    // Get all paid resources
    const paidResources = await prisma.resource.findMany({
      where: {
        isPaid: true,
        price: {
          not: null,
        },
      },
    });

    console.log(`Found ${paidResources.length} paid resources to convert`);

    // Update each resource
    for (const resource of paidResources) {
      const newPrice = resource.price! * 130;
      await prisma.resource.update({
        where: { id: resource.id },
        data: { price: newPrice },
      });
      console.log(`Updated "${resource.title}": ${resource.price} USD → ${newPrice} KES`);
    }

    console.log('Price conversion completed successfully!');
  } catch (error) {
    console.error('Error converting prices:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

convertPrices();
