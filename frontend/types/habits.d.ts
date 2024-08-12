type Instance = {
  habitId: number,
  date: Date,
}

type Habit = {
  id: number,
  name: string,
  instances: Instance[],
}

export type {
  Habit
}
