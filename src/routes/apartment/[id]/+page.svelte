<script lang="ts">
	import { formatDate } from '$lib/utils';
	let { data } = $props();
	const { apartment } = data;
</script>

<div class="flex flex-col gap-4">
	<figure>
		<img
			class="h-56 w-full object-cover text-transparent"
			src="https://loremflickr.com/600/400/apartment?lock={apartment.id}"
			alt={apartment.title}
		/>
	</figure>
	<h2 class="card-title text-3xl font-extrabold">{apartment.title}</h2>
	<p>
		{apartment.address}
	</p>

	<p>€{apartment.rentPrice}</p>
	<p>{apartment.size} m²</p>
	<p>{formatDate(apartment.availableFrom)}-{formatDate(apartment.availableTo)}</p>
	<p>{apartment.description}</p>
</div>
