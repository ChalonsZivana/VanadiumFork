<script lang="ts">
  import "../app.css";
</script>


<style>
	.motion-demo {
		offset-path: path("M20,20 C20,100 200,0 200,100");
		animation: move 3000ms infinite alternate ease-in-out;
		width: 40px;
		height: 40px;
	}

	.motion-demo2 {
		offset-path: path("M0,0 C100,60 300,50, 200,-200");
		animation: move 3000ms infinite alternate ease-in-out;
		width: 40px;
		height: 40px;
	}

	@keyframes move {
  0% {
    offset-distance: 0%;
		offset-rotate: 30deg;
  }
  100% {
    offset-distance: 100%;
		offset-rotate: 60deg;
  }
}
</style>

<div id="maindiv" class="relative w-screen h-screen">
  
  <slot/>
  <div class="z-50">
    <div style="top: 100px; left:20px" class="motion-demo absolute pumpkin text-8xl animate-shake">🎃</div>
    <div style="top: 50%; right:20px" class="absolute pumpkin text-8xl animate-shake">🎃</div>
    <div style="top: 50%; right:75%" class="motion-demo2 absolute pumpkin text-8xl animate-shake">🦇</div>
    <div style="bottom: 100px; left:20px" class="absolute pumpkin text-8xl animate-shake">🧠</div>
    <div style="bottom: 100px; right:20px" class="absolute -rotate-45 pumpkin text-8xl animate-shake">🧛</div>
  </div>
</div>
