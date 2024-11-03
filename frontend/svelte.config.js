/* import adapter from '@sveltejs/adapter-auto';

const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter()
  }
}

export default config;
*/

import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import node from '@sveltejs/adapter-node'

const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: node(), 
  }
}

export default config
