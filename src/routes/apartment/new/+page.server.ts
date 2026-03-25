import { db } from '$lib/server/db';
import { apartments } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	if (locals.user.role === 'tenant') {
		throw redirect(303, '/profile');
	}

	return {
		user: locals.user
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals.user || locals.user.role === 'tenant') {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const address = formData.get('address') as string;
		const size = Number(formData.get('size'));
		const rentPrice = Number(formData.get('rentPrice'));
		const availableFrom = new Date(formData.get('availableFrom') as string);
		const availableTo = new Date(formData.get('availableTo') as string);
		const isWG = formData.get('isWG') === 'on';

		if (!title || !description || !address || isNaN(size) || isNaN(rentPrice)) {
			return fail(400, { message: 'All fields are required and must be valid' });
		}

		let newId;
		try {
			const result = await db
				.insert(apartments)
				.values({
					landlordId: locals.user.id,
					title,
					description,
					address,
					size,
					rentPrice,
					availableFrom,
					availableTo,
					isWG
				})
				.returning();
			newId = result[0].id;
		} catch (err) {
			console.error('Failed to create apartment:', err);
			return fail(500, { message: 'Could not create listing' });
		}

		throw redirect(303, `/apartment/${newId}`);
	}
};

