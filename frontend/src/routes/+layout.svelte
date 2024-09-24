<script lang="ts">
  import Sidebar from '$lib/Sidebar.svelte'
  import Button from '$lib/Button.svelte'

  import {onMount} from 'svelte';
  import { userData } from '../stores/userData'
  import { habits } from '../stores/habits'
  import { goals } from '../stores/goals'

  onMount(async() => {
    const habitResponse = await fetch(`${import.meta.env.VITE_API_DOMAIN}/habits/${$userData}`)
    const fetchedHabits = await habitResponse.json()

    const temp: Map<string, Habit> = $habits
    fetchedHabits.forEach((habit) => {
      temp.set(habit._id, habit)
    })
    habits.set(temp)

    const goalResponse = await fetch(`${import.meta.env.VITE_API_DOMAIN}/goals/${$userData}`)
    const fetchedGoals = await goalResponse.json()

    const tempGoals: Map<string, Goal[]> = new Map()
    fetchedGoals.forEach((goal) => {
      if (tempGoals.has(goal.habit)) {
        tempGoals.get(goal.habit).push(goal)
      } else {
        tempGoals.set(goal.habit, [goal])
      }
    })
    goals.set(tempGoals)
  })


  let showSidebar = true
  function toggleSidebar(): void {
    showSidebar = !showSidebar
  }
</script>

<svelte:head><title>Habit Tracker</title></svelte:head>
<header>
  <a href="/"><h1>Habit Tracker</h1></a>
  <Button --colorOne="var(--dark-text-color)" --colorTwo="var(--accent-color)" data={{ label: 'Login' }}/>
  <Button --colorOne="var(--dark-text-color)" --colorTwo="var(--accent-color)" data={{ label: 'Dark Mode' }}/>
</header>
<main style:grid-template-columns={showSidebar ? '20% 80%' : '0 100%'}>
  <Sidebar toggleFunc={() => {toggleSidebar()}}/>
  <slot/>
</main>

<style>
  :global(:root) {
    --bg-color: rgb(238, 238, 238);
    --text-color: black;
    --dark-bg-color: rgb(69, 72, 81);
    --dark-bg-shadow-color: rgb(56, 59, 66);
    --dark-text-color: rgb(252, 239, 249);
    --accent-color: rgb(39, 154, 241);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  :global(body, html) {
    margin: 0;
    height: 100%;
    width: 100%;
    background-color: var(--dark-bg-color);
    color: var(--dark-text-color);
    scrollbar-color: var(--accent-color) var(--dark-bg-shadow-color);
    & a {
      text-decoration: none;
      color: inherit;
    }
  }
  header {
    margin: 0;
    height: 10vh;
    display: flex;
    align-items: center;
    flex-grow: 1;
    padding-right: 3em;
    background-color: var(--accent-color);
    color: var(--dark-text-color);
    & > * {
      margin-left: 1em;
    }
  }
  h1 {
    padding: 10px;
    margin: 0;
    margin-left: 10px;
    margin-right: auto;
  }
  main {
    display: grid;
    grid-template-columns: 20% 80%;
    height: 90vh;
    overflow: hidden;
    transition: 1s;
    & > * {
      overflow: auto;
    }
  }
</style>
