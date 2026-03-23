import { db } from '$lib/server/db';
import { apartments } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

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
