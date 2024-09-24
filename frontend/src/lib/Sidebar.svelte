<script lang="ts">
  import { onMount } from 'svelte';

  import { habits } from '../stores/habits'
  import { userData } from '../stores/userData'

  async function addNewHabit(event: Event): Promise<void> {
    const name = event.target[0].value
    if (name === '') return

    const data = new URLSearchParams()
    data.append('name', name)
    data.append('user', $userData)

    const addHabitResponse = await fetch(`${import.meta.env.VITE_API_DOMAIN}/habits`, {
      method: 'POST',
      body: data
    })

    const { newHabitID } = await addHabitResponse.json()
    console.log('Added new habit: ', newHabitID)

    const habitRetrieveResponse = await fetch(`${import.meta.env.VITE_API_DOMAIN}/habits/${$userData}`)
    const updatedHabits = await habitRetrieveResponse.json()

    const tempHabits: Map<string, Habit> = $habits
    updatedHabits.forEach((habit) => {
      tempHabits.set(habit._id, habit)
    })
    habits.set(tempHabits)

    event.target[0].value = ''
  }

  function getMostRecentInstanceDate(id: number): String {
    const tempInstances = $habits.get(id).instances
    tempInstances.sort((a, b) => {
      return new Date(b).getTime() - new Date(a).getTime()
    }) 
    return tempInstances.length > 0 ? new Date(tempInstances[0]).toLocaleDateString() : 'No attempts yet'
  }

  export let toggleFunc: () => void 
  let showSidebar = true
  function toggleClick(): void {
    showSidebar = !showSidebar
    toggleFunc()
  }
</script>

<section class:hide={showSidebar ? false : true}>
  <form on:submit|preventDefault={addNewHabit}>
    <input type="text" id="name" placeholder="Habit name" />
    <button type="submit">Add</button>
  </form>
  <ul>
    {#each Array.from($habits.values()) as habit}
      <li class="habit">
        <a href="/{habit._id}"><h3>{habit.name}</h3></a>
        <p>Last done: {getMostRecentInstanceDate(habit._id)}</p>
      </li>
    {/each}
  </ul>
</section>
  <button id="toggleSidebar" on:click={toggleClick} style:left={showSidebar ? '20%' : '0'}>
    <p style:transform={showSidebar ? '' : 'scaleX(-1)'}>←</p>
  </button>

<style>
  .hide {
    background-color: var(--dark-bg-shadow-color);
    color: var(--dark-bg-shadow-color);
  }
  section {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-right: 1px solid var(--accent-color);
    height: 100%;
    width: 100%;
    transition: 1s;
  }
  ul {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin: 0;
    padding: 0;
    overflow: auto;
    overflow-x: hidden;
    & li:nth-child(even) {
      background-color: var(--dark-bg-shadow-color);
    }
  }
  form {
    background-color: var(--dark-bg-shadow-color);
    width: 100%;
    display: flex;
    border-bottom: 1px solid var(--accent-color);
    & > input {
      padding: 0.9em 0.5em;
      border: 1px solid var(--accent-color);
      width: 100%;
      background-color: var(--dark-bg-shadow-color);
      color: var(--dark-text-color);
      border: none;
    }
    & > button {
      width: auto;
      border: none;
      color: var(--dark-text-color);
      background-color: inherit;
      border-left: 1px solid var(--accent-color);
      transition: 0.3s;
      &:focus, &:hover {
        background-color: var(--dark-bg-color);
      }
    }
    & > *:focus {
      outline: none;
    }
  }
  li {
    white-space: nowrap;
    height: 13%;
    list-style: none;
    display: grid;
    align-items: center;
    grid-template-rows: 1fr 0.7fr;
    padding-left: 2em;
    padding-right: 2em;
    width: 100%;
    & a {
      overflow: hidden;
      white-space: nowrap;
    }
    & > * {
      padding: 0 0.7em;
      margin: 0;
    }
  }
  #toggleSidebar {
    transition: 0.3s, left 1s;
    position: absolute;
    top: 10%;
    border-radius: 0;
    border: var(--accent-color) 1px solid;
    background-color: inherit;
    color: var(--dark-text-color);
    left: 0;
    width: 1.5em;
    padding: 0.86em 0em;
    z-index: 100;
    &:hover, &:focus {
      background-color: var(--accent-color);
      color: var(--dark-text-color);
    }
    & > p {
      margin: 0;
      transition: 1s;
    }
  }
</style>
