const Habit = require('../models/Habit')
const User = require('../models/User')

exports.getHabits = async(req, res) => {
  const user = await User.findById(req.params.userID)
  if (!user) {
    return res.json({ error: 'User not found' })
  }
  const habits = await Habit.find({ user: user._id }, 'name instances')
  res.json(habits)
}

exports.createHabit = async(req, res) => {
  if (!req.body) {
    return res.json({ error: 'Missing body' })
  }
  const newHabit = new Habit({
    user: req.body.user,
    name: req.body.name,
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
