<script lang="ts">
  import { userData } from "../../stores/userData";
  import { habits } from "../../stores/habits";

  import Button from "$lib/Button.svelte";

  export let habit: Habit
  export let updateHabitStore: () => Promise<void>

  async function saveNotes(e: SubmitEvent): Promise<void> {
    const notes = (e.target as HTMLFormElement).notes.value
    const updatedHabit: Habit = $habits.get(habit._id)
    updatedHabit.notes = notes

    const body = new URLSearchParams()
    body.append('habitID', updatedHabit._id)
    body.append('user', $userData)
    body.append('name', updatedHabit.name)
    body.append('instances', updatedHabit.instances.toString())
    body.append('notes', updatedHabit.notes)
    body.append('layout', updatedHabit.layout)

    const updateResponse = await fetch(`${import.meta.env.VITE_API_DOMAIN}/habits`, {
      method: 'PUT',
      body
    })

    const { updatedHabitID } = await updateResponse.json()
    console.log('Updated habit: ', updatedHabitID)

    updateHabitStore()
  }

</script>

<section>
  <h3>Notes</h3>
  <form on:submit|preventDefault={saveNotes}>
    <textarea name="notes" id="" cols="30" rows="10" value={habit.notes ? habit.notes : ''}></textarea>
    <Button
      --colorOne="var(--dark-text-color)" --colorTwo="var(--dark-bg-color)"
      data={{ label: 'Save' }}
    />
  </form>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  form {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1em 0;
  }
  textarea {
    width: 80%;
    resize: none;
    border: 1px solid var(--accent-color);
    outline: none;
    padding: 1em;
    margin-bottom: 1em;
    border-radius: 5px;
    background-color: var(--dark-bg-shadow-color);
    color: inherit;
  }
</style>
