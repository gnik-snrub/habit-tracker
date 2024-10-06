<script lang="ts">
  export let habit: Habit
  export let updateHabitStore: () => Promise<void>
  updateHabitStore = (): Promise<void> => { return }

  import { goals as goalsData } from "../../stores/goals"

  $: goals = $goalsData.get(habit._id)
</script>


<h3>Goals</h3>
<ul>
  {#each goals as goal}
    <li>{goal.name}</li>
  {/each}
</ul>

<style>
  li {
    list-style: number;
  }
  h3 {
    rotate: -90deg;
  }
</style>
