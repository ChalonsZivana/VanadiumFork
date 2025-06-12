import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte"],
  preprocess: vitePreprocess(),

  kit: {
    env: {
      dir: "./",
    },
    csrf: {
      checkOrigin: false,
    },
    adapter: adapter(),
  },
};

export default config;
