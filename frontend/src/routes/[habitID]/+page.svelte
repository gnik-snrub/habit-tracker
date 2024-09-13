<script lang="ts">
  import { habits } from "../../stores/habits"
  import { userData } from "../../stores/userData";
  import { goto } from "$app/navigation"

  import Notes from "$lib/HabitModules/Notes.svelte"
  import History from "$lib/HabitModules/History.svelte";
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
    console.log(updatedHabit, habit)

    const data = new URLSearchParams()
    data.append('habitID', updatedHabit._id)
    data.append('user', $userData)
    data.append('name', updatedHabit.name)
    data.append('instances', updatedHabit.instances.toString())
    data.append('notes', updatedHabit.notes)
    data.append('layout', updatedHabit.layout.toString())

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

  function getModule(module: string): any {
    switch (module) {
      case 'Notes':
        return Notes
      case 'History':
        return History
    }
  }

  let confirmDelete = false
</script>

<section>
  <div id="habitHeader">
    <h1>{habit.name}</h1>
    <Button
      --colorOne="var(--dark-text-color)" --colorTwo="var(--dark-bg-color)"
      data={{ label: 'I did it!', func: () => {doHabit(data.id)} }}
    />
    {#if !confirmDelete}
      <Button
        --colorOne="var(--dark-text-color)" --colorTwo="var(--dark-bg-color)"
        data={{ label: 'Delete Habit', func: () => {confirmDelete = true} }}
      />
    {:else}
      <Button
        --colorOne="var(--dark-text-color)" --colorTwo="var(--dark-bg-color)"
        data={{ label: 'Cancel', func: () => {confirmDelete = false} }}
      />
      <Button
        --colorOne="var(--dark-text-color)" --colorTwo="var(--dark-bg-color)"
        data={{ label: 'Delete Habit', func: () => {deleteHabit()} }}
      />
    {/if}
  </div>
  <div id="modules">
    {#each habit.layout as component}
      <svelte:component this={getModule(component)} {habit} {updateHabitStore}/>
    {/each}
  </div>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    border-left: 1px solid var(--accent-color);
    & > #modules > *:nth-child(odd) {
      background-color: var(--dark-bg-shadow-color);
    }
    & > *, #modules > * {
      width: 100%;
    }
  }
  #modules {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  div:not(#modules) {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
  }
  h1 {
    margin: 1em;
  }
</style>
