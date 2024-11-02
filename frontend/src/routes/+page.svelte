<script lang="ts">
  import { userData } from "../stores/userData";
  import {goals} from "../stores/goals";
  import {habits} from "../stores/habits";

  function countGoals(): number {
    return Array.from($goals.values()).reduce((a, c) => {return a + c.length}, 0)
  }

  function completedGoals(): number {
    return Array.from($goals.values()).reduce((a, c) => {
      let count = 0
      for (let i = 0; i < c.length; i++) {
        if (c[i].goalCompleted) {
          count++
        }
      }
      return a + count
    }, 0)
  }
</script>

<svelte:head>
  <title>Habit Tracker</title>
</svelte:head>

{#if !$userData}
  <login/>
{:else}
  <main>
    <p>Hi {$userData.username}!</p>
    <p>You have {countGoals()} goals so far, across {$habits.size} habits, with {Array.from($habits.values()).reduce((a, c) => a + c.instances.length, 0)} check ins total.</p>
    <p>So far, you have completed {completedGoals()} of your goals!</p>
  </main>
{/if}

<style>
  main {
    padding: 2em;
    margin: auto auto;
    max-width: 800px;
    max-height: 300px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: var(--dark-bg-shadow-color);
    transition: 300ms;
    outline: var(--accent-color) solid 1px;
    outline-offset: -20px;
    border: 7px solid var(--accent-color);
    &:hover {
      outline: var(--accent-color) solid 7px;
      outline-offset: 20px;
      border: 1px solid var(--accent-color);
    }
    & > * {
      margin: 0.5em 0;
      transition: 300ms;
    }
    & > p {
      font-size: 1.5em;
    }
    & > *:hover {
      color: var(--accent-color);
    }
  }
</style>
