const Habit = require('../models/Habit')
const User = require('../models/User')
const Goal = require('../models/Goal')

exports.getHabits = async(req, res) => {
  const user = await User.findById(req.params.userID)
  if (!user) {
    return res.json({ error: 'User not found' })
  }
  const habits = await Habit.find({ user: user._id }, 'name instances notes layout')
  res.json(habits)
}

exports.createHabit = async(req, res) => {
  if (!req.body) {
    return res.json({ error: 'Missing body' })
  }
  const newHabit = new Habit({
    user: req.body.user,
    name: req.body.name,
    notes: '',
    instances: [],
    layout: ['Notes', 'History'],
  })
  await newHabit.save()
  res.json({ newHabitID: newHabit._id})
}

exports.deleteHabit = async(req, res) => {
  if (!req.body) {
    return res.json({ error: 'Missing body' })
  }
  const habit = await Habit.findByIdAndDelete(req.body.habitID)
  res.json({ deletedHabitID: req.body.habitID })
}

exports.updateHabit = async(req, res) => {
  if (!req.body) {
    return res.json({ error: 'Missing body' })
  }
  const habit = await Habit.findById(req.body.habitID)
  const instances = req.body.instances.split(',').map((v) => new Date(v))
  const layout = req.body.layout.split(',')
  const updatedHabit = new Habit({
    _id: req.body.habitID,
    user: req.body.user || habit.user,
    name: req.body.name || habit.name,
    instances: instances,
    notes: req.body.notes || habit.notes,
    layout: layout,
  })
  await Habit.findByIdAndUpdate(req.body.habitID, updatedHabit)
  res.json({ updatedHabitID: req.body.habitID })
}

exports.getGoals = async(req, res) => {
  const goals = await Goal.find({user: req.params.userID}, 'name habit creationDate startDate endDate goalTarget goalFrequency goalCompleted')
  res.json(goals)
}

exports.createGoal = async(req, res) => {
  if (!req.body) {
    return res.json({ error: 'Missing body' })
  }
  const newGoal = new Goal({
    name: req.body.name,
    habit: req.body.habitID,
    user: req.body.user,
    creationDate: new Date(),
  })
  await newGoal.save()
  res.json({ newGoalID: newGoal._id})
}

exports.deleteGoal = async(req, res) => {
  
}

exports.updateGoal = async(req, res) => {
  if (!req.body) {
    return res.json({ error: 'Missing body' })
  }
  const goal = await Goal.findById(req.body.goalID)
  const updatedGoal = new Goal({
    _id: req.body.goalID,
    name: goal.name,
    habit: goal.habit,
    user: goal.user,
    creationDate: goal.creationDate,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    goalTarget: req.body.goalTarget,
    goalFrequency: {
      timeframe: req.body.timeframe,
      amount: req.body.amount
    }
  })
  if (req.body.completed) {
    updatedGoal.goalCompleted = false
  }
  await Goal.replaceOne({ _id: req.body.goalID }, updatedGoal)
  res.json({ updatedGoalID: req.body.goalID })
}
