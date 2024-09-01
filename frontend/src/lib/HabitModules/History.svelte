<script lang="ts">
  export let habit: Habit
</script>

<ul>
  <li><h3>History: {habit.instances.length} attempts</h3></li>
  {#each habit.instances.sort((a, b) => new Date(b).getTime() - new Date(a).getTime()) as instance}
    <li>{new Date(instance).toLocaleString()}</li>
  {/each}
</ul>

<style>
  ul {
    padding: 1em 0;
  }
  li {
    padding: 0.1em 1em;
    list-style: none;
    margin: 0;
  }
  h3 {
    margin: 0;
    padding-bottom: 0.5em;
  }
</style>
