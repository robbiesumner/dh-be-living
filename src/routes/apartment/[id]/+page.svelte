<script lang="ts">
    import {resolve} from "$app/paths";
  let { data } = $props();
  const { apartment } = data;
</script>

<div class="flex flex-col gap-6">
  <div>
    <a href={resolve("/search")} class="btn btn-sm btn-outline shadow-sm">
      &larr; Back to Search
    </a>
  </div>

  <div class="card bg-base-200 shadow-xl border-t-4 border-primary">
    <div class="card-body">
      <h1 class="card-title text-3xl font-extrabold">{apartment.title}</h1>
      <p class="text-base-content/70 font-medium flex items-center gap-2 mt-2">
        📍 {apartment.address}
      </p>

      <div class="divider my-2"></div>

      <div class="flex flex-wrap gap-4 mb-4">
        <div class="stat bg-base-100 rounded-box shadow-sm px-4 py-2 w-auto">
          <div class="stat-title text-xs">Rent</div>
          <div class="stat-value text-xl text-primary">€{apartment.rentPrice}</div>
        </div>
        <div class="stat bg-base-100 rounded-box shadow-sm px-4 py-2 w-auto">
          <div class="stat-title text-xs">Size</div>
          <div class="stat-value text-xl">{apartment.size} sqm</div>
        </div>
      </div>

      <h3 class="text-lg font-bold mt-2">Description</h3>
      <p class="text-base-content/80 whitespace-pre-line leading-relaxed">
        {apartment.description}
      </p>

      <div class="mt-8 p-4 bg-base-100 rounded-xl border border-base-300">
        <h3 class="text-sm font-bold text-base-content/50 uppercase mb-2">Contact Landlord</h3>
        <div class="flex justify-between items-center">
          <div>
            <p class="font-bold">{apartment.landlord.name}</p>
            <p class="text-sm text-base-content/70">{apartment.landlord.phone}</p>
          </div>
          <button class="btn btn-primary">Send Request</button>
        </div>
      </div>

    </div>
  </div>
</div>
