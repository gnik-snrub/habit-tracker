const mongoose = require('mongoose')

const Schema = mongoose.Schema

const HabitSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  instances: { type: [Date], required: true },
})

module.exports = mongoose.model('Habit', HabitSchema)