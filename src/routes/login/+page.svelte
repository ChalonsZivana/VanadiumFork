<div class="h-full text-white flex flex-col items-center gap-10">
  <p class="mt-10 font-zagoth text-3xl">Vanadium Chalon's</p>
  
  <div class="flex flex-col items-center">
    <form method="post" name="login" action="?/login" class="flex flex-col gap-10">
    
    <div class="flex flex-col font-zagoth w-80">
      <label for="id" class="text-lg">Identifiant</label>
      <input id="id" class="text-black rounded-md pl-2" type="text" name="id" placeholder="__ch__">
    </div>
    <div class="flex flex-col font-zagoth w-80">
      <label for="mdp" class="text-lg">Mot de passe</label>
      <input id="mdp" class="text-black rounded-md pl-2" type="password" name="password">
    </div>
    <button class="bg-red-600 p-2 w-fit">Connexion</button>
    </form>
    <div class="flex flex-col mt-4 w-80">
      <p>Mot de passe oublié ? Demandez à un administrateur de le changer pour vous</p>
      <a href="/cgu">Mentions Légales</a>
    </div>
  </div>
  
 
</div>
