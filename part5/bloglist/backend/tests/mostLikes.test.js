const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('most likes', () => {
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
    const result = listHelper.mostLikes([])
    assert.strictEqual(result, undefined)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.mostLikes([blogs[0]])
    const expected = {
      author: blogs[0].author,
      likes: blogs[0].likes,
    }
    assert.deepStrictEqual(result, expected)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.mostLikes(blogs)
    const expected = {
      author: 'author1',
      likes: 5,
    }
    console.log(result)
    console.log(expected)
    assert.deepStrictEqual(result, expected)
  })

})
