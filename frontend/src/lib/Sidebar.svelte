<script lang="ts">
  import { onMount } from 'svelte';

  import { habits } from '../stores/habits'
  import { userData } from '../stores/userData'

  onMount(async() => {
    const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/habits/${$userData}`)
    const updatedHabits = await response.json()

    const temp: Map<string, Habit> = $habits
    updatedHabits.forEach((habit) => {
      temp.set(habit._id, habit)
    })
    habits.set(temp)
  })

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

</script>

<section>
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

<style>
  section {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-right: 1px solid black;
    height: 100%;
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
      background-color: lightgray;
    }
  }
  li {
    list-style: none;
    display: grid;
    grid-template-rows: 1fr 1fr;
    padding-left: 1em;
    width: 100%;
    & a {
      text-decoration: none;
      color: inherit;
    }
  }
</style>
