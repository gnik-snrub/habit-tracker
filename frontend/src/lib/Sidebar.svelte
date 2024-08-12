<script lang="ts">
  import {v4 as uuid} from 'uuid'

  import { habits } from '../stores/habits'

  function addNewHabit(event: Event): void {
    const name = event.target[0].value
    if (name === '') return

    const id = uuid()
    const temp: Map<number, Habit> = $habits
    temp.set(id, {
      id,
      name,
      instances: []
    })

    habits.set(temp)

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
