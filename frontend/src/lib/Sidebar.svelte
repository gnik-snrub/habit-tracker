<script lang="ts">

  import { habits } from '../stores/habits'

  function addNewHabit(event: Event): void {
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

  function doHabit(id: number): void {
    const temp = $habits
    temp.get(id).instances.push({
      habitId: id,
      date: new Date()
    })
    habits.set(temp)
  }

</script>

<form on:submit|preventDefault={addNewHabit}>
  <input type="text" id="name" placeholder="Habit name" />
  <button type="submit">Add</button>
</form>
<ul>
  {#each Array.from($habits.values()) as habit}
    <li class="habit">
      <a href="/{habit.id}"><h3>{habit.name}</h3></a>
      <p>How many times: {habit.instances.length}</p>
      <button on:click={() => doHabit(habit.id)}>+</button>
    </li>
  {/each}
</ul>
