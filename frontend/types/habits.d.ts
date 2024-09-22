type Instance = {
  date: Date,
}

type Habit = {
  _id: string,
  name: string,
  instances: Instance[],
  notes?: string,
}

declare enum goalTimeframe {
  Daily = "Daily",
  Weekly = "Weekly",
  Monthly = "Monthly",
  Yearly = "Yearly"
}

type Goal = {
  name: string,
  creationDate: Date,
  startDate?: Date,
  endDate?: Date,
  goalTarget?: number,
  goalFrequency?: {timeframe: goalTimeframe, amount: number},
  goalCompleted?: boolean
}

export type {
  Habit,
  Goal,
  Instance
}
