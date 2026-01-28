import 'dotenv/config'
import { PrismaClient } from '../lib/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

async function main() {
  const connectionString = process.env.DATABASE_URL!
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  console.log('Creating admin user...')

  // Default admin credentials - CHANGE THESE IN PRODUCTION
  const email = 'admin@senggesoul.com'
  const password = 'admin123' // Change this!
  const name = 'Administrador'

  const passwordHash = await bcrypt.hash(password, 12)

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: {
      passwordHash,
      name,
      isActive: true,
    },
    create: {
      email,
      passwordHash,
      name,
      role: 'admin',
      isActive: true,
    },
  })

  console.log('✅ Admin user created/updated:')
  console.log(`   Email: ${admin.email}`)
  console.log(`   Name: ${admin.name}`)
  console.log(`   Password: ${password}`)
  console.log('')
  console.log('⚠️  IMPORTANT: Change the password after first login!')

  await pool.end()
}

main()
  .catch((e) => {
    console.error('Error seeding admin:', e)
    process.exit(1)
  })
