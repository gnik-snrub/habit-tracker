<script lang="ts">
  import { habits } from "../../stores/habits"
  import { userData } from "../../stores/userData";
  import { goto } from "$app/navigation"

  import Notes from "$lib/HabitModules/Notes.svelte"
  import History from "$lib/HabitModules/History.svelte";
  import Button from "$lib/Button.svelte";
  import ModuleWrapper from "../../lib/ModuleWrapper.svelte";
  import Goals from "../../lib/HabitModules/Goals.svelte";

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

  async function updateHabit(updatedHabit: Habit): Promise<void> {
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

  async function doHabit(id: string): Promise<void> {
    const updatedHabit: Habit = $habits.get(id)
    updatedHabit.instances.push(new Date())
    updateHabit(updatedHabit)
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
      case 'Goals':
        return Goals
    }
  }

  let confirmDelete = false
  let goalToggle = false

  async function createNewGoal(event: Event): Promise<void> {
    const name = event.target[0].value
    if (name === '') return
    event.target[0].value = ''
    event.target[0].placeholder = 'Saving...'

    const data = new URLSearchParams()
    data.append('name', name)
    data.append('user', $userData)
    data.append('habitID', habit._id)

    const addGoalResponse = await fetch(`${import.meta.env.VITE_API_DOMAIN}/goals`, {
      method: 'POST',
      body: data
    })

    const { newGoalID } = await addGoalResponse.json()
    console.log('Added new goal: ', newGoalID)

    event.target[0].placeholder = 'New Goal'
  }

  async function reorder(index: number, newIndex: number): Promise<void> {
    const a = habit.layout[index]
    const b = habit.layout[newIndex]
    habit.layout[index] = b
    habit.layout[newIndex] = a

    updateHabit(habit)
  }
</script>

<section>
  <div id="habitHeader">
    <h1>{habit.name}</h1>
    <div id="headerButtons">
      <Button --colorOne="var(--dark-text-color)" --colorTwo="var(--dark-bg-color)"
        data={{ func: () => {doHabit(data.id)} }}>
        Check in
      </Button>
      {#if !goalToggle}
        <Button --colorOne="var(--dark-text-color)" --colorTwo="var(--dark-bg-color)"
          data={{ func: () => {goalToggle = true} }}>
          Set a Goal
        </Button>
      {:else}
        <Button --colorOne="var(--dark-text-color)" --colorTwo="var(--dark-bg-color)"
          data={{ func: () => {goalToggle = false} }}>
          Cancel
        </Button>
        <form on:submit|preventDefault={createNewGoal}>
          <input type="text" placeholder="New Goal"/>
          <Button --colorOne="var(--dark-text-color)" --colorTwo="var(--dark-bg-color)"
            data={{ func: () => {} }}>
            Create
          </Button>
        </form>
      {/if}
    </div>
  </div>
  <div id="modules">
    {#each habit.layout as component, i}
      <ModuleWrapper {habit} index={i} reorder={reorder}>
        <svelte:component this={getModule(component)} {habit} {updateHabitStore}/>
      </ModuleWrapper>
    {/each}
  </div>
  <div id="deleteButtonArea">
    {#if !confirmDelete}
      <Button --colorOne="var(--dark-text-color)" --colorTwo="var(--dark-bg-color)"
        data={{ func: () => {confirmDelete = true} }}>
        Delete Habit
      </Button>
    {:else}
      <Button --colorOne="var(--dark-text-color)" --colorTwo="var(--dark-bg-color)"
        data={{ func: () => {confirmDelete = false} }}>
        Cancel
      </Button>
      <Button --colorOne="var(--dark-text-color)" --colorTwo="var(--dark-bg-color)"
        data={{ func: () => {deleteHabit()} }}>
        Confirm deletion
      </Button>
    {/if}
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
  #habitHeader {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    width: 100%;
    margin-bottom: 1em;
    & > * {
      margin-left: 2em;
    }
  }
  #headerButtons {
    display: flex;
    align-items: center;
    height: 2em;
  }
  #deleteButtonArea {
    display: flex;
    width: 100%;
    justify-content: center;
    margin: 2em 0;
  }
  h1 {
    margin: 1em;
  }
  input {
    padding: 0.9em 0.5em;
    border: 1px solid var(--accent-color);
    background-color: var(--dark-bg-shadow-color);
    color: var(--dark-text-color);
    &:focus {
      outline: none;
    }
  }

</style>
