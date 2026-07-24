import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';

const connectionString = process.env.DATABASE_URL;

export function getDb() {
  if (!connectionString) {
    return null;
  }
  const queryClient = postgres(connectionString, { max: 10, ssl: false });
  return drizzle(queryClient, { schema });
}

export { schema };
