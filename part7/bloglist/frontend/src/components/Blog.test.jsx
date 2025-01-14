import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { describe, expect } from 'vitest'

describe('<Blog /> toggle', () => {
  let container
  const blog = {
    title: 'Title',
    author: 'Author',
    url: 'http://localhost.es',
    likes: 1,
    user: {
      id: '1'
    }
  }

  beforeEach(() => {
    container = render(
      <Blog blog={blog} />
    ).container
  })

  test('renders content before clicking view button', () => {
    const div = container.querySelector('.hideWhenVisible')
    expect(div).toHaveTextContent('Title Author')

    const hideDiv = container.querySelector('.showWhenVisible')
    expect(hideDiv).toHaveStyle('display: none')
  })

  test('renders content after clicking view button', () => {
    const div = container.querySelector('.showWhenVisible')
    expect(div).toHaveTextContent('Title Author')
    expect(div).toHaveTextContent('http://localhost.es')
    expect(div).toHaveTextContent('1')
  })
})

describe('<Blog /> like', () => {

  test('clicking like button twice works properly', async () => {
    const blog = {
      title: 'Title',
      author: 'Author',
      url: 'http://localhost.es',
      likes: 1,
      user: {
        id: '1'
      }
    }

    const mockHandler = vi.fn()

    render(
      <Blog blog={blog} addLikes={mockHandler} />
    ).container

    const users = userEvent.setup()

    const button = screen.getByText('likes')
    await users.click(button)
    await users.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})

