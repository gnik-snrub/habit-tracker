const jwt = require('jsonwebtoken')

const express = require('express')
const router = express.Router()

const apiController = require('../controllers/apiController')

function verifyToken(req, res, next) {
  const token = req.headers.authorization.split(' ')[1]
  const payload = jwt.verify(token, process.env.JWT_SECRET)
  if (!payload) {
    return res.status(401).send('Unauthorized request')
  }
  req.userId = payload.subject
  next()
}

router.get('/habits/:userID', verifyToken, apiController.getHabits)
router.post('/habits', verifyToken, apiController.createHabit)
router.delete('/habits', verifyToken, apiController.deleteHabit)
router.put('/habits', verifyToken, apiController.updateHabit)

router.get('/goals/:userID', verifyToken, apiController.getGoals)
router.post('/goals', verifyToken, apiController.createGoal)
router.delete('/goals', verifyToken, apiController.deleteGoal)
router.put('/goals', verifyToken, apiController.updateGoal)

router.post('/register', apiController.register)
router.post('/login', apiController.login)

module.exports = router
