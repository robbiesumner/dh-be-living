import { db } from '$lib/server/db';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { building } from '$app/environment';
import { profiles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { Handle } from '@sveltejs/kit';

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

export const handle: Handle = async ({ event, resolve }) => {
	const userId = event.cookies.get('userId');

	if (userId) {
		const user = await db.query.profiles.findFirst({
			where: eq(profiles.id, parseInt(userId))
		});

		if (user) {
			event.locals.user = user;
		}
	}

	const response = await resolve(event);
	return response;
};
