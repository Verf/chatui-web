import postgres from 'postgres'
import { DATABASE_URL } from '$env/static/private'

const sql = postgres(DATABASE_URL)

export async function migrate() {
  await sql`CREATE TABLE IF NOT EXISTS migrations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`

  const applied = await sql`SELECT name FROM migrations`
  const migrations = Object.keys(import.meta.glob('./migrations/*.sql'))
  
  for (const migration of migrations) {
    if (!applied.some(m => m.name === migration)) {
      const sqlFile = await import(`./migrations/${migration}`)
      await sql.unsafe(sqlFile.default)
      await sql`INSERT INTO migrations (name) VALUES (${migration})`
    }
  }
}
