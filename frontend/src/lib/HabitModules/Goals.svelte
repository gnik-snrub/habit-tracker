<script lang="ts">
  export let habit: Habit
  export let updateHabitStore: () => Promise<void>
  updateHabitStore = (): Promise<void> => { return }

  import { goals as goalsData } from "../../stores/goals"

  $: goals = $goalsData.get(habit._id)
</script>


<div>
  <h3>Goals</h3>
  <ul>
    {#each goals as goal}
      <li>{goal.name}</li>
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
  li {
    list-style: number;
  }
  h3 {
    rotate: -90deg;
  }
</style>
