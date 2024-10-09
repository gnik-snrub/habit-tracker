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
        <Button --colorOne="var(--accent-color)" --colorTwo="var(--dark-bg-shadow-color)" data={{func: () => {reorder(index, index - 1)}}}>▲</Button>
      {/if}
      <Button --colorOne="var(--accent-color)" --colorTwo="var(--dark-bg-shadow-color)" data={{func: () => {toggleDelete = true}}}>X</Button>
      {#if index + 1 < habit.layout.length}
        <Button --colorOne="var(--accent-color)" --colorTwo="var(--dark-bg-shadow-color)" data={{func: () => {reorder(index, index + 1)}}}>▼</Button>
      {/if}
    {:else}
      <Button --colorOne="var(--accent-color)" --colorTwo="var(--dark-bg-shadow-color)" data={{func: () => {toggleDelete = false}}}>⮌</Button>
      <Button --colorOne="var(--accent-color)" --colorTwo="var(--dark-bg-shadow-color)" data={{func: () => {handleDelete()}}}>X</Button>
    {/if}
  </div>
  <div class="moduleContent">
    <slot/>
  </div>
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
  .moduleContent {
    width: 100%;
    margin: 1.5em 0;
    padding: 2em 0;
    outline: 1px solid var(--accent-color);
    background-color: var(--dark-bg-shadow-color);
    display: grid;
    grid-template-columns: 5em 1fr;
    align-items: center;
    justify-content: start;
    & > h3 {
      text-align: center;
      rotate: -90deg;
      width: 100%;
      translate: -50% 0;
      margin-left: 2em;
    }
  }
</style>
