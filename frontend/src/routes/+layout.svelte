<script lang="ts">
  import Sidebar from '../lib/Sidebar.svelte'
</script>

<svelte:head><title>Habit Tracker</title></svelte:head>
<header>
  <a href="/">
    <h1>Habit Tracker</h1>
  </a>
</header>
<Sidebar/>
<slot/>


<style>
  :global(body) {
    margin: 0;
  }

  header {
    margin: 0;
    background-color: rgb(238, 238, 238);
  }
  h1 {
    padding: 10px;
    margin: 0;
    margin-left: 10px;
  }
</style>
