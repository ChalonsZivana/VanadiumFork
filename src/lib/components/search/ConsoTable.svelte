<script lang="ts">
  import MoneyColor from "../miscellaneous/MoneyColor.svelte";
  import AddRemoveConso from "../miscellaneous/AddRemoveConso.svelte";
  import type { ConsommationsIncludeType } from "$lib/server/classes/Taferie";
  import { fly } from "svelte/transition";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import type { boquettes } from "@prisma/client";

  
  export let fromOption: boolean;
  export let cancelOption: boolean;
  export let consommations: ConsommationsIncludeType[];

  function isLessThanAMonthOld(date: Date) {
    return new Date().getTime() - date.getTime() < 30 * 24 * 60 * 60 * 1000;
  }

  function getFrom(e: ConsommationsIncludeType) {
    if (e.type.startsWith("pg")) {
      if (e.from_pg) {
        return `${e.from_pg.nums}\nch\n${e.from_pg.proms}`;
      } else {
        return "∅";
      }
    }
    return "EXT";
  }

  function getTo(e: ConsommationsIncludeType) {
    switch (e.type) {
      case "ext_boq":
      case "pg_boq":
        return e.to_boquette?.nom;
      case "pg_ext":
        return "EXT";
      case "ext_fams":
      case "pg_fams":
        return e.to_fams?.nums;
      case "pg_pg":
        return "PG";
    }
  }

  let isTaferie:boolean=false;
  $: {
    console.log($page.data);
    isTaferie = !($page.data.BOQUETTES_IDS as boquettes[]).every(e => e.nom_simple!="taferie");
  }

  onMount(()=>{
    setTimeout(()=>{
      show = true;
    })
  })

  let headers = ["Date", "De", "Vers", "Libellé", "Montant"];
  if (cancelOption) headers.push("");

  let show= false;
</script>

<!-- Responsive Container (recommended) -->
<div class="table-container w-full flex-grow">
  <!-- Native Table Element -->
  <table class="table table-hover">
    <thead>
      <tr>
        <th class="text-xs">Date</th>
        {#if fromOption}
          <th class="text-xs">De</th>
        {/if}
        <th class="text-xs">Vers</th>
        <th class="text-xs">Libelle</th>
        <th class="text-xs">Montant</th>
        <th class="text-xs">Rhopseur</th>
        {#if cancelOption}
          <th></th>
        {/if}
      </tr>
    </thead>
    

    {#key consommations}
    <tbody in:fly={{duration:500, x:-2000}} class="divide-y-2 divide-white">
      {#each consommations as conso}
      {@const date = conso.date_conso.toLocaleString().split(" ")}
      <tr
       class="{conso.annule ? 'line-through' : ''} decoration-2 divide-x-2"
      >
        <td><span class="text-xxs">{date[0]}<br />{date[1]}</span></td>
        {#if fromOption}
          <td><span class="text-xxs whitespace-pre-wrap">{getFrom(conso)}</span
            ></td
          >
        {/if}
        <td><div class="w-6 text-wrap text-xxs">{getTo(conso)}</div></td>
        <td>
          <div class="w-16 text-wrap text-xxs">{conso.libelle}</div>
        </td>
        <td
          ><!-- Montant -->
          <p class=" text-xxs">AP. {conso.solde_apres.toFixed(2)}€</p>

          <!-- Foys -->
          {#key conso.montant}
            {#if conso.type == "pg_boq" && conso.to == 7}
              <MoneyColor
                auto={conso.montant}
                className="text-xs font-bold text-xxs"
              />
            {:else if conso.type == "ext_fams" || conso.type == "pg_fams"}
              <MoneyColor
                auto={-conso.montant}
                className="text-xs font-bold text-xxs"
              />
            {:else}
              <MoneyColor
                auto={conso.montant}
                className="text-xs font-bold text-xxs"
              />
            {/if}
          {/key}

          <p class=" text-xxs">AV. {conso.solde_avant.toFixed(2)}€</p>
        </td>
        <td>{conso.rhopseur}</td>
        {#if cancelOption && (isLessThanAMonthOld(conso.date_conso) || isTaferie)}
          <td class="flex justify-center items-center">
            {#key conso.id_conso}
              <AddRemoveConso
                bind:id={conso.id_conso}
                bind:annule={conso.annule}
              />
            {/key}
          </td>
        {/if}
      </tr>
    {/each}
  </tbody>
    {/key}
  </table>
</div>
