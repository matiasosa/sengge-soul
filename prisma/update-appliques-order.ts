import 'dotenv/config'
import { Client } from 'pg'

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    await client.connect()
    console.log('🔄 Updating appliques display order...')

    await client.query('UPDATE appliques SET "displayOrder" = 1 WHERE slug = \'corona\'')
    await client.query('UPDATE appliques SET "displayOrder" = 2 WHERE slug = \'perla\'')
    await client.query('UPDATE appliques SET "displayOrder" = 3 WHERE slug = \'mariposa\'')
    await client.query('UPDATE appliques SET "displayOrder" = 4 WHERE slug = \'flor\'')

    console.log('✅ Appliques display order updated successfully!')
    console.log('   1. Corona')
    console.log('   2. Perla')
    console.log('   3. Mariposa')
    console.log('   4. Flor')
  } catch (error) {
    console.error('❌ Error updating appliques:', error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()
