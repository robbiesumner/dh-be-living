import { db } from '$lib/server/db';
import { apartments, profiles } from '$lib/server/db/schema';
import { eq, like, or, and } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
	const searchQuery = url.searchParams.get('q');
	
	const profile = locals.user;

	// Get manual filters or fallback to profile
	const dhbwLocation = url.searchParams.get('dhbwLocation') ?? profile?.dhbwLocation;
	const workLocation = url.searchParams.get('workLocation') ?? profile?.workLocation;
	const isWGParam = url.searchParams.get('isWG');
	
	// Default to WG if no preference is set and user not logged in, otherwise use user's preference
	const isWG = isWGParam !== null ? isWGParam === 'true' : (profile?.acceptWG ?? true);

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

	// Apply WG filter if explicitly set or if we have a preference
	if (isWGParam !== null || profile) {
		filters.push(eq(apartments.isWG, isWG));
	}

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
