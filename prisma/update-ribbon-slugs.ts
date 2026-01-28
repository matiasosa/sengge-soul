import 'dotenv/config'
import { Client } from 'pg'

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    await client.connect()
    console.log('🔄 Updating ribbon slugs to match image naming...')

    // Update ribbon slugs to match image file naming convention
    await client.query('UPDATE ribbons SET slug = \'azul\', name = \'azul\' WHERE slug = \'blue\'')
    await client.query('UPDATE ribbons SET slug = \'dorado\', name = \'dorado\' WHERE slug = \'gold\'')
    await client.query('UPDATE ribbons SET slug = \'plateado\', name = \'plateado\' WHERE slug = \'silver\'')
    await client.query('UPDATE ribbons SET slug = \'celeste\', name = \'celeste\' WHERE slug = \'light-blue\'')
    await client.query('UPDATE ribbons SET slug = \'rosa\', name = \'rosa\' WHERE slug = \'pink\'')

    console.log('✅ Ribbon slugs updated successfully!')
    console.log('   1. azul (was blue)')
    console.log('   2. dorado (was gold)')
    console.log('   3. plateado (was silver)')
    console.log('   4. celeste (was light-blue)')
    console.log('   5. rosa (was pink)')
  } catch (error) {
    console.error('❌ Error updating ribbons:', error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()
