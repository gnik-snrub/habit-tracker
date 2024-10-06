<script lang="ts">
  import { userData } from "../../stores/userData";
  import { habits } from "../../stores/habits";

  import Button from "$lib/Button.svelte";

  export let props: {habit: Habit, updateHabitStore: () => Promise<void>}
  $: habit = props.habit

  async function updateHabitStore(): Promise<void> {
    await props.updateHabitStore()
  }

  async function saveNotes(e: SubmitEvent): Promise<void> {
    isSaving = true
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

    saveDone = true
    setTimeout(() => { saveDone = isSaving = false }, 500)
    updateHabitStore()
  }

  let saveDone: boolean, isSaving: boolean = false
</script>

<h3>Notes</h3>
<form on:submit|preventDefault={saveNotes}>
  <textarea name="notes" id="" cols="30" rows="10"
    placeholder="Notes about this habit"
    value={saveDone ? 'Saved!' : isSaving ? 'Saving...' : habit.notes ? habit.notes : ''}
    required />
  <Button --colorOne="var(--dark-text-color)" --colorTwo="var(--dark-bg-color)">
    Save
  </Button>
</form>

<style>
  form {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 1em 0;
  }
  textarea {
    width: 80%;
    resize: none;
    border: none;
    outline: none;
    padding: 1em;
    border-radius: 5px;
    background-color: hsl(from var(--dark-bg-shadow-color) h s calc(l*1.05) );
    color: inherit;
    transition: 0.3s;
  }
  textarea:invalid {
    background-color: var(--dark-bg-color);
  }
  h3 {
    rotate: -90deg;
  }
</style>
