<script lang="ts">
  export let habit: Habit
  export let updateHabitStore: () => Promise<void>
</script>

<section>
  <div>
    <h3>History: {habit.instances.length} attempts</h3>
    <ul>
      {#each habit.instances.sort((a, b) => new Date(b).getTime() - new Date(a).getTime()) as instance}
        <li>{new Date(instance).toLocaleString()}</li>
      {/each}
    </ul>
  </div>
</section>

<style>
  section {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
  }
  div {
    width: 100%;
    margin: 1.5em 0;
    background-color: var(--dark-bg-shadow-color);
    border-radius: 5px;
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
    margin-bottom: 1em;
    padding-bottom: 1em;
    border-bottom: 1px solid var(--accent-color);
  }
  li {
    padding: 0.1em 1em;
    list-style: none;
    width: 100%;
    margin: 0;
  }
  h3 {
    padding-left: 2em;
    padding-top: 1em;
    border-top: 1px solid var(--accent-color);
  }
</style>
