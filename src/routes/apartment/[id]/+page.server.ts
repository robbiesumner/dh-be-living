import { db } from '$lib/server/db';
import { apartments, requests } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const apartmentId = Number(params.id);

	const apartment = await db.query.apartments.findFirst({
		where: eq(apartments.id, apartmentId),
		with: {
			landlord: true
		}
	});

	if (!apartment) {
		error(404, 'Apartment not found');
	}

	return {
		apartment
	};
};

export const actions: Actions = {
	request: async ({ params, request, locals }) => {
		if (!locals.user) {
			return fail(401, { error: 'You must be logged in to send a request' });
		}

		const apartmentId = Number(params.id);
		const formData = await request.formData();
		const message = formData.get('message') as string;

		if (!message) {
			return fail(400, { message, error: 'Message is required' });
		}

		try {
			await db.insert(requests).values({
				tenantId: locals.user.id,
				apartmentId,
				message,
				status: 'pending'
			});

			return { success: true };
		} catch (err) {
			console.error('Failed to create request:', err);
			return fail(500, { message, error: 'Could not send request' });
		}
	}
};
