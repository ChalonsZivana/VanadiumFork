<script lang="ts">
  import { onMount } from "svelte";

  export let data;

  let scroll: number = 0;

  function handleScroll(event: Event) {
    const target = event.target as HTMLElement;
    scroll = target.scrollTop;
  }

  function getWeekDays() {
    const daysOfWeek = [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ];
    const today = new Date();

    // Trouver le premier jour de la semaine (Lundi)
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay() + 1),
    );

    let weekDays = [];

    // Boucle sur les 7 jours pour générer la semaine complète
    for (let i = 0; i < 5; i++) {
      let currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);

      let dayName = daysOfWeek[currentDay.getDay()];
      let formattedDate = currentDay.toISOString().split("T")[0]; // Format YYYY-MM-DD

      weekDays.push({
        dayName: dayName,
        date: formattedDate,
      });
    }

    return weekDays;
  }

  function parseEvents() {
    console.log("parse");
    const parser = new DOMParser(); // Create an XML parser
    const xmlDoc = parser.parseFromString(data.unparsedEDT, "application/xml"); // Parse XML
    console.log(xmlDoc);
    // Find the update node with events
    const eventsUpdateNode = xmlDoc.querySelector('update[id="form:j_idt119"]');
    console.log(eventsUpdateNode);

    if (!eventsUpdateNode) return [];

    const eventsData = eventsUpdateNode.textContent; // Get the CDATA content
    console.log(eventsData);
    if (eventsData == null) return {};
    const jsonData = JSON.parse(eventsData); // Parse the JSON data
    console.log(jsonData.events);
    return jsonData.events;
  }

  $: week = getWeekDays();
  let events: ReturnType<typeof parseEvents> = [];
  onMount(() => {
    console.log("onMount");
    events = parseEvents();
    console.log(events);
  });
</script>

<div
  class="h-screen w-screen flex flex-col items-center justify-center bg-yellow-200 overflow-y-auto overflow-x-hidden"
  on:scroll={handleScroll}
>
  <div
    class="grid grid-cols-5 w-11/12 place-items-center variant-filled-surface"
  >
    {#each week as day}
      <div>
        <p>{day.dayName}</p>
      </div>
    {/each}
  </div>

  <div class="relative w-11/12 h-5/6">
    <div
      class="absolute grid grid-cols-5 grid-rows-12 variant-filled-surface w-full h-full"
    >
      {#each Array(5 * 12).fill(10) as t}
        <div class="border-1 border-gray-500"></div>
      {/each}
    </div>
    <div
      class="absolute grid grid-cols-5 grid-rows-12 bg-red-200 opacity-50 w-full h-full"
    >
      {#if events}
        {#each events as event}
          <div style="" class="bg-red-600">
            <p></p>
          </div>
        {/each}
      {/if}
    </div>
  </div>
</div>
