<script lang="ts">
  import { userData } from "../../stores/userData";
  import { token } from "../../stores/token";
  import {goals} from "../../stores/goals";
  import {habits} from "../../stores/habits";

  import { goto } from "$app/navigation"
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
    goto('/')
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

    $userData = user
    $token = token
    await fetchData()
    goto('/')
  }

  async function fetchData(): Promise<void> {
    const habitResponse = await fetch(`${import.meta.env.VITE_API_DOMAIN}/habits/${$userData._id}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + $token
      }
    })
    const fetchedHabits = await habitResponse.json()

    const temp: Map<string, Habit> = $habits
    fetchedHabits.forEach((habit) => {
      temp.set(habit._id, habit)
    })
    habits.set(temp)

    const goalResponse = await fetch(`${import.meta.env.VITE_API_DOMAIN}/goals/${$userData._id}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + $token
      }
    })
    const fetchedGoals = await goalResponse.json()

    const tempGoals: Map<string, Goal[]> = new Map()
    fetchedGoals.forEach((goal) => {
      if (tempGoals.has(goal.habit)) {
        tempGoals.get(goal.habit).push(goal)
      } else {
        tempGoals.set(goal.habit, [goal])
      }
    })
    goals.set(tempGoals)
  }

</script>

<main>
  <form on:submit|preventDefault={handleSubmit}>
    <h1>{registerToggle ? "Register" : "Login"}</h1>
    <input type="text" placeholder="Username" bind:value={usernameInput}/>
    <input type="password" placeholder="Password" bind:value={passwordInput}/>
    <Button --colorOne="var(--dark-text-color)" --colorTwo="var(--dark-bg-shadow-color)">{registerToggle ? "Register" : "Login"}</Button>
  </form>
  <p>{registerToggle ? "Already have an account?" : "Don't have an account?"}</p>
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
    height: 80%;
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
    outline: var(--accent-color) solid 7px;
    outline-offset: -20px;
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
