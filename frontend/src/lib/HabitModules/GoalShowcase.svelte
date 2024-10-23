<script lang="ts">
  import { goals as goalsData } from "../../stores/goals"
  export let props: {habit: Habit, goal: string}
  $: habit = props.habit
  $: goal = $goalsData.get(habit._id).find((goal) => goal._id === props.goal)

</script>

<h3>{goal.name}</h3>
<section id="goal">
  <div id="created">
    <p>Created on:</p>
    <p>{new Date(goal.creationDate).toLocaleString()}</p>
  </div>
  {#if goal.startDate}
    <div id="start">
      <p>Start Date:</p>
      <p>{new Date(goal.startDate).toLocaleString()}</p>
    </div>
  {/if}
  {#if goal.endDate}
    <div id="start">
      <p>End Date:</p>
      <p>{new Date(goal.endDate).toLocaleString()}</p>
    </div>
  {/if}
  {#if goal.goalTarget}
    <div id="target">
      <p>Goal Target:</p>
      <p>{goal.goalTarget}</p>
    </div>
  {/if}
  {#if goal.goalFrequency?.amount && goal.goalFrequency?.timeframe}
    <div id="frequency">
      <p>Goal Frequency:</p>
      <p>{goal.goalFrequency.amount} {goal.goalFrequency.timeframe}</p>
    </div>
  {/if}
  {#if Object.hasOwn(goal, 'goalCompleted')}
    <div id="completed">
      <p>Goal Completed:</p>
      <p>{goal.goalCompleted ? "Complete!" : "In Progress"}</p>
    </div>
  {/if}
</section>

<style>
  section {
    display: flex;
    flex-direction: row;
    justify-content: safe center;
    flex-wrap: wrap;
    width: 100%;
    margin: 1em 0;
    gap: 1em 2em;
  }
  div {
    flex: 0 0 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    white-space: nowrap;
    background-color: hsl(from var(--dark-bg-shadow-color) h s calc(l*1.05) );
    border-radius: 15px;
  }
  p {
    margin: 0 1em;
    padding: 0.5em 0;
  }
</style>
