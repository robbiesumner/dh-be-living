import { db } from '$lib/server/db';
import { apartments } from '$lib/server/db/schema';
import { like, or } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const searchQuery = url.searchParams.get('q');
	let listings;

	if (searchQuery) {
		listings = await db
			.select()
			.from(apartments)
			.where(
				or(like(apartments.title, `%${searchQuery}%`), like(apartments.address, `%${searchQuery}%`))
			);
	} else {
		listings = await db.select().from(apartments);
	}

	return {
		listings,
		searchQuery
	};
};
