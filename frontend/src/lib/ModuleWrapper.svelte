<script lang="ts">
  import Button from './Button.svelte'
  export let index: number
  export let reorder: (index: number, newIndex: number) => void
  export let habit: Habit
</script>

<section>
  <div class="reorderButtons">
    {#if index - 1 >= 0}
      <Button --colorOne="var(--dark-text-color)" --colorTwo="var(--dark-bg-color)" data={{func: () => {reorder(index, index - 1)}}}>▲</Button>
    {/if}
    {#if index + 1 < habit.layout.length}
      <Button --colorOne="var(--dark-text-color)" --colorTwo="var(--dark-bg-color)" data={{func: () => {reorder(index, index + 1)}}}>▼</Button>
    {/if}
  </div>
  <slot/>
</section>

<style>
  section {
    display: flex;
    width: 100%;
    flex-direction: row;
    align-items: center;
  }
  .reorderButtons {
    display: flex;
    flex-direction: column;
    gap: 1em;
    & button {
      width: 2.5em;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
