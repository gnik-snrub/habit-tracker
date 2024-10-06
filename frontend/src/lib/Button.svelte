<script lang="ts">
  export let data: {func?: () => void} | undefined = undefined
</script>

<button on:click={data.func ? data.func : () => {}}><slot/></button>

<style>
  button {
    border: 1px solid var(--colorOne);
    color: var(--colorOne);
    background-color: var(--colorTwo);
    height: fit-content;
    padding: 0.3em 1em;
    border-radius: 1em;
    transition: 0.3s;
    margin: 0 1em;
  }
  button:hover, button:focus {
    border: 1px solid var(--colorTwo);
    color: var(--colorTwo);
    background-color: var(--colorOne);
    outline: none;
  }
</style>
