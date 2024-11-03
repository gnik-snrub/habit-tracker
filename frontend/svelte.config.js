/* import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter()
  }
}

export default config;
*/

/** @type {import('@sveltejs/kit').Config} */

import node from '@sveltejs/adapter-node'

const config = {
  kit: {
    adapter: node(), 
  }
}

export default config
