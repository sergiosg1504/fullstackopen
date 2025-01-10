const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('most blogs', () => {
  const blogs = [
    {
      _id: 'id1',
      title: 'title1',
      author: 'author1',
      url: 'url1',
      likes: 1,
    },
    {
      _id: 'id2',
      title: 'title2',
      author: 'author2',
      url: 'url2',
      likes: 2,
    },
    {
      _id: 'id3',
      title: 'title3',
      author: 'author3',
      url: 'url3',
      likes: 3,
    },
    {
      _id: 'id3',
      title: 'title3',
      author: 'author1',
      url: 'url4',
      likes: 4,
    },
  ]

  test('of empty list is undefined', () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result, undefined)
  })

  test('when list has only one blog equals the author of that', () => {
    const result = listHelper.mostBlogs([blogs[0]])
    const expected = {
      author: blogs[0].author,
      blogs: 1,
    }
    assert.deepStrictEqual(result, expected)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.mostBlogs(blogs)
    const expected = {
      author: 'author1',
      blogs: 2,
    }
    assert.deepStrictEqual(result, expected)
  })

})
