<script lang="ts">
  import {afterUpdate} from "svelte";
  import { goals as goalsData } from "../../stores/goals"
  import {userData} from "../../stores/userData";
  import Button from "../Button.svelte";

  export let props: {habit: Habit, goal: string}

  $: habit = props.habit
  $: goal = $goalsData.get(habit._id).find((goal) => goal._id === props.goal)
  $: checkInsInRange = findCheckInsInRange(habit)

  function findCheckInsInRange(habit: Habit): number {
    let checkIns = 0
    for (let i = 0; i < habit.instances.length; i++) {
      if (new Date(habit.instances[i]).getTime() >= new Date(goal.startDate).getTime()
          && new Date(habit.instances[i]).getTime() <= new Date(goal.endDate).getTime()) {
        checkIns++
      }
    }
    if (checkIns > goal.goalTarget) {
      checkIns = goal.goalTarget
    }
    return checkIns
  }

  afterUpdate(() => {
    checkInsInRange = findCheckInsInRange(habit)
  })

  async function completeGoal() {
    const data = new URLSearchParams()
    data.append('goalID', goal._id)
    if (goal.startDate) {
      data.append('startDate', goal.startDate)
    }
    if (goal.endDate) {
      data.append('endDate', goal.endDate)
    }
    if (goal.goalTarget) {
      data.append('goalTarget', goal.goalTarget)
    }
    if (goal.goalFrequency) {
      data.append('timeframe', goal.goalFrequency.timeframe)
      data.append('amount', goal.goalFrequency.amount)
    }
    data.append('completed', true)
    data.append('goalCompleted', true)
    const completeGoalResponse = await fetch(`${import.meta.env.VITE_API_DOMAIN}/goals`, {
      method: 'PUT',
      body: data
    })
    const { completedGoalId } = await completeGoalResponse.json()
    console.log('Completed goal', completedGoalId)

    const goalRetriveResponse = await fetch(`${import.meta.env.VITE_API_DOMAIN}/goals/${$userData}`)
    const fetchedGoals = await goalRetriveResponse.json()

    const tempGoals: Map<string, Goal[]> = new Map()
    fetchedGoals.forEach((goal: Goal) => {
      if (tempGoals.has(goal.habit)) {
        tempGoals.get(goal.habit).push(goal)
      } else {
        tempGoals.set(goal.habit, [goal])
      }
    })
    goalsData.set(tempGoals)
    console.log('Refreshed goals')
  }

  let confirmCompleteToggle = false
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
      <p>{new Date(goal.startDate).toLocaleDateString()}</p>
    </div>
  {/if}
  {#if goal.endDate}
    <div id="start">
      <p>End Date:</p>
      <p>{new Date(goal.endDate).toLocaleDateString()}</p>
    </div>
  {/if}
  {#if goal.goalTarget}
    <div id="target">
      <p>Goal Target:</p>
      <p>{checkInsInRange} / {goal.goalTarget}</p>
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
  {#if checkInsInRange === goal.goalTarget && !goal.goalCompleted}
    <div id="completeGoal">
      {#if !confirmCompleteToggle}
        <Button --colorOne="var(--dark-text-color)" --colorTwo="var(--dark-bg-shadow-color)" data={{ func: () => {confirmCompleteToggle = true}}}>Complete Goal</Button>
      {:else}
        <form on:submit|preventDefault={completeGoal}>
          <Button --colorOne="var(--dark-text-color)" --colorTwo="var(--dark-bg-shadow-color)" data={{ func: () => {}}}>Confirm</Button>
        </form>
        <Button --colorOne="var(--dark-text-color)" --colorTwo="var(--dark-bg-shadow-color)" data={{ func: () => {confirmCompleteToggle = false}}}>Cancel</Button>
      {/if}
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
  #completeGoal {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  p {
    margin: 0 1em;
    padding: 0.5em 0;
  }
</style>
