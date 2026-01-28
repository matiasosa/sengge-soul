import 'dotenv/config'
import { Client } from 'pg'

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  })

  await client.connect()
  console.log('🔧 Fixing products...')

  // Delete old "Caramelera" product (not Box or Label)
  await client.query(`DELETE FROM products WHERE slug = 'caramelera'`)
  console.log('✅ Deleted old "Caramelera" product')

  // Rename "Vaso" to "Vaso Box"
  await client.query(`
    UPDATE products
    SET name = 'Vaso Box',
        slug = 'vaso-box',
        description = 'Vela Vaso con caja PVC personalizada',
        "updatedAt" = NOW()
    WHERE slug = 'vaso'
  `)
  console.log('✅ Renamed "Vaso" to "Vaso Box"')

  // Show current products
  const result = await client.query(`
    SELECT slug, name, "basePrice" / 100 as price_ars, "supportsRibbon", "supportsApplique"
    FROM products
    ORDER BY "displayOrder"
  `)

  console.log('\n📦 Current products in database:')
  console.table(result.rows)

  await client.end()
  console.log('\n✨ Database fixes completed!')
}

main()
