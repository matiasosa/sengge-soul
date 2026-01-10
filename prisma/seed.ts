import { prisma } from '../lib/prisma'
import * as bcrypt from 'bcryptjs'

async function main() {
  console.log('🌱 Starting database seed...')

  // Create products
  console.log('📦 Creating products...')
  const coronaLabel = await prisma.product.upsert({
    where: { slug: 'corona-label' },
    update: {},
    create: {
      slug: 'corona-label',
      name: 'Corona Label',
      description: 'Vela con etiqueta personalizada Corona',
      basePrice: 600000, // $6000 ARS in cents
      supportsRibbon: false,
      supportsApplique: false,
      textNameMaxChars: 10,
      textDescriptionMaxChars: 15,
      displayOrder: 1,
    },
  })

  const coronaBox = await prisma.product.upsert({
    where: { slug: 'corona-box' },
    update: {},
    create: {
      slug: 'corona-box',
      name: 'Corona Box',
      description: 'Vela Corona con caja PVC personalizada',
      basePrice: 750000, // $7500 ARS in cents
      supportsRibbon: true,
      supportsApplique: true,
      textNameMaxChars: 20,
      textDescriptionMaxChars: 30,
      displayOrder: 2,
    },
  })

  const vaso = await prisma.product.upsert({
    where: { slug: 'vaso' },
    update: {},
    create: {
      slug: 'vaso',
      name: 'Vaso',
      description: 'Vela Vaso con caja PVC personalizada',
      basePrice: 800000, // $8000 ARS in cents
      supportsRibbon: true,
      supportsApplique: true,
      textNameMaxChars: 20,
      textDescriptionMaxChars: 30,
      displayOrder: 3,
    },
  })

  const caramelera = await prisma.product.upsert({
    where: { slug: 'caramelera' },
    update: {},
    create: {
      slug: 'caramelera',
      name: 'Caramelera',
      description: 'Vela Caramelera con caja PVC personalizada',
      basePrice: 900000, // $9000 ARS in cents
      supportsRibbon: true,
      supportsApplique: true,
      textNameMaxChars: 20,
      textDescriptionMaxChars: 30,
      displayOrder: 4,
    },
  })

  console.log('✅ Products created')

  // Create ribbons
  console.log('🎀 Creating ribbons...')
  const ribbons = [
    { slug: 'blue', name: 'blue', displayName: 'Azul', hexColor: '#0066CC', displayOrder: 1 },
    { slug: 'gold', name: 'gold', displayName: 'Dorado', hexColor: '#FFD700', displayOrder: 2 },
    { slug: 'silver', name: 'silver', displayName: 'Plateado', hexColor: '#C0C0C0', displayOrder: 3 },
    { slug: 'light-blue', name: 'light-blue', displayName: 'Celeste', hexColor: '#87CEEB', displayOrder: 4 },
    { slug: 'pink', name: 'pink', displayName: 'Rosa', hexColor: '#FFC0CB', displayOrder: 5 },
  ]

  for (const ribbon of ribbons) {
    await prisma.ribbon.upsert({
      where: { slug: ribbon.slug },
      update: {},
      create: ribbon,
    })
  }

  console.log('✅ Ribbons created')

  // Create appliques
  console.log('✨ Creating appliques...')
  const appliques = [
    { slug: 'perla', name: 'perla', displayName: 'Perla', displayOrder: 1 },
    { slug: 'mariposa', name: 'mariposa', displayName: 'Mariposa', displayOrder: 2 },
    { slug: 'flor', name: 'flor', displayName: 'Flor', displayOrder: 3 },
    { slug: 'corona', name: 'corona', displayName: 'Corona', displayOrder: 4 },
  ]

  for (const applique of appliques) {
    await prisma.applique.upsert({
      where: { slug: applique.slug },
      update: {},
      create: applique,
    })
  }

  console.log('✅ Appliques created')

  // Create default admin user
  console.log('👤 Creating admin user...')
  const hashedPassword = await bcrypt.hash('admin123', 12)

  await prisma.adminUser.upsert({
    where: { email: 'admin@sengge-soul.com' },
    update: {},
    create: {
      email: 'admin@sengge-soul.com',
      passwordHash: hashedPassword,
      name: 'Admin User',
      role: 'super_admin',
    },
  })

  console.log('✅ Admin user created')
  console.log('📧 Email: admin@sengge-soul.com')
  console.log('🔑 Password: admin123')
  console.log('⚠️  Remember to change this password in production!')

  console.log('\n✨ Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
