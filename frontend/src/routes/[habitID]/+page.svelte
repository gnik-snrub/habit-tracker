<script lang="ts">
  import { habits } from "../../stores/habits"
  import { userData } from "../../stores/userData";
  import { goals } from "../../stores/goals";
  import { token } from "../../stores/token"
  import { goto } from "$app/navigation"

  import Notes from "$lib/HabitModules/Notes.svelte"
  import History from "$lib/HabitModules/History.svelte";
  import Button from "$lib/Button.svelte";
  import ModuleWrapper from "../../lib/ModuleWrapper.svelte";
  import CalendarHeatmap from "../../lib/HabitModules/CalendarHeatmap.svelte";
  import GoalShowcaseSelector from "../../lib/HabitModules/GoalShowcaseSelector.svelte";
  import GoalShowcase from "../../lib/HabitModules/GoalShowcase.svelte";
  import GoalEditor from "../../lib/HabitModules/GoalEditor.svelte";

  import Error from "../../lib/HabitModules/Error.svelte";
    import DailyConsistency from "../../lib/HabitModules/DailyConsistency.svelte";
  export let data: { id: string }

  $: habit = $habits.get(data.id) ? $habits.get(data.id) : { name: 'Habit not found', instances: [] }

  async function deleteHabit(): Promise<void> {
    const body = new URLSearchParams()
    body.append('habitID', data.id)

    const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/habits`, {
      method: 'DELETE',
      body,
      headers: {
        Authorization: 'Bearer ' + $token
      }
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
      body: data,
      headers: {
        Authorization: 'Bearer ' + $token
      }
    })

    const { updatedHabitID } = await updateResponse.json()
    console.log('Updated habit: ', updatedHabitID)

    updateHabitStore()
  }

  async function doHabit(id: string): Promise<void> {
    const updatedHabit: Habit = $habits.get(id)
    updatedHabit.instances.push(new Date())
    await updateHabit(updatedHabit)
  }

  async function updateHabitStore(): Promise<void> {
    const habitRetrieveResponse = await fetch(`${import.meta.env.VITE_API_DOMAIN}/habits/${$userData}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + $token
      }
    })
    const updatedHabits = await habitRetrieveResponse.json()

    const temp: Map<string, Habit> = new Map()
    updatedHabits.forEach((habit: Habit) => {
      temp.set(habit._id, habit)
    })
    habits.set(temp)
  }

  function getModule(module: string, layoutIndex?: number): any {
    switch (true) {
      case module === 'Notes':
        return {componentType: Notes, props: { habit, updateHabitStore }}
      case module === 'History':
        return {componentType: History, props: {habit}}
      case module === 'CalendarHeatmap':
        return {componentType: CalendarHeatmap, props: {habit}}
      case module === 'GoalEditor':
        return {componentType: GoalEditor, props: {habit}}
      case module === 'GoalShowcaseSelector':
        return {componentType: GoalShowcaseSelector, props: {habit, updateHabit, layoutIndex}}
      case /^GoalShowcase/.test(module):
        return {componentType: GoalShowcase, props: {habit, goal: module.split(' ')[1]}}
      case module === 'DailyConsistency':
        return { componentType: DailyConsistency, props: { habit } }
      default:
        return {componentType: Error, props: {}}
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
      body: data,
      headers: {
        Authorization: 'Bearer ' + $token
      }

    })

    const { newGoalID } = await addGoalResponse.json()
    console.log('Added new goal: ', newGoalID)

    event.target[0].placeholder = 'New Goal'
    goalToggle = false

    const goalRetriveResponse = await fetch(`${import.meta.env.VITE_API_DOMAIN}/goals/${$userData}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + $token
      }
    })
    const fetchedGoals = await goalRetriveResponse.json()

    const tempGoals: Map<string, Goal[]> = new Map()
    fetchedGoals.forEach((goal: Goal) => {
      if (tempGoals.has(goal.habit)) {
        tempGoals.get(goal.habit).push(goal)
      } else {
        tempGoals.set(goal.habit, [goal])
      }
    })
    goals.set(tempGoals)
  }

  async function reorder(index: number, newIndex: number): Promise<void> {
    const a = habit.layout[index]
    const b = habit.layout[newIndex]
    habit.layout[index] = b
    habit.layout[newIndex] = a

    await updateHabit(habit)
  }

  let addModuleToggle = false

  async function addModule(event: Event): Promise<void> {
    const selectedModule = event.target[0].selectedOptions[0].value
    if (!selectedModule) {
      return
    }
    habit.layout.push(selectedModule)
    addModuleToggle = false
    await updateHabit(habit)
  }

  async function deleteModule(id: number): Promise<void> {
    habit.layout.splice(id, 1)
    await updateHabit(habit)
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
      {#if !addModuleToggle}
        <Button --colorOne="var(--dark-text-color)" --colorTwo="var(--dark-bg-color)"
          data={{ func: () => {console.log(habit.layout); addModuleToggle = true} }}>
          Add Module
        </Button>
      {:else}
        <Button --colorOne="var(--dark-text-color)" --colorTwo="var(--dark-bg-color)"
          data={{ func: () => {addModuleToggle = false} }}>
          Cancel
        </Button>
        <form on:submit|preventDefault={addModule}>
          <select name="module" id="module">
            <option value="" disabled selected>Select Module</option>
            <option value="Notes">Notes</option>
            <option value="History">History</option>
            <option value="GoalEditor">Goal Editor</option>
            <option value="CalendarHeatmap">Calendar</option>
            <option value="GoalShowcaseSelector">Goal Showcase</option>
            <option value="DailyConsistency">Consistency Tracker</option>
          </select>
          <Button --colorOne="var(--dark-text-color)" --colorTwo="var(--dark-bg-color)"
            data={{ func: () => {} }}>
            Add
          </Button>
        </form>
      {/if}
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
    </div>
  </div>
  <div id="modules">
    {#each habit.layout as component, i}
      {#if component}
        <ModuleWrapper {habit} index={i} {reorder} {deleteModule}>
          <svelte:component this={getModule(component).componentType} props={getModule(component, i).props}/>
        </ModuleWrapper>
      {/if}
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
    background-color: var(--dark-bg-shadow-color);
    border-bottom: 3px solid var(--accent-color);
    padding-bottom: 1em;
    position: sticky;
    top: 0;
    z-index: 10;
    & > * {
      margin-left: 2em;
    }
  }
  #headerButtons {
    display: flex;
    align-items: center;
    height: 2em;
  }
  h1 {
    margin: 1em;
  }
  input {
    padding: 0.5em;
    border: 1px solid var(--accent-color);
    background-color: var(--dark-bg-shadow-color);
    color: var(--dark-text-color);
    &:focus {
      outline: none;
    }
  }
  select {
    padding: 0.5em;
    border: 1px solid var(--accent-color);
    background-color: var(--dark-bg-shadow-color);
    color: var(--dark-text-color);
    &:focus {
      outline: none;
    }
  }
</style>
