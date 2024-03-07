<script lang="ts">
  import SectionCard from '$lib/components/SectionCard.svelte'
    import MyButton from '$lib/components/miscellaneous/MyButton.svelte';


  function fundsHandle(){
    
  }
</script>


<div class="w-fit">
  <SectionCard title="Rechargement Lydia">
    <p class="p-5 w-80 rounded-md bg-yellow-100 text-yellow-900">
      Rentrez votre numéro de téléphone (associé à votre compte Lydia), si celui-ci n'est pas relié alors vous recevrez un SMS pour pouvoir payer en ligne. Sinon, acceptez le paiement sur la plateforme Lydia.
    </p>
    <div class="w-full">
      <p>Numéro de téléphone Lydia:</p>
      <input class="w-52 text-black" type="number">
    </div>
    <div class="w-full">
      <p>Montant (minimum 15€):</p>
      <input class="w-52 text-black" type="number">
    </div>
    <MyButton value="Valider" callback={fundsHandle}/>
  </SectionCard>
</div>