const blogsRouter = require('express').Router()
const middleware = require('../utils/middleware')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({})
    response.status(200).json(blogs)
  } catch (error) {
    next(error)
  }
})

blogsRouter.post('/', middleware.tokenExtractor, middleware.userExtractor, async (request, response, next) => {
  const body = request.body
  const user = request.user
  console.log(user)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id
  })

  try {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', middleware.tokenExtractor, middleware.userExtractor, async (request, response, next) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)
  if (user.id !== blog.user.toString()) {
    return response.status(401).json({ error: 'operation invalid, not owner of the blog' })
  }

  try {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.status(200).json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter
