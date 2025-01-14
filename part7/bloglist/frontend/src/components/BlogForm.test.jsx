import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

describe('<BlogForm />', () => {
  test('the form calls the event handler it received as props with the right details when a new blog is created', async () => {
    const blog = {
      title: 'Title',
      author: 'Author',
      url: 'http://localhost.es',
      likes: 1,
      user: {
        id: '1'
      }
    }

    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlog} />)

    const titleInput = screen.getByPlaceholderText('write title here')
    const authorInput = screen.getByPlaceholderText('write author here')
    const urlInput = screen.getByPlaceholderText('write url here')
    const sendButton = screen.getByText('create')

    await user.type(titleInput, blog.title)
    await user.type(authorInput, blog.author)
    await user.type(urlInput, blog.url)
    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe(blog.title)
    expect(createBlog.mock.calls[0][0].author).toBe(blog.author)
    expect(createBlog.mock.calls[0][0].url).toBe(blog.url)

  })
})
