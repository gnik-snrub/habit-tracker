<script lang="ts">
  import { goto } from '$app/navigation'
  import { browser } from '$app/environment'

  import Sidebar from '$lib/Sidebar.svelte'
  import Button from '$lib/Button.svelte'

  import { userData } from '../stores/userData'

  $: {
    if (browser && !$userData) {
      goto('/login')
    }
  }

  let showSidebar = true
  function toggleSidebar(): void {
    showSidebar = !showSidebar
  }
</script>

<svelte:head><title>Habit Tracker</title></svelte:head>
<header>
  <a href="/"><h1>Habit Tracker</h1></a>
  <Button --colorOne="var(--dark-text-color)" --colorTwo="var(--accent-color)"><a href="/login">Log in</a></Button>
  <Button --colorOne="var(--dark-text-color)" --colorTwo="var(--accent-color)">Dark Mode</Button>
</header>
<main style:grid-template-columns={showSidebar ? '20% 80%' : '0 100%'}>
  <Sidebar toggleFunc={() => {toggleSidebar()}}/>
  <slot/>
</main>

<style>
  :global(:root) {
    --bg-color: rgb(238, 238, 238);
    --text-color: black;
    --dark-bg-color: rgb(69, 72, 81);
    --dark-bg-shadow-color: rgb(56, 59, 66);
    --dark-text-color: rgb(252, 239, 249);
    --accent-color: rgb(39, 154, 241);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  :global(body, html) {
    margin: 0;
    height: 100%;
    width: 100%;
    background-color: var(--dark-bg-color);
    color: var(--dark-text-color);
    scrollbar-color: var(--accent-color) var(--dark-bg-shadow-color);
    & a {
      text-decoration: none;
      color: inherit;
    }
  }
  header {
    margin: 0;
    height: 10vh;
    display: flex;
    align-items: center;
    flex-grow: 1;
    padding-right: 3em;
    background-color: var(--accent-color);
    color: var(--dark-text-color);
    & > * {
      margin-left: 1em;
    }
  }
  h1 {
    padding: 10px;
    margin: 0;
    margin-left: 10px;
    margin-right: auto;
  }
  main {
    display: grid;
    grid-template-columns: 20% 80%;
    height: 90vh;
    overflow: hidden;
    transition: 1s;
    & > * {
      overflow: auto;
    }
  }
</style>
