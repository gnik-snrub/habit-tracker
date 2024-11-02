const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
  await Habit.findByIdAndDelete(req.body.habitID)
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
  })
  if (req.body.timeframe && req.body.amount) {
    updatedGoal.goalFrequency = {
      timeframe: req.body.timeframe,
      amount: req.body.amount
    }
  }
  if (req.body.completed) {
    if (req.body.goalCompleted) {
      updatedGoal.goalCompleted = true
    } else {
      updatedGoal.goalCompleted = false
    }
  }
  await Goal.replaceOne({ _id: req.body.goalID }, updatedGoal)
  res.json({ updatedGoalID: req.body.goalID })
}

exports.register = async(req, res) => {
  if (!req.body) {
    return (res.json({ error: 'Missing body' }))    
  }  
  const errors = []

  const username = req.body.username
  const password = req.body.password

  if (!username || !password) {
    errors.push('Missing username or password')
  }
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters')
  }
  if (password.search(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/) < 0) {
    errors.push('Password must contain at least one uppercase letter, one lowercase letter, and one number')
  }
  const user = await User.findOne({ username: req.body.username })
  if (user) {
    errors.push('Username already in use')
  }
  if (errors.length) {
    return res.json({ foundErrors: errors })
  }
  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser = new User({
    username: username,
    password: hashedPassword,
  })
  await newUser.save()
  console.log('Registered new user: ', newUser._id)
  res.json({ id: newUser._id, foundErrors: errors })
}

exports.login = async(req, res) => {
  if (!req.body) {
    return (res.json({ error: 'Missing body' }))    
  }  
  const username = req.body.username
  const password = req.body.password
  const user = await User.findOne({ username: username })
  if (!user) {
    return res.json({ foundErrors: 'User not found, or incorrect password' })
  }
  if (!await bcrypt.compare(password, user.password)) {
    return res.json({ foundErrors: 'User not found, or incorrect password' })
  }
  const token = jwt.sign({ username: user.username, userID: user._id }, process.env.JWT_SECRET)
  res.json({ token: token, user: user,  foundErrors: '' })
}
