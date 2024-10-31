<script lang="ts">
    import Button from "../../lib/Button.svelte";

  let registerToggle: boolean = false
  let usernameInput: string
  let passwordInput: string

  async function handleSubmit(): Promise<void> {
    if (registerToggle) {
      await register()
    } else {
      await login()
    }
  }

  let errors = []

  async function register(): Promise<void> {
  }

  async function login(): Promise<void> {
    
  }
</script>

<main>
  <form on:submit|preventDefault={handleSubmit}>
    <h1>{registerToggle ? "Register" : "Login"}</h1>
    <input type="text" placeholder="Username" bind:value={usernameInput}/>
    <input type="password" placeholder="Password" bind:value={passwordInput}/>
    <Button --colorOne="var(--dark-text-color)" --colorTwo="var(--dark-bg-shadow-color)">{registerToggle ? "Register" : "Login"}</Button>
  </form>
  <Button --colorOne="var(--dark-text-color)" --colorTwo="var(--dark-bg-shadow-color)"
    data={{ func: () => {registerToggle = !registerToggle}}}>{registerToggle ? "Login" : "Register"}</Button>
  <ul>
    {#each errors as error}
      <li>{error}</li>
    {/each}
  </ul>
</main>
