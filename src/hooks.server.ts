import { db } from '$lib/server/db';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { building } from '$app/environment';

if (!building) {
	console.log('⏳ Running database migrations...');

	migrate(db, { migrationsFolder: 'drizzle' })
		.then(() => {
			console.log('✅ Database migrations applied successfully!');
		})
		.catch((err) => {
			console.error('❌ Database migration failed:', err);
			process.exit(1);
		});
}
