import { useState } from "react"

const Blog = ({ blog, addLikes, removeBlog, isOwner }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = () => {
    console.log('like')
    const updateBlog = {
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    addLikes(blog.id, updateBlog)
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      removeBlog(blog.id)
    }
  }

  return (

    <div style={blogStyle}>
      <div style={hideWhenVisible} className="hideWhenVisible">
        {blog.title} {blog.author}
        <button onClick={toggleVisibility} id="view">view</button>
      </div>
      <div style={showWhenVisible} className="showWhenVisible">
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>hide</button>
        <p>{blog.url}</p>
        <p>likes {blog.likes}  <button onClick={handleLike} id="like">like</button></p>
        <p>{blog.author}</p>
        {isOwner && <button onClick={handleDelete} id="remove">remove</button>}
      </div>
    </div>
  )
}

export default Blog