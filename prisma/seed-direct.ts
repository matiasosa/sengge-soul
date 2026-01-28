import 'dotenv/config'
import { Client } from 'pg'
import * as bcrypt from 'bcryptjs'

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    await client.connect()
    console.log('🌱 Starting database seed...')

    // Create products
    console.log('📦 Creating products...')

    const products = [
      {
        slug: 'corona-label',
        name: 'Corona Label',
        description: 'Vela con etiqueta personalizada Corona',
        basePrice: 600000,
        supportsRibbon: false,
        supportsApplique: false,
        textNameMaxChars: 10,
        textDescriptionMaxChars: 15,
        displayOrder: 1,
      },
      {
        slug: 'corona-box',
        name: 'Corona Box',
        description: 'Vela Corona con caja PVC personalizada',
        basePrice: 750000,
        supportsRibbon: true,
        supportsApplique: true,
        textNameMaxChars: 20,
        textDescriptionMaxChars: 30,
        displayOrder: 2,
      },
      {
        slug: 'vaso',
        name: 'Vaso',
        description: 'Vela Vaso con caja PVC personalizada',
        basePrice: 800000,
        supportsRibbon: true,
        supportsApplique: true,
        textNameMaxChars: 20,
        textDescriptionMaxChars: 30,
        displayOrder: 3,
      },
      {
        slug: 'caramelera-box',
        name: 'Caramelera Box',
        description: 'Vela Caramelera con caja PVC personalizada',
        basePrice: 900000,
        supportsRibbon: true,
        supportsApplique: true,
        textNameMaxChars: 20,
        textDescriptionMaxChars: 30,
        displayOrder: 4,
      },
      {
        slug: 'caramelera-label',
        name: 'Caramelera Label',
        description: 'Vela con etiqueta personalizada Caramelera',
        basePrice: 750000,
        supportsRibbon: false,
        supportsApplique: false,
        textNameMaxChars: 10,
        textDescriptionMaxChars: 15,
        displayOrder: 5,
      },
    ]

    for (const product of products) {
      await client.query(
        `INSERT INTO products (slug, name, description, "basePrice", "supportsRibbon", "supportsApplique", "textNameMaxChars", "textDescriptionMaxChars", "displayOrder", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
         ON CONFLICT (slug) DO NOTHING`,
        [
          product.slug,
          product.name,
          product.description,
          product.basePrice,
          product.supportsRibbon,
          product.supportsApplique,
          product.textNameMaxChars,
          product.textDescriptionMaxChars,
          product.displayOrder,
        ]
      )
    }

    console.log('✅ Products created')

    // Create ribbons
    console.log('🎀 Creating ribbons...')
    const ribbons = [
      { slug: 'azul', name: 'azul', displayName: 'Azul', hexColor: '#013466', displayOrder: 1 },
      { slug: 'dorado', name: 'dorado', displayName: 'Dorado', hexColor: '#ffd900cd', displayOrder: 2 },
      { slug: 'plateado', name: 'plateado', displayName: 'Plateado', hexColor: '#C0C0C0', displayOrder: 3 },
      { slug: 'celeste', name: 'celeste', displayName: 'Celeste', hexColor: '#87CEEB', displayOrder: 4 },
      { slug: 'rosa', name: 'rosa', displayName: 'Rosa', hexColor: '#FFC0CB', displayOrder: 5 },
    ]

    for (const ribbon of ribbons) {
      await client.query(
        `INSERT INTO ribbons (slug, name, "displayName", "hexColor", "displayOrder", "createdAt")
         VALUES ($1, $2, $3, $4, $5, NOW())
         ON CONFLICT (slug) DO NOTHING`,
        [ribbon.slug, ribbon.name, ribbon.displayName, ribbon.hexColor, ribbon.displayOrder]
      )
    }

    console.log('✅ Ribbons created')

    // Create appliques
    console.log('✨ Creating appliques...')
    const appliques = [
      { slug: 'corona', name: 'corona', displayName: 'Corona', displayOrder: 1 },
      { slug: 'perla', name: 'perla', displayName: 'Perla', displayOrder: 2 },
      { slug: 'mariposa', name: 'mariposa', displayName: 'Mariposa', displayOrder: 3 },
      { slug: 'flor', name: 'flor', displayName: 'Flor', displayOrder: 4 },
    ]

    for (const applique of appliques) {
      await client.query(
        `INSERT INTO appliques (slug, name, "displayName", "displayOrder", "createdAt")
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (slug) DO NOTHING`,
        [applique.slug, applique.name, applique.displayName, applique.displayOrder]
      )
    }

    console.log('✅ Appliques created')

    // Create admin user
    console.log('👤 Creating admin user...')
    const hashedPassword = await bcrypt.hash('admin123', 12)

    await client.query(
      `INSERT INTO admin_users (email, "passwordHash", name, role, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       ON CONFLICT (email) DO NOTHING`,
      ['admin@sengge-soul.com', hashedPassword, 'Admin User', 'super_admin']
    )

    console.log('✅ Admin user created')
    console.log('📧 Email: admin@sengge-soul.com')
    console.log('🔑 Password: admin123')
    console.log('⚠️  Remember to change this password in production!')

    console.log('\n✨ Database seed completed successfully!')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()
