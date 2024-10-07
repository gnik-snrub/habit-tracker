<script lang="ts">
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

</script>

<h3>Details</h3>
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
    <h4>{selectedGoal.name}</h4>
    <p>Created on: {new Date(selectedGoal.creationDate).toLocaleString()}</p>
    <form on:submit|preventDefault={() => {}}>
      <section class="goalParam">
        <h5>Start Date</h5>
        <input type="date" id="start" value={formatDate(selectedGoal.startDate)} />
        <div class="toggle">
          <label for="startExists">Toggle: </label>
          <input type="checkbox" id="startExists" />
        </div>
      </section>

      <section class="goalParam">
        <h5>End Date</h5>
        <input type="date" id="end" value={formatDate(selectedGoal.endDate)} />
        <div class="toggle">
          <label for="startExists">Toggle: </label>
          <input type="checkbox" id="endExists" />
        </div>
      </section>

      <section class="goalParam">
        <h5>Goal Target</h5>
        <input type="number" id="target" placeholder="Target Total Amount">
        <div class="toggle">
          <label for="targetExists">Toggle: </label>
          <input type="checkbox" id="targetExists" />
        </div>
      </section>
  
      <section class="goalParam">
        <h5>Goal Frequency</h5>
        <div class="options">
          <select name="timeframe" id="timeframe">
            <option value="" selected disabled>How Often</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
          <input type="number" id="amount" placeholder="Amount">
        </div>
        <div class="toggle">
          <label for="frequencyExists">Toggle: </label>
          <input type="checkbox" id="frequencyExists">
        </div>
      </section>

      <section class="goalParam">
        <h5>Goal Completed</h5>
        <div class="toggle">
          <label for="completed">Toggle: </label>
          <input type="checkbox" id="completed">
        </div>
      </section>
    </form>
    <Button --colorOne="var(--dark-text-color)" --colorTwo="var(--dark-bg-shadow-color)" data={{ func: () => {selectedGoal = null}}}>Change Goal</Button>
  </div>
{/if}

<style>
  h3 {
    rotate: -90deg;
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
