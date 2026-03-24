import { db } from '$lib/server/db';
import { apartments, profiles } from '$lib/server/db/schema';
import { eq, like, or, and } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const searchQuery = url.searchParams.get('q');
	
	// For now, we'll assume profile ID 1 as the current user
	const profile = await db.query.profiles.findFirst({
		where: eq(profiles.id, 1)
	});

	// Get manual filters or fallback to profile
	const dhbwLocation = url.searchParams.get('dhbwLocation') ?? profile?.dhbwLocation;
	const workLocation = url.searchParams.get('workLocation') ?? profile?.workLocation;
	const isWGParam = url.searchParams.get('isWG');
	const isWG = isWGParam !== null ? isWGParam === 'true' : (profile?.acceptWG ?? false);

	let filters = [];

	if (searchQuery) {
		filters.push(
			or(like(apartments.title, `%${searchQuery}%`), like(apartments.address, `%${searchQuery}%`))
		);
	} else {
		const locations = [];
		if (dhbwLocation) locations.push(like(apartments.address, `%${dhbwLocation}%`));
		if (workLocation) locations.push(like(apartments.address, `%${workLocation}%`));
		
		if (locations.length > 0) {
			filters.push(or(...locations));
		}
	}

	// Always apply WG filter if we have a preference or manual setting
	filters.push(eq(apartments.isWG, isWG));

	const listings = await db
		.select()
		.from(apartments)
		.where(filters.length > 0 ? and(...filters) : undefined);

	return {
		listings,
		searchQuery,
		profile,
		filters: {
			dhbwLocation,
			workLocation,
			isWG
		}
	};
};
