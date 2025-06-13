import { useState } from 'react'

const Blog = ({ blog, handleLike }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title}
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>
      {showDetails
        ? (
          <div>
            <div>Title: {blog.title}</div>
            <div>URL: {blog.url}</div>
            <div>
              Likes: {blog.likes} <button onClick={() => handleLike(blog)}>like</button>
            </div>
            <div>Author: {blog.author}</div>
          </div>
        )
        : null
      }
    </div>
  )
}
// commit 5.9: Blog List Frontend, step 9

export default Blog
