<script lang="ts">
  import { habits } from "../../stores/habits"
  import { userData } from "../../stores/userData";
  import { goto } from "$app/navigation"
  export let data: { id: string }

  $: habit = $habits.get(data.id) ? $habits.get(data.id) : { name: 'Habit not found', instances: [] }

  async function deleteHabit(): Promise<void> {
    const body = new URLSearchParams()
    body.append('habitID', data.id)

    const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/habits`, {
      method: 'DELETE',
      body
    })

    const { deletedHabitID } = await response.json()
    console.log('Deleted habit: ', deletedHabitID)

    updateHabitStore()
    goto('/')
  }

  async function doHabit(id: string): Promise<void> {
    const updatedHabit: Habit = $habits.get(id)
    updatedHabit.instances.push(new Date())

    const data = new URLSearchParams()
    data.append('habitID', updatedHabit._id)
    data.append('user', $userData)
    data.append('name', updatedHabit.name)
    data.append('instances', updatedHabit.instances.toString())
    data.append('notes', updatedHabit.notes)

    const updateResponse = await fetch(`${import.meta.env.VITE_API_DOMAIN}/habits`, {
      method: 'PUT',
      body: data
    })

    const { updatedHabitID } = await updateResponse.json()
    console.log('Updated habit: ', updatedHabitID)

    updateHabitStore()
  }

  async function saveNotes(e: SubmitEvent): Promise<void> {
    const notes = (e.target as HTMLFormElement).notes.value
    const updatedHabit: Habit = $habits.get(data.id)
    updatedHabit.notes = notes

    const body = new URLSearchParams()
    body.append('habitID', updatedHabit._id)
    body.append('user', $userData)
    body.append('name', updatedHabit.name)
    body.append('instances', updatedHabit.instances.toString())
    body.append('notes', updatedHabit.notes)

    const updateResponse = await fetch(`${import.meta.env.VITE_API_DOMAIN}/habits`, {
      method: 'PUT',
      body
    })

    const { updatedHabitID } = await updateResponse.json()
    console.log('Updated habit: ', updatedHabitID)

    updateHabitStore()
  }

  async function updateHabitStore(): Promise<void> {
    const habitRetrieveResponse = await fetch(`${import.meta.env.VITE_API_DOMAIN}/habits/${$userData}`)
    const updatedHabits = await habitRetrieveResponse.json()

    const temp: Map<string, Habit> = new Map()
    updatedHabits.forEach((habit: Habit) => {
      temp.set(habit._id, habit)
    })
    habits.set(temp)
  }
</script>

<h1>{habit.name}</h1>
<ul>
  <button on:click={() => doHabit(data.id)}>I did it!</button>
  {#each habit.instances.sort((a, b) => new Date(b).getTime() - new Date(a).getTime()) as instance}
    <li>{new Date(instance).toLocaleString()}</li>
  {/each}
</ul>
<form on:submit|preventDefault={saveNotes}>
  <textarea name="notes" id="" cols="30" rows="10" value={habit.notes}></textarea>
  <button>Save</button>
</form>
<button on:click={deleteHabit}>Delete Habit</button>
