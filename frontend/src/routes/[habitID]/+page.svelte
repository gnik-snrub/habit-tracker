<script lang="ts">
  import { habits } from "../../stores/habits"
  export let data
  $: id = data.id
  $: habit = $habits.get(id)
</script>

<h1>{habit.name}</h1>
<ul>
  {#each habit.instances as instance}
    <li>{instance.date}</li>
  {/each}
</ul>
