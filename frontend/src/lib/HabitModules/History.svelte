<script lang="ts">
  export let habit: Habit
  export let updateHabitStore: () => Promise<void>
  updateHabitStore = (): Promise<void> => { return }
</script>

<div>
  <h3>History: {habit.instances.length} attempts</h3>
  <ul>
    {#each habit.instances.sort((a, b) => new Date(b).getTime() - new Date(a).getTime()) as instance}
      <li>{new Date(instance).toLocaleString()}</li>
    {/each}
  </ul>
</div>

<style>
  div {
    width: 100%;
    margin: 1.5em 0;
    outline: 1px solid var(--accent-color);
    background-color: var(--dark-bg-shadow-color);
  }
  ul {
    display: grid;
    grid-template-rows: repeat(5, 2em);
    grid-auto-flow: column;
    grid-auto-columns: 200px;
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    margin: 0;
    padding-bottom: 1em;
  }
  li {
    padding: 0.1em 1em;
    list-style: none;
    width: 100%;
    margin: 0;
  }
  h3 {
    padding-left: 2em;
  }
</style>
