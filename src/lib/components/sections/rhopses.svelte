<script lang="ts">
  import SectionCard from "../SectionCard.svelte";
    import MyButton from "../miscellaneous/MyButton.svelte";

  function handle(){}
</script>

<SectionCard title="Tes dernières rhopses">
  <div class="w-full flex flex-col justify-center items-center">
    <p class="text-lg">Tes dernières rhopses</p>
    <!-- <table class="border-collapse border-b-2 border-solid border-white">
      <thead>
        <tr>
          <th scope="col">Date</th>
          <th scope="col">Libellé</th>
          <th scope="col">Montant</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>2024-01-28 21:01:11</td>
          <td>Consommation : 1 x DB160</td>
          <td>-1.3€</td>
        </tr>
        <tr>
          <td>2024-01-28 21:01:11</td>
          <td>Consommation : 1 x DB160</td>
          <td>-1.3€</td>
        </tr>
      </tbody>
    </table> -->
  </div>
  <div/>
<MyButton value="voir plus"/>
</SectionCard>

