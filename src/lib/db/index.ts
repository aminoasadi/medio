import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const connectionString = process.env.POSTGRES_URL?.replace("?pgbouncer=true&sslmode=require", "?pgbouncer=true")
    ?.replace("&sslmode=require", "")
    ?.replace("?sslmode=require", "");

const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
});

export const db = drizzle(pool, { schema });
