const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('total likes', () => {
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
  ]

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes([blogs[0]])
    assert.strictEqual(result, 1)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 6)
  })
})
