<script lang="ts">
  import { habits } from "../../stores/habits"
  import { userData } from "../../stores/userData";
  import { goto } from "$app/navigation"
  export let data: { id: string }

  $: habit = $habits.get(data.id) ? $habits.get(data.id) : { name: 'Habit not found', instances: [] }

  async function deleteHabit() {
    const body = new URLSearchParams()
    body.append('habitID', data.id)

    const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/habits`, {
      method: 'DELETE',
      body
    })

    const { deletedHabitID } = await response.json()
    console.log('Deleted habit: ', deletedHabitID)

    const updatedHabitsResponse = await fetch(`${import.meta.env.VITE_API_DOMAIN}/habits/${$userData}`)
    const updatedHabits = await updatedHabitsResponse.json()

    const temp: Map<string, Habit> = new Map()
    updatedHabits.forEach((habit) => {
      temp.set(habit._id, habit)
    })
    habits.set(temp)

    goto('/')
  }
</script>

<h1>{habit.name}</h1>
<ul>
  {#each habit.instances.sort((a, b) => new Date(b).getTime() - new Date(a).getTime()) as instance}
    <li>{new Date(instance).toLocaleString()}</li>
  {/each}
</ul>
<button on:click={deleteHabit}>Delete Habit</button>
