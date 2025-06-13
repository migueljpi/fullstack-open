import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import NotificationMessage from './components/NotificationMessage'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  // const [title, setTitle] = useState('')
  // const [author, setAuthor] = useState('')
  // const [url, setUrl] = useState('')
  const [message, setMessage] = useState({ message: null, type: null })
  const [blogFormVisible, setBlogFormVisible] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setMessage({ message: `A new blog "${returnedBlog.title}" by ${returnedBlog.author} added!`, type: 'success' })
        setTimeout(() => setMessage({ message: null, type: null }), 4000)
        setBlogFormVisible(false)
      })
  }

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
      setMessage({ message: `logged in as ${user.username}`, type: 'success' })
      setTimeout(() => setMessage({ message: null, type: null }), 4000)
    } catch (exception) {
      console.error('Login failed:', exception)
      setMessage({ message: 'Wrong username or password', type: 'error' })
      setTimeout(() => setMessage({ message: null, type: null }), 4000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
    setMessage({ message: 'logged out', type: 'success' })
    setTimeout(() => setMessage({ message: null, type: null }), 4000)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )


  const handleLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      user: blog.user.id || blog.user,
      likes: blog.likes + 1,
    }
    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      setBlogs(blogs.map(b => b.id === blog.id ? returnedBlog : b))
    } catch (error) {
      setMessage({ message: 'Failed to like blog', type: 'error' })
      setTimeout(() => setMessage({ message: null, type: null }), 4000)
    }
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        setMessage({ message: `Deleted "${blog.title}"`, type: 'success' })
        setTimeout(() => setMessage({ message: null, type: null }), 4000)
      } catch (error) {
        setMessage({ message: 'Failed to delete blog', type: 'error' })
        setTimeout(() => setMessage({ message: null, type: null }), 4000)
      }
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <NotificationMessage message={message.message} type={message.type} />
        {loginForm()}
      </div>
    )
  }


  return (
    <div>
      <h2>blogs</h2>
      <NotificationMessage message={message.message} type={message.type} />
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>

      <div style={{ display: blogFormVisible ? 'none' : '' }}>
        <button onClick={() => setBlogFormVisible(true)}>create new blog</button>
      </div>
      <div style={{ display: blogFormVisible ? '' : 'none' }}>
        <BlogForm createBlog={addBlog} />
        <button onClick={() => setBlogFormVisible(false)}>cancel</button>
      </div>

      {blogs
        .slice()
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={handleLike}
            handleDelete={handleDelete}
            user={user}
          />
        )
      }
    </div>
  )
}


export default App
