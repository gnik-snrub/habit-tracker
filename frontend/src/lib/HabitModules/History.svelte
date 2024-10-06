<script lang="ts">
  export let habit: Habit
  export let updateHabitStore: () => Promise<void>
  updateHabitStore = (): Promise<void> => { return }
</script>

<div>
  <h3>History</h3>
  <ul>
    <li><h4>{habit.instances.length} engagements</h4></li>
    {#each habit.instances.sort((a, b) => new Date(b).getTime() - new Date(a).getTime()) as instance}
      <li>{new Date(instance).toLocaleString()}</li>
    {/each}
  </ul>
</div>

<style>
  div {
    width: 100%;
    margin: 1.5em 0;
    padding: 1em 0;
    outline: 1px solid var(--accent-color);
    background-color: var(--dark-bg-shadow-color);
    display: flex;
    align-items: center;
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
    padding: 0;
    margin-right: 1em;
  }
  li {
    list-style: none;
  }
  h3 {
    rotate: -90deg;
  }
  h4 {
    margin: 0;
    text-decoration: underline;
    text-decoration-color: var(--accent-color);
  }
</style>
