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
    const data = new URLSearchParams()
    data.append('username', usernameInput)
    data.append('password', passwordInput)

    const registerResponse = await fetch(`${import.meta.env.VITE_API_DOMAIN}/register`, {
      method: 'POST',
      body: data
    })

    const { registeredUsername, foundErrors } = await registerResponse.json()

    if (foundErrors) {
      errors = [...foundErrors]
    } else {
      console.log('Registered user: ', registeredUsername)
      usernameInput = ''
      passwordInput = ''
    }
  }

  async function login(): Promise<void> {
    const data = new URLSearchParams()
    data.append('username', usernameInput)
    data.append('password', passwordInput)

    const loginResponse = await fetch(`${import.meta.env.VITE_API_DOMAIN}/login`, {
      method: 'POST',
      body: data
    })

    const { token, user, foundErrors } = await loginResponse.json()

    if (foundErrors) {
      errors = [foundErrors]
    } else {
      console.log('Logged in user: ', user.username)
      usernameInput = ''
      passwordInput = ''
    }

    $userData = user._id
    $token = token
    goto('/')
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

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    width: 100%;
  }
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 2em 0;
    background-color: var(--dark-bg-shadow-color);
    padding: 3em 6em 4em 6em;
    border-radius: 15px;
    box-shadow: inset 0 0 10px 5px var(--accent-color);
    outline: var(--accent-color) solid 7px;
    outline-offset: -50px;
  }
  input {
    padding: 0.5em;
    margin-bottom: 1em;
    border: 1px solid var(--accent-color);
    background-color: var(--dark-bg-shadow-color);
    color: var(--dark-text-color);
    transition: 300ms;
    outline: var(--accent-color) solid 0px;
    &:focus {
      outline: var(--accent-color) solid 1px;
      outline-offset: 2px;
      background-color: var(--dark-bg-color);
    }
  }
</style>
