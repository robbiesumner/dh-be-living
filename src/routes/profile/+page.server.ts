import { db } from '$lib/server/db';
import { profiles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	const profile = await db.query.profiles.findFirst({
		where: eq(profiles.id, locals.user.id),
		with: {
			apartments: true,
			requests: {
				with: {
					apartment: true
				}
			}
		}
	});

	if (!profile) {
		error(404, 'Profile not found.');
	}

	return {
		profile
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const name = formData.get('name') as string;
		const phone = formData.get('phone') as string;
		const role = formData.get('role') as 'tenant' | 'landlord' | 'both';
		const dhbwLocation = formData.get('dhbwLocation') as string;
		const workLocation = formData.get('workLocation') as string;
		const dhbwCourse = formData.get('dhbwCourse') as string;
		const acceptWG = formData.get('acceptWG') === 'on';

		if (!name) {
			return fail(400, {
				name,
				phone,
				role,
				dhbwLocation,
				workLocation,
				dhbwCourse,
				acceptWG,
				message: 'Name is required'
			});
		}

		try {
			await db
				.update(profiles)
				.set({
					name,
					phone,
					role,
					dhbwLocation,
					workLocation,
					dhbwCourse,
					acceptWG
				})
				.where(eq(profiles.id, locals.user.id));

			return { success: true };
		} catch (err) {
			console.error('Failed to update profile:', err);
			return fail(500, {
				name,
				phone,
				role,
				dhbwLocation,
				workLocation,
				dhbwCourse,
				acceptWG,
				message: 'Could not update profile'
			});
		}
	}
};
