<script lang="ts">
    import {onMount} from "svelte";

  import { goals as goalsData } from "../../stores/goals"
  export let props: {habit: Habit, goal: string}
  $: habit = props.habit
  $: goal = $goalsData.get(habit._id).find((goal) => goal._id === props.goal)

  onMount(() => {
    console.log(habit, goal)
  })
</script>

<section id="goal">
  <h4>{goal.name}</h4>
  <p>Created on:</p>
  <p>{new Date(goal.creationDate).toLocaleString()}</p>
</section>
