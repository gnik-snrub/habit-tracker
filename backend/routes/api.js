const express = require('express')
const router = express.Router()
const apiController = require('../controllers/apiController')

router.get('/habits/:userID', apiController.getHabits)
router.post('/habits', apiController.createHabit)
router.delete('/habits', apiController.deleteHabit)
router.put('/habits', apiController.updateHabit)

router.get('/goals/:habitID', apiController.getGoals)
router.post('/goals', apiController.createGoal)
router.delete('/goals', apiController.deleteGoal)
router.put('/goals', apiController.updateGoal)

module.exports = router
