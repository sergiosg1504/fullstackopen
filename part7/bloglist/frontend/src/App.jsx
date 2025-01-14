import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useMatch } from "react-router-dom";
import { initializeBlogs, like, comment } from "./reducers/blogReducer";
import { initializeAllUsers } from "./reducers/userReducer";
import { initializeUser } from "./reducers/authReducer";
import { setNotification } from "./reducers/notificationReducer";
import { Table, } from "react-bootstrap";
import Header from "./components/Header";
import UserList from "./components/UserList";
import LoginForm from "./components/LoginForm";
import Blog from "./components/Blog";
import BlogList from "./components/BlogList";
import BlogForm from "./components/BlogForm";
import Toggable from "./components/Toggable";
import Notification from "./components/Notification";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const users = useSelector((state) => state.users);
  const blogs = useSelector((state) => state.blog);

  const blogFormRef = React.createRef();

  useEffect(() => {
    dispatch(initializeUser());
    dispatch(initializeBlogs());
    dispatch(initializeAllUsers());
  }, [dispatch]);

  const userMatch = useMatch("/users/:id");
  const foundUser = userMatch
    ? users.find((user) => user.id === userMatch.params.id)
    : null;

  const blogMatch = useMatch("/blogs/:id");
  const foundBlog = blogMatch
    ? blogs.find((blog) => blog.id === blogMatch.params.id)
    : null;

  const handleLikes = (blogToLike) => {
    dispatch(like(blogToLike));
    dispatch(
      setNotification(`Blog ${blogToLike.title} successfully updated`, "success", 5)
    );
  };

  const handleComment = (event) => {
    event.preventDefault();
    const commentToAdd = event.target.comment.value;
    event.target.comment.value = "";
    dispatch(comment(foundBlog, commentToAdd));
  };

  const LoginComponent = () => {
    return (
      <>
        <Notification />
        <LoginForm />
      </>
    )
  }

  const UsersComponent = () => {
    return (
      <>
        {user === null ? (
          <div>
            <Notification />
            <LoginForm />
          </div>
        ) : (
          <div>
            <Header />
            <h2>Bloglist</h2>
            <Notification />
            <h2>Users</h2>
            <UserList />
          </div>
        )}
      </>
    )
  }

  const UserComponent = () => {
    return (
      <>
        {user === null ? (
          <div>
            <Notification />
            <LoginForm />
          </div>
        ) : (
          <div>
            <Header />
            <h2>Bloglist</h2>
            <Notification />
            <h3>{user.name}</h3>
            <h4>Added blogs</h4>
            {!foundUser ? null : (
              <Table striped>
                <tbody>
                  {foundUser.blogs.map((blog) => (
                    <Blog key={blog.id} blog={blog} />
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        )}
      </>
    )
  }

  const BlogsComponent = () => {
    return (
      <>
        {user === null ? (
          <div>
            <Notification />
            <LoginForm />
          </div>
        ) : (
          <div>
            <Header />
            <h2>Bloglist</h2>
            <Notification />
            <Toggable buttonLabel="Add new blog" ref={blogFormRef}>
              <BlogForm />
            </Toggable>
            <Table striped>
              <tbody>
                <BlogList />
              </tbody>
            </Table>
          </div>
        )}
      </>
    )
  }

  const BlogComponent = () => {
    return (
      <>
        {user === null ? (
          <div>
            <Notification />
            <LoginForm />
          </div>
        ) : (
          <div>
            <Header />
            <h2>Bloglist</h2>
            <Notification />
            {!foundBlog ? null : (
              <div>
                <h2>{foundBlog.title}</h2>
                <p>{foundBlog.url}</p>
                <p>
                  {foundBlog.likes} likes{" "}
                  <button onClick={() => handleLikes(foundBlog)}>
                    like
                  </button>
                </p>
                <p>added by {foundBlog.author}</p>
                <h3>comments</h3>
                <form onSubmit={handleComment}>
                  <div>
                    <input id="comment" type="text" name="comment" />
                    <button id="comment-button" type="submit">
                      add comment
                    </button>
                  </div>
                </form>
                <ul>
                  {foundBlog.comments.map((comment) => (
                    <li key={comment}>{comment}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </>
    )
  }

  return (
    <div className='container'>
      <Routes>
        <Route path='/' element={<LoginComponent />} />
        <Route path='/users' element={<UsersComponent />} />
        <Route path='/users/:id' element={<UserComponent />} />
        <Route path='/blogs' element={<BlogsComponent />} />
        <Route path='/blogs/:id' element={<BlogComponent />} />
      </Routes>
    </div>
  );
};

export default App;
