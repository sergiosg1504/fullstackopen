const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await User.find({}).populate('blogs', { id: 1, title: 1, author: 1, url: 1 })
    response.status(200).json(blogs)
  } catch (error) {
    next(error)
  }
})

usersRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body

  if (!username || !password) return response.status(400).json({ error: 'Username and password are required.' })
  if (username.length < 3) return response.status(400).json({ error: 'Username must be at least 3 characters.' })
  if (password.length < 3) return response.status(400).json({ error: 'Password must be at least 3 characters.' })

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  try {
    const savedUser = await user.save()
    response.status(201).json(savedUser)

  } catch (error) {
    next(error)
  }

})

module.exports = usersRouter