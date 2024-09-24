import { writable } from "svelte/store";

// Map <habit, Goal[]>
export const goals = writable(new Map())
