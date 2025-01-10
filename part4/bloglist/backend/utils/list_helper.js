const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return undefined
  }
  const favouriteBlog = blogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current)
  delete favouriteBlog._id
  delete favouriteBlog.url
  delete favouriteBlog.__v
  return favouriteBlog
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return undefined
  }

  const authors = blogs.map(blog => blog.author)

  const author = _.chain(authors).countBy().entries().maxBy(_.last).thru(_.head).value()

  let count = 0

  blogs.forEach(blog => {
    if (blog.author === author) {
      count++
    }
  })

  return {
    author,
    blogs: count,
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return undefined
  }

  const authors = blogs.map(blog => blog.author)

  const author = _.chain(authors).countBy().entries().maxBy(_.last).thru(_.head).value()

  let likes = 0

  blogs.forEach(blog => {
    if (blog.author === author) {
      likes += blog.likes
    }
  })

  return {
    author,
    likes,
  }
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}