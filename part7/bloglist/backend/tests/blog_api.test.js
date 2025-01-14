const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')

const User = require('../models/user')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('password', 10)
  const user = new User({
    username: 'username',
    name: 'name',
    blogs: [],
    passwordHash
  })

  await user.save()
}, 100000)

beforeEach(async () => {
  const users = await User.find({})
  const user = users[0]

  await Blog.deleteMany({})
  // await Blog.insertMany(helper.initialBlogs)
  const blogObjects = helper.initialBlogs
    .map(blog => new Blog({
      title: blog.title,
      author: blog.author,
      url: blog.url,
      user: user._id,
      likes: blog.likes ? blog.likes : 0
    }))

  const promiseArray = blogObjects.map(blog => {
    blog.save()
    user.blogs = user.blogs.concat(blog._id)
  })
  await Promise.all(promiseArray)
  await user.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('correct number of blogs are returned', async () => {
  const blogs = await helper.blogsInDb()

  assert.strictEqual(blogs.length, helper.initialBlogs.length)
})

test('the unique identifier property of the blog posts is named id', async () => {
  const blogs = await helper.blogsInDb()

  blogs.forEach(blog => {
    assert.ok(blog.id)
    assert.strictEqual(blog._id, undefined)
  })
})

test('making an HTTP POST request to the /api/blogs URL successfully creates a new blog post', async () => {
  const user = {
    username: 'username',
    password: 'password',
  }

  const loginUser = await api.post('/api/login').send(user)
  const token = loginUser.body.token

  const blogsStart = await helper.blogsInDb()

  const newBlog = {
    title: 'title5',
    author: 'author5',
    url: 'url5',
    likes: 5,
  }

  await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(201)

  const blogsEnd = await helper.blogsInDb()

  assert.strictEqual(blogsStart.length + 1, blogsEnd.length)
  const lastBlog = blogsEnd[blogsEnd.length - 1]
  delete lastBlog.id
  assert.deepStrictEqual(newBlog, lastBlog)
})

test('if the likes property is missing from the request, it will default to the value 0', async () => {
  const user = {
    username: 'username',
    password: 'password',
  }

  const loginUser = await api.post('/api/login').send(user)
  const token = loginUser.body.token

  const newBlog = {
    title: 'title5',
    author: 'author5',
    url: 'url5',
  }

  await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(201)

  const blogsEnd = await helper.blogsInDb()

  assert.strictEqual(blogsEnd[blogsEnd.length - 1].likes, 0)
})

test('if the title propertie is missing from the request data, the backend responds to the request with the status code 400 Bad Request', async () => {
  const user = {
    username: 'username',
    password: 'password',
  }

  const loginUser = await api.post('/api/login').send(user)
  const token = loginUser.body.token

  const newBlog = {
    author: 'author5',
    url: 'url5',
    likes: 5,
  }

  await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(400)
})

test('if the title propertie is missing from the request data, the backend responds to the request with the status code 400 Bad Request', async () => {
  const user = {
    username: 'username',
    password: 'password',
  }

  const loginUser = await api.post('/api/login').send(user)
  const token = loginUser.body.token

  const newBlog = {
    title: 'title5',
    author: 'author5',
    likes: 5,
  }

  await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(400)
})

test('deleting a single blog', async () => {
  const user = {
    username: 'username',
    password: 'password',
  }

  const loginUser = await api.post('/api/login').send(user)
  const token = loginUser.body.token

  const blogsStart = await helper.blogsInDb()

  await api.delete(`/api/blogs/${blogsStart[0].id}`).set('Authorization', `Bearer ${token}`).expect(204)

  const blogsEnd = await helper.blogsInDb()

  assert.strictEqual(blogsStart.length - 1, blogsEnd.length)
})

test('updating a single blog', async () => {
  const updateBlog = {
    title: 'title1updated',
    author: 'author1updated',
    url: 'url1updated',
    likes: 100,
  }
  const blogsStart = await helper.blogsInDb()

  await api.put(`/api/blogs/${blogsStart[0].id}`).send(updateBlog).expect(200)

  const blogsEnd = await helper.blogsInDb()

  const blogUpdated = blogsEnd[0]
  delete blogUpdated.id

  assert.deepStrictEqual(blogUpdated, updateBlog)
})

// USERS
describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})