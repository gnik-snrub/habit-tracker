import { writable } from "svelte/store"

const testUser = import.meta.env.VITE_TEST_USER
export const userData = writable(testUser)
