import { db } from '$lib/server/db';
import { profiles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const password = formData.get('password') as string;

		if (!name || !password) {
			return fail(400, { name, message: 'Name and password are required' });
		}

		// Look for an existing profile by name (simple mock authentication)
		let user = await db.query.profiles.findFirst({
			where: eq(profiles.name, name)
		});

		// If no user exists, create one (auto-registration)
		if (!user) {
			const result = await db.insert(profiles).values({
				name,
				role: 'tenant'
			}).returning();
			user = result[0];
		}

		// Set a simple cookie (valid for 30 days)
		cookies.set('userId', user.id.toString(), {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 30
		});

		throw redirect(303, '/profile');
	}
};