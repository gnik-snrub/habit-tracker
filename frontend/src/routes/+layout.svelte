<script lang="ts">
  import Sidebar from '../lib/Sidebar.svelte'
</script>

<svelte:head><title>Habit Tracker</title></svelte:head>
<header>
  <h1>Habit Tracker</h1>
</header>
<main>
  <Sidebar/>
  <slot/>
</main>


<style>
  :global(body, html) {
    margin: 0;
    height: 100%;
  }

  header {
    margin: 0;
    background-color: rgb(238, 238, 238);
    height: 10vh;
  }
  h1 {
    padding: 10px;
    margin: 0;
    margin-left: 10px;
  }

  main {
    display: flex;
    flex-flow: row;
    height: 90vh;
  }
</style>
