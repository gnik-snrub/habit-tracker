<script lang="ts">
  import Button from './Button.svelte'
  export let index: number
  export let reorder: (index: number, newIndex: number) => void
  export let habit: Habit
</script>

<section>
  <div class="reorderButtons">
    {#if index - 1 >= 0}
      <Button --colorOne="var(--dark-text-color)" --colorTwo="var(--dark-bg-color)" data={{func: () => {reorder(index, index - 1)}}}>^</Button>
    {/if}
    {#if index + 1 < habit.layout.length}
      <Button --colorOne="var(--dark-text-color)" --colorTwo="var(--dark-bg-color)" data={{func: () => {reorder(index, index + 1)}}}>v</Button>
    {/if}
  </div>
  <slot/>
</section>

<style>
  section {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
  }
</style>
