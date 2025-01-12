import { useState, useEffect, useRef } from 'react'
import Notification from './components/Notification'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Toggable'
import loginService from './services/login'
import blogService from './services/blogs'

const App = () => {
  const blogFormRef = useRef()

  const [blogs, setBlogs] = useState([])
  const [refreshBlog, setRefreshBlog] = useState(false)
  const [newBlog, setNewBlog] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setSuccessMessage(`a new blog ${blogObject.title} by ${blogObject.author} added!`)
        setRefreshBlog(!refreshBlog)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      })
  }

  const addLikes = async (id, blogObject) => {
    await blogService.update(id, blogObject)
    setRefreshBlog(!refreshBlog)
  }

  const removeBlog = async id => {
    await blogService.remove(id)
    setRefreshBlog(!refreshBlog)
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    )
  }, [refreshBlog])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          id='username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          id='password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit" id='login-button'>login</button>
    </form>
  )

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification message={successMessage} type={true} />
        <Notification message={errorMessage} type={false} />
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={successMessage} type={true} />
      <Notification message={errorMessage} type={false} />
      <p>{user.name} logged-in</p>
      <button onClick={handleLogout} id='logout'>logout</button>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} addLikes={addLikes} removeBlog={removeBlog} isOwner={blog.user === user.id} />
      )}
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
    </div>
  )
}

export default App


