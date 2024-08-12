type Instance = {
  habitId: number,
  date: Date,
}

type Habit = {
  id: string,
  name: string,
  instances: Instance[],
}

type Goal = {
  name: string,
  habitID: string,
  dueDate?: Date,
  goalTotal?: number,
  goalFrequency?: number,
  completed?: boolean
}

export type {
  Habit,
  Goal,
  Instance
}
