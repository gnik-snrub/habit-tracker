<script lang="ts">
  import { habits } from "../../stores/habits"
  import { userData } from "../../stores/userData";
  import { goto } from "$app/navigation"

  import History from "$lib/HabitModules/History.svelte";
  import Notes from "$lib/HabitModules/Notes.svelte";
  import Button from "$lib/Button.svelte";

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

<section>
  <div>
    <h1>{habit.name}</h1>
    <Button
      --colorOne="var(--dark-text-color)" --colorTwo="var(--dark-bg-color)"
      data={{ label: 'I did it!', func: () => {doHabit(data.id)} }}
    />
  </div>
  <Notes {habit} {updateHabitStore} />
  <History {habit} />
  <Button
    --colorOne="var(--dark-text-color)" --colorTwo="var(--dark-bg-color)"
    data={{ label: 'Delete Habit', func: deleteHabit }}
  />
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0 2em;
    width: 100%;
    & > * {
      background-color: #F0F9FF;
      margin-bottom: 1em;
      width: 100%;
    }
  }
  div {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
  }
  h1 {
    margin: 1em;
  }
</style>
