import { db } from '$lib/server/db';
import { apartments, requests } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	const apartmentId = Number(params.id);
	const requestId = Number(params.requestId);

	const apartment = await db.query.apartments.findFirst({
		where: eq(apartments.id, apartmentId),
		with: { landlord: true }
	});

	const request = await db.query.requests.findFirst({
		where: and(eq(requests.id, requestId), eq(requests.apartmentId, apartmentId)),
		with: { tenant: true }
	});

	// Security checks
	if (!apartment || !request) {
		throw error(404, 'Data not found');
	}
	if (apartment.landlordId !== locals.user.id) {
		throw error(403, 'Only the landlord can generate this contract');
	}
	if (request.status !== 'accepted') {
		throw error(400, 'Request must be accepted first');
	}

	return { apartment, request };
};
