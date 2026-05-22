/**
 * Development seed — creates the initial admin user on a fresh database.
 *
 * Usage:
 *   npx prisma db seed          # via prisma CLI (reads .env automatically)
 *   npm run db:seed              # shortcut alias
 *
 * The script is idempotent: running it twice does not create duplicate users.
 */

import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { hash } from 'bcrypt';

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email    = 'chivatutorhub@gmail.com';
  const password = 'ChangeMe123!';
  const name     = 'Admin';

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    console.log(`✅ Admin user already exists: ${email} — no changes made.`);
    return;
  }

  const hashedPassword = await hash(password, 12);

  const admin = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'admin',
      emailVerified: new Date(),
    },
  });

  console.log('✅ Admin user created successfully.');
  console.log(`   ID    : ${admin.id}`);
  console.log(`   Email : ${admin.email}`);
  console.log(`   Passw : ${password}`);
  console.log('');
  console.log('⚠️  Change the default password immediately after first login.');
}

main()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
