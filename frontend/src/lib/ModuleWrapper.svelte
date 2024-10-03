<script lang="ts">
  import Button from './Button.svelte'
  export let index: number
  export let reorder: (index: number, newIndex: number) => void
  export let habit: Habit
  export let deleteModule: (index: number) => void

  let toggleDelete: boolean = false

  function handleDelete(): void {
    deleteModule(index)
    toggleDelete = false
  }
</script>

<section>
  <div class="reorderButtons">
    {#if !toggleDelete}
      {#if index - 1 >= 0}
        <Button --colorOne="var(--dark-text-color)" --colorTwo="var(--dark-bg-color)" data={{func: () => {reorder(index, index - 1)}}}>▲</Button>
      {/if}
      <Button --colorOne="var(--dark-text-color)" --colorTwo="var(--dark-bg-color)" data={{func: () => {toggleDelete = true}}}>X</Button>
      {#if index + 1 < habit.layout.length}
        <Button --colorOne="var(--dark-text-color)" --colorTwo="var(--dark-bg-color)" data={{func: () => {reorder(index, index + 1)}}}>▼</Button>
      {/if}
    {:else}
      <Button --colorOne="var(--dark-text-color)" --colorTwo="var(--dark-bg-color)" data={{func: () => {toggleDelete = false}}}>Cancel</Button>
      <Button --colorOne="var(--dark-text-color)" --colorTwo="var(--dark-bg-color)" data={{func: () => {handleDelete()}}}>Delete</Button>
    {/if}
  </div>
  <slot/>
</section>

<style>
  section {
    display: grid;
    place-items: center;
    width: 100%;
    grid-template-columns: auto 90%;
  }
  .reorderButtons {
    display: flex;
    flex-direction: column;
    gap: 1em;
    & button {
      width: 4em;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
