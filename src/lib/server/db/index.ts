import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { env } from '$env/dynamic/private';
import { building } from '$app/environment';

if (!env.DATABASE_URL && !building) throw new Error('DATABASE_URL is not set');

const client = createClient({ url: env.DATABASE_URL || 'file:sqlite.db' });

export const db = drizzle(client, { schema });
