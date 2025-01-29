<script lang="ts">
  import Chart, {
    type ActiveElement,
    type ChartData,
    type ChartEvent,
    type ChartTypeRegistry,
    type TooltipItem,
    type TooltipModel,
  } from "chart.js/auto";
  import { onMount } from "svelte";

  export let consos: {
    id_boquette: number | null;
    montant: number | null;
  }[];
  export let boquettes: {
    id_boquette: number;
    nom: string | null;
  }[];
  const depensesTotales = consos.reduce(
    (acc, transition) => acc + (transition.montant ?? 0),
    0,
  );

  let chart: Chart<"pie">;
  let clientWidth: number;
  let clientHeight: number;

  const getBoqName = (id_boq: number | null) =>
    boquettes.find((e) => e.id_boquette == id_boq)?.nom;
  onMount(() => {
    chart = createChart();
    chart.canvas.style.width = clientWidth + "px";
    chart.canvas.style.height = clientHeight + "px";
  });

  function createChart(): Chart<"pie"> {
    const labels = consos.map((e) => getBoqName(e.id_boquette) ?? "transfert");

    const chartData: ChartData<"pie"> = {
      labels: labels,
      datasets: [
        {
          data: consos.map((e) => e.montant as number),
          backgroundColor: [
            "#ff5733",
            "#33ff57",
            "#3357ff",
            "#ff33a6",
            "#a633ff",
            "#ff9433",
            "#ffb333",
            "#33ffb3",
            "#33b3ff",
            "#b333ff",
            "#ff3333",
          ],
          hoverBackgroundColor: [
            "rgba(255,87,51,0.6)",
            "rgba(51,255,87,0.6)",
            "rgba(51,87,255,0.6)",
            "rgba(255,51,166,0.6)",
            "rgba(166,51,255,0.6)",
            "rgba(255,148,51,0.6)",
            "rgba(255,179,51,0.6)",
            "rgba(51,255,179,0.6)",
            "rgba(51,179,255,0.6)",
            "rgba(179,51,255,0.6)",
            "rgba(255,51,51,0.6)",
          ],
          hoverOffset: 10,
        },
      ],
    };

    const ctx = document.getElementById("pie-chart") as HTMLCanvasElement;

    return new Chart(ctx, {
      type: "pie",
      data: chartData,
      options: {
        onClick: (
          event: ChartEvent,
          elements: ActiveElement[],
          chart: Chart,
        ) => {
          var elements = chart.getElementsAtEventForMode(
            event as any as MouseEvent,
            "index",
            { intersect: true },
            false,
          );
          var index = elements[0].index;
          console.log(index);
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              usePointStyle: true,
              color: "#ffffff",
              font: {
                size: 18,
              },
            },
          },
          tooltip: {
            enabled: true,
            bodyFont: {
              size: 25,
            },
            callbacks: {
              label: (tooltipItem: TooltipItem<"pie">) => {
                const dataset = chartData.datasets[tooltipItem.datasetIndex];
                const value = dataset.data[tooltipItem.dataIndex];

                if (value == null) return "error";
                return `${labels[tooltipItem.dataIndex]} ${value.toFixed(2)}€ - ${((100 * value) / depensesTotales).toFixed(2)}%`;
              },
            },
          },
        },
      },
    }) as Chart<"pie">;
  }
</script>

<div style="height: 600px" class="w-full">
  <canvas bind:clientWidth height="120px" id="pie-chart"></canvas>
</div>
