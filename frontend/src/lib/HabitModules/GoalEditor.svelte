<script lang="ts">
  import { userData } from "../../stores/userData";
  import { goals as goalsData } from "../../stores/goals"
    import Button from "../Button.svelte";

  export let props: {habit: Habit}
  $: habit = props.habit

  $: goals = $goalsData.get(habit._id)
  let selectedGoal: Goal = null

  function setGoal(event: Event): void {
    const goalID = event.target[0].value
    if (!goalID) {
      return
    }
    selectedGoal = goals[goalID]
  }

  function formatDate(date: string): string {
    let dateObj: Date
    if (!date) {
      dateObj = new Date()
    } else {
      dateObj = new Date(date)
    }
    const offset = dateObj.getTimezoneOffset()
    const yourDate = new Date(dateObj.getTime() - (offset * 60 * 1000))
    return yourDate.toISOString().split('T')[0]
  }
  
  async function updateGoal(event: Event): void {
    const data = new URLSearchParams()
    if (event.target[0].checked) {
      data.append('startDate', event.target[1].value)
    }
    if (event.target[2].checked) {
      data.append('endDate', event.target[3].value)
    }
    if (event.target[4].checked) {
      data.append('goalTarget', event.target[5].value)
    }
    if (event.target[6].checked) {
      data.append('timeframe', event.target[7].value)
      data.append('amount', event.target[8].value)
    }
    if (event.target[9].checked) {
      data.append('completed', true)
    }
    data.append('goalID', selectedGoal._id)

    const addGoalResponse = await fetch(`${import.meta.env.VITE_API_DOMAIN}/goals`, {
      method: 'PUT',
      body: data
    })

    const { updatedGoalID } = await addGoalResponse.json()
    console.log('Updated goal', updatedGoalID)

    const goalRetriveResponse = await fetch(`${import.meta.env.VITE_API_DOMAIN}/goals/${$userData}`)
    const fetchedGoals = await goalRetriveResponse.json()

    const tempGoals: Map<string, Goal[]> = new Map()
    fetchedGoals.forEach((goal: Goal) => {
      if (tempGoals.has(goal.habit)) {
        tempGoals.get(goal.habit).push(goal)
      } else {
        tempGoals.set(goal.habit, [goal])
      }
    })
    goalsData.set(tempGoals)
    console.log('Refreshed goals')
  }
</script>

<h3>Editor</h3>
{#if !selectedGoal}
  <form on:submit|preventDefault={setGoal}>
    <select name="goal" id="goalSelect">
      <option value="" disabled selected>Select Goal</option>
      {#each goals as goal, i}
        <option value={i}>{goal.name}</option>
      {/each}
    </select>
    <Button --colorOne="var(--dark-text-color)" --colorTwo="var(--dark-bg-shadow-color)">Confirm</Button>
  </form>
{:else}
  <div class="detailsArea">
    <section id="goal">
      <h4>{selectedGoal.name}</h4>
      <p>Created on:</p>
      <p>{new Date(selectedGoal.creationDate).toLocaleString()}</p>
      <Button --colorOne="var(--dark-text-color)" --colorTwo="var(--dark-bg-shadow-color)" data={{ func: () => {selectedGoal = null}}}>Change Goal</Button>
    </section>
    <form id="goalForm" on:submit|preventDefault={updateGoal}>
      <section class="goalParam">
        <h5>Start Date:</h5>
        <div class="toggle">
          <label for="startExists"></label>
          <input type="checkbox" id="startExists" checked={selectedGoal.startDate} />
        </div>
        <input type="date" id="start" value={formatDate(selectedGoal.startDate)} />
      </section>

      <section class="goalParam">
        <h5>End Date:</h5>
        <div class="toggle">
          <label for="startExists"></label>
          <input type="checkbox" id="endExists" checked={selectedGoal.endDate} />
        </div>
        <input type="date" id="end" value={formatDate(selectedGoal.endDate)} />
      </section>

      <section class="goalParam">
        <h5>Goal uses overall target:</h5>
        <div class="toggle">
          <label for="targetExists"></label>
          <input type="checkbox" id="targetExists" checked={selectedGoal.goalTarget} />
        </div>
        <input type="number" id="target" placeholder="Target Total Amount" value={selectedGoal.goalTarget}>
      </section>
  
      <section class="goalParam">
        <h5>Goal uses a frequency:</h5>
        <div class="toggle">
          <label for="frequencyExists"></label>
          <input type="checkbox" id="frequencyExists" checked={selectedGoal.hasOwnProperty('goalFrequency')}/>
        </div>
        <div class="options">
          <select name="timeframe" id="timeframe" value={selectedGoal?.goalFrequency?.timeframe || ''}>
            <option value="" selected disabled>How Often</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
          <input type="number" id="amount" placeholder="Amount per" value={selectedGoal?.goalFrequency?.amount || null}>
        </div>
      </section>

      <section class="goalParam">
        <h5>Goal can be completed:</h5>
        <div class="toggle">
          <label for="completed"></label>
          <input type="checkbox" id="completed" checked={Object.hasOwn(selectedGoal, 'goalCompleted')}>
        </div>
      </section>
      <Button --colorOne="var(--dark-text-color)" --colorTwo="var(--dark-bg-shadow-color)">Confirm</Button>
    </form>
  </div>
{/if}

<style>
  select, input {
    padding: 0.5em;
    border: 1px solid var(--accent-color);
    background-color: var(--dark-bg-shadow-color);
    color: var(--dark-text-color);
    &:focus {
      outline: none;
    }
  }
  .goalParam {
    width: 100%;
    display: grid;
    grid-template-columns: 30% auto auto;
    align-items: center;
    justify-content: start;
    border-left: 1px solid var(--accent-color);
    margin-left: 2em;
    & > h5 {
      margin: 0;
      justify-self: right;
      margin-right: 0.5em;
    }
  }
  .toggle {
    margin-right: 1em;
  }
  .detailsArea {
    width: 100%;
    display: grid;
    grid-template-columns: 12em auto;
    padding: 0;
    align-items: center;
  }
  #goal {
    width: 100%;
    display: grid;
    place-items: center;
    grid-gap: 0.5em;
    & > * {
      margin: 0;
      padding: 0;
    }
    & > h4 {
      font-size: 1.2em;
    }
  }
  #goalForm {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    & > * {
      margin: 0;
      padding: 0;
    }
  }
</style>
