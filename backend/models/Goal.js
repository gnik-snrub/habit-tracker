const mongoose = require('mongoose')

const Schema = mongoose.Schema

const GoalSchema = new Schema({
  name: { type: String, required: true },
  habit: { type: Schema.Types.ObjectId, ref: 'Habit', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  creationDate: { type: Date, required: true },
  startDate: { type: Date, required: false },
  endDate: { type: Date, required: false },
  goalTarget: { type: Number, required: false },
  goalFrequency: { type: {
    timeframe: { type: String, enum: ['Daily', 'Weekly', 'Monthly']},
    amount: { type: Number}},
    required: false },
  goalCompleted: { type: Boolean, required: false },
})

module.exports = mongoose.model('Goal', GoalSchema)
