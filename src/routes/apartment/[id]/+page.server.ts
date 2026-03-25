import { db } from '$lib/server/db';
import { apartments, requests } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const apartmentId = Number(params.id);
	const profile = locals.user;

	const apartment = await db.query.apartments.findFirst({
		where: eq(apartments.id, apartmentId),
		with: {
			landlord: true,
			requests: {
				with: {
					tenant: true
				}
			}
		}
	});

	if (!apartment) {
		throw error(404, 'Apartment not found');
	}

	return {
		profile,
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
	},
	acceptRequest: async ({ params, request, locals }) => {
		if (!locals.user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const apartmentId = Number(params.id);
		const formData = await request.formData();
		const requestId = Number(formData.get('requestId'));

		if (!requestId) {
			return fail(400, { error: 'Invalid request ID' });
		}

		// Security Check: Verify the current user is actually the landlord
		const apartment = await db.query.apartments.findFirst({
			where: eq(apartments.id, apartmentId)
		});

		if (!apartment || apartment.landlordId !== locals.user.id) {
			return fail(403, { error: 'You do not have permission to modify these requests' });
		}

		try {
			await db.update(requests).set({ status: 'accepted' }).where(eq(requests.id, requestId));

			return { success: true };
		} catch (err) {
			console.error('Failed to accept request:', err);
			return fail(500, { error: 'Could not accept request' });
		}
	},

	rejectRequest: async ({ params, request, locals }) => {
		if (!locals.user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const apartmentId = Number(params.id);
		const formData = await request.formData();
		const requestId = Number(formData.get('requestId'));

		if (!requestId) {
			return fail(400, { error: 'Invalid request ID' });
		}

		// Security Check: Verify the current user is actually the landlord
		const apartment = await db.query.apartments.findFirst({
			where: eq(apartments.id, apartmentId)
		});

		if (!apartment || apartment.landlordId !== locals.user.id) {
			return fail(403, { error: 'You do not have permission to modify these requests' });
		}

		try {
			await db.update(requests).set({ status: 'rejected' }).where(eq(requests.id, requestId));

			return { success: true };
		} catch (err) {
			console.error('Failed to reject request:', err);
			return fail(500, { error: 'Could not reject request' });
		}
	}
};
