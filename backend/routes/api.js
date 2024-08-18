const express = require('express')
const router = express.Router()
const apiController = require('../controllers/apiController')

router.get('/habits/:userID', apiController.getHabits)
router.post('/habits', apiController.createHabit)

module.exports = router
