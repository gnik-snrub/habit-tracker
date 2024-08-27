type Instance = {
  date: Date,
}

type Habit = {
  _id: string,
  name: string,
  instances: Instance[],
}

type Goal = {
  name: string,
  habitID: string,
  dueDate?: Date,
  goalTarget?: number,
  goalFrequency?: number,
  completed?: boolean
}

export type {
  Habit,
  Goal,
  Instance
}
