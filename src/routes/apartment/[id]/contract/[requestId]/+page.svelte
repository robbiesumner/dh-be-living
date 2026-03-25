<script lang="ts">
	import type { PageProps } from './$types';
	import { formatDate } from '$lib/utils';

	let { data }: PageProps = $props();
	const { apartment, request } = $derived(data);
</script>

<div class="max-w-3xl mx-auto space-y-6">
	<div class="flex justify-between items-center mb-8">
		<div>
			<h1 class="text-3xl font-bold">Mietvertrag (Entwurf)</h1>
			<p class="text-sm text-base-content/60 mt-1">
				Klicke auf die markierten Felder, um sie vor dem Drucken anzupassen.
			</p>
		</div>
		<button class="btn btn-outline" onclick={() => window.print()}> Als PDF drucken </button>
	</div>

	<div
		class="card bg-base-100 border border-base-200 shadow-sm print:shadow-none print:border-none"
	>
		<div class="card-body space-y-8 print:p-0">
			<div class="text-center pb-8 border-b border-base-200">
				<h2
					class="text-2xl font-bold uppercase tracking-widest outline-none hover:bg-base-200 focus:bg-base-200 rounded px-2 transition-colors print:bg-transparent"
					contenteditable="true"
					spellcheck="false"
				>
					Wohnraummietvertrag
				</h2>
			</div>

			<div class="grid grid-cols-2 gap-8">
				<div>
					<h3 class="font-bold text-sm text-base-content/60 uppercase mb-2">Vermieter</h3>
					<p
						class="font-medium text-lg outline-none hover:bg-base-200 focus:bg-base-200 rounded px-1 -ml-1 transition-colors print:bg-transparent"
						contenteditable="true"
						spellcheck="false"
					>
						{apartment.landlord.name}
					</p>
					<p
						class="text-sm outline-none hover:bg-base-200 focus:bg-base-200 rounded px-1 -ml-1 transition-colors print:bg-transparent"
						contenteditable="true"
						spellcheck="false"
					>
						Musterstraße 1<br />12345 Musterstadt
					</p>
				</div>
				<div>
					<h3 class="font-bold text-sm text-base-content/60 uppercase mb-2">Mieter</h3>
					<p
						class="font-medium text-lg outline-none hover:bg-base-200 focus:bg-base-200 rounded px-1 -ml-1 transition-colors print:bg-transparent"
						contenteditable="true"
						spellcheck="false"
					>
						{request.tenant.name}
					</p>
					<p
						class="text-sm opacity-80 outline-none hover:bg-base-200 focus:bg-base-200 rounded px-1 -ml-1 transition-colors print:bg-transparent"
						contenteditable="true"
						spellcheck="false"
					>
						{request.tenant.phone || 'Telefonnummer eingeben'}
					</p>
				</div>
			</div>

			<div class="bg-base-200/50 p-6 rounded-2xl print:bg-transparent print:p-0">
				<h3 class="font-bold mb-4">§ 1 Mietobjekt</h3>
				<p class="leading-relaxed">
					Vermietet wird die {apartment.isWG ? 'WG-Zimmer' : 'Wohnung'} unter der Adresse
					<strong
						class="outline-none hover:bg-base-300 focus:bg-base-300 rounded px-1 transition-colors print:bg-transparent"
						contenteditable="true">{apartment.address}</strong
					>
					mit einer Größe von ca.
					<strong
						class="outline-none hover:bg-base-300 focus:bg-base-300 rounded px-1 transition-colors print:bg-transparent"
						contenteditable="true">{apartment.size} m²</strong
					>.
				</p>
			</div>

			<div class="space-y-4">
				<h3 class="font-bold">§ 2 Mietzeit & Miete</h3>
				<ul class="list-disc list-inside space-y-2 ml-2">
					<li>
						Mietbeginn: <strong
							class="outline-none hover:bg-base-200 focus:bg-base-200 rounded px-1 transition-colors print:bg-transparent"
							contenteditable="true">{formatDate(apartment.availableFrom)}</strong
						>
					</li>
					<li>
						Mietende: <strong
							class="outline-none hover:bg-base-200 focus:bg-base-200 rounded px-1 transition-colors print:bg-transparent"
							contenteditable="true">{formatDate(apartment.availableTo)}</strong
						>
					</li>
					<li>
						Monatliche Miete: <strong
							class="outline-none hover:bg-base-200 focus:bg-base-200 rounded px-1 transition-colors print:bg-transparent"
							contenteditable="true">€{apartment.rentPrice}</strong
						>
					</li>
				</ul>
			</div>

			<div class="grid grid-cols-2 gap-8 pt-20 mt-12 border-t border-base-200">
				<div>
					<div class="border-b border-base-300 pb-2 mb-2 h-8"></div>
					<p class="text-sm text-base-content/60">Ort, Datum, Unterschrift Vermieter</p>
				</div>
				<div>
					<div class="border-b border-base-300 pb-2 mb-2 h-8"></div>
					<p class="text-sm text-base-content/60">Ort, Datum, Unterschrift Mieter</p>
				</div>
			</div>
		</div>
	</div>
</div>
