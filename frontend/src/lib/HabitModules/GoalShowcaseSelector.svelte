<script lang="ts">
  import { goals as goalsData } from "../../stores/goals"
  import Button from "../Button.svelte";

  export let props: {habit: Habit, updateHabit: (h: Habit) => Promise<void>, layoutIndex: number}
  $: habit = props.habit
  $: goals = $goalsData.get(habit._id)

  function setGoal(event: Event) {
    const goalIndex = event.target[0].value
    if (!goalIndex) {
      return
    }
    const selectedGoal = goals[goalIndex]
    habit.layout[props.layoutIndex] = 'GoalShowcase ' + selectedGoal._id
    props.updateHabit(habit)
  }
</script>

<h3>Showcase</h3>
<form on:submit|preventDefault={setGoal}>
  <select name="goal" id="goalSelect">
    <option value="" disabled selected>Select Goal</option>
    {#each goals as goal, i}
      <option value={i}>{goal.name}</option>
    {/each}
  </select>
  <Button --colorOne="var(--dark-text-color)" --colorTwo="var(--dark-bg-shadow-color)">Confirm</Button>
</form>


<style>
  select, input {
    padding: 0.5em;
    border: 1px solid var(--accent-color);
    background-color: var(--dark-bg-shadow-color);
    color: var(--dark-text-color);
    &:focus {
      outline: none;
    }
  }
</style>
